import type { DashTab } from "./types";

const DASHBOARD_TABS: DashTab[] = [
  "overview",
  "otp",
  "transactional",
  "marketing",
  "messages",
  "inbound",
  "gateways",
  "settings",
  "playground",
];

export function isDashboardPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export function resolveDashboardTab(pathname: string): DashTab {
  const segment = pathname.replace(/^\/dashboard\/?/, "").split("/")[0];
  if (segment && DASHBOARD_TABS.includes(segment as DashTab)) {
    return segment as DashTab;
  }
  return "overview";
}

export function dashboardPath(tab: DashTab): string {
  return tab === "overview" ? "/dashboard" : `/dashboard/${tab}`;
}
