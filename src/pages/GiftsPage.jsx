import { useState, useEffect } from "react";
import { C, SERIF, SANS } from "../lib/theme";
import { useIsMobile } from "../lib/useIsMobile";
import { declareContribution } from "../lib/api";
import { GIFTS, giftCategories, catName } from "../data/gifts";
import { IBAN_INFO, WERO_TEL } from "../data/config";
import SectionTitle from "../components/SectionTitle";

// Participation minimale, et pas de la jauge.
const MIN_GIFT = 40;
const STEP_GIFT = 5;

/**
 * Bornes de la jauge pour un cadeau donne.
 *
 * On ne propose jamais plus que le reste a financer, sinon la barre de
 * progression depasserait 100 %. Quand ce reste est trop faible pour une
 * jauge (< 40 € ou un seul cran possible), le montant est impose.
 */
function giftRange(price, collected) {
  const remaining = Math.max(0, price - collected);
  const max = Math.max(MIN_GIFT, Math.floor(remaining / STEP_GIFT) * STEP_GIFT);
  const fixed = remaining <= MIN_GIFT || max <= MIN_GIFT;

  return {
    remaining,
    max,
    fixed,
    // Defaut volontairement modeste : le curseur ne suggere pas un gros don.
    initial: fixed ? Math.min(remaining, MIN_GIFT) : Math.min(max, 50),
  };
}

const detailTitle = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.greenMid, fontWeight: 500 };

/* ─── Briques d'interface ─────────────────────────────────────────────── */

function MethodBtn({ icon, label, sub, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 16px",
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.green }}>{label}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>
        {children}
      </div>
      <span style={{ fontSize: 13, color: C.light }}>›</span>
    </button>
  );
}

/** Pastilles des reseaux, dessinees en CSS pour ne dependre d'aucune image. */
function CardBadges() {
  const badge = {
    fontFamily: SANS,
    fontSize: 8.5,
    letterSpacing: "0.06em",
    fontWeight: 600,
    color: C.greenMid,
    border: `1px solid ${C.border}`,
    backgroundColor: C.offWhite,
    borderRadius: 3,
    padding: "2px 5px",
    lineHeight: 1.2,
  };
  return (
    <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
      {["VISA", "MASTERCARD", "AMEX", "CB"].map((n) => (
        <span key={n} style={badge}>
          {n}
        </span>
      ))}
    </div>
  );
}

/** Valeur mise en avant, avec copie en un clic. */
function CopyRow({ value, mono, big, tg }) {
  const [done, setDone] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(value).then(
      () => {
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      },
      () => {}
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      <span
        style={{
          fontFamily: mono ? "monospace" : SERIF,
          fontSize: big ? 26 : 15,
          color: C.green,
          fontWeight: 500,
          wordBreak: "break-all",
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <button
        onClick={copy}
        style={{
          background: "none",
          border: `1px solid ${done ? C.success : C.border}`,
          color: done ? C.success : C.muted,
          borderRadius: 6,
          padding: "4px 9px",
          fontSize: 11,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {done ? tg.copied : tg.copy}
      </button>
    </div>
  );
}

/** Popup centre, ferme par Echap, par le fond ou par « Annuler ». */
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // Empeche la page de defiler derriere le popup.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(28,51,32,0.7)",
        zIndex: 9997,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          padding: "32px 28px 26px",
          maxWidth: 440,
          width: "100%",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          margin: "auto",
        }}
      >
        <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 400, color: C.green, margin: "0 0 6px", textAlign: "center" }}>{title}</h3>
        <div style={{ width: 36, height: 1, backgroundColor: C.gold, margin: "0 auto 22px" }} />
        {children}
      </div>
    </div>
  );
}

