import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import { createReview } from "../services/reviewService";

function AddReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const property = location.state || { propertyID: null, title: "Property" };

  const handleSubmit = async (reviewData) => {
    try {
      await createReview({
        propertyID: property.propertyID ?? property.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setSubmitted(true);
    } catch(e) {
      setError(e.message || "Failed to submit review");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <div style={styles.heroLabel}> &nbsp;Write a Review</div>
        <h1 style={styles.heroTitle}>
          Share Your Experience
          <span style={styles.heroSub}>
            Help others find their perfect home
          </span>
        </h1>
        <div style={styles.propMini}>
          <img
            src={property.image || property.images?.[0]}
            alt={property.title}
            style={styles.propMiniImg}
          />
          <div>
            <h4 style={styles.propMiniTitle}>{property.title}</h4>
            <p style={styles.propMiniSub}>
              {property.location} &nbsp;·&nbsp;{" "}
              {property.price?.toLocaleString()} EGP / month
            </p>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {submitted ? (
          <div style={styles.successCard}>
            <div style={styles.successIcon}>🎉</div>
            <h2 style={styles.successTitle}>Review Submitted!</h2>
            <p style={styles.successText}>
              Thank you for sharing your experience. Your review helps others
              find their perfect home.
            </p>
            <button
              style={styles.successBtn}
              onClick={() => navigate("/properties")}
            >
              Browse More Properties
            </button>
            <button
              style={styles.successBtnOutline}
              onClick={() => navigate(-1)}
            >
              Back to Property
            </button>
          </div>
        ) : (
          <ReviewForm
            property={property}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        )}
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
    padding: "48px 40px 42px",
    position: "relative",
    overflow: "hidden",
  },
  heroCircle1: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
  },
  heroCircle2: {
    position: "absolute",
    bottom: "-80px",
    left: "25%",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background: "rgba(65,124,156,0.15)",
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
    marginBottom: "16px",
    fontWeight: "500",
  },
  heroTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "36px",
    fontWeight: "700",
    color: "white",
    lineHeight: "1.2",
    position: "relative",
    zIndex: 1,
  },
  heroSub: {
    display: "block",
    fontSize: "16px",
    fontWeight: "400",
    fontFamily: "'Segoe UI', sans-serif",
    color: "rgba(255,255,255,0.6)",
    marginTop: "6px",
  },
  propMini: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "14px",
    padding: "14px 18px",
    marginTop: "24px",
    position: "relative",
    zIndex: 1,
    maxWidth: "480px",
  },
  propMiniImg: {
    width: "56px",
    height: "56px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  propMiniTitle: {
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "3px",
  },
  propMiniSub: { color: "rgba(255,255,255,0.6)", fontSize: "12px" },
  content: { padding: "32px 40px", maxWidth: "760px", margin: "0 auto" },
  successCard: {
    background: "white",
    borderRadius: "24px",
    padding: "48px 32px",
    textAlign: "center",
    border: "1px solid rgba(128,87,116,0.10)",
    boxShadow: "0 4px 24px rgba(128,87,116,0.08)",
  },
  successIcon: { fontSize: "56px", marginBottom: "20px" },
  successTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "28px",
    color: "#805774",
    marginBottom: "12px",
  },
  successText: {
    fontSize: "15px",
    color: "#716458",
    lineHeight: "1.6",
    opacity: 0.8,
    marginBottom: "28px",
    maxWidth: "380px",
    margin: "0 auto 28px",
  },
  successBtn: {
    display: "block",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #805774, #417C9C)",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "10px",
  },
  successBtnOutline: {
    display: "block",
    width: "100%",
    padding: "13px",
    borderRadius: "14px",
    border: "1.5px solid rgba(128,87,116,0.2)",
    background: "transparent",
    color: "#805774",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default AddReviewPage;
