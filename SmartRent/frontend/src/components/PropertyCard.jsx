import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../styles/colors";
import { addFavorite, removeFavorite } from "../services/favoriteService";
import ApplicationModal from "./ApplicationModal";
import { getImageUrlFromProperty, getPropertyId, formatCurrency } from "../utils/displayHelpers";

function PropertyCard({ property, favoriteIds = [], onFavoriteChange }) {
  // Support both old shape (property.id) and API shapes (propertyID/propertyId)
  const pid = getPropertyId(property);
  const [favorite, setFavorite] = useState(() => favoriteIds.includes(pid));
  const [hovered, setHovered] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const navigate = useNavigate();

  // Get real property image from backend fields or safe property placeholder
  const imageUrl = getImageUrlFromProperty(property);

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = [];
    for (let i = 0; i < full; i++) stars.push("⭐");
    if (hasHalf) stars.push("✨");
    return stars.join(" ");
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      if (favorite) {
        await removeFavorite(pid);
        setFavorite(false);
      } else {
        await addFavorite(pid);
        setFavorite(true);
      }
      if (onFavoriteChange) onFavoriteChange();
    } catch (err) {
      console.error("Favorite toggle failed:", err.message);
    }
  };

  return (
    <>
      <div
        style={{
          ...styles.card,
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 16px 40px rgba(128,87,116,0.14)"
            : "0 4px 20px rgba(128,87,116,0.07)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={styles.cardImg}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img
            src={imageUrl}
            alt={property.title}
            style={{
              ...styles.cardImgEl,
              transform: imgHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div style={styles.badgeStatus}>
            {property.rentalStatus || property.status || "Available"}
          </div>
          <div style={styles.badgeType}>
            {property.propertyType || property.type || "Property"}
          </div>
          <button
            onClick={handleFavoriteClick}
            style={{
              ...styles.favBtn,
              background: favorite ? "#fff0f5" : "white",
            }}
          >
            {favorite ? "❤️" : "🤍"}
          </button>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.cardTitle}>{property.title}</div>
          <div style={styles.cardLocation}>📍 {property.location}</div>
          <div style={styles.cardRating}>
            <span>{renderStars(property.rating || 4.0)}</span>
            <span style={{ color: colors.weldonBlue }}>
              {property.rating || 4.0} / 5
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.cardPrice}>
            {formatCurrency(property.price, "EGP")} {" "}
            <span style={styles.cardPriceSub}>/ month</span>
          </div>

          <div style={styles.cardActions}>
            <button
              style={styles.btnPrimary}
              onClick={(e) => {
                e.stopPropagation();
                if (pid) navigate(`/property/${pid}`);
              }}
            >
              View Details
            </button>

            <button
              style={styles.btnSecondary}
              onClick={(e) => {
                e.stopPropagation();
                setShowAppModal(true);
              }}
            >
              Quick Rent
            </button>
          </div>
        </div>
      </div>

      {showAppModal && (
        <ApplicationModal
          property={property}
          onClose={() => setShowAppModal(false)}
          onSuccess={() => navigate("/applications")}
        />
      )}
    </>
  );
}

const styles = {
  card: {
    background: "#FAF7F5",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid rgba(128,87,116,0.10)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "pointer",
  },
  cardImg: { position: "relative", height: "210px", overflow: "hidden" },
  cardImgEl: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  badgeStatus: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "#805774",
    color: "white",
    padding: "5px 11px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },
  badgeType: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    color: "white",
    padding: "4px 10px",
    borderRadius: "7px",
    fontSize: "11px",
    textTransform: "capitalize",
  },
  favBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    border: "none",
    borderRadius: "50%",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    transition: "transform 0.2s",
  },
  cardBody: { padding: "18px 20px 20px" },
  cardTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "17px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "6px",
  },
  cardLocation: {
    fontSize: "13px",
    color: "#716458",
    marginBottom: "8px",
    opacity: 0.8,
  },
  cardRating: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "12px",
    marginBottom: "12px",
  },
  divider: {
    height: "1px",
    background: "rgba(128,87,116,0.10)",
    marginBottom: "14px",
  },
  cardPrice: {
    fontFamily: "Georgia, serif",
    fontSize: "19px",
    fontWeight: "700",
    color: "#417C9C",
    marginBottom: "16px",
  },
  cardPriceSub: {
    fontSize: "12px",
    fontWeight: "400",
    color: "#716458",
    fontFamily: "'Segoe UI', sans-serif",
    opacity: 0.7,
  },
  cardActions: { display: "flex", gap: "10px" },
  btnPrimary: {
    flex: 1,
    padding: "11px",
    borderRadius: "11px",
    border: "none",
    background: "#417C9C",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  btnSecondary: {
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
};

export default PropertyCard;
