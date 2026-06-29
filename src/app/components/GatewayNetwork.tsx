import { CheckCircle2, RadioTower, Route, Smartphone } from "lucide-react";

const cards = [
  { icon: Smartphone, title: "Device Online", text: "Registered gateway devices report availability and owner phone state." },
  { icon: RadioTower, title: "SIM Active", text: "Track sender SIM readiness before a message is routed." },
  { icon: Route, title: "Route Healthy", text: "Fallback paths remain visible before traffic depends on them." },
  { icon: CheckCircle2, title: "Delivery Report", text: "Message state is updated from provider and gateway receipts." },
];

export function GatewayNetwork() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-widest text-white/40">Gateway network</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl">
          Manage connected devices without exposing complexity to your product.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="liquid-glass rounded-2xl p-6">
            <card.icon className="h-5 w-5 text-[#A4F4FD]" />
            <h3 className="mt-8 text-lg font-semibold tracking-tight text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/55">{card.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <p className="text-xs uppercase tracking-widest text-white/35">Built for teams operating their own messaging layer</p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {["SaaS", "Fintech", "Logistics", "Retail", "Health", "Marketplaces", "Support", "Internal Ops"].map((name) => (
            <span key={name} className="text-sm font-semibold tracking-tight text-white/45 transition hover:text-white">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
