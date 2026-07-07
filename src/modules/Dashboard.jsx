import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats]       = useState({ members: 0, meetings: 0, pipeline: 0, materials: 0 });
  const [notices, setNotices]   = useState([]);
  const [myItems, setMyItems]   = useState([]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const onErr = (err) => {
      console.error("Dashboard snapshot error:", err);
      setError("Some dashboard data could not load. Check your connection.");
      setLoading(false);
    };

    const unsubs = [
      onSnapshot(query(collection(db, "users"), where("status", "==", "active")), (s) => {
        setStats((st) => ({ ...st, members: s.size }));
        setLoading(false);
      }, onErr),
      onSnapshot(collection(db, "meetings"), (s) => setStats((st) => ({ ...st, meetings: s.size })), onErr),
      onSnapshot(collection(db, "pipeline"), (s) => {
        setStats((st) => ({ ...st, pipeline: s.size }));
        const all = s.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMyItems(all.filter((i) =>
          (i.authorId === profile?.id || i.reviewerId === profile?.id) &&
          !i.stage?.startsWith("9")
        ));
      }, onErr),
      onSnapshot(collection(db, "materials"), (s) => setStats((st) => ({ ...st, materials: s.size })), () => {}),
      onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(5)), (s) => {
        setNotices(s.docs.map((d) => ({ id: d.id, ...d.data() })));
      }, onErr),
    ];
    return () => unsubs.forEach((u) => u());
  }, [profile?.id]);

  const statCards = [
    { label: "Active Partners", value: stats.members,   icon: "👥", color: "#3b82f6" },
    { label: "In Pipeline",     value: stats.pipeline,  icon: "🔄", color: "#8b5cf6" },
    { label: "Materials",       value: stats.materials, icon: "📖", color: "#e85d26" },
    { label: "Meetings",        value: stats.meetings,  icon: "📅", color: "#10b981" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h2>Welcome back, {profile?.name?.split(" ")[0] ?? "Partner"} 👋</h2>
        <p>{profile?.department} · {profile?.role}</p>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {loading && !error ? (
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

          {myItems.length > 0 && (
            <section className={styles.section}>
              <h3>My Open Assignments</h3>
              <ul className={styles.noticeList}>
                {myItems.map((i) => (
                  <li key={i.id} className={styles.noticeItem}>
                    <span className={styles.badge}>{i.stage?.split("–")[1]?.trim() ?? i.stage}</span>
                    <span className={styles.noticeTitle}>{i.title}</span>
                    <span className={styles.noticeDept}>
                      {i.reviewerId === profile?.id && i.authorId !== profile?.id ? "reviewing" : "author"}
                      {i.dueDate ? ` · due ${i.dueDate}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

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
