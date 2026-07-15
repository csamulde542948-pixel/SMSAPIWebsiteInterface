
export const LANDING_API_BASE = "https://api.opensms.cloud";
export const LANDING_SUPPORT_EMAIL = "support@opensms.cloud";

/**
 * Sideload APK CDN — served by the Render API at /downloads/*
 * (sms-api/static/downloads). Primary: https://api.opensms.cloud/downloads
 * Staging API also serves the same paths on its onrender host.
 */
export const GATEWAY_APK_CDN_BASE =
  (import.meta.env.VITE_GATEWAY_APK_CDN_BASE as string | undefined)?.replace(/\/$/, "") ||
  "https://api.opensms.cloud/downloads";

/** Sideload APK for the OpenSMS Android gateway (standard / send-only). */
export const GATEWAY_APK_VERSION_NAME = "1.0.0-standard";
export const GATEWAY_APK_FILENAME = `opensms-gateway-${GATEWAY_APK_VERSION_NAME}.apk`;
export const GATEWAY_APK_DOWNLOAD_URL = `${GATEWAY_APK_CDN_BASE}/${GATEWAY_APK_FILENAME}`;
/** Two-way flavor (inbound SMS). Filename matches versionName: opensms-gateway-{versionName}.apk */
export const GATEWAY_TWO_WAY_APK_VERSION_NAME = "1.0.0-two-way";
export const GATEWAY_TWO_WAY_APK_FILENAME = `opensms-gateway-${GATEWAY_TWO_WAY_APK_VERSION_NAME}.apk`;
export const GATEWAY_TWO_WAY_APK_DOWNLOAD_URL = `${GATEWAY_APK_CDN_BASE}/${GATEWAY_TWO_WAY_APK_FILENAME}`;
/** Docs page for downloads, version log, and install guide (hero CTA target). */
export const GATEWAY_ANDROID_APP_DOCS_PATH = "/docs/android-app";

/** Approximate PHP/USD for dual-currency display on the pricing page. */
export const PHP_TO_USD_RATE = 58;

export function primaryCtaLabel(authenticated: boolean): string {
  if (authenticated) return "Dashboard";
  return "Create account";
}

export type PricingPlanId = "free" | "starter" | "plus" | "pro";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  /** Monthly price in Philippine pesos. Use 0 for Free. */
  pricePhp: number;
  /** Monthly list price in US dollars (marketing display). */
  priceUsd: number;
  priceNote: string;
  description: string;
  limits: {
    gateways: number;
    smsLabel: string;
    smsPeriod: "lifetime" | "monthly";
    monthlySms: number | null;
    dailySmsPerGateway: number;
    smsPerMinute: number;
  };
  features: string[];
  cta: "start-free" | "start-starter" | "start-plus" | "start-pro";
  ctaLabel: string;
  recommended?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    pricePhp: 0,
    priceUsd: 0,
    priceNote: "No credit card required",
    description: "Pair one phone and prove your integration with a small live send allowance.",
    limits: {
      gateways: 1,
      smsLabel: "200 live send API requests (one-time)",
      smsPeriod: "lifetime",
      monthlySms: null,
      dailySmsPerGateway: 200,
      smsPerMinute: 2,
    },
    features: [
      "1 Android gateway",
      "Sandbox + live environments",
      "OTP & transactional API",
      "Webhooks",
      "Up to 3 transactional templates",
      "7-day message logs",
      "Community support",
    ],
    cta: "start-free",
    ctaLabel: "Get started free",
  },
  {
    id: "starter",
    name: "Starter",
    pricePhp: 499,
    priceUsd: 9.99,
    priceNote: "Billed monthly",
    description: "For one business location sending OTP, alerts, and transactional SMS through a single gateway.",
    limits: {
      gateways: 1,
      smsLabel: "5,000 live send API requests / month",
      smsPeriod: "monthly",
      monthlySms: 5000,
      dailySmsPerGateway: 200,
      smsPerMinute: 2,
    },
    features: [
      "Everything in Free",
      "5,000 live send API requests per month",
      "Up to 10 transactional templates",
      "30-day message logs",
      "Email support",
    ],
    cta: "start-starter",
    ctaLabel: "Get Starter",
  },
  {
    id: "plus",
    name: "Plus",
    pricePhp: 799,
    priceUsd: 14.99,
    priceNote: "Billed monthly",
    description: "Two gateways and higher monthly volume for growing teams that need redundancy or split traffic.",
    limits: {
      gateways: 2,
      smsLabel: "11,000 live send API requests / month",
      smsPeriod: "monthly",
      monthlySms: 11000,
      dailySmsPerGateway: 225,
      smsPerMinute: 2,
    },
    features: [
      "Everything in Starter",
      "2 Android gateways",
      "11,000 live send API requests per month",
      "Up to 25 transactional templates",
      "90-day message logs",
      "Email support",
    ],
    cta: "start-plus",
    ctaLabel: "Get Plus",
    recommended: true,
  },
  {
    id: "pro",
    name: "Pro",
    pricePhp: 1299,
    priceUsd: 22.99,
    priceNote: "Billed monthly",
    description: "Higher volume and up to three gateways for redundancy, campaigns, and busier operations.",
    limits: {
      gateways: 3,
      smsLabel: "22,500 live send API requests / month",
      smsPeriod: "monthly",
      monthlySms: 22500,
      dailySmsPerGateway: 250,
      smsPerMinute: 3,
    },
    features: [
      "Everything in Plus",
      "3 Android gateways",
      "22,500 live send API requests per month",
      "Marketing & burst API",
      "Unlimited transactional templates",
      "180-day message logs",
      "Priority email support",
    ],
    cta: "start-pro",
    ctaLabel: "Get Pro",
  },
];

