import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot, doc,
  query, orderBy, serverTimestamp, updateDoc, deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Pipeline.module.css";

const STAGES = [
  "1 – Concept",
  "2 – Outline",
  "3 – Draft",
  "4 – Review",
  "5 – Revision",
  "6 – Design",
  "7 – Proofreading",
  "8 – Final Approval",
  "9 – Published",
];

const TYPES = ["Textbook", "Workbook", "Assessment", "Manual", "Guide", "Other"];
const DEPTS = ["Mathematics","English","Science","Social Studies","ICT","Creative Arts","French"];

export default function Pipeline() {
  const { profile } = useAuth();
  const [items, setItems]   = useState([]);
  const [showForm, setShow] = useState(false);
  const [stageFilter, setSF] = useState("All");
  const [form, setForm]     = useState({
    title: "", type: "Textbook", author: "", department: "Mathematics",
    stage: STAGES[0], dueDate: "", notes: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "pipeline"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const filtered = stageFilter === "All"
    ? items
    : items.filter((i) => i.stage === stageFilter);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await addDoc(collection(db, "pipeline"), {
      ...form,
      createdBy: profile.name,
      createdAt: serverTimestamp(),
    });
    setForm({ title: "", type: "Textbook", author: "", department: "Mathematics", stage: STAGES[0], dueDate: "", notes: "" });
    setShow(false);
    setSaving(false);
  }

  async function advanceStage(item) {
    const idx = STAGES.indexOf(item.stage);
    if (idx === -1 || idx === STAGES.length - 1) return;
    await updateDoc(doc(db, "pipeline", item.id), { stage: STAGES[idx + 1] });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this pipeline item?")) return;
    await deleteDoc(doc(db, "pipeline", id));
  }

  const stageColor = (stage) => {
    if (stage.startsWith("9")) return "#10b981";
    if (stage.startsWith("8")) return "#3b82f6";
    if (parseInt(stage) >= 6)  return "#8b5cf6";
    if (parseInt(stage) >= 4)  return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.stageFilters}>
          <button className={`${styles.sf} ${stageFilter === "All" ? styles.activeSF : ""}`} onClick={() => setSF("All")}>All</button>
          {STAGES.map((s) => (
            <button key={s} className={`${styles.sf} ${stageFilter === s ? styles.activeSF : ""}`} onClick={() => setSF(s)}>
              {s.split("–")[0].trim()}
            </button>
          ))}
        </div>
        {(profile?.role === "founder" || profile?.role === "hod") && (
          <button className={styles.addBtn} onClick={() => setShow((v) => !v)}>
            {showForm ? "Cancel" : "+ Add Item"}
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>New Pipeline Item</h3>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <div className={styles.row}>
            <label>Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Department
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
          </div>
          <label>Lead Author<input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></label>
          <div className={styles.row}>
            <label>Stage
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Due Date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
          </div>
          <label>Notes<textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? "Saving…" : "Add to Pipeline"}
          </button>
        </form>
      )}

      <div className={styles.count}>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</div>

      <div className={styles.list}>
        {filtered.length === 0 && <p className={styles.empty}>No items in this stage.</p>}
        {filtered.map((item) => {
          const color = stageColor(item.stage);
          const stageIdx = STAGES.indexOf(item.stage);
          const canAdvance = profile?.role === "founder" || profile?.role === "hod";
          return (
            <div key={item.id} className={styles.card}>
              <div className={styles.stageTag} style={{ background: color + "22", color }}>
                {item.stage}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHead}>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  {profile?.role === "founder" && (
                    <button className={styles.del} onClick={() => handleDelete(item.id)}>✕</button>
                  )}
                </div>
                <div className={styles.meta}>
                  <span>📚 {item.type}</span>
                  <span>🏫 {item.department}</span>
                  {item.author && <span>✍️ {item.author}</span>}
                  {item.dueDate && <span>📅 Due {formatDate(item.dueDate)}</span>}
                </div>
                {item.notes && <p className={styles.notes}>{item.notes}</p>}
                <div className={styles.progress}>
                  <div className={styles.progressBar} style={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%`, background: color }} />
                </div>
              </div>
              {canAdvance && stageIdx < STAGES.length - 1 && (
                <button className={styles.advBtn} onClick={() => advanceStage(item)} title="Advance to next stage">
                  →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str + "T12:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
