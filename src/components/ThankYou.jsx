import { useEffect } from "react";
import { C, SERIF, SANS } from "../lib/theme";

/**
 * Remerciement après une participation.
 *
 * Un bandeau discret passait inaperçu pour un moment qui compte : c'est le
 * seul retour que l'invité obtient après avoir payé. D'où une vraie fenêtre,
 * qu'il ferme lui-même.
 */
export default function ThankYou({ t, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
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
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(28,51,32,0.75)",
        zIndex: 9999,
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
          borderRadius: 20,
          padding: "44px 32px 32px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          margin: "auto",
        }}
      >
        <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 18 }}>♡</div>

        <h2 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: C.green, margin: "0 0 6px", lineHeight: 1.2 }}>
          {t.gifts.thanksTitle}
        </h2>
        <div style={{ width: 44, height: 1, backgroundColor: C.gold, margin: "18px auto 20px" }} />

        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>{t.gifts.thanksText}</p>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px 22px",
            backgroundColor: C.green,
            color: C.offWhite,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: SANS,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {t.gifts.thanksClose}
        </button>
      </div>
    </div>
  );
}
