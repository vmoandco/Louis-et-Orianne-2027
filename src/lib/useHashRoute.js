import { useSyncExternalStore, useCallback } from "react";

export const TABS = ["home", "story", "gifts", "info", "admin"];
const DEFAULT_TAB = "home";

/** `#/gifts` → `gifts`. Toute valeur inconnue retombe sur l'accueil. */
function parseHash() {
  const value = window.location.hash.replace(/^#\/?/, "");
  return TABS.includes(value) ? value : DEFAULT_TAB;
}

const subscribe = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};

/**
 * Onglet courant synchronisé avec l'URL.
 *
 * Sans ça, la navigation vivait uniquement en mémoire : impossible d'envoyer un
 * lien vers la liste de mariage, et le bouton retour d'Android quittait le site
 * au lieu de revenir à l'onglet précédent.
 */
export function useHashRoute() {
  const tab = useSyncExternalStore(subscribe, parseHash, () => DEFAULT_TAB);

  const navigate = useCallback((next) => {
    const target = TABS.includes(next) ? next : DEFAULT_TAB;
    // L'accueil garde une URL propre, sans fragment.
    const hash = target === DEFAULT_TAB ? "" : `#/${target}`;

    if (window.location.hash === hash || (!window.location.hash && !hash)) return;

    if (hash) {
      window.location.hash = hash;
    } else {
      // Effacer le fragment sans laisser un « # » orphelin dans la barre d'adresse.
      window.history.pushState(null, "", window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, []);

  return [tab, navigate];
}
