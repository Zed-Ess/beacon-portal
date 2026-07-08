import { useEffect, useState } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { SUBJECTS, CLASSES, TERMS, DEPARTMENTS } from "../constants";
import { CURRICULUM } from "../curriculum";
import styles from "./Builder.module.css";

/* Drill-down picker over the bundled NaCCA curriculum data:
   Strand → Sub-Strand → Content Standard → Indicators → auto-fill the form. */
function CurriculumPicker({ className, subject, onApply }) {
  const [si, setSi]         = useState("");
  const [bi, setBi]         = useState("");
  const [ci, setCi]         = useState("");
  const [picked, setPicked] = useState([]);

  const strands = CURRICULUM[className]?.[subject];
  if (!strands) {
    return (
      <p className={styles.pickerHint}>
        No curriculum data loaded yet for <b>{className} · {subject}</b> — fill the fields manually,
        or ask the Founder to add this curriculum.
      </p>
    );
  }

  const strand = si !== "" ? strands[+si] : null;
  const sub    = bi !== "" ? strand?.subStrands[+bi] : null;
  const std    = ci !== "" ? sub?.standards[+ci] : null;

  const togglePick = (code) =>
    setPicked((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));

  function apply() {
    if (!std) return;
    const chosen = std.indicators.filter((ind) => picked.length === 0 || picked.includes(ind.code));
    onApply({
      strand:     strand.name,
      subStrand:  sub.name,
      standard:   `${std.code} — ${std.title}`,
      indicators: chosen.map((ind) => `${ind.code} — ${ind.text}`).join("\n"),
    });
    setPicked([]);
  }

  return (
    <div className={styles.picker}>
      <div className={styles.pickerHead}>📚 Pick from the NaCCA {className} {subject} curriculum</div>
      <div className={styles.pickerRow}>
        <select value={si} onChange={(e) => { setSi(e.target.value); setBi(""); setCi(""); setPicked([]); }}>
          <option value="">Strand…</option>
          {strands.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
        </select>
        <select value={bi} disabled={!strand} onChange={(e) => { setBi(e.target.value); setCi(""); setPicked([]); }}>
          <option value="">Sub-Strand…</option>
          {strand?.subStrands.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
        </select>
        <select value={ci} disabled={!sub} onChange={(e) => { setCi(e.target.value); setPicked([]); }}>
          <option value="">Content Standard…</option>
          {sub?.standards.map((s, i) => <option key={i} value={i}>{s.code} — {s.title.slice(0, 60)}{s.title.length > 60 ? "…" : ""}</option>)}
        </select>
      </div>

      {std && (
        <>
          <p className={styles.pickerStd}><b>{std.code}</b>: {std.title}</p>
          <div className={styles.pickerInds}>
            {std.indicators.map((ind) => (
              <label key={ind.code} className={styles.pickerInd}>
                <input
                  type="checkbox"
                  checked={picked.includes(ind.code)}
                  onChange={() => togglePick(ind.code)}
                />
                <span><b>{ind.code}</b> — {ind.text}</span>
              </label>
            ))}
          </div>
          <button type="button" className={styles.pickerApply} onClick={apply}>
            ⤵ Fill form {picked.length > 0 ? `(${picked.length} indicator${picked.length > 1 ? "s" : ""})` : "(all indicators)"}
          </button>
        </>
      )}
    </div>
  );
}

const blankWeek = () => ({
  week: "", strand: "", subStrand: "", standard: "", indicators: "", resources: ""
});

const blankLesson = () => ({
  week: "", duration: "60 mins", classSize: "", strand: "", subStrand: "",
  standard: "", indicator: "", performance: "", competencies: "", keywords: "",
  tlr: "", starter: "", main: "", plenary: "", assessment: ""
});

const blankDraft = (profile) => ({
  kind: "sow",
  title: "",
  subject: SUBJECTS[0],
  className: CLASSES[3],
  term: TERMS[0],
  department: profile?.department ?? DEPARTMENTS[0],
  weeks: [blankWeek()],
  lesson: blankLesson(),
});

export default function Builder() {
  const { profile } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [view, setView]           = useState("list"); // "list" | "edit"
  const [draft, setDraft]         = useState(blankDraft(profile));
  const [editId, setEditId]       = useState(null);
  const [mineOnly, setMine]       = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  useEffect(() => {
    const q = query(collection(db, "materials"), orderBy("updatedAt", "desc"));
    return onSnapshot(q,
      (snap) => setMaterials(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => { console.error(err); setError("Could not load materials."); }
    );
  }, []);

  const isManager = profile?.role === "founder" || profile?.role === "hod";
  const shown = mineOnly ? materials.filter((m) => m.authorId === profile?.id) : materials;

  function startNew(kind) {
    setDraft({ ...blankDraft(profile), kind });
    setEditId(null);
    setView("edit");
  }

  function startEdit(m) {
    setDraft({
      kind: m.kind,
      title: m.title,
      subject: m.subject,
      className: m.className,
      term: m.term,
      department: m.department,
      weeks: m.weeks?.length ? m.weeks : [blankWeek()],
      lesson: { ...blankLesson(), ...(m.lesson ?? {}) },
    });
    setEditId(m.id);
    setView("edit");
  }

  async function handleSave() {
    if (!draft.title.trim()) { setError("Give the material a title."); return; }
    setError("");
    setSaving(true);
    try {
      const data = {
        ...draft,
        author:    profile.name,
        authorId:  editId ? undefined : profile.id,
        updatedAt: serverTimestamp(),
      };
      if (editId) {
        delete data.authorId; // keep original author
        await updateDoc(doc(db, "materials", editId), data);
      } else {
        await addDoc(collection(db, "materials"), {
          ...data,
          authorId:  profile.id,
          createdAt: serverTimestamp(),
        });
      }
      setView("list");
    } catch (err) {
      console.error(err);
      setError("Could not save. Please try again.");
    }
    setSaving(false);
  }

  async function handleDelete(m) {
    if (!window.confirm(`Delete "${m.title}"?`)) return;
    await deleteDoc(doc(db, "materials", m.id));
  }

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const setLesson = (patch) => setDraft((d) => ({ ...d, lesson: { ...d.lesson, ...patch } }));
  const setWeek = (i, patch) =>
    setDraft((d) => ({ ...d, weeks: d.weeks.map((w, j) => (j === i ? { ...w, ...patch } : w)) }));

  /* ---------------- List view ---------------- */

  if (view === "list") {
    return (
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            <button className={mineOnly ? styles.activeTab : ""} onClick={() => setMine(true)}>My Materials</button>
            <button className={!mineOnly ? styles.activeTab : ""} onClick={() => setMine(false)}>All</button>
          </div>
          <div className={styles.newBtns}>
            <button className={styles.addBtn} onClick={() => startNew("sow")}>+ Scheme of Work</button>
            <button className={styles.addBtn} onClick={() => startNew("lesson")}>+ Lesson Plan</button>
          </div>
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}
        {shown.length === 0 && (
          <p className={styles.empty}>
            {mineOnly ? "You haven't created any materials yet. Start a Scheme of Work or Lesson Plan above." : "No materials yet."}
          </p>
        )}

        <div className={styles.list}>
          {shown.map((m) => (
            <div key={m.id} className={styles.card}>
              <span className={styles.kindTag}>{m.kind === "sow" ? "📅 Scheme of Work" : "📖 Lesson Plan"}</span>
              <div className={styles.cardBody}>
                <h4>{m.title}</h4>
                <div className={styles.meta}>
                  <span>{m.subject}</span>·<span>{m.className}</span>·<span>{m.term}</span>·<span>✍️ {m.author}</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => exportWord(m)} title="Download as Word document">⬇ Word</button>
                {(m.authorId === profile?.id || isManager) && (
                  <>
                    <button onClick={() => startEdit(m)}>✏️ Edit</button>
                    <button className={styles.delBtn} onClick={() => handleDelete(m)}>✕</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- Edit view ---------------- */

  return (
    <div className={styles.page}>
      <div className={styles.editHead}>
        <h3>{editId ? "Edit" : "New"} {draft.kind === "sow" ? "Scheme of Work" : "Lesson Plan"}</h3>
        <div className={styles.editActions}>
          <button className={styles.cancelBtn} onClick={() => setView("list")}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.form}>
        <label>Title
          <input
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder={draft.kind === "sow"
              ? "e.g. Basic 4 English Language — Term 2 Scheme of Work"
              : "e.g. Basic 4 English — Week 3: Reading Comprehension"}
          />
        </label>
        <div className={styles.row}>
          <label>Subject
            <select value={draft.subject} onChange={(e) => set({ subject: e.target.value })}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Class
            <select value={draft.className} onChange={(e) => set({ className: e.target.value })}>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Term
            <select value={draft.term} onChange={(e) => set({ term: e.target.value })}>
              {TERMS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Department
            <select value={draft.department} onChange={(e) => set({ department: e.target.value })}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
        </div>

        {draft.kind === "sow" ? (
          <>
            <h4 className={styles.sectionTitle}>Weekly Plan</h4>
            {draft.weeks.map((w, i) => (
              <div key={i} className={styles.weekBlock}>
                <div className={styles.weekHead}>
                  <strong>Week {w.week || i + 1}</strong>
                  {draft.weeks.length > 1 && (
                    <button
                      className={styles.delBtn}
                      onClick={() => setDraft((d) => ({ ...d, weeks: d.weeks.filter((_, j) => j !== i) }))}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                <CurriculumPicker
                  key={`${draft.className}|${draft.subject}`}
                  className={draft.className}
                  subject={draft.subject}
                  onApply={(vals) => setWeek(i, vals)}
                />
                <div className={styles.row}>
                  <label>Week No.<input value={w.week} onChange={(e) => setWeek(i, { week: e.target.value })} placeholder={`${i + 1}`} /></label>
                  <label>Strand<input value={w.strand} onChange={(e) => setWeek(i, { strand: e.target.value })} /></label>
                  <label>Sub-Strand<input value={w.subStrand} onChange={(e) => setWeek(i, { subStrand: e.target.value })} /></label>
                </div>
                <label>Content Standard<input value={w.standard} onChange={(e) => setWeek(i, { standard: e.target.value })} placeholder="e.g. B4.1.1.1" /></label>
                <label>Indicator(s)<textarea rows={2} value={w.indicators} onChange={(e) => setWeek(i, { indicators: e.target.value })} placeholder="e.g. B4.1.1.1.1 — …" /></label>
                <label>Resources<input value={w.resources} onChange={(e) => setWeek(i, { resources: e.target.value })} placeholder="e.g. Textbook, word cards, chart" /></label>
              </div>
            ))}
            <button
              className={styles.addWeekBtn}
              onClick={() => setDraft((d) => ({ ...d, weeks: [...d.weeks, blankWeek()] }))}
            >
              + Add Week
            </button>
          </>
        ) : (
          <>
            <h4 className={styles.sectionTitle}>Lesson Details</h4>
            <CurriculumPicker
              key={`${draft.className}|${draft.subject}`}
              className={draft.className}
              subject={draft.subject}
              onApply={(vals) => setLesson({
                strand:    vals.strand,
                subStrand: vals.subStrand,
                standard:  vals.standard,
                indicator: vals.indicators,
              })}
            />
            <div className={styles.row}>
              <label>Week<input value={draft.lesson.week} onChange={(e) => setLesson({ week: e.target.value })} /></label>
              <label>Duration<input value={draft.lesson.duration} onChange={(e) => setLesson({ duration: e.target.value })} /></label>
              <label>Class Size<input value={draft.lesson.classSize} onChange={(e) => setLesson({ classSize: e.target.value })} /></label>
            </div>
            <div className={styles.row}>
              <label>Strand<input value={draft.lesson.strand} onChange={(e) => setLesson({ strand: e.target.value })} /></label>
              <label>Sub-Strand<input value={draft.lesson.subStrand} onChange={(e) => setLesson({ subStrand: e.target.value })} /></label>
            </div>
            <label>Content Standard<input value={draft.lesson.standard} onChange={(e) => setLesson({ standard: e.target.value })} placeholder="e.g. B4.1.1.1" /></label>
            <label>Indicator(s)<textarea rows={2} value={draft.lesson.indicator} onChange={(e) => setLesson({ indicator: e.target.value })} placeholder="e.g. B1.1.1.1.1 — …" /></label>
            <label>Performance Indicator<textarea rows={2} value={draft.lesson.performance} onChange={(e) => setLesson({ performance: e.target.value })} placeholder="Learners can …" /></label>
            <div className={styles.row}>
              <label>Core Competencies<input value={draft.lesson.competencies} onChange={(e) => setLesson({ competencies: e.target.value })} placeholder="e.g. CC, CP, PL" /></label>
              <label>Keywords<input value={draft.lesson.keywords} onChange={(e) => setLesson({ keywords: e.target.value })} /></label>
            </div>
            <label>Teaching & Learning Resources (TLRs)<input value={draft.lesson.tlr} onChange={(e) => setLesson({ tlr: e.target.value })} /></label>

            <h4 className={styles.sectionTitle}>Lesson Phases</h4>
            <label>Phase 1 — Starter<textarea rows={3} value={draft.lesson.starter} onChange={(e) => setLesson({ starter: e.target.value })} placeholder="Recap, energiser, introduce the lesson…" /></label>
            <label>Phase 2 — Main (New Learning)<textarea rows={5} value={draft.lesson.main} onChange={(e) => setLesson({ main: e.target.value })} placeholder="Step-by-step learner activities…" /></label>
            <label>Phase 3 — Plenary / Reflection<textarea rows={3} value={draft.lesson.plenary} onChange={(e) => setLesson({ plenary: e.target.value })} placeholder="Review key points, questions, homework…" /></label>
            <label>Assessment<textarea rows={2} value={draft.lesson.assessment} onChange={(e) => setLesson({ assessment: e.target.value })} placeholder="Exercises, observation, oral questions…" /></label>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Word export ---------------- */

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
}

function exportWord(m) {
  const head = `
    <div style="text-align:center">
      <h2 style="margin-bottom:2px">Beacon Educational Consult</h2>
      <h3 style="margin-top:0">${esc(m.title)}</h3>
      <p><b>Subject:</b> ${esc(m.subject)} &nbsp; <b>Class:</b> ${esc(m.className)} &nbsp; <b>Term:</b> ${esc(m.term)} &nbsp; <b>Author:</b> ${esc(m.author)}</p>
    </div>`;

  let body;
  if (m.kind === "sow") {
    const rows = (m.weeks ?? []).map((w, i) => `
      <tr>
        <td>${esc(w.week || i + 1)}</td>
        <td>${esc(w.strand)}</td>
        <td>${esc(w.subStrand)}</td>
        <td>${esc(w.standard)}</td>
        <td>${esc(w.indicators)}</td>
        <td>${esc(w.resources)}</td>
      </tr>`).join("");
    body = `
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%">
        <tr style="background:#f3f4f6">
          <th>Week</th><th>Strand</th><th>Sub-Strand</th><th>Content Standard</th><th>Indicator(s)</th><th>Resources</th>
        </tr>
        ${rows}
      </table>`;
  } else {
    const L = m.lesson ?? {};
    const row = (label, val) => `<tr><td style="width:30%"><b>${label}</b></td><td>${esc(val)}</td></tr>`;
    body = `
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%">
        ${row("Week", L.week)}
        ${row("Duration", L.duration)}
        ${row("Class Size", L.classSize)}
        ${row("Strand", L.strand)}
        ${row("Sub-Strand", L.subStrand)}
        ${row("Content Standard", L.standard)}
        ${row("Indicator", L.indicator)}
        ${row("Performance Indicator", L.performance)}
        ${row("Core Competencies", L.competencies)}
        ${row("Keywords", L.keywords)}
        ${row("TLRs", L.tlr)}
        ${row("Phase 1 — Starter", L.starter)}
        ${row("Phase 2 — Main (New Learning)", L.main)}
        ${row("Phase 3 — Plenary / Reflection", L.plenary)}
        ${row("Assessment", L.assessment)}
      </table>`;
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(m.title)}</title></head>
    <body style="font-family:Calibri,Arial,sans-serif">${head}${body}</body></html>`;

  const blob = new Blob(["﻿" + html], { type: "application/msword" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${m.title.replace(/[^\w\- ]+/g, "").trim() || "material"}.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
}
