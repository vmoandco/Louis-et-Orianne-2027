export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Supabase non configuré : renseignez VITE_SUPABASE_URL et VITE_SUPABASE_KEY dans .env.local"
  );
}
