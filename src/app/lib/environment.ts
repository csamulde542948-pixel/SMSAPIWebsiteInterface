export type OpenSMSEnvironment = "live" | "sandbox";

const LIVE_HOSTNAME = (import.meta.env.VITE_LIVE_HOSTNAME as string | undefined)?.trim() || "opensms-ba8dd.web.app";
const SANDBOX_HOSTNAME = (import.meta.env.VITE_SANDBOX_HOSTNAME as string | undefined)?.trim() || "opensms-sandbox.web.app";

export function defaultEnvironmentFromHost(hostname = window.location.hostname): OpenSMSEnvironment {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) return "sandbox";
  if (normalized === SANDBOX_HOSTNAME.toLowerCase()) return "sandbox";
  if (normalized === LIVE_HOSTNAME.toLowerCase()) return "live";
  if (normalized.startsWith("sandbox.")) return "sandbox";
  return "live";
}

export function hostForEnvironment(environment: OpenSMSEnvironment): string {
  return environment === "sandbox" ? SANDBOX_HOSTNAME : LIVE_HOSTNAME;
}

export function shouldRedirectEnvironment(environment: OpenSMSEnvironment, hostname = window.location.hostname): boolean {
  return hostForEnvironment(environment).toLowerCase() !== hostname.trim().toLowerCase();
}

export function navigateToEnvironment(environment: OpenSMSEnvironment): void {
  const nextHost = hostForEnvironment(environment);
  if (!nextHost) return;
  const url = new URL(window.location.href);
  url.hostname = nextHost;
  window.location.assign(url.toString());
}
