import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Catalogue.module.css";

const TYPES = ["All","Schemes of Work","Lesson Notes","Exam Questions","Textbook","Workbook"];
const DEPTS = ["All","Pre-School","Lower Primary","Upper Primary","JHS"];
const SUBJECTS = ["All","Mathematics","English Language","Integrated Science","Social Studies","Computing","French","Creative Arts","RME","Ghanaian Language","Career Technology"];

// Sample catalogue items — replace with Firestore data when ready
const ITEMS = [
  { id:1, title:"B1-B3 Mathematics Scheme of Work – Term 1", type:"Schemes of Work", dept:"Lower Primary", subject:"Mathematics",      price:"GH₵ 25", stage:"Available" },
  { id:2, title:"B4-B6 English Language Scheme of Work – Term 1", type:"Schemes of Work", dept:"Upper Primary",  subject:"English Language", price:"GH₵ 25", stage:"Available" },
  { id:3, title:"B7-B9 Integrated Science Scheme of Work – Term 2", type:"Schemes of Work", dept:"JHS",           subject:"Integrated Science", price:"GH₵ 30", stage:"Available" },
  { id:4, title:"B1 Mathematics Lesson Notes – Term 1", type:"Lesson Notes",   dept:"Lower Primary", subject:"Mathematics",      price:"GH₵ 40", stage:"Available" },
  { id:5, title:"B6 English End-of-Term Exam – Term 3", type:"Exam Questions",  dept:"Upper Primary", subject:"English Language", price:"GH₵ 20", stage:"Available" },
  { id:6, title:"B7 Mathematics Textbook", type:"Textbook",        dept:"JHS",           subject:"Mathematics",      price:"GH₵ 80", stage:"Available" },
  { id:7, title:"KG Number Workbook", type:"Workbook",        dept:"Pre-School",    subject:"Mathematics",      price:"GH₵ 35", stage:"Available" },
  { id:8, title:"B4 Computing Lesson Notes – Term 2", type:"Lesson Notes",   dept:"Upper Primary", subject:"Computing",        price:"GH₵ 40", stage:"Coming Soon" },
  { id:9, title:"B8 Social Studies Scheme of Work – Term 3", type:"Schemes of Work", dept:"JHS", subject:"Social Studies", price:"GH₵ 30", stage:"Coming Soon" },
];

export default function Catalogue() {
  const [typeFilter, setType]    = useState("All");
  const [deptFilter, setDept]    = useState("All");
  const [subjFilter, setSubj]    = useState("All");
  const [search, setSearch]      = useState("");

  const filtered = ITEMS.filter((item) => {
    if (typeFilter !== "All" && item.type    !== typeFilter) return false;
    if (deptFilter !== "All" && item.dept    !== deptFilter) return false;
    if (subjFilter !== "All" && item.subject !== subjFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Material Catalogue</h1>
          <p>Browse NaCCA-aligned teaching materials across all departments, subjects, and grade levels.</p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.search}>
            <input
              type="search"
              placeholder="Search materials…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search materials"
            />
          </div>

          <FilterGroup label="Material Type" options={TYPES} value={typeFilter} onChange={setType} />
          <FilterGroup label="Department"    options={DEPTS} value={deptFilter} onChange={setDept} />
          <FilterGroup label="Subject"       options={SUBJECTS} value={subjFilter} onChange={setSubj} />

          <button className={styles.clearBtn} onClick={() => { setType("All"); setDept("All"); setSubj("All"); setSearch(""); }}>
            Clear filters
          </button>
        </aside>

        {/* Results */}
        <div className={styles.results}>
          <p className={styles.count}>{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</p>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <span>📭</span>
              <p>No materials match your filters.</p>
            </div>
          )}
          <div className={styles.grid}>
            {filtered.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.typeTag}>{item.type}</span>
                  {item.stage === "Coming Soon" && <span className={styles.soon}>Coming Soon</span>}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.cardMeta}>
                  <span>🏫 {item.dept}</span>
                  <span>📖 {item.subject}</span>
                </div>
                <div className={styles.cardFoot}>
                  <span className={styles.price}>{item.price}</span>
                  <Link to="/contact" className={styles.orderBtn}>
                    {item.stage === "Coming Soon" ? "Notify Me" : "Order / Enquire"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className={styles.filterGroup}>
      <p className={styles.filterLabel}>{label}</p>
      {options.map((o) => (
        <button
          key={o}
          className={`${styles.filterBtn} ${value === o ? styles.activeFilter : ""}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
