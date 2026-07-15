import { useEffect, useState } from "react";
import { Download, ExternalLink, Smartphone } from "lucide-react";
import {
  GATEWAY_APK_DOWNLOAD_URL,
  GATEWAY_APK_FILENAME,
  GATEWAY_TWO_WAY_APK_DOWNLOAD_URL,
  GATEWAY_TWO_WAY_APK_FILENAME,
} from "../../landing/content";
import { ArticleHero, InfoTable, PUBLIC_API_BASE_URL, StepCards, WarningNote } from "../shared";

type GatewayRelease = {
  flavor: string;
  version_name: string;
  version_code: number;
  supports_inbound: boolean;
  artifact?: string;
  download_path: string;
  download_filename?: string;
  notes?: string;
};

type ChangelogEntry = {
  date: string;
  version_name: string;
  version_code: number;
  flavor?: string;
  changes: string[];
};

type GatewayVersionCatalog = {
  display_name?: string;
  app_id?: string;
  updated_at?: string;
  channel?: string;
  min_sdk?: number;
  target_sdk?: number;
  releases?: {
    standard?: GatewayRelease;
    two_way?: GatewayRelease;
  };
  changelog?: ChangelogEntry[];
  logging?: {
    support_hint?: string;
    fields?: string[];
  };
};

const VERSION_CATALOG_URL = "/gateway-version.json";

