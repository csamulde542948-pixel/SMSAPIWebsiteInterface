import { useState } from "react";
import { AlertCircle, RefreshCw, Send, X } from "lucide-react";
import { motion } from "motion/react";
import { api, detectNetwork, type Message } from "../../lib/api";
import type { Environment } from "../types";
import { NetworkTag } from "../utils";

type SendModalProps = {
  environment: Environment;
  onClose: () => void;
  onSent: (message: Message) => void;
};

export function SendModal({ environment, onClose, onSent }: SendModalProps) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const network = detectNetwork(to);

  async function sendMessage() {
    if (!to.trim() || !content.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await api.sendMessage({ from: from || undefined, to, content, environment });
      if (response.status === "error") setError(response.message);
      else onSent(response.data);
    } catch (event: any) {
      setError(event?.message || "Unable to reach the OpenSMS API.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      <button className="absolute inset-0 bg-primary/35 backdrop-blur-sm" onClick={onClose} aria-label="Close dialog" />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="relative w-full max-w-xl rounded-[28px] border border-border bg-white p-6 shadow-[0_30px_90px_rgba(5,8,20,0.22)]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-brand">New message</p>
            <h2 className="mt-1 text-[26px] font-bold tracking-[-0.05em] text-foreground">Route an SMS</h2>
            <p className="mt-1 text-[13px] font-semibold capitalize text-muted-foreground">{environment} environment</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-[13px] font-semibold text-muted-foreground">From</span>
            <input value={from} onChange={(event) => setFrom(event.target.value)} placeholder="OpenSMS or +639..." className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
          </label>
          <label>
            <span className="text-[13px] font-semibold text-muted-foreground">To</span>
            <input value={to} onChange={(event) => setTo(event.target.value)} placeholder="+639171234567" className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3.5 font-mono text-[14px] outline-none focus:border-brand" />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between">
          {network ? <NetworkTag network={network} /> : <span className="text-[13px] text-muted-foreground">Network detected from PH prefix</span>}
          <span className="text-[13px] text-muted-foreground">{content.length}/480</span>
        </div>
        <textarea value={content} onChange={(event) => setContent(event.target.value.slice(0, 480))} rows={5} placeholder="Your code is 123456" className="mt-4 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] leading-7 outline-none focus:border-brand" />
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <button onClick={sendMessage} disabled={!to.trim() || !content.trim() || sending} className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand/90 px-5 py-4 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
          {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? "Routing" : "Send Message"}
        </button>
      </motion.div>
    </div>
  );
}
