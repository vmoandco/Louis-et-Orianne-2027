import { C, SANS } from "../lib/theme";

function LangToggle({ lang, setLang }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[
        { code: "fr", flag: "🇫🇷", title: "Français" },
        { code: "en", flag: "🇬🇧", title: "English" },
      ].map(({ code, flag, title }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          title={title}
          aria-label={title}
          aria-pressed={lang === code}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            opacity: lang === code ? 1 : 0.35,
            transition: "opacity 0.2s",
            padding: 2,
          }}
        >
          {flag}
        </button>
      ))}
    </div>
  );
}

/** En-tête desktop. Sur mobile, la navigation passe par <MobileBottomNav>. */
export default function Header({ tabs, tab, navigate, lang, setLang }) {
  return (
    <header
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          position: "relative",
        }}
      >
        <nav style={{ display: "flex" }}>
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              aria-current={tab === item.id ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: tab === item.id ? C.gold : C.green,
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "10px 14px",
                borderBottom: tab === item.id ? `2px solid ${C.goldMed}` : "2px solid transparent",
                transition: "color 0.2s",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </header>
  );
}
