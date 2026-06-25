import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Menu, X, Check, Copy, Zap, Globe, Shield, BarChart3,
  MessageSquare, ArrowRight, Bell, Settings, LogOut, Key, Send,
  TrendingUp, TrendingDown, Eye, EyeOff, RefreshCw, Plus, Download,
  Phone, Activity, Hash, AlertCircle, ChevronDown,
} from "lucide-react";
import {
  ComposedChart, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Fonts / base ─────────────────────────────────────────────────────────────
const F = { display: "'Outfit', sans-serif", sans: "'Inter', sans-serif", mono: "'JetBrains Mono', 'Fira Code', monospace" };

// ─── Landing data ─────────────────────────────────────────────────────────────
const logos = [
  { src: "https://svgl.app/library/shopify.svg", alt: "Shopify", gradient: "linear-gradient(135deg,#96bf48,#5e8e3e)" },
  { src: "https://svgl.app/library/stripe.svg", alt: "Stripe", gradient: "linear-gradient(135deg,#635bff,#0a2540)" },
  { src: "https://svgl.app/library/github.svg", alt: "GitHub", gradient: "linear-gradient(135deg,#24292e,#586069)" },
  { src: "https://svgl.app/library/slack.svg", alt: "Slack", gradient: "linear-gradient(135deg,#e01e5a,#36c5f0)" },
  { src: "https://svgl.app/library/notion.svg", alt: "Notion", gradient: "linear-gradient(135deg,#000,#4d4d4d)" },
  { src: "https://svgl.app/library/linear.svg", alt: "Linear", gradient: "linear-gradient(135deg,#5e6ad2,#26235a)" },
  { src: "https://svgl.app/library/vercel.svg", alt: "Vercel", gradient: "linear-gradient(135deg,#000,#555)" },
  { src: "https://svgl.app/library/google_cloud.svg", alt: "Google Cloud", gradient: "linear-gradient(135deg,#4285f4,#34a853)" },
];

const landingFeatures = [
  { icon: Zap, title: "Sub-second delivery", desc: "Messages hit carrier networks in under 300 ms. Direct peering with Tier-1 operators, no middlemen." },
  { icon: Globe, title: "200+ countries", desc: "Global reach with local sender IDs. Route through the optimal carrier path per destination, automatically." },
  { icon: Shield, title: "99.99% uptime SLA", desc: "Financially-backed availability guarantee. Active-active multi-region architecture with automatic failover." },
  { icon: BarChart3, title: "Real-time analytics", desc: "Delivery receipts, latency percentiles, and conversion funnels — live, in the dashboard or via webhooks." },
  { icon: MessageSquare, title: "All message types", desc: "OTPs, transactional alerts, and bulk marketing from a single endpoint. MMS and WhatsApp included." },
  { icon: Shield, title: "Compliance built-in", desc: "GDPR, TCPA, and CTIA compliant by default. Opt-out handling, consent logs, and audit trails out of the box." },
];

const plans = [
  { name: "Starter", price: "$0", sub: "forever", msgs: "1,000 messages / mo", features: ["SMS & MMS", "1 phone number", "Standard delivery", "Basic dashboard", "Community support"], cta: "Get started", highlight: false },
  { name: "Growth", price: "$49", sub: "per month", msgs: "50,000 messages / mo", features: ["SMS, MMS & WhatsApp", "5 phone numbers", "Priority routing", "Advanced analytics", "Webhooks & callbacks", "Email support"], cta: "Start free trial", highlight: true },
  { name: "Enterprise", price: "Custom", sub: "contact us", msgs: "Unlimited", features: ["All channels", "Unlimited numbers", "Dedicated infrastructure", "Custom SLA", "SSO & RBAC", "Dedicated engineer"], cta: "Talk to sales", highlight: false },
];

const codeSnippet = `const { PulseClient } = require('@pulse/sms');

const client = new PulseClient({
  apiKey: process.env.PULSE_API_KEY,
});

// Send an OTP in 3 lines
const msg = await client.messages.send({
  to:   '+14155551234',
  from: '+18005550100',
  body: 'Your verification code is 847291',
});

// msg.status → 'delivered' in 294 ms`;

// ─── Dashboard data ───────────────────────────────────────────────────────────
const volumeData = [
  { day: "Mon", sent: 4820, delivered: 4711, failed: 109 },
  { day: "Tue", sent: 6340, delivered: 6201, failed: 139 },
  { day: "Wed", sent: 5910, delivered: 5840, failed: 70 },
  { day: "Thu", sent: 7220, delivered: 7090, failed: 130 },
  { day: "Fri", sent: 8450, delivered: 8301, failed: 149 },
  { day: "Sat", sent: 3210, delivered: 3180, failed: 30 },
  { day: "Sun", sent: 2890, delivered: 2860, failed: 30 },
];

const monthlyData = [
  { month: "Jan", messages: 142000, rate: 97.1 },
  { month: "Feb", messages: 168000, rate: 97.8 },
  { month: "Mar", messages: 195000, rate: 98.0 },
  { month: "Apr", messages: 212000, rate: 97.5 },
  { month: "May", messages: 248000, rate: 98.3 },
  { month: "Jun", messages: 281000, rate: 98.6 },
];

const messages = [
  { id: "msg_8f2k9", to: "+1 (555) 234-8812", body: "Your OTP is 847291. Valid for 10 minutes.", status: "delivered", ts: "2 min ago", cost: "$0.0074", type: "OTP" },
  { id: "msg_3x9p1", to: "+44 7700 900123", body: "Your order #4521 has shipped and is on its way!", status: "delivered", ts: "8 min ago", cost: "$0.0090", type: "Transactional" },
  { id: "msg_7q4r2", to: "+61 412 345 678", body: "Reminder: appointment tomorrow at 3pm.", status: "failed", ts: "14 min ago", cost: "$0.0000", type: "Transactional" },
  { id: "msg_1m6w3", to: "+1 (555) 987-6543", body: "Welcome to Pulse! Start sending today.", status: "pending", ts: "19 min ago", cost: "$0.0074", type: "Marketing" },
  { id: "msg_5h8n4", to: "+49 170 1234567", body: "Your verification code: 391847", status: "delivered", ts: "27 min ago", cost: "$0.0095", type: "OTP" },
  { id: "msg_9z2t5", to: "+1 (555) 112-3344", body: "Flash sale — 40% off ends midnight!", status: "delivered", ts: "33 min ago", cost: "$0.0074", type: "Marketing" },
  { id: "msg_2k7b8", to: "+33 6 12 34 56 78", body: "Your account password was changed.", status: "delivered", ts: "41 min ago", cost: "$0.0088", type: "Transactional" },
  { id: "msg_4p1r6", to: "+81 90-1234-5678", body: "New login from Chrome on macOS.", status: "failed", ts: "1 hr ago", cost: "$0.0000", type: "Transactional" },
];

const apiKeys = [
  { id: "key_live_sk_a8f2kXp9qR", name: "Production", env: "live", created: "Jan 12, 2025", lastUsed: "Just now", requests: "2.4M" },
  { id: "key_test_sk_c3x9pYm4tQ", name: "Development", env: "test", created: "Mar 4, 2025", lastUsed: "3 hrs ago", requests: "184K" },
  { id: "key_live_sk_b7q4rZn6wS", name: "Staging", env: "live", created: "Apr 20, 2025", lastUsed: "Yesterday", requests: "41K" },
];

const phoneNumbers = [
  { number: "+1 (800) 555-0100", country: "🇺🇸 United States", type: "Long code", capabilities: ["SMS", "MMS"], monthly: "$1.15", status: "active" },
  { number: "+44 800 555 0101", country: "🇬🇧 United Kingdom", type: "Long code", capabilities: ["SMS"], monthly: "$1.40", status: "active" },
  { number: "+49 800 000 0000", country: "🇩🇪 Germany", type: "Long code", capabilities: ["SMS"], monthly: "$1.60", status: "inactive" },
];

type DashTab = "overview" | "messages" | "analytics" | "apikeys" | "numbers" | "settings";
type AppView = "landing" | "dashboard";

// ─── Shared helpers ───────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    delivered: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60",
    failed: "bg-red-50 text-red-500 ring-1 ring-red-200/60",
    pending: "bg-amber-50 text-amber-600 ring-1 ring-amber-200/60",
    active: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60",
    inactive: "bg-slate-100 text-slate-400 ring-1 ring-slate-200/60",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${map[status] ?? "bg-slate-100 text-slate-500"}`} style={{ fontFamily: F.sans }}>
      {status}
    </span>
  );
}

function TypePill({ type }: { type: string }) {
  const map: Record<string, string> = {
    OTP: "bg-violet-50 text-violet-600",
    Transactional: "bg-blue-50 text-blue-600",
    Marketing: "bg-orange-50 text-orange-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${map[type] ?? "bg-slate-100 text-slate-500"}`} style={{ fontFamily: F.sans }}>
      {type}
    </span>
  );
}

const customTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl px-4 py-3 shadow-lg text-[12px]" style={{ fontFamily: F.sans }}>
      <p className="font-semibold text-[#0a1b33] mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-[#0a1b33]">{typeof p.value === "number" && p.value > 100 ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const doubled = [...logos, ...logos];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ maskImage: "linear-gradient(to right,transparent 0%,black 12%,black 88%,transparent 100%)", WebkitMaskImage: "linear-gradient(to right,transparent 0%,black 12%,black 88%,transparent 100%)" }}
    >
      <style>{`@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} .mq-t{display:flex;gap:10px;width:max-content;animation:mq 30s linear infinite} .mq-t:hover{animation-play-state:paused}`}</style>
      <div className="mq-t py-3">
        {doubled.map((logo, i) => (
          <div key={`${logo.alt}-${i}`} className="group relative h-20 w-36 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden cursor-pointer">
            <div className="absolute inset-0 opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out" style={{ background: logo.gradient }} />
            <img src={logo.src} alt={logo.alt} className="relative z-10 h-8 w-8 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock() {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(codeSnippet).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200/60 bg-[#0f1923] shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          {["#ff6057", "#ffc12e", "#27ca40"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
          <span className="ml-3 text-[11px] text-slate-500" style={{ fontFamily: F.mono }}>send_otp.js</span>
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors" style={{ fontFamily: F.sans }}>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-5 py-5 text-[12.5px] leading-[1.8] overflow-x-auto" style={{ fontFamily: F.mono, color: "#c9d1d9" }}>
        <code>{codeSnippet.split("\n").map((line, i) => {
          if (line.startsWith("//")) return <div key={i}><span style={{ color: "#6e7a8a" }}>{line}</span></div>;
          const parts = line.split(/('[\w\/@.-]+'|"[\w\/@.-]+"|\b(?:const|await|require|new)\b)/g);
          return <div key={i}>{parts.map((p, j) =>
            /^['"]/.test(p) ? <span key={j} style={{ color: "#85c088" }}>{p}</span>
              : /^(const|await|require|new)$/.test(p) ? <span key={j} style={{ color: "#7e9fc4" }}>{p}</span>
              : <span key={j}>{p}</span>
          )}</div>;
        })}</code>
      </pre>
    </div>
  );
}

// ─── Navbar (landing) ─────────────────────────────────────────────────────────
function Navbar({ onSignup, onDashboard }: { onSignup: () => void; onDashboard: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="w-full max-w-[1400px] mx-auto px-4 py-5 flex items-center justify-between relative" style={{ fontFamily: F.sans }}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#0a152d] flex items-center justify-center text-white text-xs font-bold select-none">✦</div>
        <span className="font-semibold text-[15px] text-[#0a1b33]" style={{ fontFamily: F.display }}>Pulse SMS</span>
      </div>
      <div className="hidden md:flex items-center gap-1">
        {["Developers", "Pricing", "Docs", "Blog"].map(l => (
          <button key={l} className="px-4 py-2 rounded-full text-[13px] font-medium text-slate-500 hover:text-[#0a1b33] hover:bg-slate-100/70 transition-all">{l}</button>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-2">
        <button onClick={onDashboard} className="px-4 py-2 rounded-full text-[13px] font-semibold text-slate-600 hover:text-[#0a1b33] transition-colors">Sign in</button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSignup} className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
          Get API key <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
      <button onClick={() => setOpen(o => !o)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500">
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 z-50 bg-white rounded-2xl border border-slate-200/60 shadow-xl p-4 flex flex-col gap-1">
            {["Developers", "Pricing", "Docs", "Blog"].map(l => <button key={l} className="px-4 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-50 text-left">{l}</button>)}
            <div className="border-t border-slate-100 mt-2 pt-2 flex flex-col gap-2">
              <button onClick={() => { setOpen(false); onDashboard(); }} className="px-4 py-2.5 rounded-xl text-[14px] font-semibold text-slate-600 hover:bg-slate-50 text-left">Sign in</button>
              <button onClick={() => { setOpen(false); onSignup(); }} className="px-4 py-2.5 rounded-xl text-[14px] font-semibold text-white text-center" style={{ backgroundColor: "#0a152d" }}>Get API key</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Signup modal ─────────────────────────────────────────────────────────────
function SignupModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState(""); const [name, setName] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ fontFamily: F.sans }}>
        <div className="h-1" style={{ background: "linear-gradient(90deg,#0a152d,#3b5bdb)" }} />
        <div className="p-8">
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"><X className="w-4 h-4" /></button>
          <div className="w-10 h-10 rounded-xl bg-[#0a152d] flex items-center justify-center text-white text-sm font-bold mb-5 select-none">✦</div>
          <h2 className="text-[22px] font-semibold text-[#0a1b33] mb-1" style={{ fontFamily: F.display }}>Get your API key</h2>
          <p className="text-[13px] text-slate-500 mb-6">Free tier includes 1,000 messages/mo. No credit card required.</p>
          <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); onClose(); onSuccess(); }}>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] text-[#0a1b33] placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] text-[#0a1b33] placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors" />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" className="mt-1 w-full py-2.5 rounded-xl text-[14px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
              Create free account
            </motion.button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-4">Already have an account?{" "}
            <button onClick={() => { onClose(); onSuccess(); }} className="text-[#0a1b33] font-semibold hover:underline">Sign in</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<DashTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [msgFilter, setMsgFilter] = useState("All");
  const [sendOpen, setSendOpen] = useState(false);

  function copyKey(id: string) { navigator.clipboard.writeText(id).catch(() => {}); setCopied(id); setTimeout(() => setCopied(null), 1500); }

  const navItems: { id: DashTab; label: string; icon: typeof Activity }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "apikeys", label: "API Keys", icon: Key },
    { id: "numbers", label: "Phone Numbers", icon: Phone },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredMsgs = msgFilter === "All" ? messages : messages.filter(m =>
    msgFilter === "OTP" || msgFilter === "Transactional" || msgFilter === "Marketing"
      ? m.type === msgFilter
      : m.status === msgFilter.toLowerCase()
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f9fafb", fontFamily: F.sans }}>

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[220px] flex flex-col bg-white border-r border-slate-200/60 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-[#0a152d] flex items-center justify-center text-white text-xs font-bold select-none">✦</div>
          <span className="font-semibold text-[15px] text-[#0a1b33]" style={{ fontFamily: F.display }}>Pulse SMS</span>
        </div>

        {/* Workspace pill */}
        <div className="px-3 py-3">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all group">
            <div className="w-6 h-6 rounded-lg bg-[#0a152d] flex items-center justify-center text-white text-[10px] font-bold shrink-0">A</div>
            <span className="text-[12px] font-semibold text-slate-600 flex-1 text-left truncate">Acme Corp</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${tab === item.id ? "bg-[#0a152d] text-white" : "text-slate-500 hover:bg-slate-50 hover:text-[#0a1b33]"}`}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl group hover:bg-slate-50 cursor-pointer transition-all">
            <div className="w-7 h-7 rounded-full bg-[#0a152d] flex items-center justify-center text-white text-[10px] font-bold shrink-0">AJ</div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#0a1b33] truncate">Alex Johnson</p>
              <p className="text-[11px] text-slate-400 truncate">Growth plan</p>
            </div>
            <button onClick={onSignOut} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-200">
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col md:ml-[220px] min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-5 sm:px-8 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.display }}>
                {navItems.find(n => n.id === tab)?.label}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">41,280 / 50,000 messages · resets Jul 1</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0a152d]" />
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSendOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
              <Send className="w-3.5 h-3.5" /> Send message
            </motion.button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">

              {/* KPI cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Messages sent", value: "41,280", delta: "+12.4%", up: true, icon: Send, sub: "this month" },
                  { label: "Delivery rate", value: "98.3%", delta: "+0.4 pp", up: true, icon: Check, sub: "vs 97.9% last mo." },
                  { label: "Avg. latency", value: "287 ms", delta: "−18 ms", up: true, icon: Zap, sub: "P50 end-to-end" },
                  { label: "Failed messages", value: "710", delta: "+3.2%", up: false, icon: AlertCircle, sub: "this month" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                      <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center">
                        <s.icon className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                    <p className="text-[28px] font-semibold text-[#0a1b33] leading-none mb-1.5" style={{ fontFamily: F.display }}>{s.value}</p>
                    <div className={`flex items-center gap-1 text-[11px] font-semibold ${s.up ? "text-emerald-500" : "text-red-400"}`}>
                      {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.delta} · <span className="text-slate-400 font-normal">{s.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Volume chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[13px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.display }}>Message volume</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Last 7 days</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {[{ label: "Sent", color: "#0a152d" }, { label: "Delivered", color: "#34d399" }, { label: "Failed", color: "#f87171" }].map(l => (
                      <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="w-2 h-2 rounded-sm" style={{ background: l.color }} />{l.label}
                      </span>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={volumeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradVolumeSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0a152d" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#0a152d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradVolumeDelivered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={customTooltip} />
                    <Area type="monotone" dataKey="sent" stroke="#0a152d" strokeWidth={2} fill="url(#gradVolumeSent)" name="Sent" />
                    <Area type="monotone" dataKey="delivered" stroke="#34d399" strokeWidth={2} fill="url(#gradVolumeDelivered)" name="Delivered" />
                    <Line type="monotone" dataKey="failed" stroke="#f87171" strokeWidth={2} dot={false} name="Failed" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Recent messages + usage split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <p className="text-[13px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.display }}>Recent messages</p>
                    <button onClick={() => setTab("messages")} className="text-[11px] font-semibold text-slate-400 hover:text-[#0a1b33] transition-colors flex items-center gap-1">
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {messages.slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[12px] font-semibold text-[#0a1b33]">{m.to}</span>
                            <TypePill type={m.type} />
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{m.body}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <StatusPill status={m.status} />
                          <span className="text-[11px] text-slate-400 hidden sm:block">{m.ts}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage card */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <p className="text-[13px] font-semibold text-[#0a1b33] mb-0.5" style={{ fontFamily: F.display }}>Monthly usage</p>
                    <p className="text-[11px] text-slate-400">Growth plan · resets Jul 1</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-slate-500 font-medium">41,280 sent</span>
                      <span className="text-slate-400">50,000 limit</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "82.6%" }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full" style={{ backgroundColor: "#0a152d" }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">82.6% used · 8,720 remaining</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "OTP", pct: 45, color: "#818cf8" },
                      { label: "Transactional", pct: 35, color: "#34d399" },
                      { label: "Marketing", pct: 20, color: "#fb923c" },
                    ].map(t => (
                      <div key={t.label}>
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-slate-500 font-medium">{t.label}</span>
                          <span className="text-slate-400">{t.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 0.8, delay: 0.5 }}
                            className="h-full rounded-full" style={{ backgroundColor: t.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-auto w-full py-2.5 rounded-xl border border-slate-200/60 text-[12px] font-semibold text-[#0a1b33] hover:bg-slate-50 transition-all">
                    Upgrade plan
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Messages ── */}
          {tab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["All", "Delivered", "Failed", "Pending", "OTP", "Transactional", "Marketing"].map(f => (
                    <button key={f} onClick={() => setMsgFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${msgFilter === f ? "bg-[#0a152d] text-white" : "bg-white border border-slate-200/60 text-slate-500 hover:border-slate-300"}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border border-slate-200/60 bg-white text-slate-500 hover:border-slate-300 transition-all">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["ID", "To", "Body", "Type", "Status", "Time", "Cost"].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredMsgs.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-5 py-3.5"><span className="text-[11px] text-slate-400" style={{ fontFamily: F.mono }}>{m.id}</span></td>
                          <td className="px-5 py-3.5 text-[12px] font-semibold text-[#0a1b33] whitespace-nowrap">{m.to}</td>
                          <td className="px-5 py-3.5 max-w-[220px]"><p className="text-[12px] text-slate-500 truncate">{m.body}</p></td>
                          <td className="px-5 py-3.5"><TypePill type={m.type} /></td>
                          <td className="px-5 py-3.5"><StatusPill status={m.status} /></td>
                          <td className="px-5 py-3.5 text-[12px] text-slate-400 whitespace-nowrap">{m.ts}</td>
                          <td className="px-5 py-3.5 text-[12px] text-[#0a1b33] font-medium whitespace-nowrap" style={{ fontFamily: F.mono }}>{m.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">{filteredMsgs.length} messages</p>
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200/60 text-[11px] font-semibold text-slate-400 hover:border-slate-300 transition-all">← Prev</button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200/60 text-[11px] font-semibold text-slate-400 hover:border-slate-300 transition-all">Next →</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Analytics ── */}
          {tab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                  <p className="text-[13px] font-semibold text-[#0a1b33] mb-0.5" style={{ fontFamily: F.display }}>Monthly volume</p>
                  <p className="text-[11px] text-slate-400 mb-6">Messages sent Jan–Jun 2025</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip content={customTooltip} />
                      <Bar dataKey="messages" fill="#0a152d" radius={[6, 6, 0, 0]} name="Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                  <p className="text-[13px] font-semibold text-[#0a1b33] mb-0.5" style={{ fontFamily: F.display }}>Delivery rate trend</p>
                  <p className="text-[11px] text-slate-400 mb-6">% delivered vs sent</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[96, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip content={customTooltip} />
                      <Line type="monotone" dataKey="rate" stroke="#34d399" strokeWidth={2.5} dot={{ fill: "#34d399", strokeWidth: 0, r: 4 }} name="Rate %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <p className="text-[13px] font-semibold text-[#0a1b33] mb-5" style={{ fontFamily: F.display }}>Delivery breakdown · this week</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Delivered", n: "38,183", pct: "92.5%", color: "#34d399", bg: "#f0fdf4" },
                    { label: "Pending", n: "1,897", pct: "4.6%", color: "#fb923c", bg: "#fff7ed" },
                    { label: "Failed", n: "1,200", pct: "2.9%", color: "#f87171", bg: "#fef2f2" },
                  ].map(d => (
                    <div key={d.label} className="rounded-2xl p-6 text-center" style={{ backgroundColor: d.bg }}>
                      <p className="text-[30px] font-semibold leading-none mb-1" style={{ color: d.color, fontFamily: F.display }}>{d.pct}</p>
                      <p className="text-[15px] font-semibold text-[#0a1b33] mb-0.5">{d.n}</p>
                      <p className="text-[11px] text-slate-400">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Top destination", value: "United States", sub: "38% of traffic" },
                  { label: "Peak hour", value: "10:00–11:00 AM", sub: "UTC · weekdays" },
                  { label: "Avg. message length", value: "62 chars", sub: "1.04 segments avg." },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{s.label}</p>
                    <p className="text-[20px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.display }}>{s.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── API Keys ── */}
          {tab === "apikeys" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-slate-500">Manage credentials for your integrations.</p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
                  <Plus className="w-3.5 h-3.5" /> New API key
                </motion.button>
              </div>
              <div className="space-y-3">
                {apiKeys.map(key => (
                  <div key={key.id} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[13px] font-semibold text-[#0a1b33]">{key.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${key.env === "live" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{key.env}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <code className="text-[12px] text-slate-600 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl" style={{ fontFamily: F.mono }}>
                            {revealedKey === key.id ? key.id : `${key.id.slice(0, 16)}${"•".repeat(12)}`}
                          </code>
                          <button onClick={() => setRevealedKey(revealedKey === key.id ? null : key.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                            {revealedKey === key.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => copyKey(key.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                            {copied === key.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-5 text-[11px] text-slate-400">
                          <span>Created {key.created}</span>
                          <span>Last used {key.lastUsed}</span>
                          <span>{key.requests} requests</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/60 text-[11px] font-semibold text-slate-500 hover:border-slate-300 transition-all">
                          <RefreshCw className="w-3 h-3" /> Rotate
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 text-[11px] font-semibold text-red-400 hover:border-red-300 hover:text-red-500 transition-all">
                          <X className="w-3 h-3" /> Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-5 flex items-start gap-3">
                <Shield className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  <span className="font-semibold text-[#0a1b33]">Keep your keys secret.</span> Never commit API keys to source control. Use environment variables or a secrets manager. Rotate any key that may have been exposed immediately.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Phone Numbers ── */}
          {tab === "numbers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-slate-500">Sender IDs and phone numbers on your account.</p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
                  <Plus className="w-3.5 h-3.5" /> Buy number
                </motion.button>
              </div>
              <div className="space-y-3">
                {phoneNumbers.map(n => (
                  <div key={n.number} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.mono }}>{n.number}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-slate-400">{n.country}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-slate-400">{n.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          {n.capabilities.map(c => (
                            <span key={c} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500">{c}</span>
                          ))}
                        </div>
                        <span className="text-[12px] font-semibold text-slate-500" style={{ fontFamily: F.mono }}>{n.monthly}/mo</span>
                        <StatusPill status={n.status} />
                        <button className="text-[11px] font-semibold text-red-400 hover:text-red-500 transition-colors">Release</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Settings ── */}
          {tab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="max-w-[640px] space-y-5">
              {/* Profile */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <p className="text-[13px] font-semibold text-[#0a1b33] mb-5" style={{ fontFamily: F.display }}>Profile</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0a152d] flex items-center justify-center text-white font-bold select-none">AJ</div>
                  <div>
                    <button className="text-[12px] font-semibold text-[#0a1b33] hover:underline">Upload photo</button>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPG or PNG · max 2 MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[["Full name", "Alex Johnson"], ["Email", "alex@acmecorp.com"], ["Company", "Acme Corp"], ["Phone", "+1 (555) 000-0000"]].map(([l, v]) => (
                    <div key={l}>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">{l}</label>
                      <input defaultValue={v} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[13px] text-[#0a1b33] focus:outline-none focus:border-slate-400 transition-colors" />
                    </div>
                  ))}
                </div>
                <button className="mt-5 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>Save changes</button>
              </div>

              {/* Plan */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[13px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.display }}>Current plan</p>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0a152d] text-white">Growth</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] mb-2">
                    <span className="text-slate-500 font-medium">41,280 / 50,000 messages used</span>
                    <span className="text-slate-400">82.6%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full w-[82.6%]" style={{ backgroundColor: "#0a152d" }} />
                  </div>
                </div>
                <p className="text-[12px] text-slate-400 mb-4">$49 / month · renews Jul 1, 2025</p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>Upgrade to Enterprise</button>
                  <button className="px-4 py-2 rounded-xl border border-slate-200/60 text-[12px] font-semibold text-slate-500 hover:border-slate-300 transition-all">Manage billing</button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <p className="text-[13px] font-semibold text-[#0a1b33] mb-5" style={{ fontFamily: F.display }}>Notifications</p>
                <div className="space-y-4">
                  {[
                    { label: "Delivery failure spike", desc: "Alert when failure rate exceeds 5% in any hour", on: true },
                    { label: "Usage threshold", desc: "Alert at 80% and 95% of monthly limit", on: true },
                    { label: "New API key created", desc: "Email confirmation when a new key is generated", on: true },
                    { label: "Weekly digest", desc: "Usage and cost summary every Monday morning", on: false },
                  ].map(n => (
                    <div key={n.label} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[12px] font-semibold text-[#0a1b33]">{n.label}</p>
                        <p className="text-[11px] text-slate-400">{n.desc}</p>
                      </div>
                      <ToggleSwitch on={n.on} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <p className="text-[13px] font-semibold text-[#0a1b33] mb-1" style={{ fontFamily: F.display }}>Webhook endpoint</p>
                <p className="text-[11px] text-slate-400 mb-4">Receive delivery receipts and inbound messages via HTTP POST.</p>
                <div className="flex items-center gap-2">
                  <input defaultValue="https://acmecorp.com/api/pulse-webhook" className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[12px] text-[#0a1b33] focus:outline-none focus:border-slate-400 transition-colors" style={{ fontFamily: F.mono }} />
                  <button className="px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white shrink-0" style={{ backgroundColor: "#0a152d" }}>Save</button>
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Send message modal */}
      <AnimatePresence>
        {sendOpen && <SendModal onClose={() => setSendOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ToggleSwitch({ on: defaultOn }: { on: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(o => !o)} className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${on ? "bg-[#0a152d]" : "bg-slate-200"}`}>
      <motion.span animate={{ x: on ? 16 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm block" />
    </button>
  );
}

function SendModal({ onClose }: { onClose: () => void }) {
  const [to, setTo] = useState(""); const [body, setBody] = useState(""); const [from, setFrom] = useState("+1 (800) 555-0100");
  const remaining = 160 - body.length;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" style={{ fontFamily: F.sans }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0a152d] flex items-center justify-center shrink-0"><Send className="w-3.5 h-3.5 text-white" /></div>
            <p className="text-[14px] font-semibold text-[#0a1b33]" style={{ fontFamily: F.display }}>Send a message</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[13px] text-[#0a1b33] focus:outline-none appearance-none">
              {phoneNumbers.filter(n => n.status === "active").map(n => <option key={n.number} value={n.number}>{n.number}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">To</label>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="+14155551234" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[13px] text-[#0a1b33] placeholder:text-slate-300 focus:outline-none focus:border-slate-400 transition-colors" style={{ fontFamily: F.mono }} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Message</label>
              <span className={`text-[11px] font-medium ${remaining < 20 ? "text-red-400" : "text-slate-400"}`}>{remaining} chars</span>
            </div>
            <textarea value={body} onChange={e => setBody(e.target.value.slice(0, 160))} rows={4} placeholder="Your message here…" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[13px] text-[#0a1b33] placeholder:text-slate-300 focus:outline-none focus:border-slate-400 transition-colors resize-none" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose}
            className="w-full py-3 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2" style={{ backgroundColor: "#0a152d" }}>
            <Send className="w-3.5 h-3.5" /> Send message
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onSignup, onDashboard }: { onSignup: () => void; onDashboard: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div style={{ fontFamily: F.sans }}>
      <div className="relative px-4 pt-5">
        <Navbar onSignup={onSignup} onDashboard={onDashboard} />
      </div>
      <section className="px-4 pt-4 pb-0">
        <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            <video ref={videoRef} src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 transition-transform duration-1000" />
          </div>
          <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-start gap-5 max-w-[580px]">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/60 text-[11px] font-semibold text-slate-500 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />99.99% uptime · live status
              </div>
              <h1 className="text-[42px] md:text-[56px] font-medium leading-[1.08] tracking-tight" style={{ fontFamily: F.display, color: "#0a1b33" }}>
                SMS that reaches<br />anyone, instantly
              </h1>
              <p className="text-[14px] md:text-[15px] leading-relaxed max-w-[420px]" style={{ color: "#64748b" }}>
                One API for OTPs, transactional alerts, and marketing messages. Direct carrier connections to 200+ countries, built for developers.
              </p>
              <div className="flex items-center gap-3 mt-1">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onSignup} className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
                  Start for free <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <button className="px-6 py-2.5 rounded-full text-[13px] font-semibold text-[#0a1b33] bg-white/80 border border-slate-200/60 backdrop-blur-sm hover:border-slate-300 transition-all">View docs</button>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
            <motion.nav initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40 gap-1">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[13px] select-none">✦</div>
              <button className="px-4 py-2 rounded-full text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Developers</button>
              <button className="px-4 py-2 rounded-full text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Pricing</button>
              <button onClick={onSignup} className="flex items-center gap-1 bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all">
                Get API key <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </motion.nav>
          </div>
        </div>
      </section>

      <section className="px-4 mt-10">
        <div className="w-full max-w-[1400px] mx-auto">
          <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-5">Trusted by teams at</p>
          <Marquee />
        </div>
      </section>

      <section className="px-4 mt-16">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ v: "4.2B+", l: "Messages sent" }, { v: "294 ms", l: "Avg. delivery" }, { v: "99.99%", l: "Uptime SLA" }, { v: "200+", l: "Countries" }].map(s => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="p-6 rounded-3xl bg-white border border-slate-200/60 shadow-sm text-center">
              <p className="text-[32px] font-semibold text-[#0a1b33] leading-none mb-2" style={{ fontFamily: F.display }}>{s.v}</p>
              <p className="text-[12px] text-slate-400 font-medium">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 mt-16">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="mb-10">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Platform</p>
            <h2 className="text-[32px] md:text-[40px] font-medium text-[#0a1b33] tracking-tight max-w-[480px]" style={{ fontFamily: F.display }}>Everything you need to send at scale</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landingFeatures.map(f => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="group p-6 rounded-3xl bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-4 group-hover:bg-[#0a152d] group-hover:border-[#0a152d] transition-all">
                  <f.icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0a1b33] mb-1.5" style={{ fontFamily: F.display }}>{f.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 mt-16">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="rounded-[40px] bg-white border border-slate-200/60 shadow-sm overflow-hidden grid md:grid-cols-2 items-center">
            <div className="p-10 md:p-14 flex flex-col gap-6">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Developer-first</p>
                <h2 className="text-[30px] md:text-[36px] font-medium text-[#0a1b33] tracking-tight leading-tight" style={{ fontFamily: F.display }}>Integrate in<br />under 5 minutes</h2>
              </div>
              <p className="text-[14px] text-slate-500 leading-relaxed max-w-[340px]">SDKs for Node, Python, Ruby, Go, and PHP. REST API with predictable responses, versioned endpoints, and detailed error codes.</p>
              <ul className="flex flex-col gap-2.5">
                {["Idempotent requests", "Webhook delivery retries", "OpenAPI 3.1 spec", "Postman collection included"].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-slate-500" /></div>{item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 pt-1">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSignup} className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white" style={{ backgroundColor: "#0a152d" }}>
                  Get started free <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <button className="text-[13px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Read the docs →</button>
              </div>
            </div>
            <div className="p-6 md:p-10 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-200/60"><CodeBlock /></div>
          </div>
        </div>
      </section>

      <section className="px-4 mt-16">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="mb-10">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-[32px] md:text-[40px] font-medium text-[#0a1b33] tracking-tight" style={{ fontFamily: F.display }}>Pay for what you send</h2>
            <p className="text-[14px] text-slate-500 mt-2">No setup fees. No minimum commit. Scale up or down any time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map(p => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className={`relative p-7 rounded-3xl border flex flex-col gap-6 transition-all ${p.highlight ? "bg-[#0a152d] border-transparent shadow-[0_20px_60px_-10px_rgba(10,21,45,0.3)]" : "bg-white border-slate-200/60 shadow-sm hover:border-slate-300"}`}>
                {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-[#0a152d] bg-white shadow-sm">Most popular</div>}
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 mb-3">{p.name}</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className={`text-[38px] font-semibold leading-none ${p.highlight ? "text-white" : "text-[#0a1b33]"}`} style={{ fontFamily: F.display }}>{p.price}</span>
                    <span className="text-[13px] text-slate-400">/ {p.sub}</span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-400">{p.msgs}</p>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px]">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${p.highlight ? "bg-white/10" : "bg-slate-100"}`}>
                        <Check className={`w-2.5 h-2.5 ${p.highlight ? "text-white" : "text-slate-500"}`} />
                      </div>
                      <span className={p.highlight ? "text-slate-300" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onSignup}
                  className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all ${p.highlight ? "bg-white text-[#0a152d] hover:bg-slate-100" : "bg-[#0a152d] text-white hover:opacity-90"}`}>
                  {p.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[12px] text-slate-400 mt-6">All plans include sub-cent per-message pricing. <button className="text-[#0a1b33] font-semibold hover:underline">See full rate card →</button></p>
        </div>
      </section>

      <section className="px-4 mt-16 mb-16">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="rounded-[40px] bg-[#0a152d] px-10 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium text-white tracking-tight mb-3" style={{ fontFamily: F.display }}>Ready to start sending?</h2>
              <p className="text-[14px] text-slate-400 max-w-[380px]">Join 10,000+ developers using Pulse to deliver OTPs, alerts, and campaigns globally.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onSignup} className="flex items-center gap-2 px-7 py-3 rounded-full text-[14px] font-semibold text-[#0a152d] bg-white hover:bg-slate-100 transition-colors">
                Get started free <ArrowRight className="w-4 h-4" />
              </motion.button>
              <button className="flex items-center gap-2 px-7 py-3 rounded-full text-[14px] font-semibold text-white border border-white/20 hover:border-white/40 transition-colors">Talk to sales</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/60 px-4 py-10">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#0a152d] flex items-center justify-center text-white text-xs select-none">✦</div>
            <span className="font-semibold text-[14px] text-[#0a1b33]" style={{ fontFamily: F.display }}>Pulse SMS</span>
          </div>
          <div className="flex items-center gap-5 text-[12px] text-slate-400">
            {["Privacy", "Terms", "Status", "Docs", "Security"].map(l => <button key={l} className="hover:text-[#0a1b33] transition-colors">{l}</button>)}
          </div>
          <p className="text-[11px] text-slate-300">© 2025 Pulse SMS, Inc.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<AppView>("landing");
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <LandingPage onSignup={() => setSignupOpen(true)} onDashboard={() => setView("dashboard")} />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Dashboard onSignOut={() => setView("landing")} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {signupOpen && (
          <SignupModal
            open={signupOpen}
            onClose={() => setSignupOpen(false)}
            onSuccess={() => { setSignupOpen(false); setView("dashboard"); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
