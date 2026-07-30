# Oriane & Louis — 19 juin 2027

Site du mariage : notre histoire, la liste de mariage et les infos pratiques.
Bilingue français / anglais, pensé mobile d'abord.

React 19 + Vite, hébergement statique, Supabase pour les montants collectés.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
```

Créer un fichier `.env.local` à la racine (jamais commité) :

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_KEY=sb_publishable_xxxxxxxx
```

La clé est une clé *publishable* : elle est visible dans le bundle, c'est normal.
Ce qui protège les données, ce sont les règles RLS côté Supabase (voir plus bas).

Autres commandes :

```bash
npm run build    # génère dist/
npm run preview  # sert le dist/ en local
npm run lint
```

## Organisation

```
src/
  App.jsx              coquille : onglet courant, langue, chargement des données
  lib/
    env.js             lecture des variables d'environnement
    api.js             lecture publique des contributions (fetch, sans SDK)
    supabase.js        client complet — réservé à l'admin
    theme.js           palette, polices, breakpoint mobile
    useIsMobile.js     hook responsive (matchMedia)
    useReveal.js       apparition au scroll (IntersectionObserver)
  data/
    config.js          date, IBAN, Wero, e-mail admin
    translations.js    tous les textes FR / EN
    gifts.js           liste de mariage
    story.js           notre histoire (sections calculées une fois)
  components/          Header, MobileBottomNav, Countdown, LanguageGate, Toast…
  pages/               HomePage, StoryPage, GiftsPage, InfoPage, AdminPage
public/                photos (histoire-*.jpg, gifts/*.jpg, photo-*.jpg)
```

La navigation passe par le fragment d'URL (`useHashRoute`) : `#/story`,
`#/gifts`, `#/info`, `#/admin`, l'accueil restant sur l'URL nue. Chaque page a
donc un lien partageable et le bouton retour du navigateur fonctionne. Pas de
routeur externe.

## Ajouter du contenu

**Une photo dans l'histoire** — déposer l'image dans `public/`, puis ajouter une
entrée dans `src/data/story.js`. Un objet `{ type: "year", year }` ouvre une
nouvelle section ; `ratio: "3:4"` bascule le cadre en portrait.

**Un cadeau** — déposer le visuel dans `public/gifts/`, puis ajouter une ligne
dans `src/data/gifts.js`. Un `id` inédit suffit, la catégorie se crée toute
seule. Le champ `stripe` accepte un lien de paiement (vide = bouton masqué).

**Un texte** — tout est dans `src/data/translations.js`, en français et en anglais.

### Optimiser les images avant de les commiter

Les photos sortent des téléphones en 4000–8000 px pour plusieurs Mo, alors
qu'elles sont affichées à ~500 px. **Ne jamais commiter une photo brute.**

Déposer les originaux dans un dossier de travail (hors du dépôt), puis :

```bash
node scripts/optimize-images.mjs ~/photos-mariage
```

Le script redimensionne selon l'usage réel à l'écran et encode en WebP dans
`public/` : `histoire-*` à 1400 px (1800 px pour les deux photos pleine
largeur), `photo-*` à 1600 px, `gifts/*` à 700 px. Il applique l'orientation
EXIF avant redimensionnement, donc les photos portrait ne basculent pas.

Le site sert uniquement du WebP (pris en charge par tous les navigateurs depuis
2020, Safari 14 / iOS 14 inclus). Seul `public/og-image.jpg` reste en JPEG :
WhatsApp et Facebook ne savent pas afficher un WebP en aperçu de lien.

## Espace admin

Le bouton `···` en bas de page (desktop) ouvre l'onglet Admin. Connexion avec le
compte Supabase défini par `ADMIN_EMAIL` dans `src/data/config.js`. On y saisit
le montant collecté pour chaque cadeau ; les barres de progression du site
suivent.

Ce module embarque le SDK Supabase et n'est chargé qu'à l'ouverture de l'onglet,
pour que les invités ne le téléchargent pas.

Côté Supabase, la table `contributions` (`id` texte, `amount` numérique) doit
être en RLS : **lecture publique, écriture réservée aux utilisateurs
authentifiés**. Sans cette règle, n'importe quel visiteur peut modifier les
montants avec la clé publishable.

## Avant la mise en ligne

- [ ] **Fermer la table `contributions` en écriture** (voir ci-dessous) — urgent
- [ ] Supprimer les lignes obsolètes de la table (`nn*`, `at*`, `ex*`, `vn*`, `__sonde_audit__`)
- [ ] Renseigner l'IBAN, le BIC et le numéro Wero dans `src/data/config.js`
- [ ] Compléter l'hébergement, l'accès et le contact dans `src/data/translations.js`
- [ ] Remplacer les légendes « À compléter ✍️ » de la mosaïque dans `src/data/story.js`

### Fermer la table en écriture

Vérifié le 30/07/2026 : avec la seule clé publishable, un visiteur anonyme peut
**modifier et créer** des lignes (les suppressions, elles, sont bloquées).
N'importe qui peut donc afficher « cadeau offert » sur toute la liste.

Dans le SQL editor Supabase :

```sql
alter table contributions enable row level security;

drop policy if exists "lecture publique" on contributions;
create policy "lecture publique" on contributions
  for select to anon, authenticated using (true);

-- Aucune policy insert/update/delete pour `anon` : tout écrit lui est refusé.
drop policy if exists "ecriture admin" on contributions;
create policy "ecriture admin" on contributions
  for all to authenticated using (true) with check (true);
```

Puis revérifier — la commande doit répondre `[]` et non la ligne modifiée :

```bash
curl -X PATCH "$VITE_SUPABASE_URL/rest/v1/contributions?id=eq.c1" \
  -H "apikey: $VITE_SUPABASE_KEY" -H "Authorization: Bearer $VITE_SUPABASE_KEY" \
  -H "Content-Type: application/json" -H "Prefer: return=representation" \
  -d '{"amount":0}'
```
