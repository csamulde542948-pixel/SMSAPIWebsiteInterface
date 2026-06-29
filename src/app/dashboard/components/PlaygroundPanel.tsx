import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, Check, Megaphone, ReceiptText, RefreshCw, Send, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { api, type MarketingResult, type Message, type OTPChallenge, type OTPSendResult, type OTPVerifyResult, type TransactionalTemplate } from "../../lib/api";
import type { Environment } from "../types";
import { FieldLabel, ResultBox, StatusPill, environmentCopy, timeAgo } from "../utils";

type PlaygroundPanelProps = {
  environment: Environment;
  otps: OTPChallenge[];
  templates: TransactionalTemplate[];
  onRefresh: () => void;
  onMessage: (message: Message) => void;
  onMessages: (messages: Message[]) => void;
  loading: boolean;
};

export function PlaygroundPanel({
  environment,
  otps,
  templates,
  onRefresh,
  onMessage,
  onMessages,
  loading,
}: PlaygroundPanelProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Send className="h-5 w-5 text-brand" />
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">Unified playground</p>
            </div>
            <h2 className="mt-3 text-[28px] font-bold tracking-[-0.06em] text-foreground">Test messaging flows in one place</h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 text-muted-foreground">
              Use the playground to send OTP, transactional, and marketing requests through the selected environment without cluttering the feature pages.
            </p>
          </div>
          <button onClick={onRefresh} className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-foreground transition hover:bg-surface">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className={`mt-5 rounded-2xl border px-4 py-3 text-[13px] leading-6 ${environment === "sandbox" ? "border-warning/20 bg-warning-muted text-warning-emphasis" : "border-success/20 bg-success-muted text-success-emphasis"}`}>
          {environment === "sandbox"
            ? "Sandbox keeps data isolated while still routing real SMS through sandbox gateways."
            : "Live routes real SMS through paired Android gateways and never returns live OTP codes."}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <OTPPlayground environment={environment} otps={otps} onRefresh={onRefresh} />
        <TransactionalPlayground environment={environment} templates={templates} onMessage={onMessage} />
      </div>

      <MarketingPlayground environment={environment} onMessages={onMessages} />
    </div>
  );
}

