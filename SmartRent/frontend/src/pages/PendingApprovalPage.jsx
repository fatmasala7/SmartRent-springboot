import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PendingApprovalPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>⏳</div>
        <h1 style={styles.title}>Landlord Account Pending Approval</h1>
        <p style={styles.text}>
          Your landlord account has been registered successfully, but it is still waiting for admin approval.
          You cannot access the landlord dashboard until the admin approves your account.
        </p>
        <p style={styles.textSmall}>
          Please try logging in again after the admin approves your landlord account.
        </p>
        <div style={styles.actions}>
          <Link to="/" style={styles.secondaryBtn}>Go to Home</Link>
          <button type="button" style={styles.primaryBtn} onClick={handleLogout}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#D8CCC5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "44px 38px",
    textAlign: "center",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 8px 32px rgba(128,87,116,0.12)",
    border: "1px solid rgba(128,87,116,0.10)",
  },
  icon: { fontSize: "56px", marginBottom: "18px" },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: "28px",
    color: "#805774",
    marginBottom: "14px",
  },
  text: {
    fontSize: "15px",
    color: "#716458",
    lineHeight: "1.7",
    marginBottom: "12px",
  },
  textSmall: {
    fontSize: "14px",
    color: "#716458",
    opacity: 0.75,
    lineHeight: "1.6",
    marginBottom: "26px",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "13px 22px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #805774, #417C9C)",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  secondaryBtn: {
    padding: "13px 22px",
    borderRadius: "12px",
    border: "1.5px solid rgba(128,87,116,0.25)",
    background: "transparent",
    color: "#805774",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default PendingApprovalPage;
