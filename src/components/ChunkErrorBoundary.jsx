import { Component } from "react";
import { C, SERIF, SANS } from "../lib/theme";

/**
 * Rattrape l'échec de chargement d'un module chargé en lazy() (ex. AdminPage).
 *
 * Chaque déploiement remplace les fichiers de `dist/` : le nom de fichier
 * hashé d'un ancien build (ex. `AdminPage-CtFEmHkn.js`) n'existe plus sur le
 * serveur une fois le site redéployé. Un onglet resté ouvert depuis avant ce
 * déploiement tente alors de charger ce fichier disparu (404), ce qui fait
 * planter le rendu. Sans ce composant, React démonte toute la page — d'où
 * l'écran blanc — au lieu de se contenter de recharger la page.
 */
export default class ChunkErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Échec de chargement d'un module :", error);
  }

  render() {
    if (this.state.failed) {
      const tf = this.props.t?.chunkError ?? {
        text: "Le site vient d'être mis à jour. Merci de recharger la page.",
        button: "Recharger",
      };
      return (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontFamily: SERIF, fontSize: 18, color: C.green, marginBottom: 20 }}>{tf.text}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 28px",
              backgroundColor: C.green,
              color: C.offWhite,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: SANS,
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {tf.button}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
