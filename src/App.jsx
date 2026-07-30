import { useState, useEffect, useCallback, lazy, Suspense } from "react";

import { fetchContributions } from "./lib/api";
import { C, SERIF } from "./lib/theme";
import { useIsMobile } from "./lib/useIsMobile";
import { useHashRoute } from "./lib/useHashRoute";
import { TR } from "./data/translations";
import { GIFTS } from "./data/gifts";
import { LANG_MEMORY_MS } from "./data/config";

import Header from "./components/Header";
import MobileBottomNav from "./components/MobileBottomNav";
import LanguageGate from "./components/LanguageGate";
import Toast from "./components/Toast";

import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import GiftsPage from "./pages/GiftsPage";
import InfoPage from "./pages/InfoPage";

// L'admin embarque le SDK Supabase : on ne le charge qu'à l'ouverture de l'onglet.
const AdminPage = lazy(() => import("./pages/AdminPage"));

const langWasChosenRecently = () => {
  const saved = localStorage.getItem("langChosenAt");
  return saved ? Date.now() - Number(saved) < LANG_MEMORY_MS : false;
};

export default function App() {
  const isMobile = useIsMobile();
  const [tab, goTo] = useHashRoute();

  const [lang, setLang] = useState("fr");
  const [langChosen, setLangChosen] = useState(langWasChosenRecently);

  const [contribs, setContribs] = useState({});
  // Prix courants : ceux de gifts.js, ecrases par la colonne `price` en base
  // lorsqu'ils ont ete corriges depuis l'espace admin.
  const [prices, setPrices] = useState(() => Object.fromEntries(GIFTS.map((g) => [g.id, g.amount])));
  const [loaded, setLoaded] = useState(false);

  const [openGift, setOpenGiftRaw] = useState(null);
  const [payMethod, setPayMethod] = useState(null);

  const [toast, setToast] = useState(null);

  const t = TR[lang];

  // ─── Données ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    fetchContributions()
      .then((rows) => {
        if (cancelled) return;
        const amounts = Object.fromEntries(GIFTS.map((g) => [g.id, 0]));
        const targets = Object.fromEntries(GIFTS.map((g) => [g.id, g.amount]));
        for (const row of rows) {
          amounts[row.id] = Number(row.amount);
          // `price` est nulle tant que le prix n'a pas ete corrige en admin.
          if (row.price != null) targets[row.id] = Number(row.price);
        }
        setContribs(amounts);
        setPrices(targets);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────
  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback(
    (next) => {
      goTo(next);
      setOpenGiftRaw(null);
      setPayMethod(null);
    },
    [goTo]
  );

  // Remonter en haut à chaque changement d'onglet, y compris via le bouton retour.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tab]);

  const setOpenGift = useCallback((id) => {
    setOpenGiftRaw(id);
    setPayMethod(null);
  }, []);

  const chooseLang = useCallback((code) => {
    setLang(code);
    localStorage.setItem("langChosenAt", String(Date.now()));
    setLangChosen(true);
  }, []);

  const handleSaved = useCallback((id, amount) => {
    setContribs((prev) => ({ ...prev, [id]: amount }));
  }, []);

  const handlePriceSaved = useCallback((id, price) => {
    setPrices((prev) => ({ ...prev, [id]: price }));
  }, []);

  const closeAdmin = useCallback(() => navigate("home"), [navigate]);

  // ─── Rendu ──────────────────────────────────────────────────────────
  // L'onglet Admin n'apparaît que lorsqu'on s'y trouve : l'URL suffit à le décrire.
  const onAdmin = tab === "admin";
  const tabs = [
    { id: "home", label: t.nav.home },
    { id: "story", label: t.nav.story },
    { id: "gifts", label: t.nav.gifts },
    { id: "info", label: t.nav.info },
    ...(onAdmin ? [{ id: "admin", label: "⚙ Admin" }] : []),
  ];

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.green }}>
      {!isMobile && <Header tabs={tabs} tab={tab} navigate={navigate} lang={lang} setLang={setLang} />}

      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          // Marge basse suffisante pour dégager la barre de navigation mobile fixe.
          padding: isMobile ? "0 24px 96px" : "0 24px 100px",
        }}
      >
        {tab === "home" && <HomePage navigate={navigate} t={t} />}
        {tab === "story" && <StoryPage t={t} lang={lang} />}
        {tab === "gifts" && (
          <GiftsPage
            contribs={contribs}
            prices={prices}
            loaded={loaded}
            openGift={openGift}
            setOpenGift={setOpenGift}
            payMethod={payMethod}
            setPayMethod={setPayMethod}
            t={t}
            lang={lang}
          />
        )}
        {tab === "info" && <InfoPage t={t} />}
        {tab === "admin" && (
          <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 20px", color: C.muted }}>{t.gifts.loading}</div>}>
            <AdminPage
              contribs={contribs}
              prices={prices}
              onSaved={handleSaved}
              onPriceSaved={handlePriceSaved}
              onClose={closeAdmin}
              showToast={showToast}
              t={t}
              lang={lang}
            />
          </Suspense>
        )}
      </main>

      {!isMobile && (
        <footer style={{ textAlign: "center", padding: "24px 16px", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: SERIF, fontSize: 20, fontStyle: "italic", color: C.light, marginBottom: 12 }}>{t.footer}</p>
          {!onAdmin && (
            <button
              onClick={() => navigate("admin")}
              title="Espace admin"
              aria-label="Espace admin"
              style={{ background: "none", border: "none", cursor: "pointer", color: C.border, fontSize: 13, letterSpacing: "0.3em", padding: "4px 8px" }}
            >
              ···
            </button>
          )}
        </footer>
      )}

      {isMobile && <MobileBottomNav tab={tab} navigate={navigate} lang={lang} setLang={setLang} t={t} />}

      {!langChosen && <LanguageGate t={t} onChoose={chooseLang} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}
