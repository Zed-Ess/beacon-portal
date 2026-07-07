import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./Contact.module.css";

const REASONS = [
  "Order / Enquire about materials",
  "Bulk order for school",
  "Register interest in an event",
  "Request a custom material",
  "General enquiry",
  "Partnership enquiry",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", school: "", reason: REASONS[0], message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "enquiries"), {
        ...form,
        createdAt: serverTimestamp(),
        read: false,
      });
      setStatus("sent");
      setForm({ name: "", email: "", school: "", reason: REASONS[0], message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Get in Touch</h1>
          <p>Order materials, ask a question, or discuss a school partnership. We'll respond within two working days.</p>
        </div>
      </section>

      <div className={styles.body}>

        {/* Info cards */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <span>📧</span>
            <div>
              <h3>Email</h3>
              <a href="mailto:zedesssystems@gmail.com">zedesssystems@gmail.com</a>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span>📍</span>
            <div>
              <h3>Based in</h3>
              <p>Ghana</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span>⏱️</span>
            <div>
              <h3>Response time</h3>
              <p>Within 2 working days</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formWrap}>
          <h2>Send us a message</h2>

          {status === "sent" ? (
            <div className={styles.success}>
              <span>✅</span>
              <div>
                <h3>Message received</h3>
                <p>Thank you, {form.name || ""}. We'll get back to you within two working days.</p>
              </div>
              <button onClick={() => setStatus("idle")}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <label>
                  Full Name *
                  <input value={form.name} onChange={set("name")} required placeholder="Your name" />
                </label>
                <label>
                  Email Address *
                  <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" />
                </label>
              </div>
              <label>
                School / Organisation
                <input value={form.school} onChange={set("school")} placeholder="Optional" />
              </label>
              <label>
                Reason for contact *
                <select value={form.reason} onChange={set("reason")}>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              <label>
                Message *
                <textarea rows={5} value={form.message} onChange={set("message")} required placeholder="Tell us what you need…" />
              </label>
              {status === "error" && (
                <p className={styles.error}>Something went wrong. Please try again or email us directly.</p>
              )}
              <button type="submit" className={styles.submit} disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
