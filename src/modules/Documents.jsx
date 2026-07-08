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
  const [docs, setDocs]         = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [showForm, setShow]     = useState(false);
  const [catFilter, setCat]     = useState("All");
  const [error, setError]       = useState("");
  const [form, setForm]         = useState({
    title: "", url: "", category: "Templates", description: "", status: "Active", pipelineId: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
    return onSnapshot(q,
      (snap) => setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => { console.error(err); setError("Could not load documents."); }
    );
  }, []);

  // Pipeline items for the optional "attach to" select
  useEffect(() => {
    const q = query(collection(db, "pipeline"), orderBy("createdAt", "desc"));
    return onSnapshot(q,
      (snap) => setPipeline(snap.docs.map((d) => ({ id: d.id, title: d.data().title }))),
      () => {}
    );
  }, []);

  const cats     = ["All", ...CATEGORIES];
  const filtered = catFilter === "All" ? docs : docs.filter((d) => d.category === catFilter);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const linked = pipeline.find((p) => p.id === form.pipelineId);
      await addDoc(collection(db, "documents"), {
        title:         form.title,
        url:           form.url,
        category:      form.category,
        description:   form.description,
        status:        form.status,
        pipelineId:    form.pipelineId,
        pipelineTitle: linked?.title ?? "",
        addedBy:       profile.name,
        addedById:     profile.id,
        createdAt:     serverTimestamp(),
      });
      setForm({ title: "", url: "", category: "Templates", description: "", status: "Active", pipelineId: "" });
      setShow(false);
    } catch (err) {
      console.error(err);
      setError("Could not save. Please try again.");
    }
    setSaving(false);
  }

  async function handleDelete(d) {
    if (!window.confirm("Remove this document?")) return;
    await deleteDoc(doc(db, "documents", d.id));
  }

  const isManager = profile?.role === "founder" || profile?.role === "hod";
  const canDelete = (d) => isManager || d.addedById === profile?.id;

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
        <button className={styles.addBtn} onClick={() => setShow((v) => !v)}>
          {showForm ? "Cancel" : "+ Add Document"}
        </button>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Add Document</h3>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Link <span className={styles.hint}>(Google Drive, Dropbox, etc.)</span>
            <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" required />
          </label>
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
          <label>Attach to Pipeline Item <span className={styles.hint}>(optional)</span>
            <select value={form.pipelineId} onChange={(e) => setForm({ ...form, pipelineId: e.target.value })}>
              <option value="">— None —</option>
              {pipeline.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </label>
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
                  {canDelete(d) && (
                    <button className={styles.del} onClick={() => handleDelete(d)}>✕</button>
                  )}
                </div>
              </div>
              {d.description && <p className={styles.desc}>{d.description}</p>}
              <div className={styles.cardFoot}>
                <span className={styles.catTag}>{d.category}</span>
                {d.pipelineTitle && <span className={styles.catTag}>🔄 {d.pipelineTitle}</span>}
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
