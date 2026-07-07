import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot, doc,
  query, orderBy, serverTimestamp, updateDoc, deleteDoc, arrayUnion, where
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { STAGES, MATERIAL_TYPES, DEPARTMENTS, SUBJECTS } from "../constants";
import styles from "./Pipeline.module.css";

export default function Pipeline() {
  const { profile } = useAuth();
  const [items, setItems]     = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShow]   = useState(false);
  const [stageFilter, setSF]  = useState("All");
  const [mineOnly, setMine]   = useState(false);
  const [openComments, setOpenComments] = useState(null); // item id
  const [commentText, setCommentText]   = useState("");
  const [error, setError]     = useState("");
  const [form, setForm]       = useState(blankForm());
  const [saving, setSaving]   = useState(false);

  function blankForm() {
    return {
      title: "", type: MATERIAL_TYPES[0],
      department: "", subject: SUBJECTS[0],
      authorId: "", reviewerId: "",
      stage: STAGES[0], dueDate: "", notes: "",
    };
  }

  useEffect(() => {
    const q = query(collection(db, "pipeline"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setError("");
      },
      (err) => {
        console.error("Pipeline snapshot error:", err);
        setError("Could not load the pipeline. Check your connection or permissions.");
      }
    );
    return unsub;
  }, []);

  // Active members for author / reviewer selection
  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "active"));
    return onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      all.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      setMembers(all);
    }, () => {});
  }, []);

  const isManager = profile?.role === "founder" || profile?.role === "hod";

  const filtered = items.filter((i) => {
    if (stageFilter !== "All" && i.stage !== stageFilter) return false;
    if (mineOnly && i.authorId !== profile?.id && i.reviewerId !== profile?.id) return false;
    return true;
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const author   = isManager && form.authorId
        ? members.find((m) => m.id === form.authorId)
        : profile;
      const reviewer = members.find((m) => m.id === form.reviewerId);
      await addDoc(collection(db, "pipeline"), {
        title:        form.title,
        type:         form.type,
        department:   form.department || profile.department,
        subject:      form.subject,
        stage:        isManager ? form.stage : STAGES[0],
        dueDate:      form.dueDate,
        notes:        form.notes,
        authorId:     author?.id ?? profile.id,
        author:       author?.name ?? profile.name,
        reviewerId:   reviewer?.id ?? "",
        reviewer:     reviewer?.name ?? "",
        comments:     [],
        createdBy:    profile.name,
        createdAt:    serverTimestamp(),
      });
      setForm(blankForm());
      setShow(false);
    } catch (err) {
      console.error(err);
      setError("Could not save the item. Please try again.");
    }
    setSaving(false);
  }

  async function moveStage(item, dir) {
    const idx = STAGES.indexOf(item.stage);
    const next = idx + dir;
    if (idx === -1 || next < 0 || next >= STAGES.length) return;
    await updateDoc(doc(db, "pipeline", item.id), { stage: STAGES[next] });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this pipeline item?")) return;
    await deleteDoc(doc(db, "pipeline", id));
  }

  async function addComment(item) {
    const text = commentText.trim();
    if (!text) return;
    await updateDoc(doc(db, "pipeline", item.id), {
      comments: arrayUnion({
        text,
        byId: profile.id,
        by:   profile.name,
        at:   Date.now(),
      }),
    });
    setCommentText("");
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
          <button
            className={`${styles.sf} ${mineOnly ? styles.activeSF : ""}`}
            onClick={() => setMine((v) => !v)}
            title="Items where you are the author or reviewer"
          >
            ★ My Items
          </button>
        </div>
        <button className={styles.addBtn} onClick={() => setShow((v) => !v)}>
          {showForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>New Pipeline Item</h3>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Basic 4 English — Term 2 Scheme of Work" /></label>
          <div className={styles.row}>
            <label>Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {MATERIAL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Department
              <select value={form.department || profile?.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label>Subject
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.row}>
            {isManager ? (
              <label>Lead Author
                <select value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })}>
                  <option value="">Me ({profile?.name})</option>
                  {members.filter((m) => m.id !== profile?.id).map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label>Lead Author<input value={profile?.name ?? ""} disabled /></label>
            )}
            <label>Reviewer <span className={styles.optional}>(optional)</span>
              <select value={form.reviewerId} onChange={(e) => setForm({ ...form, reviewerId: e.target.value })}>
                <option value="">— None yet —</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.row}>
            {isManager && (
              <label>Stage
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            )}
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
        {filtered.length === 0 && <p className={styles.empty}>No items match this view.</p>}
        {filtered.map((item) => {
          const color    = stageColor(item.stage);
          const stageIdx = STAGES.indexOf(item.stage);
          const canMove  = isManager || item.reviewerId === profile?.id;
          const comments = item.comments ?? [];
          const isOpen   = openComments === item.id;
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
                  {item.subject && <span>📖 {item.subject}</span>}
                  <span>🏫 {item.department}</span>
                  {item.author && <span>✍️ {item.author}</span>}
                  {item.reviewer && <span>🔍 Reviewer: {item.reviewer}</span>}
                  {item.dueDate && <span>📅 Due {formatDate(item.dueDate)}</span>}
                </div>
                {item.notes && <p className={styles.notes}>{item.notes}</p>}
                <div className={styles.progress}>
                  <div className={styles.progressBar} style={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%`, background: color }} />
                </div>

                <button
                  className={styles.commentToggle}
                  onClick={() => { setOpenComments(isOpen ? null : item.id); setCommentText(""); }}
                >
                  💬 {comments.length} comment{comments.length !== 1 ? "s" : ""}
                </button>

                {isOpen && (
                  <div className={styles.comments}>
                    {comments.length === 0 && <p className={styles.empty}>No feedback yet.</p>}
                    {[...comments].sort((a, b) => a.at - b.at).map((c, i) => (
                      <div key={i} className={styles.comment}>
                        <span className={styles.commentBy}>{c.by}</span>
                        <span className={styles.commentAt}>{new Date(c.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                        <p>{c.text}</p>
                      </div>
                    ))}
                    <div className={styles.commentInput}>
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add feedback…"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addComment(item); } }}
                      />
                      <button onClick={() => addComment(item)}>Post</button>
                    </div>
                  </div>
                )}
              </div>

              {canMove && (
                <div className={styles.moveBtns}>
                  {stageIdx > 0 && (
                    <button className={styles.backBtn} onClick={() => moveStage(item, -1)} title="Send back a stage (request changes)">
                      ←
                    </button>
                  )}
                  {stageIdx < STAGES.length - 1 && (
                    <button className={styles.advBtn} onClick={() => moveStage(item, 1)} title="Advance to next stage">
                      →
                    </button>
                  )}
                </div>
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
