import { ArrowRight, BookOpen, Check, Code2, Globe2, Layers, RadioTower, Route, Webhook, Zap } from "lucide-react";

const featureCards = [
  { icon: Route, title: "Phone-first routing", text: "Assign each outbound SMS to a healthy Android phone with an active SIM." },
  { icon: RadioTower, title: "Gateway network", text: "Register Android phones, monitor heartbeat status, and see SIM readiness." },
  { icon: Webhook, title: "Delivery states", text: "Track queued, routed, sent, delivered, failed, and inbound events in real time." },
  { icon: Globe2, title: "PH-ready", text: "Normalize Philippine recipients and detect Globe, Smart, TNT, TM, Sun, and DITO." },
];

const docs = [
  {
    icon: Zap,
    title: "Quickstart",
    text: "Send your first SMS in under five minutes. Install the CLI, set your API key, and fire off a message.",
    code: "opensms send --to +639171234567 --content \"Your code is 123456\"",
    href: "/docs",
  },
  {
    icon: Code2,
    title: "REST API reference",
    text: "Every endpoint, parameter, and response shape. Includes curl examples and webhook payload schemas.",
    code: "curl -X POST https://api.opensms.io/v1/messages/send \\\n  -H \"x-api-key: $KEY\" \\\n  -d '{\"to\":\"+639171234567\",\"content\":\"Hi\"}'",
    href: "/docs",
  },
  {
    icon: Webhook,
    title: "Webhooks & events",
    text: "Subscribe to delivery receipts and inbound messages. Configure retry policies and signature verification.",
    code: "POST /webhooks/httpsms\n{ \"event\": \"message.delivered\", \"id\": \"msg_8f3a21\" }",
    href: "/docs",
  },
  {
    icon: Layers,
    title: "Gateway setup",
    text: "Register an Android phone and paste the returned gateway token into the mobile app.",
    code: "POST /v1/gateways/register\n{ \"phone_number\": \"09171234567\" }",
    href: "/docs",
  },
];

const plans = [
  { name: "Self-host", price: "Free", text: "Run OpenSMS on your own infrastructure.", features: ["One clean REST API", "Android gateway support", "Optional provider fallback", "Community support"] },
  { name: "Scale", price: "Custom", text: "For teams operating production SMS routes.", features: ["Managed routing policies", "Gateway health dashboards", "Priority integration support", "SLA & uptime guarantees"] },
];

