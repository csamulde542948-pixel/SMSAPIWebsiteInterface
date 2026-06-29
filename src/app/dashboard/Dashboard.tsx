import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Bell, ChevronDown, LogOut, Menu, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { useClickOutside } from "@/lib/useClickOutside";
import { OpenSMSLogo } from "../components/OpenSMSLogo";
import { navigateToEnvironment, shouldRedirectEnvironment } from "../lib/environment";
import { AccountAvatar, EnvironmentSlider, accountLabel, dashboardNavGroups, dashboardNavLabel, environmentCopy } from "./utils";
import { useDashboardState } from "./useDashboardState";
import { GatewaysPanel, InboundPanel, MessagesPanel, OverviewPanel } from "./components/ConsolePanels";
import { MarketingPanel, OTPPanel } from "./components/OperationsPanels";
import { PlaygroundPanel } from "./components/PlaygroundPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { SendModal } from "./components/SendModal";
import { TransactionalPanel } from "./components/TransactionalPanel";
import type { DashboardProps, DashTab } from "./types";

export function Dashboard({ session, tab, onTabChange, onBack, onSignOut }: DashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  useClickOutside(profileRef, closeProfile, profileOpen);
  const { state, actions, metrics } = useDashboardState(session);
  const envPage = useMemo(() => environmentCopy(state.environment), [state.environment]);

  const selectTab = useCallback(
    (next: DashTab) => {
      onTabChange(next);
      setMenuOpen(false);
    },
    [onTabChange],
  );

  function renderNavButton(item: (typeof dashboardNavGroups)[number]["items"][number]) {
    const isActive = tab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => selectTab(item.id)}
        className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${isActive ? "bg-brand text-white shadow-[0_14px_30px_rgba(0,132,255,0.24)]" : "text-muted-foreground hover:bg-surface hover:text-foreground"}`}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
        {item.id === "inbound" && metrics.inbound.length > 0 && (
          <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] ${isActive ? "bg-white/20" : "bg-brand/10 text-brand"}`}>
            {metrics.inbound.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-white/84 backdrop-blur-xl transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center px-5">
          <OpenSMSLogo />
        </div>
        <div className="px-4">
          <div className="rounded-[20px] border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${state.hasApiKey ? "bg-success" : "bg-warning"}`} />
              <div>
                <p className="text-[14px] font-semibold text-foreground">{state.hasApiKey ? "API connected" : "Preview mode"}</p>
                <p className="text-[12px] text-muted-foreground">{envPage.label} workspace</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="mt-5 flex-1 overflow-y-auto px-3">
          {dashboardNavGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">{group.label}</p>
              {group.items.map(renderNavButton)}
            </div>
          ))}
        </nav>
        <div className="space-y-3 p-3">
          <div>
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle-foreground">Environment</p>
            <EnvironmentSlider
              environment={state.environment}
              onChange={(next) => {
                if (shouldRedirectEnvironment(next)) {
                  navigateToEnvironment(next);
                  return;
                }
                actions.setEnvironment(next);
                selectTab("overview");
                actions.setGatewayPairing(null);
                actions.setGatewayError("");
              }}
            />
          </div>
          <button onClick={onBack} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Back to site
          </button>
        </div>
      </aside>

      {menuOpen && <button className="fixed inset-0 z-30 bg-primary/25 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-[260px]">
        <header className={`flex h-20 shrink-0 items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8 ${state.environment === "sandbox" ? "border-warning/25 bg-warning-muted/88" : "border-border bg-white/72"}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[13px] font-semibold text-brand">{envPage.title}</p>
              <h1 className="text-[24px] font-bold tracking-[-0.05em] text-foreground">{dashboardNavLabel(tab)}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => void actions.loadData()} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-muted-foreground transition hover:text-foreground" aria-label="Refresh data">
              <RefreshCw className={`h-4 w-4 ${state.loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => selectTab("inbound")}
              className={`relative hidden h-11 w-11 items-center justify-center rounded-2xl border bg-white transition sm:flex ${tab === "inbound" ? "border-brand/30 text-brand" : "border-border text-muted-foreground hover:text-foreground"}`}
              aria-label={metrics.inbound.length > 0 ? `View ${metrics.inbound.length} inbound messages` : "View inbound messages"}
            >
              <Bell className="h-4 w-4" />
              {metrics.inbound.length > 0 && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-success" />}
            </button>
            <button onClick={() => setSendOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-brand/90 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,132,255,0.22)] transition hover:scale-[1.02]">
              <Send className="h-4 w-4" />
              Send
            </button>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-11 items-center gap-3 rounded-2xl border border-border bg-white p-1.5 pr-2 text-left transition hover:border-border hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 sm:pr-3"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <AccountAvatar session={session} />
                {session && (
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-[180px] truncate text-[13px] font-semibold text-foreground">{accountLabel(session)}</span>
                    <span className="block text-[11px] text-muted-foreground">Signed in</span>
                  </span>
                )}
                <ChevronDown className={`hidden h-4 w-4 shrink-0 text-muted-foreground transition sm:block ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[280px] rounded-2xl border border-border bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                  {session && (
                    <div className="border-b border-border px-3 py-3">
                      <p className="truncate text-[14px] font-semibold text-foreground">{accountLabel(session)}</p>
                      <p className="truncate text-[12px] text-muted-foreground">{session.email || "Google account"}</p>
                    </div>
                  )}
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
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          {tab === "playground" && (
            <PlaygroundPanel
              environment={state.environment}
              otps={state.otps}
              templates={state.templates}
              loading={state.loading}
              onRefresh={() => void actions.loadData()}
              onMessage={(message) => {
                actions.upsertMessages([message]);
                void actions.loadData();
              }}
              onMessages={(newMessages) => {
                actions.upsertMessages(newMessages);
                void actions.loadData();
              }}
            />
          )}
          {tab === "overview" && (
            <OverviewPanel
              state={state}
              metrics={metrics}
              onOpenSettings={() => selectTab("settings")}
              onRefresh={() => void actions.loadData()}
            />
          )}
          {tab === "otp" && (
            <OTPPanel
              environment={state.environment}
              otps={state.otps}
              onRefresh={() => void actions.loadData()}
              onOpenPlayground={() => selectTab("playground")}
              loading={state.loading}
            />
          )}
          {tab === "transactional" && (
            <TransactionalPanel
              environment={state.environment}
              messages={state.messages}
              templates={state.templates}
              onRefresh={() => void actions.loadData()}
              onOpenPlayground={() => selectTab("playground")}
              loading={state.loading}
            />
          )}
          {tab === "marketing" && (
            <MarketingPanel
              environment={state.environment}
              onOpenPlayground={() => selectTab("playground")}
            />
          )}
          {tab === "gateways" && <GatewaysPanel state={state} actions={actions} loading={state.loading} />}
          {tab === "messages" && (
            <MessagesPanel
              envLabel={envPage.label}
              messages={metrics.filteredMessages}
              search={state.search}
              loading={state.loading}
              onSearchChange={actions.setSearch}
              onOpenSend={() => setSendOpen(true)}
            />
          )}
          {tab === "inbound" && (
            <InboundPanel
              environment={state.environment}
              inbound={metrics.filteredInbound}
              search={state.search}
              loading={state.loading}
              onSearchChange={actions.setSearch}
              onRefresh={() => void actions.loadData()}
            />
          )}
          {tab === "settings" && <SettingsPanel state={state} actions={actions} />}
        </main>
      </div>

      <AnimatePresence>
        {sendOpen && (
          <SendModal
            environment={state.environment}
            onClose={() => setSendOpen(false)}
            onSent={(message) => {
              actions.upsertMessages([message]);
              setSendOpen(false);
              void actions.loadData();
              toast.success("Message queued", {
                description: `Routing to ${message.to}${message.network ? ` via ${message.network}` : ""}.`,
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
