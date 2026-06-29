import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { OpenSMSLogo } from "./components/OpenSMSLogo";
import { defaultEnvironmentFromHost, navigateToEnvironment, shouldRedirectEnvironment } from "./lib/environment";
import { getApiBaseUrl } from "./lib/api";

type Environment = "live" | "sandbox";
type DocsTopic = "home" | "otp" | "transactional";

const environmentPages: { id: Environment; label: string; detail: string }[] = [
  { id: "sandbox", label: "Sandbox", detail: "Real Android gateways with isolated sandbox data" },
  { id: "live", label: "Live", detail: "Real Android gateways and production data" },
];

const docsTopics: Array<{ id: DocsTopic; label: string; path: string; summary: string }> = [
  { id: "home", label: "Introduction", path: "/docs", summary: "Overview, base URL, and article index." },
  { id: "otp", label: "OTP", path: "/docs/otp", summary: "OTP send, verify, widget, and environment behavior." },
  { id: "transactional", label: "Transactional", path: "/docs/transactional", summary: "Template lifecycle, template-based sends, and backend integration." },
];

function docsPath(topic: DocsTopic) {
  return docsTopics.find((item) => item.id === topic)?.path || "/docs";
}

function resolveDocsTopic(pathname: string): DocsTopic {
  if (pathname.startsWith("/docs/otp")) return "otp";
  if (pathname.startsWith("/docs/transactional")) return "transactional";
  return "home";
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-border bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{title}</p>
        <button onClick={copyCode} className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-label transition hover:border-border hover:bg-white">
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-3 max-h-[420px] overflow-auto rounded-[18px] border border-border bg-surface p-4 text-[12px] leading-6 text-[#1F2937]"><code className="block min-w-max font-mono">{code}</code></pre>
    </div>
  );
}

function TopicLink({
  topic,
  label,
  navigate,
  className,
}: {
  topic: DocsTopic;
  label: string;
  navigate: (topic: DocsTopic) => void;
  className: string;
}) {
  return (
    <a
      href={docsPath(topic)}
      onClick={(event) => {
        event.preventDefault();
        navigate(topic);
      }}
      className={className}
    >
      {label}
    </a>
  );
}

