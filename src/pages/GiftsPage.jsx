import { useState, useEffect } from "react";
import { C, SERIF, SANS } from "../lib/theme";
import { useIsMobile } from "../lib/useIsMobile";
import { declareContribution } from "../lib/api";
import { GIFTS, giftCategories, catName } from "../data/gifts";
import { IBAN_INFO, WERO_TEL } from "../data/config";
import SectionTitle from "../components/SectionTitle";

// Bornes de la jauge : elle part de 0 et avance de 5 en 5.
const MIN_GIFT = 0;
const STEP_GIFT = 5;
// Montant par defaut a l'ouverture, volontairement modeste.
const DEFAULT_GIFT = 50;
// Plancher impose par `declare_contribution` (voir supabase/declare-contribution.sql) :
// en dessous, la base refuse la declaration. On empeche donc de valider.
const MIN_DECLARE = 5;

/**
 * Echelle typographique : sur telephone, tout le parcours de participation est
 * agrandi de 20 %. Les tailles restent ecrites a leur valeur desktop, ce qui
 * evite d'avoir a maintenir deux jeux de valeurs.
 */
const scaler = (isMobile) => (size) => (isMobile ? Math.round(size * 1.2) : size);

/**
 * Bornes de la jauge pour un cadeau donne.
 *
 * On ne propose jamais plus que le reste a financer, sinon la barre de
 * progression depasserait 100 %. Quand ce reste est trop faible pour une
 * jauge (< 40 € ou un seul cran possible), le montant est impose.
 */
function giftRange(price, collected) {
  const remaining = Math.max(0, price - collected);
  // Plus grand multiple de 5 finançable, pour ne jamais depasser 100 %.
  const max = Math.floor(remaining / STEP_GIFT) * STEP_GIFT;
  // Moins de 5 € restants : plus rien a regler par crans, le montant est impose.
  const fixed = max <= 0;

  return {
    remaining,
    max,
    fixed,
    initial: fixed ? remaining : Math.min(max, DEFAULT_GIFT),
  };
}

const detailTitle = (f) => ({
  fontSize: f(11),
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.greenMid,
  fontWeight: 500,
});

const greenBtn = (f) => ({
  width: "100%",
  padding: "14px 20px",
  backgroundColor: C.success,
  color: C.offWhite,
  border: "none",
  borderRadius: 9,
  cursor: "pointer",
  fontFamily: SANS,
  fontSize: f(12),
  letterSpacing: "0.16em",
  textTransform: "uppercase",
});

const cancelBtn = (f) => ({
  width: "100%",
  background: "none",
  border: "none",
  color: C.muted,
  fontSize: f(12),
  padding: "12px 0 0",
  cursor: "pointer",
});

/* ─── Briques d'interface ─────────────────────────────────────────────── */

function MethodBtn({ icon, label, sub, onClick, f, children }) {
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
      <span style={{ fontSize: f(20) }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontSize: f(13), color: C.green }}>{label}</div>
        <div style={{ fontSize: f(11), color: C.muted, marginTop: 2 }}>{sub}</div>
        {children}
      </div>
      <span style={{ fontSize: f(13), color: C.light }}>›</span>
    </button>
  );
}

/** Pastilles des reseaux, dessinees en CSS pour ne dependre d'aucune image. */
function CardBadges({ f }) {
  const badge = {
    fontFamily: SANS,
    fontSize: f(8.5),
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
function CopyRow({ value, mono, big, tg, f }) {
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
          fontSize: big ? f(26) : f(15),
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
          fontSize: f(11),
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {done ? tg.copied : tg.copy}
      </button>
    </div>
  );
}

/**
 * Popup centre, ferme par Echap, par le fond ou par « Annuler ».
 *
 * `alignItems: center` garde la fenetre au milieu de l'ecran ; quand le
 * contenu depasse la hauteur disponible, c'est le fond qui defile, jamais la
 * page derriere.
 */
function Modal({ title, onClose, f, image, imageAlt, children }) {
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
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          padding: "26px 22px 22px",
          maxWidth: 440,
          width: "100%",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          margin: "auto",
        }}
      >
        {image && (
          <div style={{ height: 118, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <img src={image} alt={imageAlt} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
        )}
        <h3 style={{ fontFamily: SERIF, fontSize: f(24), fontWeight: 400, color: C.green, margin: "0 0 6px", textAlign: "center", lineHeight: 1.25 }}>
          {title}
        </h3>
        <div style={{ width: 36, height: 1, backgroundColor: C.gold, margin: "0 auto 20px" }} />
        {children}
      </div>
    </div>
  );
}

