import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goProtected = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.overlay} />
        <div
          style={{ position: "relative", textAlign: "center", color: "white" }}
        >
          <h1 style={{ fontSize: "46px" }}>Find Your Perfect Home Easily</h1>
          <p>Search, visit and rent with confidence</p>
          <button
            onClick={() => navigate("/properties")}
            style={styles.heroBtn}
          >
            Explore Now
          </button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <Stat title="Properties" value="120+" />
        <Stat title="Active Users" value="1.2K" />
        <Stat title="Visits Booked" value="350+" />
        <Stat title="Reviews" value="500+" />
      </div>

      <Section title="Quick Access">
        <div style={styles.grid}>
          <Card
            title="Browse Properties"
            img={img1}
            onClick={() => navigate("/properties")}
          />
          <Card
            title="Favorites"
            img={img2}
            onClick={() => goProtected("/favorites")}
          />
          <Card
            title="Visits"
            img={img3}
            onClick={() => goProtected("/visits")}
          />
          <Card
            title="Applications"
            img={img4}
            onClick={() => goProtected("/applications")}
          />
          <Card
            title="Notifications"
            img={img5}
            onClick={() => goProtected("/notifications")}
          />
          <Card
            title="My Rentals"
            img={img6}
            onClick={() => goProtected("/rentals")}
          />
          <Card
            title="Add Review"
            img={img7}
            onClick={() => goProtected("/review")}
          />
        </div>
      </Section>

      <Section title="What Users Say">
        <div style={styles.reviewGrid}>
          <ReviewCard
            name="Sarah"
            text="Very smooth and professional platform."
          />
          <ReviewCard name="Ahmed" text="Found my apartment in days." />
          <ReviewCard name="Mona" text="Clean UI and easy navigation." />
        </div>
      </Section>

      <div style={styles.footerBox}>
        <div style={styles.footerGrid}>
          <div>
            <h3>Livora</h3>
            <p>Find your perfect home easily and safely.</p>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>Email: support@smartrent.com</p>
            <p>Phone: +20 100 000 0000</p>
            <p>Cairo, Egypt</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p>Home</p>
            <p>Properties</p>
            <p>Favorites</p>
            <p>Visits</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          © 2026 Livora — All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "15px" }}>{title}</h2>
      {children}
    </div>
  );
}

function Card({ title, img, onClick }) {
  return (
    <div onClick={onClick} style={styles.card}>
      <img src={img} style={styles.imgStyle} alt={title} />
      <div style={{ padding: "10px" }}>{title}</div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={styles.statCard}>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

function ReviewCard({ name, text }) {
  return (
    <div style={styles.reviewCard}>
      <h4>{name}</h4>
      <p>"{text}"</p>
    </div>
  );
}

const img1 = "https://images.unsplash.com/photo-1600585154526-990dced4db0d";
const img2 = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c";
const img3 = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";
const img4 = "https://images.unsplash.com/photo-1494526585095-c41746248156";
const img5 = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a";
const img6 = "https://images.unsplash.com/photo-1501183638710-841dd1904471";
const img7 = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d";

//styles

const styles = {
  page: {
    background: "#D8CCC5",
    minHeight: "100vh",
    color: "#716458",
    fontFamily: "'Segoe UI', sans-serif",
  },
  hero: {
    height: "420px",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
  },
  heroBtn: {
    marginTop: "15px",
    padding: "12px 20px",
    background: "#417C9C",
    border: "none",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    padding: "20px",
  },
  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  },
  imgStyle: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
  },
  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  reviewCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
  },
  footerBox: {
    marginTop: "40px",
    background: "#805774",
    color: "white",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "30px",
  },
  footerBottom: {
    textAlign: "center",
    padding: "15px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
  },
};

export default HomePage;
