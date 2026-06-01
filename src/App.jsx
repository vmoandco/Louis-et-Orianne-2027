import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://llnytahieqtesoyrjfbh.supabase.co",
  "sb_publishable_INRu6WW-C06Fh-N22vWf5g_7G0hAgOC"
);

// ┌─────────────────────────────────────────────────────────────┐
// │  ⚙️  CONFIG                                                 │
// └─────────────────────────────────────────────────────────────┘
const DATE_MARIAGE = new Date("2027-06-19T14:00:00");
const IBAN_INFO    = { iban:"FR76 XXXX XXXX XXXX XXXX XXXX XXX", bic:"XXXXXXXX", nom:"Louis SIGAUD" };
const WERO_TEL     = "+33 6 XX XX XX XX";

// ┌─────────────────────────────────────────────────────────────┐
// │  🌍  TRADUCTIONS                                            │
// └─────────────────────────────────────────────────────────────┘
const TR = {
  fr: {
    nav: { home:"Accueil", story:"Notre histoire", gifts:"Liste de mariage", info:"Infos pratiques" },
    home: {
      date: "19 Juin 2027",
      cta: "Voir notre liste de mariage",
      countdown: ["Jours","Heures","Minutes","Secondes"],
    },
    gifts: {
      title: "Liste de mariage",
      subtitle: "Participez à la mesure qui vous convient — chaque contribution est précieuse ♡",
      loading: "Chargement...",
      participate: "Participer →",
      close: "Fermer ×",
      collected: "€ collectés",
      completed: "Cadeau complété — merci infiniment ♡",
      payIntro: "Choisissez votre mode de paiement. Vous pouvez aussi participer partiellement !",
      stripeLabel: "Payer par carte (Stripe)", stripeSub: "Paiement sécurisé · Visa / CB / Mastercard",
      weroLabel: "Payer via Wero", weroSub: "Envoi instantané au",
      ibanLabel: "Virement bancaire (IBAN)", ibanSub: "Gratuit · 1–2 jours ouvrés",
      ibanTitle: "Coordonnées bancaires",
      ibanBene: "Bénéficiaire", ibanRef: "Référence",
      ibanNote: "Merci d'indiquer votre prénom en référence ♡",
      weroTitle: "Paiement via Wero",
      weroText: "Ouvrez l'application Wero et envoyez votre contribution au :",
      weroNote: "Mentionnez votre prénom dans le message ♡",
    },
    story: { title:"Notre Histoire" },
    info: {
      title: "Infos pratiques",
      sections: [
        { icon:"📍", title:"Lieu de la cérémonie",  content:"Nom de l'église / mairie\nAdresse complète\nCode postal, Ville" },
        { icon:"🎉", title:"Lieu de la réception",   content:"Nom du domaine / château\nAdresse complète\nCode postal, Ville" },
        { icon:"🛌", title:"Hébergement",             content:"Hôtels recommandés à proximité...\nBloc de chambres réservé à tarif préférentiel." },
        { icon:"👗", title:"Dress code",              content:"Tenue de soirée / cocktail." },
        { icon:"🚗", title:"Accès & parking",         content:"En voiture : depuis Paris, prendre l'A6...\nParking gratuit sur place." },
        { icon:"📱", title:"Contact",                 content:"Pour toute question :\nprenom@email.com" },
      ]
    },
    admin: { title:"Espace Admin", pwd:"Mot de passe admin :", access:"Accéder", signout:"Se déconnecter", note:"Saisissez le montant total collecté pour chaque cadeau. Cliquez ✓ pour sauvegarder.", target:"Cible", collected2:"collectés", completed2:"Complété", amount:"Montant collecté :", wrong:"❌ Mot de passe incorrect" },
    footer: "Oriane & Louis 2027",
  },
  en: {
    nav: { home:"Home", story:"Our Story", gifts:"Gift Registry", info:"Practical Info" },
    home: {
      date: "June 19, 2027",
      cta: "View our gift registry",
      countdown: ["Days","Hours","Minutes","Seconds"],
    },
    gifts: {
      title: "Gift Registry",
      subtitle: "Contribute as much as you like — every gift is treasured ♡",
      loading: "Loading...",
      participate: "Contribute →",
      close: "Close ×",
      collected: "€ raised",
      completed: "Gift complete — thank you so much ♡",
      payIntro: "Choose your payment method. Partial contributions are also welcome!",
      stripeLabel: "Pay by card (Stripe)", stripeSub: "Secure payment · Visa / CB / Mastercard",
      weroLabel: "Pay via Wero", weroSub: "Instant transfer to",
      ibanLabel: "Bank transfer (IBAN)", ibanSub: "Free · 1–2 business days",
      ibanTitle: "Bank details",
      ibanBene: "Beneficiary", ibanRef: "Reference",
      ibanNote: "Please include your first name as reference ♡",
      weroTitle: "Payment via Wero",
      weroText: "Open the Wero app and send your contribution to:",
      weroNote: "Please include your name in the message ♡",
    },
    story: { title:"Our Story" },
    info: {
      title: "Practical Info",
      sections: [
        { icon:"📍", title:"Ceremony venue",    content:"Church / Town Hall name\nFull address\nCity, Postcode" },
        { icon:"🎉", title:"Reception venue",   content:"Venue / Château name\nFull address\nCity, Postcode" },
        { icon:"🛌", title:"Accommodation",      content:"Recommended nearby hotels...\nRoom block reserved at preferential rate." },
        { icon:"👗", title:"Dress code",         content:"Black tie / cocktail attire." },
        { icon:"🚗", title:"Access & parking",   content:"By car: from Paris, take the A6...\nFree parking on site." },
        { icon:"📱", title:"Contact",            content:"For any questions:\nfirstname@email.com" },
      ]
    },
    admin: { title:"Admin Panel", pwd:"Admin password:", access:"Log in", signout:"Sign out", note:"Enter the total amount collected for each gift. Click ✓ to save.", target:"Target", collected2:"raised", completed2:"Complete", amount:"Amount raised:", wrong:"❌ Incorrect password" },
    footer: "Oriane & Louis 2027",
  }
};

