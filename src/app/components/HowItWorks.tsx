import { motion } from "motion/react";

const lanes = [
  { label: "Priority", count: "4", color: "#ffffff", items: ["OTP requests", "Banking alerts"] },
  { label: "Follow-up", count: "7", color: "#d4d4d8", items: ["Retry candidates", "Pending receipts"] },
  { label: "Updates", count: "18", color: "#9ca3af", items: ["Gateway online", "Webhook delivered"] },
  { label: "Archived", count: "13", color: "#52525b", items: ["Receipts", "Completed jobs"] },
];

export function HowItWorks() {
  return (
    <section id="guides" className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <div className="flex items-center gap-2 text-sm font-medium text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Routing
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40">gateway-native</span>
        </div>
        <h2 className="mt-5 text-3xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl">
          Route messages with a network you control.
        </h2>
        <p className="mt-6 max-w-md text-base leading-[1.6] text-white/60">
          OpenSMS understands gateway availability, SIM health, provider fallback, and delivery state so your application only talks to one API.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {["Gateway selection", "Provider fallback", "Delivery receipts", "Inbound webhooks"].map((chip) => (
            <span key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">{chip}</span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }} className="liquid-glass rounded-2xl p-5">
        <p className="mb-4 text-sm font-medium text-white/50">Today - 42 message events routed</p>
        <div className="grid gap-3">
          {lanes.map((lane) => (
            <div key={lane.label} className="liquid-glass rounded-xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lane.color }} />
                  <span className="text-sm font-semibold text-white">{lane.label}</span>
                </div>
                <span className="text-xs text-white/40">{lane.count}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lane.items.map((item) => (
                  <span key={item} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-xs text-white/55">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