function DocsHomeArticle({ environment, navigate }: { environment: Environment; navigate: (topic: DocsTopic) => void }) {
  const apiOrigin = getApiBaseUrl();

  return (
    <article className="pb-20">
      <section className="border-b border-border pb-10">
        <p className="text-[13px] font-semibold text-brand">OpenSMS API</p>
        <h1 className="mt-3 text-[44px] font-bold leading-[1.04] tracking-[-0.06em] text-foreground">Messaging docs</h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-8 text-muted-foreground">
          Provider-style SMS APIs for OTP and transactional messaging, backed by paired Android phones acting as real gateways.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">Base URL</p>
          <code className="mt-1 block break-all font-mono text-[14px] font-semibold text-foreground">{apiOrigin}</code>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Articles</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {docsTopics.filter((topic) => topic.id !== "home").map((topic) => (
            <a
              key={topic.id}
              href={topic.path}
              onClick={(event) => {
                event.preventDefault();
                navigate(topic.id);
              }}
              className="rounded-[24px] border border-border bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">{topic.label}</p>
              <h3 className="mt-3 text-[24px] font-bold tracking-[-0.04em] text-foreground">{topic.label}</h3>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">{topic.summary}</p>
              <div className="mt-5 inline-flex rounded-xl border border-border bg-surface px-3 py-2 text-[13px] font-semibold text-foreground">
                Open article
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-10">
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Environment behavior</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="grid border-b border-black/[0.06] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-[160px_1fr_1fr]">
            <span>Mode</span>
            <span>SMS delivery</span>
            <span>Data isolation</span>
          </div>
          <div className="grid gap-2 border-b border-black/[0.06] px-4 py-4 sm:grid-cols-[160px_1fr_1fr]">
            <p className="font-semibold text-warning-emphasis">Sandbox</p>
            <p className="text-[14px] text-muted-foreground">Routes real SMS through sandbox-only Android gateways.</p>
            <p className="text-[14px] text-muted-foreground">Sandbox records stay isolated from live traffic.</p>
          </div>
          <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_1fr_1fr]">
            <p className="font-semibold text-success-emphasis">Live</p>
            <p className="text-[14px] text-muted-foreground">Routes real SMS through online live gateways.</p>
            <p className="text-[14px] text-muted-foreground">Live records stay isolated from sandbox traffic.</p>
          </div>
        </div>
        <p className="mt-4 text-[14px] text-muted-foreground">Current article environment: <span className="font-semibold text-foreground">{environment}</span></p>
      </section>
    </article>
  );
}

function OtpArticle({ environment }: { environment: Environment }) {
  const apiOrigin = getApiBaseUrl();
  const sendExample = [
    "curl -X POST " + apiOrigin + "/v1/otp/send \\",
    "  -H \"Content-Type: application/json\" \\",
    "  -H \"x-api-key: YOUR_" + environment.toUpperCase() + "_API_KEY\" \\",
    "  -d '{",
    "    \"to\": \"09518023980\",",
    "    \"brand\": \"YourApp\",",
    "    \"purpose\": \"login\",",
    "    \"ttl_seconds\": 300,",
    "    \"environment\": \"" + environment + "\"",
    "  }'",
  ].join("\n");
  const verifyExample = [
    "curl -X POST " + apiOrigin + "/v1/otp/verify \\",
    "  -H \"Content-Type: application/json\" \\",
    "  -H \"x-api-key: YOUR_" + environment.toUpperCase() + "_API_KEY\" \\",
    "  -d '{",
    "    \"otp_id\": \"otp_123\",",
    "    \"code\": \"123456\"",
    "  }'",
  ].join("\n");
  const nodeExample = [
    "export async function sendLoginOtp(user) {",
    "  const response = await fetch(\"" + apiOrigin + "/v1/otp/send\", {",
    "    method: \"POST\",",
    "    headers: {",
    "      \"Content-Type\": \"application/json\",",
    "      \"x-api-key\": process.env.OPENSMS_API_KEY",
    "    },",
    "    body: JSON.stringify({",
    "      to: user.phone,",
    "      brand: \"YourApp\",",
    "      purpose: \"login\",",
    "      ttl_seconds: 300,",
    "      environment: \"" + environment + "\"",
    "    })",
    "  });",
    "",
    "  const payload = await response.json();",
    "  if (payload.status !== \"success\") throw new Error(payload.message);",
    "  return payload.data.otp.id;",
    "}",
    "",
    "export async function verifyLoginOtp(otpId, code) {",
    "  const response = await fetch(\"" + apiOrigin + "/v1/otp/verify\", {",
    "    method: \"POST\",",
    "    headers: {",
    "      \"Content-Type\": \"application/json\",",
    "      \"x-api-key\": process.env.OPENSMS_API_KEY",
    "    },",
    "    body: JSON.stringify({ otp_id: otpId, code })",
    "  });",
    "",
    "  return response.json();",
    "}",
  ].join("\n");
  const widgetNodeProxyExample = [
    "import express from \"express\";",
    "",
    "const app = express();",
    "app.use(express.json());",
    "",
    "app.post(\"/otp/start\", async (req, res) => {",
    "  const { phone, purpose, environment } = req.body;",
    "  const response = await fetch(\"" + apiOrigin + "/v1/otp/send\", {",
    "    method: \"POST\",",
    "    headers: {",
    "      \"Content-Type\": \"application/json\",",
    "      \"x-api-key\": process.env.OPENSMS_API_KEY",
    "    },",
    "    body: JSON.stringify({",
    "      to: phone,",
    "      brand: \"YourApp\",",
    "      purpose: purpose || \"login\",",
    "      ttl_seconds: 300,",
    "      environment: environment || \"" + environment + "\"",
    "    })",
    "  });",
    "  const payload = await response.json();",
    "  if (!response.ok || payload.status !== \"success\") return res.status(400).json(payload);",
    "  res.json({ otp_id: payload.data.otp.id, expires_at: payload.data.otp.expires_at });",
    "});",
    "",
    "app.post(\"/otp/verify\", async (req, res) => {",
    "  const { otp_id, code, environment } = req.body;",
    "  const response = await fetch(\"" + apiOrigin + "/v1/otp/verify\", {",
    "    method: \"POST\",",
    "    headers: {",
    "      \"Content-Type\": \"application/json\",",
    "      \"x-api-key\": process.env.OPENSMS_API_KEY",
    "    },",
    "    body: JSON.stringify({ otp_id, code, environment: environment || \"" + environment + "\" })",
    "  });",
    "  const payload = await response.json();",
    "  if (!response.ok) return res.status(400).json(payload);",
    "  res.json({",
    "    status: payload.data?.otp?.status || payload.data?.status || payload.status,",
    "    verified_at: payload.data?.otp?.verified_at || payload.data?.verified_at",
    "  });",
    "});",
  ].join("\n");
  const widgetLaravelProxyExample = [
    "use Illuminate\\Http\\Request;",
    "use Illuminate\\Support\\Facades\\Http;",
    "use Illuminate\\Support\\Facades\\Route;",
    "",
    "Route::post('/otp/start', function (Request $request) {",
    "    $payload = Http::withHeaders([",
    "        'x-api-key' => env('OPENSMS_API_KEY'),",
    "    ])->post('" + apiOrigin + "/v1/otp/send', [",
    "        'to' => $request->input('phone'),",
    "        'brand' => 'YourApp',",
    "        'purpose' => $request->input('purpose', 'login'),",
    "        'ttl_seconds' => 300,",
    "        'environment' => $request->input('environment', '" + environment + "'),",
    "    ])->json();",
    "",
    "    return response()->json([",
    "        'otp_id' => data_get($payload, 'data.otp.id'),",
    "        'expires_at' => data_get($payload, 'data.otp.expires_at'),",
    "    ]);",
    "});",
    "",
    "Route::post('/otp/verify', function (Request $request) {",
    "    $payload = Http::withHeaders([",
    "        'x-api-key' => env('OPENSMS_API_KEY'),",
    "    ])->post('" + apiOrigin + "/v1/otp/verify', [",
    "        'otp_id' => $request->input('otp_id'),",
    "        'code' => $request->input('code'),",
    "        'environment' => $request->input('environment', '" + environment + "'),",
    "    ])->json();",
    "",
    "    return response()->json([",
    "        'status' => data_get($payload, 'data.otp.status', data_get($payload, 'status')),",
    "        'verified_at' => data_get($payload, 'data.otp.verified_at'),",
    "    ]);",
    "});",
  ].join("\n");
  const widgetEmbedExample = [
    "<script src=\"https://YOUR_OPENSMS_DOMAIN/opensms-otp-widget.js\"></script>",
    "",
    "<opensms-otp-widget",
    "  start-url=\"https://yourapp.com/otp/start\"",
    "  verify-url=\"https://yourapp.com/otp/verify\"",
    "  brand=\"YourApp\"",
    "  purpose=\"login\"",
    "  environment=\"" + environment + "\"",
    "  logo-url=\"https://YOUR_OPENSMS_DOMAIN/favicon.svg\"",
    "  accent-color=\"#24AEE4\"",
    "  resend-seconds=\"60\">",
    "</opensms-otp-widget>",
    "",
    "<script>",
    "  document.addEventListener(\"opensms:otp-verified\", (event) => {",
    "    console.log(\"Verified OTP\", event.detail);",
    "  });",
    "</script>",
  ].join("\n");

  return (
    <article className="pb-20">
      <section id="overview" className="scroll-mt-28 border-b border-border pb-10">
        <p className="text-[13px] font-semibold text-brand">OTP</p>
        <h1 className="mt-3 text-[44px] font-bold leading-[1.04] tracking-[-0.06em] text-foreground">OTP API</h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-8 text-muted-foreground">
          Send and verify one-time passwords from your own backend while your paired Android gateway handles SMS delivery.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">Base URL</p>
          <code className="mt-1 block break-all font-mono text-[14px] font-semibold text-foreground">{apiOrigin}</code>
        </div>
      </section>

      <section id="otp" className="scroll-mt-28 border-b border-border py-10">
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Flow</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground">
          Treat OTP as one server-side flow: authenticate your backend, create a challenge, then verify the code your user submits. The browser or mobile client should never hold the OpenSMS secret key.
        </p>
        <div className="mt-6 overflow-hidden rounded-[24px] border border-border bg-white">
          {[
            ["Header", "x-api-key", "Required for API requests outside the dashboard."],
            ["Content type", "application/json", "All request bodies are JSON."],
            ["Environment", environment, environment === "sandbox" ? "Sandbox uses isolated data and still routes real SMS through sandbox gateways." : "Live uses production data and real SMS routing."],
          ].map(([name, value, detail]) => (
            <div key={name} className="grid gap-2 border-b border-black/[0.06] px-4 py-3 last:border-b-0 sm:grid-cols-[150px_1fr]">
              <p className="text-[13px] font-semibold text-foreground">{name}</p>
              <div>
                <code className="font-mono text-[13px] text-label">{value}</code>
                <p className="mt-1 text-[13px] text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Create challenge", "Call /v1/otp/send from your backend when you want to deliver an OTP."],
            ["2", "Collect code", "Your client app asks the user for the 6-digit code received by SMS."],
            ["3", "Verify code", "Your backend calls /v1/otp/verify and decides what to do next."],
          ].map(([step, title, detail]) => (
            <div key={title} className="rounded-[22px] border border-border bg-white p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF8FD] text-[13px] font-bold text-[#24AEE4]">{step}</span>
              <h3 className="mt-3 text-[16px] font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div id="send-otp" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[24px] border border-border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-bold tracking-[-0.03em] text-foreground">Send request</h3>
              <code className="rounded-xl bg-success-muted px-3 py-2 font-mono text-[12px] font-semibold text-success-emphasis">POST /v1/otp/send</code>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["to", "string", "Recipient phone number."],
                ["brand", "string", "Product or company name shown in the SMS."],
                ["purpose", "string", "Use case label such as login or checkout."],
                ["ttl_seconds", "number", "Code lifetime. Defaults to 300 seconds."],
                ["environment", "sandbox | live", "Target environment."],
              ].map(([field, type, detail]) => (
                <div key={field} className="border-b border-black/[0.06] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[13px] font-semibold text-foreground">{field}</code>
                    <span className="text-[12px] text-subtle-foreground">{type}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock title="cURL" code={sendExample} />
        </div>

        <div id="verify-otp" className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[24px] border border-border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-bold tracking-[-0.03em] text-foreground">Verify request</h3>
              <code className="rounded-xl bg-success-muted px-3 py-2 font-mono text-[12px] font-semibold text-success-emphasis">POST /v1/otp/verify</code>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["otp_id", "string", "ID returned by /v1/otp/send."],
                ["code", "string", "Code entered by the user."],
              ].map(([field, type, detail]) => (
                <div key={field} className="border-b border-black/[0.06] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[13px] font-semibold text-foreground">{field}</code>
                    <span className="text-[12px] text-subtle-foreground">{type}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock title="cURL" code={verifyExample} />
        </div>

        <div id="backend-proxy" className="mt-6 rounded-[24px] border border-border bg-white p-5">
          <h3 className="text-[18px] font-bold tracking-[-0.03em] text-foreground">Server proxy example</h3>
          <p className="mt-2 text-[14px] leading-7 text-muted-foreground">Your frontend calls your own backend. Your backend then calls OpenSMS with the secret API key.</p>
          <div className="mt-5">
            <CodeBlock title="Node.js" code={nodeExample} />
          </div>
        </div>
      </section>

      <section id="otp-widget" className="scroll-mt-28 border-b border-border py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Widget</h2>
            <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
              Add a polished OTP flow to any website with a browser script and a custom element. The widget calls your backend proxy, never OpenSMS directly.
            </p>
          </div>
          <code className="rounded-xl bg-[#EEF4FF] px-3 py-2 font-mono text-[13px] font-semibold text-brand">opensms-otp-widget</code>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-[15px] font-semibold text-foreground">Customize in code</h3>
            <p className="mt-2 text-[14px] leading-7 text-muted-foreground">
              The widget is customized through HTML attributes, so customers can version it with their app code. Use your own brand name, purpose, logo URL, accent color, endpoint URLs, optional prefilled phone, and resend cooldown.
            </p>
            <p className="mt-3 text-[14px] leading-7 text-muted-foreground">
              The phone selector is fixed to PH for this version. The widget always shows Powered by OpenSMS branding at the bottom for transparency and user trust.
            </p>
            <div className="mt-4 space-y-3">
              {[
                ["start-url", "Customer backend endpoint that starts the OTP challenge."],
                ["verify-url", "Customer backend endpoint that verifies the OTP code."],
                ["brand", "Name displayed inside the verification card."],
                ["purpose", "Use case label such as login or checkout."],
                ["phone", "Optional prefilled recipient phone number."],
                ["logo-url", "Optional customer logo. The sample uses the OpenSMS logo."],
                ["accent-color", "Primary button and focus color."],
                ["environment", "sandbox or live. Defaults to live."],
                ["resend-seconds", "Resend cooldown. Defaults to 60."],
              ].map(([field, detail]) => (
                <div key={field} className="border-b border-black/[0.06] pb-3 last:border-b-0 last:pb-0">
                  <code className="font-mono text-[13px] font-semibold text-foreground">{field}</code>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock title="Widget embed" code={widgetEmbedExample} />
        </div>

        <div className="mt-6 rounded-2xl border border-warning/25 bg-warning-muted p-4">
          <p className="text-[14px] font-semibold text-warning-emphasis">Security note</p>
          <p className="mt-2 text-[14px] leading-7 text-muted-foreground">
            Never expose <code className="font-mono text-foreground">x-api-key</code> in frontend code. The browser sends only phone, purpose, OTP ID, code, and environment to your backend.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="grid border-b border-black/[0.06] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-[170px_1fr_1fr]">
            <span>Endpoint</span>
            <span>Widget request</span>
            <span>Widget response</span>
          </div>
          <div className="grid gap-2 border-b border-black/[0.06] px-4 py-4 sm:grid-cols-[170px_1fr_1fr]">
            <code className="font-mono text-[13px] font-semibold text-foreground">POST /otp/start</code>
            <code className="font-mono text-[12px] text-muted-foreground">{"{ phone, purpose?, environment? }"}</code>
            <code className="font-mono text-[12px] text-muted-foreground">{"{ otp_id, expires_at }"}</code>
          </div>
          <div className="grid gap-2 px-4 py-4 sm:grid-cols-[170px_1fr_1fr]">
            <code className="font-mono text-[13px] font-semibold text-foreground">POST /otp/verify</code>
            <code className="font-mono text-[12px] text-muted-foreground">{"{ otp_id, code, environment? }"}</code>
            <code className="font-mono text-[12px] text-muted-foreground">{"{ status, verified_at? }"}</code>
          </div>
        </div>

        <div id="widget-proxy" className="mt-6 space-y-6">
          <CodeBlock title="Node/Express proxy" code={widgetNodeProxyExample} />
          <CodeBlock title="Laravel-style proxy" code={widgetLaravelProxyExample} />
        </div>

        <div id="widget-events" className="mt-6 rounded-2xl border border-border bg-white p-4">
          <h3 className="text-[15px] font-semibold text-foreground">Browser events</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["opensms:otp-sent", "Fires after the start endpoint returns an OTP ID."],
              ["opensms:otp-verified", "Fires after the verify endpoint returns verified."],
              ["opensms:otp-error", "Fires for validation, network, expired, and max-attempt states."],
            ].map(([name, detail]) => (
              <div key={name} className="rounded-2xl border border-border bg-surface p-4">
                <code className="font-mono text-[12px] font-semibold text-foreground">{name}</code>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="environments" className="scroll-mt-28 py-10">
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Sandbox and live behavior</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="grid border-b border-black/[0.06] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-[160px_1fr_1fr]">
            <span>Mode</span>
            <span>SMS delivery</span>
            <span>Code visibility</span>
          </div>
          <div className="grid gap-2 border-b border-black/[0.06] px-4 py-4 sm:grid-cols-[160px_1fr_1fr]">
            <p className="font-semibold text-warning-emphasis">Sandbox</p>
            <p className="text-[14px] text-muted-foreground">Routes real SMS through sandbox-only Android gateways and keeps logs isolated from live.</p>
            <p className="text-[14px] text-muted-foreground">Does not expose the OTP code in the API response.</p>
          </div>
          <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_1fr_1fr]">
            <p className="font-semibold text-success-emphasis">Live</p>
            <p className="text-[14px] text-muted-foreground">Routes a real SMS through an online Android gateway.</p>
            <p className="text-[14px] text-muted-foreground">Never returns the OTP code.</p>
          </div>
        </div>
      </section>
    </article>
  );
}

function TransactionalArticle({ environment }: { environment: Environment }) {
  const apiOrigin = getApiBaseUrl();
  const transactionalTemplateExample = [
    "curl -X POST " + apiOrigin + "/v1/transactional/templates \\",
    "  -H \"Content-Type: application/json\" \\",
    "  -H \"x-api-key: YOUR_" + environment.toUpperCase() + "_API_KEY\" \\",
    "  -d '{",
    "    \"name\": \"Order ready notice\",",
    "    \"content\": \"Hi {{name}}, your order {{order_id}} is ready for pickup.\",",
    "    \"environment\": \"" + environment + "\"",
    "  }'",
  ].join("\n");
  const transactionalSendExample = [
    "curl -X POST " + apiOrigin + "/v1/transactional/send \\",
    "  -H \"Content-Type: application/json\" \\",
    "  -H \"x-api-key: YOUR_" + environment.toUpperCase() + "_API_KEY\" \\",
    "  -d '{",
    "    \"template_id\": \"tpl_123\",",
    "    \"to\": \"09518023980\",",
    "    \"variables\": {",
    "      \"name\": \"Carlo\",",
    "      \"order_id\": \"A-1024\"",
    "    },",
    "    \"request_id\": \"order-ready-1024\",",
    "    \"environment\": \"" + environment + "\"",
    "  }'",
  ].join("\n");
  const transactionalNodeExample = [
    "export async function sendOrderReadyNotice(order) {",
    "  const response = await fetch(\"" + apiOrigin + "/v1/transactional/send\", {",
    "    method: \"POST\",",
    "    headers: {",
    "      \"Content-Type\": \"application/json\",",
    "      \"x-api-key\": process.env.OPENSMS_API_KEY",
    "    },",
    "    body: JSON.stringify({",
    "      template_id: process.env.OPENSMS_ORDER_READY_TEMPLATE_ID,",
    "      to: order.customerPhone,",
    "      variables: {",
    "        name: order.customerName,",
    "        order_id: order.reference",
    "      },",
    "      request_id: `order-ready-${order.reference}`,",
    "      environment: \"" + environment + "\"",
    "    })",
    "  });",
    "",
    "  return response.json();",
    "}",
  ].join("\n");

  return (
    <article className="pb-20">
      <section id="overview" className="scroll-mt-28 border-b border-border pb-10">
        <p className="text-[13px] font-semibold text-brand">Transactional</p>
        <h1 className="mt-3 text-[44px] font-bold leading-[1.04] tracking-[-0.06em] text-foreground">Transactional API</h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-8 text-muted-foreground">
          Define reusable SMS templates, activate the ones your customers should call, and send transactional messages by `template_id` plus named variables.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-white px-4 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle-foreground">Base URL</p>
          <code className="mt-1 block break-all font-mono text-[14px] font-semibold text-foreground">{apiOrigin}</code>
        </div>
      </section>

      <section id="transactional" className="scroll-mt-28 border-b border-border py-10">
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Flow</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground">
          Transactional messaging in OpenSMS is template-driven. Your account creates reusable templates, activates the ones that should be callable in production, and then sends SMS by passing a <code className="font-mono text-foreground">template_id</code>, a recipient, and named variables.
        </p>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-border bg-white">
          {[
            ["Template ID", "template_id", "Stable OpenSMS identifier for a reusable transactional template."],
            ["Request ID", "request_id", "Optional customer trace or idempotency-style reference for the send attempt."],
            ["Lifecycle", "draft -> active -> archived", "Only active templates should be used for live transactional sends."],
          ].map(([name, value, detail]) => (
            <div key={name} className="grid gap-2 border-b border-black/[0.06] px-4 py-3 last:border-b-0 sm:grid-cols-[150px_1fr]">
              <p className="text-[13px] font-semibold text-foreground">{name}</p>
              <div>
                <code className="font-mono text-[13px] text-label">{value}</code>
                <p className="mt-1 text-[13px] text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Create draft", "Create a template with placeholders like {{name}} and {{order_id}}."],
            ["2", "Activate template", "Move the template to active when it is ready for API callers to use."],
            ["3", "Send by template ID", "Call /v1/transactional/send with template_id, to, and variables."],
          ].map(([step, title, detail]) => (
            <div key={title} className="rounded-[22px] border border-border bg-white p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF8FD] text-[13px] font-bold text-[#24AEE4]">{step}</span>
              <h3 className="mt-3 text-[16px] font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div id="transactional-template-create" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[24px] border border-border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-bold tracking-[-0.03em] text-foreground">Create template</h3>
              <code className="rounded-xl bg-success-muted px-3 py-2 font-mono text-[12px] font-semibold text-success-emphasis">POST /v1/transactional/templates</code>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["name", "string", "Readable name for the dashboard and docs."],
                ["content", "string", "Template body with placeholders like {{name}}."],
                ["environment", "sandbox | live", "Target environment for the template record."],
              ].map(([field, type, detail]) => (
                <div key={field} className="border-b border-black/[0.06] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[13px] font-semibold text-foreground">{field}</code>
                    <span className="text-[12px] text-subtle-foreground">{type}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock title="cURL" code={transactionalTemplateExample} />
        </div>

        <div id="transactional-send" className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[24px] border border-border bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-bold tracking-[-0.03em] text-foreground">Send from template</h3>
              <code className="rounded-xl bg-success-muted px-3 py-2 font-mono text-[12px] font-semibold text-success-emphasis">POST /v1/transactional/send</code>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["template_id", "string", "OpenSMS template identifier copied from the dashboard."],
                ["to", "string", "Single recipient phone number."],
                ["variables", "object", "Named values for the placeholders declared by the template."],
                ["request_id", "string", "Optional customer trace reference."],
                ["environment", "sandbox | live", "Target environment."],
              ].map(([field, type, detail]) => (
                <div key={field} className="border-b border-black/[0.06] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[13px] font-semibold text-foreground">{field}</code>
                    <span className="text-[12px] text-subtle-foreground">{type}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock title="cURL" code={transactionalSendExample} />
        </div>

        <div id="transactional-backend-proxy" className="mt-6 rounded-[24px] border border-border bg-white p-5">
          <h3 className="text-[18px] font-bold tracking-[-0.03em] text-foreground">Server proxy example</h3>
          <p className="mt-2 text-[14px] leading-7 text-muted-foreground">Your application backend keeps the OpenSMS secret key and sends only template variables and recipient data to OpenSMS.</p>
          <div className="mt-5">
            <CodeBlock title="Node.js" code={transactionalNodeExample} />
          </div>
        </div>
      </section>

      <section id="environments" className="scroll-mt-28 py-10">
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-foreground">Sandbox and live behavior</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="grid border-b border-black/[0.06] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-[160px_1fr_1fr]">
            <span>Mode</span>
            <span>SMS delivery</span>
            <span>Template records</span>
          </div>
          <div className="grid gap-2 border-b border-black/[0.06] px-4 py-4 sm:grid-cols-[160px_1fr_1fr]">
            <p className="font-semibold text-warning-emphasis">Sandbox</p>
            <p className="text-[14px] text-muted-foreground">Routes real SMS through sandbox-only Android gateways.</p>
            <p className="text-[14px] text-muted-foreground">Sandbox templates and message logs stay isolated from live.</p>
          </div>
          <div className="grid gap-2 px-4 py-4 sm:grid-cols-[160px_1fr_1fr]">
            <p className="font-semibold text-success-emphasis">Live</p>
            <p className="text-[14px] text-muted-foreground">Routes real SMS through online live gateways.</p>
            <p className="text-[14px] text-muted-foreground">Live templates and message logs stay isolated from sandbox.</p>
          </div>
        </div>
      </section>
    </article>
  );
}

function DocsNavigation({
  topic,
  navigate,
}: {
  topic: DocsTopic;
  navigate: (topic: DocsTopic) => void;
}) {
  return (
    <nav className="sticky top-28">
      <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">OpenSMS Docs</p>
      {docsTopics.map((item) => (
        <TopicLink
          key={item.id}
          topic={item.id}
          label={item.label}
          navigate={navigate}
          className={`block rounded-xl px-3 py-2 text-[14px] font-medium transition ${topic === item.id ? "bg-white text-foreground shadow-[0_8px_24px_rgba(15,23,42,0.06)]" : "text-muted-foreground hover:bg-white hover:text-foreground"}`}
        />
      ))}
    </nav>
  );
}

function OnThisPage({
  topic,
  navigate,
  onHome,
}: {
  topic: DocsTopic;
  navigate: (topic: DocsTopic) => void;
  onHome: () => void;
}) {
  const links: Array<[string, string]> =
    topic === "otp"
      ? [
          ["Overview", "#overview"],
          ["Flow", "#otp"],
          ["Send request", "#send-otp"],
          ["Verify request", "#verify-otp"],
          ["Server proxy", "#backend-proxy"],
          ["Widget", "#otp-widget"],
          ["Widget proxy", "#widget-proxy"],
          ["Widget events", "#widget-events"],
          ["Environments", "#environments"],
        ]
      : topic === "transactional"
        ? [
            ["Overview", "#overview"],
            ["Flow", "#transactional"],
            ["Create template", "#transactional-template-create"],
            ["Send from template", "#transactional-send"],
            ["Server proxy", "#transactional-backend-proxy"],
            ["Environments", "#environments"],
          ]
        : [
            ["Introduction", "#"],
          ];

  return (
    <div className="sticky top-28">
      <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">
        {topic === "home" ? "Articles" : "On this page"}
      </p>
      {topic === "home" ? (
        <div className="space-y-1">
          {docsTopics.filter((item) => item.id !== "home").map((item) => (
            <TopicLink
              key={item.id}
              topic={item.id}
              label={item.label}
              navigate={navigate}
              className="block rounded-xl px-3 py-2 text-[13px] text-muted-foreground transition hover:bg-white hover:text-foreground"
            />
          ))}
        </div>
      ) : (
        links.map(([label, href]) => (
          <a key={href} href={href} className="block rounded-xl px-3 py-2 text-[13px] text-muted-foreground transition hover:bg-white hover:text-foreground">
            {label}
          </a>
        ))
      )}
      <button onClick={onHome} className="mt-6 w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground">
        Back to site
      </button>
    </div>
  );
}

export function DocsPage({ onHome, onDashboard }: { onHome: () => void; onDashboard: () => void }) {
  const [environment, setEnvironment] = useState<Environment>(() => defaultEnvironmentFromHost());
  const [topic, setTopic] = useState<DocsTopic>(() => resolveDocsTopic(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setTopic(resolveDocsTopic(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(topicId: DocsTopic) {
    setTopic(topicId);
    const path = docsPath(topicId);
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const article = useMemo(() => {
    switch (topic) {
      case "otp":
        return <OtpArticle environment={environment} />;
      case "transactional":
        return <TransactionalArticle environment={environment} />;
      default:
        return <DocsHomeArticle environment={environment} navigate={navigate} />;
    }
  }, [environment, topic]);

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-white/86 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">
          <button onClick={onHome} className="flex items-center" aria-label="OpenSMS home">
            <OpenSMSLogo />
          </button>
          <div className="hidden min-w-0 flex-1 justify-center px-8 lg:flex">
            <div className="flex w-full max-w-[520px] items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-subtle-foreground">
              <Search className="h-4 w-4" />
              <span className="text-[13px]">Search documentation...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-2xl border border-border bg-surface p-1 md:flex">
              {environmentPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    if (shouldRedirectEnvironment(page.id)) {
                      navigateToEnvironment(page.id);
                      return;
                    }
                    setEnvironment(page.id);
                  }}
                  className={`rounded-xl px-3 py-2 text-[13px] font-semibold transition ${environment === page.id ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {page.label}
                </button>
              ))}
            </div>
            <button onClick={onDashboard} className="rounded-2xl bg-brand/90 px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.18)] transition hover:scale-[1.02]">
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-8 sm:px-8 xl:grid-cols-[260px_minmax(0,1fr)_220px]">
        <aside className="hidden xl:block">
          <DocsNavigation topic={topic} navigate={navigate} />
        </aside>
        <main className="min-w-0 max-w-[900px]">
          {article}
        </main>
        <aside className="hidden xl:block">
          <OnThisPage topic={topic} navigate={navigate} onHome={onHome} />
        </aside>
      </div>
    </div>
  );
}
