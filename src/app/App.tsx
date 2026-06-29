import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { AuthModal } from "./components/AuthModal";
import { Toaster } from "./components/ui/sonner";
import { Dashboard } from "./dashboard/Dashboard";
import { dashboardPath, isDashboardPath, resolveDashboardTab } from "./dashboard/routes";
import type { DashTab } from "./dashboard/types";
import { DocsPage } from "./Docs";
import { LandingPage } from "./LandingPage";
import { LegalPage } from "./Legal";
import { getFirebaseSession, signOutFirebase, type FirebaseSession } from "./lib/firebaseAuth";
import { clearApiKey } from "./lib/api";

type AppView = "landing" | "dashboard" | "docs" | "privacy" | "terms";

type AppRoute = {
  view: AppView;
  dashboardTab: DashTab;
};

function resolveRoute(pathname: string): AppRoute {
  if (pathname.startsWith("/docs")) return { view: "docs", dashboardTab: "overview" };
  if (pathname.startsWith("/privacy")) return { view: "privacy", dashboardTab: "overview" };
  if (pathname.startsWith("/terms")) return { view: "terms", dashboardTab: "overview" };
  if (isDashboardPath(pathname)) return { view: "dashboard", dashboardTab: resolveDashboardTab(pathname) };
  return { view: "landing", dashboardTab: "overview" };
}

function viewPath(view: AppView, tab: DashTab = "overview"): string {
  if (view === "docs") return "/docs";
  if (view === "privacy") return "/privacy";
  if (view === "terms") return "/terms";
  if (view === "dashboard") return dashboardPath(tab);
  return "/";
}

export default function App() {
  const initialRoute = resolveRoute(window.location.pathname);
  const [view, setView] = useState<AppView>(initialRoute.view);
  const [dashboardTab, setDashboardTab] = useState<DashTab>(initialRoute.dashboardTab);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [session, setSession] = useState<FirebaseSession | null>(() => getFirebaseSession());

  useEffect(() => {
    const onPopState = () => {
      const route = resolveRoute(window.location.pathname);
      setView(route.view);
      setDashboardTab(route.dashboardTab);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function pushPath(path: string) {
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  }

  function setAppView(next: AppView, options?: { tab?: DashTab; scroll?: boolean }) {
    const tab = next === "dashboard" ? (options?.tab ?? dashboardTab) : "overview";
    setView(next);
    if (next === "dashboard") {
      setDashboardTab(tab);
    }
    pushPath(viewPath(next, tab));
    if (options?.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  function navigateDashboard(tab: DashTab = "overview") {
    if (!session) {
      setDashboardTab(tab);
      openAuth("signin");
      return;
    }
    setDashboardTab(tab);
    setView("dashboard");
    pushPath(dashboardPath(tab));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function handleDashboardTabChange(tab: DashTab) {
    setDashboardTab(tab);
    pushPath(dashboardPath(tab));
  }

  function openAuth(mode: "signin" | "signup") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  function showDashboard(tab: DashTab = "overview") {
    navigateDashboard(tab);
  }

  function handleSignOut() {
    clearApiKey();
    signOutFirebase();
    setSession(null);
    setAppView("landing");
  }

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        {view === "docs" ? (
          <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <DocsPage onHome={() => setAppView("landing")} onDashboard={() => showDashboard()} />
          </motion.div>
        ) : view === "privacy" ? (
          <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LegalPage kind="privacy" onHome={() => setAppView("landing")} />
          </motion.div>
        ) : view === "terms" ? (
          <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LegalPage kind="terms" onHome={() => setAppView("landing")} />
          </motion.div>
        ) : view === "landing" ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <LandingPage
              session={session}
              onDashboard={() => showDashboard()}
              onSignIn={() => openAuth("signin")}
              onSignUp={() => openAuth("signup")}
              onSignOut={handleSignOut}
              onPrivacy={() => setAppView("privacy")}
              onTerms={() => setAppView("terms")}
            />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Dashboard
              session={session}
              tab={dashboardTab}
              onTabChange={handleDashboardTabChange}
              onBack={() => setAppView("landing")}
              onSignOut={handleSignOut}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {authOpen && (
          <AuthModal
            open={authOpen}
            mode={authMode}
            onClose={() => setAuthOpen(false)}
            onPrivacy={() => {
              setAuthOpen(false);
              setAppView("privacy");
            }}
            onTerms={() => {
              setAuthOpen(false);
              setAppView("terms");
            }}
            onSuccess={() => {
              setSession(getFirebaseSession());
              setAuthOpen(false);
              setView("dashboard");
              pushPath(dashboardPath(dashboardTab));
              toast.success("Signed in", { description: "Welcome to your OpenSMS console." });
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
