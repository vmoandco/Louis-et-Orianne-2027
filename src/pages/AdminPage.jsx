import { useState, useEffect } from "react";
import { C, SERIF, SANS } from "../lib/theme";
import { supabase } from "../lib/supabase";
import { GIFTS, catName } from "../data/gifts";
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

  // Reprend une session ouverte lors d'une visite précédente.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session) setAuthed(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
