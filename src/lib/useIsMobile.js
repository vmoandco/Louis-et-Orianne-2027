import { useSyncExternalStore } from "react";
import { MOBILE_BREAKPOINT } from "./theme";

const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

const subscribe = (callback) => {
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

/**
 * Vrai en dessous du breakpoint mobile.
 *
 * Remplace les lectures directes de `window.innerWidth` faites pendant le rendu :
 * celles-ci ne déclenchaient aucun re-rendu, donc la mise en page restait figée
 * après une rotation d'écran ou un redimensionnement de fenêtre.
 */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => query.matches,
    () => false // rendu serveur / pré-rendu : on suppose desktop
  );
}