const greenBtn = {
  width: "100%",
  padding: "14px 20px",
  backgroundColor: C.success,
  color: C.offWhite,
  border: "none",
  borderRadius: 9,
  cursor: "pointer",
  fontFamily: SANS,
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

/* ─── Etape 1 : le montant ────────────────────────────────────────────── */

function AmountStep({ range, amount, setAmount, onNext, tg }) {
  const { fixed, max, remaining } = range;

  return (
    <div>
      <p style={{ ...detailTitle, marginBottom: 4 }}>{tg.amountTitle}</p>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 18, lineHeight: 1.65 }}>
        {fixed ? tg.amountOnly.replace("{n}", remaining) : tg.amountIntro}
      </p>

      <div style={{ textAlign: "center", marginBottom: fixed ? 18 : 10 }}>
        <span style={{ fontFamily: SERIF, fontSize: 44, color: C.gold, lineHeight: 1 }}>{amount}</span>
        <span style={{ fontFamily: SERIF, fontSize: 26, color: C.gold, marginLeft: 4 }}>€</span>
      </div>

      {!fixed && (
        <>
          <input
            className="gift-slider"
            type="range"
            min={MIN_GIFT}
            max={max}
            step={STEP_GIFT}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label={tg.amountTitle}
            aria-valuetext={`${amount} €`}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 2, marginBottom: 18 }}>
            <span>{MIN_GIFT} €</span>
            <span>
              {tg.amountRemaining} {remaining} €
            </span>
            <span>{max} €</span>
          </div>
        </>
      )}

      <button
        onClick={onNext}
        style={{
          width: "100%",
          padding: "13px 20px",
          backgroundColor: C.green,
          color: C.offWhite,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: SANS,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {tg.amountNext}
      </button>
    </div>
  );
}

/* ─── Contenu des popups ──────────────────────────────────────────────── */

function WeroModal({ amount, sending, onConfirm, onClose, tg }) {
  return (
    <Modal title={tg.weroTitle} onClose={onClose}>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 18, textAlign: "center" }}>{tg.weroText}</p>

      <div style={{ backgroundColor: C.cream, borderRadius: 12, padding: "20px 16px", marginBottom: 16 }}>
        <CopyRow value={WERO_TEL} mono big tg={tg} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{tg.amountRecap}</span>
        <span style={{ fontFamily: SERIF, fontSize: 24, color: C.gold }}>{amount} €</span>
      </div>
      <p style={{ fontSize: 11, color: C.muted, fontStyle: "italic", marginBottom: 22 }}>{tg.weroNote}</p>

      <button onClick={onConfirm} disabled={sending} style={{ ...greenBtn, opacity: sending ? 0.6 : 1 }}>
        {sending ? tg.sending : tg.doneWero}
      </button>
      <button
        onClick={onClose}
        style={{ width: "100%", background: "none", border: "none", color: C.muted, fontSize: 12, padding: "12px 0 0", cursor: "pointer" }}
      >
        {tg.cancel}
      </button>
    </Modal>
  );
}

function IbanModal({ gift, amount, sending, onConfirm, onClose, tg, lang }) {
  const rows = [
    [tg.ibanBene, IBAN_INFO.nom, false],
    ["BIC / SWIFT", IBAN_INFO.bic, true],
    [tg.ibanRef, gift.name[lang], false],
  ];

  return (
    <Modal title={tg.ibanTitle} onClose={onClose}>
      <div style={{ backgroundColor: C.cream, borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
        <p style={{ ...detailTitle, marginBottom: 10, textAlign: "center" }}>IBAN</p>
        <CopyRow value={IBAN_INFO.iban} mono tg={tg} />
      </div>

      {rows.map(([key, value, mono]) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, gap: 12 }}>
          <span style={{ color: C.muted, flexShrink: 0, fontSize: 12 }}>{key}</span>
          <span style={{ color: C.green, fontFamily: mono ? "monospace" : "inherit", fontSize: 13, wordBreak: "break-all", textAlign: "right" }}>
            {value}
          </span>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 12, color: C.muted }}>{tg.amountRecap}</span>
        <span style={{ fontFamily: SERIF, fontSize: 24, color: C.gold }}>{amount} €</span>
      </div>
      <p style={{ fontSize: 11, color: C.muted, fontStyle: "italic", margin: "8px 0 22px" }}>{tg.ibanNote}</p>

      <button onClick={onConfirm} disabled={sending} style={{ ...greenBtn, opacity: sending ? 0.6 : 1 }}>
        {sending ? tg.sending : tg.doneIban}
      </button>
      <button
        onClick={onClose}
        style={{ width: "100%", background: "none", border: "none", color: C.muted, fontSize: 12, padding: "12px 0 0", cursor: "pointer" }}
      >
        {tg.cancel}
      </button>
    </Modal>
  );
}