export const PRICING_PLATFORM_LIMITS =
  "Plans include monthly live send API request allowances — we do not sell SMS credits or carrier bundles. You pay your SIM and carrier directly. Free and Starter: up to 200 sends per gateway per day. Plus: up to 225 per gateway per day. Pro: up to 250 per gateway per day. All plans: 2 sends per gateway per minute.";

export const PRICING_PLATFORM_LIMITS_SHORT =
  "Live send API requests per plan · 200/gateway/day on Free & Starter · 225 on Plus · 250 on Pro · 2/gateway/min (Pro 3/min). Carrier costs are separate — no SMS credits sold.";

export type PricingComparisonCell = string | "yes" | "no" | "soon";

export type PricingCurrency = "php" | "usd";
export type PricingBillingPeriod = "monthly" | "annual";

/** Pay for 10 months, get 12 — annual subscribers receive two months free. */
export const ANNUAL_BILLING_FREE_MONTHS = 2;

export function annualPricePhp(monthlyPricePhp: number): number {
  return monthlyPricePhp * (12 - ANNUAL_BILLING_FREE_MONTHS);
}

export function annualSavingsPhp(monthlyPricePhp: number): number {
  return monthlyPricePhp * ANNUAL_BILLING_FREE_MONTHS;
}

export function formatMoneyPhp(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function formatMoneyUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function annualPriceUsd(monthlyPriceUsd: number): number {
  return monthlyPriceUsd * (12 - ANNUAL_BILLING_FREE_MONTHS);
}

export function annualSavingsUsd(monthlyPriceUsd: number): number {
  return monthlyPriceUsd * ANNUAL_BILLING_FREE_MONTHS;
}

export const PRICING_PAGE_FAQ = [
  {
    question: "Is there an annual billing option?",
    answer:
      "Yes. Pay annually and get 2 months free — you pay for 10 months and receive 12 months of service. Starter is ₱4,990/year, Plus is ₱7,990/year, and Pro is ₱12,990/year. Free remains ₱0 with no annual plan.",
  },
  {
    question: "Do you sell SMS credits?",
    answer:
      "No. OpenSMS does not sell SMS credits or carrier bundles. Plans include a monthly allowance of live send API requests on our platform. You pay your Philippine carrier directly for actual SMS sent through your own SIM — we charge a flat platform fee only.",
  },
  {
    question: "Why is there a daily limit per gateway?",
    answer:
      "Philippine prepaid and postpaid SIMs typically have fair-use policies around 250 SMS per day. We cap live sends at 200/day per gateway on Free and Starter, 225/day on Plus, 250/day on Pro, and 2 per minute per gateway so your numbers stay in good standing with carriers.",
  },
  {
    question: "What happens when I hit my monthly send allowance?",
    answer:
      "On Free, you receive 200 live send API requests once per account — after that, upgrade to a paid plan. On paid plans, live sending stops when your monthly allowance is used until the next billing cycle. We do not charge overage automatically at launch.",
  },
  {
    question: "Can I add more gateways later?",
    answer:
      "Starter includes one gateway, Plus includes two, and Pro includes three. If you need more devices or a higher monthly allowance, email support@opensms.cloud — we do not publish an Enterprise tier, but we can discuss custom arrangements.",
  },
  {
    question: "Is marketing SMS available on every plan?",
    answer:
      "Marketing and burst sending is available on Pro only. Free, Starter, and Plus support OTP, transactional, and general send API for operational SMS.",
  },
  {
    question: "When will two-way SMS be available?",
    answer:
      "Inbound SMS capture (two-way) is in development and is not included on any plan yet. It will roll out to eligible plans when ready.",
  },
] as const;

export const PRICING_DISCLAIMER =
  "Plans meter live send API requests — not SMS credits. Carrier costs are separate. Two-way SMS is in development. Marketing and burst sending is Pro-only. Paid plans renew monthly or annually (annual = 2 months free). Free includes 200 live send API requests once per account.";

export const PRICING_BILLING_LEGAL_NOTE =
  "Paid subscriptions are non-refundable. Cancel anytime and keep paid plan benefits through the end of your current billing period.";

export const PRICING_CONTACT_NOTE = {
  headline: "Need more gateways or volume?",
  body: "Contact us for custom arrangements — we do not publish an Enterprise tier.",
  email: LANDING_SUPPORT_EMAIL,
};

export type FormattedPlanPrice = {
  amount: string;
  period: string;
  alternate: string;
  compareAt?: string;
  savingsLabel?: string;
  effectiveMonthly?: string;
};

export function formatPlanPrice(
  plan: PricingPlan,
  currency: PricingCurrency,
  billing: PricingBillingPeriod = "monthly",
): FormattedPlanPrice {
  if (plan.pricePhp === 0) {
    return {
      amount: currency === "php" ? "₱0" : "$0",
      period: plan.priceNote,
      alternate: currency === "php" ? "$0 USD" : "₱0 PHP",
    };
  }

  if (billing === "annual") {
    const annualPhp = annualPricePhp(plan.pricePhp);
    const comparePhp = plan.pricePhp * 12;
    const savingsPhp = annualSavingsPhp(plan.pricePhp);
    const effectiveMonthlyPhp = Math.round(annualPhp / 12);
    const annualUsd = annualPriceUsd(plan.priceUsd);
    const compareUsd = plan.priceUsd * 12;
    const savingsUsd = annualSavingsUsd(plan.priceUsd);
    const effectiveMonthlyUsd = annualUsd / 12;

    if (currency === "php") {
      return {
        amount: formatMoneyPhp(annualPhp),
        period: "per year",
        alternate: `${formatMoneyUsd(annualUsd)}/yr USD`,
        compareAt: formatMoneyPhp(comparePhp),
        savingsLabel: `Save ${formatMoneyPhp(savingsPhp)} · ${ANNUAL_BILLING_FREE_MONTHS} months free`,
        effectiveMonthly: `${formatMoneyPhp(effectiveMonthlyPhp)}/mo billed annually`,
      };
    }

    return {
      amount: formatMoneyUsd(annualUsd),
      period: "per year",
      alternate: `${formatMoneyPhp(annualPhp)}/yr PHP`,
      compareAt: formatMoneyUsd(compareUsd),
      savingsLabel: `Save ${formatMoneyUsd(savingsUsd)} · ${ANNUAL_BILLING_FREE_MONTHS} months free`,
      effectiveMonthly: `${formatMoneyUsd(effectiveMonthlyUsd)}/mo billed annually`,
    };
  }

  const annualPhp = annualPricePhp(plan.pricePhp);
  const annualUsd = annualPriceUsd(plan.priceUsd);

  if (currency === "php") {
    return {
      amount: formatMoneyPhp(plan.pricePhp),
      period: "per month",
      alternate: `${formatMoneyUsd(plan.priceUsd)}/mo USD`,
      savingsLabel: `or ${formatMoneyPhp(annualPhp)}/yr (${ANNUAL_BILLING_FREE_MONTHS} months free)`,
    };
  }

  return {
    amount: formatMoneyUsd(plan.priceUsd),
    period: "per month",
    alternate: `${formatMoneyPhp(plan.pricePhp)}/mo PHP`,
    savingsLabel: `or ${formatMoneyUsd(annualUsd)}/yr (${ANNUAL_BILLING_FREE_MONTHS} months free)`,
  };
}

export function pricingComparisonRows(billing: PricingBillingPeriod) {
  const feeLabel = billing === "annual" ? "Annual platform fee" : "Monthly platform fee";
  const planFee = (id: Exclude<PricingPlanId, "free">) => {
    const plan = PRICING_PLANS.find((item) => item.id === id);
    const monthly = plan?.pricePhp ?? 0;
    return billing === "annual" ? formatMoneyPhp(annualPricePhp(monthly)) : formatMoneyPhp(monthly);
  };

  const rows: Array<{
    feature: string;
    free: PricingComparisonCell;
    starter: PricingComparisonCell;
    plus: PricingComparisonCell;
    pro: PricingComparisonCell;
  }> = [
    { feature: feeLabel, free: "₱0", starter: planFee("starter"), plus: planFee("plus"), pro: planFee("pro") },
    { feature: "Android gateways", free: "1", starter: "1", plus: "2", pro: "3" },
    { feature: "Live send API requests", free: "200 (one-time)", starter: "5,000 / month", plus: "11,000 / month", pro: "22,500 / month" },
    { feature: "Daily sends per gateway", free: "200", starter: "200", plus: "225", pro: "250" },
    { feature: "Sends per minute per gateway", free: "2", starter: "2", plus: "2", pro: "2" },
    { feature: "Sandbox + live environments", free: "yes", starter: "yes", plus: "yes", pro: "yes" },
    { feature: "OTP API", free: "yes", starter: "yes", plus: "yes", pro: "yes" },
    { feature: "Transactional API", free: "yes", starter: "yes", plus: "yes", pro: "yes" },
    { feature: "Webhooks", free: "yes", starter: "yes", plus: "yes", pro: "yes" },
    { feature: "Marketing & burst API", free: "no", starter: "no", plus: "no", pro: "yes" },
    { feature: "Two-way SMS (inbound)", free: "soon", starter: "soon", plus: "soon", pro: "soon" },
    { feature: "Transactional templates", free: "Up to 3", starter: "Up to 10", plus: "Up to 25", pro: "Unlimited" },
    { feature: "Message log retention", free: "7 days", starter: "30 days", plus: "90 days", pro: "180 days" },
    { feature: "Support", free: "Community", starter: "Email", plus: "Email", pro: "Priority email" },
  ];

  if (billing === "annual") {
    rows.splice(1, 0, {
      feature: "Annual savings vs monthly",
      free: "—",
      starter: `2 months free (${formatMoneyPhp(annualSavingsPhp(499))})`,
      plus: `2 months free (${formatMoneyPhp(annualSavingsPhp(799))})`,
      pro: `2 months free (${formatMoneyPhp(annualSavingsPhp(1299))})`,
    });
  }

  return rows;
}

/** @deprecated Use pricingComparisonRows(billing) for billing-aware tables. */
export const PRICING_COMPARISON_ROWS = pricingComparisonRows("monthly");

/** Toggle pricing section and nav links on the landing page. */
export const SHOW_LANDING_PRICING = true;

/** Toggle documentation section and nav links on the landing page. */
export const SHOW_LANDING_DOCUMENTATION = true;

const LANDING_NAV_ITEMS_ALL = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "About", href: "/#about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Documentation", href: "/docs" },
] as const;

