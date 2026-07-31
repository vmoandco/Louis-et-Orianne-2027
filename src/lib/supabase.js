import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

/** Vrai seulement si les deux variables d'environnement étaient présentes au build. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/**
 * Client complet (auth + écriture), réservé à l'espace admin.
 *
 * À n'importer que depuis un module chargé paresseusement : une importation
 * statique depuis <App> remettrait le SDK dans le bundle initial.
 *
 * Vaut `null` quand la configuration manque. Sinon `createClient` lève une
 * exception dès l'évaluation du module : l'import paresseux de <AdminPage>
 * échouait, et l'onglet Admin affichait une page blanche sans le moindre
 * indice sur la cause réelle — les variables absentes chez l'hébergeur.
 */
export const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
