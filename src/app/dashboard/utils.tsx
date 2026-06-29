import type { ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  FlaskConical,
  Check,
  Inbox,
  Megaphone,
  MessageSquare,
  ReceiptText,
  RefreshCw,
  Settings,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { networkColor, type Message } from "../lib/api";
import type { FirebaseSession } from "../lib/firebaseAuth";
import type { DashTab, Environment, EnvironmentPage, GatewayMode } from "./types";

const demoVolume = [
  { day: "Mon", otp: 48, transactional: 22, marketing: 8, general: 14 },
  { day: "Tue", otp: 56, transactional: 28, marketing: 10, general: 18 },
  { day: "Wed", otp: 51, transactional: 24, marketing: 7, general: 12 },
  { day: "Thu", otp: 64, transactional: 32, marketing: 14, general: 16 },
  { day: "Fri", otp: 72, transactional: 38, marketing: 16, general: 20 },
  { day: "Sat", otp: 29, transactional: 12, marketing: 5, general: 8 },
  { day: "Sun", otp: 25, transactional: 11, marketing: 4, general: 6 },
];

export const environmentPages: EnvironmentPage[] = [
  { id: "sandbox", title: "Sandbox Console", label: "Sandbox", detail: "Real Android gateways with isolated sandbox data" },
  { id: "live", title: "Live Console", label: "Live", detail: "Real Android gateways and production data" },
];

export const dashboardNavGroups: { label: string; items: { id: DashTab; label: string; icon: typeof MessageSquare }[] }[] = [
  {
    label: "Monitor",
    items: [
      { id: "overview", label: "Overview", icon: Activity },
      { id: "messages", label: "Messages", icon: MessageSquare },
      { id: "inbound", label: "Inbound", icon: Inbox },
    ],
  },
  {
    label: "Send",
    items: [
      { id: "otp", label: "OTP", icon: ShieldCheck },
      { id: "transactional", label: "Transactional", icon: ReceiptText },
      { id: "marketing", label: "Marketing", icon: Megaphone },
    ],
  },
  {
    label: "Configure",
    items: [
      { id: "gateways", label: "Gateways", icon: Smartphone },
      { id: "settings", label: "Settings", icon: Settings },
      { id: "playground", label: "Playground", icon: FlaskConical },
    ],
  },
];

export const dashboardNavItems = dashboardNavGroups.flatMap((group) => group.items);

export function dashboardNavLabel(tab: DashTab): string {
  return dashboardNavItems.find((item) => item.id === tab)?.label ?? "Overview";
}

export function environmentCopy(environment: Environment) {
  return environmentPages.find((item) => item.id === environment) ?? environmentPages[0];
}

export function environmentDeliveryCopy(environment: Environment) {
  return environment === "sandbox"
    ? "Sandbox routes real SMS through sandbox-only gateways while keeping data isolated."
    : "Live mode sends real SMS messages through production gateways.";
}

export function gatewayModeLabel(mode?: GatewayMode | string) {
  return mode === "two_way" ? "Two-way" : "Send-only";
}

export function gatewayModeDetail(mode?: GatewayMode | string) {
  return mode === "two_way"
    ? "Forwards new inbound SMS replies to the OpenSMS inbox. Does not read inbox history."
    : "Sends outbound SMS only. Does not capture inbound replies.";
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    queued: "bg-blue-50 text-blue-700 ring-blue-200",
    pending: "bg-violet-50 text-violet-700 ring-violet-200",
    sent: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    received: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    failed: "bg-red-50 text-red-700 ring-red-200",
    expired: "bg-orange-50 text-orange-700 ring-orange-200",
    verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${styles[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
      {status || "unknown"}
    </span>
  );
}

export function NetworkTag({ network }: { network: string }) {
  const color = networkColor(network);
  return (
    <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase" style={{ color, backgroundColor: `${color}12`, border: `1px solid ${color}24` }}>
      {network || "Unknown"}
    </span>
  );
}

export function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function ResultBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
      <p className="text-[13px] font-semibold text-success-emphasis">{title}</p>
      <div className="mt-2 text-[13px] leading-6 text-label">{children}</div>
    </div>
  );
}

