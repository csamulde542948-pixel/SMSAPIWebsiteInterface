import { ArrowRight, BookOpen } from "lucide-react";

type FinalCTAProps = {
  onDashboard: () => void;
};

export function FinalCTA({ onDashboard }: FinalCTAProps) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-8 sm:px-8">
      <div className="relative overflow-hidden rounded-[28px] border border-brand/20 bg-white/60 px-8 py-16 text-center shadow-[inset_0_4px_4px_rgba(255,255,255,0.24),0_24px_90px_rgba(0,132,255,0.1)] backdrop-blur-[50px] sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,132,255,0.08) 1px, transparent 1.2px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="pointer-events-none absolute -left-20 top-[-80px] h-[280px] w-[280px] rounded-full bg-[#60B1FF]/30 blur-[90px]" />
        <div className="pointer-events-none absolute -right-16 bottom-[-60px] h-[240px] w-[240px] rounded-full bg-brand/20 blur-[80px]" />
        <div className="relative">
          <p className="text-[15px] font-semibold text-brand">Ready to route?</p>
          <h2
            className="mx-auto mt-4 max-w-3xl text-[42px] font-bold leading-[1.05] tracking-[-1.6px] text-ink sm:text-[54px] font-display"
          >
            Build your SMS layer.
            <br />
            Own the network.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-8 tracking-[-0.5px] text-muted-foreground">
            Start with one API, connect your gateways, and keep delivery state visible from request to receipt.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={onDashboard}
              className="group inline-flex items-center justify-center gap-3 rounded-[16px] bg-brand px-6 py-4 text-[16px] font-semibold text-white shadow-[0_12px_36px_rgba(0,132,255,0.28)] transition hover:bg-brand-hover hover:shadow-[0_18px_50px_rgba(0,132,255,0.34)]"
            >
              Get Started
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand transition group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <a
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-border bg-white/60 px-6 py-4 text-[16px] font-semibold text-foreground-body shadow-[inset_0_4px_4px_rgba(255,255,255,0.25)] backdrop-blur-[50px] transition hover:border-border hover:bg-white/80"
            >
              <BookOpen className="h-4 w-4" />
              Read the Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