export const LANDING_NAV_ITEMS = LANDING_NAV_ITEMS_ALL.filter((item) => {
  if (!SHOW_LANDING_PRICING && item.href === "/pricing") return false;
  if (!SHOW_LANDING_DOCUMENTATION && item.href === "/docs") return false;
  return true;
});

export const LANDING_FEATURES = [
  {
    title: "OTP, transactional & burst APIs",
    text: "Purpose-built endpoints for verification codes, account updates, and high-volume campaigns — all through one REST API.",
  },
  {
    title: "Transactional templates",
    text: "Create reusable templates for order updates, payment receipts, and account alerts, then send them through one API.",
  },
  {
    title: "Webhooks and message logs",
    text: "Subscribe to delivery and inbound events, and inspect every message from queue to receipt in the dashboard.",
  },
  {
    title: "Hosted dashboard",
    text: "Monitor gateways, track OTP and send activity, review message history, and manage API keys from one console.",
  },
] as const;

export const LANDING_DOC_GUIDES = [
  {
    label: "Start here",
    title: "Introduction",
    summary: "Base URL, authentication, environments, and the full article index.",
    href: "/docs",
  },
  {
    label: "Verification",
    title: "OTP API",
    summary: "Send codes with TTL and attempt limits, verify from your backend, and handle sandbox behavior.",
    href: "/docs/otp",
  },
  {
    label: "Templates",
    title: "Transactional SMS",
    summary: "Create templates, send order updates and alerts, and track delivery from one API.",
    href: "/docs/transactional",
  },
  {
    label: "Messaging",
    title: "Messages API",
    summary: "Send SMS, poll delivery status, and handle inbound replies from your gateways.",
    href: "/docs/messages",
  },
  {
    label: "Events",
    title: "Webhooks",
    summary: "Subscribe to delivery and inbound events with HMAC-verified HTTPS payloads.",
    href: "/docs/webhooks",
  },
  {
    label: "Platform",
    title: "Android gateways",
    summary: "Pair phones, keep your fleet online, and route outbound SMS through your SIMs.",
    href: "/docs/gateways",
  },
  {
    label: "Setup",
    title: "Connect a gateway",
    summary: "Step-by-step: install the app, pair with the dashboard QR, and go Online.",
    href: "/docs/connect-gateway",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Join the early cohort",
    text: "Tell us your SMS use case, rollout timing, and whether you want beta access.",
  },
  {
    step: "02",
    title: "Pair your Android phone",
    text: "Install the app, scan the QR code, and connect your SIM as a gateway.",
  },
  {
    step: "03",
    title: "Send from your backend",
    text: "Call the REST API or CLI for OTP, transactional, or bulk SMS. OpenSMS routes each message to your phone.",
  },
  {
    step: "04",
    title: "Track every delivery",
    text: "Follow queued, sent, delivered, failed, and inbound events from the dashboard or webhooks.",
  },
] as const;

