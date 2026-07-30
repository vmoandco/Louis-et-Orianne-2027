import { useState } from "react";
import { C, SERIF, SANS } from "../lib/theme";
import { useIsMobile } from "../lib/useIsMobile";
import { GIFTS, giftCategories, catName } from "../data/gifts";
import { IBAN_INFO, WERO_TEL } from "../data/config";
import SectionTitle from "../components/SectionTitle";

// Participation minimale, et pas unique de la jauge.
const MIN_GIFT = 40;
const STEP_GIFT = 10;

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

function PayBtn({ icon, label, sub, note, onClick, primary, active, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        backgroundColor: primary ? C.green : active ? C.cream : C.card,
        border: `1px solid ${primary ? C.green : active ? C.gold : C.border}`,
        borderRadius: 8,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: primary || active ? 500 : 400, color: primary ? C.offWhite : C.green }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: primary ? "rgba(250,248,243,0.65)" : C.muted, marginTop: 2 }}>
          {sub}
          {note && <span style={{ color: primary ? "rgba(250,248,243,0.8)" : C.success, marginLeft: 5 }}>{note}</span>}
        </div>
        {children}
      </div>
      {!primary && <span style={{ fontSize: 11, color: C.light }}>{active ? "▲" : "▼"}</span>}
    </button>
  );
}

/** Pastilles CB / Visa / Mastercard, dessinees en CSS pour rester hors-ligne. */
function CardBadges() {
  const badge = {
    fontFamily: SANS,
    fontSize: 8.5,
    letterSpacing: "0.08em",
    fontWeight: 600,
    color: C.offWhite,
    border: "1px solid rgba(250,248,243,0.45)",
    borderRadius: 3,
    padding: "2px 5px",
    lineHeight: 1.2,
  };
  return (
    <div style={{ display: "flex", gap: 5, marginTop: 7 }}>
      <span style={badge}>CB</span>
      <span style={badge}>VISA</span>
      <span style={badge}>MASTERCARD</span>
    </div>
  );
}

const detailBox = { marginTop: 14, backgroundColor: C.cream, borderRadius: 10, padding: "16px 18px" };
const detailTitle = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.greenMid, fontWeight: 500 };

/** Etape 1 — choix du montant. */
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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 2, marginBottom: 14 }}>
            <span>{MIN_GIFT} €</span>
            <span>
              {tg.amountRemaining} {remaining} €
            </span>
            <span>{max} €</span>
          </div>
          <p style={{ fontSize: 11, color: C.light, textAlign: "center", marginBottom: 16 }}>{tg.amountMin}</p>
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

/** Etape 2 — choix du moyen de paiement. */
function MethodStep({ gift, amount, onBack, payMethod, setPayMethod, t, lang }) {
  const tg = t.gifts;
  const toggle = (method) => setPayMethod(payMethod === method ? null : method);

  const ibanRows = [
    [tg.ibanBene, IBAN_INFO.nom],
    ["IBAN", IBAN_INFO.iban],
    ["BIC / SWIFT", IBAN_INFO.bic],
    [tg.amountRecap, `${amount} €`],
    [tg.ibanRef, gift.name[lang]],
  ];

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

      <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.65 }}>{tg.payIntro}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {gift.stripe && (
          <PayBtn
            icon="💳"
            label={tg.stripeLabel}
            sub={tg.stripeSub}
            primary
            onClick={() => window.open(gift.stripe, "_blank", "noopener,noreferrer")}
          >
            <CardBadges />
          </PayBtn>
        )}
        <PayBtn
          icon="📱"
          label={tg.weroLabel}
          sub={`${tg.weroSub} ${WERO_TEL}`}
          note={tg.noFee}
          active={payMethod === "wero"}
          onClick={() => toggle("wero")}
        />
        <PayBtn icon="🏦" label={tg.ibanLabel} sub={tg.ibanSub} note={tg.noFee} active={payMethod === "iban"} onClick={() => toggle("iban")} />
      </div>

      {payMethod === "iban" && (
        <div style={detailBox}>
          <p style={{ ...detailTitle, marginBottom: 12 }}>{tg.ibanTitle}</p>
          {ibanRows.map(([key, value]) => {
            const mono = key === "IBAN" || key === "BIC / SWIFT";
            return (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 12 }}>
                <span style={{ color: C.muted, flexShrink: 0, fontSize: 12 }}>{key}</span>
                <span style={{ color: C.green, fontFamily: mono ? "monospace" : "inherit", fontSize: key === "IBAN" ? 11 : 13, wordBreak: "break-all", textAlign: "right" }}>
                  {value}
                </span>
              </div>
            );
          })}
          <p style={{ fontSize: 11, color: C.muted, marginTop: 10, fontStyle: "italic" }}>{tg.ibanNote}</p>
        </div>
      )}

      {payMethod === "wero" && (
        <div style={detailBox}>
          <p style={{ ...detailTitle, marginBottom: 10 }}>{tg.weroTitle}</p>
          <p style={{ fontSize: 13, color: C.greenMid, lineHeight: 1.75, marginBottom: 8 }}>{tg.weroText}</p>
          <p style={{ fontFamily: "monospace", fontSize: 20, color: C.green, fontWeight: 500, textAlign: "center", padding: "10px 0" }}>{WERO_TEL}</p>
          <p style={{ fontSize: 13, color: C.greenMid, textAlign: "center", marginBottom: 8 }}>
            {tg.amountRecap} : <strong style={{ color: C.gold }}>{amount} €</strong>
          </p>
          <p style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>{tg.weroNote}</p>
        </div>
      )}
    </div>
  );
}

function PaymentPanel({ gift, price, contrib, payMethod, setPayMethod, t, lang }) {
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
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

function GiftCard({ gift, price, contrib, isOpen, onToggle, payMethod, setPayMethod, t, lang }) {
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
        <PaymentPanel gift={gift} price={price} contrib={contrib} payMethod={payMethod} setPayMethod={setPayMethod} t={t} lang={lang} />
      )}
    </div>
  );
}

export default function GiftsPage({ contribs, prices, loaded, openGift, setOpenGift, payMethod, setPayMethod, t, lang }) {
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
        const target = gifts.reduce((sum, g) => sum + priceOf(g), 0);
        const collected = gifts.reduce((sum, g) => sum + (contribs[g.id] || 0), 0);

        return (
          <div key={cat.name} style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: `2px solid ${C.green}` }}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <h2 style={{ fontFamily: SERIF, fontSize: isMobile ? 26 : 34, fontWeight: 400, margin: 0, color: C.green }}>{cat.name}</h2>
              <span style={{ marginLeft: "auto", fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>
                {Math.round(collected)} / {target} €
              </span>
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
                  payMethod={payMethod}
                  setPayMethod={setPayMethod}
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
