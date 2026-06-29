import { useCallback, useRef, useState } from "react";
import { ArrowRight, ChevronDown, LogOut } from "lucide-react";
import { useClickOutside } from "@/lib/useClickOutside";
import { Header } from "./components/Header";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LandingSections } from "./components/LandingSections";
import { OpenSMSLogo } from "./components/OpenSMSLogo";
import type { FirebaseSession } from "./lib/firebaseAuth";
import { AccountAvatar, accountLabel } from "./dashboard/utils";

type LandingPageProps = {
  session: FirebaseSession | null;
  onDashboard: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
};

export function LandingPage({
  session,
  onDashboard,
  onSignIn,
  onSignUp,
  onSignOut,
  onPrivacy,
  onTerms,
}: LandingPageProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useClickOutside(profileRef, closeProfile, profileOpen);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-ink">
      <div className="pointer-events-none absolute left-[-160px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#60B1FF]/35 blur-[120px]" />
      <div className="pointer-events-none absolute left-[80px] top-[-120px] h-[360px] w-[360px] rounded-full bg-[#319AFF]/25 blur-[110px]" />
      <div className="relative z-10">
        <div className="sticky top-[24px] z-40 mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-5 pt-6 sm:gap-4 sm:px-8">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="OpenSMS home">
            <OpenSMSLogo />
          </a>

          <div className="relative flex flex-1 items-center justify-end lg:justify-center">
            <Header
              session={session}
              onDashboard={onDashboard}
              onSignIn={onSignIn}
              onSignUp={onSignUp}
              onSignOut={() => {
                setProfileOpen(false);
                onSignOut();
              }}
            />
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {session ? (
              <>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onDashboard();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-border bg-white/45 px-4 text-[14px] font-semibold text-foreground-body shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[28px] transition hover:border-border hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
                >
                  Dashboard
                </button>
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                    className="flex h-11 items-center gap-3 rounded-[14px] border border-border bg-white/55 pl-2 pr-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[28px] transition hover:border-border hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                  >
                    <AccountAvatar session={session} />
                    <span className="max-w-[180px] truncate text-[13px] font-semibold text-foreground-body">{accountLabel(session)}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${profileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] rounded-2xl border border-border bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                      <div className="border-b border-border px-3 py-3">
                        <p className="truncate text-[14px] font-semibold text-foreground">{accountLabel(session)}</p>
                        <p className="truncate text-[12px] text-muted-foreground">{session.email || "Google account"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          onSignOut();
                        }}
                        className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-red-700 transition hover:bg-red-50"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-border bg-white/45 px-4 text-[14px] font-semibold text-foreground-body shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[28px] transition hover:border-border hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
                >
                  Sign in
                </button>
                <button
                  onClick={onSignUp}
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-primary px-4 pl-5 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(5,8,20,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_42px_rgba(5,8,20,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 active:translate-y-0"
                >
                  Get Started
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-foreground transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
        <main>
          <Hero onDashboard={session ? onDashboard : onSignUp} />
          <LandingSections onDashboard={session ? onDashboard : onSignUp} />
          <FinalCTA onDashboard={session ? onDashboard : onSignUp} />
        </main>
        <Footer
          onDashboard={onDashboard}
          onPrivacy={onPrivacy}
          onTerms={onTerms}
        />
      </div>
    </div>
  );
}
