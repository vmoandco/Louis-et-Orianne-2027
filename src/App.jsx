import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://llnytahieqtesoyrjfbh.supabase.co",
  "sb_publishable_INRu6WW-C06Fh-N22vWf5g_7G0hAgOC"
);

// ┌─────────────────────────────────────────────────────────────┐
// │  ⚙️  CONFIG — Modifiez ces valeurs pour personnaliser       │
// └─────────────────────────────────────────────────────────────┘
const DATE_MARIAGE = new Date("2027-06-19T14:00:00"); // ← MODIFIER
const IBAN_INFO    = {
  iban : "FR76 XXXX XXXX XXXX XXXX XXXX XXX",         // ← MODIFIER
  bic  : "XXXXXXXX",                                   // ← MODIFIER
  nom  : "Louis SIGAUD",
};
const WERO_TEL = "+33 6 XX XX XX XX";                  // ← MODIFIER

// ┌─────────────────────────────────────────────────────────────┐
// │  🎁  LISTE DE CADEAUX                                       │
// └─────────────────────────────────────────────────────────────┘
const GIFTS = [
  { id:"vn1", cat:"Voyage de noces",  icon:"✈️",  name:"Une nuit en palace",             desc:"Offrez-nous une nuit inoubliable lors de notre voyage de noces",    amount:250, stripe:"" },
  { id:"vn2", cat:"Voyage de noces",  icon:"✈️",  name:"Dîner gastronomique",             desc:"Un repas romantique dans un grand restaurant étoilé",               amount:150, stripe:"" },
  { id:"vn3", cat:"Voyage de noces",  icon:"✈️",  name:"Activité découverte",             desc:"Plongée, randonnée ou balade en bateau — une aventure à deux",      amount:80,  stripe:"" },
  { id:"vn4", cat:"Voyage de noces",  icon:"✈️",  name:"Séance spa & détente",            desc:"Un moment de bien-être rien que pour nous",                        amount:120, stripe:"" },
  { id:"nn1", cat:"Notre nid",         icon:"🏡",  name:"Robot pâtissier",                 desc:"Pour les futures pâtisseries du dimanche matin",                   amount:350, stripe:"" },
  { id:"nn2", cat:"Notre nid",         icon:"🏡",  name:"Cave à vins",                     desc:"Pour conserver nos bouteilles préférées",                          amount:300, stripe:"" },
  { id:"nn3", cat:"Notre nid",         icon:"🏡",  name:"Batterie de cuisine Le Creuset",  desc:"Des cocottes et poêles de qualité pour cuisiner ensemble",         amount:280, stripe:"" },
  { id:"nn4", cat:"Notre nid",         icon:"🏡",  name:"Robot aspirateur",                desc:"Un peu d'aide bien méritée pour le quotidien !",                   amount:200, stripe:"" },
  { id:"at1", cat:"Art de la table",   icon:"🍽️",  name:"Service de table complet",        desc:"Une belle vaisselle pour recevoir nos proches",                    amount:400, stripe:"" },
  { id:"at2", cat:"Art de la table",   icon:"🍽️",  name:"Verres à vin & champagne",        desc:"Pour trinquer à toutes nos futures occasions",                    amount:180, stripe:"" },
  { id:"at3", cat:"Art de la table",   icon:"🍽️",  name:"Couverts premium",                desc:"Une argenterie moderne pour une belle table",                     amount:220, stripe:"" },
  { id:"ex1", cat:"Expériences",       icon:"🎭",  name:"Weekend gastronomique",            desc:"Un weekend gourmand en amoureux dans une belle région",            amount:350, stripe:"" },
  { id:"ex2", cat:"Expériences",       icon:"🎭",  name:"Cours de cuisine",                 desc:"Apprendre ensemble de nouvelles recettes avec un chef",           amount:120, stripe:"" },
  { id:"ex3", cat:"Expériences",       icon:"🎭",  name:"Soirée à l'opéra",                 desc:"Une belle soirée culturelle pour nous deux",                     amount:150, stripe:"" },
];

const C = {
  bg:"#FAF8F3", card:"#FFFFFF", green:"#1C3320", greenMid:"#3A5C3C",
  gold:"#AD8540", goldMed:"#C49A50", cream:"#EDE4CC", border:"#DCCFB5",
  muted:"#7A8A7B", light:"#A8BDA9", success:"#3D7A3D",
};