// ┌─────────────────────────────────────────────────────────────┐
// │  🎁  LISTE DE CADEAUX (bilingue)                            │
// └─────────────────────────────────────────────────────────────┘
const GIFTS = [
  { id:"vn1", cat:{fr:"Voyage de noces",icon:"✈️"}, catEn:"Honeymoon",     name:{fr:"Une nuit en palace",              en:"A night in a palace"},          desc:{fr:"Offrez-nous une nuit inoubliable lors de notre voyage de noces",    en:"Offer us an unforgettable night during our honeymoon"},      amount:250, stripe:"" },
  { id:"vn2", cat:{fr:"Voyage de noces",icon:"✈️"}, catEn:"Honeymoon",     name:{fr:"Dîner gastronomique",              en:"Fine dining experience"},        desc:{fr:"Un repas romantique dans un grand restaurant étoilé",               en:"A romantic dinner at a Michelin-starred restaurant"},         amount:150, stripe:"" },
  { id:"vn3", cat:{fr:"Voyage de noces",icon:"✈️"}, catEn:"Honeymoon",     name:{fr:"Activité découverte",              en:"Discovery activity"},            desc:{fr:"Plongée, randonnée ou balade en bateau — une aventure à deux",     en:"Diving, hiking or a boat trip — an adventure for two"},       amount:80,  stripe:"" },
  { id:"vn4", cat:{fr:"Voyage de noces",icon:"✈️"}, catEn:"Honeymoon",     name:{fr:"Séance spa & détente",             en:"Spa & wellness session"},        desc:{fr:"Un moment de bien-être rien que pour nous",                        en:"A moment of relaxation just for the two of us"},              amount:120, stripe:"" },
  { id:"nn1", cat:{fr:"Notre nid",      icon:"🏡"}, catEn:"Our Home",      name:{fr:"Robot pâtissier",                  en:"Stand mixer"},                   desc:{fr:"Pour les futures pâtisseries du dimanche matin",                   en:"For future Sunday morning baking sessions"},                  amount:350, stripe:"" },
  { id:"nn2", cat:{fr:"Notre nid",      icon:"🏡"}, catEn:"Our Home",      name:{fr:"Cave à vins",                      en:"Wine rack"},                     desc:{fr:"Pour conserver nos bouteilles préférées",                          en:"To store our favourite bottles"},                             amount:300, stripe:"" },
  { id:"nn3", cat:{fr:"Notre nid",      icon:"🏡"}, catEn:"Our Home",      name:{fr:"Batterie de cuisine Le Creuset",   en:"Le Creuset cookware set"},       desc:{fr:"Des cocottes et poêles de qualité pour cuisiner ensemble",         en:"Quality casseroles and pans for cooking together"},           amount:280, stripe:"" },
  { id:"nn4", cat:{fr:"Notre nid",      icon:"🏡"}, catEn:"Our Home",      name:{fr:"Robot aspirateur",                 en:"Robot vacuum cleaner"},          desc:{fr:"Un peu d'aide bien méritée pour le quotidien !",                   en:"A little well-deserved help with daily chores!"},             amount:200, stripe:"" },
  { id:"at1", cat:{fr:"Art de la table",icon:"🍽️"}, catEn:"Table Arts",    name:{fr:"Service de table complet",         en:"Complete tableware set"},        desc:{fr:"Une belle vaisselle pour recevoir nos proches",                    en:"Beautiful crockery for hosting our loved ones"},              amount:400, stripe:"" },
  { id:"at2", cat:{fr:"Art de la table",icon:"🍽️"}, catEn:"Table Arts",    name:{fr:"Verres à vin & champagne",          en:"Wine & champagne glasses"},     desc:{fr:"Pour trinquer à toutes nos futures occasions",                     en:"For toasting all our future celebrations"},                   amount:180, stripe:"" },
  { id:"at3", cat:{fr:"Art de la table",icon:"🍽️"}, catEn:"Table Arts",    name:{fr:"Couverts premium",                 en:"Premium cutlery"},               desc:{fr:"Une argenterie moderne pour une belle table",                      en:"Modern silverware for a beautiful table setting"},            amount:220, stripe:"" },
  { id:"ex1", cat:{fr:"Expériences",    icon:"🎭"}, catEn:"Experiences",   name:{fr:"Weekend gastronomique",             en:"Gastronomic weekend"},           desc:{fr:"Un weekend gourmand en amoureux dans une belle région",            en:"A foodie weekend away for two in a beautiful region"},        amount:350, stripe:"" },
  { id:"ex2", cat:{fr:"Expériences",    icon:"🎭"}, catEn:"Experiences",   name:{fr:"Cours de cuisine",                 en:"Cooking class"},                 desc:{fr:"Apprendre ensemble de nouvelles recettes avec un chef",            en:"Learning new recipes together with a chef"},                  amount:120, stripe:"" },
  { id:"ex3", cat:{fr:"Expériences",    icon:"🎭"}, catEn:"Experiences",   name:{fr:"Soirée à l'opéra",                 en:"Opera evening"},                 desc:{fr:"Une belle soirée culturelle pour nous deux",                       en:"A wonderful cultural evening for the two of us"},             amount:150, stripe:"" },
];

