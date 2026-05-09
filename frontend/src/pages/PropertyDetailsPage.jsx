import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertyService";
import { getPropertyReviews } from "../services/reviewService";
import { addFavorite, removeFavorite } from "../services/favoriteService";
import VisitRequestModal from "../components/VisitRequestModal";
import ApplicationModal from "../components/ApplicationModal";
import { getPropertyId, getImageUrlFromProperty, formatCurrency } from "../utils/displayHelpers";

// ─── Small helper components ───────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={S.section}>
      <h2 style={S.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function Item({ icon, label, value }) {
  return (
    <div style={S.item}>
      <span style={{ opacity: 0.7, fontSize: 12 }}>{icon} {label}</span>
      <b style={{ display: "block", marginTop: 2 }}>{value ?? "—"}</b>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty]           = useState(null);
  const [reviews, setReviews]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [imgIndex, setImgIndex]           = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showAppModal, setShowAppModal]   = useState(false);
  const [isFav, setIsFav]                 = useState(false);

  useEffect(() => {
    const pid = Number(id);
    if (!Number.isFinite(pid) || pid <= 0) {
      setLoading(false);
      setProperty(null);
      return;
    }
    setLoading(true);
    getPropertyById(pid)
      .then((p) => { setProperty(p); setLoading(false); })
      .catch(() => setLoading(false));
    getPropertyReviews(pid).then(setReviews).catch(console.error);
  }, [id]);

  const handleFavorite = async () => {
    try {
      if (isFav) { await removeFavorite(getPropertyId(property) || id); setIsFav(false); }
      else        { await addFavorite(getPropertyId(property) || id);    setIsFav(true);  }
    } catch (e) { console.error(e); }
  };

  const renderStars = (n = 0) => "⭐".repeat(Math.min(Math.floor(n), 5));

  // ── Loading / not-found guards ──
  if (loading)   return <div style={{ padding: 60, textAlign: "center" }}>Loading property…</div>;
  if (!property) return <div style={{ padding: 60, textAlign: "center" }}>Property not found.</div>;

  // ── Derived data ──
  const images = property.images?.length
    ? property.images.map((i) => i.imageUrl).filter(Boolean)
    : [getImageUrlFromProperty(property)];

  const amenities = property.amenities?.map((a) => a.amenityName) ?? [];

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // ── JSX ──
  return (
    <div style={S.page}>

      {/* ── HERO ── */}
      <div style={S.hero}>

        {/* Image gallery */}
        <div style={S.card}>
          <img src={images[imgIndex]} style={S.mainImg} alt="property" />
          {images.length > 1 && (
            <div style={S.thumbs}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={{
                    ...S.thumb,
                    border: i === imgIndex ? "2px solid #805774" : "2px solid transparent",
                  }}
                  onClick={() => setImgIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info + actions */}
        <div style={S.card}>
          <h1 style={S.title}>{property.title}</h1>
          <p style={S.location}>📍 {property.location}</p>

          <div style={S.badges}>
            {property.propertyType && (
              <span style={S.purpleBadge}>{property.propertyType}</span>
            )}
            <span style={S.blueBadge}>{property.rentalStatus ?? "Available"}</span>
            {avgRating && <span>{renderStars(avgRating)} {avgRating}</span>}
          </div>

          <div style={S.price}>
            {formatCurrency(property.price, "EGP")}
            <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.7 }}> / month</span>
          </div>

          {/* Approval badge */}
          {!property.isApproved && (
            <div style={{ background: "#fff8e1", color: "#b8860b", padding: "8px 12px", borderRadius: 10, fontSize: 13, marginBottom: 10 }}>
              ⏳ This property is pending admin approval.
            </div>
          )}

          {/* Action buttons */}
          <button style={S.favBtn} onClick={handleFavorite}>
            {isFav ? "❤️ Saved to Favorites" : "🤍 Add to Favorites"}
          </button>

          <button style={S.primaryBtn} onClick={() => setShowVisitModal(true)}>
            📅 Request Visit
          </button>

          <button style={{ ...S.primaryBtn, background: "#805774", marginTop: 8 }}
            onClick={() => setShowAppModal(true)}>
            📝 Apply for Rent
          </button>

          <button style={S.secondaryBtn}
            onClick={() => navigate("/review", { state: property })}>
            ✍️ Write a Review
          </button>
        </div>
      </div>

      {/* ── Description ── */}
      {property.description && (
        <Section title="Description">
          <p style={S.text}>{property.description}</p>
        </Section>
      )}

      {/* ── Amenities ── */}
      {amenities.length > 0 && (
        <Section title="Amenities">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {amenities.map((a, i) => (
              <span key={i} style={S.amenityTag}>{a}</span>
            ))}
          </div>
        </Section>
      )}

      {/* ── Reviews ── */}
      <Section title={`Reviews (${reviews.length})`}>
        {reviews.length === 0 ? (
          <p style={{ color: "#999", fontSize: 14 }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews.map((r) => (
              <div key={r.reviewID} style={S.reviewCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>Tenant #{r.tenantID}</span>
                  <span style={{ color: "#f0a500" }}>{renderStars(r.rating)} {r.rating}/5</span>
                </div>
                {r.comment && <p style={{ margin: "6px 0 0", color: "#555", fontSize: 14 }}>{r.comment}</p>}
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Modals ── */}
      {showVisitModal && (
        <VisitRequestModal
          property={property}
          onClose={() => setShowVisitModal(false)}
          onSuccess={() => navigate("/visits")}
        />
      )}
      {showAppModal && (
        <ApplicationModal
          property={property}
          onClose={() => setShowAppModal(false)}
          onSuccess={() => navigate("/applications")}
        />
      )}
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const S = {
  page:         { background: "#D8CCC5", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", color: "#716458" },
  hero:         { display: "flex", gap: 20, padding: "30px 40px", flexWrap: "wrap" },
  card:         { flex: 1, minWidth: 280, background: "#F3EAF2", borderRadius: 20, padding: 15, boxShadow: "0 10px 25px rgba(128,87,116,0.18)" },
  mainImg:      { width: "100%", height: 350, borderRadius: 15, objectFit: "cover" },
  thumbs:       { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" },
  thumb:        { width: 70, height: 60, borderRadius: 10, cursor: "pointer", objectFit: "cover" },
  title:        { color: "#805774", fontSize: 24, margin: "0 0 8px" },
  location:     { margin: "0 0 10px", fontSize: 14 },
  badges:       { display: "flex", gap: 8, fontSize: 12, margin: "10px 0", flexWrap: "wrap", alignItems: "center" },
  purpleBadge:  { background: "#805774", color: "#fff", padding: "4px 10px", borderRadius: 20 },
  blueBadge:    { background: "#417C9C", color: "#fff", padding: "4px 10px", borderRadius: 20 },
  price:        { fontSize: 22, color: "#805774", fontWeight: 700, margin: "12px 0" },
  favBtn:       { width: "100%", padding: 10, background: "#805774", color: "#fff", border: "none", borderRadius: 10, marginBottom: 8, cursor: "pointer" },
  primaryBtn:   { width: "100%", padding: 10, background: "#417C9C", color: "#fff", border: "none", borderRadius: 10, marginBottom: 0, cursor: "pointer" },
  secondaryBtn: { width: "100%", padding: 10, background: "transparent", color: "#805774", border: "1.5px solid #805774", borderRadius: 10, cursor: "pointer", marginTop: 8 },
  section:      { margin: "20px 40px", padding: 20, background: "#F3EAF2", borderRadius: 20, boxShadow: "0 8px 20px rgba(128,87,116,0.12)" },
  sectionTitle: { color: "#805774", marginTop: 0, marginBottom: 15 },
  grid:         { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  item:         { background: "#fff", padding: 10, borderRadius: 10 },
  text:         { lineHeight: 1.6, margin: 0 },
  amenityTag:   { background: "#805774", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 12 },
  reviewCard:   { background: "#fff", padding: 14, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
};

export default PropertyDetailsPage;