export default function App() {
  const [tab,           setTab          ] = useState("home");
  const [contribs,      setContribs     ] = useState({});
  const [loaded,        setLoaded       ] = useState(false);
  const [openGift,      setOpenGiftRaw  ] = useState(null);
  const [payMethod,     setPayMethod    ] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminAuthed,   setAdminAuthed  ] = useState(false);
  const [adminPwd,      setAdminPwd     ] = useState("");
  const [editVals,      setEditVals     ] = useState({});
  const [countdown,     setCountdown    ] = useState(null);
  const [mobileMenu,    setMobileMenu   ] = useState(false);
  const [toast,         setToast        ] = useState(null);

  const setOpenGift = (id) => { setOpenGiftRaw(id); setPayMethod(null); };

  // Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  // Chargement contributions depuis Supabase
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("contributions").select("*");
      if (error) { console.error(error); setLoaded(true); return; }
      const obj = {};
      GIFTS.forEach(g => { obj[g.id] = 0; });
      if (data) data.forEach(row => { obj[row.id] = Number(row.amount); });
      setContribs(obj);
      setLoaded(true);
    })();
  }, []);

  // Compte à rebours
  useEffect(() => {
    const tick = () => {
      const diff = DATE_MARIAGE - new Date();
      if (diff <= 0) { setCountdown({ d:0,h:0,m:0,s:0 }); return; }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000)  / 60000),
        s: Math.floor((diff % 60000)    / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Rester connecté en admin
  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      setAdminAuthed(true);
      setAdminUnlocked(true);
    }
  });
}, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const saveContrib = async (id, val) => {
    const n = Math.max(0, parseFloat(val) || 0);
    const { error } = await supabase.from("contributions").upsert({ id, amount: n });
    if (error) { showToast("❌ Erreur de sauvegarde"); return; }
    setContribs(p => ({ ...p, [id]: n }));
    showToast("✓ Contribution sauvegardée !");
  };

  const navigate = (t) => { setTab(t); setMobileMenu(false); setOpenGift(null); };

  const TABS = [
    { id:"home",  label:"Accueil" },
    { id:"story", label:"Notre histoire" },
    { id:"gifts", label:"Liste de mariage" },
    { id:"info",  label:"Infos pratiques" },
    ...(adminUnlocked ? [{ id:"admin", label:"⚙ Admin" }] : []),
  ];

  return (
    <div style={{ fontFamily:"'Jost',sans-serif", backgroundColor:C.bg, minHeight:"100vh", color:C.green }}>

      {/* HEADER */}
      <header style={{ backgroundColor:"rgba(250,248,243,0.85)", backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:980, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"center", height:64 }}>
          <nav style={{ display:"flex" }} className="hidden md:flex">
            {TABS.map(t => (
              <button key={t.id} onClick={() => navigate(t.id)} style={{
                background:"none", border:"none", cursor:"pointer",
                color: tab===t.id ? C.gold : "#1C3320",
                fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:400,
                letterSpacing:"0.2em", textTransform:"uppercase", padding:"10px 14px",
                borderBottom: tab===t.id ? `2px solid ${C.goldMed}` : "2px solid transparent",
                transition:"color 0.2s",
              }}>{t.label}</button>
            ))}
          </nav>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="hidden" style={{ background:"none", border:"none", cursor:"pointer", color:"#FAF8F3", fontSize:22, padding:"4px 0", lineHeight:1 }}>
            {mobileMenu ? "✕" : "☰"}
          </button>
        </div>
        {mobileMenu && (
          <nav style={{ backgroundColor:"#273E29", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => navigate(t.id)} style={{
                display:"block", width:"100%", padding:"15px 24px", textAlign:"left",
                background:"none", border:"none", cursor:"pointer",
                color: tab===t.id ? C.goldMed : "rgba(250,248,243,0.8)",
                fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase",
              }}>{t.label}</button>
            ))}
          </nav>
        )}
      </header>

      {/* CONTENU */}
      <main style={{ maxWidth:980, margin:"0 auto", padding:"0 16px 80px" }}>
        {tab==="home"  && <HomePage countdown={countdown} navigate={navigate} />}
        {tab==="story" && <StoryPage />}
        {tab==="gifts" && <GiftsPage contribs={contribs} loaded={loaded} openGift={openGift} setOpenGift={setOpenGift} payMethod={payMethod} setPayMethod={setPayMethod} />}
        {tab==="info"  && <InfoPage />}
        {tab==="admin" && <AdminPage authed={adminAuthed} pwd={adminPwd} setPwd={setAdminPwd} onAuth={async () => {
          const { error } = await supabase.auth.signInWithPassword({ email: "losigaud@gmail.com", password: adminPwd });
            if (error) showToast("❌ Mot de passe incorrect");
            else setAdminAuthed(true);
            }} contribs={contribs} editVals={editVals} setEditVals={setEditVals} onSave={saveContrib} onSignOut={async () => { await supabase.auth.signOut(); setAdminAuthed(false); setAdminUnlocked(false); navigate("home"); }} />}
      </main>

      {/* FOOTER */}
      <footer style={{ textAlign:"center", padding:"24px 16px", borderTop:`1px solid ${C.border}` }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.light, marginBottom:12 }}>
          Oriane &amp; Louis 2027
        </p>
        {!adminUnlocked && (
          <button onClick={() => { setAdminUnlocked(true); navigate("admin"); }} title="Espace admin" style={{ background:"none", border:"none", cursor:"pointer", color:C.border, fontSize:13, letterSpacing:"0.3em", padding:"4px 8px" }}>
            ···
          </button>
        )}
      </footer>

      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          backgroundColor:C.green, color:"#FAF8F3", padding:"13px 28px",
          borderRadius:8, fontSize:13, zIndex:9999, pointerEvents:"none",
          boxShadow:"0 4px 24px rgba(0,0,0,0.2)", whiteSpace:"nowrap",
        }}>{toast}</div>
      )}
    </div>
  );
}

