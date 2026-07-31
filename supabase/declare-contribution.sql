-- ============================================================================
--  Fonction `declare_contribution` : l'invite declare sa participation
--
--  A executer une fois dans Supabase → SQL Editor → New query, puis « Run ».
--  Idempotent (create or replace) et n'efface aucune donnee.
--
--  Le probleme : la table `contributions` est verrouillee par RLS, seul un
--  compte connecte peut ecrire (voir setup.sql). Or un invite qui vient de
--  faire son virement doit pouvoir faire monter la jauge lui-meme.
--
--  La solution : plutot que de rouvrir la table en ecriture aux anonymes --
--  ce qui permettrait de tout reecrire, y compris afficher « cadeau offert »
--  partout -- on expose UNE SEULE operation, en `security definer` :
--  ajouter un montant borne au cadeau vise. Impossible de fixer une valeur
--  arbitraire, de la diminuer, ni de toucher a `price`.
--
--  Limite assumee : la declaration n'est pas verifiee. Un plaisantin peut
--  appeler la fonction plusieurs fois pour gonfler une jauge. Il ne peut en
--  revanche jamais la baisser, ni modifier un prix. Les montants restent a
--  recouper avec le compte bancaire, et l'espace admin permet de corriger.
-- ============================================================================


create or replace function public.declare_contribution(gift_id text, delta numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  ceiling numeric;
  updated numeric;
begin
  -- Bornes de base : un cadeau se declare entre 5 et 5000 EUR.
  if delta is null or delta < 5 or delta > 5000 then
    raise exception 'montant hors bornes';
  end if;

  if gift_id is null or length(gift_id) = 0 or length(gift_id) > 20 then
    raise exception 'cadeau inconnu';
  end if;

  -- `contributions.amount` designe la ligne deja presente ; `excluded`, celle
  -- qu'on tentait d'inserer. Le nom doit rester tel qu'ecrit dans le INSERT.
  insert into contributions (id, amount)
  values (gift_id, delta)
  on conflict (id) do update
    set amount = coalesce(contributions.amount, 0) + excluded.amount
  returning amount, price into updated, ceiling;

  -- Quand un prix a ete fixe en admin, la collecte ne le depasse jamais.
  if ceiling is not null and updated > ceiling then
    update contributions set amount = ceiling where id = gift_id;
    updated := ceiling;
  end if;

  return updated;
end;
$$;


-- Les invites (anon) et l'admin (authenticated) peuvent appeler la fonction.
-- C'est le seul chemin d'ecriture ouvert aux visiteurs non connectes.
grant execute on function public.declare_contribution(text, numeric) to anon, authenticated;


-- ─── Verification ───────────────────────────────────────────────────────────
-- Resultat attendu : une ligne, prosecdef = true (security definer).

select proname, prosecdef
from pg_proc
where pronamespace = 'public'::regnamespace and proname = 'declare_contribution';
