// Liste de mariage. `cat`/`catEn` regroupent les cadeaux par catégorie,
// `stripe` accueille un lien de paiement Stripe (vide = masqué).
export const GIFTS = [
  { id: "c1",  img: "/gifts/c1.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Robot cuisine", en: "Food processor" }, amount: 500, stripe: "" },
  { id: "c2",  img: "/gifts/c2.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Air fryer", en: "Air fryer" }, amount: 200, stripe: "" },
  { id: "c3",  img: "/gifts/c3.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Set casseroles", en: "Saucepan set" }, amount: 150, stripe: "" },
  { id: "c4",  img: "/gifts/c4.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Set poêles", en: "Frying pan set" }, amount: 150, stripe: "" },
  { id: "c5",  img: "/gifts/c5.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Assemblage set verres à vin & eau", en: "Wine & water glasses set" }, amount: 200, stripe: "" },
  { id: "c6",  img: "/gifts/c6.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Broc à eau", en: "Water carafe" }, amount: 100, stripe: "" },
  { id: "c7",  img: "/gifts/c7.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Lave vaisselle", en: "Dishwasher" }, amount: 500, stripe: "" },
  { id: "c8",  img: "/gifts/c8.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Cave à vin", en: "Wine fridge" }, amount: 600, stripe: "" },
  { id: "c9",  img: "/gifts/c9.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Vase", en: "Vase" }, amount: 70, stripe: "" },
  { id: "c10", img: "/gifts/c10.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Nappe", en: "Tablecloth" }, amount: 100, stripe: "" },
  { id: "c11", img: "/gifts/c11.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Machine à pâtes", en: "Pasta maker" }, amount: 50, stripe: "" },

  { id: "m1",  img: "/gifts/m1.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Draps", en: "Bed sheets" }, amount: 150, stripe: "" },
  { id: "m2",  img: "/gifts/m2.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Serviettes", en: "Towels" }, amount: 100, stripe: "" },
  { id: "m3",  img: "/gifts/m3.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Peignoirs", en: "Bathrobes" }, amount: 200, stripe: "" },
  { id: "m4",  img: "/gifts/m4.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Sèche linge", en: "Tumble dryer" }, amount: 600, stripe: "" },
  { id: "m5",  img: "/gifts/m5.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Table de salle à manger", en: "Dining table" }, amount: 500, stripe: "" },
  { id: "m6",  img: "/gifts/m6.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Perceuse / visseuse", en: "Drill / screwdriver" }, amount: 80, stripe: "" },
  { id: "m7",  img: "/gifts/m7.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Kit d'outils", en: "Tool kit" }, amount: 50, stripe: "" },

  { id: "sp1", img: "/gifts/sp1.webp", cat: { fr: "Sport", icon: "⛷️" }, catEn: "Sport", name: { fr: "Chaussures de ski pour Louis", en: "Ski boots for Louis" }, amount: 300, stripe: "" },
  { id: "sp2", img: "/gifts/sp2.webp", cat: { fr: "Sport", icon: "⛷️" }, catEn: "Sport", name: { fr: "Chaussures de ski pour Oriane", en: "Ski boots for Oriane" }, amount: 250, stripe: "" },

  { id: "hc1", img: "/gifts/hc1.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "TV OLED", en: "OLED TV" }, amount: 1500, stripe: "" },
  { id: "hc2", img: "/gifts/hc2.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Ampli AV", en: "AV receiver" }, amount: 750, stripe: "" },
  { id: "hc3", img: "/gifts/hc3.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Enceintes frontales", en: "Front speakers" }, amount: 1000, stripe: "" },
  { id: "hc4", img: "/gifts/hc4.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Enceinte centrale", en: "Centre speaker" }, amount: 350, stripe: "" },
  { id: "hc5", img: "/gifts/hc5.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Enceintes surround", en: "Surround speakers" }, amount: 330, stripe: "" },
  { id: "hc6", img: "/gifts/hc6.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Caisson de basse", en: "Subwoofer" }, amount: 700, stripe: "" },
  { id: "hc7", img: "/gifts/hc7.webp", cat: { fr: "Home cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Lecteur Blu-ray", en: "Blu-ray player" }, amount: 400, stripe: "" },

  { id: "no1", img: "/gifts/no1.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Étable Crèche", en: "Nativity stable" }, amount: 55, stripe: "" },
  { id: "no2", img: "/gifts/no2.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Santons", en: "Nativity figurines" }, amount: 150, stripe: "" },
  { id: "no3", img: "/gifts/no3.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Tasses", en: "Mugs" }, amount: 60, stripe: "" },
  { id: "no4", img: "/gifts/no4.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "\"Boules\" de Noël", en: "Christmas \"Baubles\"" }, amount: 50, stripe: "" },
  { id: "no5", img: "/gifts/no5.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Verres", en: "Glasses" }, amount: 90, stripe: "" },

  { id: "in1", img: "/gifts/in1.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Maillot de l'OM pour Oriane", en: "OM football shirt for Oriane" }, amount: 50, stripe: "" },
  { id: "in2", img: "/gifts/in2.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Abonnement Peuple Bleu & Blanc 2027/2028", en: "Peuple Bleu & Blanc season ticket 2027/2028" }, amount: 60, stripe: "" },
  { id: "in3", img: "/gifts/in3.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Jeu de Société - La Famiglia", en: "Board Game - La Famiglia" }, amount: 80, stripe: "" },
  { id: "in4", img: "/gifts/in4.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Jeu de Société - Trône de Fer extension", en: "Board Game - Game of Thrones expansion" }, amount: 50, stripe: "" },
];

/** Nom de catégorie d'un cadeau dans la langue courante. */
export const catName = (gift, lang) => (lang === "fr" ? gift.cat.fr : gift.catEn);

/** Catégories dans leur ordre d'apparition, avec leur icône. */
export function giftCategories(lang) {
  const seen = new Map();
  for (const gift of GIFTS) {
    const name = catName(gift, lang);
    if (!seen.has(name)) seen.set(name, { name, icon: gift.cat.icon });
  }
  return [...seen.values()];
}