function HomePage({ countdown, navigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (isMobile) return (
    <div style={{ textAlign:"center", padding:"40px 24px" }}>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif",  fontSize:"clamp(32px,8vw,52px)", fontWeight:300, letterSpacing:"0.05em", color:C.green, margin:0, whiteSpace:"nowrap"}}>
        Oriane & Louis
      </h1>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.goldMed, letterSpacing:"0.2em", margin:"8px 0 32px" }}>
        19 Juin 2027
      </p>
      {countdown && (
        <div style={{ backgroundColor:C.green, borderRadius:14, padding:"20px", display:"flex", justifyContent:"center", gap:24, marginBottom:24 }}>
          {[{v:countdown.d,l:"Jours"},{v:countdown.h,l:"Heures"},{v:countdown.m,l:"Minutes"},{v:countdown.s,l:"Secondes"}].map(({v,l}) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:32, fontWeight:300, color:"#FAF8F3", lineHeight:1 }}>{String(v).padStart(2,"0")}</div>
              <div style={{ fontSize:8, color:C.goldMed, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:6 }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate("gifts")} style={{
        backgroundColor:C.gold, color:"#FAF8F3", border:"none", cursor:"pointer",
        padding:"16px 40px", fontFamily:"'Jost',sans-serif", fontSize:12,
        letterSpacing:"0.26em", textTransform:"uppercase", fontWeight:400, borderRadius:4, marginBottom:32,
      }}>
        Voir notre liste de mariage
      </button>
      <div style={{ borderRadius:16, overflow:"hidden", width:"100%" }}>
        <img src="/photo-droite.jpg" alt="" style={{ width:"100%", objectFit:"cover" }} />
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"22% 1fr 22%", alignItems:"center", gap:0, padding:"0 2%", overflow:"hidden", marginLeft:"calc(-50vw + 50%)", marginRight:"calc(-50vw + 50%)", width:"100vw" }}>
        <div style={{ height:"29vw", borderRadius:12, backgroundColor:C.cream, overflow:"hidden" }}>
          <img src="/photo-gauche.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
        </div>

        <div style={{ textAlign:"center", display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"center", gap:32, padding:"0 24px" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginBottom:"auto" }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,6vw,86px)", fontWeight:300, letterSpacing:"0.05em", color:C.green, margin:0, whiteSpace:"nowrap" }}>
              Oriane & Louis
            </h1>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(14px,1.8vw,22px)", color:C.goldMed, letterSpacing:"0.2em", margin:0 }}>
              19 Juin 2027
            </p>
          </div>

          {countdown && (
            <div style={{ backgroundColor:C.green, borderRadius:14, marginTop:"10%", padding:"16px 20px", display:"flex", justifyContent:"center", gap:"clamp(12px,2vw,32px)", width:"75%" }}>
              {[{v:countdown.d,l:"Jours"},{v:countdown.h,l:"Heures"},{v:countdown.m,l:"Minutes"},{v:countdown.s,l:"Secondes"}].map(({v,l}) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"clamp(18px,2.5vw,36px)", fontWeight:300, color:"#FAF8F3", lineHeight:1, fontVariantNumeric:"lining-nums" }}>
                    {String(v).padStart(2,"0")}
                  </div>
                  <div style={{ fontSize:"clamp(7px,0.8vw,9px)", color:C.goldMed, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:6 }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => navigate("gifts")} style={{
            backgroundColor:C.gold, color:"#FAF8F3", border:"none", cursor:"pointer",
            padding:"clamp(14px,1.2vw,18px) clamp(32px,3vw,60px)",
            fontFamily:"'Jost',sans-serif", fontSize:"clamp(12px,1vw,14px)",
            letterSpacing:"0.26em", textTransform:"uppercase", fontWeight:400, borderRadius:4, marginTop:32,
          }}>
            Voir notre liste de mariage
          </button>
        </div>

        <div style={{ height:"29vw", borderRadius:12, backgroundColor:C.cream, overflow:"hidden" }}>
          <img src="/photo-droite.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
        </div>
      </div>
    </div>
  );
}

function StoryPage() {
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"60px 20px" }}>
      <SectionTitle title="Notre Histoire" />
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(17px,3vw,21px)", fontWeight:300, lineHeight:1.95, color:C.greenMid }}>
        <p style={{ marginBottom:28 }}>
          ✍️ <em>Personnalisez cette page avec votre histoire — comment vous vous êtes rencontrés,
          vos moments forts, vos projets communs...</em>
        </p>
        <p>
          <em>Remplacez ce texte dans le fichier App.jsx, section StoryPage.</em>
        </p>
      </div>
    </div>
  );
}

