import { C, SANS } from "../lib/theme";

const ITEMS = [
  { id: "home", icon: "♡" },
  { id: "story", icon: "◎" },
  { id: "gifts", icon: "◇" },
  { id: "info", icon: "○" },
];

/** Barre de navigation fixe en bas d'écran, seule navigation sur mobile. */
export default function MobileBottomNav({ tab, navigate, lang, setLang, t }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(8px)",
        borderTop: `1px solid ${C.border}`,
        zIndex: 49,
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id)}
          aria-current={tab === item.id ? "page" : undefined}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 0",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: tab === item.id ? C.gold : C.muted,
            transition: "color 0.2s",
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
          <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4, fontFamily: SANS }}>
            {t.navShort[item.id]}
          </span>
        </button>
      ))}

      <button
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
        style={{
          flex: 0.7,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 22 }}>{lang === "fr" ? "🇫🇷" : "🇬🇧"}</span>
        <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4, color: C.muted, fontFamily: SANS }}>
          {lang === "fr" ? "FR" : "EN"}
        </span>
      </button>
    </nav>
  );
}
