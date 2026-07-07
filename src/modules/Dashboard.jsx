import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats]     = useState({ members: 0, notices: 0, meetings: 0, pipeline: 0 });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [mSnap, nSnap, mtSnap, pSnap] = await Promise.all([
          getDocs(query(collection(db, "users"), where("status", "==", "active"))),
          getDocs(query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(5))),
          getDocs(collection(db, "meetings")),
          getDocs(collection(db, "pipeline")),
        ]);
        setStats({
          members:  mSnap.size,
          notices:  nSnap.size,
          meetings: mtSnap.size,
          pipeline: pSnap.size,
        });
        setNotices(nSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        // silently handle permission errors on first load
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Active Partners", value: stats.members,  icon: "👥", color: "#3b82f6" },
    { label: "Notices",         value: stats.notices,  icon: "📌", color: "#f59e0b" },
    { label: "Meetings",        value: stats.meetings, icon: "📅", color: "#10b981" },
    { label: "In Pipeline",     value: stats.pipeline, icon: "🔄", color: "#8b5cf6" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h2>Welcome back, {profile?.name?.split(" ")[0] ?? "Partner"} 👋</h2>
        <p>{profile?.department} · {profile?.role}</p>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : (
        <>
          <div className={styles.statsGrid}>
            {statCards.map((c) => (
              <div key={c.label} className={styles.statCard} style={{ "--accent": c.color }}>
                <span className={styles.statIcon}>{c.icon}</span>
                <div>
                  <span className={styles.statValue}>{c.value}</span>
                  <span className={styles.statLabel}>{c.label}</span>
                </div>
              </div>
            ))}
          </div>

          <section className={styles.section}>
            <h3>Recent Notices</h3>
            {notices.length === 0 ? (
              <p className={styles.empty}>No notices yet.</p>
            ) : (
              <ul className={styles.noticeList}>
                {notices.map((n) => (
                  <li key={n.id} className={styles.noticeItem}>
                    <span className={`${styles.badge} ${styles[n.type] ?? ""}`}>
                      {n.type ?? "general"}
                    </span>
                    <span className={styles.noticeTitle}>{n.title}</span>
                    <span className={styles.noticeDept}>{n.department}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