export const USE_CASES = [
  {
    eyebrow: "OTP verification",
    title: "Get more users past sign-up",
    text: "Deliver one-time codes that actually arrive, so fewer users stall at verification. Built-in TTL, attempt limits, and a verify endpoint keep your login and checkout flows moving.",
    result: "Higher OTP completion",
    href: "/docs/otp",
    cta: "See OTP API",
  },
  {
    eyebrow: "Transactional SMS",
    title: "Keep customers informed and trusting you",
    text: "Send order confirmations, payment receipts, and account alerts the moment they happen. Reusable templates and delivery tracking keep every critical message consistent and accountable.",
    result: "Dependable delivery",
    href: "/docs/transactional",
    cta: "See transactional API",
  },
  {
    eyebrow: "Burst texts",
    title: "Reach your whole list for less",
    text: "Run promos, announcements, and campaigns at scale through your own SIMs — no per-message API markup. Pay your carrier directly and keep more margin on every send.",
    result: "Lower cost per message",
    href: "/docs",
    cta: "See burst sending",
  },
  {
    eyebrow: "Two-way replies",
    title: "Turn replies into automated workflows",
    text: "Capture inbound replies on your gateways and forward them straight to your app via webhooks. Trigger confirmations, opt-outs, and support handoffs without manual monitoring.",
    result: "Hands-off inbound",
    href: "/docs",
    cta: "See webhooks",
  },
] as const;