function CardModal({ gift, amount, onClose, tg }) {
  return (
    <Modal title={tg.cardTitle} onClose={onClose}>
      {gift.stripe ? (
        <>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 18, textAlign: "center" }}>{tg.cardText}</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <CardBadges />
          </div>
          <button
            onClick={() => {
              window.open(gift.stripe, "_blank", "noopener,noreferrer");
              onClose();
            }}
            style={{ ...greenBtn, backgroundColor: C.green }}
          >
            {tg.cardGo.replace("{n}", amount)}
          </button>
        </>
      ) : (
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, marginBottom: 20, textAlign: "center" }}>{tg.cardSoon}</p>
      )}
      <button
        onClick={onClose}
        style={{ width: "100%", background: "none", border: "none", color: C.muted, fontSize: 12, padding: "12px 0 0", cursor: "pointer" }}
      >
        {tg.cancel}
      </button>
    </Modal>
  );
}

/* ─── Etape 2 : le moyen de paiement ──────────────────────────────────── */

function MethodStep({ gift, amount, onBack, payMethod, setPayMethod, onDeclared, showToast, onDone, t, lang }) {
  const tg = t.gifts;
  const [sending, setSending] = useState(false);

  const confirm = async () => {
    setSending(true);
    try {
      const total = await declareContribution(gift.id, amount);
      onDeclared(gift.id, total);
      setPayMethod(null);
      onDone();
      showToast(tg.thanks);
    } catch (error) {
      console.error(error);
      showToast(tg.declareError);
    } finally {
      setSending(false);
    }
  };

  const close = () => setPayMethod(null);

  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 12, color: C.muted, marginBottom: 12 }}
      >
        {tg.amountBack}
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          backgroundColor: C.cream,
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 12, color: C.greenMid }}>{tg.amountRecap}</span>
        <span style={{ fontFamily: SERIF, fontSize: 22, color: C.gold }}>{amount} €</span>
      </div>

      <p style={{ fontSize: 13, color: C.muted, marginBottom: 18, lineHeight: 1.65 }}>{tg.payIntro}</p>

      <p style={{ ...detailTitle, color: C.success, marginBottom: 9 }}>{tg.groupFree}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        <MethodBtn icon="📱" label={tg.weroLabel} sub={tg.weroSub} onClick={() => setPayMethod("wero")} />
        <MethodBtn icon="🏦" label={tg.ibanLabel} sub={tg.ibanSub} onClick={() => setPayMethod("iban")} />
      </div>

      <p style={{ ...detailTitle, marginBottom: 9 }}>{tg.groupCard}</p>
      <MethodBtn icon="💳" label={tg.stripeLabel} sub={tg.stripeSub} onClick={() => setPayMethod("card")}>
        <CardBadges />
      </MethodBtn>

      {payMethod === "wero" && <WeroModal amount={amount} sending={sending} onConfirm={confirm} onClose={close} tg={tg} />}
      {payMethod === "iban" && (
        <IbanModal gift={gift} amount={amount} sending={sending} onConfirm={confirm} onClose={close} tg={tg} lang={lang} />
      )}
      {payMethod === "card" && <CardModal gift={gift} amount={amount} onClose={close} tg={tg} />}
    </div>
  );
}

