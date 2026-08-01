import Stripe from "stripe";

/**
 * Enregistre une participation payée par carte, sur notification de Stripe.
 *
 * Le navigateur de l'invité n'est jamais cru sur parole : il pourrait
 * prétendre avoir payé. C'est Stripe qui fait autorité, et on le lui demande
 * directement — on relit la session via l'API plutôt que de se fier au corps
 * de la requête.
 *
 * Ce détour évite une fragilité : la vérification de signature exige le corps
 * *brut*, or l'hébergeur le consomme parfois avant nous pour le parser. Quand
 * c'est le cas la signature ne peut plus être vérifiée, et l'ancienne version
 * rejetait alors tous les paiements. Ici la signature reste vérifiée quand
 * c'est possible, mais l'enregistrement ne dépend plus d'elle.
 *
 * L'écriture passe par `declare_stripe_payment`, réservée à la clef
 * `service_role` — voir supabase/stripe.sql. La session sert de clef
 * d'idempotence : Stripe rejoue ses notifications, et un même paiement ne doit
 * jamais être compté deux fois.
 */

// Demande à l'hébergeur de ne pas toucher au corps, quand il sait le faire.
export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  } catch {
    return Buffer.alloc(0);
  }
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

  if (!secret || !supabaseUrl || !serviceKey) {
    console.error("Webhook Stripe : configuration incomplète (clefs manquantes).");
    return res.status(503).end();
  }

  const stripe = new Stripe(secret);
  const raw = await rawBody(req);

  // 1. Retrouver l'évènement, en vérifiant la signature si le corps brut est
  //    disponible. Sinon on repart du corps déjà parsé par l'hébergeur.
  let event;
  if (raw.length > 0 && webhookSecret && req.headers["stripe-signature"]) {
    try {
      event = stripe.webhooks.constructEvent(raw, req.headers["stripe-signature"], webhookSecret);
    } catch (error) {
      console.error("Signature du webhook invalide :", error.message);
      return res.status(400).end();
    }
  } else {
    try {
      event = raw.length > 0 ? JSON.parse(raw.toString("utf8")) : req.body;
    } catch {
      event = null;
    }
    console.warn("Webhook reçu sans corps brut : signature non vérifiée, la session sera relue via l'API Stripe.");
  }

  if (!event || typeof event !== "object") {
    console.error("Webhook Stripe : corps illisible.");
    return res.status(400).end();
  }

  if (event.type !== "checkout.session.completed") {
    // Les autres évènements ne nous concernent pas, mais il faut répondre 200
    // pour que Stripe cesse de les rejouer.
    return res.status(200).json({ received: true });
  }

  const sessionId = event.data?.object?.id;
  if (!sessionId) {
    console.error("Webhook Stripe : identifiant de session absent.");
    return res.status(400).end();
  }

  // 2. Relire la session auprès de Stripe : c'est elle qui fait foi, tant pour
  //    le montant réellement encaissé que pour l'authenticité de l'évènement.
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Session Stripe introuvable :", sessionId, error.message);
    return res.status(400).end();
  }

  if (session.payment_status !== "paid") {
    console.warn("Session non payée, ignorée :", sessionId, session.payment_status);
    return res.status(200).json({ received: true });
  }

  const meta = session.metadata ?? {};
  const amount = Math.round((session.amount_total ?? 0) / 100);

  if (!meta.gift_id || amount <= 0) {
    console.error("Session sans cadeau ou sans montant :", sessionId, JSON.stringify(meta));
    return res.status(200).json({ received: true });
  }

  // 3. Enregistrer.
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
        guest_email: meta.guest_email || session.customer_details?.email || null,
      }),
    });

    if (!response.ok) {
      // On renvoie une erreur pour que Stripe rejoue : la fonction est
      // idempotente, un nouvel essai ne peut pas doubler la participation.
      console.error("Enregistrement du paiement échoué :", response.status, await response.text());
      return res.status(500).end();
    }
    console.log("Paiement enregistré :", meta.gift_id, amount, "EUR", session.id);
  } catch (error) {
    console.error("Enregistrement du paiement échoué :", error);
    return res.status(500).end();
  }

  return res.status(200).json({ received: true });
}