export const LANDING_FAQ = [
  {
    question: "What do I need to get started?",
    answer:
      "Join early access, share your use case, and we will prioritize rollout waves based on fit and readiness. Qualified teams get onboarding support before self-serve signup opens.",
  },
  {
    question: "What happens if my Android gateway goes offline?",
    answer:
      "Messages stay queued until a healthy gateway with an active SIM is available. The dashboard shows gateway heartbeat status, battery, and network so you can see which phones can accept work. Optional provider fallback can be configured if you need a backup route.",
  },
  {
    question: "Is OpenSMS compliant for SMS in my country?",
    answer:
      "You are responsible for consent, message content, and carrier rules wherever you send. OpenSMS provides routing infrastructure and tooling — review our Terms of Service and ensure your use case meets applicable telecom and privacy requirements in each market before messaging end users.",
  },
  {
    question: "How does pricing work?",
    answer:
      "OpenSMS is a flat monthly platform fee — you pay your carrier directly for SMS. We do not sell SMS credits; plans include live send API request allowances. Free includes 200 requests once; Starter is ₱499/month (5,000 requests, 1 gateway); Plus is ₱799/month (11,000 requests, 2 gateways, 90-day logs); Pro is ₱1,299/month (22,500 requests, 3 gateways, 180-day logs). Marketing sends are Pro-only.",
  },
  {
    question: "Can I test without sending live SMS?",
    answer:
      "Yes. Use sandbox mode in the dashboard and API to exercise OTP, transactional, and send flows with isolated records before switching requests to live traffic.",
  },
] as const;