const C = {
  bg:"#FFFFFF", card:"#FFFFFF", green:"#1C3320", greenMid:"#3A5C3C",
  gold:"#AD8540", goldMed:"#C49A50", cream:"#EDE4CC", border:"#DCCFB5",
  muted:"#7A8A7B", light:"#A8BDA9", success:"#3D7A3D",
};

// ┌─────────────────────────────────────────────────────────────┐
// │  App principale                                             │
// └─────────────────────────────────────────────────────────────┘
export default function App() {
  const [tab,           setTab          ] = useState("home");
  const [lang,          setLang         ] = useState("fr");
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
  const [toast, setToast] = useState(null);
  const [langChosen, setLangChosen] = useState(() => {
  const saved = localStorage.getItem("langChosenAt");
  if (!saved) return false;
  return Date.now() - parseInt(saved) < 24 * 60 * 60 * 1000;
});

  const t = TR[lang];
  const setOpenGift = (id) => { setOpenGiftRaw(id); setPayMethod(null); };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

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

  useEffect(() => {
    const tick = () => {
      const diff = DATE_MARIAGE - new Date();
      if (diff <= 0) { setCountdown({ d:0,h:0,m:0,s:0 }); return; }
      setCountdown({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setAdminAuthed(true); setAdminUnlocked(true); }
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

  const navigate = (tab) => { setTab(tab); setMobileMenu(false); setOpenGift(null); };

  const TABS = [
    { id:"home",  label: t.nav.home },
    { id:"story", label: t.nav.story },
    { id:"gifts", label: t.nav.gifts },
    { id:"info",  label: t.nav.info },
    ...(adminUnlocked ? [{ id:"admin", label:"⚙ Admin" }] : []),
  ];

  // Bouton langue
  const LangToggle = () => (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <button onClick={() => setLang("fr")} title="Français" style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, opacity: lang==="fr" ? 1 : 0.35, transition:"opacity 0.2s", padding:"2px" }}>🇫🇷</button>
      <button onClick={() => setLang("en")} title="English"  style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, opacity: lang==="en" ? 1 : 0.35, transition:"opacity 0.2s", padding:"2px" }}>🇬🇧</button>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Jost',sans-serif", backgroundColor:C.bg, minHeight:"100vh", color:C.green }}>

      {/* HEADER */}
      <header style={{ backgroundColor:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:50, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:980, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"center", height:64, position:"relative" }}>
          {/* Nav desktop */}
          <nav style={{ display:"flex" }} className="hidden md:flex">
            {TABS.map(t => (
              <button key={t.id} onClick={() => navigate(t.id)} style={{
                background:"none", border:"none", cursor:"pointer",
                color: tab===t.id ? C.gold : C.green,
                fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:400,
                letterSpacing:"0.2em", textTransform:"uppercase", padding:"10px 14px",
                borderBottom: tab===t.id ? `2px solid ${C.goldMed}` : "2px solid transparent",
                transition:"color 0.2s",
              }}>{t.label}</button>
            ))}
          </nav>

          {/* Toggle langue desktop — à droite */}
          <div className="hidden md:flex" style={{ position:"absolute", right:20, top:"50%", transform:"translateY(-50%)" }}>
            <LangToggle />
          </div>

          {/* Hamburger mobile */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="flex md:hidden" style={{ background:"none", border:"none", cursor:"pointer", color:C.green, fontSize:22, padding:"4px 0", lineHeight:1, position:"absolute", right:20 }}>
            {mobileMenu ? "✕" : "☰"}
          </button>
        </div>

        {/* Menu mobile */}
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
            {/* Toggle langue mobile */}
            <div style={{ padding:"14px 24px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", gap:12, alignItems:"center" }}>
              <button onClick={() => { setLang("fr"); setMobileMenu(false); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, opacity: lang==="fr" ? 1 : 0.35 }}>🇫🇷</button>
              <button onClick={() => { setLang("en"); setMobileMenu(false); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, opacity: lang==="en" ? 1 : 0.35 }}>🇬🇧</button>
            </div>
          </nav>
        )}
      </header>

      {/* CONTENU */}
      <main style={{ maxWidth:980, margin:"0 auto", padding:"0 16px 80px" }}>
        {tab==="home"  && <HomePage  countdown={countdown} navigate={navigate} t={t} lang={lang} />}
        {tab==="story" && <StoryPage t={t} lang={lang} />}
        {tab==="gifts" && <GiftsPage contribs={contribs} loaded={loaded} openGift={openGift} setOpenGift={setOpenGift} payMethod={payMethod} setPayMethod={setPayMethod} t={t} lang={lang} />}
        {tab==="info"  && <InfoPage  t={t} />}
        {tab==="admin" && <AdminPage
          authed={adminAuthed} pwd={adminPwd} setPwd={setAdminPwd}
          onAuth={async () => {
            const { error } = await supabase.auth.signInWithPassword({ email:"losigaud@gmail.com", password:adminPwd });
            if (error) showToast(t.admin.wrong); else setAdminAuthed(true);
          }}
          contribs={contribs} editVals={editVals} setEditVals={setEditVals} onSave={saveContrib}
          onSignOut={async () => { await supabase.auth.signOut(); setAdminAuthed(false); setAdminUnlocked(false); navigate("home"); }}
          t={t} lang={lang}
        />}
      </main>

      {/* FOOTER */}
      <footer style={{ textAlign:"center", padding:"24px 16px", borderTop:`1px solid ${C.border}` }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.light, marginBottom:12 }}>
          {t.footer}
        </p>
        {!adminUnlocked && (
          <button onClick={() => { setAdminUnlocked(true); navigate("admin"); }} title="Espace admin" style={{ background:"none", border:"none", cursor:"pointer", color:C.border, fontSize:13, letterSpacing:"0.3em", padding:"4px 8px" }}>
            ···
          </button>
        )}
      </footer>
{!langChosen && (
  <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(28,51,32,0.7)", zIndex:9998, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ backgroundColor:"#FFFFFF", borderRadius:20, padding:"48px 40px", maxWidth:420, width:"100%", textAlign:"center", boxShadow:"0 8px 40px rgba(0,0,0,0.2)" }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, letterSpacing:"0.3em", color:C.goldMed, textTransform:"uppercase", marginBottom:16 }}>
        Oriane & Louis · 19.06.2027
      </p>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:C.green, margin:"0 0 8px" }}>
        Bienvenue · Welcome
      </h2>
      <div style={{ width:40, height:1, backgroundColor:C.gold, margin:"20px auto 32px" }} />
      <p style={{ fontSize:13, color:C.muted, marginBottom:32, letterSpacing:"0.05em" }}>
        Choisissez votre langue · Please select your language
      </p>
      <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
        <button onClick={() => { setLang("fr"); localStorage.setItem("langChosenAt", Date.now());setLangChosen(true); }} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"20px 32px", backgroundColor:C.green, color:"#FAF8F3", border:"none", borderRadius:12, cursor:"pointer", flex:1 }}>
          <span style={{ fontSize:32 }}>🇫🇷</span>
          <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase" }}>Français</span>
        </button>
        <button onClick={() => { setLang("en"); localStorage.setItem("langChosenAt", Date.now());setLangChosen(true); }} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:"20px 32px", backgroundColor:C.green, color:"#FAF8F3", border:"none", borderRadius:12, cursor:"pointer", flex:1 }}>
          <span style={{ fontSize:32 }}>🇬🇧</span>
          <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:"0.2em", textTransform:"uppercase" }}>English</span>
        </button>
      </div>
    </div>
  </div>
)}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", backgroundColor:C.green, color:"#FAF8F3", padding:"13px 28px", borderRadius:8, fontSize:13, zIndex:9999, pointerEvents:"none", boxShadow:"0 4px 24px rgba(0,0,0,0.2)", whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────┐
// │  Page d'accueil                                             │
// └─────────────────────────────────────────────────────────────┘
function HomePage({ countdown, navigate, t, lang }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const cdLabels = t.home.countdown;

  if (isMobile) return (
    <div style={{ textAlign:"center", padding:"40px 24px" }}>
      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(38px,10vw,60px)", fontWeight:300, letterSpacing:"0.05em", color:C.green, margin:0, whiteSpace:"nowrap" }}>
        Oriane & Louis
      </h1>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.goldMed, letterSpacing:"0.2em", margin:"4px 0 32px" }}>
        {t.home.date}
      </p>
      {countdown && (
        <div style={{ backgroundColor:C.green, borderRadius:14, padding:"20px", display:"flex", justifyContent:"center", gap:24, marginBottom:24 }}>
          {[{v:countdown.d,l:cdLabels[0]},{v:countdown.h,l:cdLabels[1]},{v:countdown.m,l:cdLabels[2]},{v:countdown.s,l:cdLabels[3]}].map(({v,l}) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:32, fontWeight:300, color:"#FAF8F3", lineHeight:1 }}>{String(v).padStart(2,"0")}</div>
              <div style={{ fontSize:8, color:C.goldMed, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:6 }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate("gifts")} style={{ backgroundColor:C.gold, color:"#FAF8F3", border:"none", cursor:"pointer", padding:"16px 40px", fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:"0.26em", textTransform:"uppercase", fontWeight:400, borderRadius:4, marginBottom:32 }}>
        {t.home.cta}
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
              {t.home.date}
            </p>
          </div>
          {countdown && (
            <div style={{ backgroundColor:C.green, borderRadius:14, marginTop:"10%", padding:"16px 20px", display:"flex", justifyContent:"center", gap:"clamp(12px,2vw,32px)", width:"75%" }}>
              {[{v:countdown.d,l:cdLabels[0]},{v:countdown.h,l:cdLabels[1]},{v:countdown.m,l:cdLabels[2]},{v:countdown.s,l:cdLabels[3]}].map(({v,l}) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"clamp(18px,2.5vw,36px)", fontWeight:300, color:"#FAF8F3", lineHeight:1, fontVariantNumeric:"lining-nums" }}>{String(v).padStart(2,"0")}</div>
                  <div style={{ fontSize:"clamp(7px,0.8vw,9px)", color:C.goldMed, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:6 }}>{l}</div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate("gifts")} style={{ backgroundColor:C.gold, color:"#FAF8F3", border:"none", cursor:"pointer", padding:"clamp(14px,1.2vw,18px) clamp(32px,3vw,60px)", fontFamily:"'Jost',sans-serif", fontSize:"clamp(12px,1vw,14px)", letterSpacing:"0.26em", textTransform:"uppercase", fontWeight:400, borderRadius:4, marginTop:32 }}>
            {t.home.cta}
          </button>
        </div>
        <div style={{ height:"29vw", borderRadius:12, backgroundColor:C.cream, overflow:"hidden" }}>
          <img src="/photo-droite.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
        </div>
      </div>
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────┐
// │  Mosaïque                                                   │
// └─────────────────────────────────────────────────────────────┘
function MosaicItem({ event }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ borderRadius:12, overflow:"hidden", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(20px)", transition:"opacity 0.5s ease, transform 0.5s ease", cursor:"pointer", position:"relative", aspectRatio:event.ratio==="3:4"?"3/4":"4/3" }}>
      <img src={event.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={e => e.target.style.display="none"} />
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────┐
// │  Notre Histoire                                             │
// └─────────────────────────────────────────────────────────────┘
function StoryPage({ t, lang }) {
  const getText = (t) => typeof t === "object" ? t[lang] : t;

const events = [
  { type:"year", year:"2023" },
  { date:{fr:"14 Septembre 2023 - Vendée",      en:"September 14, 2023 - Vendée"},      photo:"/histoire-1.png",  text:{fr:"Première rencontre — Nous ne nous connaissions pas encore au moment de cette photo 👫🏻", en:"First meeting — We didn't even know each other yet at the time of this photo 👫🏻"} },
  { date:{fr:"Novembre 2023 - Florence",         en:"November 2023 - Florence"},          photo:"/histoire-2.jpg",  text:{fr:"Notre premier weekend ensemble 🇮🇹", en:"Our first weekend away together 🇮🇹"} },
  { type:"year", year:"2024" },
  { date:{fr:"Janvier 2024 - Auron",             en:"January 2024 - Auron"},              photo:"/histoire-3.jpg",  text:{fr:"Premier séjour au ski avec nos amis ⛷️", en:"First ski trip with our friends ⛷️"} },
  { date:{fr:"Avril 2024 - Roumanie",            en:"April 2024 - Romania"},              photo:"/histoire-4.jpg",  text:{fr:"Première vacances à deux 🇷🇴", en:"Our first holiday just the two of us 🇷🇴"} },
  { date:{fr:"Aout 2024 - Cap d'Ail",            en:"August 2024 - Cap d'Ail"},           photo:"/histoire-5.jpeg", text:{fr:"Anniversaire d'Oriane sur la Côte d'Azur 🎂", en:"Oriane's birthday on the French Riviera 🎂"} },
  { date:{fr:"Octobre 2024 - Île de la Réunion", en:"October 2024 - Réunion Island"},     photo:"/histoire-6.png",  text:{fr:"Voyage en famille à la Réunion 🇷🇪", en:"Family trip to Réunion Island 🇷🇪"}, ratio:"3:4" },
  { date:{fr:"Nouvel An 2024 / 2025",            en:"New Year's Eve 2024/2025"},          photo:"/histoire-7.png",  text:{fr:"Nouvel An entre bons copains, qui dit nouvelle année dit...", en:"New Year's Eve with great friends, new year means..."} },
  { type:"year", year:"2025" },
  { date:{fr:"Janvier 2025 - Paris",             en:"January 2025 - Paris"},              photo:"/histoire-8.jpg",  text:{fr:"... emménagement ensemble à Paris ! 🗼", en:"... moving in together in Paris! 🗼"} },
  { date:{fr:"Mars 2025 - Thaïlande / Hong Kong",en:"March 2025 - Thailand / Hong Kong"}, photo:"/histoire-9.png",  text:{fr:"Voyage en Asie 🇹🇭 🇭🇰", en:"Trip to Asia 🇹🇭 🇭🇰"}, ratio:"3:4" },
  { date:{fr:"Avril 2025 - Varengeville",        en:"April 2025 - Varengeville"},         photo:"/histoire-10.jpg", text:{fr:"Découverte de la Normandie d'Oriane 🌊", en:"Discovering Oriane's Normandy 🌊"} },
  { date:{fr:"Avril 2025 - Beaune",              en:"April 2025 - Beaune"},               photo:"/histoire-11.jpg", text:{fr:"Route des vins de bourgogne 🍷", en:"Burgundy wine route 🍷"}, ratio:"3:4" },
  { date:{fr:"Mai 2025 - Boston & New York",     en:"May 2025 - Boston & New York"},      photo:"/histoire-12.jpg", text:{fr:"Voyage dans la famille américaine de Louis 🇺🇸", en:"Visiting Louis's American family 🇺🇸"} },
  { date:{fr:"Juillet 2025 - La Ronze",          en:"July 2025 - La Ronze"},              photo:"/histoire-13.png", text:{fr:"80 ans du grand-père de Louis 🎂", en:"Louis's grandfather's 80th birthday 🎂"} },
  { date:{fr:"Août 2025 - Le Guillier",          en:"August 2025 - Le Guillier"},         photo:"/histoire-14.png", text:{fr:"Parenthèse bretonne pour l'été 🌿", en:"A Breton summer escape 🌿"}, ratio:"3:4" },
  { date:{fr:"Novembre 2025",                    en:"November 2025"},                     photo:"/histoire-15.png", text:{fr:"Oriane découvre le plus beau stade de France 🔵⚪", en:"Oriane discovers the finest stadium in France 🔵⚪"} },
  { type:"year", year:"2026" },
  { date:{fr:"Janvier 2027 - Venise",            en:"January 2027 - Venice"},             photo:"/histoire-16.jpg", text:{fr:"Découverte de la ville des amoureux ❤️ 🇮🇹", en:"Discovering the city of love ❤️ 🇮🇹"}, ratio:"3:4" },
  { type:"year", year:"Et après un fabuleux voyage en Arménie et en Géorgie...", mosaic:true },
  { date:{fr:"Photo 1", en:"Photo 1"}, photo:"/histoire-17.jpg", text:{fr:"À compléter ✍️", en:"To be completed ✍️"}, ratio:"3:4" },
  { date:{fr:"Photo 2", en:"Photo 2"}, photo:"/histoire-18.jpg", text:{fr:"À compléter ✍️", en:"To be completed ✍️"}, ratio:"3:4" },
  { date:{fr:"Photo 3", en:"Photo 3"}, photo:"/histoire-19.jpg", text:{fr:"À compléter ✍️", en:"To be completed ✍️"}, ratio:"3:4" },
  { date:{fr:"Photo 4", en:"Photo 4"}, photo:"/histoire-20.jpg", ratio:"3:4", fullWidth:true },
  { type:"text", text:{fr:"... ils se sont dit OUI", en:"... they said YES"} },
  { date:{fr:"Photo 5", en:"Photo 5"}, photo:"/histoire-21.jpg", ratio:"3:4", fullWidth:true },
];

  const sections = [];
  let current = null;
  for (const e of events) {
    if (e.type === "year") { if (current) sections.push(current); current = { year:e.year, mosaic:e.mosaic||false, photos:[] }; }
    else if (current) current.photos.push(e);
  }
  if (current) sections.push(current);

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"60px 20px", backgroundColor:C.bg }}>
      <SectionTitle title={t.story.title} />
      {(() => {
        let globalIdx = 0;
        return sections.map((section, si) => (
          <div key={si} style={{ marginBottom:60 }}>
            <div style={{ textAlign:"center", margin:"40px 0 32px", position:"relative", zIndex:1, backgroundColor:C.bg }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, color:C.green, letterSpacing:"0.1em" }}>{section.year}</span>
              <div style={{ width:60, height:1, backgroundColor:C.gold, margin:"8px auto 0" }} />
            </div>
            {section.mosaic ? (
              (() => {
                const items = section.photos;
                let row = []; const blocks = [];
                for (const item of items) {
                  if (item.type === "text" || item.fullWidth) {
                    if (row.length > 0) { blocks.push({ type:"grid", items:[...row] }); row = []; }
                    blocks.push(item.type === "text" ? { type:"text", text:item.text } : { type:"full", item });
                  } else {
                    row.push(item);
                    if (row.length === 3) { blocks.push({ type:"grid", items:[...row] }); row = []; }
                  }
                }
                if (row.length > 0) blocks.push({ type:"grid", items:[...row] });
                return (
                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    {blocks.map((block, bi) => {
                      if (block.type === "grid") return (
                        <div key={bi} style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
                          {block.items.map((p, pi) => <MosaicItem key={pi} event={p} />)}
                        </div>
                      );
                      if (block.type === "full") return (
                        <div key={bi} style={{ width:"100%", borderRadius:12, overflow:"hidden", aspectRatio:"3/2" }}>
                          <img src={block.item.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                      );
                      if (block.type === "text") return (
                        <p key={bi} style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, color:C.green, letterSpacing:"0.1em", textAlign:"center", lineHeight:1.8, padding:"8px 40px" }}>
                          {typeof block.text === "object" ? block.text[lang] : block.text}
                        </p>
                      );
                      return null;
                    })}
                  </div>
                );
              })()
            ) : (
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, backgroundColor:C.border, transform:"translateX(-50%)" }} />
                {section.photos.map((event, i) => { const idx = globalIdx++; return <TimelineItem key={i} event={event} index={idx} lang={lang} />; })}
              </div>
            )}
          </div>
        ));
      })()}
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────┐
// │  Timeline                                                   │
// └─────────────────────────────────────────────────────────────┘
function TimelineItem({ event, index, lang }) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ref = useRef(null);
  const isLeft = index % 2 === 0;
  const getText = (t) => typeof t === "object" ? t[lang] : t;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (isMobile) return (
    <div ref={ref} style={{ marginBottom:48, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(30px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
      <div style={{ backgroundColor:"#FFFFFF", border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ padding:"14px 20px 0" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.gold, letterSpacing:"0.15em", margin:0, fontWeight:400, textAlign:"center" }}>{getText(event.date)}</p>
        </div>
        <div style={{ height:event.ratio==="3:4"?400:260, backgroundColor:C.cream, overflow:"hidden", margin:"12px 0 0" }}>
          <img src={event.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
        </div>
        <div style={{ padding:"14px 20px 18px" }}>
          <p style={{ fontSize:14, color:C.muted, lineHeight:1.75, margin:0, textAlign:"center" }}>{getText(event.text)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={{ display:"flex", justifyContent:isLeft?"flex-start":"flex-end", marginBottom:1, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(30px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
      <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", width:12, height:12, borderRadius:"50%", backgroundColor:C.gold, border:`2px solid ${C.bg}`, marginTop:20, zIndex:1 }} />
      <div style={{ width:"44%", marginLeft:isLeft?0:"auto", marginRight:isLeft?"auto":0, paddingLeft:isLeft?0:24, paddingRight:isLeft?24:0 }}>
        <div style={{ backgroundColor:"#FFFFFF", border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ height:event.ratio==="3:4"?293:220, backgroundColor:C.cream, overflow:"hidden" }}>
            <img src={event.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none"} />
          </div>
          <div style={{ padding:"16px 20px" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.gold, letterSpacing:"0.15em", marginBottom:8, fontWeight:400 }}>{getText(event.date)}</p>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.75 }}>{getText(event.text)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ┌─────────────────────────────────────────────────────────────┐
// │  Liste de mariage                                           │
// └─────────────────────────────────────────────────────────────┘
function GiftsPage({ contribs, loaded, openGift, setOpenGift, payMethod, setPayMethod, t, lang }) {
  const tg = t.gifts;
  const cats = [...new Set(GIFTS.map(g => lang==="fr" ? g.cat.fr : g.catEn))].map(name => ({
    name, icon: GIFTS.find(g => (lang==="fr" ? g.cat.fr : g.catEn) === name).cat.icon
  }));

  if (!loaded) return (
    <div style={{ textAlign:"center", padding:"80px 20px", fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.muted }}>{tg.loading}</div>
  );

  return (
    <div style={{ padding:"40px 0" }}>
      <SectionTitle title={tg.title} subtitle={tg.subtitle} />
      {cats.map(cat => {
        const gifts    = GIFTS.filter(g => (lang==="fr" ? g.cat.fr : g.catEn) === cat.name);
        const totalCat = gifts.reduce((s,g) => s+g.amount, 0);
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
                          {full && <span style={{ color:C.success }}>✓ </span>}{gift.name[lang]}
                        </h3>
                        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:C.gold, marginLeft:14, flexShrink:0 }}>{gift.amount} €</span>
                      </div>
                      <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:14 }}>{gift.desc[lang]}</p>
                      <div style={{ marginBottom:14 }}>
                        <div style={{ height:3, backgroundColor:C.cream, borderRadius:2, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, backgroundColor:full?C.success:C.gold, borderRadius:2, transition:"width 0.6s ease" }} />
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:C.muted }}>
                          <span>{Math.round(contrib)} {tg.collected}</span>
                          <span style={{ fontWeight:500, color:full?C.success:C.gold }}>{pct}%</span>
                        </div>
                      </div>
                      {!full ? (
                        <button onClick={() => setOpenGift(isOpen?null:gift.id)} style={{ width:"100%", padding:"10px 16px", backgroundColor:isOpen?C.cream:C.green, color:isOpen?C.green:"#FAF8F3", border:"none", cursor:"pointer", borderRadius:7, fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", transition:"all 0.2s" }}>
                          {isOpen ? tg.close : tg.participate}
                        </button>
                      ) : (
                        <div style={{ textAlign:"center", fontSize:14, color:C.success, fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>{tg.completed}</div>
                      )}
                    </div>
                    {isOpen && !full && <PaymentPanel gift={gift} payMethod={payMethod} setPayMethod={setPayMethod} t={t} lang={lang} />}
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

function PaymentPanel({ gift, payMethod, setPayMethod, t, lang }) {
  const tg = t.gifts;
  const toggle = (m) => setPayMethod(payMethod===m ? null : m);
  return (
    <div style={{ borderTop:`1px solid ${C.cream}`, backgroundColor:"#F6F3EC", padding:"20px 20px 24px" }}>
      <p style={{ fontSize:13, color:C.muted, marginBottom:16, lineHeight:1.65 }}>{tg.payIntro}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {gift.stripe && <PayBtn icon="💳" label={tg.stripeLabel} sub={tg.stripeSub} primary onClick={() => window.open(gift.stripe,"_blank")} />}
        <PayBtn icon="📱" label={tg.weroLabel} sub={`${tg.weroSub} ${WERO_TEL}`} active={payMethod==="wero"} onClick={() => toggle("wero")} />
        <PayBtn icon="🏦" label={tg.ibanLabel} sub={tg.ibanSub} active={payMethod==="iban"} onClick={() => toggle("iban")} />
      </div>
      {payMethod==="iban" && (
        <div style={{ marginTop:14, backgroundColor:C.cream, borderRadius:10, padding:"16px 18px" }}>
          <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:C.greenMid, fontWeight:500, marginBottom:12 }}>{tg.ibanTitle}</p>
          {[[tg.ibanBene,IBAN_INFO.nom],["IBAN",IBAN_INFO.iban],["BIC / SWIFT",IBAN_INFO.bic],[tg.ibanRef,gift.name[lang]]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, gap:12 }}>
              <span style={{ color:C.muted, flexShrink:0, fontSize:12 }}>{k}</span>
              <span style={{ color:C.green, fontFamily:k==="IBAN"||k==="BIC / SWIFT"?"monospace":"inherit", fontSize:k==="IBAN"?11:13, wordBreak:"break-all", textAlign:"right" }}>{v}</span>
            </div>
          ))}
          <p style={{ fontSize:11, color:C.muted, marginTop:10, fontStyle:"italic" }}>{tg.ibanNote}</p>
        </div>
      )}
      {payMethod==="wero" && (
        <div style={{ marginTop:14, backgroundColor:C.cream, borderRadius:10, padding:"16px 18px" }}>
          <p style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:C.greenMid, fontWeight:500, marginBottom:10 }}>{tg.weroTitle}</p>
          <p style={{ fontSize:13, color:C.greenMid, lineHeight:1.75, marginBottom:8 }}>{tg.weroText}</p>
          <p style={{ fontFamily:"monospace", fontSize:20, color:C.green, fontWeight:500, textAlign:"center", padding:"10px 0" }}>{WERO_TEL}</p>
          <p style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>{tg.weroNote}</p>
        </div>
      )}
    </div>
  );
}

function PayBtn({ icon, label, sub, onClick, primary, active }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", backgroundColor:primary?C.green:active?C.cream:C.card, border:`1px solid ${primary?C.green:active?C.gold:C.border}`, borderRadius:8, cursor:"pointer", textAlign:"left", width:"100%", transition:"all 0.15s" }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, fontWeight:primary||active?500:400, color:primary?"#FAF8F3":C.green }}>{label}</div>
        <div style={{ fontSize:11, color:primary?"rgba(250,248,243,0.65)":C.muted, marginTop:2 }}>{sub}</div>
      </div>
      {!primary && <span style={{ fontSize:11, color:C.light }}>{active?"▲":"▼"}</span>}
    </button>
  );
}

// ┌─────────────────────────────────────────────────────────────┐
// │  Infos pratiques                                            │
// └─────────────────────────────────────────────────────────────┘
function InfoPage({ t }) {
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"60px 20px" }}>
      <SectionTitle title={t.info.title} />
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {t.info.sections.map(info => (
          <div key={info.title} style={{ display:"flex", gap:20, backgroundColor:"#FFFFFF", border:`1px solid ${C.border}`, boxShadow:"0 2px 16px rgba(0,0,0,0.08)", borderRadius:14, padding:"20px 24px" }}>
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

// ┌─────────────────────────────────────────────────────────────┐
// │  Admin                                                      │
// └─────────────────────────────────────────────────────────────┘
function AdminPage({ authed, pwd, setPwd, onAuth, onSignOut, contribs, editVals, setEditVals, onSave, t, lang }) {
  const ta = t.admin;
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"60px 20px" }}>
      <SectionTitle title={ta.title} />
      {!authed ? (
        <div style={{ textAlign:"center", maxWidth:380, margin:"0 auto" }}>
          <p style={{ fontSize:14, color:C.muted, marginBottom:20 }}>{ta.pwd}</p>
          <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key==="Enter"&&onAuth()} placeholder="••••••••"
            style={{ width:"100%", padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:9, fontSize:14, backgroundColor:C.card, color:C.green, marginBottom:12, boxSizing:"border-box" }} />
          <button onClick={onAuth} style={{ width:"100%", padding:"13px 20px", backgroundColor:C.green, color:"#FAF8F3", border:"none", borderRadius:9, cursor:"pointer", fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase" }}>
            {ta.access}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button onClick={onSignOut} style={{ background:"none", border:`1px solid ${C.border}`, cursor:"pointer", padding:"8px 16px", borderRadius:6, fontSize:12, color:C.muted }}>{ta.signout}</button>
          </div>
          <div style={{ backgroundColor:C.cream, borderRadius:12, padding:"16px 20px", marginBottom:32, fontSize:14, lineHeight:1.75, color:C.greenMid }}>{ta.note}</div>
          {GIFTS.map(gift => {
            const current = contribs[gift.id] || 0;
            const editVal = editVals[gift.id] !== undefined ? editVals[gift.id] : current;
            const pct     = Math.min(100, Math.round(current/gift.amount*100));
            return (
              <div key={gift.id} style={{ padding:"18px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:500, color:C.green, marginBottom:4 }}>{gift.name[lang]}</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{lang==="fr"?gift.cat.fr:gift.catEn} · {ta.target} : {gift.amount} €</div>
                    <div style={{ height:3, backgroundColor:C.cream, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, backgroundColor:pct>=100?C.success:C.gold, borderRadius:2 }} />
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:5 }}>
                      {Math.round(current)} € {ta.collected2} ({pct}%)
                      {pct>=100 && <span style={{ color:C.success, marginLeft:6 }}>✓ {ta.completed2}</span>}
                    </div>
                  </div>
                  <div style={{ flexShrink:0 }}>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>{ta.amount}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <input type="number" min="0" max={gift.amount} step="1" value={editVal} onChange={e => setEditVals(p => ({...p,[gift.id]:e.target.value}))}
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
