import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.lamp}>🏮</span>
          <div>
            <span className={styles.name}>Beacon Educational Consult</span>
            <span className={styles.tagline}>A teacher-led educational publishing and professional development partnership producing NaCCA-aligned academic materials for Ghanaian basic schools.</span>
            <span className={styles.naccaBadge}>✦ NaCCA/GES Aligned</span>
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Quick Links</h4>
            <Link to="/">Why Beacon</Link>
            <Link to="/about">About Us</Link>
            <Link to="/catalogue">Materials Catalogue</Link>
            <Link to="/events">Workshops & Seminars</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <div className={styles.col}>
            <h4>Materials</h4>
            <Link to="/catalogue">Schemes of Work</Link>
            <Link to="/catalogue">Lesson Notes</Link>
            <Link to="/catalogue">Exam Questions</Link>
            <Link to="/catalogue">Textbooks</Link>
            <Link to="/catalogue">Workbooks</Link>
          </div>
          <div className={styles.col}>
            <h4>For Schools</h4>
            <Link to="/schools">How to Order</Link>
            <Link to="/schools">Bulk Orders</Link>
            <Link to="/contact">Make an Enquiry</Link>
            <Link to="/blog">Blog & Resources</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} Beacon Educational Consult. All rights reserved.</span>
        <span>Proudly Ghanaian 🇬🇭</span>
        <Link to="/portal" className={styles.portalLink}>Partner Portal →</Link>
      </div>
    </footer>
  );
}
