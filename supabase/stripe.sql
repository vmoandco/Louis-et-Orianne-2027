-- ============================================================================
--  Enregistrement des paiements par carte (Stripe)
--
--  A executer une fois dans Supabase → SQL Editor → New query, puis « Run ».
--  Idempotent, n'efface aucune donnee existante.
--
--  Le webhook Stripe appelle `declare_stripe_payment` quand un paiement est
--  confirme. Deux differences avec la declaration d'un invite :
--
--  1. Stripe rejoue ses webhooks en cas de reponse en erreur ou de timeout.
--     Sans garde-fou, un meme paiement serait compte plusieurs fois : la
--     session Stripe sert donc de clef unique.
--
--  2. Cette fonction n'est PAS ouverte aux visiteurs, contrairement a
--     `declare_contribution`. N'importe qui pourrait sinon declarer de faux
--     paiements par carte. Seule la clef `service_role`, qui ne quitte
--     jamais le serveur, peut l'appeler.
-- ============================================================================


-- ─── 1. La clef d'idempotence ───────────────────────────────────────────────

alter table public.declarations
  add column if not exists stripe_session_id text;

create unique index if not exists declarations_stripe_session_id_key
  on public.declarations (stripe_session_id)
  where stripe_session_id is not null;


-- ─── 2. La fonction ─────────────────────────────────────────────────────────

create or replace function public.declare_stripe_payment(
  session_id text,
  gift_id    text,
  delta      numeric,
  guest_name text default null,
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
  if session_id is null or length(session_id) = 0 then
    raise exception 'session manquante';
  end if;

  if delta is null or delta <= 0 then
    raise exception 'montant hors bornes';
  end if;

  -- On tente d'abord la trace : si la session est deja connue, c'est un
  -- rejeu, et on ressort le total actuel sans rien incrementer.
  insert into declarations (gift_id, amount, guest_name, method, message, stripe_session_id)
  values (
    gift_id,
    delta,
    nullif(btrim(left(coalesce(guest_name, ''), 60)), ''),
    'carte',
    nullif(btrim(left(coalesce(message, ''), 500)), ''),
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


-- ─── 3. Verrouillage ────────────────────────────────────────────────────────
-- Personne d'autre que le serveur ne doit pouvoir enregistrer un paiement.

revoke all on function public.declare_stripe_payment(text, text, numeric, text, text) from public;
revoke all on function public.declare_stripe_payment(text, text, numeric, text, text) from anon;
revoke all on function public.declare_stripe_payment(text, text, numeric, text, text) from authenticated;
grant execute on function public.declare_stripe_payment(text, text, numeric, text, text) to service_role;


-- ─── 4. Verification ────────────────────────────────────────────────────────
-- Resultat attendu : une ligne, prosecdef = true, et des droits limites a
-- service_role.

select p.proname, p.prosecdef, array_to_string(p.proacl, ' | ') as droits
from pg_proc p
where p.pronamespace = 'public'::regnamespace and p.proname = 'declare_stripe_payment';
