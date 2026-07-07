import { Link } from "react-router-dom";
import styles from "./Events.module.css";

const UPCOMING = [
  {
    id: 1,
    title: "NaCCA Curriculum Alignment Workshop",
    type: "Workshop",
    date: "2026-08-15",
    venue: "Accra — venue TBC",
    desc: "A hands-on session covering how to map lesson plans and schemes of work directly to NaCCA content and performance indicators. Open to all basic school teachers.",
    audience: "All teachers",
  },
];

const PAST = [
  {
    id: 101,
    title: "Beacon Founding Partner Seminar",
    type: "Seminar",
    date: "2026-01-10",
    venue: "Online",
    desc: "Inaugural seminar bringing together founding partners to align on curriculum approach and production standards.",
    audience: "Partners only",
  },
];

export default function Events() {
  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Workshops &amp; Events</h1>
          <p>Professional development for Ghanaian educators — open to all basic school teachers, not just Beacon partners.</p>
        </div>
      </section>

      <div className={styles.body}>

        <section className={styles.section}>
          <h2>Upcoming Events</h2>
          {UPCOMING.length === 0 ? (
            <div className={styles.empty}>
              <span>📅</span>
              <p>No upcoming events at the moment. Check back soon or <Link to="/contact">contact us</Link> to register your interest.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {UPCOMING.map((e) => <EventCard key={e.id} event={e} upcoming />)}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Past Events</h2>
          {PAST.length === 0 ? (
            <p className={styles.noItems}>No past events recorded yet.</p>
          ) : (
            <div className={styles.list}>
              {PAST.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </section>

        <section className={styles.hostCta}>
          <div className={styles.ctaInner}>
            <span>🏫</span>
            <div>
              <h3>Want Beacon to run a session at your school or circuit?</h3>
              <p>We can organise tailored workshops on curriculum planning, material development, or exam design for your staff.</p>
            </div>
            <Link to="/contact" className={styles.ctaBtn}>Get in Touch</Link>
          </div>
        </section>

      </div>
    </div>
  );
}

function EventCard({ event, upcoming }) {
  return (
    <div className={`${styles.card} ${upcoming ? styles.upcomingCard : styles.pastCard}`}>
      <div className={styles.cardLeft}>
        <span className={styles.typeBadge}>{event.type}</span>
        <div className={styles.dateBox}>
          <span className={styles.month}>{formatMonth(event.date)}</span>
          <span className={styles.day}>{formatDay(event.date)}</span>
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3>{event.title}</h3>
        <div className={styles.meta}>
          <span>📍 {event.venue}</span>
          <span>👥 {event.audience}</span>
        </div>
        <p>{event.desc}</p>
        {upcoming && (
          <Link to="/contact" className={styles.registerBtn}>Register Interest →</Link>
        )}
      </div>
    </div>
  );
}

function formatMonth(str) {
  return new Date(str + "T12:00:00").toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
}
function formatDay(str) {
  return new Date(str + "T12:00:00").getDate();
}
