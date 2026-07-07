import styles from "./TopBar.module.css";

const PAGE_TITLES = {
  dashboard:   "Dashboard",
  noticeboard: "Noticeboard",
  meetings:    "Meetings",
  polls:       "Polls & Voting",
  pipeline:    "Production Pipeline",
  members:     "Members",
  documents:   "Documents",
};

export default function TopBar({ page, onMenuClick }) {
  return (
    <header className={styles.bar}>
      <button
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
      <h1 className={styles.title}>{PAGE_TITLES[page] ?? page}</h1>
    </header>
  );
}
