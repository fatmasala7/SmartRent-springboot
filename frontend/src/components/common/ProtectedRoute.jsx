import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function isApprovedUser(user) {
  return user?.isApproved === true || user?.isApproved === 1 || user?.isApproved === "true";
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  if (!user || !token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>🔒</div>
          <h2 style={styles.title}>Login Required</h2>
          <p style={styles.text}>
            You need to login or register to access this page.
          </p>
          <div style={styles.actions}>
            <button style={styles.loginBtn} onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              style={styles.registerBtn}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (user?.role === "Landlord" && !isApprovedUser(user)) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>⏳</div>
          <h2 style={styles.title}>Account Pending Approval</h2>
          <p style={styles.text}>
            Your landlord account is waiting for admin approval. You will be able to access the landlord dashboard after approval.
          </p>
          <div style={styles.actions}>
            <button style={styles.loginBtn} onClick={() => navigate("/pending-approval")}>
              View Status
            </button>
            <button style={styles.registerBtn} onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>🚫</div>
          <h2 style={styles.title}>Access Denied</h2>
          <p style={styles.text}>
            You don't have permission to access this page.
          </p>
          <button style={styles.loginBtn} onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
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
    padding: "48px 40px",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "0 8px 32px rgba(128,87,116,0.12)",
    border: "1px solid rgba(128,87,116,0.10)",
  },
  icon: { fontSize: "56px", marginBottom: "20px" },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: "24px",
    color: "#805774",
    marginBottom: "12px",
  },
  text: {
    fontSize: "15px",
    color: "#716458",
    lineHeight: "1.6",
    opacity: 0.8,
    marginBottom: "28px",
  },
  actions: { display: "flex", gap: "12px", marginBottom: "16px" },
  loginBtn: {
    flex: 1,
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #805774, #417C9C)",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  registerBtn: {
    flex: 1,
    padding: "13px",
    borderRadius: "12px",
    border: "1.5px solid rgba(128,87,116,0.25)",
    background: "transparent",
    color: "#805774",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#76A0B3",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default ProtectedRoute;