function OTPPlayground({ environment, otps, onRefresh }: { environment: Environment; otps: OTPChallenge[]; onRefresh: () => void }) {
  const recentPending = useMemo(() => otps.filter((otp) => otp.status === "pending").slice(0, 4), [otps]);
  const [to, setTo] = useState("");
  const [brand, setBrand] = useState("OpenSMS");
  const [purpose, setPurpose] = useState("login");
  const [ttl, setTtl] = useState("300");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendResult, setSendResult] = useState<OTPSendResult | null>(null);
  const [otpId, setOtpId] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyResult, setVerifyResult] = useState<OTPVerifyResult | null>(null);

  async function handleSend() {
    if (!to.trim() || sending) return;
    setSending(true);
    setSendError("");
    setVerifyError("");
    try {
      const response = await api.sendOtp({
        to,
        brand: brand.trim() || undefined,
        purpose: purpose.trim() || undefined,
        ttl_seconds: Number(ttl) > 0 ? Number(ttl) : undefined,
        environment,
      });
      if (response.status === "error") {
        setSendError(response.message);
        return;
      }
      setSendResult(response.data);
      setVerifyResult(null);
      setOtpId(response.data.otp.id);
      setCode("");
      onRefresh();
    } catch (event: any) {
      setSendError(event?.message || "Unable to send OTP.");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    if (!otpId.trim() || code.trim().length !== 6 || verifying) return;
    setVerifying(true);
    setVerifyError("");
    try {
      const response = await api.verifyOtp({ otp_id: otpId.trim(), code: code.trim(), environment });
      if (response.status === "error") {
        setVerifyError(response.message);
        return;
      }
      setVerifyResult(response.data);
      onRefresh();
    } catch (event: any) {
      setVerifyError(event?.message || "Unable to verify OTP.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-brand" />
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">OTP playground</h2>
          <p className="text-[14px] text-muted-foreground">Create a challenge and verify it from the same panel.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FieldLabel label="Recipient">
          <input value={to} onChange={(event) => setTo(event.target.value)} placeholder="09518023980" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
        <FieldLabel label="Brand">
          <input value={brand} onChange={(event) => setBrand(event.target.value.slice(0, 32))} placeholder="OpenSMS" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
        <FieldLabel label="Purpose">
          <input value={purpose} onChange={(event) => setPurpose(event.target.value.slice(0, 48))} placeholder="login" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
        <FieldLabel label="TTL (seconds)">
          <input value={ttl} onChange={(event) => setTtl(event.target.value.replace(/[^\d]/g, "").slice(0, 4))} placeholder="300" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
      </div>

      <button onClick={handleSend} disabled={!to.trim() || sending} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand/90 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
        {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Send OTP challenge
      </button>

      {sendResult && (
        <div className="mt-4">
          <ResultBox title="OTP challenge created">
            <p>OTP ID: <code className="font-mono">{sendResult.otp.id}</code></p>
            <p>Status: {sendResult.otp.status}</p>
            <p>Expires: {timeAgo(sendResult.expires_at)}</p>
            <p>Message: <code className="font-mono">{sendResult.message?.id || sendResult.otp.message_id || "not routed"}</code></p>
            <p>{environment === "sandbox" ? "Sandbox still sends a real SMS through sandbox gateways. Use the received code below to verify." : "Live sends a real SMS and never exposes the OTP code in the API response."}</p>
          </ResultBox>
        </div>
      )}
      {sendError && <ErrorBox>{sendError}</ErrorBox>}

      <div className="mt-6 space-y-4 border-t border-border pt-5">
        <FieldLabel label="OTP ID">
          <input value={otpId} onChange={(event) => setOtpId(event.target.value)} placeholder="otp_123" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
        </FieldLabel>

        <FieldLabel label="Code">
          <div className="mt-2 rounded-[20px] border border-border bg-surface p-4">
            <InputOTP maxLength={6} value={code} onChange={setCode} containerClassName="justify-between">
              <InputOTPGroup className="w-full justify-between">
                {Array.from({ length: 6 }, (_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-12 rounded-2xl border border-border bg-white text-[18px] font-semibold text-foreground first:rounded-2xl last:rounded-2xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </FieldLabel>

        {recentPending.length > 0 && (
          <div>
            <p className="text-[13px] font-semibold text-muted-foreground">Recent pending challenges</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recentPending.map((otp) => (
                <button
                  key={otp.id}
                  onClick={() => {
                    setOtpId(otp.id);
                    setCode("");
                    setVerifyResult(null);
                    setVerifyError("");
                  }}
                  className="rounded-2xl border border-border bg-surface px-3 py-2 text-left transition hover:bg-white"
                >
                  <p className="font-mono text-[12px] font-semibold text-foreground">{otp.id}</p>
                  <p className="text-[11px] text-muted-foreground">{otp.to} - {timeAgo(otp.created_at)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleVerify} disabled={!otpId.trim() || code.trim().length !== 6 || verifying} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F172A] px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
          {verifying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Verify OTP
        </button>

        {verifyResult && (
          <ResultBox title="Verification result">
            <p>OTP ID: <code className="font-mono">{verifyResult.otp_id}</code></p>
            <p>Status: <span className="font-semibold">{verifyResult.status}</span></p>
            <p>Verified at: {verifyResult.verified_at ? timeAgo(verifyResult.verified_at) : "not verified"}</p>
          </ResultBox>
        )}
        {verifyError && <ErrorBox>{verifyError}</ErrorBox>}
      </div>
    </section>
  );
}

function TransactionalPlayground({
  environment,
  templates,
  onMessage,
}: {
  environment: Environment;
  templates: TransactionalTemplate[];
  onMessage: (message: Message) => void;
}) {
  const activeTemplates = useMemo(
    () => templates.filter((template) => template.status === "active"),
    [templates],
  );
  const [mode, setMode] = useState<"template" | "legacy">("template");
  const [to, setTo] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Message | null>(null);
  const selectedTemplate = activeTemplates.find((template) => template.id === templateId) || activeTemplates[0] || null;

  useEffect(() => {
    if (!selectedTemplate) return;
    setTemplateId((current) => current || selectedTemplate.id);
    setVariables((current) => {
      const next: Record<string, string> = {};
      selectedTemplate.variables.forEach((key) => {
        next[key] = current[key] || "";
      });
      return next;
    });
  }, [selectedTemplate]);

  async function send() {
    if (sending || !to.trim()) return;
    if (mode === "template" && !templateId.trim()) return;
    if (mode === "legacy" && !content.trim()) return;
    setSending(true);
    setError("");
    try {
      const response = await api.sendTransactional(
        mode === "template"
          ? { to, template_id: templateId.trim(), variables, environment }
          : { to, content, environment },
      );
      if (response.status === "error") setError(response.message);
      else {
        setResult(response.data);
        onMessage(response.data);
      }
    } catch (event: any) {
      setError(event?.message || "Unable to send transactional SMS.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <ReceiptText className="h-5 w-5 text-brand" />
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Transactional playground</h2>
          <p className="text-[14px] text-muted-foreground">Test alerts, notices, and receipts through the active environment.</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-surface p-2">
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "template", label: "Template send" },
            { id: "legacy", label: "Legacy raw send" },
          ] as const).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setMode(option.id);
                setError("");
                setResult(null);
              }}
              className={`rounded-2xl px-4 py-3 text-left text-[14px] font-semibold transition ${mode === option.id ? "bg-primary text-white shadow-[0_10px_22px_rgba(5,8,20,0.18)]" : "bg-white text-foreground hover:bg-[#EEF2FF]"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <FieldLabel label="Recipient">
          <input value={to} onChange={(event) => setTo(event.target.value)} placeholder="09518023980" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
        {mode === "template" ? (
          <>
            <FieldLabel label="Active template">
              <select
                value={templateId}
                onChange={(event) => {
                  const next = activeTemplates.find((template) => template.id === event.target.value);
                  setTemplateId(event.target.value);
                  setVariables(Object.fromEntries((next?.variables || []).map((key) => [key, variables[key] || ""])));
                }}
                className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand"
              >
                {!activeTemplates.length ? <option value="">No active templates</option> : null}
                {activeTemplates.map((template) => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </FieldLabel>
            {selectedTemplate && (
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-[13px] font-semibold text-foreground">Template preview</p>
                <p className="mt-2 text-[14px] leading-7 text-muted-foreground">{selectedTemplate.content}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {selectedTemplate.variables.map((key) => (
                    <FieldLabel key={key} label={key}>
                      <input
                        value={variables[key] || ""}
                        onChange={(event) => setVariables((current) => ({ ...current, [key]: event.target.value }))}
                        placeholder={`Value for ${key}`}
                        className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-[14px] outline-none focus:border-brand"
                      />
                    </FieldLabel>
                  ))}
                </div>
              </div>
            )}
            {!activeTemplates.length && (
              <div className="rounded-2xl border border-warning/20 bg-warning-muted px-4 py-3 text-[14px] text-warning-emphasis">
                Create and activate a transactional template first. Active templates appear here for testing.
              </div>
            )}
          </>
        ) : (
          <FieldLabel label="Message">
            <textarea value={content} onChange={(event) => setContent(event.target.value.slice(0, 480))} rows={6} placeholder="Hi Carlo, your order is ready for pickup." className="mt-2 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] leading-7 outline-none focus:border-brand" />
          </FieldLabel>
        )}
        <button onClick={send} disabled={!to.trim() || sending || (mode === "template" ? !templateId.trim() : !content.trim())} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand/90 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
          {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {mode === "template" ? "Send template message" : "Send legacy raw SMS"}
        </button>
        {result && (
          <ResultBox title="Message accepted">
            <p>ID: <code className="font-mono">{result.id}</code></p>
            <p>Status: {result.status}</p>
            <p>Type: {result.message_type || "general"}</p>
            {result.template_name_snapshot ? <p>Template: {result.template_name_snapshot}</p> : null}
          </ResultBox>
        )}
        {error && <ErrorBox>{error}</ErrorBox>}
      </div>
    </section>
  );
}

function MarketingPlayground({ environment, onMessages }: { environment: Environment; onMessages: (messages: Message[]) => void }) {
  const [recipients, setRecipients] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [content, setContent] = useState("");
  const [consent, setConsent] = useState(environment === "sandbox");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MarketingResult | null>(null);

  async function send() {
    const list = recipients.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
    if (!list.length || !content.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await api.sendMarketing({
        recipients: list,
        content,
        campaign_name: campaignName || undefined,
        consent_confirmed: consent,
        environment,
      });
      if (response.status === "error") setError(response.message);
      else {
        setResult(response.data);
        onMessages(response.data.messages || []);
      }
    } catch (event: any) {
      setError(event?.message || "Unable to send campaign.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <Megaphone className="h-5 w-5 text-brand" />
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Marketing playground</h2>
          <p className="text-[14px] text-muted-foreground">Test campaign batching and consent handling from one place.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <FieldLabel label="Campaign name">
          <input value={campaignName} onChange={(event) => setCampaignName(event.target.value)} placeholder="June promo" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
        <FieldLabel label="Recipients">
          <textarea value={recipients} onChange={(event) => setRecipients(event.target.value)} rows={5} placeholder={"09518023980\n09926810528"} className="mt-2 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
        </FieldLabel>
      </div>
      <div className="mt-4">
        <FieldLabel label="Message">
          <textarea value={content} onChange={(event) => setContent(event.target.value.slice(0, 480))} rows={6} placeholder="Hi {{name}}, claim your offer today." className="mt-2 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] leading-7 outline-none focus:border-brand" />
        </FieldLabel>
      </div>
      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-[14px] font-semibold text-label">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="h-4 w-4" />
        I confirm these recipients opted in to receive marketing SMS.
      </label>
      <button onClick={send} disabled={!recipients.trim() || !content.trim() || !consent || sending} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand/90 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
        {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
        Send campaign
      </button>
      {result && (
        <div className="mt-4">
          <ResultBox title="Campaign processed">
            <p>Campaign: <code className="font-mono">{result.campaign_id}</code></p>
            <p>Accepted: {result.accepted}</p>
            <p>Failed: {result.failed}</p>
            {result.errors?.length ? <p>Errors: {result.errors.join("; ")}</p> : null}
          </ResultBox>
        </div>
      )}
      {error && <ErrorBox>{error}</ErrorBox>}
    </section>
  );
}

function ErrorBox({ children }: { children: ReactNode }) {
  return <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{children}</div>;
}
