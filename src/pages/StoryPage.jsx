import { C, SERIF } from "../lib/theme";
import { useIsMobile } from "../lib/useIsMobile";
import { useReveal } from "../lib/useReveal";
import { localize } from "../data/translations";
import { STORY_SECTIONS } from "../data/story";
import SectionTitle from "../components/SectionTitle";

const hideOnError = (e) => {
  e.currentTarget.style.display = "none";
};

const revealStyle = (visible, offset) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
  transition: "opacity 0.6s ease, transform 0.6s ease",
});

function Photo({ src, alt, style }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
      onError={hideOnError}
    />
  );
}

function MosaicItem({ event, lang }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        aspectRatio: event.ratio === "3:4" ? "3/4" : "4/3",
        ...revealStyle(visible, 20),
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <Photo src={event.photo} alt={localize(event.date, lang)} />
    </div>
  );
}

function TimelineItem({ event, index, lang, isMobile }) {
  const [ref, visible] = useReveal(0.2);
  const isLeft = index % 2 === 0;
  const date = localize(event.date, lang);
  const text = localize(event.text, lang);

  if (isMobile) {
    return (
      <div ref={ref} style={{ marginBottom: 48, ...revealStyle(visible, 30) }}>
        <div style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <div style={{ padding: "14px 20px 0" }}>
            <p style={{ fontFamily: SERIF, fontSize: 18, color: C.gold, letterSpacing: "0.15em", margin: 0, fontWeight: 400, textAlign: "center" }}>{date}</p>
          </div>
          <div style={{ height: event.ratio === "3:4" ? 400 : 260, backgroundColor: C.cream, overflow: "hidden", marginTop: 12 }}>
            <Photo src={event.photo} alt={date} />
          </div>
          <div style={{ padding: "14px 20px 18px" }}>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: 0, textAlign: "center" }}>{text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", marginBottom: 1, ...revealStyle(visible, 30) }} ref={ref}>
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", backgroundColor: C.gold, border: `2px solid ${C.bg}`, marginTop: 20, zIndex: 1 }} />
      <div style={{ width: "44%", marginLeft: isLeft ? 0 : "auto", marginRight: isLeft ? "auto" : 0, paddingLeft: isLeft ? 0 : 24, paddingRight: isLeft ? 24 : 0 }}>
        <div style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ height: event.ratio === "3:4" ? 293 : 220, backgroundColor: C.cream, overflow: "hidden" }}>
            <Photo src={event.photo} alt={date} />
          </div>
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontFamily: SERIF, fontSize: 16, color: C.gold, letterSpacing: "0.15em", marginBottom: 8, fontWeight: 400 }}>{date}</p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MosaicSection({ blocks, lang, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
      {blocks.map((block, i) => {
        if (block.type === "grid") {
          return (
            <div
              key={i}
              style={{
                display: "grid",
                // Trois vignettes côte à côte deviennent illisibles sur un téléphone.
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                gap: isMobile ? 8 : 12,
              }}
            >
              {block.items.map((item) => (
                <MosaicItem key={item.photo} event={item} lang={lang} />
              ))}
            </div>
          );
        }
        if (block.type === "full") {
          return (
            <div key={i} style={{ width: "100%", borderRadius: 12, overflow: "hidden", aspectRatio: isMobile ? "4/3" : "3/2" }}>
              <Photo src={block.item.photo} alt={localize(block.item.date, lang)} />
            </div>
          );
        }
        return (
          <p
            key={i}
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(26px,6vw,40px)",
              fontWeight: 300,
              color: C.green,
              letterSpacing: "0.1em",
              textAlign: "center",
              lineHeight: 1.8,
              padding: isMobile ? "8px 12px" : "8px 40px",
            }}
          >
            {localize(block.text, lang)}
          </p>
        );
      })}
    </div>
  );
}

export default function StoryPage({ t, lang }) {
  const isMobile = useIsMobile();

  // Index continu sur toutes les sections : il pilote l'alternance gauche/droite
  // de la timeline, qui ne doit pas se réinitialiser à chaque année.
  let timelineIndex = 0;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "8px 20px" : "60px 20px", backgroundColor: C.bg }}>
      <SectionTitle title={t.story.title} />

      {STORY_SECTIONS.map((section, si) => (
        <div key={si} style={{ marginBottom: 60 }}>
          <div style={{ textAlign: "center", margin: "40px 0 32px", position: "relative", zIndex: 1, backgroundColor: C.bg }}>
            <span style={{ fontFamily: SERIF, fontSize: "clamp(28px,6vw,40px)", fontWeight: 300, color: C.green, letterSpacing: "0.1em" }}>
              {localize(section.year, lang)}
            </span>
            <div style={{ width: 60, height: 1, backgroundColor: C.gold, margin: "8px auto 0" }} />
          </div>

          {section.mosaic ? (
            <MosaicSection blocks={section.blocks} lang={lang} isMobile={isMobile} />
          ) : (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, backgroundColor: C.border, transform: "translateX(-50%)" }} />
              {section.photos.map((event) => (
                <TimelineItem key={event.photo} event={event} index={timelineIndex++} lang={lang} isMobile={isMobile} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
