import { useState, useEffect } from "react";
import { C, SANS } from "../lib/theme";
import { DATE_MARIAGE } from "../data/config";

function remaining() {
  const diff = DATE_MARIAGE - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

/**
 * Compte à rebours jusqu'au mariage.
 *
 * L'état de la seconde vit ici et non dans <App> : sans ça, chaque tic
 * re-rendait toute l'application (liste de cadeaux comprise) une fois par seconde.
 */
export default function Countdown({ labels, isMobile, style }) {
  const [time, setTime] = useState(remaining);

  useEffect(() => {
    const id = setInterval(() => setTime(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [time.d, time.h, time.m, time.s];

  return (
    <div
      style={{
        backgroundColor: C.green,
        borderRadius: 14,
        display: "flex",
        justifyContent: "center",
        padding: isMobile ? 20 : "16px 20px",
        gap: isMobile ? 24 : "clamp(12px,2vw,32px)",
        ...style,
      }}
    >
      {units.map((value, i) => (
        <div key={labels[i]} style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: isMobile ? 32 : "clamp(18px,2.5vw,36px)",
              fontWeight: 300,
              color: C.offWhite,
              lineHeight: 1,
              fontVariantNumeric: "lining-nums",
            }}
          >
            {String(value).padStart(2, "0")}
          </div>
          <div
            style={{
              fontSize: isMobile ? 8 : "clamp(7px,0.8vw,9px)",
              color: C.goldMed,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            {labels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
