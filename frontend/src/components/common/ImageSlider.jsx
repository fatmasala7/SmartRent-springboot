import { useState } from "react";

function ImageSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  if (!images.length) return <div>No Image</div>;

  return (
    <div style={styles.slider}>
      <img src={images[index]} style={styles.img} />

      {images.length > 1 && (
        <>
          <button onClick={prev} style={styles.left}>‹</button>
          <button onClick={next} style={styles.right}>›</button>
        </>
      )}
    </div>
  );
}

const styles = {
  slider: { position: "relative", height: "120px" },
  img: { width: "100%", height: "120px", objectFit: "cover" },
  left: { position: "absolute", left: 5, top: "40%" },
  right: { position: "absolute", right: 5, top: "40%" },
};

export default ImageSlider;
