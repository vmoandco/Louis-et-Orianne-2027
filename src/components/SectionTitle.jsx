import { C, SERIF } from "../lib/theme";

export default function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,8vw,52px)", fontWeight: 300, color: C.green, margin: 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 13, color: C.muted, maxWidth: 480, margin: "10px auto 0", lineHeight: 1.75, fontStyle: "italic" }}>
          {subtitle}
        </p>
      )}
      <div style={{ width: 52, height: 1, backgroundColor: C.gold, margin: "22px auto 0" }} />
    </div>
  );
}
