import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const SUBJECTS = ["Mathematics","English Language","Integrated Science","Social Studies","Computing","French","Creative Arts","RME","Ghanaian Language","Career Technology"];

const MATERIAL_TYPES = [
  { icon: "📋", label: "Schemes of Work",        desc: "Term-by-term curriculum plans aligned to NaCCA indicators" },
  { icon: "📝", label: "Lesson Notes",            desc: "Structured lesson plans with activities and assessments" },
  { icon: "📄", label: "Exam Questions",          desc: "End-of-term papers with marking schemes" },
  { icon: "📚", label: "Textbooks",               desc: "Comprehensive learner texts across all subjects" },
  { icon: "✏️", label: "Workbooks",               desc: "Guided practice books for independent learner use" },
];

const WHY = [
  { icon: "✅", title: "NaCCA/GES Aligned",      body: "Every material is verified against the NaCCA curriculum framework before release." },
  { icon: "👩‍🏫", title: "By Practicing Teachers", body: "Written and reviewed by experienced educators currently in Ghanaian classrooms." },
  { icon: "🔍", title: "Peer Reviewed",           body: "All materials pass a multi-stage internal review before reaching schools." },
  { icon: "📦", title: "Ready to Use",            body: "Formatted and print-ready. No extra preparation needed." },
];

export default function Home() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>NaCCA / GES Aligned</span>
          <h1>Quality teaching materials for Ghanaian basic schools</h1>
          <p>Beacon Educational Consult produces curriculum-aligned Schemes of Work, Lesson Notes, Exam Questions, Textbooks, and Workbooks — developed by practicing teachers, peer-reviewed, and ready to use.</p>
          <div className={styles.heroBtns}>
            <Link to="/catalogue" className={styles.btnPrimary}>Browse Catalogue</Link>
            <Link to="/about" className={styles.btnOutline}>Learn About Us</Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <span className={styles.heroLamp}>🏮</span>
            <span className={styles.heroCardTitle}>Beacon Educational Consult</span>
            <span className={styles.heroCardSub}>Advancing education in Ghanaian basic schools</span>
          </div>
        </div>
      </section>

      {/* Material types */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2>What we produce</h2>
          <p className={styles.sectionSub}>Five types of curriculum materials, covering Pre-School through JHS</p>
          <div className={styles.typesGrid}>
            {MATERIAL_TYPES.map((t) => (
              <div key={t.label} className={styles.typeCard}>
                <span className={styles.typeIcon}>{t.icon}</span>
                <h3>{t.label}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects strip */}
      <section className={styles.subjectsStrip}>
        <div className={styles.sectionInner}>
          <p className={styles.stripLabel}>Subjects covered</p>
          <div className={styles.subjects}>
            {SUBJECTS.map((s) => (
              <span key={s} className={styles.subjectChip}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Beacon */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2>Why schools choose Beacon</h2>
          <p className={styles.sectionSub}>Every material meets a high bar before it reaches you</p>
          <div className={styles.whyGrid}>
            {WHY.map((w) => (
              <div key={w.title} className={styles.whyCard}>
                <span className={styles.whyIcon}>{w.icon}</span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className={styles.deptSection}>
        <div className={styles.sectionInner}>
          <h2>Four departments. Full coverage.</h2>
          <p className={styles.sectionSub}>Materials for every stage of basic school education</p>
          <div className={styles.deptGrid}>
            {[
              { label: "Pre-School",    levels: "Nursery & Kindergarten", color: "#f59e0b" },
              { label: "Lower Primary", levels: "Basic 1 – 3",            color: "#10b981" },
              { label: "Upper Primary", levels: "Basic 4 – 6",            color: "#3b82f6" },
              { label: "JHS",           levels: "Basic 7 – 9",            color: "#8b5cf6" },
            ].map((d) => (
              <div key={d.label} className={styles.deptCard} style={{ "--dc": d.color }}>
                <span className={styles.deptLabel}>{d.label}</span>
                <span className={styles.deptLevels}>{d.levels}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Ready to equip your school?</h2>
          <p>Browse our full catalogue or get in touch — we're happy to discuss bulk orders and school partnerships.</p>
          <div className={styles.ctaBtns}>
            <Link to="/catalogue" className={styles.btnPrimary}>Browse Catalogue</Link>
            <Link to="/contact" className={styles.btnOutlineLight}>Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
