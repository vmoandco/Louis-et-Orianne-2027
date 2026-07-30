// Notre histoire, dans l'ordre chronologique.
//
// Types d'entrées :
//   { type: "year", year, mosaic? }  → ouvre une nouvelle section
//   { type: "text", text }           → texte pleine largeur (sections mosaïque)
//   { date, photo, text?, ratio?, fullWidth? } → une photo
//
// `ratio: "3:4"` bascule le cadre en portrait, `fullWidth` sort la photo de la grille.
const EVENTS = [
  { type: "year", year: "2023" },
  { date: { fr: "14 Septembre 2023 - Vendée", en: "September 14, 2023 - Vendée" }, photo: "/histoire-1.webp", text: { fr: "Première rencontre — Nous ne nous connaissions pas encore au moment de cette photo 👫🏻", en: "First meeting — We didn't even know each other yet at the time of this photo 👫🏻" } },
  { date: { fr: "Novembre 2023 - Florence", en: "November 2023 - Florence" }, photo: "/histoire-2.webp", text: { fr: "Notre premier weekend ensemble 🇮🇹", en: "Our first weekend away together 🇮🇹" } },

  { type: "year", year: "2024" },
  { date: { fr: "Janvier 2024 - Auron", en: "January 2024 - Auron" }, photo: "/histoire-3.webp", text: { fr: "Premier séjour au ski avec nos amis ⛷️", en: "First ski trip with our friends ⛷️" } },
  { date: { fr: "Avril 2024 - Roumanie", en: "April 2024 - Romania" }, photo: "/histoire-4.webp", text: { fr: "Première vacances à deux 🇷🇴", en: "Our first holiday just the two of us 🇷🇴" } },
  { date: { fr: "Aout 2024 - Cap d'Ail", en: "August 2024 - Cap d'Ail" }, photo: "/histoire-5.webp", text: { fr: "Anniversaire d'Oriane sur la Côte d'Azur 🎂", en: "Oriane's birthday on the French Riviera 🎂" } },
  { date: { fr: "Octobre 2024 - Île de la Réunion", en: "October 2024 - Réunion Island" }, photo: "/histoire-6.webp", text: { fr: "Voyage en famille à la Réunion 🇷🇪", en: "Family trip to Réunion Island 🇷🇪" }, ratio: "3:4" },
  { date: { fr: "Nouvel An 2024 / 2025", en: "New Year's Eve 2024/2025" }, photo: "/histoire-7.webp", text: { fr: "Nouvel An entre bons copains, qui dit nouvelle année dit...", en: "New Year's Eve with great friends, new year means..." } },

  { type: "year", year: "2025" },
  { date: { fr: "Janvier 2025 - Paris", en: "January 2025 - Paris" }, photo: "/histoire-8.webp", text: { fr: "... emménagement ensemble à Paris ! 🗼", en: "... moving in together in Paris! 🗼" } },
  { date: { fr: "Mars 2025 - Thaïlande / Hong Kong", en: "March 2025 - Thailand / Hong Kong" }, photo: "/histoire-9.webp", text: { fr: "Voyage en Asie 🇹🇭 🇭🇰", en: "Trip to Asia 🇹🇭 🇭🇰" }, ratio: "3:4" },
  { date: { fr: "Avril 2025 - Varengeville", en: "April 2025 - Varengeville" }, photo: "/histoire-10.webp", text: { fr: "Découverte de la Normandie d'Oriane 🌊", en: "Discovering Oriane's Normandy 🌊" } },
  { date: { fr: "Avril 2025 - Beaune", en: "April 2025 - Beaune" }, photo: "/histoire-11.webp", text: { fr: "Route des vins de bourgogne 🍷", en: "Burgundy wine route 🍷" }, ratio: "3:4" },
  { date: { fr: "Mai 2025 - Boston & New York", en: "May 2025 - Boston & New York" }, photo: "/histoire-12.webp", text: { fr: "Voyage dans la famille américaine de Louis 🇺🇸", en: "Visiting Louis' American family 🇺🇸" } },
  { date: { fr: "Juillet 2025 - La Ronze", en: "July 2025 - La Ronze" }, photo: "/histoire-13.webp", text: { fr: "80 ans du grand-père de Louis 🎂", en: "Louis' grandfather's 80th birthday 🎂" } },
  { date: { fr: "Août 2025 - Le Guillier", en: "August 2025 - Le Guillier" }, photo: "/histoire-14.webp", text: { fr: "Parenthèse bretonne pour l'été 🌿", en: "A Breton summer escape 🌿" }, ratio: "3:4" },
  { date: { fr: "Novembre 2025", en: "November 2025" }, photo: "/histoire-15.webp", text: { fr: "Oriane découvre le plus beau stade de France 🔵⚪", en: "Oriane discovers the finest stadium in France 🔵⚪" } },

  { type: "year", year: "2026" },
  { date: { fr: "Janvier 2027 - Venise", en: "January 2027 - Venice" }, photo: "/histoire-16.webp", text: { fr: "Découverte de la ville des amoureux ❤️ 🇮🇹", en: "Discovering the city of love ❤️ 🇮🇹" }, ratio: "3:4" },

  { type: "year", year: { fr: "Et après un fabuleux voyage en Arménie et en Géorgie...", en: "And after a fabulous trip to Armenia and Georgia..." }, mosaic: true },
  { date: { fr: "Photo 1", en: "Photo 1" }, photo: "/histoire-17.webp", text: { fr: "À compléter ✍️", en: "To be completed ✍️" }, ratio: "3:4" },
  { date: { fr: "Photo 2", en: "Photo 2" }, photo: "/histoire-18.webp", text: { fr: "À compléter ✍️", en: "To be completed ✍️" }, ratio: "3:4" },
  { date: { fr: "Photo 3", en: "Photo 3" }, photo: "/histoire-19.webp", text: { fr: "À compléter ✍️", en: "To be completed ✍️" }, ratio: "3:4" },
  { date: { fr: "Photo 4", en: "Photo 4" }, photo: "/histoire-20.webp", ratio: "3:4", fullWidth: true },
  { type: "text", text: { fr: "... ils se sont dit OUI", en: "... they said YES" } },
  { date: { fr: "Photo 5", en: "Photo 5" }, photo: "/histoire-21.webp", ratio: "3:4", fullWidth: true },
];

/** Découpe une section mosaïque en rangées de 3, coupées par les blocs pleine largeur. */
function toMosaicBlocks(photos) {
  const blocks = [];
  let row = [];
  const flushRow = () => {
    if (row.length) blocks.push({ type: "grid", items: row });
    row = [];
  };

  for (const item of photos) {
    if (item.type === "text") {
      flushRow();
      blocks.push({ type: "text", text: item.text });
    } else if (item.fullWidth) {
      flushRow();
      blocks.push({ type: "full", item });
    } else {
      row.push(item);
      if (row.length === 3) flushRow();
    }
  }
  flushRow();
  return blocks;
}

/**
 * Sections prêtes à l'affichage, calculées une seule fois au chargement du module
 * (les données sont statiques : inutile de refaire ce travail à chaque rendu).
 */
export const STORY_SECTIONS = (() => {
  const sections = [];
  let current = null;

  for (const event of EVENTS) {
    if (event.type === "year") {
      if (current) sections.push(current);
      current = { year: event.year, mosaic: Boolean(event.mosaic), photos: [] };
    } else if (current) {
      current.photos.push(event);
    }
  }
  if (current) sections.push(current);

  return sections.map((section) => ({
    ...section,
    blocks: section.mosaic ? toMosaicBlocks(section.photos) : null,
  }));
})();
