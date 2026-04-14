import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   INFLUFIND v2 — Premium SaaS UI
   Dark glassmorphism · Cinematic gradients · Micro-animations
═══════════════════════════════════════════════════════════════ */

// ── GLOBAL CSS ────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Satoshi:wght@300;400;500;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%}
    body{font-family:'Satoshi',system-ui,sans-serif;background:#050507;color:#fff;overflow-x:hidden}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.4);border-radius:2px}
    input,textarea,select,button{font-family:'Satoshi',system-ui,sans-serif}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(139,92,246,0.3)}50%{box-shadow:0 0 40px rgba(139,92,246,0.6)}}
    @keyframes countUp{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
    .fade-up{animation:fadeUp 0.5s cubic-bezier(.22,1,.36,1) both}
    .fade-in{animation:fadeIn 0.4s ease both}
    .hover-lift{transition:transform 0.25s cubic-bezier(.22,1,.36,1),box-shadow 0.25s ease}
    .hover-lift:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.4)}
    .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
    .glass-strong{background:rgba(255,255,255,0.07);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);border:1px solid rgba(255,255,255,0.12)}
    .shimmer{background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.03) 75%);background-size:200% 100%;animation:shimmer 1.8s infinite}
    .glow-violet{animation:glow 3s ease-in-out infinite}
    .float{animation:floatY 4s ease-in-out infinite}
  `}</style>
);

// ── THEME ─────────────────────────────────────────────────────
const T = {
  violet:"#8B5CF6", violetLight:"#A78BFA", violetDark:"#6D28D9",
  violetGlow:"rgba(139,92,246,0.25)", violetSoft:"rgba(139,92,246,0.1)",
  emerald:"#10B981", amber:"#F59E0B", rose:"#F43F5E", sky:"#38BDF8",
  bg:"#050507", surface:"rgba(255,255,255,0.04)", surfaceHover:"rgba(255,255,255,0.07)",
  border:"rgba(255,255,255,0.08)", borderHover:"rgba(255,255,255,0.16)",
  text:"#F8FAFC", textMuted:"rgba(248,250,252,0.5)", textFaint:"rgba(248,250,252,0.28)",
};

// ── MOCK DATA ─────────────────────────────────────────────────
const INFLUENCERS = [
  { id:1, name:"Priya Sharma", handle:"@priya.creates", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=120&h=120&fit=crop&crop=face", cover:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop", niche:"Fashion & Lifestyle", platform:"Instagram", followers:"1.2M", engagement:"4.8%", location:"Mumbai", avgViews:"340K", rating:4.9, fee:"$2,400", tags:["fashion","lifestyle","beauty"], verified:true, trend:"+12%", color:"#EC4899" },
  { id:2, name:"Arjun Mehta", handle:"@arjunfitlife", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face", cover:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop", niche:"Fitness & Health", platform:"YouTube", followers:"890K", engagement:"6.2%", location:"Delhi", avgViews:"210K", rating:4.7, fee:"$1,800", tags:["fitness","health","nutrition"], verified:true, trend:"+8%", color:"#10B981" },
  { id:3, name:"Sneha Patel", handle:"@snehacooks", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face", cover:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop", niche:"Food & Travel", platform:"Instagram", followers:"560K", engagement:"5.4%", location:"Bangalore", avgViews:"120K", rating:4.6, fee:"$900", tags:["food","travel","recipes"], verified:false, trend:"+21%", color:"#F59E0B" },
  { id:4, name:"Rohan Das", handle:"@rohantech", avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face", cover:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop", niche:"Tech & Gaming", platform:"YouTube", followers:"2.1M", engagement:"3.9%", location:"Hyderabad", avgViews:"680K", rating:4.8, fee:"$4,200", tags:["tech","gaming","reviews"], verified:true, trend:"+5%", color:"#38BDF8" },
  { id:5, name:"Kavya Nair", handle:"@kavya.beauty", avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face", cover:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=200&fit=crop", niche:"Beauty & Skincare", platform:"Instagram", followers:"780K", engagement:"7.1%", location:"Chennai", avgViews:"190K", rating:4.9, fee:"$1,500", tags:["beauty","skincare","makeup"], verified:true, trend:"+34%", color:"#A78BFA" },
  { id:6, name:"Vikram Singh", handle:"@vikram.adventure", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face", cover:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop", niche:"Travel & Adventure", platform:"YouTube", followers:"1.5M", engagement:"5.0%", location:"Jaipur", avgViews:"420K", rating:4.5, fee:"$3,100", tags:["travel","adventure","outdoors"], verified:true, trend:"+17%", color:"#F97316" },
];

const CAMPAIGNS = [
  { id:1, name:"Summer Glow Collection", brand:"LumiSkin", status:"active", progress:72, influencer:"Kavya Nair", influencerAvatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face", expectedReach:"800K", actualReach:"576K", budget:5000, spent:3200, deadline:"Jul 15", deliverables:3, submitted:2 },
  { id:2, name:"FitZone Launch", brand:"NutriBoost", status:"completed", progress:100, influencer:"Arjun Mehta", influencerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", expectedReach:"500K", actualReach:"612K", budget:3000, spent:2850, deadline:"Jun 01", deliverables:2, submitted:2 },
  { id:3, name:"TechPulse Review Series", brand:"GadgetHub", status:"pending", progress:15, influencer:"Rohan Das", influencerAvatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", expectedReach:"1.2M", actualReach:"180K", budget:8000, spent:1200, deadline:"Aug 20", deliverables:4, submitted:1 },
  { id:4, name:"Wanderlust Collection", brand:"ExploreWear", status:"active", progress:45, influencer:"Vikram Singh", influencerAvatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", expectedReach:"900K", actualReach:"405K", budget:6000, spent:2700, deadline:"Jul 30", deliverables:5, submitted:2 },
];

const MSGS = [
  { id:1, sender:"Kavya Nair", avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face", text:"Hey! Just finished shooting the first reel for Summer Glow 🎥 Uploading shortly!", time:"10:32 AM", mine:false },
  { id:2, sender:"You", avatar:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=60&h=60&fit=crop&crop=face", text:"Amazing! Make sure to include the brand tagline in the first 3 seconds.", time:"10:35 AM", mine:true },
  { id:3, sender:"Kavya Nair", avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face", text:"Absolutely noted! Should I also add the discount code in the caption?", time:"10:37 AM", mine:false },
  { id:4, sender:"You", avatar:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=60&h=60&fit=crop&crop=face", text:"Yes! Use GLOW20 for 20% off. Add it prominently at the end.", time:"10:40 AM", mine:true },
];

const NOTIFS = [
  { id:1, type:"match", icon:"✦", title:"New Influencer Match", message:"Priya Sharma (1.2M followers) matches your Fashion campaign with 94% compatibility.", time:"2 min ago", read:false, color:"#8B5CF6" },
  { id:2, type:"campaign", icon:"✓", title:"Campaign Completed", message:"FitZone Launch with Arjun Mehta hit 122% of target reach. Outstanding results!", time:"1 hr ago", read:false, color:"#10B981" },
  { id:3, type:"message", icon:"✉", title:"New Message", message:"Kavya Nair sent you an update about the Summer Glow campaign deliverables.", time:"2 hr ago", read:true, color:"#38BDF8" },
  { id:4, type:"reach", icon:"▲", title:"Reach Milestone", message:"FitZone Launch exceeded 500K target. Final count: 612K unique viewers.", time:"1 day ago", read:true, color:"#F59E0B" },
  { id:5, type:"match", icon:"✦", title:"New Influencer Match", message:"Rohan Das (2.1M followers) is an elite fit for your Tech product line.", time:"2 days ago", read:true, color:"#8B5CF6" },
];

const REACH_DATA = [42, 65, 51, 89, 76, 94, 112, 98, 135, 158, 142, 180];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ENGAGE_DATA = [3.2, 4.1, 3.8, 5.2, 4.7, 6.1, 5.8, 7.2, 6.4, 5.9, 7.8, 8.1];

// ── PRIMITIVES ────────────────────────────────────────────────
const Chip = ({ children, color = T.violet }) => (
  <span style={{ background: color + "22", color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${color}44`, letterSpacing: 0.3 }}>{children}</span>
);

