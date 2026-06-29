import type { ReactNode } from "react";
import { Check, Inbox, Key, QrCode, RefreshCw, Route, Search, Send, Smartphone } from "lucide-react";
import type { Gateway, Message } from "../../lib/api";
import type { DashboardDataActions, DashboardDataState, DashboardMetrics, Environment, GatewayMode } from "../types";
import { MessageFlowChart, NetworkTag, StatusPill, environmentCopy, environmentDeliveryCopy, gatewayModeDetail, gatewayModeLabel, timeAgo } from "../utils";

export function OverviewPanel({
  state,
  metrics,
  onOpenSettings,
}: {
  state: DashboardDataState;
  metrics: DashboardMetrics;
  onOpenSettings: () => void;
}) {
  return (
    <div className="space-y-6">
      {!state.hasApiKey && (
        <div className="flex flex-col gap-4 rounded-[24px] border border-brand/15 bg-white/82 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10">
              <Key className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-foreground">Connect your API key</p>
              <p className="text-[14px] text-muted-foreground">{environmentCopy(state.environment).label} gateways and messages appear after connection.</p>
            </div>
          </div>
          <button onClick={onOpenSettings} className="shrink-0 rounded-2xl bg-brand/90 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">
            Connect
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Queued", value: String(state.messages.length || 0), detail: "Tracked in this console", icon: Send },
          { label: "Routed", value: String(metrics.routeCount || 0), detail: "Moved to a gateway path", icon: Route },
          { label: "Delivered", value: String(metrics.deliveredCount || 0), detail: "Confirmed or received", icon: Check },
          { label: "Gateways", value: String(state.gateways.length || 0), detail: `${metrics.onlineGateways} online Android phones`, icon: Smartphone },
        ].map((metric) => (
          <div key={metric.label} className="rounded-[24px] border border-border bg-white/84 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-brand" />
            </div>
            <p className="mt-6 text-[38px] font-bold tracking-[-0.06em] text-foreground">{metric.value}</p>
            <p className="mt-1 text-[14px] text-muted-foreground">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">API request mix</h2>
              <p className="text-[14px] text-muted-foreground">Daily outbound requests split by OTP, transactional, marketing, and general sends.</p>
            </div>
          </div>
          <MessageFlowChart volume={metrics.volume} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Delivery rate</h2>
            <p className="mt-1 text-[14px] text-muted-foreground">Confirmed deliveries across all messages.</p>
            <div className="mt-5 flex items-center gap-5">
              <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r="38" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                  <circle cx="44" cy="44" r="38" fill="none" stroke="var(--success)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(metrics.deliveryRate / 100) * 238.76} 238.76`} />
                </svg>
                <span className="absolute text-[20px] font-bold text-foreground">{metrics.deliveryRate}%</span>
              </div>
              <div className="space-y-2">
                <MetricLine color="bg-success" label="Delivered" value={metrics.deliveredCount} />
                <MetricLine color="bg-[#EF4444]" label="Failed" value={metrics.failedCount} />
                <MetricLine color="bg-[#E2E8F0]" label="Total" value={state.messages.length} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
            <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Gateway health</h2>
            <p className="mt-1 text-[14px] text-muted-foreground">Registered Android phone readiness.</p>
            <div className="mt-5 space-y-3">
              {state.gateways.length ? state.gateways.slice(0, 3).map((gateway) => (
                <div key={gateway.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-foreground">{gateway.name || gateway.phone_number}</p>
                    <StatusPill status={gateway.status} />
                  </div>
                  <p className="mt-2 font-mono text-[13px] text-muted-foreground">{gateway.phone_number} &middot; {gateway.environment || "live"} &middot; {gateway.battery_percent || 0}% battery</p>
                </div>
              )) : (
                ["Register Android phone", "Install gateway app", "Start heartbeat"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
                    <span className="text-[15px] font-semibold text-foreground">{item}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GatewaysPanel({ state, actions, loading }: { state: DashboardDataState; actions: DashboardDataActions; loading: boolean }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <section className="rounded-[28px] border border-border bg-white/84 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Android gateways</h2>
            <p className="text-[14px] text-muted-foreground">{environmentDeliveryCopy(state.environment)}</p>
          </div>
          <button onClick={() => void actions.loadData()} className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-foreground transition hover:bg-surface">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="divide-y divide-black/[0.06]">
          {state.gateways.length ? state.gateways.map((gateway) => (
            <GatewayRow key={gateway.id} gateway={gateway} />
          )) : (
            <EmptyList icon={<Smartphone className="h-6 w-6 text-subtle-foreground" />} title="No gateways registered" description="Register an Android phone, install the gateway app, and paste the returned token into the app." />
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-brand" />
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Register phone</h2>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-muted-foreground">Create a {state.environment} gateway token for an Android phone. The token is shown once and should be stored inside the Android app.</p>
        <div className="mt-5 rounded-2xl border border-warning/20 bg-warning-muted p-4">
          <p className="text-[13px] font-semibold text-[#B54708]">Transparency</p>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            Send-only gateways use SMS send permissions only. Two-way gateways are for reply capture and require the signed OpenSMS two-way upgrade build, which declares inbound SMS access for new messages only, not inbox history.
          </p>
        </div>
        <div className="mt-5 space-y-3">
          <input value={state.gatewayName} onChange={(event) => actions.setGatewayName(event.target.value)} placeholder="Shop counter phone" className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand" />
          <input value={state.gatewayPhone} onChange={(event) => actions.setGatewayPhone(event.target.value)} placeholder="09171234567" className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
          <div className="rounded-2xl border border-border bg-surface p-2">
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "send_only", label: "Send-only", detail: "Outbound OTP, alerts, and campaigns." },
                { id: "two_way", label: "Two-way", detail: "Also forwards new inbound replies." },
              ] as Array<{ id: GatewayMode; label: string; detail: string }>).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => actions.setGatewayMode(option.id)}
                  className={`rounded-2xl px-4 py-3 text-left transition ${state.gatewayMode === option.id ? "bg-primary text-white shadow-[0_10px_22px_rgba(5,8,20,0.18)]" : "bg-white text-foreground hover:bg-[#EEF2FF]"}`}
                >
                  <p className="text-[14px] font-semibold">{option.label}</p>
                  <p className={`mt-1 text-[12px] leading-5 ${state.gatewayMode === option.id ? "text-white/76" : "text-muted-foreground"}`}>{option.detail}</p>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => void actions.registerGateway()} disabled={!state.gatewayPhone.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand/90 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
            <Smartphone className="h-4 w-4" />
            Register gateway
          </button>
        </div>
        {state.gatewayError && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{state.gatewayError}</div>}
        {state.gatewayPairing && <GatewayPairingCard pairing={state.gatewayPairing} />}
      </section>
    </div>
  );
}

export function MessagesPanel({
  envLabel,
  messages,
  search,
  onSearchChange,
  onOpenSend,
}: {
  envLabel: string;
  messages: Message[];
  search: string;
  onSearchChange: (value: string) => void;
  onOpenSend: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-white/84 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <PanelTableHeader title="Messages" description={`${envLabel} outbound messages and inbound records.`} search={search} searchPlaceholder="Search messages..." onSearchChange={onSearchChange} action={<button onClick={onOpenSend} className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand/90 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]"><Send className="h-4 w-4" />New</button>} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-border text-left text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Recipient</th>
              <th className="px-5 py-4 font-semibold">Network</th>
              <th className="px-5 py-4 font-semibold">Route</th>
              <th className="px-5 py-4 font-semibold">Message</th>
              <th className="px-5 py-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>{messageRows(messages)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function InboundPanel({
  environment,
  inbound,
  search,
  loading,
  onSearchChange,
  onRefresh,
}: {
  environment: Environment;
  inbound: Message[];
  search: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-white/84 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <PanelTableHeader title="Inbound" description={environment === "sandbox" ? "Sandbox inbound records stay isolated from live message history." : "Inbound SMS received from live gateway devices."} search={search} searchPlaceholder="Search inbound..." onSearchChange={onSearchChange} action={<button onClick={onRefresh} className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-foreground transition hover:bg-surface"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-border text-left text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Sender</th>
              <th className="px-5 py-4 font-semibold">Network</th>
              <th className="px-5 py-4 font-semibold">Route</th>
              <th className="px-5 py-4 font-semibold">Message</th>
              <th className="px-5 py-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>{messageRows(inbound, true)}</tbody>
        </table>
      </div>
    </div>
  );
}

function GatewayPairingCard({ pairing }: { pairing: { token: string; pairing_qr_data_uri?: string; pairing_uri?: string } }) {
  return (
    <div className="mt-5 rounded-2xl border border-success/20 bg-success/5 p-4">
      <div className="flex items-center gap-2 text-success-emphasis">
        <QrCode className="h-4 w-4" />
        <p className="text-[13px] font-semibold">Scan to connect</p>
      </div>
      {pairing.pairing_qr_data_uri && (
        <div className="mt-4 flex justify-center rounded-2xl bg-white p-4">
          <img src={pairing.pairing_qr_data_uri} alt="Gateway pairing QR code" className="h-56 w-56" />
        </div>
      )}
      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-success-emphasis">Fallback token</p>
      <code className="mt-2 block break-all rounded-xl bg-white px-3 py-3 font-mono text-[12px] text-foreground">{pairing.token}</code>
      {pairing.pairing_uri && (
        <>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-success-emphasis">Pairing URI</p>
          <code className="mt-2 block max-h-28 overflow-auto break-all rounded-xl bg-white px-3 py-3 font-mono text-[11px] text-muted-foreground">{pairing.pairing_uri}</code>
        </>
      )}
    </div>
  );
}

function GatewayRow({ gateway }: { gateway: Gateway }) {
  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold text-foreground">{gateway.name || gateway.phone_number}</p>
          <p className="font-mono text-[13px] text-muted-foreground">{gateway.phone_number} &middot; {gateway.environment || "live"} &middot; {gatewayModeLabel(gateway.mode)}</p>
          <p className="mt-1 text-[12px] text-subtle-foreground">{gatewayModeDetail(gateway.mode)}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-right sm:min-w-[280px]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-foreground">Status</p>
          <div className="mt-1 flex justify-end"><StatusPill status={gateway.status} /></div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-foreground">Battery</p>
          <p className="mt-1 text-[14px] font-semibold text-foreground">{gateway.battery_percent || 0}%</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-foreground">Seen</p>
          <p className="mt-1 text-[14px] font-semibold text-foreground">{gateway.last_seen_at ? timeAgo(gateway.last_seen_at) : "never"}</p>
        </div>
      </div>
    </div>
  );
}

function PanelTableHeader({
  title,
  description,
  search,
  searchPlaceholder,
  onSearchChange,
  action,
}: {
  title: string;
  description: string;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">{title}</h2>
        <p className="text-[14px] text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5">
          <Search className="h-4 w-4 text-subtle-foreground" />
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-subtle-foreground sm:w-[180px]" />
        </div>
        {action}
      </div>
    </div>
  );
}

function messageRows(list: Message[], inbound = false) {
  if (!list.length) {
    return (
      <tr>
        <td colSpan={7} className="px-5 py-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
              {inbound ? <Inbox className="h-6 w-6 text-subtle-foreground" /> : <Send className="h-6 w-6 text-subtle-foreground" />}
            </div>
            <p className="text-[15px] font-semibold text-foreground">{inbound ? "No inbound messages yet" : "No messages yet"}</p>
            <p className="text-[13px] text-muted-foreground">{inbound ? "Inbound messages will appear here once a gateway receives SMS." : "Send your first SMS to see it here."}</p>
          </div>
        </td>
      </tr>
    );
  }

  return list.map((message) => (
    <tr key={message.id} className="border-b border-black/[0.06] transition hover:bg-surface">
      <td className="px-5 py-4"><StatusPill status={message.status} /></td>
      <td className="px-5 py-4 font-mono text-[13px] text-foreground">{inbound ? message.from : message.to}</td>
      <td className="px-5 py-4"><NetworkTag network={message.network} /></td>
      <td className="px-5 py-4 text-[13px] capitalize text-muted-foreground">{message.provider || "gateway"}</td>
      <td className="max-w-[280px] px-5 py-4 text-[13px] text-muted-foreground"><p className="truncate">{message.content}</p></td>
      <td className="px-5 py-4 text-[13px] text-muted-foreground">{timeAgo(message.created_at)}</td>
    </tr>
  ));
}

function EmptyList({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">{icon}</div>
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-[13px] text-muted-foreground">{description}</p>
    </div>
  );
}

function MetricLine({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
