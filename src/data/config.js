// ─── Réglages du mariage ──────────────────────────────────────────────
export const DATE_MARIAGE = new Date("2027-06-19T14:00:00");

// ⚠️ COORDONNÉES FICTIVES — à remplacer par les vraies avant d'annoncer le site.
// L'IBAN seul suffit : depuis le reglement SEPA de 2016, le BIC n'est plus
// exige pour un virement en euros dans la zone SEPA.
// Le format est valide (l'IBAN est l'exemple de documentation de la Banque de
// France) pour que l'affichage soit réaliste, mais aucun de ces comptes
// n'existe : un virement envoyé ici n'arrivera nulle part.
export const IBAN_INFO = {
  iban: "FR76 3000 6000 0112 3456 7890 189",
  nom: "Louis SIGAUD",
};

export const WERO_TEL = "+33 6 12 34 56 78";

// ⚠️ FICTIF également — le pseudo Revolut, qui forme le lien revolut.me/<pseudo>.
export const REVOLUT_TAG = "louissigaud";

// Compte utilisé pour l'espace admin (auth Supabase).
export const ADMIN_EMAIL = "losigaud@gmail.com";

// Durée pendant laquelle le choix de langue est mémorisé.
export const LANG_MEMORY_MS = 24 * 60 * 60 * 1000;
