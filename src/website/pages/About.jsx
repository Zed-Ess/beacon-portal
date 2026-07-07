import styles from "./About.module.css";

const TEAM = [
  { name: "Founder / Coordinator", role: "English Language · Computing · Integrated Science", initial: "F" },
];

const VALUES = [
  { icon: "🎓", title: "Curriculum Integrity",   body: "Every material is built from the NaCCA/GES framework — not adapted from foreign curricula." },
  { icon: "🤝", title: "Collaboration",           body: "Our materials are produced collectively. Every draft is reviewed by a second teacher before release." },
  { icon: "📈", title: "Continuous Improvement",  body: "Materials are versioned and updated at least annually as the curriculum evolves." },
  { icon: "🌍", title: "Wider Impact",            body: "Beyond materials, we run workshops and seminars to strengthen the broader teaching profession in Ghana." },
];

export default function About() {
  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <img src="/beacon-portal/beaconlogo.png" alt="Beacon Educational Consult" className={styles.lamp} />
          <h1>About Beacon Educational Consult</h1>
          <p>A partnership of practicing Ghanaian teachers, building the curriculum materials our schools actually need.</p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.missionGrid}>
            <div>
              <h2>Our Mission</h2>
              <p>Beacon Educational Consult exists to advance the quality of education in Ghanaian basic schools by producing high-quality, NaCCA-aligned teaching and learning materials — and by developing the professional capacity of the teachers who use them.</p>
              <p>We were founded on a simple observation: the best curriculum materials come from teachers who are currently in classrooms, who understand the daily realities of teaching in Ghana, and who are held accountable to each other through peer review.</p>
              <p>Everything we produce is written by practicing teachers, checked against the NaCCA curriculum framework, reviewed by a second subject specialist, and released only when it meets our internal quality standard.</p>
            </div>
            <div className={styles.missionStats}>
              {[
                { value: "4",    label: "Academic departments" },
                { value: "9",    label: "Grade levels covered" },
                { value: "10+",  label: "Subjects" },
                { value: "5",    label: "Material types" },
              ].map((s) => (
                <div key={s.label} className={styles.statBox}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLbl}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.inner}>
          <h2>What we stand for</h2>
          <p className={styles.sub}>The principles that shape how we work</p>
          <div className={styles.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production process */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2>How we produce materials</h2>
          <p className={styles.sub}>Every material follows a nine-stage workflow from concept to classroom</p>
          <div className={styles.stagesGrid}>
            {[
              "Planning & Assignment","Drafting","Curriculum Alignment Check",
              "Editorial Review","Pilot Use","Approval & Release",
              "NaCCA Submission*","Distribution & Sales","Revision Cycle"
            ].map((s, i) => (
              <div key={s} className={styles.stage}>
                <span className={styles.stageNum}>{i + 1}</span>
                <span className={styles.stageName}>{s}</span>
              </div>
            ))}
          </div>
          <p className={styles.note}>* NaCCA submission applies to Textbooks and Workbooks only.</p>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.inner}>
          <h2>Our Partners</h2>
          <p className={styles.sub}>Experienced educators working together</p>
          <div className={styles.teamGrid}>
            {TEAM.map((m) => (
              <div key={m.name} className={styles.teamCard}>
                <div className={styles.teamAvatar}>{m.initial}</div>
                <div>
                  <span className={styles.teamName}>{m.name}</span>
                  <span className={styles.teamRole}>{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
