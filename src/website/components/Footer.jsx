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
            <span className={styles.tagline}>Advancing education in Ghanaian basic schools</span>
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Materials</h4>
            <Link to="/catalogue">Browse Catalogue</Link>
            <Link to="/catalogue?type=schemes">Schemes of Work</Link>
            <Link to="/catalogue?type=textbooks">Textbooks</Link>
            <Link to="/catalogue?type=exams">Exam Questions</Link>
          </div>
          <div className={styles.col}>
            <h4>Organisation</h4>
            <Link to="/about">About Us</Link>
            <Link to="/events">Events</Link>
            <Link to="/schools">For Schools</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div className={styles.col}>
            <h4>Contact</h4>
            <Link to="/contact">Get in Touch</Link>
            <a href="mailto:info@beaconeducationalconsult.com">info@beacon­educational­consult.com</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} Beacon Educational Consult. All rights reserved.</span>
        <Link to="/portal" className={styles.portalLink}>Partner Portal →</Link>
      </div>
    </footer>
  );
}