export function EnvironmentSlider({
  environment,
  onChange,
}: {
  environment: Environment;
  onChange: (environment: Environment) => void;
}) {
  return (
    <div className="rounded-[20px] border border-border bg-surface p-2">
      <div className="relative grid grid-cols-2 rounded-2xl bg-white p-1 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <span
          className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-xl bg-primary shadow-[0_10px_22px_rgba(5,8,20,0.18)] transition-transform duration-200 ${environment === "live" ? "translate-x-full" : "translate-x-0"}`}
        />
        {environmentPages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => onChange(page.id)}
            className={`relative z-10 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${environment === page.id ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            {page.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function accountLabel(session: FirebaseSession | null) {
  if (!session) return "";
  return session.displayName || session.email || "Signed in";
}

export function accountInitials(session: FirebaseSession | null) {
  const label = accountLabel(session);
  if (!label) return "OS";
  const parts = label.split(/[ @.]+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "OS";
}

export function AccountAvatar({ session, className = "h-8 w-8 text-[12px]" }: { session: FirebaseSession | null; className?: string }) {
  if (session?.photoURL) {
    return (
      <img
        src={session.photoURL}
        alt=""
        referrerPolicy="no-referrer"
        className={`${className} shrink-0 rounded-full object-cover ring-1 ring-black/10`}
      />
    );
  }

  return (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white shadow-[0_8px_20px_rgba(0,132,255,0.24)]`}>
      {accountInitials(session)}
    </span>
  );
}

export function timeAgo(iso: string) {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return "just now";
  const minutes = Math.floor(Math.max(0, Date.now() - time) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function buildVolume(messages: Message[]) {
  if (!messages.length) return demoVolume;
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return { date, day: labels[date.getDay()], otp: 0, transactional: 0, marketing: 0, general: 0 };
  });

  messages.forEach((message) => {
    if (message.direction === "inbound") return;
    const created = new Date(message.created_at);
    const bucket = buckets.find((item) => item.date.toDateString() === created.toDateString());
    if (!bucket) return;
    const type = message.message_type || "general";
    if (type === "otp" || type === "transactional" || type === "marketing") {
      bucket[type] += 1;
      return;
    }
    bucket.general += 1;
  });

  return buckets.map(({ day, otp, transactional, marketing, general }) => ({ day, otp, transactional, marketing, general }));
}

export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-white/95 px-4 py-3 text-[12px] shadow-sm backdrop-blur-xl">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((item: any) => (
        <p key={item.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
          {item.name}: <span className="font-semibold text-foreground">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export function MessageFlowChart({ volume }: { volume: ReturnType<typeof buildVolume> }) {
  return (
    <ResponsiveContainer width="100%" height={270}>
      <BarChart data={volume} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={6} barCategoryGap="24%">
        <CartesianGrid stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 12, fontSize: "12px", color: "var(--muted-foreground)" }} />
        <Bar dataKey="otp" name="OTP" stackId="requests" fill="var(--brand)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="transactional" name="Transactional" stackId="requests" fill="#7C3AED" />
        <Bar dataKey="marketing" name="Marketing" stackId="requests" fill="#F97316" />
        <Bar dataKey="general" name="General" stackId="requests" fill="var(--success)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const overviewMetrics = [
  { label: "Queued", key: "queued", icon: MessageSquare },
  { label: "Routed", key: "routed", icon: RefreshCw },
  { label: "Delivered", key: "delivered", icon: Check },
  { label: "Gateways", key: "gateways", icon: Smartphone },
] as const;

export const otpMetricIcons = {
  requests: ShieldCheck,
  verified: Check,
  pending: RefreshCw,
  failed: AlertCircle,
  conversion: BarChart3,
};
