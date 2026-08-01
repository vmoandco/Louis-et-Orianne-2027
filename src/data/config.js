// ─── Réglages du mariage ──────────────────────────────────────────────
export const DATE_MARIAGE = new Date("2027-06-19T14:00:00");

// Coordonnées réelles du bénéficiaire.
//
// `nom` doit reprendre exactement l'orthographe tenue par la banque : depuis
// octobre 2025, les banques européennes vérifient que le nom correspond à
// l'IBAN et avertissent le payeur en cas d'écart.
//
// L'IBAN seul suffit : depuis le règlement SEPA de 2016, le BIC n'est plus
// exigé pour un virement en euros dans la zone SEPA.
export const IBAN_INFO = {
  iban: "FR09 3000 2084 3300 0019 8865 J63",
  nom: "SIGAUD LOUIS",
};

// Numéro rattaché au compte Wero. Affiché espacé pour être lisible, copié
// d'un bloc pour être collé tel quel dans l'application.
export const WERO_TEL = "06 08 12 43 27";

// Pseudo Revolut d'Oriane, qui forme le lien revolut.me/<pseudo>.
export const REVOLUT_TAG = "orianeyr7p";

// Compte utilisé pour l'espace admin (auth Supabase).
export const ADMIN_EMAIL = "losigaud@gmail.com";
