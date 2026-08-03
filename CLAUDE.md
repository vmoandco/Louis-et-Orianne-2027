# Instructions pour Claude Code

Lire [README.md](README.md) avant toute modification — structure du projet,
schéma de `src/data/gifts.js` et `src/data/story.js`, pipeline d'images
(`scripts/optimize-images.mjs`), espace admin et RLS Supabase y sont déjà
documentés en détail.

## « push » = publier sur https://oriane-et-louis-2027.fr/

Quand Louis dit « push », « publie », « mets en ligne » ou « déploie », il veut
**voir le changement sur le site public**, pas seulement sur GitHub.

Le site est hébergé sur **Vercel**, qui ne déploie en production que la branche
**`main`**. Pousser une branche de travail ne fait qu'un déploiement *preview*,
invisible sur le vrai domaine. La séquence complète est donc :

```bash
git status                       # l'arbre doit etre propre
git checkout main
git merge --ff-only <branche>    # fast-forward, pas de commit de merge
git push origin main             # c'est CE push qui declenche le build Vercel
```

Puis vérifier que la prod a bien basculé (le build met ~1 min) :

```bash
curl -s "https://oriane-et-louis-2027.fr/?cb=$RANDOM" | grep -o '<title>[^<]*</title>'
# comparer aussi la taille d'un visuel modifie :
curl -s -o /dev/null -w '%{http_code} %{size_download}\n' \
  https://oriane-et-louis-2027.fr/gifts/<id>.webp
```

Signaler à Louis si le merge embarque des commits plus anciens que ceux de la
session : ils partent en prod eux aussi.

**Exception : ajout d'un cadeau.** Pour un simple ajout d'objet à la liste
(nouvelle ligne dans `gifts.js` + visuel), pas besoin de demander confirmation
avant de pousser en prod — commit et push direct, en suivant quand même la
séquence et la vérification ci-dessus.

## Points à ne pas oublier

- **Jamais de photo brute committée.** Toute image ajoutée dans `public/`
  passe par `node scripts/optimize-images.mjs <dossier-source>` (voir README
  § Optimiser les images). Les visuels de cadeaux sortent en WebP 700 px.
  Le script ne lit que `.jpg`/`.png` : convertir un `.webp` source d'abord
  (`sips -s format png src.webp --out dest.png`).
- Un nouveau cadeau = une ligne dans `src/data/gifts.js` (`id`, `img`, `cat`,
  `catEn`, `name.fr`/`name.en`, `amount`, `stripe`) + le visuel dans
  `public/gifts/`.
- Les images que Louis colle dans la conversation ne sont pas enregistrées sur
  le disque : les retrouver dans `~/Downloads` (`ls -lat`, les plus récentes)
  et **toujours les ouvrir pour vérifier** qu'on traite la bonne avant de
  remplacer un visuel.
- Messages de commit : français, à l'impératif, sans accents.
- La base Supabase est verrouillée (RLS actif, `supabase/setup.sql` déjà
  exécuté le 31/07/2026) : lecture publique, écriture réservée aux comptes
  connectés. Ne pas le rejouer sans raison — il commence par un
  `delete from public.contributions`.
