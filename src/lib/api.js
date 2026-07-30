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