const FALLBACK_CATALOG: GatewayVersionCatalog = {
  display_name: "OpenSMS Gateway",
  app_id: "com.opensms.gateway",
  channel: "sideload",
  releases: {
    standard: {
      flavor: "standard",
      version_name: "1.0.0-standard",
      version_code: 5010,
      supports_inbound: false,
      download_path: GATEWAY_APK_DOWNLOAD_URL,
      download_filename: GATEWAY_APK_FILENAME,
      notes: "Send-only gateway for OTP, transactional, and marketing outbound.",
    },
    two_way: {
      flavor: "twoWay",
      version_name: "1.0.0-two-way",
      version_code: 5020,
      supports_inbound: true,
      download_path: GATEWAY_TWO_WAY_APK_DOWNLOAD_URL,
      download_filename: GATEWAY_TWO_WAY_APK_FILENAME,
      notes: "Send + forward new inbound replies. Requires two-way signed build and RECEIVE_SMS.",
    },
  },
  changelog: [
    {
      date: "2026-07-11",
      version_name: "1.0.0-standard",
      version_code: 5010,
      flavor: "standard",
      changes: [
        "Initial public sideload build of the OpenSMS Android gateway.",
        "Google sign-in, QR pairing, foreground service, and outbound SMS.",
      ],
    },
  ],
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function AndroidAppArticle() {
  const [catalog, setCatalog] = useState<GatewayVersionCatalog>(FALLBACK_CATALOG);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(VERSION_CATALOG_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`status ${response.status}`);
        const data = (await response.json()) as GatewayVersionCatalog;
        if (!cancelled) {
          setCatalog({ ...FALLBACK_CATALOG, ...data, releases: { ...FALLBACK_CATALOG.releases, ...data.releases } });
          setLoadState("ready");
        }
      } catch {
        if (!cancelled) {
          setCatalog(FALLBACK_CATALOG);
          setLoadState("fallback");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const standard = catalog.releases?.standard;
  const twoWay = catalog.releases?.two_way;
  const changelog = catalog.changelog?.length ? catalog.changelog : FALLBACK_CATALOG.changelog ?? [];

  return (
    <article>
      <section id="overview">
        <ArticleHero
          eyebrow="Android app"
          title="OpenSMS Gateway for Android"
          description="Download the official gateway APK, review current version numbers, and follow the install and pairing flow. This page is the public home for app releases and version notes."
          baseUrl={PUBLIC_API_BASE_URL}
        />
        <p className="text-sm text-muted-foreground">
          Package <code className="font-mono text-foreground">{catalog.app_id ?? "com.opensms.gateway"}</code>
          {catalog.updated_at ? (
            <>
              {" "}
              · Catalog updated {formatDate(catalog.updated_at)}
            </>
          ) : null}
          {loadState === "fallback" ? " · Showing built-in version info (catalog fetch failed)." : null}
        </p>
      </section>

      <section id="download">
        <h2>Download</h2>
        <p>
          Install the APK on the Android phone that will send SMS. Use the <strong>standard</strong> build for outbound-only
          gateways (OTP, transactional, marketing). Use <strong>two-way</strong> only when you need inbound SMS forwarding.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {standard ? (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">Recommended</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">Standard (send-only)</h3>
                </div>
                <Smartphone className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{standard.notes}</p>
              <InfoTable
                headers={["Field", "Value"]}
                rows={[
                  ["versionName", standard.version_name],
                  ["versionCode", String(standard.version_code)],
                  ["Inbound SMS", standard.supports_inbound ? "Yes" : "No"],
                ]}
              />
              <a
                href={standard.download_path || GATEWAY_APK_DOWNLOAD_URL}
                download={standard.download_filename || GATEWAY_APK_FILENAME}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                <Download className="h-4 w-4" />
                Download APK
              </a>
            </div>
          ) : null}

          {twoWay ? (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Optional</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">Two-way</h3>
                </div>
                <Smartphone className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{twoWay.notes}</p>
              <InfoTable
                headers={["Field", "Value"]}
                rows={[
                  ["versionName", twoWay.version_name],
                  ["versionCode", String(twoWay.version_code)],
                  ["Inbound SMS", twoWay.supports_inbound ? "Yes" : "No"],
                ]}
              />
              <a
                href={twoWay.download_path || GATEWAY_TWO_WAY_APK_DOWNLOAD_URL}
                download={twoWay.download_filename || GATEWAY_TWO_WAY_APK_FILENAME}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50"
              >
                <Download className="h-4 w-4" />
                Download two-way APK
              </a>
              <WarningNote title="Permissions">
                Two-way requires <code className="font-mono">RECEIVE_SMS</code>. Both flavors share package id{" "}
                <code className="font-mono">com.opensms.gateway</code> — only one can be installed at a time.
              </WarningNote>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
              <h3 className="text-lg font-semibold text-foreground">Two-way build</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The two-way APK is published when a signed build is available on this host. Check back on this page or use the
                version catalog JSON below.
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Machine-readable catalog:{" "}
          <a href={VERSION_CATALOG_URL} className="font-medium text-brand hover:underline" target="_blank" rel="noreferrer">
            /gateway-version.json
          </a>
        </p>
      </section>

      <section id="version-log">
        <h2>Version log</h2>
        <p>Release notes for public sideload builds. Bump both Gradle version fields and the version catalog when shipping.</p>
        <div className="mt-4 space-y-4">
          {changelog.map((entry) => (
            <div key={`${entry.version_code}-${entry.date}`} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {entry.version_name}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({entry.version_code})</span>
                </h3>
                <time className="text-sm text-muted-foreground" dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
              </div>
              {entry.flavor ? (
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{entry.flavor}</p>
              ) : null}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                {entry.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="install">
        <h2>Install &amp; pair</h2>
        <StepCards
          steps={[
            ["1", "Install", "Sideload the APK (allow install from browser/file manager if prompted)."],
            ["2", "Sign in", "Open the app and sign in with the same Google account as your OpenSMS dashboard."],
            ["3", "Pair", "Dashboard → Gateways → generate pairing code → scan QR (expires in 15 minutes)."],
            ["4", "Start", "Grant SMS, phone, and notification permissions, then Start gateway."],
          ]}
        />
        <p className="mt-6 text-sm leading-7 text-muted-foreground">
          Detailed dashboard walkthrough:{" "}
          <a href="/docs/connect-gateway" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
            Connect a gateway
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          . Fleet operations and API contract:{" "}
          <a href="/docs/gateways" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
            Gateways documentation
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          .
        </p>
      </section>

      <section id="support-logs">
        <h2>In-app version logs (support)</h2>
        <p>
          The app keeps a local event log for troubleshooting. When reporting issues, include{" "}
          <code className="font-mono text-foreground">version_name</code>,{" "}
          <code className="font-mono text-foreground">version_code</code>, flavor, and recent Monitor events.
        </p>
        {catalog.logging?.fields?.length ? (
          <InfoTable
            headers={["Event field", "Purpose"]}
            rows={catalog.logging.fields.map((field) => [
              field,
              field === "version_name" || field === "version_code"
                ? "App build identity — always include for support."
                : field === "category" || field === "title" || field === "detail"
                  ? "What happened on the device."
                  : "Captured with each event.",
            ])}
          />
        ) : null}
        {catalog.logging?.support_hint ? (
          <WarningNote title="Support tip">{catalog.logging.support_hint}</WarningNote>
        ) : null}
      </section>

      <section id="requirements">
        <h2>Requirements</h2>
        <InfoTable
          headers={["Item", "Detail"]}
          rows={[
            ["Min Android SDK", String(catalog.min_sdk ?? 24)],
            ["Target SDK", String(catalog.target_sdk ?? 36)],
            ["Channel", catalog.channel ?? "sideload"],
            ["Production API", PUBLIC_API_BASE_URL],
            ["Pairing", "QR / deep link via dashboard (15 minute TTL)"],
          ]}
        />
      </section>
    </article>
  );
}
