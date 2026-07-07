import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Website
import WebLayout   from "./website/components/WebLayout";
import Home        from "./website/pages/Home";
import Catalogue   from "./website/pages/Catalogue";
import About       from "./website/pages/About";
import Events      from "./website/pages/Events";
import ForSchools  from "./website/pages/ForSchools";
import Blog        from "./website/pages/Blog";
import Contact     from "./website/pages/Contact";

// Portal
import AuthPage    from "./pages/AuthPage";
import PendingPage from "./pages/PendingPage";
import Sidebar     from "./components/Sidebar";
import TopBar      from "./components/TopBar";
import Dashboard   from "./modules/Dashboard";
import Noticeboard from "./modules/Noticeboard";
import Meetings    from "./modules/Meetings";
import Polls       from "./modules/Polls";
import Pipeline    from "./modules/Pipeline";
import Members     from "./modules/Members";
import Documents   from "./modules/Documents";
import Agreement   from "./modules/Agreement";
import Enquiries   from "./modules/Enquiries";

import "./App.css";

/* ── Portal shell (auth-gated) ───────────────────────────── */
function PortalShell() {
  const { user, profile, loading } = useAuth();
  const [page, setPage]   = useState("dashboard");
  const [menuOpen, setMenu] = useState(false);

  if (loading) {
    return (
      <div className="splash">
        <span className="splashLamp">🏮</span>
        <p>Loading…</p>
      </div>
    );
  }

  if (!user)                         return <AuthPage />;
  if (profile?.status === "pending") return <PendingPage />;
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
        role={profile.role}
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

/* ── Root router ─────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<WebLayout />}>
        <Route index          element={<Home />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="about"     element={<About />} />
        <Route path="events"    element={<Events />} />
        <Route path="schools"   element={<ForSchools />} />
        <Route path="blog"      element={<Blog />} />
        <Route path="contact"   element={<Contact />} />
      </Route>

      {/* Partner portal */}
      <Route path="portal/*" element={<PortalShell />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
