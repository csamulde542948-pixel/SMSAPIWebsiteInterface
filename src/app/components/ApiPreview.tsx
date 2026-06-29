import { Copy } from "lucide-react";

const sample = `POST /v1/messages
{
  "to": "+639171234567",
  "message": "Your code is 123456",
  "type": "otp"
}`;

export function ApiPreview() {
  return (
    <section id="documentation" className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          API
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40">REST</span>
        </div>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl">
          One clean request. Your entire gateway layer behind it.
        </h2>
        <p className="mt-6 max-w-md text-base leading-[1.6] text-white/60">
          Send SMS from your product without binding application code to individual devices, SIMs, or provider APIs.
        </p>
      </div>
      <div id="docs" className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-mono text-xs text-white/50">messages.json</span>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
        <pre className="overflow-x-auto p-6 text-[15px] leading-8 text-white/85"><code>{sample}</code></pre>
      </div>
    </section>
  );
}
