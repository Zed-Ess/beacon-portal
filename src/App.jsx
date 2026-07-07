import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage     from "./pages/AuthPage";
import PendingPage  from "./pages/PendingPage";
import Sidebar      from "./components/Sidebar";
import TopBar       from "./components/TopBar";
import Dashboard    from "./modules/Dashboard";
import Noticeboard  from "./modules/Noticeboard";
import Meetings     from "./modules/Meetings";
import Polls        from "./modules/Polls";
import Pipeline     from "./modules/Pipeline";
import Members      from "./modules/Members";
import Documents    from "./modules/Documents";
import "./App.css";

function AppShell() {
  const [page, setPage]       = useState("dashboard");
  const [menuOpen, setMenu]   = useState(false);

  const PAGE_MAP = {
    dashboard:   <Dashboard />,
    noticeboard: <Noticeboard />,
    meetings:    <Meetings />,
    polls:       <Polls />,
    pipeline:    <Pipeline />,
    members:     <Members />,
    documents:   <Documents />,
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
          {PAGE_MAP[page] ?? <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="splash">
        <span className="splashLamp">🏮</span>
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;
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

  return <AppShell />;
}
