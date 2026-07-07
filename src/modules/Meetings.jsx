import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Meetings.module.css";

const TYPES  = ["General", "Departmental", "Emergency", "Planning"];
const DEPTS  = ["All Departments","Mathematics","English","Science","Social Studies","ICT","Creative Arts","French"];

export default function Meetings() {
  const { profile } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab]           = useState("upcoming"); // upcoming | past
  const [form, setForm]         = useState({
    title: "", date: "", time: "", venue: "",
    type: "General", audience: "All Departments", agenda: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "meetings"), orderBy("date", "desc"));
    return onSnapshot(q, (snap) => {
      setMeetings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const now      = new Date();
  const upcoming = meetings.filter((m) => new Date(`${m.date}T${m.time}`) >= now);
  const past     = meetings.filter((m) => new Date(`${m.date}T${m.time}`) <  now);
  const shown    = tab === "upcoming" ? upcoming : past;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await addDoc(collection(db, "meetings"), {
      ...form,
      createdBy: profile.name,
      createdAt: serverTimestamp(),
    });
    setForm({ title: "", date: "", time: "", venue: "", type: "General", audience: "All Departments", agenda: "" });
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this meeting?")) return;
    await deleteDoc(doc(db, "meetings", id));
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button className={tab === "upcoming" ? styles.activeTab : ""} onClick={() => setTab("upcoming")}>
            Upcoming ({upcoming.length})
          </button>
          <button className={tab === "past" ? styles.activeTab : ""} onClick={() => setTab("past")}>
            Past ({past.length})
          </button>
        </div>
        {(profile?.role === "founder" || profile?.role === "hod") && (
          <button className={styles.addBtn} onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ Schedule Meeting"}
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>New Meeting</h3>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <div className={styles.row}>
            <label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
            <label>Time<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required /></label>
          </div>
          <label>Venue<input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required /></label>
          <div className={styles.row}>
            <label>Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Audience
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                {DEPTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
          </div>
          <label>Agenda<textarea rows={3} value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} /></label>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? "Saving…" : "Schedule"}
          </button>
        </form>
      )}

      <div className={styles.list}>
        {shown.length === 0 && <p className={styles.empty}>No {tab} meetings.</p>}
        {shown.map((m) => (
          <div key={m.id} className={`${styles.card} ${tab === "past" ? styles.pastCard : ""}`}>
            <div className={styles.cardHead}>
              <span className={styles.typeBadge}>{m.type}</span>
              <span className={styles.audience}>{m.audience}</span>
              {profile?.role === "founder" && (
                <button className={styles.del} onClick={() => handleDelete(m.id)}>✕</button>
              )}
            </div>
            <h4 className={styles.cardTitle}>{m.title}</h4>
            <div className={styles.meta}>
              <span>📅 {formatDate(m.date)}</span>
              <span>🕐 {m.time}</span>
              <span>📍 {m.venue}</span>
            </div>
            {m.agenda && <p className={styles.agenda}>{m.agenda}</p>}
            <p className={styles.by}>Scheduled by {m.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
