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

export async function declareContribution(giftId, amount, guestName, method) {
  let response = await callDeclare({
    gift_id: giftId,
    delta: amount,
    guest_name: guestName || null,
    method: method || null,
  });

  // Le prénom et le moyen de paiement sont arrivés après la mise en ligne :
  // tant que `supabase/declarations.sql` n'a pas été joué, la fonction n'accepte
  // que deux arguments et PostgREST répond 404. On réessaie sans le détail
  // plutôt que de perdre la participation de l'invité.
  if (response.status === 404) {
    response = await callDeclare({ gift_id: giftId, delta: amount });
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
