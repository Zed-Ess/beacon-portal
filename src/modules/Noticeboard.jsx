import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Noticeboard.module.css";

const DEPARTMENTS = [
  "All Departments", "Mathematics", "English", "Science",
  "Social Studies", "ICT", "Creative Arts", "French",
];
const TYPES = ["general", "urgent", "pinned"];

export default function Noticeboard() {
  const { profile } = useAuth();
  const [notices, setNotices]   = useState([]);
  const [filter, setFilter]     = useState("All Departments");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ title: "", body: "", department: "All Departments", type: "general" });
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const filtered = filter === "All Departments"
    ? notices
    : notices.filter((n) => n.department === filter || n.department === "All Departments");

  async function handlePost(e) {
    e.preventDefault();
    setSaving(true);
    await addDoc(collection(db, "notices"), {
      ...form,
      author:    profile.name,
      authorId:  profile.id,
      createdAt: serverTimestamp(),
    });
    setForm({ title: "", body: "", department: "All Departments", type: "general" });
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this notice?")) return;
    await deleteDoc(doc(db, "notices", id));
  }

  const canDelete = (n) =>
    profile?.role === "founder" || n.authorId === profile?.id;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              className={`${styles.chip} ${filter === d ? styles.activeChip : ""}`}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <button className={styles.postBtn} onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ Post Notice"}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handlePost}>
          <h3>New Notice</h3>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            Body
            <textarea
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </label>
          <div className={styles.row}>
            <label>
              Department
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label>
              Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? "Posting…" : "Post Notice"}
          </button>
        </form>
      )}

      <div className={styles.list}>
        {filtered.length === 0 && (
          <p className={styles.empty}>No notices for this department.</p>
        )}
        {filtered.map((n) => (
          <article key={n.id} className={`${styles.card} ${styles[n.type] ?? ""}`}>
            <div className={styles.cardHead}>
              <span className={`${styles.badge} ${styles[`badge_${n.type}`]}`}>{n.type}</span>
              <span className={styles.dept}>{n.department}</span>
              {canDelete(n) && (
                <button className={styles.del} onClick={() => handleDelete(n.id)} aria-label="Delete notice">✕</button>
              )}
            </div>
            <h4 className={styles.cardTitle}>{n.title}</h4>
            <p className={styles.cardBody}>{n.body}</p>
            <div className={styles.cardFoot}>
              <span>By {n.author}</span>
              <span>{formatDate(n.createdAt?.toDate?.())}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