const Avatar = ({ src, size = 40, ring }) => (
  <img src={src} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: ring ? `2px solid ${ring}` : "2px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
);

const GlassCard = ({ children, style = {}, className = "", onClick, delay = 0 }) => (
  <div onClick={onClick} className={`glass hover-lift fade-up ${className}`}
    style={{ borderRadius: 20, padding: "22px 24px", cursor: onClick ? "pointer" : "default", animationDelay: `${delay}ms`, ...style }}>
    {children}
  </div>
);

const ProgressArc = ({ value, size = 64, stroke = 5, color = T.violet }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }} />
    </svg>
  );
};

const BarChart = ({ data, labels, color = T.violet, height = 120 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, paddingTop: 8 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{ width: "100%", background: `linear-gradient(to top, ${color}, ${color}66)`, borderRadius: "4px 4px 2px 2px", height: `${(v / max) * 100}%`, minHeight: 4, transition: "height 1s cubic-bezier(.22,1,.36,1)", transitionDelay: `${i * 40}ms` }} />
          </div>
          {labels && <span style={{ fontSize: 9, color: T.textFaint, letterSpacing: 0.3 }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, color = T.violetLight, height = 80 }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 300, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 10) - 5}`);
  const path = `M ${pts.join(" L ")}`;
  const fill = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#lg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Btn = ({ children, onClick, variant = "primary", sm, style = {} }) => {
  const [hov, setHov] = useState(false);
  const vs = {
    primary: { background: hov ? "#7C3AED" : "linear-gradient(135deg,#8B5CF6,#6D28D9)", color: "#fff", border: "1px solid rgba(139,92,246,0.5)" },
    ghost: { background: hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)", color: T.text, border: "1px solid rgba(255,255,255,0.1)" },
    danger: { background: hov ? "#DC2626" : "#EF4444", color: "#fff", border: "none" },
    success: { background: hov ? "#059669" : "#10B981", color: "#fff", border: "none" },
  };
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ ...vs[variant], borderRadius: 12, padding: sm ? "7px 14px" : "10px 20px", fontSize: sm ? 13 : 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.18s cubic-bezier(.22,1,.36,1)", transform: hov ? "scale(1.02)" : "scale(1)", ...style }}>
      {children}
    </button>
  );
};

const Loader = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, gap: 16 }}>
    <div style={{ width: 40, height: 40, border: `3px solid rgba(139,92,246,0.2)`, borderTop: `3px solid #8B5CF6`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    <span style={{ color: T.textFaint, fontSize: 13, letterSpacing: 0.5 }}>Loading...</span>
  </div>
);

