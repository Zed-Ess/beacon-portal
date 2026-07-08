import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./Enquiries.module.css";

export default function Enquiries() {
  const { profile } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter]       = useState("unread"); // unread | all
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => {
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setEnquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  async function markRead(id) {
    await updateDoc(doc(db, "enquiries", id), { read: true });
  }

  if (profile?.role !== "founder" && profile?.role !== "hod") {
    return <div className={styles.page}><p className={styles.denied}>Only the Founder and HoDs can view enquiries.</p></div>;
  }

  const shown = filter === "unread"
    ? enquiries.filter((e) => !e.read)
    : enquiries;

  const unreadCount = enquiries.filter((e) => !e.read).length;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button className={filter === "unread" ? styles.activeTab : ""} onClick={() => setFilter("unread")}>
            Unread {unreadCount > 0 && <span className={styles.dot} />}
          </button>
          <button className={filter === "all" ? styles.activeTab : ""} onClick={() => setFilter("all")}>
            All ({enquiries.length})
          </button>
        </div>
      </div>

      {shown.length === 0 && (
        <p className={styles.empty}>{filter === "unread" ? "No unread enquiries." : "No enquiries yet."}</p>
      )}

      <div className={styles.list}>
        {shown.map((e) => (
          <div key={e.id} className={`${styles.card} ${!e.read ? styles.unread : ""}`}>
            <div
              className={styles.cardHead}
              onClick={() => {
                setExpanded(expanded === e.id ? null : e.id);
                if (!e.read) markRead(e.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(k) => k.key === "Enter" && setExpanded(expanded === e.id ? null : e.id)}
            >
              <div className={styles.headLeft}>
                {!e.read && <span className={styles.unreadDot} aria-label="Unread" />}
                <div>
                  <span className={styles.senderName}>{e.name}</span>
                  {e.school && <span className={styles.school}> · {e.school}</span>}
                </div>
                <span className={`${styles.reasonTag}`}>{e.reason}</span>
              </div>
              <div className={styles.headRight}>
                <span className={styles.date}>{formatDate(e.createdAt?.toDate?.())}</span>
                <span className={styles.chevron}>{expanded === e.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === e.id && (
              <div className={styles.cardBody}>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Email</span>
                  <a href={`mailto:${e.email}`} className={styles.email}>{e.email}</a>
                </div>
                {e.school && (
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>School</span>
                    <span>{e.school}</span>
                  </div>
                )}
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Reason</span>
                  <span>{e.reason}</span>
                </div>
                <div className={styles.message}>
                  <span className={styles.detailLabel}>Message</span>
                  <p>{e.message}</p>
                </div>
                <a href={`mailto:${e.email}?subject=Re: ${encodeURIComponent(e.reason)}`} className={styles.replyBtn}>
                  📧 Reply by email
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
