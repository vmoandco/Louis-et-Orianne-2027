import { C, SERIF } from "../lib/theme";
import { useIsMobile } from "../lib/useIsMobile";
import SectionTitle from "../components/SectionTitle";

export default function InfoPage({ t }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "8px 20px" : "60px 20px" }}>
      <SectionTitle title={t.info.title} />

      <div
        style={{
          display: "grid",
          // Deux colonnes fixes tassaient le texte sur les petits écrans.
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16,
        }}
      >
        {t.info.sections.map((info) => (
          <div
            key={info.title}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              backgroundColor: "#FFFFFF",
              border: `1px solid ${C.border}`,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              borderRadius: 14,
              padding: "20px 16px",
            }}
          >
            <div style={{ fontSize: 26 }}>{info.icon}</div>
            <div>
              <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: C.green, marginBottom: 8 }}>{info.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, whiteSpace: "pre-line" }}>{info.content}</p>
              {info.link && (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    borderBottom: `1px solid ${C.gold}`,
                    paddingBottom: 1,
                  }}
                >
                  📍 {t.info.maps}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
