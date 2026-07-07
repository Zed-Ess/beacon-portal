import { useEffect, useState } from "react";
import {
  collection, query, onSnapshot, doc, updateDoc, orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Members.module.css";

const ROLES = ["member", "hod", "founder"];

export default function Members() {
  const { profile } = useAuth();
  const [members, setMembers] = useState([]);
  const [tab, setTab]         = useState("active"); // active | pending

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("name"));
    return onSnapshot(q, (snap) => {
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
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
          <button className={tab === "active" ? styles.activeTab : ""} onClick={() => setTab("active")}>
            Active ({active.length})
          </button>
          <button className={tab === "pending" ? styles.activeTab : ""} onClick={() => setTab("pending")}>
            Pending ({pending.length})
            {pending.length > 0 && <span className={styles.dot} />}
          </button>
        </div>
      </div>

      {tab === "pending" && pending.length === 0 && (
        <p className={styles.empty}>No pending applications.</p>
      )}

      <div className={styles.grid}>
        {shown.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.avatar}>
              {m.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className={styles.info}>
              <span className={styles.memberName}>{m.name}</span>
              <span className={styles.email}>{m.email}</span>
              <span className={styles.dept}>{m.department}</span>
              {m.subjects?.length > 0 && (
                <span className={styles.subjects}>{m.subjects.join(", ")}</span>
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
                      value={m.role}
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
