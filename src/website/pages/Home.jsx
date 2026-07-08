import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const WHY = [
  { icon: "📐", title: "NaCCA/GES Aligned",       body: "Every material cites the exact content standard and performance indicator codes from the NaCCA Basic School Curriculum — no guesswork." },
  { icon: "🏫", title: "Classroom-Tested",         body: "Materials are piloted in real Ghanaian classrooms by our teacher-authors before release. What you receive has already worked in practice." },
  { icon: "✅", title: "Quality Reviewed",          body: "Each material passes a nine-stage production workflow including curriculum alignment check, editorial review, and senior sign-off before publication." },
  { icon: "📚", title: "Full Coverage",             body: "Materials span Pre-School through JHS — Nursery, KG, Basic 1–9 — covering all core subjects across every level of the basic school system." },
  { icon: "🤝", title: "Teacher-Led",               body: "Beacon is a teacher-owned partnership. We are not a distant publisher — we are educators who understand exactly what schools and teachers need." },
  { icon: "💰", title: "School-Friendly Pricing",   body: "Priced to be accessible to Ghanaian basic schools. We keep our costs lean so that quality materials are within reach of every school's budget." },
];

const MATERIALS = [
  { id:1, dept:"lower-primary", deptLabel:"Lower Primary · Basic 1–3",  title:"English Language Scheme of Work",   subject:"English Language",   grade:"Basic 1, 2 & 3", price:"GH₵ 25" },
  { id:2, dept:"lower-primary", deptLabel:"Lower Primary · Basic 1–3",  title:"Mathematics Scheme of Work",        subject:"Mathematics",         grade:"Basic 1, 2 & 3", price:"GH₵ 25" },
  { id:3, dept:"upper-primary", deptLabel:"Upper Primary · Basic 4–6",  title:"English Language Scheme of Work",   subject:"English Language",   grade:"Basic 4, 5 & 6", price:"GH₵ 25" },
  { id:4, dept:"upper-primary", deptLabel:"Upper Primary · Basic 4–6",  title:"Computing Scheme of Work",          subject:"Computing",           grade:"Basic 4, 5 & 6", price:"GH₵ 25" },
  { id:5, dept:"upper-primary", deptLabel:"Upper Primary · Basic 4–6",  title:"Integrated Science Scheme of Work", subject:"Integrated Science",  grade:"Basic 4, 5 & 6", price:"GH₵ 25" },
  { id:6, dept:"jhs",           deptLabel:"JHS · Basic 7–9",            title:"English Language Scheme of Work",   subject:"English Language",   grade:"Basic 7, 8 & 9", price:"GH₵ 30" },
  { id:7, dept:"jhs",           deptLabel:"JHS · Basic 7–9",            title:"Integrated Science Scheme of Work", subject:"Integrated Science",  grade:"Basic 7, 8 & 9", price:"GH₵ 30" },
  { id:8, dept:"pre-school",    deptLabel:"Pre-School · Nursery & KG",  title:"Early Childhood Activity Plan",     subject:"Early Childhood",    grade:"Nursery & KG",   price:"GH₵ 20" },
];

const FILTERS = [
  { key: "all",           label: "All levels"     },
  { key: "pre-school",    label: "Pre-School"     },
  { key: "lower-primary", label: "Lower Primary"  },
  { key: "upper-primary", label: "Upper Primary"  },
  { key: "jhs",           label: "JHS"            },
];

export default function Home() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const shown = filter === "all" ? MATERIALS : MATERIALS.filter((m) => m.dept === filter);

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBgPattern} aria-hidden="true" />
        <div className={styles.heroGoldBar} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>🏮 &nbsp;Teacher-led · Ghana-rooted · NaCCA aligned</div>
          <h1>
            Quality academic materials for every<br />
            <span className={styles.gold}>Ghanaian classroom</span>
          </h1>
          <p>Beacon Educational Consult develops and supplies NaCCA/GES-aligned Schemes of Work, Lesson Notes, Examination Questions, Textbooks, and Workbooks — created by practicing teachers, for practicing teachers.</p>
          <div className={styles.heroBtns}>
            <Link to="/catalogue" className={styles.btnGold}>Browse materials</Link>
            <Link to="/contact"   className={styles.btnOutline}>Contact us</Link>
          </div>
          <div className={styles.heroStats}>
            <div><span className={styles.statVal}>4</span><span className={styles.statLbl}>Departments covered</span></div>
            <div><span className={styles.statVal}>11</span><span className={styles.statLbl}>Grade levels</span></div>
            <div><span className={styles.statVal}>100%</span><span className={styles.statLbl}>NaCCA aligned</span></div>
          </div>
        </div>
      </section>

      {/* ── Why Beacon ── */}
      <section className={styles.whySection}>
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Why choose us</p>
          <h2>Built by teachers, <span className={styles.goldUnderline}>for teachers</span></h2>
          <p className={styles.sectionSub}>Every material Beacon produces is authored by currently practising classroom teachers and goes through a rigorous multi-stage review before it reaches your school.</p>
          <div className={styles.whyGrid}>
            {WHY.map((w) => (
              <div key={w.title} className={styles.whyCard}>
                <div className={styles.whyIcon}>{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Materials ── */}
      <section className={styles.materialsSection}>
        <div className={styles.inner}>
          <p className={styles.sectionEyebrow}>Our catalogue</p>
          <h2>Schemes of Work</h2>
          <p className={styles.sectionSub}>Fully NaCCA-aligned termly Schemes of Work for all subjects and grade levels — ready to use in your school this term.</p>

          <div className={styles.filterBar}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${filter === f.key ? styles.activeFilter : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={styles.materialsGrid}>
            {shown.map((m) => (
              <div key={m.id} className={styles.matCard}>
                <div className={styles.matCardTop}>
                  <div className={styles.matDept}>{m.deptLabel}</div>
                  <div className={styles.matTitle}>{m.title}</div>
                  <span className={styles.matBadge}>Scheme of Work</span>
                </div>
                <div className={styles.matCardBody}>
                  <div className={styles.matTags}>
                    <span className={`${styles.tag} ${styles.tagSubject}`}>{m.subject}</span>
                    <span className={`${styles.tag} ${styles.tagGrade}`}>{m.grade}</span>
                    <span className={`${styles.tag} ${styles.tagTerm}`}>All Terms</span>
                    <span className={`${styles.tag} ${styles.tagNacca}`}>NaCCA aligned</span>
                  </div>
                </div>
                <div className={styles.matCardFoot}>
                  <div>
                    <span className={styles.matPrice}>{m.price}</span>
                    <span className={styles.matUnit}> / term</span>
                  </div>
                  <button className={styles.orderBtn} onClick={() => navigate("/contact")}>
                    Order now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.comingSoon}>
            <strong>More subjects coming soon.</strong> Lesson Notes, Examination Questions, Textbooks, and Workbooks are currently in production.
            <Link to="/contact"> Request a specific subject →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Ready to equip your school?</h2>
          <p>Browse the full catalogue or get in touch — we're happy to discuss bulk orders and school partnerships.</p>
          <div className={styles.ctaBtns}>
            <Link to="/catalogue" className={styles.btnGold}>Browse Catalogue</Link>
            <Link to="/contact"   className={styles.btnOutlineLight}>Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
