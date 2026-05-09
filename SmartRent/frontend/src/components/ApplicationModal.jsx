import { useState } from "react";
import { createApplication, addDocument } from "../services/bookingService";
import { getPropertyId, getImageUrlFromProperty, formatCurrency } from "../utils/displayHelpers";

function ApplicationModal({ property, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    job: "",
    monthlyIncome: "",
    moveInDate: "",
    duration: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const getDurationMonths = (d) => {
    const map = { "3": 3, "6": 6, "12": 12, "24": 24, "36": 36 };
    return map[d] || 12;
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read selected file"));
    reader.readAsDataURL(file);
  });

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0];
    setError("");
    setAttachment(null);
    setAttachmentPreview("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file only.");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Application image must be 2MB or smaller.");
      e.target.value = "";
      return;
    }
    setAttachment(file);
    setAttachmentPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!form.job.trim()) return setError("Please enter your job title.");
    if (!form.monthlyIncome) return setError("Please enter your monthly income.");
    if (!form.moveInDate) return setError("Please select a move-in date.");
    if (!form.duration) return setError("Please select rental duration.");

    // Validate date - use YYYY-MM-DD string directly from input type="date"
    const startDate = form.moveInDate; // already "YYYY-MM-DD"
    if (!startDate || startDate.length !== 10) return setError("Invalid move-in date.");

    // Calculate end date safely
    const [year, month, day] = startDate.split("-").map(Number);
    const months = getDurationMonths(form.duration);
    const endDateObj = new Date(year, month - 1 + months, day);
    // Format as YYYY-MM-DD without toISOString()
    const pad = (n) => String(n).padStart(2, "0");
    const endDate = `${endDateObj.getFullYear()}-${pad(endDateObj.getMonth() + 1)}-${pad(endDateObj.getDate())}`;

    setError("");
    setLoading(true);

    const pid = getPropertyId(property);
    if (!pid) { setError("Property information is unavailable. Please refresh and try again."); setLoading(false); return; }
    try {
      const created = await createApplication({
        propertyId: pid,
        jobTitle: form.job,
        monthlyIncome: Number(form.monthlyIncome),
        moveInDate: startDate,
        startDate,
        endDate,
        rentalDuration: months,
        notes: form.notes,
      });

      if (attachment) {
        const documentUrl = await fileToBase64(attachment);
        await addDocument(created.applicationID || created.applicationId || created.id, {
          documentUrl,
          documentType: "Application Image",
          fileName: attachment.name,
        });
      }

      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit application");
      setLoading(false);
    }
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.headerLabel}>📝 Rental Application</div>
            <h2 style={styles.headerTitle}>Apply for Rent</h2>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.propMini}>
          <img
            src={getImageUrlFromProperty(property)}
            alt={property.title}
            style={styles.propImg}
          />
          <div>
            <div style={styles.propTitle}>{property.title}</div>
            <div style={styles.propLocation}>📍 {property.location}</div>
            <div style={styles.propPrice}>{formatCurrency(property.price)}</div>
          </div>
        </div>

        <div style={styles.divider} />
        <div style={styles.sectionLabel}>👤 Personal Information</div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} placeholder="Ahmed Mohamed" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="ahmed@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone Number</label>
          <input style={styles.input} placeholder="+20 100 000 0000" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div style={styles.divider} />
        <div style={styles.sectionLabel}>💼 Employment & Financial Info</div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Job Title</label>
            <input style={styles.input} placeholder="Software Engineer" value={form.job}
              onChange={(e) => setForm({ ...form, job: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Monthly Income (EGP)</label>
            <input style={styles.input} type="number" placeholder="25000" value={form.monthlyIncome}
              onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} />
          </div>
        </div>

        <div style={styles.divider} />
        <div style={styles.sectionLabel}>🏠 Rental Preferences</div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Move-in Date</label>
            <input style={styles.input} type="date" min={today} value={form.moveInDate}
              onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Rental Duration</label>
            <select style={styles.input} value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}>
              <option value="">Select duration</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">1 Year</option>
              <option value="24">2 Years</option>
              <option value="36">3 Years (Long Term)</option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            Additional Notes <span style={styles.optional}>(optional)</span>
          </label>
          <textarea style={styles.textarea}
            placeholder="Any additional information you'd like to share..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            maxLength={400} />
          <div style={styles.charCount}>{form.notes.length} / 400</div>
        </div>


        <div style={styles.field}>
          <label style={styles.label}>
            Supporting Image <span style={styles.optional}>(optional)</span>
          </label>
          <input
            style={styles.input}
            type="file"
            accept="image/*"
            onChange={handleAttachmentChange}
          />
          {attachmentPreview && (
            <div style={styles.attachmentPreviewWrap}>
              <img src={attachmentPreview} alt="Application attachment preview" style={styles.attachmentPreview} />
              <button
                type="button"
                style={styles.removeAttachmentBtn}
                onClick={() => { setAttachment(null); setAttachmentPreview(""); }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

                {error && <div style={styles.error}>{error}</div>}

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? "Submitting..." : "📝 Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"20px" },
  modal: { background:"white",borderRadius:"24px",padding:"28px",width:"100%",maxWidth:"600px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(128,87,116,0.18)" },
  header: { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px" },
  headerLabel: { fontSize:"12px",color:"#76A0B3",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"4px",fontWeight:"500" },
  headerTitle: { fontFamily:"Georgia, serif",fontSize:"22px",color:"#805774",margin:0 },
  closeBtn: { background:"rgba(128,87,116,0.08)",border:"none",borderRadius:"50%",width:"36px",height:"36px",fontSize:"14px",cursor:"pointer",color:"#805774",display:"flex",alignItems:"center",justifyContent:"center" },
  propMini: { display:"flex",gap:"14px",alignItems:"center",background:"#FAF7F5",borderRadius:"14px",padding:"14px",border:"1px solid rgba(128,87,116,0.10)",marginBottom:"20px" },
  propImg: { width:"60px",height:"60px",borderRadius:"10px",objectFit:"cover" },
  propTitle: { fontFamily:"Georgia, serif",fontSize:"15px",fontWeight:"600",color:"#805774",marginBottom:"3px" },
  propLocation: { fontSize:"12px",color:"#716458",opacity:0.8,marginBottom:"3px" },
  propPrice: { fontSize:"13px",fontWeight:"600",color:"#417C9C" },
  divider: { height:"1px",background:"rgba(128,87,116,0.08)",margin:"16px 0" },
  sectionLabel: { fontSize:"13px",fontWeight:"600",color:"#805774",marginBottom:"14px",letterSpacing:"0.3px" },
  row: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" },
  field: { marginBottom:"14px" },
  label: { display:"block",fontSize:"12px",fontWeight:"600",color:"#805774",marginBottom:"7px" },
  optional: { fontSize:"11px",fontWeight:"400",color:"#76A0B3" },
  input: { width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1.5px solid rgba(128,87,116,0.15)",fontFamily:"'Segoe UI', sans-serif",fontSize:"13px",color:"#716458",outline:"none",boxSizing:"border-box" },
  textarea: { width:"100%",minHeight:"90px",padding:"12px 14px",borderRadius:"11px",border:"1.5px solid rgba(128,87,116,0.15)",fontFamily:"'Segoe UI', sans-serif",fontSize:"13px",color:"#716458",outline:"none",resize:"vertical",lineHeight:"1.5",boxSizing:"border-box" },
  charCount: { textAlign:"right",fontSize:"11px",color:"#76A0B3",marginTop:"5px" },
  attachmentPreviewWrap: { display:"flex",alignItems:"center",gap:"12px",marginTop:"10px",background:"#FAF7F5",border:"1px solid rgba(128,87,116,0.12)",borderRadius:"12px",padding:"10px" },
  attachmentPreview: { width:"78px",height:"58px",objectFit:"cover",borderRadius:"8px",border:"1px solid rgba(128,87,116,0.15)" },
  removeAttachmentBtn: { padding:"8px 12px",border:"none",borderRadius:"8px",background:"#fff0f0",color:"#c0392b",cursor:"pointer",fontWeight:"600" },
  error: { background:"#fff0f0",border:"1px solid rgba(200,50,50,0.2)",borderRadius:"10px",padding:"11px 14px",fontSize:"13px",color:"#c0392b",marginBottom:"16px" },
  actions: { display:"flex",gap:"10px",marginTop:"8px" },
  cancelBtn: { flex:1,padding:"12px",borderRadius:"12px",border:"1.5px solid rgba(128,87,116,0.2)",background:"transparent",color:"#805774",fontSize:"13px",fontWeight:"500",cursor:"pointer",fontFamily:"'Segoe UI', sans-serif" },
  submitBtn: { flex:2,padding:"12px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg, #805774, #417C9C)",color:"white",fontSize:"13px",fontWeight:"600",fontFamily:"'Segoe UI', sans-serif" },
};

export default ApplicationModal;
