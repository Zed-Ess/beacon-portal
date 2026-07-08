import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const LINKS = [
  { to: "/",          label: "Why Beacon", end: true },
  { to: "/about",     label: "About"               },
  { to: "/catalogue", label: "Materials"            },
  { to: "/events",    label: "Workshops"            },
  { to: "/contact",   label: "Contact"              },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img src="/beacon-portal/beaconlogo.png" alt="Beacon Educational Consult" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.name}>Beacon Educational Consult</span>
            <span className={styles.sub}>NaCCA/GES Aligned Academic Materials</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`} aria-label="Site navigation">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/schools"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
            onClick={() => setOpen(false)}
          >
            For Schools
          </NavLink>
          <button className={styles.orderBtn} onClick={() => { setOpen(false); navigate("/contact"); }}>
            Order now
          </button>
          <button className={styles.portalBtn} onClick={() => { setOpen(false); navigate("/portal"); }}>
            Partner Portal →
          </button>
        </nav>

        <button
          className={styles.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
