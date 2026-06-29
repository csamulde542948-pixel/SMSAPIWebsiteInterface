import { OpenSMSLogo } from "./OpenSMSLogo";

type FooterProps = {
  onDashboard: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
};

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "/docs" },
  { label: "About", href: "#about" },
];

const platformLinks = [
  { label: "Dashboard", action: "dashboard" as const },
  { label: "OTP API", href: "/docs/otp" },
  { label: "Transactional SMS", href: "/docs/transactional" },
  { label: "Gateway setup", href: "/docs" },
];

function FooterLink({
  label,
  href,
  onClick,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left text-[14px] text-muted-foreground transition hover:text-brand"
      >
        {label}
      </button>
    );
  }

  return (
    <a href={href} className="text-[14px] text-muted-foreground transition hover:text-brand">
      {label}
    </a>
  );
}

export function Footer({ onDashboard, onPrivacy, onTerms }: FooterProps) {
  return (
    <footer className="border-t border-border bg-white/40 backdrop-blur-[50px]">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <OpenSMSLogo />
            <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
              OpenSMS helps developers and businesses route SMS through their own Android phones. Bring your SIMs,
              expose one REST API, and keep delivery state visible from queue to receipt — built for Philippine
              networks, self-hosted and open.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">Product</p>
            <nav className="mt-4 flex flex-col gap-3">
              {productLinks.map((link) => (
                <FooterLink key={link.label} label={link.label} href={link.href} />
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">Platform</p>
            <nav className="mt-4 flex flex-col gap-3">
              {platformLinks.map((link) =>
                link.action === "dashboard" ? (
                  <FooterLink key={link.label} label={link.label} onClick={onDashboard} />
                ) : (
                  <FooterLink key={link.label} label={link.label} href={link.href} />
                ),
              )}
            </nav>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">Legal</p>
            <nav className="mt-4 flex flex-col gap-3">
              <FooterLink label="Privacy Policy" onClick={onPrivacy} />
              <FooterLink label="Terms of Service" onClick={onTerms} />
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-[13px] text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OpenSMS. All rights reserved.</p>
          <p>Philippine SMS infrastructure for developers and businesses.</p>
        </div>
      </div>
    </footer>
  );
}
