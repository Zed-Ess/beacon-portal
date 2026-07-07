import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const LINKS = [
  { to: "/",          label: "Home"       },
  { to: "/catalogue", label: "Catalogue"  },
  { to: "/about",     label: "About Us"   },
  { to: "/events",    label: "Events"     },
  { to: "/schools",   label: "For Schools"},
  { to: "/blog",      label: "Blog"       },
  { to: "/contact",   label: "Contact"    },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.lamp}>🏮</span>
          <div>
            <span className={styles.name}>Beacon Educational Consult</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`} aria-label="Site navigation">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
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
