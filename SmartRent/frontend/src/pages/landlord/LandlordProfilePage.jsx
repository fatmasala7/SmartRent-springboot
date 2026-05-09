import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMe } from "../../services/userService";

function LandlordProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch((e) => setError(e.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.page}><div style={styles.card}><p style={{textAlign:"center",color:"#777"}}>Loading profile...</p></div></div>;
  if (error) return <div style={styles.page}><div style={styles.card}><p style={{textAlign:"center",color:"red"}}>{error}</p></div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="avatar" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatar}>👤</div>
          )}
          <div>
            <h2 style={styles.name}>{profile.fullName}</h2>
            <p style={styles.role}>{profile.role}</p>
          </div>
        </div>

        <div style={styles.infoBox}>
          <div style={styles.row}>
            <span style={styles.label}>Email</span>
            <span>{profile.email}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Phone</span>
            <span>{profile.phoneNumber || "—"}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Role</span>
            <span>{profile.role}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Status</span>
            <span style={{ color: profile.isApproved ? "#2e7d32" : "#b8860b", fontWeight: 600 }}>
              {profile.isApproved ? "✓ Approved" : "⏳ Pending Approval"}
            </span>
          </div>
          {profile.nationalOrPassportID && (
            <div style={styles.row}>
              <span style={styles.label}>National ID</span>
              <span>{profile.nationalOrPassportID}</span>
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button style={styles.editBtn} onClick={() => navigate("/landlord/edit-profile")}>
            Edit Profile
          </button>
          <button style={styles.backBtn} onClick={() => navigate("/landlord/dashboard")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", background: "var(--pastel-gray)", padding: "40px 20px" },
  card: { width: "100%", maxWidth: "450px", background: "#fff", borderRadius: "16px", padding: "24px", marginTop: "40px", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" },
  header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  avatar: { fontSize: "40px", background: "#f3f4f6", padding: "10px", borderRadius: "50%" },
  avatarImg: { width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--jellybean-blue)" },
  name: { margin: 0, fontSize: "18px" },
  role: { margin: 0, fontSize: "12px", color: "#777" },
  infoBox: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  row: { display: "flex", justifyContent: "space-between", padding: "10px", borderRadius: "8px", background: "#f9fafb" },
  label: { fontWeight: "600", color: "#444" },
  actions: { display: "flex", gap: "10px" },
  editBtn: { flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "var(--jellybean-blue)", color: "#fff", cursor: "pointer" },
  backBtn: { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
};

export default LandlordProfilePage;