export function LandingSections({ onDashboard }: { onDashboard: () => void }) {
  return (
    <>
      <section id="features" className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-[15px] font-semibold text-brand">Features</p>
          <h2 className="mt-3 text-[42px] font-bold leading-[1.05] tracking-[-1.6px] text-ink sm:text-[54px] font-display">
            Everything you need to route SMS.
          </h2>
          <p className="mt-5 text-[18px] leading-8 tracking-[-0.5px] text-muted-foreground">
            One API, your Android phones, full visibility. Built for developers who want control without the overhead.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-[24px] border border-border bg-white/55 p-6 shadow-[inset_0_4px_4px_rgba(255,255,255,0.22),0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-[50px] transition hover:shadow-[inset_0_4px_4px_rgba(255,255,255,0.22),0_24px_80px_rgba(0,132,255,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand/10 text-brand">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-7 text-[22px] font-bold tracking-[-0.04em] text-ink font-display">{card.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8">
        <div className="rounded-[28px] border border-border bg-white/50 p-8 backdrop-blur-[50px] sm:p-12">
          <p className="text-[15px] font-semibold text-brand">About us</p>
          <h2 className="mt-4 max-w-4xl text-[42px] font-bold leading-[1.05] tracking-[-1.6px] text-ink sm:text-[58px] font-display">
            OpenSMS is built for teams who want ownership of their messaging infrastructure.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-8 tracking-[-0.5px] text-muted-foreground">
            Bring your own Android phones and SIMs, expose one reliable API, and keep your delivery data inside systems you control. No black boxes, no per-message markup, no vendor lock-in.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-[40px] font-bold tracking-[-0.04em] text-brand font-display">100%</p>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">Open source. Self-host on your own infrastructure with no licensing fees.</p>
            </div>
            <div>
              <p className="text-[40px] font-bold tracking-[-0.04em] text-brand font-display">6+</p>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">Philippine networks supported — Globe, Smart, TNT, TM, Sun, and DITO.</p>
            </div>
            <div>
              <p className="text-[40px] font-bold tracking-[-0.04em] text-brand font-display">&lt;1s</p>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">Average routing latency from queued to gateway handoff.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="docs" className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[15px] font-semibold text-brand">Docs</p>
            <h2 className="mt-3 text-[42px] font-bold leading-[1.05] tracking-[-1.6px] text-ink sm:text-[54px] font-display">
              Ship in minutes, not days.
            </h2>
            <p className="mt-5 text-[18px] leading-8 tracking-[-0.5px] text-muted-foreground">
              Copy-paste examples for every endpoint. No SDK required — just HTTP.
            </p>
          </div>
          <a href="/docs" className="inline-flex shrink-0 items-center gap-2 rounded-[14px] border border-border bg-white/60 px-5 py-3 text-[14px] font-semibold text-ink shadow-[inset_0_4px_4px_rgba(255,255,255,0.25)] backdrop-blur-[50px] transition hover:bg-white/80">
            <BookOpen className="h-4 w-4" />
            Browse all docs
          </a>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {docs.map((doc) => (
            <article key={doc.title} className="flex flex-col rounded-[24px] border border-border bg-white/55 p-6 shadow-[inset_0_4px_4px_rgba(255,255,255,0.22),0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-[50px] transition hover:shadow-[inset_0_4px_4px_rgba(255,255,255,0.22),0_24px_80px_rgba(0,132,255,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand/10 text-brand">
                  <doc.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[20px] font-bold tracking-[-0.04em] text-ink font-display">{doc.title}</h3>
              </div>
              <p className="mt-4 text-[15px] leading-7 text-muted-foreground">{doc.text}</p>
              <pre className="mt-5 overflow-x-auto rounded-[14px] bg-[#0B1120] px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-[#5EB1FF]">
{doc.code}
              </pre>
              <a href={doc.href} className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-brand transition hover:gap-3">
                Read more
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1600px] px-5 pb-24 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-[15px] font-semibold text-brand">Pricing</p>
          <h2 className="mt-3 text-[42px] font-bold leading-[1.05] tracking-[-1.6px] text-ink sm:text-[54px] font-display">Start open. Scale deliberately.</h2>
          <p className="mt-5 text-[18px] leading-8 tracking-[-0.5px] text-muted-foreground">No per-message markup. Bring your own Android phones and pay your carrier directly.</p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {plans.map((plan, index) => (
            <article key={plan.name} className={`relative rounded-[28px] p-8 shadow-[inset_0_4px_4px_rgba(255,255,255,0.24),0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-[50px] transition hover:shadow-[inset_0_4px_4px_rgba(255,255,255,0.24),0_24px_90px_rgba(0,132,255,0.08)] ${index === 1 ? "border border-brand/30 bg-white/70" : "border border-border bg-white/55"}`}>
              {index === 1 && (
                <span className="absolute right-6 top-6 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">Popular</span>
              )}
              <p className="text-[18px] font-bold text-ink">{plan.name}</p>
              <p className="mt-4 text-[48px] font-bold tracking-[-1.8px] text-ink font-display">{plan.price}</p>
              <p className="mt-2 text-[16px] leading-7 text-muted-foreground">{plan.text}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[15px] text-label">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"><Check className="h-3.5 w-3.5" /></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={onDashboard} className="mt-9 inline-flex items-center gap-3 rounded-[16px] bg-brand/80 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[inset_0_4px_4px_rgba(255,255,255,0.35),0_14px_40px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
