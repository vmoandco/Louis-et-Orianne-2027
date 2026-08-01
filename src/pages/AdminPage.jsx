import { useState, useEffect } from "react";
import { C, SERIF, SANS } from "../lib/theme";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { GIFTS, HONEYMOON, catName } from "../data/gifts";
import { ADMIN_EMAIL } from "../data/config";
import SectionTitle from "../components/SectionTitle";

function LoginForm({ pwd, setPwd, onAuth, ta }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAuth();
      }}
      style={{ textAlign: "center", maxWidth: 380, margin: "0 auto" }}
    >
      <label htmlFor="admin-pwd" style={{ display: "block", fontSize: 14, color: C.muted, marginBottom: 20 }}>
        {ta.pwd}
      </label>
      <input
        id="admin-pwd"
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        style={{ width: "100%", padding: "13px 16px", border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 14, backgroundColor: C.card, color: C.green, marginBottom: 12, boxSizing: "border-box" }}
      />
      <button
        type="submit"
        style={{ width: "100%", padding: "13px 20px", backgroundColor: C.green, color: C.offWhite, border: "none", borderRadius: 9, cursor: "pointer", fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}
      >
        {ta.access}
      </button>
    </form>
  );
}

/** Champ numerique + bouton de validation, partage par le prix et le collecte. */
function EditField({ id, label, value, onChange, onSave, suffix, ariaLabel }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <input
          id={id}
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
          style={{ width: 92, padding: "9px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 14, backgroundColor: C.card, color: C.green }}
        />
        <span style={{ fontSize: 13, color: C.muted, minWidth: 46 }}>{suffix}</span>
        <button
          onClick={onSave}
          aria-label={ariaLabel}
          style={{ backgroundColor: C.gold, color: C.offWhite, border: "none", borderRadius: 7, width: 38, height: 38, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          ✓
        </button>
      </div>
    </div>
  );
}

/** Bandeau des deux totaux, recalcule a chaque rendu depuis GIFTS + prices/contribs. */
function TotalsBar({ totalPrice, totalCollected, ta }) {
  const pct = totalPrice > 0 ? Math.min(100, Math.round((totalCollected / totalPrice) * 100)) : 0;

  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200, backgroundColor: C.cream, borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.greenMid, marginBottom: 6 }}>{ta.totalTarget}</div>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: C.green }}>{Math.round(totalPrice)} €</div>
      </div>
      <div style={{ flex: 1, minWidth: 200, backgroundColor: C.cream, borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.greenMid, marginBottom: 6 }}>{ta.totalCollected}</div>
        <div style={{ fontFamily: SERIF, fontSize: 28, color: C.gold }}>
          {Math.round(totalCollected)} € <span style={{ fontSize: 15, color: C.muted }}>({pct}%)</span>
        </div>
      </div>
    </div>
  );
}

