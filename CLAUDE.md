# Instructions pour Claude Code

Lire [README.md](README.md) avant toute modification — structure du projet,
schéma de `src/data/gifts.js` et `src/data/story.js`, pipeline d'images
(`scripts/optimize-images.mjs`), espace admin et RLS Supabase y sont déjà
documentés en détail.

Points à ne pas oublier :

- **Jamais de photo brute committée.** Toute image ajoutée dans `public/`
  passe par `node scripts/optimize-images.mjs <dossier-source>` (voir README
  § Optimiser les images). Les visuels de cadeaux sortent en WebP 700 px.
- Un nouveau cadeau = une ligne dans `src/data/gifts.js` (`id`, `img`, `cat`,
  `catEn`, `name.fr`/`name.en`, `amount`, `stripe`) + le visuel dans
  `public/gifts/`.
- Les images collées dans la conversation ne sont pas sauvegardées à un
  chemin fixe par l'environnement : il faut les retrouver (typiquement dans
  `~/Downloads`, triées par date de modification récente) avant de pouvoir
  les traiter.
