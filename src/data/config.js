// ─── Réglages du mariage ──────────────────────────────────────────────
export const DATE_MARIAGE = new Date("2027-06-19T14:00:00");

// ⚠️ COORDONNÉES FICTIVES — à remplacer par les vraies avant d'annoncer le site.
// Le format est valide (l'IBAN est l'exemple de documentation de la Banque de
// France) pour que l'affichage soit réaliste, mais aucun de ces comptes
// n'existe : un virement envoyé ici n'arrivera nulle part.
export const IBAN_INFO = {
  iban: "FR76 3000 6000 0112 3456 7890 189",
  bic: "AGRIFRPP889",
  nom: "Louis SIGAUD",
};

export const WERO_TEL = "+33 6 12 34 56 78";

// Compte utilisé pour l'espace admin (auth Supabase).
export const ADMIN_EMAIL = "losigaud@gmail.com";

// Durée pendant laquelle le choix de langue est mémorisé.
export const LANG_MEMORY_MS = 24 * 60 * 60 * 1000;