const StatusPill = ({ status }) => {
  const map = { active: [T.emerald, "● Live"], completed: [T.sky, "✓ Done"], pending: [T.amber, "◌ Pending"] };
  const [c, l] = map[status] || [T.textFaint, status];
  return <Chip color={c}>{l}</Chip>;
};

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{ width: 46, height: 26, borderRadius: 13, background: value ? "linear-gradient(135deg,#8B5CF6,#6D28D9)" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "all 0.25s", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 3, left: value ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s cubic-bezier(.22,1,.36,1)", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }} />
  </div>
);

// ── SIDEBAR ───────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", label:"Dashboard", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id:"discover", label:"Discover", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
  { id:"content", label:"Content AI", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg> },
  { id:"campaigns", label:"Campaigns", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { id:"notifications", label:"Alerts", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, badge:2 },
  { id:"settings", label:"Settings", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const Sidebar = ({ page, setPage }) => {
  const [col, setCol] = useState(false);
  return (
    <aside style={{ width: col ? 68 : 230, background: "rgba(8,7,12,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)", height: "100vh", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", transition: "width 0.3s cubic-bezier(.22,1,.36,1)", zIndex: 200, overflow: "hidden" }}>
      {/* Logo */}
      <div style={{ padding: col ? "20px 16px" : "24px 20px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="glow-violet" style={{ width: 36, height: 36, background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>⬡</div>
        {!col && <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg,#fff,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.5 }}>InfluFind</div>}
        <button onClick={() => setCol(!col)} style={{ marginLeft: "auto", background: "none", border: "none", color: T.textFaint, cursor: "pointer", fontSize: 12, padding: 4, flexShrink: 0 }}>{col ? "▶" : "◀"}</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: col ? "12px" : "11px 14px", borderRadius: 12, marginBottom: 2, cursor: "pointer", background: active ? "rgba(139,92,246,0.15)" : "transparent", color: active ? T.violetLight : T.textFaint, border: active ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent", transition: "all 0.2s", position: "relative", justifyContent: col ? "center" : "flex-start" }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = T.text; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textFaint; }}}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!col && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              {!col && item.badge && <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{item.badge}</span>}
            </div>
          );
        })}
      </nav>

      {/* User */}
      {!col && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=72&h=72&fit=crop&crop=face" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(139,92,246,0.5)" }} alt="" />
          <div>
            <div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>Aarav Mehta</div>
            <div style={{ color: T.violetLight, fontSize: 11 }}>⬡ Pro Plan</div>
          </div>
        </div>
      )}
    </aside>
  );
};

