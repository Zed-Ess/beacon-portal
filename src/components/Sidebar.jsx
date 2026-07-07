import styles from "./Sidebar.module.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { id: "dashboard",   label: "Dashboard",  icon: "🏠" },
  { id: "noticeboard", label: "Noticeboard", icon: "📌" },
  { id: "meetings",    label: "Meetings",    icon: "📅" },
  { id: "polls",       label: "Polls",       icon: "🗳️" },
  { id: "pipeline",    label: "Pipeline",    icon: "🔄" },
  { id: "members",     label: "Members",     icon: "👥" },
  { id: "documents",   label: "Documents",   icon: "📁" },
];

export default function Sidebar({ active, onNav, mobileOpen, onClose }) {
  const { profile } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <span className={styles.lamp}>🏮</span>
          <div>
            <span className={styles.name}>Beacon</span>
            <span className={styles.sub}>Partner Portal</span>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <ul className={styles.nav}>
            {NAV.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.navBtn} ${active === item.id ? styles.activeNav : ""}`}
                  onClick={() => { onNav(item.id); onClose(); }}
                  aria-current={active === item.id ? "page" : undefined}
                >
                  <span className={styles.icon} aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footer}>
          {profile && (
            <div className={styles.userInfo}>
              <span className={styles.avatar}>
                {profile.name?.[0]?.toUpperCase() ?? "?"}
              </span>
              <div className={styles.userText}>
                <span className={styles.userName}>{profile.name}</span>
                <span className={styles.userRole}>{profile.role}</span>
              </div>
            </div>
          )}
          <button
            className={styles.signOut}
            onClick={() => signOut(auth)}
            aria-label="Sign out"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