/* ─── Etape 1 : le montant ────────────────────────────────────────────── */

function AmountStep({ range, amount, setAmount, onNext, tg, f }) {
  const { fixed, max, remaining } = range;
  // La base refuse les declarations sous 5 € : on bloque avant, plutot que de
  // laisser l'invite decouvrir l'erreur au moment de confirmer son paiement.
  const tooLow = amount < MIN_DECLARE;

  return (
    <div>
      <p style={{ ...detailTitle(f), marginBottom: 4 }}>{tg.amountTitle}</p>
      <p style={{ fontSize: f(13), color: C.muted, marginBottom: 18, lineHeight: 1.65 }}>
        {fixed ? tg.amountOnly.replace("{n}", remaining) : tg.amountIntro}
      </p>

      <div style={{ textAlign: "center", marginBottom: fixed ? 18 : 10 }}>
        <span style={{ fontFamily: SERIF, fontSize: f(44), color: C.gold, lineHeight: 1 }}>{amount}</span>
        <span style={{ fontFamily: SERIF, fontSize: f(26), color: C.gold, marginLeft: 4 }}>€</span>
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: f(11), color: C.muted, marginTop: 2, marginBottom: 18 }}>
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
        disabled={tooLow}
        style={{
          width: "100%",
          padding: "13px 20px",
          backgroundColor: C.green,
          color: C.offWhite,
          border: "none",
          borderRadius: 8,
          cursor: tooLow ? "not-allowed" : "pointer",
          opacity: tooLow ? 0.45 : 1,
          fontFamily: SANS,
          fontSize: f(11),
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {tg.amountNext}
      </button>
    </div>
  );
}

/* ─── Contenu des moyens de paiement ──────────────────────────────────── */
// Chaque « corps » est rendu soit dans son propre popup (desktop), soit
// directement dans la fenetre de participation (mobile, ou tout est deja
// centre a l'ecran : un popup dans un popup y serait illisible).

function WeroBody({ amount, sending, onConfirm, onClose, tg, f }) {
  return (
    <>
      <p style={{ fontSize: f(13), color: C.muted, lineHeight: 1.7, marginBottom: 18, textAlign: "center" }}>{tg.weroText}</p>

      <div style={{ backgroundColor: C.cream, borderRadius: 12, padding: "20px 16px", marginBottom: 16 }}>
        <CopyRow value={WERO_TEL} mono big tg={tg} f={f} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: f(12), color: C.muted }}>{tg.amountRecap}</span>
        <span style={{ fontFamily: SERIF, fontSize: f(24), color: C.gold }}>{amount} €</span>
      </div>
      <p style={{ fontSize: f(11), color: C.muted, fontStyle: "italic", marginBottom: 22 }}>{tg.weroNote}</p>

      <button onClick={onConfirm} disabled={sending} style={{ ...greenBtn(f), opacity: sending ? 0.6 : 1 }}>
        {sending ? tg.sending : tg.doneWero}
      </button>
      <button onClick={onClose} style={cancelBtn(f)}>
        {tg.cancel}
      </button>
    </>
  );
}

