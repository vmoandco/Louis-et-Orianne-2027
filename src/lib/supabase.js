import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

/**
 * Client complet (auth + écriture), réservé à l'espace admin.
 *
 * À n'importer que depuis un module chargé paresseusement : une importation
 * statique depuis <App> remettrait le SDK dans le bundle initial.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
