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

function GiftRow({ gift, current, editVal, setEditVals, onSave, ta, lang }) {
  const pct = Math.min(100, Math.round((current / gift.amount) * 100));

  return (
    <div style={{ padding: "18px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: C.green, marginBottom: 4 }}>{gift.name[lang]}</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
            {catName(gift, lang)} · {ta.target} : {gift.amount} €
          </div>
          <div style={{ height: 3, backgroundColor: C.cream, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, backgroundColor: pct >= 100 ? C.success : C.gold, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
            {Math.round(current)} € {ta.collected2} ({pct}%)
            {pct >= 100 && <span style={{ color: C.success, marginLeft: 6 }}>✓ {ta.completed2}</span>}
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <label htmlFor={`amount-${gift.id}`} style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 5 }}>
            {ta.amount}
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <input
              id={`amount-${gift.id}`}
              type="number"
              min="0"
              max={gift.amount}
              step="1"
              value={editVal}
              onChange={(e) => setEditVals((prev) => ({ ...prev, [gift.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && onSave(gift.id, editVal)}
              style={{ width: 92, padding: "9px 10px", border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 14, backgroundColor: C.card, color: C.green }}
            />
            <span style={{ fontSize: 13, color: C.muted }}>/ {gift.amount} €</span>
            <button
              onClick={() => onSave(gift.id, editVal)}
              aria-label={`${ta.amount} ${gift.name[lang]}`}
              style={{ backgroundColor: C.gold, color: C.offWhite, border: "none", borderRadius: 7, width: 38, height: 38, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✓
            </button>
          </div>
        </div>
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
export default function AdminPage({ contribs, onSaved, onClose, showToast, t, lang }) {
  const ta = t.admin;

  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [editVals, setEditVals] = useState({});

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
            return (
              <GiftRow
                key={gift.id}
                gift={gift}
                current={current}
                editVal={editVals[gift.id] !== undefined ? editVals[gift.id] : current}
                setEditVals={setEditVals}
                onSave={save}
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
