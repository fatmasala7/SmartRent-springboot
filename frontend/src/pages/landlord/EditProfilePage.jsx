import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload } from "react-icons/md";
import { getMe, updateMe } from "../../services/userService";

function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", profileImage: "", nationalOrPassportID: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getMe()
      .then((u) => setForm({ fullName: u.fullName || "", phoneNumber: u.phoneNumber || "", profileImage: u.profileImage || "", nationalOrPassportID: u.nationalOrPassportID || "" }))
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, profileImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await updateMe({ fullName: form.fullName, phoneNumber: form.phoneNumber, profileImage: form.profileImage, nationalOrPassportID: form.nationalOrPassportID });
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/landlord/profile"), 1200);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={styles.page}><p>Loading...</p></div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Edit Profile</h2>

      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.imageBox}>
          <img
            src={form.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            style={styles.avatar}
            alt="profile"
          />
        </div>

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="nationalOrPassportID"
          placeholder="National / Passport ID"
          value={form.nationalOrPassportID}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.uploadBox}>
          <label style={styles.uploadLabel}>
            <MdCloudUpload size={20} />
            <span>Upload Profile Image</span>
            <input type="file" accept="image/*" onChange={handleImage} style={styles.fileInput} />
          </label>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <button type="submit" style={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button type="button" style={styles.cancelBtn} onClick={() => navigate("/landlord/profile")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: { padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" },
  title: { marginBottom: "16px" },
  card: { background: "#fff", padding: "20px", borderRadius: "14px", width: "100%", maxWidth: "420px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "12px" },
  imageBox: { display: "flex", justifyContent: "center", marginBottom: "10px" },
  avatar: { width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid var(--jellybean-blue)" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" },
  uploadBox: { border: "2px dashed var(--jellybean-blue)", borderRadius: "10px", padding: "12px", textAlign: "center", cursor: "pointer", background: "#f8fafc" },
  uploadLabel: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#333" },
  fileInput: { display: "none" },
  saveBtn: { padding: "10px", borderRadius: "8px", border: "none", background: "var(--jellybean-blue)", color: "#fff", cursor: "pointer", fontWeight: "bold" },
  cancelBtn: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
  errorBox: { background: "#fff0f0", color: "#c0392b", padding: "10px", borderRadius: "8px", fontSize: "13px" },
  successBox: { background: "#f0fff4", color: "#2e7d32", padding: "10px", borderRadius: "8px", fontSize: "13px" },
};

export default EditProfilePage;