/** Journal des participations declarees par les invites, la plus recente en tete. */
function DeclarationLog({ rows, onDelete, ta, lang }) {
  const nameOf = (giftId) => {
    if (giftId === HONEYMOON.id) return HONEYMOON.name[lang];
    const gift = GIFTS.find((g) => g.id === giftId);
    return gift ? gift.name[lang] : giftId;
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.green, marginBottom: 14 }}>
        {ta.log} {rows.length > 0 && <span style={{ fontSize: 14, color: C.muted }}>({rows.length})</span>}
      </h3>

      {rows.length === 0 ? (
        <p style={{ fontSize: 14, color: C.muted, fontStyle: "italic" }}>{ta.logEmpty}</p>
      ) : (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {rows.map((row, i) => (
            <div
              key={row.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderTop: i === 0 ? "none" : `1px solid ${C.border}`,
                backgroundColor: i % 2 ? C.offWhite : C.card,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: C.green, fontWeight: 500 }}>
                  {row.guest_name || <span style={{ color: C.light, fontStyle: "italic" }}>{ta.logAnon}</span>}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {nameOf(row.gift_id)}
                  {row.method && ` · ${row.method}`}
                  {" · "}
                  {new Date(row.created_at).toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <span style={{ fontFamily: SERIF, fontSize: 18, color: C.gold, flexShrink: 0 }}>{Math.round(row.amount)} €</span>
              <button
                onClick={() => onDelete(row.id)}
                aria-label={ta.logDelete}
                title={ta.logDelete}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.light, fontSize: 16, padding: "2px 4px", flexShrink: 0 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GiftRow({ gift, price, current, editVal, editPrice, setEditVals, setEditPrices, onSave, onSavePrice, ta, lang }) {
  const pct = Math.min(100, Math.round((current / price) * 100));

  return (
    <div style={{ padding: "18px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: C.green, marginBottom: 4 }}>{gift.name[lang]}</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
            {catName(gift, lang)} · {ta.target} : {price} €
          </div>
          <div style={{ height: 3, backgroundColor: C.cream, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, backgroundColor: pct >= 100 ? C.success : C.gold, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
            {Math.round(current)} € {ta.collected2} ({pct}%)
            {pct >= 100 && <span style={{ color: C.success, marginLeft: 6 }}>✓ {ta.completed2}</span>}
          </div>
        </div>

        <EditField
          id={`price-${gift.id}`}
          label={ta.price}
          value={editPrice}
          onChange={(v) => setEditPrices((prev) => ({ ...prev, [gift.id]: v }))}
          onSave={() => onSavePrice(gift.id, editPrice)}
          suffix="€"
          ariaLabel={`${ta.price} ${gift.name[lang]}`}
        />

        <EditField
          id={`amount-${gift.id}`}
          label={ta.amount}
          value={editVal}
          onChange={(v) => setEditVals((prev) => ({ ...prev, [gift.id]: v }))}
          onSave={() => onSave(gift.id, editVal)}
          suffix={`/ ${price} €`}
          ariaLabel={`${ta.amount} ${gift.name[lang]}`}
        />
      </div>
    </div>
  );
}

/**
 * Espace admin : authentification, saisie des montants collectés.
 *
 * Toute la logique Supabase (auth + écriture) vit ici pour que le SDK reste
 * hors du bundle initial — ce module est importé paresseusement par <App>.
 */
export default function AdminPage({ contribs, prices, onSaved, onPriceSaved, onClose, showToast, t, lang }) {
  const ta = t.admin;

  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [editVals, setEditVals] = useState({});
  const [editPrices, setEditPrices] = useState({});
  const [declarations, setDeclarations] = useState([]);

  // Reprend une session ouverte lors d'une visite précédente.
  // Les hooks sont enregistrés pendant le rendu, donc cet effet s'exécute même
  // quand le composant sort plus bas par le retour anticipé « non configuré » :
  // sans cette garde, `supabase` valant null y provoquait un plantage.
  useEffect(() => {
    if (!supabase) return undefined;

    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session) setAuthed(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Le journal n'est lisible que par un compte connecte : on le charge donc
  // apres l'authentification, pas au montage du composant.
  useEffect(() => {
    if (!authed || !supabase) return;
    let cancelled = false;
    supabase
      .from("declarations")
      .select("id,gift_id,amount,guest_name,method,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          // La table peut ne pas exister encore : inutile d'alarmer.
          console.error("Journal des participations indisponible :", error.message);
          return;
        }
        setDeclarations(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  const deleteDeclaration = async (id) => {
    const { error } = await supabase.from("declarations").delete().eq("id", id);
    if (error) {
      showToast(ta.saveError);
      return;
    }
    setDeclarations((prev) => prev.filter((row) => row.id !== id));
    showToast(ta.logDeleted);
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: pwd });
    if (error) showToast(ta.wrong);
    else setAuthed(true);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setPwd("");
    onClose();
  };

  const save = async (id, value) => {
    const amount = Math.max(0, parseFloat(value) || 0);
    const { error } = await supabase.from("contributions").upsert({ id, amount });

    if (error) {
      showToast(ta.saveError);
      return;
    }
    onSaved(id, amount);
    showToast(ta.saved);
  };

  const savePrice = async (id, value) => {
    const price = Math.max(0, parseFloat(value) || 0);
    const { error } = await supabase.from("contributions").upsert({ id, price });

    if (error) {
      showToast(ta.saveError);
      return;
    }
    onPriceSaved(id, price);
    showToast(ta.priceSaved);
  };

  // Sans configuration Supabase, mieux vaut un diagnostic lisible qu'un
  // formulaire de connexion qui echouerait sans expliquer pourquoi.
  if (!isSupabaseConfigured) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px" }}>
        <SectionTitle title={ta.title} />
        <div style={{ backgroundColor: C.cream, borderRadius: 12, padding: "20px 24px", fontSize: 14, lineHeight: 1.8, color: C.greenMid }}>
          <strong style={{ color: C.green }}>{ta.notConfigured}</strong>
          <br />
          {ta.notConfiguredHelp}
          <br />
          <code style={{ fontFamily: "monospace", fontSize: 13, color: C.green }}>VITE_SUPABASE_URL</code>
          {" · "}
          <code style={{ fontFamily: "monospace", fontSize: 13, color: C.green }}>VITE_SUPABASE_KEY</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px" }}>
      <SectionTitle title={ta.title} />

      {!authed ? (
        <LoginForm pwd={pwd} setPwd={setPwd} onAuth={signIn} ta={ta} />
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={signOut} style={{ background: "none", border: `1px solid ${C.border}`, cursor: "pointer", padding: "8px 16px", borderRadius: 6, fontSize: 12, color: C.muted }}>
              {ta.signout}
            </button>
          </div>

          <TotalsBar
            totalPrice={GIFTS.reduce((sum, g) => sum + (prices[g.id] ?? g.amount), 0)}
            totalCollected={GIFTS.reduce((sum, g) => sum + (contribs[g.id] || 0), 0) + (contribs[HONEYMOON.id] || 0)}
            ta={ta}
          />

          <DeclarationLog rows={declarations} onDelete={deleteDeclaration} ta={ta} lang={lang} />

          <div style={{ backgroundColor: C.cream, borderRadius: 12, padding: "16px 20px", marginBottom: 32, fontSize: 14, lineHeight: 1.75, color: C.greenMid }}>
            {ta.note}
          </div>

          {GIFTS.map((gift) => {
            const current = contribs[gift.id] || 0;
            const price = prices[gift.id] ?? gift.amount;
            return (
              <GiftRow
                key={gift.id}
                gift={gift}
                price={price}
                current={current}
                editVal={editVals[gift.id] !== undefined ? editVals[gift.id] : current}
                editPrice={editPrices[gift.id] !== undefined ? editPrices[gift.id] : price}
                setEditVals={setEditVals}
                setEditPrices={setEditPrices}
                onSave={save}
                onSavePrice={savePrice}
                ta={ta}
                lang={lang}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
