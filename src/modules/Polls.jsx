import { useEffect, useState } from "react";
import {
  collection, addDoc, onSnapshot, doc,
  query, orderBy, serverTimestamp, updateDoc, arrayUnion, increment
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Polls.module.css";

export default function Polls() {
  const { profile } = useAuth();
  const [polls, setPolls]   = useState([]);
  const [showForm, setShow] = useState(false);
  const [question, setQ]    = useState("");
  const [options, setOpts]  = useState(["", ""]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setPolls(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const cleanOpts = options.filter((o) => o.trim());
    if (cleanOpts.length < 2) return;
    setSaving(true);
    await addDoc(collection(db, "polls"), {
      question,
      options: cleanOpts.map((text) => ({ text, votes: 0 })),
      voters:     [],
      createdBy:  profile.name,
      createdAt:  serverTimestamp(),
      closed:     false,
    });
    setQ(""); setOpts(["", ""]); setShow(false); setSaving(false);
  }

  async function castVote(poll, optIndex) {
    if (poll.voters?.includes(profile.id)) return;
    if (poll.closed) return;
    const ref = doc(db, "polls", poll.id);
    const updatedOptions = poll.options.map((o, i) =>
      i === optIndex ? { ...o, votes: (o.votes || 0) + 1 } : o
    );
    await updateDoc(ref, {
      options: updatedOptions,
      voters:  arrayUnion(profile.id),
    });
  }

  async function toggleClose(poll) {
    await updateDoc(doc(db, "polls", poll.id), { closed: !poll.closed });
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        {(profile?.role === "founder" || profile?.role === "hod") && (
          <button className={styles.addBtn} onClick={() => setShow((v) => !v)}>
            {showForm ? "Cancel" : "+ Create Poll"}
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleCreate}>
          <h3>New Poll</h3>
          <label>
            Question
            <input value={question} onChange={(e) => setQ(e.target.value)} required />
          </label>
          <fieldset className={styles.optSet}>
            <legend>Options</legend>
            {options.map((o, i) => (
              <div key={i} className={styles.optRow}>
                <input
                  placeholder={`Option ${i + 1}`}
                  value={o}
                  onChange={(e) => {
                    const n = [...options]; n[i] = e.target.value; setOpts(n);
                  }}
                />
                {options.length > 2 && (
                  <button type="button" className={styles.removeOpt}
                    onClick={() => setOpts(options.filter((_, j) => j !== i))}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button type="button" className={styles.addOpt}
                onClick={() => setOpts([...options, ""])}>
                + Add option
              </button>
            )}
          </fieldset>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? "Creating…" : "Create Poll"}
          </button>
        </form>
      )}

      <div className={styles.list}>
        {polls.length === 0 && <p className={styles.empty}>No polls yet.</p>}
        {polls.map((poll) => {
          const voted     = poll.voters?.includes(profile?.id);
          const total     = poll.options?.reduce((s, o) => s + (o.votes || 0), 0) || 0;
          const showResults = voted || poll.closed;

          return (
            <div key={poll.id} className={`${styles.card} ${poll.closed ? styles.closed : ""}`}>
              <div className={styles.cardHead}>
                <h4 className={styles.question}>{poll.question}</h4>
                {poll.closed && <span className={styles.closedBadge}>Closed</span>}
              </div>

              <div className={styles.options}>
                {poll.options?.map((opt, i) => {
                  const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                  return (
                    <button
                      key={i}
                      className={`${styles.optBtn} ${showResults ? styles.resultMode : ""}`}
                      onClick={() => !showResults && castVote(poll, i)}
                      disabled={showResults || poll.closed}
                    >
                      <span className={styles.optText}>{opt.text}</span>
                      {showResults && (
                        <>
                          <span className={styles.pct}>{pct}%</span>
                          <div className={styles.bar} style={{ width: `${pct}%` }} />
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className={styles.cardFoot}>
                <span>{total} vote{total !== 1 ? "s" : ""} · by {poll.createdBy}</span>
                {profile?.role === "founder" && (
                  <button className={styles.closeBtn} onClick={() => toggleClose(poll)}>
                    {poll.closed ? "Reopen" : "Close Poll"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
