-- ============================================================================
--  Table `contributions` : nettoyage + verrouillage des ecritures
--
--  A executer une seule fois dans Supabase → SQL Editor → New query,
--  puis « Run ». Le script est idempotent : le rejouer ne casse rien.
--
--  Contexte : avec la seule cle publishable (visible dans le bundle JS),
--  un visiteur anonyme pouvait modifier et creer des lignes, donc afficher
--  « cadeau offert » sur toute la liste de mariage.
-- ============================================================================


-- ─── 1. Etat des lieux (facultatif, pour voir avant/apres) ──────────────────

select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'contributions';


-- ─── 2. Purge des lignes orphelines ─────────────────────────────────────────
-- La table ne contenait que des identifiants d'une ancienne liste de cadeaux
-- (nn*, at*, ex*, vn*) plus une ligne de test, sans aucune correspondance avec
-- la liste actuelle. Aucune participation reelle n'y est enregistree.
-- Les cadeaux absents de la table sont affiches a 0 € par le site.

delete from public.contributions;


-- ─── 3. Activation de RLS ───────────────────────────────────────────────────

alter table public.contributions enable row level security;


-- ─── 4. Suppression de toute policy existante ───────────────────────────────
-- Les policies sont permissives et se cumulent : il suffit qu'une ancienne
-- regle autorise l'ecriture aux anonymes pour que le verrou saute. On repart
-- donc d'une table vierge de policies.

do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'contributions'
  loop
    execute format('drop policy %I on public.contributions', p.policyname);
  end loop;
end $$;


-- ─── 5. Les deux seules regles ──────────────────────────────────────────────

-- Tout le monde peut lire les montants : c'est ce qui alimente les barres
-- de progression pour les invites.
create policy "lecture publique"
  on public.contributions
  for select
  to anon, authenticated
  using (true);

-- Seul un compte connecte (l'espace admin) peut ecrire.
create policy "ecriture admin"
  on public.contributions
  for all
  to authenticated
  using (true)
  with check (true);


-- ─── 6. Verification ────────────────────────────────────────────────────────
-- Resultat attendu : exactement deux lignes,
--   lecture publique | SELECT | {anon,authenticated}
--   ecriture admin   | ALL    | {authenticated}

select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'contributions'
order by policyname;