// ── DASHBOARD ─────────────────────────────────────────────────
const Dashboard = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 500); }, []);
  if (!ready) return <Loader />;

  const stats = [
    { label: "Total Reach", value: "5.2M", sub: "↑ 18% this month", icon: "📡", color: T.violet, chart: REACH_DATA.slice(-6) },
    { label: "Active Campaigns", value: "4", sub: "2 deadlines soon", icon: "📋", color: T.emerald, chart: [3,4,3,5,4,4] },
    { label: "Avg Engagement", value: "5.4%", sub: "↑ 0.8% vs last month", icon: "⚡", color: T.amber, chart: ENGAGE_DATA.slice(-6) },
    { label: "Revenue Generated", value: "$84K", sub: "For partners this month", icon: "💎", color: T.rose, chart: [40,55,48,70,62,84] },
  ];

  return (
    <div>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: T.textFaint, fontSize: 13, marginBottom: 6, letterSpacing: 0.5 }}>MONDAY, JULY 7, 2025</div>
          <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 36, lineHeight: 1.1, background: "linear-gradient(135deg,#fff 40%,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Welcome back, Aarav 👋</h1>
          <p style={{ color: T.textMuted, fontSize: 15, marginTop: 8 }}>Your campaigns are reaching 5.2M people this month.</p>
        </div>
        <Btn style={{ gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Campaign
        </Btn>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <GlassCard key={s.label} delay={i * 80} style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1, animation: "countUp 0.5s ease both", animationDelay: `${i * 80 + 200}ms` }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.color, marginTop: 6, fontWeight: 500 }}>{s.sub}</div>
              </div>
              <div style={{ width: 44, height: 44, background: s.color + "1a", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: `1px solid ${s.color}33` }}>{s.icon}</div>
            </div>
            <LineChart data={s.chart} color={s.color} height={50} />
          </GlassCard>
        ))}
      </div>

      {/* Charts + Recent */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        <GlassCard delay={200}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 18 }}>Reach Analytics</div>
              <div style={{ color: T.textFaint, fontSize: 13, marginTop: 2 }}>Monthly reach across all campaigns</div>
            </div>
            <Chip color={T.emerald}>↑ 34% YoY</Chip>
          </div>
          <BarChart data={REACH_DATA} labels={MONTHS} color={T.violet} height={140} />
        </GlassCard>
        <GlassCard delay={250}>
          <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Campaign Health</div>
          {CAMPAIGNS.map((c, i) => (
            <div key={c.id} style={{ marginBottom: 18 }} className="fade-up" style={{ animationDelay: `${300 + i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Avatar src={c.influencerAvatar} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                </div>
                <StatusPill status={c.status} />
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 5, overflow: "hidden" }}>
                <div style={{ width: `${c.progress}%`, height: "100%", background: c.status === "completed" ? `linear-gradient(90deg,${T.emerald},#34D399)` : `linear-gradient(90deg,${T.violet},${T.violetLight})`, borderRadius: 99, transition: "width 1s cubic-bezier(.22,1,.36,1)", transitionDelay: `${i * 100}ms` }} />
              </div>
            </div>
          ))}
        </GlassCard>
      </div>

      {/* Top Influencers Row */}
      <GlassCard delay={350}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 18 }}>Top Performing Influencers</div>
          <Btn variant="ghost" sm>View All →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 14 }}>
          {INFLUENCERS.map((inf, i) => (
            <div key={inf.id} className="fade-up" style={{ textAlign: "center", animationDelay: `${400 + i * 50}ms` }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
                <Avatar src={inf.avatar} size={52} ring={inf.color} />
                {inf.verified && <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, background: T.violet, borderRadius: "50%", border: "2px solid #050507", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff" }}>✓</div>}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{inf.name.split(" ")[0]}</div>
              <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 4 }}>{inf.followers}</div>
              <Chip color={T.emerald}>{inf.trend}</Chip>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

// ── DISCOVER ──────────────────────────────────────────────────
const Discover = () => {
  const [q, setQ] = useState(""), [niche, setNiche] = useState("All"), [platform, setPlatform] = useState("All"), [sort, setSort] = useState("followers");
  const [selected, setSelected] = useState(null), [loading, setLoading] = useState(false);

  const niches = ["All","Fashion & Lifestyle","Fitness & Health","Food & Travel","Tech & Gaming","Beauty & Skincare","Travel & Adventure"];
  const platforms = ["All","Instagram","YouTube","TikTok"];

  const filtered = INFLUENCERS.filter(i =>
    (i.name.toLowerCase().includes(q.toLowerCase()) || i.handle.toLowerCase().includes(q.toLowerCase())) &&
    (niche === "All" || i.niche === niche) && (platform === "All" || i.platform === platform)
  );

  const inp = s => ({ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", padding: "10px 14px", fontSize: 14, outline: "none", ...s });

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 32, marginBottom: 6, background: "linear-gradient(135deg,#fff 40%,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Discover Creators</h1>
        <p style={{ color: T.textMuted, fontSize: 15 }}>{filtered.length} influencers match your criteria</p>
      </div>

      {/* Search bar */}
      <GlassCard style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textFaint, fontSize: 14 }}>⌕</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or handle..." style={{ ...inp({ width: "100%", paddingLeft: 32 }) }} />
          </div>
          <select value={niche} onChange={e => setNiche(e.target.value)} style={inp({})}>
            {niches.map(n => <option key={n} style={{ background: "#1a1a2e" }}>{n}</option>)}
          </select>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={inp({})}>
            {platforms.map(p => <option key={p} style={{ background: "#1a1a2e" }}>{p}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={inp({})}>
            <option value="followers" style={{ background: "#1a1a2e" }}>↓ Followers</option>
            <option value="engagement" style={{ background: "#1a1a2e" }}>↓ Engagement</option>
            <option value="rating" style={{ background: "#1a1a2e" }}>↓ Rating</option>
          </select>
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
        {filtered.map((inf, i) => <InfluCard key={inf.id} inf={inf} onSelect={setSelected} delay={i * 60} />)}
      </div>

      {selected && <InfluModal inf={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

const InfluCard = ({ inf, onSelect, delay }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="fade-up hover-lift" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: hov ? `1px solid ${inf.color}55` : "1px solid rgba(255,255,255,0.08)", transition: "all 0.25s cubic-bezier(.22,1,.36,1)", animationDelay: `${delay}ms`, cursor: "pointer" }}
      onClick={() => onSelect(inf)}>
      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <img src={inf.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s cubic-bezier(.22,1,.36,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,7,0.9) 0%, rgba(5,5,7,0.2) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <Chip color={inf.platform === "Instagram" ? "#EC4899" : "#FF0000"}>{inf.platform}</Chip>
        </div>
        {inf.verified && (
          <div style={{ position: "absolute", top: 12, left: 12, background: T.violet, color: "#fff", borderRadius: 8, fontSize: 11, padding: "3px 9px", fontWeight: 700 }}>✓ Verified</div>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={inf.avatar} size={44} ring={inf.color} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{inf.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{inf.handle}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {inf.tags.map(t => <span key={t} style={{ background: "rgba(255,255,255,0.06)", color: T.textMuted, fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>#{t}</span>)}
          <span style={{ marginLeft: "auto" }}><Chip color={T.emerald}>{inf.trend}</Chip></span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[["Followers", inf.followers, T.violetLight], ["Engagement", inf.engagement, T.emerald], ["Avg Views", inf.avgViews, T.sky]].map(([l, v, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 10, color: T.textFaint, marginBottom: 4, letterSpacing: 0.3 }}>{l.toUpperCase()}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: T.textFaint }}>Fee per post</div>
            <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 18, color: "#fff" }}>{inf.fee}</div>
          </div>
          <Btn sm onClick={e => { e.stopPropagation(); }}>+ Invite</Btn>
        </div>
      </div>
    </div>
  );
};

const InfluModal = ({ inf, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,7,0.8)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(12px)", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
    <div className="glass-strong" onClick={e => e.stopPropagation()} style={{ borderRadius: 24, width: "100%", maxWidth: 580, overflow: "hidden", maxHeight: "90vh", overflowY: "auto", animation: "fadeUp 0.3s cubic-bezier(.22,1,.36,1)" }}>
      <div style={{ position: "relative", height: 220 }}>
        <img src={inf.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,7,0.95) 0%, transparent 50%)" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        <div style={{ position: "absolute", bottom: 20, left: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar src={inf.avatar} size={64} ring={inf.color} />
          <div>
            <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>{inf.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{inf.handle} · {inf.location}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <Chip color={T.violet}>{inf.niche}</Chip>
          <Chip color={inf.platform === "Instagram" ? "#EC4899" : "#FF0000"}>{inf.platform}</Chip>
          {inf.verified && <Chip color={T.emerald}>✓ Verified</Chip>}
          <span style={{ marginLeft: "auto", fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 22, color: T.violetLight }}>{inf.fee}<span style={{ fontSize: 13, color: T.textFaint, fontWeight: 400 }}>/post</span></span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[["Followers", inf.followers, T.violetLight], ["Engagement", inf.engagement, T.emerald], ["Avg Views", inf.avgViews, T.sky]].map(([l, v, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 6, letterSpacing: 0.5 }}>{l.toUpperCase()}</div>
              <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 22, color: c }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 20, padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          ★ {inf.rating} rating · {inf.location} · Trending {inf.trend} this month
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn style={{ flex: 1, justifyContent: "center" }}>Send Collaboration Request</Btn>
          <Btn variant="ghost" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  </div>
);

// ── CONTENT AI ────────────────────────────────────────────────
const ContentAI = () => {
  const [tab, setTab] = useState("hooks"), [generating, setGenerating] = useState(false), [ready, setReady] = useState(true);
  const [editIdx, setEditIdx] = useState(null), [editVal, setEditVal] = useState("");
  const IDEAS = {
    hooks: ["\"Wait — this changed my entire routine\"","\"I tested this for 30 days. Here's the truth.\"","\"POV: You finally found the product you've been looking for\"","\"Stop scrolling — this is actually worth your time\"","\"No one talks about this, but it's a total game changer\""],
    captions: ["Glowing from the inside out ✨ This summer, I made a promise to my skin — and LumiSkin helped me keep it. Three weeks in and the difference is honestly wild. Link in bio for the full routine + an exclusive discount 🌞 #SkinFirst #SummerGlow","Real talk: I've tried everything. Serums, masks, expensive treatments — nothing clicked until this. My skin has never felt this hydrated going into summer. Drop a 🙋 if you want the details!","Some things just speak for themselves. 60 seconds in the morning. That's all it takes. Tag someone who needs to see this 👇"],
    hashtags: ["#SummerGlow #SkincareTok #GlowUp #LumiSkin #SkincareRoutine","#BeautyTips #HydrationStation #NaturalGlow #CleanBeauty #SkinFirst","#MorningRoutine #HealthySkin #GlowingSkin #BeautySecrets #SelfCare"],
    ctas: ["🔗 Link in bio — use GLOW20 for 20% off your first order!","💬 Drop your skin type below and I'll tell you which formula is for you!","📲 Save this post and check back after 2 weeks to tell me your results!","👆 Click the link and shop the exact routine I use every morning."],
  };
  const TABS = [["hooks","🪝","Hook Ideas"],["captions","✍️","Captions"],["hashtags","#","Hashtags"],["ctas","▶","CTAs"],["calendar","📅","Calendar"]];
  const CAL = [
    { day:"Mon", date:7, post:"Reel: Morning Routine", platform:"Instagram", status:"scheduled" },
    { day:"Tue", date:8, post:"Story: BTS Shoot", platform:"Instagram", status:"draft" },
    { day:"Wed", date:9, post:null },
    { day:"Thu", date:10, post:"Video: 30-Day Review", platform:"YouTube", status:"scheduled" },
    { day:"Fri", date:11, post:"Post: Before & After", platform:"Instagram", status:"draft" },
    { day:"Sat", date:12, post:"Story: Poll", platform:"Instagram", status:"idea" },
    { day:"Sun", date:13, post:null },
  ];
  const gen = () => { setGenerating(true); setReady(false); setTimeout(() => { setGenerating(false); setReady(true); }, 1800); };
  const inp = s => ({ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", padding: "10px 14px", fontSize: 14, outline: "none", ...s });

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 32, background: "linear-gradient(135deg,#fff 40%,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Content AI Studio</h1>
        <p style={{ color: T.textMuted, fontSize: 15, marginTop: 6 }}>Generate scroll-stopping content ideas in seconds.</p>
      </div>
      <GlassCard style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          {[["CAMPAIGN","Summer Glow Collection"],["BRAND","LumiSkin"],["TONE","Aspirational & Relatable"]].map(([l, v]) => (
            <div key={l} style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textFaint, marginBottom: 8, letterSpacing: 1 }}>{l}</div>
              <input defaultValue={v} style={inp({ width: "100%" })} />
            </div>
          ))}
          <Btn onClick={gen} style={{ height: 42, whiteSpace: "nowrap", background: generating ? "rgba(139,92,246,0.3)" : undefined }}>
            {generating ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}>◌</span> Generating…</> : "✦ Generate Content"}
          </Btn>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(255,255,255,0.04)", padding: 5, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
        {TABS.map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "8px 18px", borderRadius: 12, border: "none", background: tab === id ? "linear-gradient(135deg,#8B5CF6,#6D28D9)" : "transparent", color: tab === id ? "#fff" : T.textFaint, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 7 }}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </div>

      {generating && <Loader />}

      {!generating && ready && tab !== "calendar" && (
        <div style={{ display: "grid", gridTemplateColumns: tab === "hashtags" ? "repeat(3,minmax(0,1fr))" : "repeat(2,minmax(0,1fr))", gap: 16 }}>
          {(IDEAS[tab] || []).map((item, i) => (
            <GlassCard key={i} delay={i * 60}>
              {editIdx === i ? (
                <div>
                  <textarea value={editVal} onChange={e => setEditVal(e.target.value)} style={{ ...inp({ width: "100%", minHeight: 90, resize: "vertical", fontFamily: "'Satoshi',sans-serif" }) }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <Btn sm onClick={() => setEditIdx(null)}>Save</Btn>
                    <Btn sm variant="ghost" onClick={() => setEditIdx(null)}>Cancel</Btn>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: T.textMuted, marginBottom: 16 }}>{item}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn sm variant="ghost" onClick={() => { setEditIdx(i); setEditVal(item); }}>✎ Edit</Btn>
                    <Btn sm variant="ghost">⎘ Copy</Btn>
                    <Btn sm variant="ghost">♡ Save</Btn>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {!generating && ready && tab === "calendar" && (
        <GlassCard>
          <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Week of July 7 – 13, 2025</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 10 }}>
            {CAL.map(d => (
              <div key={d.day} style={{ background: d.post ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)", borderRadius: 14, padding: "12px 10px", border: d.post ? "1px solid rgba(139,92,246,0.25)" : "1px dashed rgba(255,255,255,0.08)", minHeight: 130 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: T.textFaint, marginBottom: 2 }}>{d.day}</div>
                <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 18, marginBottom: 10 }}>{d.date}</div>
                {d.post ? (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8, lineHeight: 1.4 }}>{d.post}</div>
                    <Chip color={d.platform === "Instagram" ? "#EC4899" : "#FF0000"}>{d.platform}</Chip>
                    <div style={{ marginTop: 6 }}><Chip color={d.status === "scheduled" ? T.emerald : d.status === "draft" ? T.amber : T.textFaint}>{d.status}</Chip></div>
                  </div>
                ) : <div style={{ fontSize: 22, color: "rgba(255,255,255,0.1)", marginTop: 16, textAlign: "center" }}>+</div>}
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

// ── CAMPAIGNS ─────────────────────────────────────────────────
const Campaigns = () => {
  const [sel, setSel] = useState(CAMPAIGNS[0]), [msg, setMsg] = useState(""), [msgs, setMsgs] = useState(MSGS);
  const chatRef = useRef(null);
  const send = () => {
    if (!msg.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), sender: "You", avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=60&h=60&fit=crop&crop=face", text: msg, time: "Now", mine: true }]);
    setMsg("");
    setTimeout(() => chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" }), 80);
  };
  const inp = s => ({ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", padding: "10px 14px", fontSize: 14, outline: "none", ...s });

  return (
    <div>
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 32, background: "linear-gradient(135deg,#fff 40%,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Campaigns</h1>
          <p style={{ color: T.textMuted, fontSize: 15, marginTop: 6 }}>Manage and track every influencer campaign.</p>
        </div>
        <Btn>+ New Campaign</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
        {/* List */}
        <div>
          {CAMPAIGNS.map((c, i) => (
            <div key={c.id} onClick={() => setSel(c)} className="fade-up"
              style={{ background: sel?.id === c.id ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)", border: sel?.id === c.id ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 18px", marginBottom: 12, cursor: "pointer", transition: "all 0.2s", animationDelay: `${i * 60}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar src={c.influencerAvatar} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.textFaint }}>{c.brand}</div>
                </div>
                <StatusPill status={c.status} />
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 4, overflow: "hidden" }}>
                <div style={{ width: `${c.progress}%`, height: "100%", background: c.status === "completed" ? `linear-gradient(90deg,${T.emerald},#34D399)` : `linear-gradient(90deg,${T.violet},${T.violetLight})`, borderRadius: 99 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: T.textFaint }}>{c.influencer}</span>
                <span style={{ fontSize: 11, color: sel?.id === c.id ? T.violetLight : T.textFaint, fontWeight: 700 }}>{c.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {sel && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GlassCard>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <Avatar src={sel.influencerAvatar} size={52} ring={T.violet} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 20 }}>{sel.name}</div>
                  <div style={{ fontSize: 13, color: T.textFaint }}>with {sel.influencer} · Due {sel.deadline}</div>
                </div>
                <StatusPill status={sel.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                {[["Expected Reach", sel.expectedReach, T.violet], ["Actual Reach", sel.actualReach, T.emerald], ["Budget", `$${sel.spent.toLocaleString()}/$${sel.budget.toLocaleString()}`, T.amber]].map(([l, v, c]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 6 }}>{l.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 17, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ProgressArc value={sel.progress} size={52} color={sel.status === "completed" ? T.emerald : T.violet} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 22, fontFamily: "'Cabinet Grotesk',sans-serif" }}>{sel.progress}%</div>
                      <div style={{ fontSize: 12, color: T.textFaint }}>Campaign Progress</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: T.textFaint, marginBottom: 4 }}>Deliverables</div>
                    <Chip color={T.emerald}>{sel.submitted}/{sel.deliverables} submitted</Chip>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 6 }}>
                  <div style={{ width: `${(sel.spent / sel.budget) * 100}%`, height: "100%", background: `linear-gradient(90deg,${T.amber},#FCD34D)`, borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: T.textFaint }}>Budget spent</span>
                  <span style={{ fontSize: 11, color: T.amber, fontWeight: 600 }}>{Math.round((sel.spent / sel.budget) * 100)}%</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="ghost" sm>⬆ Upload Deliverable</Btn>
                {sel.status !== "completed" && <Btn variant="success" sm>✓ Mark Complete</Btn>}
              </div>
            </GlassCard>

            {/* Chat */}
            <GlassCard style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 15 }}>
                Messages · {sel.influencer}
              </div>
              <div ref={chatRef} style={{ height: 200, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {msgs.map(m => (
                  <div key={m.id} style={{ display: "flex", gap: 10, flexDirection: m.mine ? "row-reverse" : "row", animation: "fadeUp 0.25s ease" }}>
                    <Avatar src={m.avatar} size={30} />
                    <div style={{ maxWidth: "72%", background: m.mine ? "linear-gradient(135deg,#8B5CF6,#6D28D9)" : "rgba(255,255,255,0.07)", borderRadius: m.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", border: m.mine ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.5 }}>{m.text}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 10 }}>
                <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message…" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", padding: "9px 14px", fontSize: 13, outline: "none" }} />
                <Btn sm onClick={send}>Send ↑</Btn>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

// ── NOTIFICATIONS ─────────────────────────────────────────────
const Notifications = () => {
  const [notifs, setNotifs] = useState(NOTIFS), [filter, setFilter] = useState("all");
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const shown = filter === "unread" ? notifs.filter(n => !n.read) : notifs;

  return (
    <div>
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 32, background: "linear-gradient(135deg,#fff 40%,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Notifications</h1>
          <p style={{ color: T.textMuted, fontSize: 15, marginTop: 6 }}>{notifs.filter(n => !n.read).length} unread alerts</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
            {["all", "unread"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "9px 18px", border: "none", background: filter === f ? "rgba(139,92,246,0.3)" : "transparent", color: filter === f ? "#fff" : T.textFaint, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Btn variant="ghost" sm onClick={markAll}>Mark all read</Btn>
        </div>
      </div>

      <div style={{ maxWidth: 700 }}>
        {shown.map((n, i) => (
          <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))} className="fade-up hover-lift"
            style={{ display: "flex", gap: 16, padding: "18px 22px", background: n.read ? "rgba(255,255,255,0.02)" : "rgba(139,92,246,0.08)", borderRadius: 16, border: n.read ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${n.color}33`, marginBottom: 10, cursor: "pointer", animationDelay: `${i * 60}ms` }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: n.color + "22", border: `1px solid ${n.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: n.color, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{n.title}</span>
                <Chip color={n.color}>{n.type}</Chip>
                {!n.read && <span style={{ width: 7, height: 7, background: T.violet, borderRadius: "50%", display: "inline-block", boxShadow: `0 0 8px ${T.violet}` }} />}
              </div>
              <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>{n.message}</p>
              <div style={{ fontSize: 11, color: T.textFaint, marginTop: 6 }}>{n.time}</div>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, color: T.textFaint }}>
            <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.4 }}>◇</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>All caught up!</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── SETTINGS ──────────────────────────────────────────────────
const Settings = () => {
  const [tab, setTab] = useState("profile");
  const [dark, setDark] = useState(true), [email, setEmail] = useState(true), [push, setPush] = useState(true), [match, setMatch] = useState(true);
  const TABS = ["profile","subscription","payment","notifications","preferences"];
  const inp = s => ({ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", padding: "10px 14px", fontSize: 14, outline: "none", width: "100%", marginBottom: 16, ...s });

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 32, background: "linear-gradient(135deg,#fff 40%,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Settings</h1>
        <p style={{ color: T.textMuted, fontSize: 15, marginTop: 6 }}>Manage your account and preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map(t => (
            <div key={t} onClick={() => setTab(t)}
              style={{ padding: "11px 16px", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === t ? "rgba(139,92,246,0.15)" : "transparent", color: tab === t ? T.violetLight : T.textFaint, border: tab === t ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent", transition: "all 0.2s", textTransform: "capitalize" }}>
              {t}
            </div>
          ))}
        </div>

        <div>
          {tab === "profile" && (
            <GlassCard>
              <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Profile Settings</div>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <div style={{ position: "relative" }}>
                  <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=144&h=144&fit=crop&crop=face" style={{ width: 76, height: 76, borderRadius: "50%", border: `3px solid rgba(139,92,246,0.5)` }} alt="" />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, background: T.violet, borderRadius: "50%", border: "2px solid #050507", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>✎</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Aarav Mehta</div>
                  <Chip color={T.violet}>⬡ Pro Plan</Chip>
                </div>
              </div>
              {[["Full Name","Aarav Mehta"],["Email","aarav@influfind.com"],["Brand Name","LumiSkin Co."],["Website","lumiskin.com"]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textFaint, marginBottom: 8, letterSpacing: 1 }}>{l.toUpperCase()}</div>
                  <input defaultValue={v} style={inp({})} />
                </div>
              ))}
              <Btn style={{ marginTop: 4 }}>Save Changes</Btn>
            </GlassCard>
          )}

          {tab === "subscription" && (
            <div>
              <GlassCard style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Current Plan</div>
                <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.3),rgba(109,40,217,0.4))", borderRadius: 16, padding: "28px", border: "1px solid rgba(139,92,246,0.4)", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "rgba(139,92,246,0.15)", borderRadius: "50%" }} />
                  <div style={{ fontSize: 12, color: T.violetLight, marginBottom: 6, letterSpacing: 1 }}>CURRENT PLAN</div>
                  <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 34, fontWeight: 900 }}>Pro ⬡</div>
                  <div style={{ color: T.textMuted, marginTop: 6 }}>$49/month · Renews Jul 15, 2025</div>
                </div>
              </GlassCard>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 }}>
                {[{ name:"Starter", price:"$19", features:["50 searches/mo","3 campaigns","Basic AI"], current:false },{ name:"Pro", price:"$49", features:["Unlimited searches","10 campaigns","Full AI"], current:true },{ name:"Enterprise", price:"$149", features:["Everything unlimited","25 campaigns","Priority AI"], current:false }].map(p => (
                  <div key={p.name} style={{ background: p.current ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)", border: p.current ? "1.5px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px", position: "relative" }}>
                    {p.current && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#8B5CF6,#6D28D9)", color: "#fff", borderRadius: 99, fontSize: 11, padding: "3px 14px", fontWeight: 700, whiteSpace: "nowrap" }}>Current Plan</div>}
                    <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 20, marginBottom: 6 }}>{p.name}</div>
                    <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontSize: 28, fontWeight: 900, color: T.violetLight, marginBottom: 16 }}>{p.price}<span style={{ fontSize: 14, color: T.textFaint, fontWeight: 400 }}>/mo</span></div>
                    {p.features.map(f => <div key={f} style={{ fontSize: 13, color: T.textMuted, marginBottom: 7 }}>✓ {f}</div>)}
                    <Btn variant={p.current ? "ghost" : "primary"} sm style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>{p.current ? "Current" : "Upgrade"}</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "payment" && (
            <GlassCard>
              <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 22 }}>Payment Method</div>
              <div style={{ background: "linear-gradient(135deg,#1a1033,#0d0820)", borderRadius: 18, padding: "26px", border: "1px solid rgba(139,92,246,0.3)", maxWidth: 380, marginBottom: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 180, height: 180, background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: 1 }}>InfluFind</div>
                  <div style={{ fontSize: 24, color: T.violetLight }}>⬡</div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 4, marginBottom: 24, color: "rgba(255,255,255,0.8)" }}>•••• •••• •••• 4242</div>
                <div style={{ display: "flex", gap: 28, fontSize: 13 }}>
                  <div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>CARD HOLDER</div><div style={{ fontWeight: 600 }}>Aarav Mehta</div></div>
                  <div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>EXPIRES</div><div style={{ fontWeight: 600 }}>09/27</div></div>
                </div>
              </div>
              <Btn variant="ghost" sm>+ Add New Card</Btn>
              <div style={{ marginTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22 }}>
                <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Billing History</div>
                {[["Jun 15, 2025","Pro Plan","$49.00"],["May 15, 2025","Pro Plan","$49.00"],["Apr 15, 2025","Pro Plan","$49.00"]].map(([d, item, amt]) => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{item}</div>
                      <div style={{ fontSize: 12, color: T.textFaint, marginTop: 2 }}>{d}</div>
                    </div>
                    <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 16 }}>{amt}</div>
                    <Chip color={T.emerald}>paid</Chip>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {tab === "notifications" && (
            <GlassCard>
              <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 22 }}>Notification Preferences</div>
              {[["Email Notifications","Receive all updates via email",email,setEmail],["Push Notifications","Browser push alerts in real time",push,setPush],["Influencer Match Alerts","When a creator matches your criteria",match,setMatch],["Campaign Updates","Progress and milestone alerts",true,()=>{}],["Weekly Reports","Summary digest every Monday",true,()=>{}]].map(([l,d,v,s]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{l}</div>
                    <div style={{ fontSize: 12, color: T.textFaint, marginTop: 3 }}>{d}</div>
                  </div>
                  <Toggle value={v} onChange={s} />
                </div>
              ))}
            </GlassCard>
          )}

          {tab === "preferences" && (
            <GlassCard>
              <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 22 }}>Preferences</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Dark Mode</div>
                  <div style={{ fontSize: 12, color: T.textFaint, marginTop: 3 }}>Currently active — this app was built for the dark</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{dark ? "🌙" : "☀️"}</span>
                  <Toggle value={dark} onChange={setDark} />
                </div>
              </div>
              {[["DEFAULT CURRENCY","USD – US Dollar",["USD – US Dollar","INR – Indian Rupee","EUR – Euro"]],["TIME ZONE","IST – India Standard Time (UTC+5:30)",["IST – India Standard Time (UTC+5:30)","PST – Pacific Standard Time","EST – Eastern Standard Time"]]].map(([l,def,opts]) => (
                <div key={l} style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textFaint, marginBottom: 10, letterSpacing: 1 }}>{l}</div>
                  <select defaultValue={def} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", padding: "10px 14px", fontSize: 14, outline: "none", width: "100%" }}>
                    {opts.map(o => <option key={o} style={{ background: "#1a1a2e" }}>{o}</option>)}
                  </select>
                </div>
              ))}
              <Btn style={{ marginTop: 28 }}>Save Preferences</Btn>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

// ── APP ROOT ──────────────────────────────────────────────────
const PAGES = { dashboard: Dashboard, discover: Discover, content: ContentAI, campaigns: Campaigns, notifications: Notifications, settings: Settings };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [fading, setFading] = useState(false);
  const sideW = 230;

  const nav = useCallback((p) => {
    setFading(true);
    setTimeout(() => { setPage(p); setFading(false); }, 200);
  }, []);

  const Page = PAGES[page];

  return (
    <div style={{ minHeight: "100vh", background: "#050507" }}>
      <G />
      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: -200, left: sideW + 50, width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, right: 100, width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <Sidebar page={page} setPage={nav} />
      <main style={{ marginLeft: sideW, padding: "40px 44px", minHeight: "100vh", position: "relative", zIndex: 1, transition: "opacity 0.2s ease, transform 0.2s ease", opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)" }}>
        <div style={{ maxWidth: 1240 }}>
          <Page />
        </div>
      </main>
    </div>
  );
}