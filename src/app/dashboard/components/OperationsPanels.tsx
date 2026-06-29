import { AlertCircle, ArrowRight, Check, Megaphone, ReceiptText, RefreshCw, ShieldCheck } from "lucide-react";
import type { Message, OTPChallenge } from "../../lib/api";
import type { Environment } from "../types";
import { NetworkTag, StatusPill, environmentCopy, timeAgo } from "../utils";

export function OTPPanel({
  environment,
  otps,
  onRefresh,
  onOpenPlayground,
  loading,
}: {
  environment: Environment;
  otps: OTPChallenge[];
  onRefresh: () => void;
  onOpenPlayground: () => void;
  loading: boolean;
}) {
  const total = otps.length;
  const verified = otps.filter((otp) => otp.status === "verified").length;
  const pending = otps.filter((otp) => otp.status === "pending").length;
  const failed = otps.filter((otp) => ["failed", "expired"].includes(otp.status)).length;
  const conversion = total ? Math.round((verified / total) * 100) : 0;
  const avgAttempts = total ? (otps.reduce((sum, otp) => sum + (otp.attempts || 0), 0) / total).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <FeatureHeader
        icon={ShieldCheck}
        eyebrow="OTP analytics"
        title="OTP request analytics and logs"
        description="Monitor every OTP challenge created through the API, including verification status, attempts, expiry, message linkage, and environment isolation."
        actionLabel="Open playground"
        onAction={onOpenPlayground}
        secondaryLabel="Refresh"
        onSecondary={onRefresh}
        secondaryLoading={loading}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Requests", value: String(total), detail: `${environmentCopy(environment).label} OTP challenges`, icon: ShieldCheck },
          { label: "Verified", value: String(verified), detail: "Completed challenges", icon: Check },
          { label: "Pending", value: String(pending), detail: "Awaiting user code", icon: RefreshCw },
          { label: "Failed", value: String(failed), detail: "Expired or max attempts", icon: AlertCircle },
          { label: "Verify rate", value: `${conversion}%`, detail: `${avgAttempts} avg attempts`, icon: ShieldCheck },
        ].map((metric) => (
          <div key={metric.label} className="rounded-[24px] border border-border bg-white/84 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-brand" />
            </div>
            <p className="mt-5 text-[32px] font-bold tracking-[-0.06em] text-foreground">{metric.value}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{metric.detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[28px] border border-border bg-white/84 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">OTP request log</h2>
            <p className="text-[14px] text-muted-foreground">{environmentCopy(environment).label} records are isolated from the other environment.</p>
          </div>
          <div className={`rounded-2xl border px-4 py-2 text-[13px] font-semibold ${environment === "sandbox" ? "border-warning/25 bg-warning-muted text-warning-emphasis" : "border-success/20 bg-success-muted text-success-emphasis"}`}>
            {environment === "sandbox" ? "Sandbox: real SMS through isolated sandbox gateways" : "Live: real SMS through production gateways"}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px]">
            <thead>
              <tr className="border-b border-border text-left text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Recipient</th>
                <th className="px-5 py-4 font-semibold">Brand</th>
                <th className="px-5 py-4 font-semibold">Purpose</th>
                <th className="px-5 py-4 font-semibold">Attempts</th>
                <th className="px-5 py-4 font-semibold">Message</th>
                <th className="px-5 py-4 font-semibold">Expires</th>
                <th className="px-5 py-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {otps.length ? otps.map((otp) => (
                <tr key={otp.id} className="border-b border-black/[0.06] transition hover:bg-surface">
                  <td className="px-5 py-4"><StatusPill status={otp.status} /></td>
                  <td className="px-5 py-4 font-mono text-[13px] text-foreground">{otp.to}</td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground">{otp.brand || "OpenSMS"}</td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground">{otp.purpose || "verification"}</td>
                  <td className="px-5 py-4 text-[13px] font-semibold text-foreground">{otp.attempts}/{otp.max_attempts}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-muted-foreground">{otp.message_id || "not routed"}</td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground">{timeAgo(otp.expires_at)}</td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground">{timeAgo(otp.created_at)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-5 py-20">
                    <EmptyState title="No OTP requests yet" description="Use the playground page to send and verify your first OTP flow." onAction={onOpenPlayground} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function TransactionalPanel({
  environment,
  messages,
  otps,
  onRefresh,
  onOpenPlayground,
  loading,
}: {
  environment: Environment;
  messages: Message[];
  otps: OTPChallenge[];
  onRefresh: () => void;
  onOpenPlayground: () => void;
  loading: boolean;
}) {
  const otpMessageIds = new Set(otps.map((otp) => otp.message_id).filter(Boolean));
  const transactional = messages.filter((message) =>
    message.direction === "outbound" &&
    !otpMessageIds.has(message.id) &&
    !message.request_id?.toLowerCase().startsWith("campaign-"),
  );
  const total = transactional.length;
  const delivered = transactional.filter((message) => message.status === "delivered").length;
  const inFlight = transactional.filter((message) => ["queued", "pending", "sent"].includes(message.status)).length;
  const failed = transactional.filter((message) => ["failed", "expired"].includes(message.status)).length;
  const deliveryRate = total ? Math.round((delivered / total) * 100) : 0;
  const uniqueRecipients = new Set(transactional.map((message) => message.to).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <FeatureHeader
        icon={ReceiptText}
        eyebrow="Transactional analytics"
        title="Transactional delivery analytics and logs"
        description="Track operational SMS traffic such as receipts, notices, and alerts. This view excludes OTP-linked messages and campaign traffic so the logs stay focused on transactional delivery quality."
        actionLabel="Open playground"
        onAction={onOpenPlayground}
        secondaryLabel="Refresh"
        onSecondary={onRefresh}
        secondaryLoading={loading}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Requests", value: String(total), detail: `${environmentCopy(environment).label} transactional messages`, icon: ReceiptText },
          { label: "Delivered", value: String(delivered), detail: "Confirmed handset delivery", icon: Check },
          { label: "In flight", value: String(inFlight), detail: "Queued, pending, or sent", icon: RefreshCw },
          { label: "Failed", value: String(failed), detail: "Failed or expired", icon: AlertCircle },
          { label: "Reach", value: `${deliveryRate}%`, detail: `${uniqueRecipients} unique recipients`, icon: ReceiptText },
        ].map((metric) => (
          <div key={metric.label} className="rounded-[24px] border border-border bg-white/84 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-brand" />
            </div>
            <p className="mt-5 text-[32px] font-bold tracking-[-0.06em] text-foreground">{metric.value}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{metric.detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[28px] border border-border bg-white/84 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Transactional message log</h2>
            <p className="text-[14px] text-muted-foreground">{environmentCopy(environment).label} transactional records are isolated from the other environment.</p>
          </div>
          <div className={`rounded-2xl border px-4 py-2 text-[13px] font-semibold ${environment === "sandbox" ? "border-warning/25 bg-warning-muted text-warning-emphasis" : "border-success/20 bg-success-muted text-success-emphasis"}`}>
            {environment === "sandbox" ? "Sandbox: real SMS through isolated sandbox gateways" : "Live: real SMS through production gateways"}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px]">
            <thead>
              <tr className="border-b border-border text-left text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Recipient</th>
                <th className="px-5 py-4 font-semibold">Sender</th>
                <th className="px-5 py-4 font-semibold">Network</th>
                <th className="px-5 py-4 font-semibold">Route</th>
                <th className="px-5 py-4 font-semibold">Request</th>
                <th className="px-5 py-4 font-semibold">Message</th>
                <th className="px-5 py-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {transactional.length ? transactional.map((message) => (
                <tr key={message.id} className="border-b border-black/[0.06] transition hover:bg-surface">
                  <td className="px-5 py-4"><StatusPill status={message.status} /></td>
                  <td className="px-5 py-4 font-mono text-[13px] text-foreground">{message.to}</td>
                  <td className="px-5 py-4 font-mono text-[13px] text-muted-foreground">{message.from || "gateway"}</td>
                  <td className="px-5 py-4"><NetworkTag network={message.network} /></td>
                  <td className="px-5 py-4 text-[13px] capitalize text-muted-foreground">{message.provider || "gateway"}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-muted-foreground">{message.request_id || message.id}</td>
                  <td className="max-w-[320px] px-5 py-4 text-[13px] text-muted-foreground"><p className="truncate">{message.content}</p></td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground">{timeAgo(message.created_at)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-5 py-20">
                    <EmptyState
                      title="No transactional messages yet"
                      description="Send a receipt, notice, or alert from the playground and it will appear here with delivery status."
                      onAction={onOpenPlayground}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function MarketingPanel({ environment, onOpenPlayground }: { environment: Environment; onOpenPlayground: () => void }) {
  return (
    <FeatureSummary
      icon={Megaphone}
      eyebrow="Campaign operations"
      title="Marketing workspace"
      description={`Keep campaign testing centralized in the playground while this page stays clean for the ${environmentCopy(environment).label} campaign workflow.`}
      bullets={[
        "Sandbox is the safest path for validating consent and payload shape.",
        "Live mode should be used only for opted-in recipients.",
        "A unified playground makes it easier to compare OTP, transactional, and marketing behavior side by side.",
      ]}
      actionLabel="Open playground"
      onAction={onOpenPlayground}
    />
  );
}

function FeatureHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  secondaryLoading,
}: {
  icon: typeof ShieldCheck;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
  secondaryLoading?: boolean;
}) {
  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-brand" />
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">{eyebrow}</p>
          </div>
          <h2 className="mt-3 text-[28px] font-bold tracking-[-0.06em] text-foreground">{title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={onSecondary} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-foreground transition hover:bg-surface">
            <RefreshCw className={`h-4 w-4 ${secondaryLoading ? "animate-spin" : ""}`} />
            {secondaryLabel}
          </button>
          <button onClick={onAction} className="inline-flex items-center gap-2 rounded-2xl bg-brand/90 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FeatureSummary({
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
  actionLabel,
  onAction,
}: {
  icon: typeof ShieldCheck;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <section className="max-w-4xl rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-brand" />
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">{eyebrow}</p>
          <h2 className="mt-1 text-[24px] font-bold tracking-[-0.05em] text-foreground">{title}</h2>
        </div>
      </div>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted-foreground">{description}</p>
      <div className="mt-5 grid gap-3">
        {bullets.map((bullet) => (
          <div key={bullet} className="rounded-2xl border border-border bg-surface px-4 py-3 text-[14px] text-label">
            {bullet}
          </div>
        ))}
      </div>
      <button onClick={onAction} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand/90 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}

function EmptyState({ title, description, onAction }: { title: string; description: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
        <ShieldCheck className="h-6 w-6 text-subtle-foreground" />
      </div>
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="text-[13px] text-muted-foreground">{description}</p>
      <button onClick={onAction} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-foreground transition hover:bg-surface">
        Open playground
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
