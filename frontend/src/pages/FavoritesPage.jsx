import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFavorites, removeFavorite } from "../services/favoriteService";
import { getPropertyById } from "../services/propertyService";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favList = await getMyFavorites();
      // Enrich each favorite with property details
      const enriched = await Promise.all(
        favList.map(async (fav) => {
          try {
            const prop = await getPropertyById(fav.propertyID);
            return {
              ...fav,
              title: prop.title,
              location: prop.location,
              price: Number(prop.price),
              status: prop.rentalStatus,
              type: prop.propertyType,
              image: prop.images?.find((i) => i.isMain)?.imageUrl || prop.images?.[0]?.imageUrl || "",
            };
          } catch {
            return { ...fav, title: `Property #${fav.propertyID}`, price: 0, location: "", status: "", type: "", image: "" };
          }
        })
      );
      setFavorites(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleRemove = async (propertyId) => {
    await removeFavorite(propertyId);
    setFavorites((prev) => prev.filter((f) => f.propertyID !== propertyId));
  };

  const sorted = [...favorites].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });

  const avgPrice = favorites.length > 0
    ? Math.round(favorites.reduce((s, p) => s + p.price, 0) / favorites.length).toLocaleString()
    : 0;
  const availableCount = favorites.filter((p) => p.status === "Available").length;

  if (loading) return <div style={{ padding: 60, textAlign: "center", fontSize: 18, color: "#805774" }}>Loading favorites...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />
        <div style={styles.heroLabel}>❤️ &nbsp;My Collection</div>
        <h1 style={styles.heroTitle}>
          My Favorites
          <span style={styles.heroSub}>Properties you've saved</span>
        </h1>
        <div style={styles.heroStats}>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{favorites.length}</div>
            <div style={styles.heroStatLbl}>Saved</div>
          </div>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{availableCount}</div>
            <div style={styles.heroStatLbl}>Available</div>
          </div>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{avgPrice}</div>
            <div style={styles.heroStatLbl}>Avg. Price</div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <span style={styles.sectionTitle}>Saved Properties</span>
            <span style={styles.countBadge}>{favorites.length}</span>
          </div>
          <select style={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Sort: Latest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {favorites.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🤍</div>
            <h3 style={styles.emptyTitle}>No Favorites Yet</h3>
            <p style={styles.emptyText}>Start exploring properties and save your favorites!</p>
            <button style={styles.exploreBtn} onClick={() => navigate("/properties")}>
              Explore Properties
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {sorted.map((property, i) => (
              <PropertyCard key={property.propertyID} property={property} delay={i * 0.07}
                onRemove={handleRemove} onView={() => navigate(`/property/${property.propertyID}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property, delay, onRemove, onView }) {
  const [hovered, setHovered] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  return (
    <div
      style={{ ...styles.card, transform: hovered ? "translateY(-6px)" : "translateY(0)", boxShadow: hovered ? "0 16px 40px rgba(128,87,116,0.14)" : "0 4px 20px rgba(128,87,116,0.07)", animationDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={styles.cardImg} onMouseEnter={() => setImgHovered(true)} onMouseLeave={() => setImgHovered(false)}>
        {property.image ? (
          <img src={property.image} alt={property.title}
            style={{ ...styles.cardImgEl, transform: imgHovered ? "scale(1.05)" : "scale(1)" }} />
        ) : (
          <div style={{ ...styles.cardImgEl, background: "#e8e0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🏠</div>
        )}
        {property.status && <div style={styles.badgeStatus}>{property.status}</div>}
        {property.type && <div style={styles.badgeType}>{property.type}</div>}
        <div style={styles.favBtn}>❤️</div>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.cardTitle}>{property.title}</div>
        {property.location && <div style={styles.cardLocation}>📍 {property.location}</div>}
        <div style={styles.divider} />
        <div style={styles.cardPrice}>
          {property.price ? property.price.toLocaleString() : "—"} EGP{" "}
          <span style={styles.cardPriceSub}>/ month</span>
        </div>
        <div style={styles.cardActions}>
          <button style={styles.btnPrimary} onClick={onView}>View Details</button>
          <button style={styles.btnRemove} onClick={() => onRemove(property.propertyID)}>Remove</button>
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
  heroLabel: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", color: "rgba(255,255,255,0.85)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "18px", fontWeight: "500" },
  heroTitle: { fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: "700", color: "white", lineHeight: "1.15", marginBottom: "10px", position: "relative", zIndex: 1 },
  heroSub: { color: "rgba(255,255,255,0.5)", fontSize: "20px", fontWeight: "400", display: "block", fontFamily: "'Segoe UI', sans-serif", marginTop: "6px" },
  heroStats: { display: "flex", gap: "16px", marginTop: "28px", position: "relative", zIndex: 1, flexWrap: "wrap" },
  heroStat: { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px", padding: "12px 24px", textAlign: "center" },
  heroStatVal: { fontSize: "22px", fontWeight: "700", color: "white", fontFamily: "Georgia, serif" },
  heroStatLbl: { fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.5px" },
  content: { padding: "36px 40px", maxWidth: "1200px", margin: "0 auto" },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" },
  toolbarLeft: { display: "flex", alignItems: "center", gap: "10px" },
  sectionTitle: { fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#805774" },
  countBadge: { background: "#805774", color: "white", borderRadius: "100px", padding: "3px 11px", fontSize: "12px", fontWeight: "500" },
  sortSelect: { background: "white", border: "1.5px solid rgba(128,87,116,0.15)", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", color: "#716458", cursor: "pointer", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
  card: { background: "#FAF7F5", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(128,87,116,0.10)", transition: "transform 0.25s ease, box-shadow 0.25s ease", position: "relative" },
  cardImg: { position: "relative", height: "210px", overflow: "hidden" },
  cardImgEl: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" },
  badgeStatus: { position: "absolute", top: "12px", left: "12px", background: "#805774", color: "white", padding: "5px 11px", borderRadius: "8px", fontSize: "11px", fontWeight: "600" },
  badgeType: { position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.55)", color: "white", padding: "4px 10px", borderRadius: "7px", fontSize: "11px", textTransform: "capitalize" },
  favBtn: { position: "absolute", top: "12px", right: "12px", background: "white", borderRadius: "50%", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
  cardBody: { padding: "18px 20px 20px" },
  cardTitle: { fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: "600", color: "#805774", marginBottom: "6px" },
  cardLocation: { fontSize: "13px", color: "#716458", marginBottom: "8px", opacity: 0.8 },
  divider: { height: "1px", background: "rgba(128,87,116,0.10)", margin: "0 0 14px" },
  cardPrice: { fontSize: "20px", fontWeight: "700", color: "#417C9C", fontFamily: "Georgia, serif", marginBottom: "16px" },
  cardPriceSub: { fontSize: "12px", fontWeight: "400", color: "#716458", fontFamily: "'Segoe UI', sans-serif", opacity: 0.7 },
  cardActions: { display: "flex", gap: "10px" },
  btnPrimary: { flex: 1, padding: "11px", borderRadius: "11px", border: "none", background: "#417C9C", color: "white", fontSize: "13px", fontWeight: "500", cursor: "pointer" },
  btnRemove: { flex: 1, padding: "11px", borderRadius: "11px", border: "1.5px solid rgba(128,87,116,0.2)", background: "transparent", color: "#805774", fontSize: "13px", fontWeight: "500", cursor: "pointer" },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { width: "80px", height: "80px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(128,87,116,0.10)" },
  emptyTitle: { fontFamily: "Georgia, serif", fontSize: "22px", color: "#805774", marginBottom: "8px" },
  emptyText: { fontSize: "14px", color: "#716458", opacity: 0.7, marginBottom: "24px" },
  exploreBtn: { background: "#805774", color: "white", border: "none", borderRadius: "12px", padding: "13px 28px", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
};

export default FavoritesPage;