function GiftsPage({ contribs, loaded, openGift, setOpenGift, payMethod, setPayMethod }) {
  const cats = [...new Set(GIFTS.map(g => g.cat))].map(name => ({
    name, icon: GIFTS.find(g => g.cat===name).icon
  }));

  if (!loaded) return (
    <div style={{ textAlign:"center", padding:"80px 20px", fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.muted }}>
      Chargement...
    </div>
  );

  return (
    <div style={{ padding:"40px 0" }}>
      <SectionTitle title="Liste de mariage" subtitle="Participez à la mesure qui vous convient — chaque contribution est précieuse ♡" />
      {cats.map(cat => {
        const gifts     = GIFTS.filter(g => g.cat===cat.name);
        const totalCat  = gifts.reduce((s,g) => s+g.amount, 0);
        const collected = gifts.reduce((s,g) => s+(contribs[g.id]||0), 0);
        return (
          <div key={cat.name} style={{ marginBottom:56 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:14, borderBottom:`2px solid ${C.green}` }}>
              <span style={{ fontSize:22 }}>{cat.icon}</span>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:400, margin:0, color:C.green }}>{cat.name}</h2>
              <span style={{ marginLeft:"auto", fontSize:12, color:C.muted }}>{Math.round(collected)} / {totalCat} €</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap:28 }}>
              {gifts.map(gift => {
                const contrib = contribs[gift.id] || 0;
                const pct     = Math.min(100, Math.round(contrib/gift.amount*100));
                const full    = pct >= 100;
                const isOpen  = openGift===gift.id;
                return (
                  <div key={gift.id} style={{ backgroundColor:C.card, border:`1px solid ${isOpen?C.gold:C.border}`, borderRadius:14, overflow:"hidden", transition:"border-color 0.2s", opacity:full?0.65:1 }}>
                    <div style={{ padding:"20px 20px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:500, margin:0, color:C.green, flex:1, lineHeight:1.35 }}>
                          {full && <span style={{ color:C.success }}>✓ </span>}{gift.name}
                        </h3>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:C.gold, marginLeft:14, flexShrink:0 }}>{gift.amount} €</span>
                      </div>
                      <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:14 }}>{gift.desc}</p>
                      <div style={{ marginBottom:14 }}>
                        <div style={{ height:3, backgroundColor:C.cream, borderRadius:2, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, backgroundColor:full?C.success:C.gold, borderRadius:2, transition:"width 0.6s ease" }} />
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:C.muted }}>
                          <span>{Math.round(contrib)} € collectés</span>
                          <span style={{ fontWeight:500, color:full?C.success:C.gold }}>{pct}%</span>
                        </div>
                      </div>
                      {!full ? (
                        <button onClick={() => setOpenGift(isOpen?null:gift.id)} style={{
                          width:"100%", padding:"10px 16px",
                          backgroundColor:isOpen?C.cream:C.green, color:isOpen?C.green:"#FAF8F3",
                          border:"none", cursor:"pointer", borderRadius:7,
                          fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s",
                        }}>
                          {isOpen ? "Fermer ×" : "Participer →"}
                        </button>
                      ) : (
                        <div style={{ textAlign:"center", fontSize:14, color:C.success, fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>
                          Cadeau complété — merci infiniment ♡
                        </div>
                      )}
                    </div>
                    {isOpen && !full && <PaymentPanel gift={gift} payMethod={payMethod} setPayMethod={setPayMethod} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentPanel({ gift, payMethod, setPayMethod }) {
  const toggle = (m) => setPayMethod(payMethod===m ? null : m);
  return (
    <div style={{ borderTop:`1px solid ${C.cream}`, backgroundColor:"#F6F3EC", padding:"20px 20px 24px" }}>
      <p style={{ fontSize:13, color:C.muted, marginBottom:16, lineHeight:1.65 }}>
        Choisissez votre mode de paiement. Vous pouvez aussi participer partiellement !
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {gift.stripe && <PayBtn icon="💳" label="Payer par carte (Stripe)" sub="Paiement sécurisé · Visa / CB / Mastercard" primary onClick={() => window.open(gift.stripe,"_blank")} />}
        <PayBtn icon="📱" label="Payer via Wero" sub={`Envoi instantané au ${WERO_TEL}`} active={payMethod==="wero"} onClick={() => toggle("wero")} />
        <PayBtn icon="🏦" label="Virement bancaire (IBAN)" sub="Gratuit · 1–2 jours ouvrés" active={payMethod==="iban"} onClick={() => toggle("iban")} />
      </div>
      {payMethod==="iban" && (
        <div style={{ marginTop:14, backgroundColor:C.cream, borderRadius:10, padding:"16px 18px" }}>
          <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:C.greenMid, fontWeight:500, marginBottom:12 }}>Coordonnées bancaires</p>
          {[["Bénéficiaire",IBAN_INFO.nom],["IBAN",IBAN_INFO.iban],["BIC / SWIFT",IBAN_INFO.bic],["Référence",gift.name]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, gap:12 }}>
              <span style={{ color:C.muted, flexShrink:0, fontSize:12 }}>{k}</span>
              <span style={{ color:C.green, fontFamily:k==="IBAN"||k==="BIC / SWIFT"?"monospace":"inherit", fontSize:k==="IBAN"?11:13, wordBreak:"break-all", textAlign:"right" }}>{v}</span>
            </div>
          ))}
          <p style={{ fontSize:11, color:C.muted, marginTop:10, fontStyle:"italic" }}>Merci d'indiquer votre prénom en référence ♡</p>
        </div>
      )}
      {payMethod==="wero" && (
        <div style={{ marginTop:14, backgroundColor:C.cream, borderRadius:10, padding:"16px 18px" }}>
          <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:C.greenMid, fontWeight:500, marginBottom:10 }}>Paiement via Wero</p>
          <p style={{ fontSize:13, color:C.greenMid, lineHeight:1.75, marginBottom:8 }}>
            Ouvrez l'application Wero et envoyez votre contribution au :
          </p>
          <p style={{ fontFamily:"monospace", fontSize:20, color:C.green, fontWeight:500, textAlign:"center", padding:"10px 0" }}>{WERO_TEL}</p>
          <p style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>Mentionnez votre prénom dans le message ♡</p>
        </div>
      )}
    </div>
  );
}

