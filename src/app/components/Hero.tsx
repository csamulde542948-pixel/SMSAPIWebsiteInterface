import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { CliConsole } from "./CliConsole";

type HeroProps = {
  onDashboard: () => void;
};

export function Hero({ onDashboard }: HeroProps) {
  return (
    <section
      id="top"
      className="relative mx-auto grid min-h-[760px] w-full max-w-[1600px] grid-cols-1 items-center gap-10 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-0 lg:pt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.10) 1px, transparent 1.2px)",
          backgroundSize: "18px 18px",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 max-w-[660px]">
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-white/55 px-4 py-2 shadow-[inset_0_4px_4px_rgba(255,255,255,0.25)] backdrop-blur-[50px]">
          <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
          <span className="text-[13px] font-medium tracking-[-0.02em] text-foreground-body/70">
            Philippine SMS API · Android gateway routing
          </span>
        </div>

        <h1 className="font-display text-[54px] font-bold leading-[1.05] tracking-[-2px] text-ink sm:text-[75px]">
          Turn Android phones into SMS gateways
        </h1>
        <p className="mt-7 max-w-[610px] text-[18px] leading-8 tracking-[-1px] text-muted-foreground">
          Connect your own phones, expose one clean API, and track every message from queued to sent to delivered.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button onClick={onDashboard} className="group inline-flex items-center justify-center gap-3 rounded-[16px] bg-brand px-6 py-4 text-[16px] font-semibold text-white shadow-[0_12px_36px_rgba(0,132,255,0.28)] transition hover:bg-brand-hover hover:shadow-[0_18px_50px_rgba(0,132,255,0.34)]">
            Get Started Now
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand transition group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
          <a href="/docs" className="inline-flex items-center justify-center rounded-[16px] border border-border bg-white/60 px-6 py-4 text-[16px] font-semibold text-foreground-body shadow-[inset_0_4px_4px_rgba(255,255,255,0.25)] backdrop-blur-[50px] transition hover:border-border hover:bg-white/80">
            View Documentation
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="relative flex min-h-[420px] items-center lg:min-h-[520px] lg:justify-end">
        <div className="w-full max-w-[680px]">
          <CliConsole />
        </div>
      </motion.div>
    </section>
  );
}
