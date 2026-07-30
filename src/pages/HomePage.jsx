import { C, SERIF, SANS } from "../lib/theme";
import { useIsMobile } from "../lib/useIsMobile";
import Countdown from "../components/Countdown";

const hideOnError = (e) => {
  e.currentTarget.style.display = "none";
};

function CtaButton({ label, onClick, isMobile }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: C.gold,
        color: C.offWhite,
        border: "none",
        cursor: "pointer",
        fontFamily: SANS,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        fontWeight: 400,
        borderRadius: 4,
        padding: isMobile ? "16px 40px" : "clamp(14px,1.2vw,18px) clamp(32px,3vw,60px)",
        fontSize: isMobile ? 12 : "clamp(12px,1vw,14px)",
        marginBottom: isMobile ? 32 : 0,
        marginTop: isMobile ? 0 : 32,
      }}
    >
      {label}
    </button>
  );
}

export default function HomePage({ navigate, t }) {
  const isMobile = useIsMobile();
  const labels = t.home.countdown;

  if (isMobile) {
    return (
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,10vw,60px)", fontWeight: 300, letterSpacing: "0.05em", color: C.green, margin: 0, whiteSpace: "nowrap" }}>
          Oriane &amp; Louis
        </h1>
        <p style={{ fontFamily: SERIF, fontSize: 20, color: C.goldMed, letterSpacing: "0.2em", margin: "4px 0 32px" }}>
          {t.home.date}
        </p>

        <Countdown labels={labels} isMobile style={{ marginBottom: 24 }} />

        <CtaButton label={t.home.cta} onClick={() => navigate("gifts")} isMobile />

        <div style={{ borderRadius: 16, overflow: "hidden", width: "100%" }}>
          <img src="/photo-droite.webp" alt="Oriane et Louis" fetchPriority="high" style={{ width: "100%", objectFit: "cover", display: "block" }} onError={hideOnError} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "22% 1fr 22%",
        alignItems: "center",
        padding: "40px 2% 0",
        overflow: "hidden",
        // Sort des marges de <main> pour occuper toute la largeur de l'écran.
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      <div style={{ height: "29vw", borderRadius: 12, backgroundColor: C.cream, overflow: "hidden" }}>
        <img src="/photo-gauche.webp" alt="Oriane et Louis" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={hideOnError} />
      </div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: 32, padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: "auto" }}>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px,6vw,86px)", fontWeight: 300, letterSpacing: "0.05em", color: C.green, margin: 0, whiteSpace: "nowrap" }}>
            Oriane &amp; Louis
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: "clamp(16px,2.2vw,28px)", color: C.goldMed, letterSpacing: "0.2em", margin: 0 }}>
            {t.home.date}
          </p>
        </div>

        <Countdown labels={labels} isMobile={false} style={{ marginTop: "10%", width: "75%" }} />

        <CtaButton label={t.home.cta} onClick={() => navigate("gifts")} isMobile={false} />
      </div>

      <div style={{ height: "29vw", borderRadius: 12, backgroundColor: C.cream, overflow: "hidden" }}>
        <img src="/photo-droite.webp" alt="Oriane et Louis" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={hideOnError} />
      </div>
    </div>
  );
}
