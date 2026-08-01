import Stripe from "stripe";

/**
 * Enregistre une participation payée par carte, sur notification de Stripe.
 *
 * C'est le seul endroit qui fait foi : le navigateur de l'invité n'est jamais
 * cru sur parole, puisqu'il pourrait prétendre avoir payé. On vérifie donc la
 * signature de Stripe, puis on relit le montant réellement encaissé.
 *
 * L'écriture passe par `declare_stripe_payment`, réservée à la clef
 * `service_role` — voir supabase/stripe.sql. La session Stripe sert de clef
 * d'idempotence : Stripe rejoue ses notifications, et un même paiement ne doit
 * jamais être compté deux fois.
 */

// Stripe signe le corps brut : le laisser être parsé invaliderait la signature.
export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !webhookSecret || !supabaseUrl || !serviceKey) {
    console.error("Webhook Stripe : configuration incomplète.");
    return res.status(503).end();
  }

  let event;
  try {
    const stripe = new Stripe(secret);
    event = stripe.webhooks.constructEvent(
      await rawBody(req),
      req.headers["stripe-signature"],
      webhookSecret
    );
  } catch (error) {
    // Signature absente ou invalide : la requête ne vient pas de Stripe.
    console.error("Signature du webhook invalide :", error.message);
    return res.status(400).end();
  }

  if (event.type !== "checkout.session.completed") {
    // Les autres évènements ne nous concernent pas, mais il faut répondre 200
    // pour que Stripe cesse de les rejouer.
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;
  if (session.payment_status !== "paid") {
    return res.status(200).json({ received: true });
  }

  const meta = session.metadata ?? {};
  // Le montant vient de Stripe, pas des métadonnées : c'est ce qui a été
  // réellement encaissé.
  const amount = Math.round((session.amount_total ?? 0) / 100);

  if (!meta.gift_id || amount <= 0) {
    console.error("Session Stripe sans cadeau ou sans montant :", session.id);
    return res.status(200).json({ received: true });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/declare_stripe_payment`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: session.id,
        gift_id: meta.gift_id,
        delta: amount,
        guest_name: meta.guest_name || session.customer_details?.name || null,
        message: meta.message || null,
      }),
    });

    if (!response.ok) {
      // On renvoie une erreur pour que Stripe rejoue : la fonction est
      // idempotente, un nouvel essai ne peut pas doubler la participation.
      console.error("Enregistrement du paiement échoué :", response.status, await response.text());
      return res.status(500).end();
    }
  } catch (error) {
    console.error("Enregistrement du paiement échoué :", error);
    return res.status(500).end();
  }

  return res.status(200).json({ received: true });
}
