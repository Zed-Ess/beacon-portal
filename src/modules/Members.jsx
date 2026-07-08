import { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Members.module.css";

const ROLES = ["member", "hod", "founder"];

export default function Members() {
  const { profile } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("active");

  useEffect(() => {
    // No orderBy to avoid Firestore index/permission issues with missing fields
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        all.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        setMembers(all);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Members snapshot error:", err);
        setError("Could not load members. Check Firestore rules.");
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const active  = members.filter((m) => m.status === "active");
  const pending = members.filter((m) => m.status === "pending");
  const shown   = tab === "active" ? active : pending;

  async function approve(id) {
    await updateDoc(doc(db, "users", id), { status: "active" });
  }

  async function reject(id) {
    if (!window.confirm("Reject and remove this application?")) return;
    await updateDoc(doc(db, "users", id), { status: "rejected" });
  }

  async function changeRole(id, role) {
    await updateDoc(doc(db, "users", id), { role });
  }

  const isFounder = profile?.role === "founder";

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            className={tab === "active" ? styles.activeTab : ""}
            onClick={() => setTab("active")}
          >
            Active ({active.length})
          </button>
          <button
            className={tab === "pending" ? styles.activeTab : ""}
            onClick={() => setTab("pending")}
          >
            Pending ({pending.length})
            {pending.length > 0 && <span className={styles.dot} />}
          </button>
        </div>
      </div>

      {loading && <p className={styles.empty}>Loading members…</p>}
      {error   && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && tab === "active"  && active.length  === 0 && (
        <p className={styles.empty}>No active members yet.</p>
      )}
      {!loading && !error && tab === "pending" && pending.length === 0 && (
        <p className={styles.empty}>No pending applications.</p>
      )}

      <div className={styles.grid}>
        {shown.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.avatar}>
              {m.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className={styles.info}>
              <span className={styles.memberName}>{m.name ?? "(no name)"}</span>
              <span className={styles.email}>{m.email}</span>
              <span className={styles.dept}>{m.department}</span>
              {m.subjects != null && m.subjects.length > 0 && (
                <span className={styles.subjects}>
                  {Array.isArray(m.subjects) ? m.subjects.join(", ") : m.subjects}
                </span>
              )}
            </div>
            <div className={styles.actions}>
              {tab === "active" && (
                <>
                  <span className={`${styles.roleBadge} ${styles[`role_${m.role}`]}`}>
                    {m.role}
                  </span>
                  {isFounder && m.id !== profile.id && (
                    <select
                      className={styles.roleSelect}
                      value={m.role ?? "member"}
                      onChange={(e) => changeRole(m.id, e.target.value)}
                      aria-label={`Change role for ${m.name}`}
                    >
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  )}
                </>
              )}
              {tab === "pending" && isFounder && (
                <div className={styles.pendingBtns}>
                  <button className={styles.approveBtn} onClick={() => approve(m.id)}>
                    ✓ Approve
                  </button>
                  <button className={styles.rejectBtn} onClick={() => reject(m.id)}>
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
