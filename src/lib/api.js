import { SUPABASE_URL, SUPABASE_KEY } from "./env";

const select = (columns) =>
  fetch(`${SUPABASE_URL}/rest/v1/contributions?select=${columns}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

/**
 * Lit les contributions via l'API REST, sans passer par @supabase/supabase-js.
 *
 * Le SDK pèse ~65 ko gzip et ne sert par ailleurs qu'à l'espace admin : l'importer
 * ici obligerait chaque invité à le télécharger pour une simple lecture publique.
 * Le module reste chargé à la demande dans <AdminPage>.
 *
 * La colonne `price` (prix modifiable depuis l'admin) est arrivée après la mise
 * en ligne : tant que `supabase/add-price.sql` n'a pas été joué, PostgREST
 * répond 400. On retombe alors sur les seules colonnes historiques plutôt que
 * de laisser la liste de mariage bloquée sur « Chargement… ».
 */
/**
 * Déclare la participation d'un invité et renvoie le nouveau total du cadeau.
 *
 * Passe par la fonction `declare_contribution` (voir
 * `supabase/declare-contribution.sql`) : la table reste fermée en écriture aux
 * visiteurs, seul cet ajout borné leur est ouvert.
 */
/**
 * Demande au serveur une page de paiement Stripe et renvoie son adresse.
 *
 * Le montant est revalidé côté serveur : ce que le navigateur envoie ici n'est
 * qu'une intention. La participation, elle, n'est enregistrée qu'une fois le
 * paiement confirmé par Stripe, via le webhook.
 */
export async function createCheckoutSession({ giftId, giftName, amount, guestName, guestEmail, message }) {
  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      giftId,
      giftName,
      amount,
      guestName: guestName || "",
      guestEmail: guestEmail || "",
      message: message || "",
      origin: window.location.href,
    }),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error || `HTTP ${response.status}`);
  }
  const { url } = await response.json();
  if (!url) throw new Error("missing_url");
  return url;
}

const callDeclare = (body) =>
  fetch(`${SUPABASE_URL}/rest/v1/rpc/declare_contribution`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

export async function declareContribution(giftId, amount, guestName, method, message, guestEmail) {
  const base = { gift_id: giftId, delta: amount };
  const withName = { ...base, guest_name: guestName || null, method: method || null };

  // Le détail s'est enrichi au fil des migrations SQL. PostgREST répond 404
  // quand la fonction en base n'accepte pas encore tous ces arguments : on
  // retente alors avec moins de détail, plutôt que de perdre la participation
  // de l'invité parce qu'un script n'a pas été joué.
  const attempts = [
    { ...withName, message: message || null, guest_email: guestEmail || null },
    { ...withName, message: message || null },
    withName,
    base,
  ];

  let response;
  for (const body of attempts) {
    response = await callDeclare(body);
    if (response.status !== 404) break;
  }

  if (!response.ok) {
    throw new Error(`Déclaration de participation échouée (HTTP ${response.status})`);
  }
  return Number(await response.json());
}

export async function fetchContributions() {
  let response = await select("id,amount,price");

  if (response.status === 400) {
    response = await select("id,amount");
  }

  if (!response.ok) {
    throw new Error(`Lecture des contributions échouée (HTTP ${response.status})`);
  }
  return response.json();
}
