// Liste de mariage. `cat`/`catEn` regroupent les cadeaux par catégorie.
// Le paiement par carte passe par Stripe Checkout (voir api/), sans lien à
// renseigner ici.
export const GIFTS = [
  { id: "c1",  img: "/gifts/c1.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Robot cuisine", en: "Food processor" }, amount: 500 },
  { id: "c2",  img: "/gifts/c2.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Air fryer", en: "Air fryer" }, amount: 200 },
  { id: "c3",  img: "/gifts/c3.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Set casseroles", en: "Saucepan set" }, amount: 150 },
  { id: "c4",  img: "/gifts/c4.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Set poêles", en: "Frying pan set" }, amount: 150 },
  { id: "c5",  img: "/gifts/c5.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "8 Verres à vin", en: "8 Wine glasses" }, amount: 80 },
  { id: "c16", img: "/gifts/c16.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "8 Verres à eau", en: "8 Water glasses" }, amount: 50 },
  { id: "c17", img: "/gifts/c17.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "6 Flûtes à champagne", en: "6 Champagne flutes" }, amount: 70 },
  { id: "c18", img: "/gifts/c18.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Duo de moulins sel et poivre", en: "Salt and pepper mill duo" }, amount: 80 },
  { id: "c19", img: "/gifts/c19.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Porte Couteaux Magnétique", en: "Magnetic knife holder" }, amount: 90 },
  { id: "c6",  img: "/gifts/c6.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Carafe à eau", en: "Water carafe" }, amount: 100 },
  { id: "c7",  img: "/gifts/c7.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Lave vaisselle", en: "Dishwasher" }, amount: 500 },
  { id: "c8",  img: "/gifts/c8.webp",  cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Cave à vin", en: "Wine fridge" }, amount: 600 },
  { id: "c11", img: "/gifts/c11.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Machine à pâtes", en: "Pasta maker" }, amount: 50 },
  { id: "c12", img: "/gifts/c12.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Coravin", en: "Coravin" }, amount: 300 },
  { id: "c13", img: "/gifts/c13.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Cocotte en fonte", en: "Cast iron dutch oven" }, amount: 400 },
  { id: "c14", img: "/gifts/c14.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Four", en: "Oven" }, amount: 800 },
  { id: "c15", img: "/gifts/c15.webp", cat: { fr: "Cuisine", icon: "🍳" }, catEn: "Kitchen", name: { fr: "Saladier en Céramique", en: "Ceramic salad bowl" }, amount: 100 },

  { id: "m9",  img: "/gifts/m9.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Duo de Coussins", en: "Cushion duo" }, amount: 120 },
  { id: "m10", img: "/gifts/m10.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Grand Coussin", en: "Large cushion" }, amount: 135 },
  { id: "c10", img: "/gifts/c10.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Nappe", en: "Tablecloth" }, amount: 100 },
  { id: "m5",  img: "/gifts/m5.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Canapé", en: "Sofa" }, amount: 1800 },
  { id: "m12", img: "/gifts/m12.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Tabouret de Piano", en: "Piano stool" }, amount: 120 },
  { id: "m1",  img: "/gifts/m1.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Taies d'oreiller", en: "Pillowcases" }, amount: 60 },
  { id: "m13", img: "/gifts/m13.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Drap-housse", en: "Fitted sheet" }, amount: 55 },
  { id: "m14", img: "/gifts/m14.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Housse de couette", en: "Duvet cover" }, amount: 100 },
  { id: "m15", img: "/gifts/m15.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Drap", en: "Flat sheet" }, amount: 80 },
  { id: "m2",  img: "/gifts/m2.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Serviettes", en: "Towels" }, amount: 100 },
  { id: "m3",  img: "/gifts/m3.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Peignoir pour Louis", en: "Bathrobe for Louis" }, amount: 150 },
  { id: "m11", img: "/gifts/m11.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Peignoir pour Oriane", en: "Bathrobe for Oriane" }, amount: 150 },
  { id: "c9",  img: "/gifts/c9.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Vase", en: "Vase" }, amount: 70 },
  { id: "m8",  img: "/gifts/m8.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Grande Bougie", en: "Large candle" }, amount: 120 },
  { id: "m4",  img: "/gifts/m4.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Sèche linge", en: "Tumble dryer" }, amount: 600 },
  { id: "m6",  img: "/gifts/m6.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Perceuse / visseuse", en: "Drill / screwdriver" }, amount: 80 },
  { id: "m7",  img: "/gifts/m7.webp",  cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Kit d'outils", en: "Tool kit" }, amount: 50 },
  { id: "hc1", img: "/gifts/hc1.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "TV OLED (home-cinéma)", en: "OLED TV (home cinema)" }, amount: 1500 },
  { id: "hc2", img: "/gifts/hc2.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Ampli AV (home-cinéma)", en: "AV receiver (home cinema)" }, amount: 750 },
  { id: "hc6", img: "/gifts/hc6.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Caisson de basse (home-cinéma)", en: "Subwoofer (home cinema)" }, amount: 700 },
  { id: "hc7", img: "/gifts/hc7.webp", cat: { fr: "Maison", icon: "🏡" }, catEn: "Home", name: { fr: "Lecteur Blu-ray (home-cinéma)", en: "Blu-ray player (home cinema)" }, amount: 250 },

  { id: "sp1", img: "/gifts/sp1.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Chaussures de ski pour Louis", en: "Ski boots for Louis" }, amount: 300 },
  { id: "sp2", img: "/gifts/sp2.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Chaussures de ski pour Oriane", en: "Ski boots for Oriane" }, amount: 250 },
  { id: "sp3", img: "/gifts/sp3.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Tente Trek", en: "Trekking tent" }, amount: 500 },
  { id: "sp4", img: "/gifts/sp4.webp", cat: { fr: "Sports & Voyages", icon: "⛷️" }, catEn: "Sports & Travel", name: { fr: "Valise Cabine", en: "Cabin suitcase" }, amount: 200 },

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
