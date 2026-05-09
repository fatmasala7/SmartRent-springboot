import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../services/bookingService";
import { getPropertyId, getImageUrlFromProperty, formatCurrency, formatDate } from "../utils/displayHelpers";

const STATUS_COLORS = {
  Pending: { bg: "#FFF8E1", color: "#B8860B", label: "⏳ Pending" },
  Approved: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Approved" },
  Accepted: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Accepted" },
  Rejected: { bg: "#FFEBEE", color: "#C62828", label: "❌ Rejected" },
};

function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getMyApplications().then(setApplications).catch(console.error);
  }, []);

  const handleDelete = (id) => {
    // Client-side remove only (no delete endpoint in spec)
    setApplications((prev) => prev.filter((a) => a.applicationID !== id));
    setConfirmDelete(null);
  };

  const filtered =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  const counts = {
    All: applications.length,
    Pending: applications.filter((a) => a.status === "Pending").length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <div style={styles.heroLabel}>📝 My Applications</div>
        <h1 style={styles.heroTitle}>
          Rental Applications
          <span style={styles.heroSub}>
            Track your rental application status
          </span>
        </h1>
        <div style={styles.heroStats}>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{counts.All}</div>
            <div style={styles.heroStatLbl}>Total</div>
          </div>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{counts.Pending}</div>
            <div style={styles.heroStatLbl}>Pending</div>
          </div>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{counts.Approved}</div>
            <div style={styles.heroStatLbl}>Approved</div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.tabs}>
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                ...styles.tab,
                background: filter === tab ? "#805774" : "white",
                color: filter === tab ? "white" : "#716458",
                border:
                  filter === tab
                    ? "1.5px solid #805774"
                    : "1.5px solid rgba(128,87,116,0.15)",
              }}
            >
              {tab}
              <span
                style={{
                  ...styles.tabCount,
                  background:
                    filter === tab
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(128,87,116,0.08)",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📝</div>
            <h3 style={styles.emptyTitle}>No applications yet</h3>
            <p style={styles.emptyText}>
              Browse properties and apply for rent!
            </p>
            <button
              style={styles.exploreBtn}
              onClick={() => navigate("/properties")}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((application) => (
              <ApplicationCard
                key={application.applicationID}
                application={application}
                onDelete={(id) => setConfirmDelete(id)}
                onView={() => { const pid = getPropertyId(application); if (pid) navigate(`/property/${pid}`); }}
              />
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div style={styles.backdrop} onClick={() => setConfirmDelete(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🗑️</div>
            <h3 style={styles.confirmTitle}>Delete Application?</h3>
            <p style={styles.confirmText}>This action cannot be undone.</p>
            <div style={styles.confirmActions}>
              <button
                style={styles.confirmCancelBtn}
                onClick={() => setConfirmDelete(null)}
              >
                Keep it
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ application, onDelete, onView }) {
  const [hovered, setHovered] = useState(false);
  const statusInfo = STATUS_COLORS[application.status] || STATUS_COLORS.Pending;

  const pid = getPropertyId(application);
  const formattedDate = formatDate(application.createdAt);
  const formattedMoveIn = formatDate(application.moveInDate || application.startDate);
  const title = application.propertyTitle || (pid ? `Property #${pid}` : "Property information unavailable");
  const location = application.propertyLocation || "-";
  const image = getImageUrlFromProperty(application);

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 12px 32px rgba(128,87,116,0.13)"
          : "0 4px 16px rgba(128,87,116,0.07)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardImgWrap}>
        <img
          src={image}
          alt={title}
          style={styles.cardImg}
        />
        <div
          style={{
            ...styles.statusBadge,
            background: statusInfo.bg,
            color: statusInfo.color,
          }}
        >
          {statusInfo.label}
        </div>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardLocation}>📍 {location}</div>
        <div style={styles.cardPrice}>
          {formatCurrency(application.propertyPrice)}
        </div>

        {application.documents?.length > 0 && (
          <div style={styles.docsPreview}>
            {application.documents.map((doc) => (
              doc.documentUrl?.startsWith("data:image") ? (
                <a key={doc.documentID || doc.documentUrl} href={doc.documentUrl} target="_blank" rel="noreferrer" title="Open uploaded image">
                  <img src={doc.documentUrl} alt={doc.documentType || "Application image"} style={styles.docThumb} />
                </a>
              ) : (
                <a key={doc.documentID || doc.documentUrl} href={doc.documentUrl} target="_blank" rel="noreferrer" style={styles.docLink}>{doc.documentType || "Document"}</a>
              )
            ))}
          </div>
        )}

        <div style={styles.cardMeta}>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>👤</span>
            <span>{application.fullName || "-"}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>💼</span>
            <span>{application.jobTitle || application.job || "-"}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>📅</span>
            <span>Move-in: {formattedMoveIn}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>⏱</span>
            <span>Duration: {`${application.startDate || "-"} - ${application.endDate || "-"}`}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>🗓</span>
            <span style={{ opacity: 0.6 }}>Applied: {formattedDate}</span>
          </div>
        </div>

        <div style={styles.cardActions}>
          <button style={styles.viewBtn} onClick={onView}>
            View Property
          </button>
          <button
            style={styles.deleteBtn}
            onClick={() => onDelete(application.applicationID)}
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

//styles

const styles = {
  page: {
    minHeight: "100vh",
    background: "#D8CCC5",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#716458",
  },
  hero: {
    background:
      "linear-gradient(135deg, #805774 0%, #5a3b4f 60%, #417C9C 100%)",
    padding: "56px 40px 48px",
    position: "relative",
    overflow: "hidden",
  },
  heroCircle1: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
  },
  heroCircle2: {
    position: "absolute",
    bottom: "-80px",
    left: "30%",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(65,124,156,0.18)",
  },
  heroLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "100px",
    padding: "5px 14px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "18px",
    fontWeight: "500",
  },
  heroTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "40px",
    fontWeight: "700",
    color: "white",
    lineHeight: "1.15",
    position: "relative",
    zIndex: 1,
  },
  heroSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "18px",
    fontWeight: "400",
    display: "block",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "6px",
  },
  heroStats: {
    display: "flex",
    gap: "16px",
    marginTop: "28px",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap",
  },
  heroStat: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    padding: "12px 24px",
    textAlign: "center",
  },
  heroStatVal: {
    fontSize: "22px",
    fontWeight: "700",
    color: "white",
    fontFamily: "Georgia, serif",
  },
  heroStatLbl: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    marginTop: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  content: { padding: "32px 40px", maxWidth: "900px", margin: "0 auto" },
  tabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 18px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Segoe UI', sans-serif",
  },
  tabCount: {
    borderRadius: "100px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: "600",
  },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    background: "#FAF7F5",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(128,87,116,0.10)",
    transition: "all 0.25s ease",
    display: "flex",
  },
  cardImgWrap: { position: "relative", width: "180px", flexShrink: 0 },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  statusBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "600",
  },
  cardBody: {
    padding: "20px 24px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "17px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "4px",
  },
  cardLocation: {
    fontSize: "13px",
    color: "#716458",
    opacity: 0.8,
    marginBottom: "4px",
  },
  cardPrice: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#417C9C",
    marginBottom: "14px",
  },
  docsPreview: { display:"flex",gap:"8px",flexWrap:"wrap",margin:"10px 0" },
  docThumb: { width:"76px",height:"56px",objectFit:"cover",borderRadius:"8px",border:"1px solid rgba(128,87,116,0.18)" },
  docLink: { fontSize:"12px",color:"#417C9C",textDecoration:"underline" },
  cardMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
    marginBottom: "16px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#716458",
  },
  metaIcon: { fontSize: "14px", flexShrink: 0 },
  cardActions: { display: "flex", gap: "8px" },
  viewBtn: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#417C9C",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  deleteBtn: {
    padding: "9px 12px",
    borderRadius: "10px",
    border: "1.5px solid rgba(200,50,50,0.2)",
    background: "#fff5f5",
    color: "#c0392b",
    fontSize: "14px",
    cursor: "pointer",
  },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "22px",
    color: "#805774",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#716458",
    opacity: 0.7,
    marginBottom: "24px",
  },
  exploreBtn: {
    background: "#805774",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "13px 28px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  confirmModal: {
    background: "white",
    borderRadius: "20px",
    padding: "36px 32px",
    textAlign: "center",
    maxWidth: "360px",
    width: "100%",
    boxShadow: "0 24px 60px rgba(128,87,116,0.18)",
  },
  confirmTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "20px",
    color: "#805774",
    marginBottom: "8px",
  },
  confirmText: {
    fontSize: "14px",
    color: "#716458",
    opacity: 0.7,
    marginBottom: "24px",
  },
  confirmActions: { display: "flex", gap: "10px" },
  confirmCancelBtn: {
    flex: 1,
    padding: "11px",
    borderRadius: "11px",
    border: "1.5px solid rgba(128,87,116,0.2)",
    background: "transparent",
    color: "#805774",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: "11px",
    borderRadius: "11px",
    border: "none",
    background: "#c0392b",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default MyApplicationsPage;
