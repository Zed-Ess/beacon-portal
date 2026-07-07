import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import styles from "./AuthPage.module.css";

const DEPARTMENTS = [
  "Pre-School",
  "Lower Primary",
  "Upper Primary",
  "JHS",
  "Upper Primary & JHS",
];

const SUBJECTS = [
  "Ghanaian Language", 
  "English Language", 
  "French Language", 
  "Integrated Science", 
  "R.M.E", 
  "Social Studies",
  "History",
  "Creative Arts",
  "Career Technology",
  "Computing",
  "Numeracy",
  "⁠Literacy",
  "⁠Science",
  "⁠Creativity",
  "⁠Our World our People",
]

export default function AuthPage() {
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [name, setName]       = useState("");
  const [dept, setDept]       = useState(DEPARTMENTS[0]);
  const [subjects, setSubj]   = useState(SUBJECTS[0]);
  const [error, setError]     = useState("");
  const [busy, setBusy]       = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setBusy(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        department: dept,
        // subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
        subjects: subjects,
        role: "member",
        status: "pending",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setBusy(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.lamp}><img src="/beacon-portal/beaconlogo.png" alt="Beacon Educational Consult" /></span>
          <h1>Beacon Educational Consult</h1>
          <p>Partner Portal</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={mode === "login" ? styles.active : ""}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={mode === "register" ? styles.active : ""}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <label>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>
            <label>
              Department
              <select value={dept} onChange={(e) => setDept(e.target.value)}>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label>
              Subjects <span className={styles.hint}>(comma-separated)</span>
              {/* <input
                type="text"
                value={subjects}
                onChange={(e) => setSubj(e.target.value)}
                placeholder="e.g. Algebra, Statistics"
              /> */}
              
              <select value={subjects} onChange={(e) => setSubj(e.target.value)}>
                {SUBJECTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? "Creating account…" : "Create Account"}
            </button>
            <p className={styles.note}>
              Your account will be reviewed by the Founder before you can access
              the portal.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Something went wrong. Please try again.";
  }
}
