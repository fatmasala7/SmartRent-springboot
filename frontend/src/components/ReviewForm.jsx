import { useState, useRef } from "react";
const RATING_LABELS = ["", "Terrible", "Bad", "Okay", "Great", "Excellent"];
function ReviewForm({ property, onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4 - images.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) =>
          prev.length < 4
            ? [...prev, { url: ev.target.result, name: file.name }]
            : prev,
        );
      };
      reader.readAsDataURL(file);
    });
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = () => {
    if (rating === 0) return setError("Please select a rating.");
    if (comment.trim().length < 10)
      return setError("Comment must be at least 10 characters.");
    setError("");
    onSubmit({
      propertyId: property.id,
      propertyTitle: property.title,
      rating,
      comment: comment.trim(),
      images: images.map((img) => img.url),
    });
  };
  const displayRating = hovered || rating;
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>⭐ Overall Rating</div>
        <div style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                ...styles.star,
                filter: star <= displayRating ? "none" : "grayscale(1)",
                opacity: star <= displayRating ? 1 : 0.35,
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
            >
              ⭐
            </span>
          ))}
        </div>
        <div style={styles.ratingLabel}>
          {displayRating > 0
            ? `${RATING_LABELS[displayRating]} — ${displayRating} / 5`
            : "Select a rating"}
        </div>
      </div>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>💬 Your Comment</div>
        <textarea
          style={styles.textarea}
          placeholder="Tell us about your experience. Was the landlord responsive? Is the location convenient? Any pros or cons?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
        />
        <div style={styles.charCount}>{comment.length} / 500</div>
      </div>
      <div style={styles.card}>
        <div style={styles.sectionTitle}>
          📸 Add Photos <span style={styles.optional}>(optional)</span>
        </div>
        {images.length < 4 && (
          <div
            style={styles.uploadArea}
            onClick={() => fileRef.current.click()}
          >
            <div style={styles.uploadIcon}>🖼️</div>
            <div style={styles.uploadText}>
              Drag & drop or <span style={styles.uploadLink}>browse</span>
            </div>
            <div style={styles.uploadHint}>
              PNG, JPG up to 5MB · Max 4 photos
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
        )}
         
        {images.length > 0 && (
          <div style={styles.imgPreview}>
            {images.map((img, i) => (
              <div key={i} style={styles.imgItem}>
                <img src={img.url} alt={img.name} style={styles.imgEl} />
                <button
                  style={styles.imgRemove}
                  onClick={() => handleRemoveImage(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
       {error && <div style={styles.error}>{error}</div>} 
      <button style={styles.submitBtn} onClick={handleSubmit}>
        ✅ &nbsp;Submit Review
      </button>
      <button style={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
//styles
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "28px 28px 24px",
    border: "1px solid rgba(128,87,116,0.10)",
    boxShadow: "0 4px 24px rgba(128,87,116,0.07)",
  },
  sectionTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "17px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  optional: {
    fontSize: "12px",
    fontWeight: "400",
    color: "#76A0B3",
    fontFamily: "'Segoe UI', sans-serif",
  },

  starsRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  star: {
    fontSize: "32px",
    cursor: "pointer",
    transition: "transform 0.15s",
    userSelect: "none",
  },
  ratingLabel: {
    fontSize: "13px",
    color: "#76A0B3",
    marginTop: "6px",
    minHeight: "20px",
  },

  textarea: {
    width: "100%",
    minHeight: "130px",
    padding: "14px 16px",
    border: "1.5px solid rgba(128,87,116,0.15)",
    borderRadius: "12px",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    color: "#716458",
    outline: "none",
    resize: "vertical",
    lineHeight: "1.6",
  },
  charCount: {
    textAlign: "right",
    fontSize: "12px",
    color: "#76A0B3",
    marginTop: "6px",
  },

  uploadArea: {
    border: "2px dashed rgba(128,87,116,0.25)",
    borderRadius: "14px",
    padding: "28px",
    textAlign: "center",
    cursor: "pointer",
    background: "#faf7f5",
    transition: "all 0.2s",
  },
  uploadIcon: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  uploadText: {
    fontSize: "13px",
    color: "#716458",
    opacity: 0.8,
  },
  uploadLink: {
    color: "#417C9C",
    fontWeight: "500",
    cursor: "pointer",
  },
  uploadHint: {
    fontSize: "11px",
    color: "#76A0B3",
    marginTop: "6px",
  },

  imgPreview: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  imgItem: {
    position: "relative",
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "2px solid rgba(128,87,116,0.15)",
  },
  imgEl: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imgRemove: {
    position: "absolute",
    top: "3px",
    right: "3px",
    background: "rgba(128,87,116,0.85)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  error: {
    background: "#fff0f0",
    border: "1px solid rgba(200,50,50,0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#c0392b",
  },

  submitBtn: {
    width: "100%",
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #805774, #417C9C)",
    color: "white",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.3px",
  },
  cancelBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "14px",
    border: "1.5px solid rgba(128,87,116,0.2)",
    background: "transparent",
    color: "#805774",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
export default ReviewForm;
