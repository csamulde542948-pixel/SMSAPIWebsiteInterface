import { ArrowRight, LogOut, Menu, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "@/lib/useClickOutside";
import type { FirebaseSession } from "../lib/firebaseAuth";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Docs", href: "/docs" },
  { label: "About us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

type HeaderProps = {
  session: FirebaseSession | null;
  onDashboard: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
};

export function Header({ session, onDashboard, onSignIn, onSignUp, onSignOut }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  useClickOutside(menuRef, closeMenu, open);

  return (
    <div ref={menuRef} className="relative flex items-center justify-end lg:justify-center">
      <nav className="hidden items-center gap-7 rounded-[16px] border border-border bg-white/30 px-6 py-3 shadow-[inset_0_4px_4px_rgba(255,255,255,0.25),0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-[50px] lg:flex" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="text-[14px] font-medium text-foreground-body/70 transition hover:text-ink">
            {item.label}
          </a>
        ))}
      </nav>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(100vw-2.5rem,320px)] rounded-[16px] border border-border bg-white/85 p-3 shadow-2xl backdrop-blur-[50px] lg:hidden">
          {navItems.map((item) => (
            <a key={item.label} onClick={() => setOpen(false)} href={item.href} className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-foreground-body/75 hover:bg-white/60">
              {item.label}
            </a>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onDashboard();
                  }}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-[15px] font-semibold text-foreground-body hover:bg-white/60"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSignOut();
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSignIn();
                  }}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-[15px] font-semibold text-foreground-body hover:bg-white/60"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSignUp();
                  }}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-primary-hover"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-border bg-white/30 text-ink lg:hidden" aria-label="Toggle navigation" aria-expanded={open}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
}
