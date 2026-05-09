import { useState } from "react";
import { useToast } from "./NotificationToast";
import { createVisitRequest } from "../services/bookingService";
import { getPropertyId, getImageUrlFromProperty, formatCurrency } from "../utils/displayHelpers";

function VisitRequestModal({ property, onClose, onSuccess }) {
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast, toastContainer } = useToast();

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!form.date) return setError("Please select a date.");
    if (!form.time) return setError("Please select a time slot.");
    setError("");
    setLoading(true);

    const pid = getPropertyId(property);
    if (!pid) { setError("Property information is unavailable. Please refresh and try again."); setLoading(false); return; }
    const requestedDate = `${form.date}T${form.time.replace(" AM", "").replace(" PM", "")}:00`;

    createVisitRequest({
      propertyID: pid,
      requestedDate,
      message: form.notes,
    })
      .then(() => {
        setLoading(false);
        onSuccess?.();
        onClose();
      })
      .catch((err) => {
        setError(err.message || "Failed to submit visit request");
        setLoading(false);
      });
  };

  return (
    <>
      {toastContainer}

      <div style={styles.backdrop} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <div>
              <div style={styles.headerLabel}>📅 Schedule a Visit</div>
              <h2 style={styles.headerTitle}>Request Visit</h2>
            </div>
            <button style={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
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
              <div style={styles.propPrice}>
                {formatCurrency(property.price)}
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.field}>
            <label style={styles.label}>Select Date</label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Select Time Slot</label>
            <div style={styles.timeGrid}>
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setForm({ ...form, time: slot })}
                  style={{
                    ...styles.timeSlot,
                    background: form.time === slot ? "#805774" : "white",
                    color: form.time === slot ? "white" : "#716458",
                    border:
                      form.time === slot
                        ? "1.5px solid #805774"
                        : "1.5px solid rgba(128,87,116,0.15)",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Notes <span style={styles.optional}>(optional)</span>
            </label>
            <textarea
              placeholder="Any special requests or questions for the landlord?"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={styles.textarea}
              maxLength={300}
            />
            <div style={styles.charCount}>{form.notes.length} / 300</div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.actions}>
            <button style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "📅 Confirm Visit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
//styles
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "white",
    borderRadius: "24px",
    padding: "28px",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 60px rgba(128,87,116,0.18)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  headerLabel: {
    fontSize: "12px",
    color: "#76A0B3",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
    fontWeight: "500",
  },
  headerTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "22px",
    color: "#805774",
    margin: 0,
  },
  closeBtn: {
    background: "rgba(128,87,116,0.08)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    fontSize: "14px",
    cursor: "pointer",
    color: "#805774",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  propMini: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    background: "#FAF7F5",
    borderRadius: "14px",
    padding: "14px",
    border: "1px solid rgba(128,87,116,0.10)",
    marginBottom: "20px",
  },
  propImg: {
    width: "60px",
    height: "60px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  propTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "15px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "3px",
  },
  propLocation: {
    fontSize: "12px",
    color: "#716458",
    opacity: 0.8,
    marginBottom: "3px",
  },
  propPrice: { fontSize: "13px", fontWeight: "600", color: "#417C9C" },
  divider: {
    height: "1px",
    background: "rgba(128,87,116,0.08)",
    marginBottom: "20px",
  },
  field: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "10px",
  },
  optional: { fontSize: "11px", fontWeight: "400", color: "#76A0B3" },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "11px",
    border: "1.5px solid rgba(128,87,116,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    color: "#716458",
    outline: "none",
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  timeSlot: {
    padding: "9px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'Segoe UI', sans-serif",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "12px 14px",
    borderRadius: "11px",
    border: "1.5px solid rgba(128,87,116,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "13px",
    color: "#716458",
    outline: "none",
    resize: "vertical",
    lineHeight: "1.5",
  },
  charCount: {
    textAlign: "right",
    fontSize: "11px",
    color: "#76A0B3",
    marginTop: "5px",
  },
  error: {
    background: "#fff0f0",
    border: "1px solid rgba(200,50,50,0.2)",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "13px",
    color: "#c0392b",
    marginBottom: "16px",
  },
  actions: { display: "flex", gap: "10px", marginTop: "4px" },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1.5px solid rgba(128,87,116,0.2)",
    background: "transparent",
    color: "#805774",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  submitBtn: {
    flex: 2,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #805774, #417C9C)",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default VisitRequestModal;
