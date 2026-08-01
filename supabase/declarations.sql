-- ============================================================================
--  Journal des participations : qui a donne quoi
--
--  A executer une fois dans Supabase → SQL Editor → New query, puis « Run ».
--  Idempotent, n'efface aucune donnee existante.
--
--  Jusqu'ici `declare_contribution` ne faisait qu'incrementer un total
--  anonyme : impossible de savoir qui avait participe, ni de recouper avec
--  les virements recus. Chaque declaration laisse desormais une ligne
--  horodatee dans `declarations`, que l'espace admin affiche en liste.
--
--  La table `contributions` reste la source des jauges du site : on ne la
--  remplace pas, on l'accompagne.
-- ============================================================================


-- ─── 1. La table ────────────────────────────────────────────────────────────

create table if not exists public.declarations (
  id          bigint generated always as identity primary key,
  gift_id     text        not null,
  amount      numeric     not null,
  guest_name  text,
  method      text,
  created_at  timestamptz not null default now()
);

create index if not exists declarations_created_at_idx
  on public.declarations (created_at desc);


-- ─── 2. Verrouillage ────────────────────────────────────────────────────────
-- Personne ne peut lire ni modifier ce journal avec la seule cle publishable.
-- Les insertions passent uniquement par `declare_contribution`, qui est en
-- `security definer` : aucune policy d'insertion n'est donc necessaire.

alter table public.declarations enable row level security;

do $$
declare
  p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'declarations'
  loop
    execute format('drop policy %I on public.declarations', p.policyname);
  end loop;
end $$;

-- Seul un compte connecte (l'espace admin) consulte le journal.
create policy "lecture admin"
  on public.declarations
  for select
  to authenticated
  using (true);

-- Et peut corriger ou supprimer une ligne erronee.
create policy "ecriture admin"
  on public.declarations
  for all
  to authenticated
  using (true)
  with check (true);


-- ─── 3. La fonction enregistre desormais le detail ──────────────────────────
-- Memes bornes qu'avant. `guest_name` et `method` sont facultatifs : une
-- declaration sans prenom reste acceptee plutot que perdue.

create or replace function public.declare_contribution(
  gift_id    text,
  delta      numeric,
  guest_name text default null,
  method     text default null
)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  ceiling numeric;
  updated numeric;
begin
  if delta is null or delta < 5 or delta > 5000 then
    raise exception 'montant hors bornes';
  end if;

  if gift_id is null or length(gift_id) = 0 or length(gift_id) > 20 then
    raise exception 'cadeau inconnu';
  end if;

  insert into contributions (id, amount)
  values (gift_id, delta)
  on conflict (id) do update
    set amount = coalesce(contributions.amount, 0) + excluded.amount
  returning amount, price into updated, ceiling;

  if ceiling is not null and updated > ceiling then
    update contributions set amount = ceiling where id = gift_id;
    updated := ceiling;
  end if;

  insert into declarations (gift_id, amount, guest_name, method)
  values (
    gift_id,
    delta,
    nullif(btrim(left(coalesce(guest_name, ''), 60)), ''),
    nullif(btrim(left(coalesce(method, ''), 20)), '')
  );

  return updated;
end;
$$;

grant execute on function public.declare_contribution(text, numeric, text, text) to anon, authenticated;

-- L'ancienne signature a deux arguments disparait : sans cela, PostgREST
-- hesiterait entre les deux et renverrait une erreur d'ambiguite.
drop function if exists public.declare_contribution(text, numeric);


-- ─── 4. Verification ────────────────────────────────────────────────────────
-- Resultat attendu : une seule fonction, avec ses quatre arguments.

select proname, pg_get_function_identity_arguments(oid) as arguments, prosecdef
from pg_proc
where pronamespace = 'public'::regnamespace and proname = 'declare_contribution';
