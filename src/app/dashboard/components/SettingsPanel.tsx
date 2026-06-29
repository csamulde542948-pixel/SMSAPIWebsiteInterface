import { Check, Copy, Key, Server } from "lucide-react";
import { toast } from "sonner";
import { getApiKey, setApiKey, type ManagedApiKey } from "../../lib/api";
import type { DashboardDataActions, DashboardDataState } from "../types";
import { timeAgo } from "../utils";

export function SettingsPanel({
  state,
  actions,
}: {
  state: DashboardDataState;
  actions: DashboardDataActions;
}) {
  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <Key className="h-5 w-5 text-brand" />
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Access keys</h2>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-muted-foreground">Issue scoped API keys for your account, then optionally save one in this browser for local testing without Firebase sign-in.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input value={state.apiKeyName} onChange={(event) => actions.setApiKeyName(event.target.value)} placeholder="Production server" className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand" />
          <button
            onClick={() => void actions.createManagedApiKey()}
            disabled={!state.hasAccountSession}
            className={`rounded-2xl px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition ${
              state.hasAccountSession
                ? "bg-brand/90 hover:scale-[1.02]"
                : "cursor-not-allowed bg-subtle-foreground shadow-none"
            }`}
          >
            Create key
          </button>
        </div>
        {!state.hasAccountSession && (
          <p className="mt-3 text-[13px] text-muted-foreground">
            Account API keys require a signed-in Google account. The browser fallback key below is only for local testing.
          </p>
        )}
        {state.createdApiKey && (
          <div className="mt-4 rounded-2xl border border-success/20 bg-success/5 p-4">
            <p className="text-[13px] font-semibold text-success-emphasis">New key</p>
            <code className="mt-2 block break-all rounded-xl bg-white px-3 py-3 font-mono text-[12px] text-foreground">{state.createdApiKey}</code>
            <div className="mt-3 flex flex-wrap gap-3">
              <button onClick={() => navigator.clipboard.writeText(state.createdApiKey).catch(() => {})} className="rounded-2xl border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-foreground transition hover:bg-surface">Copy</button>
              <button onClick={() => { setApiKey(state.createdApiKey); void actions.loadData(); toast.success("API key saved locally"); }} className="rounded-2xl border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-foreground transition hover:bg-surface">Save locally</button>
            </div>
          </div>
        )}
        <div className="mt-5 space-y-3">
          {state.accountApiKeys.length ? state.accountApiKeys.map((apiKey) => (
            <ApiKeyRow key={apiKey.id} apiKey={apiKey} onRevoke={() => void actions.revokeManagedApiKey(apiKey.id)} />
          )) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-[14px] text-muted-foreground">
              No account API keys issued yet.
            </div>
          )}
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Browser fallback key</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input type="password" value={state.apiInput} onChange={(event) => actions.setApiInput(event.target.value)} placeholder={getApiKey() ? "Key saved locally" : "Paste x-api-key"} className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
            <button onClick={actions.saveBrowserKey} className="rounded-2xl bg-brand/90 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">Save</button>
            {getApiKey() && <button onClick={actions.clearBrowserKey} className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-[14px] font-semibold text-red-700 transition hover:bg-red-100">Clear</button>}
          </div>
        </div>
        {state.apiKeyStatus && <p className="mt-4 text-[13px] text-muted-foreground">{state.apiKeyStatus}</p>}
      </section>

      <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <Server className="h-5 w-5 text-brand" />
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Webhook endpoint</h2>
        </div>
        <p className="mt-3 text-[15px] leading-7 text-muted-foreground">Send delivery receipts and inbound events to this endpoint when using webhook integrations.</p>
        <div className="mt-5 flex items-center gap-3">
          <code className="min-w-0 flex-1 truncate rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[13px] text-muted-foreground">{window.location.origin}/webhooks/httpsms</code>
          <button onClick={actions.copyWebhook} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-muted-foreground transition hover:text-foreground">
            {state.copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <Server className="h-5 w-5 text-brand" />
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Gateway transparency</h2>
        </div>
        <div className="mt-4 space-y-3 text-[14px] leading-7 text-muted-foreground">
          <p><span className="font-semibold text-foreground">Standard build:</span> sends outbound SMS only. It does not request inbox read access and it does not capture inbound replies.</p>
          <p><span className="font-semibold text-foreground">Two-way upgrade build:</span> updates the same OpenSMS app installation, captures only newly received SMS replies, and forwards them to your OpenSMS inbox. It is intended for reply workflows and does not use `READ_SMS` for inbox history.</p>
        </div>
      </section>
    </div>
  );
}

function ApiKeyRow({ apiKey, onRevoke }: { apiKey: ManagedApiKey; onRevoke: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[15px] font-semibold text-foreground">{apiKey.name}</p>
        <p className="mt-1 font-mono text-[12px] text-muted-foreground">{apiKey.prefix}...</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Created {timeAgo(apiKey.created_at)}
          {apiKey.last_used_at ? ` • Last used ${timeAgo(apiKey.last_used_at)}` : " • Never used"}
          {apiKey.revoked_at ? " • Revoked" : ""}
        </p>
      </div>
      {!apiKey.revoked_at && (
        <button onClick={onRevoke} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-semibold text-red-700 transition hover:bg-red-100">Revoke</button>
      )}
    </div>
  );
}