function IbanBody({ gift, amount, sending, onConfirm, onClose, tg, lang, f }) {
  const rows = [
    [tg.ibanBene, IBAN_INFO.nom, false],
    ["BIC / SWIFT", IBAN_INFO.bic, true],
    [tg.ibanRef, gift.name[lang], false],
  ];

  return (
    <>
      <div style={{ backgroundColor: C.cream, borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
        <p style={{ ...detailTitle(f), marginBottom: 10, textAlign: "center" }}>IBAN</p>
        <CopyRow value={IBAN_INFO.iban} mono tg={tg} f={f} />
      </div>

      {rows.map(([key, value, mono]) => (
        <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, gap: 12 }}>
          <span style={{ color: C.muted, flexShrink: 0, fontSize: f(12) }}>{key}</span>
          <span style={{ color: C.green, fontFamily: mono ? "monospace" : "inherit", fontSize: f(13), wordBreak: "break-all", textAlign: "right" }}>
            {value}
          </span>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: f(12), color: C.muted }}>{tg.amountRecap}</span>
        <span style={{ fontFamily: SERIF, fontSize: f(24), color: C.gold }}>{amount} €</span>
      </div>
      <p style={{ fontSize: f(11), color: C.muted, fontStyle: "italic", margin: "8px 0 22px" }}>{tg.ibanNote}</p>

      <button onClick={onConfirm} disabled={sending} style={{ ...greenBtn(f), opacity: sending ? 0.6 : 1 }}>
        {sending ? tg.sending : tg.doneIban}
      </button>
      <button onClick={onClose} style={cancelBtn(f)}>
        {tg.cancel}
      </button>
    </>
  );
}

function CardBody({ gift, amount, onClose, tg, f }) {
  return (
    <>
      {gift.stripe ? (
        <>
          <p style={{ fontSize: f(13), color: C.muted, lineHeight: 1.7, marginBottom: 18, textAlign: "center" }}>{tg.cardText}</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <CardBadges f={f} />
          </div>
          <button
            onClick={() => {
              window.open(gift.stripe, "_blank", "noopener,noreferrer");
              onClose();
            }}
            style={{ ...greenBtn(f), backgroundColor: C.green }}
          >
            {tg.cardGo.replace("{n}", amount)}
          </button>
        </>
      ) : (
        <p style={{ fontSize: f(13), color: C.muted, lineHeight: 1.75, marginBottom: 20, textAlign: "center" }}>{tg.cardSoon}</p>
      )}
      <button onClick={onClose} style={cancelBtn(f)}>
        {tg.cancel}
      </button>
    </>
  );
}

const METHOD_TITLE = { wero: "weroTitle", iban: "ibanTitle", card: "cardTitle" };

/* ─── Etape 2 : le moyen de paiement ──────────────────────────────────── */

function MethodStep({ gift, amount, onBack, payMethod, setPayMethod, onDeclared, showToast, onDone, t, lang, f, inlineDetails }) {
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

  const body = (
    <>
      {payMethod === "wero" && <WeroBody amount={amount} sending={sending} onConfirm={confirm} onClose={close} tg={tg} f={f} />}
      {payMethod === "iban" && (
        <IbanBody gift={gift} amount={amount} sending={sending} onConfirm={confirm} onClose={close} tg={tg} lang={lang} f={f} />
      )}
      {payMethod === "card" && <CardBody gift={gift} amount={amount} onClose={close} tg={tg} f={f} />}
    </>
  );

  // Mobile : la fenetre de participation est deja centree, les details
  // remplacent son contenu au lieu d'ouvrir un second popux par-dessus.
  if (inlineDetails && payMethod) {
    return (
      <div>
        <button
          onClick={close}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: f(12), color: C.muted, marginBottom: 14 }}
        >
          {tg.backMethods}
        </button>
        <p style={{ ...detailTitle(f), marginBottom: 14, textAlign: "center" }}>{tg[METHOD_TITLE[payMethod]]}</p>
        {body}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: f(12), color: C.muted, marginBottom: 12 }}
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
        <span style={{ fontSize: f(12), color: C.greenMid }}>{tg.amountRecap}</span>
        <span style={{ fontFamily: SERIF, fontSize: f(22), color: C.gold }}>{amount} €</span>
      </div>

      <p style={{ fontSize: f(13), color: C.muted, marginBottom: 18, lineHeight: 1.65 }}>{tg.payIntro}</p>

      <p style={{ ...detailTitle(f), color: C.success, marginBottom: 9 }}>{tg.groupFree}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        <MethodBtn icon="📱" label={tg.weroLabel} sub={tg.weroSub} onClick={() => setPayMethod("wero")} f={f} />
        <MethodBtn icon="🏦" label={tg.ibanLabel} sub={tg.ibanSub} onClick={() => setPayMethod("iban")} f={f} />
      </div>

      <p style={{ ...detailTitle(f), marginBottom: 9 }}>{tg.groupCard}</p>
      <MethodBtn icon="💳" label={tg.stripeLabel} sub={tg.stripeSub} onClick={() => setPayMethod("card")} f={f}>
        <CardBadges f={f} />
      </MethodBtn>

      {/* Desktop : chaque moyen ouvre son propre popup. */}
      {!inlineDetails && payMethod && (
        <Modal title={tg[METHOD_TITLE[payMethod]]} onClose={close} f={f}>
          {body}
        </Modal>
      )}
    </div>
  );
}

