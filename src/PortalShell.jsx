import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage    from "./pages/AuthPage";
import PendingPage from "./pages/PendingPage";
import Sidebar       from "./components/Sidebar";
import TopBar        from "./components/TopBar";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard   from "./modules/Dashboard";
import Noticeboard from "./modules/Noticeboard";
import Meetings    from "./modules/Meetings";
import Polls       from "./modules/Polls";
import Pipeline    from "./modules/Pipeline";
import Builder     from "./modules/Builder";
import Members     from "./modules/Members";
import Documents   from "./modules/Documents";
import Agreement   from "./modules/Agreement";
import Enquiries   from "./modules/Enquiries";

export default function PortalShell() {
  const { user, profile, loading } = useAuth();
  const [page, setPage]     = useState("dashboard");
  const [menuOpen, setMenu] = useState(false);

  if (loading) {
    return (
      <div className="splash">
        <img src="/beacon-portal/beaconlogo.png" alt="Beacon" className="splashLamp" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!user)                          return <AuthPage />;
  if (profile?.status === "pending")  return <PendingPage />;
  if (profile?.status === "rejected") return (
    <div className="splash">
      <span className="splashLamp">🚫</span>
      <p>Your application was not approved. Contact the Founder.</p>
    </div>
  );
  if (!profile) return (
    <div className="splash">
      <span className="splashLamp">⚠️</span>
      <p>Profile not found. Please sign out and try again.</p>
    </div>
  );

  const PAGE_MAP = {
    dashboard:   <Dashboard />,
    noticeboard: <Noticeboard />,
    meetings:    <Meetings />,
    polls:       <Polls />,
    pipeline:    <Pipeline />,
    builder:     <Builder />,
    members:     <Members />,
    documents:   <Documents />,
    agreement:   <Agreement />,
    enquiries:   <Enquiries />,
  };

  return (
    <div className="appLayout">
      <Sidebar
        active={page}
        onNav={setPage}
        mobileOpen={menuOpen}
        onClose={() => setMenu(false)}
      />
      <div className="mainArea">
        <TopBar page={page} onMenuClick={() => setMenu(true)} />
        <main className="content">
          <ErrorBoundary resetKey={page}>
            {PAGE_MAP[page] ?? <Dashboard />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
