import { C } from "../lib/theme";

export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: C.green,
        color: C.offWhite,
        padding: "13px 28px",
        borderRadius: 8,
        fontSize: 13,
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}