function PaymentFlow({ gift, price, contrib, payMethod, setPayMethod, onDeclared, showToast, onDone, t, lang, f, inlineDetails }) {
  const range = giftRange(price, contrib);
  const [amount, setAmount] = useState(range.initial);
  const [step, setStep] = useState("amount");

  if (step === "amount") {
    return <AmountStep range={range} amount={amount} setAmount={setAmount} onNext={() => setStep("method")} tg={t.gifts} f={f} />;
  }

  return (
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
      f={f}
      inlineDetails={inlineDetails}
    />
  );
}

/* ─── Carte cadeau et page ────────────────────────────────────────────── */

function GiftCard({ gift, price, contrib, isOpen, onToggle, onClose, payMethod, setPayMethod, onDeclared, showToast, t, lang, isMobile }) {
  const tg = t.gifts;
  const f = scaler(isMobile);
  const pct = Math.min(100, Math.round((contrib / price) * 100));
  const full = pct >= 100;
  // Sur telephone la carte reste toujours compacte : le parcours de
  // participation s'ouvre dans une fenetre centree, sans agrandir la vignette
  // ni obliger a faire defiler la page.
  const compact = isMobile;

  const flow = (
    <PaymentFlow
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
      f={f}
      inlineDetails={isMobile}
    />
  );

  return (
    <div
      style={{
        backgroundColor: C.card,
        border: `1px solid ${isOpen ? C.gold : C.border}`,
        borderRadius: compact ? 10 : 14,
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
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: compact ? 8 : 14, boxSizing: "border-box", filter: full ? "grayscale(60%)" : "none" }}
        />
      </div>

      <div style={{ padding: compact ? "11px 12px 12px" : "16px 18px" }}>
        <div style={{ display: compact ? "block" : "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: compact ? 6 : 10 }}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: compact ? 16 : 18,
              fontWeight: 500,
              margin: 0,
              color: C.green,
              lineHeight: 1.25,
              display: compact ? "-webkit-box" : "block",
              WebkitLineClamp: compact ? 2 : undefined,
              WebkitBoxOrient: compact ? "vertical" : undefined,
              overflow: compact ? "hidden" : "visible",
            }}
          >
            {full && <span style={{ color: C.success }}>✓ </span>}
            {gift.name[lang]}
          </h3>
          <span style={{ fontFamily: SERIF, fontSize: compact ? 17 : 18, color: C.gold, flexShrink: 0 }}>{price} €</span>
        </div>

        <div style={{ marginBottom: compact ? 9 : 12 }}>
          <div style={{ height: compact ? 4 : 3, backgroundColor: C.cream, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, backgroundColor: full ? C.success : C.gold, borderRadius: 2, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: compact ? 12 : 11, color: C.muted }}>
            <span>{Math.round(contrib)} {tg.collected}</span>
            <span style={{ fontWeight: 500, color: full ? C.success : C.gold }}>{pct}%</span>
          </div>
        </div>

        {full ? (
          <div style={{ textAlign: "center", fontSize: compact ? 12 : 14, color: C.success, fontStyle: "italic", fontFamily: SERIF }}>
            {compact ? "✓" : tg.completed}
          </div>
        ) : (
          <button
            onClick={onToggle}
            aria-expanded={isOpen}
            style={{
              width: "100%",
              padding: compact ? "9px 8px" : "10px 16px",
              backgroundColor: isOpen && !isMobile ? C.cream : C.green,
              color: isOpen && !isMobile ? C.green : C.offWhite,
              border: "none",
              cursor: "pointer",
              borderRadius: compact ? 6 : 7,
              fontFamily: SANS,
              fontSize: compact ? 12 : 11,
              letterSpacing: compact ? "0.08em" : "0.2em",
              textTransform: "uppercase",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isOpen && !isMobile ? tg.close : tg.participate}
          </button>
        )}
      </div>

      {/* Desktop : le parcours se deplie sous la carte. */}
      {isOpen && !full && !isMobile && (
        <div style={{ borderTop: `1px solid ${C.cream}`, backgroundColor: "#F6F3EC", padding: "20px 20px 24px" }}>{flow}</div>
      )}

      {/* Mobile : visuel du cadeau et parcours reunis dans une fenetre centree. */}
      {isOpen && !full && isMobile && (
        <Modal title={gift.name[lang]} onClose={onToggle} f={f} image={gift.img} imageAlt={gift.name[lang]}>
          {flow}
        </Modal>
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

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: isMobile ? 12 : 24, alignItems: "start" }}>
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
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
