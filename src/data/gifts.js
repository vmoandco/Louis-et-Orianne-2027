// Liste de mariage. `cat`/`catEn` regroupent les cadeaux par catégorie.
// Le paiement par carte passe par Stripe Checkout (voir api/), sans lien à
// renseigner ici.
export const GIFTS = [
  { id: "c1",  img: "/gifts/c1.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Robot cuisine", en: "Food processor" }, amount: 500 },
  { id: "c2",  img: "/gifts/c2.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Air fryer", en: "Air fryer" }, amount: 200 },
  { id: "c3",  img: "/gifts/c3.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Set casseroles", en: "Saucepan set" }, amount: 150 },
  { id: "c4",  img: "/gifts/c4.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Set poêles", en: "Frying pan set" }, amount: 150 },
  { id: "c5",  img: "/gifts/c5.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Assemblage set verres à vin & eau", en: "Wine & water glasses set" }, amount: 200 },
  { id: "c6",  img: "/gifts/c6.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Carafe à eau", en: "Water carafe" }, amount: 100 },
  { id: "c7",  img: "/gifts/c7.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Lave vaisselle", en: "Dishwasher" }, amount: 500 },
  { id: "c8",  img: "/gifts/c8.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Cave à vin", en: "Wine fridge" }, amount: 600 },
  { id: "c11", img: "/gifts/c11.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Machine à pâtes", en: "Pasta maker" }, amount: 50 },
  { id: "c12", img: "/gifts/c12.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Coravin", en: "Coravin" }, amount: 300 },
  { id: "c13", img: "/gifts/c13.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Cocotte en fonte", en: "Cast iron dutch oven" }, amount: 400 },
  { id: "c14", img: "/gifts/c14.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Four", en: "Oven" }, amount: 800 },
  { id: "c15", img: "/gifts/c15.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Saladier en Céramique", en: "Ceramic salad bowl" }, amount: 100 },

  { id: "m9",  img: "/gifts/m9.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Duo de Coussins", en: "Cushion duo" }, amount: 120 },
  { id: "c10", img: "/gifts/c10.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Nappe", en: "Tablecloth" }, amount: 100 },
  { id: "m1",  img: "/gifts/m1.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Draps", en: "Bed sheets" }, amount: 150 },
  { id: "m2",  img: "/gifts/m2.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Serviettes", en: "Towels" }, amount: 100 },
  { id: "m3",  img: "/gifts/m3.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Peignoirs", en: "Bathrobes" }, amount: 200 },
  { id: "c9",  img: "/gifts/c9.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Vase", en: "Vase" }, amount: 70 },
  { id: "m8",  img: "/gifts/m8.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Grande Bougie", en: "Large candle" }, amount: 120 },
  { id: "m4",  img: "/gifts/m4.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Sèche linge", en: "Tumble dryer" }, amount: 600 },
  { id: "m6",  img: "/gifts/m6.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Perceuse / visseuse", en: "Drill / screwdriver" }, amount: 80 },
  { id: "m7",  img: "/gifts/m7.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Kit d'outils", en: "Tool kit" }, amount: 50 },

  { id: "sp1", img: "/gifts/sp1.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Chaussures de ski pour Louis", en: "Ski boots for Louis" }, amount: 300 },
  { id: "sp2", img: "/gifts/sp2.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Chaussures de ski pour Oriane", en: "Ski boots for Oriane" }, amount: 250 },
  { id: "sp3", img: "/gifts/sp3.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Tente Trek", en: "Trekking tent" }, amount: 500 },
  { id: "sp4", img: "/gifts/sp4.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Valise Cabine", en: "Cabin suitcase" }, amount: 200 },

  { id: "hc1", img: "/gifts/hc1.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "TV OLED", en: "OLED TV" }, amount: 1500 },
  { id: "hc2", img: "/gifts/hc2.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Ampli AV", en: "AV receiver" }, amount: 750 },
  { id: "hc3", img: "/gifts/hc3.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Enceintes frontales", en: "Front speakers" }, amount: 1000 },
  { id: "hc4", img: "/gifts/hc4.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Enceinte centrale", en: "Centre speaker" }, amount: 350 },
  { id: "hc5", img: "/gifts/hc5.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Enceintes surround", en: "Surround speakers" }, amount: 330 },
  { id: "hc6", img: "/gifts/hc6.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Caisson de basse", en: "Subwoofer" }, amount: 700 },
  { id: "hc7", img: "/gifts/hc7.webp", cat: { fr: "Salon Home Cinéma", icon: "🎬" }, catEn: "Home Cinema", name: { fr: "Lecteur Blu-ray", en: "Blu-ray player" }, amount: 400 },

  { id: "no1", img: "/gifts/no1.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Étable Crèche", en: "Nativity stable" }, amount: 55 },
  { id: "no2", img: "/gifts/no2.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Santons", en: "Nativity figurines" }, amount: 150 },
  { id: "no3", img: "/gifts/no3.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Tasses", en: "Mugs" }, amount: 60 },
  { id: "no4", img: "/gifts/no4.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "\"Boules\" de Noël", en: "Christmas \"Baubles\"" }, amount: 50 },
  { id: "no5", img: "/gifts/no5.webp", cat: { fr: "Noël", icon: "🎄" }, catEn: "Christmas", name: { fr: "Verres", en: "Glasses" }, amount: 90 },

  { id: "in1", img: "/gifts/in1.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Maillot de l'OM pour Oriane", en: "OM football shirt for Oriane" }, amount: 50 },
  { id: "in3", img: "/gifts/in3.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Jeu de Société - La Famiglia", en: "Board Game - La Famiglia" }, amount: 80 },
  { id: "in4", img: "/gifts/in4.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Jeu de Société - Trône de Fer extension", en: "Board Game - Game of Thrones expansion" }, amount: 50 },
  { id: "in5", img: "/gifts/in5.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Magnum année de mariage", en: "Magnum wedding vintage" }, amount: 80 },
  { id: "in6", img: "/gifts/in6.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "Caisse de vin année de mariage", en: "Wedding vintage wine case" }, amount: 240 },
  { id: "in7", img: "/gifts/in7.webp", cat: { fr: "Insolite", icon: "✨" }, catEn: "Something Fun", name: { fr: "1 an de cinéma pour 2", en: "1 year of cinema for 2" }, amount: 400 },
];

/**
 * Cadeau mis en avant en tête de liste, hors catégorie.
 *
 * Volontairement sans `amount` : il n'a pas de prix cible, donc pas de jauge
 * ni de plafond. Les participations s'additionnent librement — la fonction
 * `declare_contribution` ne plafonne que lorsqu'un prix est enregistré.
 */
export const HONEYMOON = {
  id: "voyage",
  img: "/gifts/voyage.webp",
  name: { fr: "Voyage de noces", en: "Honeymoon" },
};

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
