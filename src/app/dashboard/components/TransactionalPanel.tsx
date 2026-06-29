import { useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Check, Copy, PencilLine, ReceiptText, RefreshCw } from "lucide-react";
import { api, type Message, type TransactionalTemplate } from "../../lib/api";
import type { Environment } from "../types";
import { NetworkTag, StatusPill, environmentCopy, timeAgo } from "../utils";

type TransactionalPanelProps = {
  environment: Environment;
  messages: Message[];
  templates: TransactionalTemplate[];
  onRefresh: () => void;
  onOpenPlayground: () => void;
  loading: boolean;
};

const starterTemplates = [
  {
    name: "Order ready notice",
    content: "Hi {{name}}, your order {{order_id}} is ready for pickup at {{location}}.",
    note: "Pickup and fulfillment updates",
  },
  {
    name: "Payment received",
    content: "Hi {{name}}, we received your payment of {{amount}} for invoice {{invoice_id}}. Thank you.",
    note: "Receipts and payment confirmations",
  },
  {
    name: "Delivery update",
    content: "Hi {{name}}, your package {{tracking_id}} is out for delivery and expected by {{delivery_window}}.",
    note: "Shipping and courier notifications",
  },
];

export function TransactionalPanel({
  environment,
  messages,
  templates,
  onRefresh,
  onOpenPlayground,
  loading,
}: TransactionalPanelProps) {
  const transactional = useMemo(
    () => messages.filter((message) => message.direction === "outbound" && message.message_type === "transactional"),
    [messages],
  );
  const total = transactional.length;
  const delivered = transactional.filter((message) => message.status === "delivered").length;
  const inFlight = transactional.filter((message) => ["queued", "pending", "sent"].includes(message.status)).length;
  const failed = transactional.filter((message) => ["failed", "expired"].includes(message.status)).length;
  const deliveryRate = total ? Math.round((delivered / total) * 100) : 0;
  const templateUsage = useMemo(() => {
    const counts = new Map<string, number>();
    transactional.forEach((message) => {
      if (!message.template_id) return;
      counts.set(message.template_id, (counts.get(message.template_id) || 0) + 1);
    });
    return counts;
  }, [transactional]);

  return (
    <div className="space-y-6">
      <FeatureHeader
        environment={environment}
        onOpenPlayground={onOpenPlayground}
        onRefresh={onRefresh}
        loading={loading}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Templates", value: String(templates.length), detail: "Draft, active, and archived", icon: ReceiptText },
          { label: "Requests", value: String(total), detail: `${environmentCopy(environment).label} transactional messages`, icon: ReceiptText },
          { label: "Delivered", value: String(delivered), detail: "Confirmed handset delivery", icon: Check },
          { label: "In flight", value: String(inFlight), detail: "Queued, pending, or sent", icon: RefreshCw },
          { label: "Failed", value: `${deliveryRate}%`, detail: `${failed} failed or expired`, icon: AlertCircle },
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

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <TransactionalTemplateEditor environment={environment} templates={templates} onRefresh={onRefresh} />
        <TransactionalTemplateList
          environment={environment}
          templates={templates}
          usage={templateUsage}
          onRefresh={onRefresh}
        />
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
          <table className="w-full min-w-[1180px]">
            <thead>
              <tr className="border-b border-border text-left text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Template</th>
                <th className="px-5 py-4 font-semibold">Recipient</th>
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
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{message.template_name_snapshot || "Legacy raw send"}</p>
                      <p className="font-mono text-[11px] text-subtle-foreground">{message.template_id || "manual"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-[13px] text-foreground">{message.to}</td>
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
                      description="Create and activate a template, then send a transactional test from the playground."
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

function FeatureHeader({
  environment,
  onOpenPlayground,
  onRefresh,
  loading,
}: {
  environment: Environment;
  onOpenPlayground: () => void;
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <ReceiptText className="h-5 w-5 text-brand" />
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">Transactional templates</p>
          </div>
          <h2 className="mt-3 text-[28px] font-bold tracking-[-0.06em] text-foreground">Transactional delivery workspace</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-muted-foreground">
            Define reusable templates, activate the ones your customers should call from their backend, and inspect delivery quality for every transactional SMS in {environmentCopy(environment).label}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-foreground transition hover:bg-surface">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={onOpenPlayground} className="inline-flex items-center gap-2 rounded-2xl bg-brand/90 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">
            Open playground
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TransactionalTemplateEditor({
  environment,
  templates,
  onRefresh,
}: {
  environment: Environment;
  templates: TransactionalTemplate[];
  onRefresh: () => void;
}) {
  const [editingId, setEditingId] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const variables = useMemo(() => extractVariables(content), [content]);
  const templateBeingEdited = templates.find((template) => template.id === editingId) || null;

  async function submit() {
    if (!name.trim() || !content.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = editingId
        ? await api.updateTransactionalTemplate(editingId, { name, content, environment })
        : await api.createTransactionalTemplate({ name, content, environment });
      if (response.status === "error") {
        setError(response.message);
        return;
      }
      setEditingId("");
      setName("");
      setContent("");
      onRefresh();
    } catch (event: any) {
      setError(event?.message || "Unable to save transactional template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">{editingId ? "Edit template" : "Create template"}</h2>
          <p className="text-[14px] text-muted-foreground">Build reusable transactional SMS formats with named variables like <code className="font-mono text-foreground">{'{{name}}'}</code>.</p>
        </div>
        {templateBeingEdited && (
          <button
            type="button"
            onClick={() => {
              setEditingId("");
              setName("");
              setContent("");
              setError("");
            }}
            className="rounded-2xl border border-border bg-white px-4 py-2 text-[13px] font-semibold text-foreground transition hover:bg-surface"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-[13px] font-semibold text-muted-foreground">Start from a sample</p>
          <div className="mt-3 grid gap-3">
            {starterTemplates.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => {
                  setEditingId("");
                  setName(template.name);
                  setContent(template.content);
                  setError("");
                }}
                className="rounded-[22px] border border-border bg-surface p-4 text-left transition hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{template.name}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">{template.note}</p>
                  </div>
                  <span className="rounded-full border border-brand/15 bg-[#EEF8FD] px-2.5 py-1 text-[11px] font-semibold text-brand">
                    Use sample
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{template.content}</p>
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold text-muted-foreground">Template name</span>
          <input value={name} onChange={(event) => setName(event.target.value.slice(0, 96))} placeholder="Order ready notice" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[14px] outline-none focus:border-brand" />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-muted-foreground">Template content</span>
          <textarea value={content} onChange={(event) => setContent(event.target.value.slice(0, 480))} rows={8} placeholder="Hi {{name}}, your order {{order_id}} is ready for pickup." className="mt-2 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] leading-7 outline-none focus:border-brand" />
        </label>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-foreground">Detected variables</p>
            <p className="text-[12px] text-muted-foreground">{variables.length ? `${variables.length} variable${variables.length > 1 ? "s" : ""}` : "No variables yet"}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {variables.length ? variables.map((variable) => (
              <span key={variable} className="rounded-full border border-brand/15 bg-[#EEF8FD] px-3 py-1 text-[12px] font-semibold text-brand">
                {variable}
              </span>
            )) : (
              <p className="text-[13px] text-muted-foreground">Use placeholders like <code className="font-mono text-foreground">{'{{name}}'}</code> to personalize the SMS.</p>
            )}
          </div>
        </div>

        <button onClick={submit} disabled={!name.trim() || !content.trim() || saving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand/90 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PencilLine className="h-4 w-4" />}
          {editingId ? "Save template changes" : "Create draft template"}
        </button>
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{error}</div>}
      </div>

      {templates.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-[13px] font-semibold text-muted-foreground">Quick edit</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {templates.slice(0, 6).map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setEditingId(template.id);
                  setName(template.name);
                  setContent(template.content);
                  setError("");
                }}
                className="rounded-2xl border border-border bg-surface px-3 py-2 text-left transition hover:bg-white"
              >
                <p className="text-[13px] font-semibold text-foreground">{template.name}</p>
                <p className="text-[11px] text-muted-foreground">{template.status} · {template.slug}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TransactionalTemplateList({
  environment,
  templates,
  usage,
  onRefresh,
}: {
  environment: Environment;
  templates: TransactionalTemplate[];
  usage: Map<string, number>;
  onRefresh: () => void;
}) {
  const [busyId, setBusyId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [error, setError] = useState("");

  async function changeStatus(template: TransactionalTemplate, next: "active" | "archived") {
    setBusyId(template.id);
    setError("");
    try {
      const response = next === "active"
        ? await api.activateTransactionalTemplate(template.id, environment)
        : await api.archiveTransactionalTemplate(template.id, environment);
      if (response.status === "error") {
        setError(response.message);
        return;
      }
      onRefresh();
    } catch (event: any) {
      setError(event?.message || "Unable to update template status.");
    } finally {
      setBusyId("");
    }
  }

  async function copyTemplateId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(""), 1400);
    } catch {
      setCopiedId("");
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-white/84 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
      <div>
        <h2 className="text-[20px] font-bold tracking-[-0.04em] text-foreground">Template registry</h2>
        <p className="text-[14px] text-muted-foreground">Copy the template ID into your backend integration and send with <code className="font-mono text-foreground">template_id</code> plus named variables.</p>
      </div>

      <div className="mt-5 space-y-3">
        {templates.length ? templates.map((template) => (
          <div key={template.id} className="rounded-[24px] border border-border bg-surface p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-foreground">{template.name}</p>
                  <StatusPill status={template.status} />
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{template.slug} · {template.variables.length ? template.variables.join(", ") : "No variables"}</p>
                <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{template.content}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button onClick={() => void copyTemplateId(template.id)} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-[12px] font-semibold text-label transition hover:bg-surface">
                    {copiedId === template.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedId === template.id ? "Copied" : "Copy template_id"}
                  </button>
                  <code className="break-all font-mono text-[12px] text-muted-foreground">{template.id}</code>
                </div>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-3 sm:min-w-[220px]">
                <MetricCard label="Usage" value={String(usage.get(template.id) || 0)} />
                <MetricCard label="Updated" value={timeAgo(template.updated_at)} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {template.status !== "active" && (
                <button onClick={() => void changeStatus(template, "active")} disabled={busyId === template.id} className="rounded-2xl bg-primary px-4 py-2 text-[13px] font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
                  {busyId === template.id ? "Updating..." : "Activate"}
                </button>
              )}
              {template.status !== "archived" && (
                <button onClick={() => void changeStatus(template, "archived")} disabled={busyId === template.id} className="rounded-2xl border border-border bg-white px-4 py-2 text-[13px] font-semibold text-foreground transition hover:bg-surface disabled:opacity-60">
                  Archive
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-black/12 bg-surface px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <ReceiptText className="h-6 w-6 text-subtle-foreground" />
            </div>
            <p className="text-[15px] font-semibold text-foreground">No templates yet</p>
            <p className="max-w-sm text-[13px] text-muted-foreground">Create a draft template, activate it, and use the generated template ID in your transactional API calls.</p>
          </div>
        )}
      </div>
      {error && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{error}</div>}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-foreground">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-foreground">{value}</p>
    </div>
  );
}

function EmptyState({ title, description, onAction }: { title: string; description: string; onAction: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
        <ReceiptText className="h-6 w-6 text-subtle-foreground" />
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

function extractVariables(content: string) {
  const matches = Array.from(content.matchAll(/{{\s*([A-Za-z][A-Za-z0-9_]*)\s*}}/g));
  return matches.reduce<string[]>((list, match) => {
    const key = match[1];
    if (!list.includes(key)) list.push(key);
    return list;
  }, []);
}
