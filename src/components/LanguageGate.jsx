import { C, SERIF, SANS } from "../lib/theme";

/** Écran d'accueil demandant la langue au premier passage. */
export default function LanguageGate({ t, onChoose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(28,51,32,0.7)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}
      >
        <p style={{ fontFamily: SERIF, fontSize: 14, letterSpacing: "0.3em", color: C.goldMed, textTransform: "uppercase", marginBottom: 16 }}>
          {t.gate.eyebrow}
        </p>
        <h2 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: C.green, margin: "0 0 8px" }}>
          {t.gate.title}
        </h2>
        <div style={{ width: 40, height: 1, backgroundColor: C.gold, margin: "20px auto 32px" }} />
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 32, letterSpacing: "0.05em" }}>
          {t.gate.prompt}
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[
            { code: "fr", flag: "🇫🇷", label: "Français" },
            { code: "en", flag: "🇬🇧", label: "English" },
          ].map(({ code, flag, label }) => (
            <button
              key={code}
              onClick={() => onChoose(code)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "20px 32px",
                backgroundColor: C.green,
                color: C.offWhite,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                flex: 1,
              }}
            >
              <span style={{ fontSize: 32 }}>{flag}</span>
              <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
