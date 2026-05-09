import { useRef } from "react";

function PropertyImagesUploader({ images, onChange }) {
  const fileRef = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    onChange([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Upload Images</h3>

      <input
        type="file"
        multiple
        ref={fileRef}
        onChange={handleFiles}
        style={styles.input}
      />

      <div style={styles.grid}>
        {images.map((img, index) => (
          <div key={index} style={styles.imageBox}>
            <img src={img.url} alt="property" style={styles.image} />

            <button
              type="button"
              onClick={() => removeImage(index)}
              style={styles.removeBtn}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
//styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    color: "var(--blackberry)",
  },
  input: {
    padding: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "10px",
  },
  imageBox: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  removeBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    cursor: "pointer",
  },
};

export default PropertyImagesUploader;
