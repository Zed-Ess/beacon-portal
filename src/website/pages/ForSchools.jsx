import { Link } from "react-router-dom";
import styles from "./ForSchools.module.css";

const STEPS = [
  { n: "1", title: "Browse the catalogue",      body: "Find the materials your school needs — filter by department, subject, grade level, or material type." },
  { n: "2", title: "Send an enquiry",            body: "Use our contact form or email us directly with your order details. We'll confirm availability and pricing." },
  { n: "3", title: "Receive your materials",     body: "Materials are delivered as print-ready PDFs. Bulk print arrangements can be discussed." },
  { n: "4", title: "Use in your classrooms",     body: "Start using NaCCA-aligned materials straight away. No further preparation required." },
];

const FAQS = [
  { q: "Are materials approved by NaCCA?",         a: "Textbooks and Workbooks go through the NaCCA evaluation process. Schemes of Work, Lesson Notes, and Exam Questions are aligned to the NaCCA curriculum but do not require separate approval." },
  { q: "Can we get a preview before buying?",       a: "Yes — contact us and we'll share a sample extract of any material so you can assess it before ordering." },
  { q: "Do you offer bulk discounts for schools?",  a: "Yes. Schools ordering multiple materials or making annual agreements receive preferential pricing. Get in touch to discuss." },
  { q: "What format are materials delivered in?",   a: "All materials are delivered as high-resolution print-ready PDFs. If you need physical printed copies, we can discuss printing arrangements." },
  { q: "Can you develop materials for our specific circuit or district?", a: "Yes — contact us to discuss custom material development tailored to your school or circuit's needs." },
];

export default function ForSchools() {
  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>For Schools</h1>
          <p>Everything your school needs to deliver the NaCCA curriculum — written by teachers who know your context.</p>
          <Link to="/contact" className={styles.heroBtn}>Make an Enquiry →</Link>
        </div>
      </section>

      {/* What schools get */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2>What your school gets</h2>
          <p className={styles.sub}>Practical, curriculum-ready materials across all subjects and departments</p>
          <div className={styles.benefitsGrid}>
            {[
              { icon: "📋", title: "Ready-to-use Schemes of Work",   body: "Term plans mapped directly to NaCCA indicators for every subject and grade level." },
              { icon: "📝", title: "Structured Lesson Notes",         body: "Detailed lesson plans your teachers can follow immediately — no extra preparation." },
              { icon: "📄", title: "End-of-Term Exam Questions",      body: "Well-structured assessments with marking schemes, saving teachers hours of preparation time." },
              { icon: "📚", title: "Textbooks & Workbooks",           body: "Core learner materials for independent study and classroom use." },
              { icon: "🗓️", title: "Annual updates",                  body: "Materials are versioned and revised annually as the curriculum evolves." },
              { icon: "📦", title: "Bulk ordering",                   body: "Order across multiple grade levels and subjects in one request with preferential pricing." },
            ].map((b) => (
              <div key={b.title} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>{b.icon}</span>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.stepsSection}>
        <div className={styles.inner}>
          <h2>How to order</h2>
          <p className={styles.sub}>Simple, four-step process</p>
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.stepsCta}>
            <Link to="/catalogue" className={styles.btnPrimary}>Browse Catalogue</Link>
            <Link to="/contact"   className={styles.btnOutline}>Contact Us</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h2>Frequently Asked Questions</h2>
          <p className={styles.sub}>Common questions from schools</p>
          <div className={styles.faqs}>
            {FAQS.map((f) => (
              <details key={f.q} className={styles.faq}>
                <summary className={styles.faqQ}>{f.q}</summary>
                <p className={styles.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
