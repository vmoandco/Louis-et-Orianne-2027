-- ============================================================================
--  Adresse e-mail de l'invite
--
--  A executer une fois dans Supabase → SQL Editor → New query, puis « Run ».
--  Idempotent, n'efface aucune donnee existante.
--
--  Permet de remercier chaque participant, et de le recontacter en cas de
--  doute sur un virement. Les deux fonctions d'enregistrement la transmettent
--  desormais : celle des invites et celle du webhook Stripe.
-- ============================================================================


-- ─── 1. La colonne ──────────────────────────────────────────────────────────

alter table public.declarations
  add column if not exists guest_email text;


-- ─── 2. Declaration d'un invite (Wero, Revolut, virement) ───────────────────

create or replace function public.declare_contribution(
  gift_id     text,
  delta       numeric,
  guest_name  text default null,
  method      text default null,
  message     text default null,
  guest_email text default null
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

  insert into declarations (gift_id, amount, guest_name, method, message, guest_email)
  values (
    gift_id,
    delta,
    nullif(btrim(left(coalesce(guest_name, ''), 60)), ''),
    nullif(btrim(left(coalesce(method, ''), 20)), ''),
    nullif(btrim(left(coalesce(message, ''), 500)), ''),
    nullif(btrim(left(coalesce(guest_email, ''), 120)), '')
  );

  return updated;
end;
$$;

grant execute on function public.declare_contribution(text, numeric, text, text, text, text) to anon, authenticated;

-- L'ancienne signature a cinq arguments disparait, pour que PostgREST n'ait
-- pas a choisir entre deux versions.
drop function if exists public.declare_contribution(text, numeric, text, text, text);


-- ─── 3. Paiement par carte (webhook Stripe) ─────────────────────────────────
-- Meme ajout, et toujours reserve a la clef service_role.

create or replace function public.declare_stripe_payment(
  session_id  text,
  gift_id     text,
  delta       numeric,
  guest_name  text default null,
  message     text default null,
  guest_email text default null
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
  if session_id is null or length(session_id) = 0 then
    raise exception 'session manquante';
  end if;

  if delta is null or delta <= 0 then
    raise exception 'montant hors bornes';
  end if;

  insert into declarations (gift_id, amount, guest_name, method, message, guest_email, stripe_session_id)
  values (
    gift_id,
    delta,
    nullif(btrim(left(coalesce(guest_name, ''), 60)), ''),
    'carte',
    nullif(btrim(left(coalesce(message, ''), 500)), ''),
    nullif(btrim(left(coalesce(guest_email, ''), 120)), ''),
    session_id
  )
  on conflict (stripe_session_id) do nothing;

  if not found then
    return coalesce((select amount from contributions where id = gift_id), 0);
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

  return updated;
end;
$$;

revoke all on function public.declare_stripe_payment(text, text, numeric, text, text, text) from public;
revoke all on function public.declare_stripe_payment(text, text, numeric, text, text, text) from anon;
revoke all on function public.declare_stripe_payment(text, text, numeric, text, text, text) from authenticated;
grant execute on function public.declare_stripe_payment(text, text, numeric, text, text, text) to service_role;

drop function if exists public.declare_stripe_payment(text, text, numeric, text, text);


-- ─── 4. Verification ────────────────────────────────────────────────────────
-- Resultat attendu : deux fonctions, chacune en une seule version.

select proname, pg_get_function_identity_arguments(oid) as arguments, prosecdef
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('declare_contribution', 'declare_stripe_payment')
order by proname;
