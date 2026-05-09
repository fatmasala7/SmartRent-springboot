import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyVisits } from "../services/bookingService";
import {
  getPropertyId,
  getImageUrlFromProperty,
  formatDate,
  normalizePropertySummary,
} from "../utils/displayHelpers";

const STATUS_COLORS = {
  Pending: { bg: "#FFF8E1", color: "#B8860B", label: "⏳ Pending" },
  Accepted: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Accepted" },
  Confirmed: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Confirmed" },
  Rejected: { bg: "#FFEBEE", color: "#C62828", label: "❌ Rejected" },
  Cancelled: { bg: "#FFEBEE", color: "#C62828", label: "❌ Cancelled" },
};

function MyVisitRequestsPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getMyVisits().then((data) => setVisits(Array.isArray(data) ? data : [])).catch(console.error);
  }, []);

  const handleCancel = (id) => {
    setVisits((prev) => prev.map((v) => v.requestID === id ? { ...v, status: "Cancelled" } : v));
  };

  const handleDelete = (id) => {
    setVisits((prev) => prev.filter((v) => v.requestID !== id));
    setConfirmDelete(null);
  };

  const normalizedStatus = (status) => status === "Accepted" ? "Confirmed" : status;
  const filtered = filter === "All" ? visits : visits.filter((v) => normalizedStatus(v.status) === filter);

  const counts = {
    All: visits.length,
    Pending: visits.filter((v) => normalizedStatus(v.status) === "Pending").length,
    Confirmed: visits.filter((v) => normalizedStatus(v.status) === "Confirmed").length,
    Cancelled: visits.filter((v) => normalizedStatus(v.status) === "Cancelled").length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <div style={styles.heroLabel}>📅 My Schedule</div>
        <h1 style={styles.heroTitle}>
          Visit Requests
          <span style={styles.heroSub}>Track your scheduled property visits</span>
        </h1>
        <div style={styles.heroStats}>
          <div style={styles.heroStat}><div style={styles.heroStatVal}>{counts.All}</div><div style={styles.heroStatLbl}>Total</div></div>
          <div style={styles.heroStat}><div style={styles.heroStatVal}>{counts.Pending}</div><div style={styles.heroStatLbl}>Pending</div></div>
          <div style={styles.heroStat}><div style={styles.heroStatVal}>{counts.Confirmed}</div><div style={styles.heroStatLbl}>Confirmed</div></div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.tabs}>
          {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                ...styles.tab,
                background: filter === tab ? "#805774" : "white",
                color: filter === tab ? "white" : "#716458",
                border: filter === tab ? "1.5px solid #805774" : "1.5px solid rgba(128,87,116,0.15)",
              }}
            >
              {tab}
              <span style={{ ...styles.tabCount, background: filter === tab ? "rgba(255,255,255,0.25)" : "rgba(128,87,116,0.08)" }}>
                {counts[tab] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📅</div>
            <h3 style={styles.emptyTitle}>No visit requests yet</h3>
            <p style={styles.emptyText}>Browse properties and schedule a visit!</p>
            <button style={styles.exploreBtn} onClick={() => navigate("/properties")}>Browse Properties</button>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((visit) => {
              const propertyId = getPropertyId(visit) || visit.propertyID || visit.propertyId;
              return (
                <VisitCard
                  key={visit.requestID}
                  visit={visit}
                  onCancel={handleCancel}
                  onDelete={(id) => setConfirmDelete(id)}
                  onView={() => propertyId ? navigate(`/property/${propertyId}`) : alert("Property information unavailable")}
                />
              );
            })}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div style={styles.backdrop} onClick={() => setConfirmDelete(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🗑️</div>
            <h3 style={styles.confirmTitle}>Delete Visit Request?</h3>
            <p style={styles.confirmText}>This action cannot be undone.</p>
            <div style={styles.confirmActions}>
              <button style={styles.confirmCancelBtn} onClick={() => setConfirmDelete(null)}>Keep it</button>
              <button style={styles.confirmDeleteBtn} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VisitCard({ visit, onCancel, onDelete, onView }) {
  const [hovered, setHovered] = useState(false);
  const status = visit.status === "Accepted" ? "Confirmed" : visit.status;
  const statusInfo = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  const propertyId = getPropertyId(visit) || visit.propertyID || visit.propertyId;
  const property = normalizePropertySummary({
    id: propertyId,
    title: visit.propertyTitle,
    location: visit.propertyLocation,
    price: visit.propertyPrice,
    imageUrl: visit.propertyImageUrl || visit.propertyImage,
  }, propertyId);
  const image = getImageUrlFromProperty({ imageUrl: property.image });
  const requestedDate = formatDate(visit.requestedDate, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const time = visit.time || (visit.requestedDate ? new Date(visit.requestedDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-");

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hovered ? "0 12px 32px rgba(128,87,116,0.13)" : "0 4px 16px rgba(128,87,116,0.07)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardImgWrap}>
        <img src={image} alt={property.title} style={styles.cardImg} />
        <div style={{ ...styles.statusBadge, background: statusInfo.bg, color: statusInfo.color }}>{statusInfo.label}</div>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardTitle}>{property.title}</div>
        <div style={styles.cardLocation}>📍 {property.location}</div>

        <div style={styles.cardMeta}>
          <div style={styles.metaItem}><span style={styles.metaIcon}>📅</span><span>{requestedDate}</span></div>
          <div style={styles.metaItem}><span style={styles.metaIcon}>🕐</span><span>{time}</span></div>
          {(visit.notes || visit.message) && (
            <div style={styles.metaItem}><span style={styles.metaIcon}>📝</span><span style={{ opacity: 0.75 }}>{visit.notes || visit.message}</span></div>
          )}
        </div>

        <div style={styles.cardActions}>
          <button style={styles.viewBtn} onClick={onView} disabled={!propertyId}>View Property</button>
          {status === "Pending" && <button style={styles.cancelBtn} onClick={() => onCancel(visit.requestID)}>Cancel</button>}
          <button style={styles.deleteBtn} onClick={() => onDelete(visit.requestID)}>🗑</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#D8CCC5", fontFamily: "'Segoe UI', sans-serif", color: "#716458" },
  hero: { background: "linear-gradient(135deg, #805774 0%, #5a3b4f 60%, #417C9C 100%)", padding: "56px 40px 48px", position: "relative", overflow: "hidden" },
  heroCircle1: { position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" },
  heroCircle2: { position: "absolute", bottom: "-80px", left: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(65,124,156,0.18)" },
  heroLabel: { display: "inline-flex", padding: "6px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.14)", color: "#fff", fontSize: "13px", marginBottom: "12px" },
  heroTitle: { margin: 0, color: "#fff", fontSize: "44px", fontFamily: "Georgia, serif", lineHeight: 1.1 },
  heroSub: { display: "block", marginTop: "12px", fontFamily: "Segoe UI, sans-serif", fontSize: "18px", fontWeight: 400, opacity: 0.75 },
  heroStats: { display: "flex", gap: "18px", marginTop: "32px" },
  heroStat: { width: "110px", height: "82px", borderRadius: "18px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" },
  heroStatVal: { fontSize: "22px", fontWeight: 800 },
  heroStatLbl: { fontSize: "11px", textTransform: "uppercase", opacity: 0.75, marginTop: 6 },
  content: { padding: "34px 46px" },
  tabs: { display: "flex", gap: "14px", marginBottom: "28px", flexWrap: "wrap" },
  tab: { border: "none", borderRadius: "999px", padding: "12px 24px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  tabCount: { minWidth: "24px", height: "24px", borderRadius: "999px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  list: { display: "flex", flexDirection: "column", gap: "22px" },
  card: { display: "flex", gap: "28px", background: "#fff", borderRadius: "22px", padding: "18px", transition: "all .2s ease" },
  cardImgWrap: { width: "210px", minWidth: "210px", height: "150px", borderRadius: "18px", overflow: "hidden", position: "relative", background: "#f3f3f3" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  statusBadge: { position: "absolute", top: "10px", left: "10px", borderRadius: "9px", padding: "6px 10px", fontSize: "12px", fontWeight: 700 },
  cardBody: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardTitle: { fontSize: "24px", color: "#805774", fontFamily: "Georgia, serif", fontWeight: 800, marginBottom: "6px" },
  cardLocation: { color: "#7a6b60", marginBottom: "14px" },
  cardMeta: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" },
  metaItem: { display: "flex", alignItems: "center", gap: "10px" },
  metaIcon: { width: "20px" },
  cardActions: { display: "flex", gap: "12px", alignItems: "center" },
  viewBtn: { flex: 1, background: "#417C9C", color: "#fff", border: "none", borderRadius: "12px", padding: "13px", fontWeight: 800, cursor: "pointer" },
  cancelBtn: { flex: 1, background: "#fff", color: "#805774", border: "1px solid rgba(128,87,116,.25)", borderRadius: "12px", padding: "13px", fontWeight: 800, cursor: "pointer" },
  deleteBtn: { width: "50px", background: "#fff", color: "#c62828", border: "1px solid #ffcdd2", borderRadius: "12px", padding: "13px", cursor: "pointer" },
  empty: { background: "#fff", borderRadius: "22px", padding: "50px", textAlign: "center" },
  emptyIcon: { fontSize: "44px" },
  emptyTitle: { color: "#805774" },
  emptyText: { color: "#716458" },
  exploreBtn: { background: "#417C9C", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: 800 },
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  confirmModal: { background: "#fff", borderRadius: "20px", padding: "30px", width: "330px", textAlign: "center" },
  confirmTitle: { margin: 0, color: "#805774" },
  confirmText: { color: "#716458" },
  confirmActions: { display: "flex", gap: "12px", marginTop: "20px" },
  confirmCancelBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #ddd", background: "#fff", cursor: "pointer" },
  confirmDeleteBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#c62828", color: "#fff", cursor: "pointer" },
};

export default MyVisitRequestsPage;
