import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./PendingPage.module.css";

export default function PendingPage() {
  const { profile } = useAuth();
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon}>⏳</span>
        <h2>Account Pending Approval</h2>
        <p>
          Hi <strong>{profile?.name}</strong>, your account is awaiting review by
          the Founder. You will be able to access the portal once approved.
        </p>
        <button className={styles.signOut} onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
