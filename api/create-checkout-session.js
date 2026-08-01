import Stripe from "stripe";

/**
 * Ouvre une page de paiement Stripe pour un cadeau.
 *
 * Le montant est recalculé et borné ici, jamais repris tel quel : la requête
 * vient du navigateur, donc rien de ce qu'elle contient n'est digne de
 * confiance. Le cadeau, le nom et le message voyagent dans les métadonnées de
 * la session, que le webhook relit pour alimenter le journal.
 */

// Bornes reprises de `declare_contribution` (voir supabase/declarations.sql).
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 5000;

const clean = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    // Les clefs ne sont pas encore renseignées chez l'hébergeur : le site
    // affiche alors « paiement par carte indisponible » plutôt que de planter.
    return res.status(503).json({ error: "stripe_not_configured" });
  }

  const { giftId, giftName, amount, guestName, guestEmail, message, origin } = req.body ?? {};

  const value = Math.floor(Number(amount));
  if (!Number.isFinite(value) || value < MIN_AMOUNT || value > MAX_AMOUNT) {
    return res.status(400).json({ error: "amount_out_of_range" });
  }
  if (typeof giftId !== "string" || giftId.length === 0 || giftId.length > 20) {
    return res.status(400).json({ error: "unknown_gift" });
  }

  // On ne renvoie l'invité que vers notre propre site, jamais vers une adresse
  // fournie dans la requête : sinon n'importe qui pourrait transformer notre
  // page de paiement en tremplin vers un site tiers.
  const site = process.env.SITE_URL || `https://${req.headers.host}`;
  const back = typeof origin === "string" && origin.startsWith(site) ? origin : site;

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: value * 100,
            product_data: { name: clean(giftName, 120) || giftId },
          },
        },
      ],
      metadata: {
        gift_id: giftId,
        guest_name: clean(guestName, 60),
        guest_email: clean(guestEmail, 120),
        message: clean(message, 500),
      },
      // Évite à l'invité de ressaisir son adresse, et c'est elle qui recevra
      // le reçu Stripe.
      ...(clean(guestEmail, 120) ? { customer_email: clean(guestEmail, 120) } : {}),
      success_url: `${back.split("#")[0]}?paid=1#/gifts`,
      cancel_url: `${back.split("#")[0]}#/gifts`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Création de la session Stripe échouée :", error);
    return res.status(500).json({ error: "stripe_error" });
  }
}