function PayBtn({ icon, label, sub, onClick, primary, active }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:14, padding:"12px 16px",
      backgroundColor:primary?C.green:active?C.cream:C.card,
      border:`1px solid ${primary?C.green:active?C.gold:C.border}`,
      borderRadius:8, cursor:"pointer", textAlign:"left", width:"100%", transition:"all 0.15s",
    }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, fontWeight:primary||active?500:400, color:primary?"#FAF8F3":C.green }}>{label}</div>
        <div style={{ fontSize:11, color:primary?"rgba(250,248,243,0.65)":C.muted, marginTop:2 }}>{sub}</div>
      </div>
      {!primary && <span style={{ fontSize:11, color:C.light }}>{active?"▲":"▼"}</span>}
    </button>
  );
}

function InfoPage() {
  const infos = [
    { icon:"📍", title:"Lieu de la cérémonie",  content:"Nom de l'église / mairie\nAdresse complète\nCode postal, Ville" },
    { icon:"🎉", title:"Lieu de la réception",   content:"Nom du domaine / château\nAdresse complète\nCode postal, Ville" },
    { icon:"🛌", title:"Hébergement",             content:"Hôtels recommandés à proximité...\nBloc de chambres réservé à tarif préférentiel." },
    { icon:"👗", title:"Dress code",              content:"Tenue de soirée / cocktail." },
    { icon:"🚗", title:"Accès & parking",         content:"En voiture : depuis Paris, prendre l'A6...\nParking gratuit sur place." },
    { icon:"📱", title:"Contact",                 content:"Pour toute question :\nprenom@email.com" },
  ];
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"60px 20px" }}>
      <SectionTitle title="Infos pratiques" />
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {infos.map(info => (
          <div key={info.title} style={{ display:"flex", gap:20, backgroundColor:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 24px" }}>
            <div style={{ fontSize:26, flexShrink:0, marginTop:3 }}>{info.icon}</div>
            <div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:500, color:C.green, marginBottom:8 }}>{info.title}</h3>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.85, whiteSpace:"pre-line" }}>{info.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage({ authed, pwd, setPwd, onAuth, onSignOut, contribs, editVals, setEditVals, onSave }) {
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"60px 20px" }}>
      <SectionTitle title="Espace Admin" />
      {!authed ? (
        <div style={{ textAlign:"center", maxWidth:380, margin:"0 auto" }}>
          <p style={{ fontSize:14, color:C.muted, marginBottom:20 }}>Mot de passe admin :</p>
          <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key==="Enter"&&onAuth()} placeholder="Mot de passe"
            style={{ width:"100%", padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, backgroundColor:C.card, color:C.green, marginBottom:12, boxSizing:"border-box" }} />
          <button onClick={onAuth} style={{ width:"100%", padding:"13px 20px", backgroundColor:C.green, color:"#FAF8F3", border:"none", borderRadius:9, cursor:"pointer", fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase" }}>
            Accéder
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button onClick={onSignOut} style={{ background:"none", border:`1px solid ${C.border}`, cursor:"pointer", padding:"8px 16px", borderRadius:6, fontSize:12, color:C.muted }}>
              Se déconnecter
            </button>
          </div>
          <div style={{ backgroundColor:C.cream, borderRadius:12, padding:"16px 20px", marginBottom:32, fontSize:14, lineHeight:1.75, color:C.greenMid }}>
            Saisissez le montant <em>total collecté</em> pour chaque cadeau. Cliquez ✓ pour sauvegarder.
          </div>
          {GIFTS.map(gift => {
            const current = contribs[gift.id] || 0;
            const editVal = editVals[gift.id] !== undefined ? editVals[gift.id] : current;
            const pct     = Math.min(100, Math.round(current/gift.amount*100));
            return (
              <div key={gift.id} style={{ padding:"18px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:500, color:C.green, marginBottom:4 }}>{gift.name}</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{gift.cat} · Cible : {gift.amount} €</div>
                    <div style={{ height:3, backgroundColor:C.cream, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, backgroundColor:pct>=100?C.success:C.gold, borderRadius:2 }} />
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:5 }}>
                      {Math.round(current)} € collectés ({pct}%)
                      {pct>=100 && <span style={{ color:C.success, marginLeft:6 }}>✓ Complété</span>}
                    </div>
                  </div>
                  <div style={{ flexShrink:0 }}>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>Montant collecté :</div>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <input type="number" min="0" max={gift.amount} step="1" value={editVal}
                        onChange={e => setEditVals(p => ({...p,[gift.id]:e.target.value}))}
                        style={{ width:92, padding:"9px 10px", border:`1px solid ${C.border}`, borderRadius:7, fontSize:14, backgroundColor:C.card, color:C.green }} />
                      <span style={{ fontSize:13, color:C.muted }}>/ {gift.amount} €</span>
                      <button onClick={() => onSave(gift.id, editVal)} style={{ backgroundColor:C.gold, color:"#FAF8F3", border:"none", borderRadius:7, width:38, height:38, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✓</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ textAlign:"center", marginBottom:44 }}>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,6vw,52px)", fontWeight:300, color:C.green, margin:0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:13, color:C.muted, maxWidth:480, margin:"10px auto 0", lineHeight:1.75, fontStyle:"italic" }}>{subtitle}</p>}
      <div style={{ width:52, height:1, backgroundColor:C.gold, margin:"22px auto 0" }} />
    </div>
  );
}