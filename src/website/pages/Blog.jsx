import { useState } from "react";
import styles from "./Blog.module.css";

const POSTS = [
  {
    id: 1,
    title: "Why schemes of work need to reference NaCCA indicators — not just topics",
    category: "Curriculum",
    date: "2026-06-10",
    author: "Beacon Editorial",
    excerpt: "Many schemes of work list topic titles and week numbers but stop short of naming the NaCCA content and performance indicators they address. Here's why that gap matters and how to close it.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The difference between Lesson Notes and a Lesson Plan — and why it matters for teachers",
    category: "Teaching Practice",
    date: "2026-05-22",
    author: "Beacon Editorial",
    excerpt: "Teachers are often asked to submit lesson plans, but what schools actually need are lesson notes — structured, reusable guides that support consistent delivery across classrooms.",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "How Beacon's nine-stage production workflow ensures material quality",
    category: "About Beacon",
    date: "2026-04-15",
    author: "Beacon Editorial",
    excerpt: "Every material we release has passed through nine stages — from initial planning and curriculum mapping through peer review, pilot use, and final sign-off. Here's what each stage involves.",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Understanding the NaCCA strand structure in Mathematics: a practical guide",
    category: "Subject Guidance",
    date: "2026-03-08",
    author: "Beacon Editorial",
    excerpt: "NaCCA Mathematics is organised into five strands. Understanding how they interact across grade levels is essential for planning coherent, cumulative learning progressions.",
    readTime: "7 min read",
  },
];

const CATEGORIES = ["All", "Curriculum", "Teaching Practice", "Subject Guidance", "About Beacon"];

export default function Blog() {
  const [cat, setCat] = useState("All");

  const filtered = cat === "All" ? POSTS : POSTS.filter((p) => p.category === cat);

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Blog &amp; Resources</h1>
          <p>Curriculum guidance, teaching practice insights, and updates from the Beacon team.</p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.filters}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`${styles.catBtn} ${cat === c ? styles.activeCat : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((post) => (
            <article key={post.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.catTag}>{post.category}</span>
                <span className={styles.readTime}>{post.readTime}</span>
              </div>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <div className={styles.cardFoot}>
                <span className={styles.meta}>{post.author} · {formatDate(post.date)}</span>
                <button className={styles.readBtn} disabled title="Full posts coming soon">
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span>📭</span>
            <p>No posts in this category yet.</p>
          </div>
        )}

        <div className={styles.comingSoon}>
          <p>📬 More posts coming regularly. Content covers NaCCA curriculum guidance, classroom strategies, and updates from Beacon.</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(str) {
  return new Date(str + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
