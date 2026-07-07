import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Documents.module.css";

const CATEGORIES = ["Governance", "Templates", "Completed Materials", "Reports", "Other"];

export default function Documents() {
  const { profile } = useAuth();
  const [docs, setDocs]       = useState([]);
  const [showForm, setShow]   = useState(false);
  const [catFilter, setCat]   = useState("All");
  const [form, setForm]       = useState({
    title: "", url: "", category: "Governance", description: "", status: "Active"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const cats     = ["All", ...CATEGORIES];
  const filtered = catFilter === "All" ? docs : docs.filter((d) => d.category === catFilter);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await addDoc(collection(db, "documents"), {
      ...form,
      addedBy:   profile.name,
      createdAt: serverTimestamp(),
    });
    setForm({ title: "", url: "", category: "Governance", description: "", status: "Active" });
    setShow(false);
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this document?")) return;
    await deleteDoc(doc(db, "documents", id));
  }

  const canManage = profile?.role === "founder" || profile?.role === "hod";

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {cats.map((c) => (
            <button
              key={c}
              className={`${styles.chip} ${catFilter === c ? styles.activeChip : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {canManage && (
          <button className={styles.addBtn} onClick={() => setShow((v) => !v)}>
            {showForm ? "Cancel" : "+ Add Document"}
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Add Document</h3>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>URL / Link<input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="https://…" /></label>
          <div className={styles.row}>
            <label>Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Archived</option>
                <option>Draft</option>
              </select>
            </label>
          </div>
          <label>Description<textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? "Saving…" : "Add Document"}
          </button>
        </form>
      )}

      <div className={styles.list}>
        {filtered.length === 0 && <p className={styles.empty}>No documents in this category.</p>}
        {filtered.map((d) => (
          <div key={d.id} className={styles.card}>
            <div className={styles.cardIcon}>{categoryIcon(d.category)}</div>
            <div className={styles.cardBody}>
              <div className={styles.cardHead}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docTitle}
                >
                  {d.title} ↗
                </a>
                <div className={styles.headRight}>
                  <span className={`${styles.status} ${styles[`status_${d.status?.toLowerCase()}`]}`}>
                    {d.status}
                  </span>
                  {canManage && (
                    <button className={styles.del} onClick={() => handleDelete(d.id)}>✕</button>
                  )}
                </div>
              </div>
              {d.description && <p className={styles.desc}>{d.description}</p>}
              <div className={styles.cardFoot}>
                <span className={styles.catTag}>{d.category}</span>
                <span>Added by {d.addedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function categoryIcon(cat) {
  switch (cat) {
    case "Governance":           return "📋";
    case "Templates":            return "📝";
    case "Completed Materials":  return "📚";
    case "Reports":              return "📊";
    default:                     return "📁";
  }
}