function PaymentPanel({ gift, price, contrib, payMethod, setPayMethod, onDeclared, showToast, onDone, t, lang }) {
  const range = giftRange(price, contrib);
  const [amount, setAmount] = useState(range.initial);
  const [step, setStep] = useState("amount");

  return (
    <div style={{ borderTop: `1px solid ${C.cream}`, backgroundColor: "#F6F3EC", padding: "20px 20px 24px" }}>
      {step === "amount" ? (
        <AmountStep range={range} amount={amount} setAmount={setAmount} onNext={() => setStep("method")} tg={t.gifts} />
      ) : (
        <MethodStep
          gift={gift}
          amount={amount}
          onBack={() => {
            setStep("amount");
            setPayMethod(null);
          }}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          onDeclared={onDeclared}
          showToast={showToast}
          onDone={onDone}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

/* ─── Carte cadeau et page ────────────────────────────────────────────── */

function GiftCard({ gift, price, contrib, isOpen, onToggle, onClose, payMethod, setPayMethod, onDeclared, showToast, t, lang }) {
  const tg = t.gifts;
  const pct = Math.min(100, Math.round((contrib / price) * 100));
  const full = pct >= 100;

  return (
    <div
      style={{
        backgroundColor: C.card,
        border: `1px solid ${isOpen ? C.gold : C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        opacity: full ? 0.65 : 1,
        boxShadow: isOpen ? "0 6px 24px rgba(28,51,32,0.10)" : "0 2px 10px rgba(28,51,32,0.04)",
      }}
    >
      <div style={{ aspectRatio: "4/3", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img
          src={gift.img}
          alt={gift.name[lang]}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 14, boxSizing: "border-box", filter: full ? "grayscale(60%)" : "none" }}
        />
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500, margin: 0, color: C.green, lineHeight: 1.3 }}>
            {full && <span style={{ color: C.success }}>✓ </span>}
            {gift.name[lang]}
          </h3>
          <span style={{ fontFamily: SERIF, fontSize: 18, color: C.gold, flexShrink: 0 }}>{price} €</span>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ height: 3, backgroundColor: C.cream, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, backgroundColor: full ? C.success : C.gold, borderRadius: 2, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 11, color: C.muted }}>
            <span>{Math.round(contrib)} {tg.collected}</span>
            <span style={{ fontWeight: 500, color: full ? C.success : C.gold }}>{pct}%</span>
          </div>
        </div>

        {full ? (
          <div style={{ textAlign: "center", fontSize: 14, color: C.success, fontStyle: "italic", fontFamily: SERIF }}>{tg.completed}</div>
        ) : (
          <button
            onClick={onToggle}
            aria-expanded={isOpen}
            style={{
              width: "100%",
              padding: "10px 16px",
              backgroundColor: isOpen ? C.cream : C.green,
              color: isOpen ? C.green : C.offWhite,
              border: "none",
              cursor: "pointer",
              borderRadius: 7,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {isOpen ? tg.close : tg.participate}
          </button>
        )}
      </div>

      {isOpen && !full && (
        <PaymentPanel
          gift={gift}
          price={price}
          contrib={contrib}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          onDeclared={onDeclared}
          showToast={showToast}
          onDone={onClose}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

export default function GiftsPage({ contribs, prices, loaded, openGift, setOpenGift, payMethod, setPayMethod, onDeclared, showToast, t, lang }) {
  const isMobile = useIsMobile();
  const tg = t.gifts;
  const priceOf = (gift) => prices[gift.id] ?? gift.amount;

  if (!loaded) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: SERIF, fontSize: 20, fontStyle: "italic", color: C.muted }}>
        {tg.loading}
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "8px 0" : "40px 0" }}>
      <SectionTitle title={tg.title} subtitle={tg.subtitle} />

      {giftCategories(lang).map((cat) => {
        const gifts = GIFTS.filter((g) => catName(g, lang) === cat.name);

        return (
          <div key={cat.name} style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${C.green}` }}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <h2 style={{ fontFamily: SERIF, fontSize: isMobile ? 26 : 34, fontWeight: 400, margin: 0, color: C.green }}>{cat.name}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 24, alignItems: "start" }}>
              {gifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  price={priceOf(gift)}
                  contrib={contribs[gift.id] || 0}
                  isOpen={openGift === gift.id}
                  onToggle={() => setOpenGift(openGift === gift.id ? null : gift.id)}
                  onClose={() => setOpenGift(null)}
                  payMethod={payMethod}
                  setPayMethod={setPayMethod}
                  onDeclared={onDeclared}
                  showToast={showToast}
                  t={t}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
