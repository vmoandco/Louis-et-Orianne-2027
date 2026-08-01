-- ============================================================================
--  Message laisse par l'invite au moment de sa participation
--
--  A executer une fois dans Supabase → SQL Editor → New query, puis « Run ».
--  Idempotent, n'efface aucune donnee existante.
--
--  Suite de declarations.sql : le journal enregistrait deja qui, quoi et
--  comment ; il conserve desormais aussi le mot laisse par l'invite.
-- ============================================================================


-- ─── 1. La colonne ──────────────────────────────────────────────────────────

alter table public.declarations
  add column if not exists message text;


-- ─── 2. La fonction transmet le message ─────────────────────────────────────
-- `message` a une valeur par defaut : un client qui ne l'envoie pas encore
-- (onglet ouvert avant la mise a jour du site) continue de fonctionner.

create or replace function public.declare_contribution(
  gift_id    text,
  delta      numeric,
  guest_name text default null,
  method     text default null,
  message    text default null
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

  insert into declarations (gift_id, amount, guest_name, method, message)
  values (
    gift_id,
    delta,
    nullif(btrim(left(coalesce(guest_name, ''), 60)), ''),
    nullif(btrim(left(coalesce(method, ''), 20)), ''),
    nullif(btrim(left(coalesce(message, ''), 500)), '')
  );

  return updated;
end;
$$;

grant execute on function public.declare_contribution(text, numeric, text, text, text) to anon, authenticated;

-- L'ancienne signature a quatre arguments disparait : sans cela, PostgREST
-- hesiterait entre les deux versions.
drop function if exists public.declare_contribution(text, numeric, text, text);


-- ─── 3. Verification ────────────────────────────────────────────────────────
-- Resultat attendu : une seule fonction, avec ses cinq arguments.

select proname, pg_get_function_identity_arguments(oid) as arguments, prosecdef
from pg_proc
where pronamespace = 'public'::regnamespace and proname = 'declare_contribution';
