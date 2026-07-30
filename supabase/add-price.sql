-- ============================================================================
--  Ajoute la colonne `price` a la table `contributions`
--
--  A executer une fois dans Supabase → SQL Editor → New query, puis « Run ».
--  Le script est idempotent : le rejouer ne casse rien et n'efface aucune
--  donnee (contrairement a setup.sql, qui purge la table).
--
--  Pourquoi : le prix de chaque cadeau etait fige dans le bundle JS
--  (`src/data/gifts.js`). Le stocker en base permet de le corriger depuis
--  l'espace admin sans redeployer le site.
--
--  `price` est nullable : quand elle vaut NULL, le site retombe sur le prix
--  par defaut de `src/data/gifts.js`. Seuls les prix reellement modifies
--  occupent donc une ligne.
-- ============================================================================


-- ─── 1. La colonne ──────────────────────────────────────────────────────────

alter table public.contributions
  add column if not exists price numeric;


-- ─── 2. Valeur par defaut sur `amount` ──────────────────────────────────────
-- L'admin peut fixer un prix pour un cadeau qui n'a encore aucune
-- participation. La ligne est alors creee avec le seul champ `price` : sans
-- defaut, l'insertion echouerait sur `amount`.

alter table public.contributions
  alter column amount set default 0;


-- ─── 3. Verification ────────────────────────────────────────────────────────
-- Resultat attendu : les colonnes id, amount (default 0) et price (nullable).

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'contributions'
order by ordinal_position;
