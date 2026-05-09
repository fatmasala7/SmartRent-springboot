import { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import { colors } from "../styles/colors";
import { getAllProperties, searchProperties } from "../services/propertyService";

function PropertiesPage() {
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    location: "",
    type: "",
    maxPrice: "",
  });
  const itemsPerPage = 6;

  useEffect(() => {
    getAllProperties()
      .then(setAllProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  let properties = [...allProperties];

  properties = properties.filter((p) => {
    return (
      (filter.location === "" ||
        (p.location || "").toLowerCase().includes(filter.location.toLowerCase())) &&
      (filter.type === "" || (p.propertyType || "").toLowerCase() === filter.type) &&
      (filter.maxPrice === "" || p.price <= Number(filter.maxPrice))
    );
  });

  if (sort === "low") properties.sort((a, b) => a.price - b.price);
  else if (sort === "new") properties.sort((a, b) => b.propertyID - a.propertyID);

  const start = (page - 1) * itemsPerPage;
  const paginated = properties.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  return (
    <div style={styles.page}>
      <div style={styles.heroBanner}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>Find Your Dream Home</h1>
          <p style={styles.heroSub}>
            Discover the best rental properties in Egypt
          </p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Browse Properties</h2>
          <p style={styles.pageDesc}>{properties.length} properties found</p>
        </div>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="🔍  Search by location"
            value={filter.location}
            onChange={(e) => {
              setFilter({ ...filter, location: e.target.value });
              setPage(1);
            }}
            style={styles.filterInput}
          />
          <select
            value={filter.type}
            onChange={(e) => {
              setFilter({ ...filter, type: e.target.value });
              setPage(1);
            }}
            style={styles.filterInput}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
          </select>
          <input
            type="number"
            placeholder="Max Price (EGP)"
            value={filter.maxPrice}
            onChange={(e) => {
              setFilter({ ...filter, maxPrice: e.target.value });
              setPage(1);
            }}
            style={styles.filterInput}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={styles.filterInput}
          >
            <option value="">Sort By</option>
            <option value="low">Cheapest</option>
            <option value="new">Newest</option>
          </select>

          <div style={styles.viewBtns}>
            <button
              onClick={() => setView("grid")}
              style={{
                ...styles.viewBtn,
                background:
                  view === "grid" ? colors.jellyBeanBlue : colors.weldonBlue,
              }}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setView("list")}
              style={{
                ...styles.viewBtn,
                background:
                  view === "list" ? colors.jellyBeanBlue : colors.weldonBlue,
              }}
            >
              ☰ List
            </button>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🏠</div>
            <h3 style={styles.emptyTitle}>No properties found</h3>
            <p style={styles.emptyText}>Try adjusting your filters</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                view === "grid"
                  ? "repeat(auto-fill, minmax(290px, 1fr))"
                  : "1fr",
              gap: "22px",
            }}
          >
            {paginated.map((property) => (
              <PropertyCard key={property.propertyID || property.propertyId || property.id} property={property} />
            ))}
          </div>
        )}

        <div style={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              ...styles.pagBtn,
              opacity: page === 1 ? 0.4 : 1,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Prev
          </button>
          <span style={styles.pagInfo}>
            Page {page} / {totalPages || 1}
          </span>
          <button
            disabled={start + itemsPerPage >= properties.length}
            onClick={() => setPage(page + 1)}
            style={{
              ...styles.pagBtn,
              opacity: start + itemsPerPage >= properties.length ? 0.4 : 1,
              cursor:
                start + itemsPerPage >= properties.length
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next →
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
  heroBanner: {
    height: "300px",
    margin: "24px 24px 0",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "24px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.42)",
  },
  heroText: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "white",
  },
  heroTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "38px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  heroSub: { fontSize: "15px", opacity: 0.8 },
  content: { padding: "28px 24px", maxWidth: "1200px", margin: "0 auto" },
  pageHeader: { marginBottom: "24px" },
  pageTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "28px",
    color: "#805774",
    marginBottom: "6px",
  },
  pageDesc: { fontSize: "14px", color: "#716458", opacity: 0.75 },
  filters: {
    background: "white",
    padding: "18px 20px",
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 4px 16px rgba(128,87,116,0.07)",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
    border: "1px solid rgba(128,87,116,0.08)",
  },
  filterInput: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid rgba(128,87,116,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "13px",
    color: "#716458",
    outline: "none",
    minWidth: "160px",
  },
  viewBtns: { display: "flex", gap: "8px", marginLeft: "auto" },
  viewBtn: {
    padding: "9px 18px",
    borderRadius: "10px",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    color: "white",
    transition: "background 0.2s",
  },
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIcon: { fontSize: "48px", marginBottom: "16px" },
  emptyTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "20px",
    color: "#805774",
    marginBottom: "8px",
  },
  emptyText: { fontSize: "14px", color: "#716458", opacity: 0.7 },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "32px",
  },
  pagBtn: {
    padding: "10px 24px",
    border: "none",
    borderRadius: "100px",
    background: "#805774",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  pagInfo: {
    fontFamily: "Georgia, serif",
    fontSize: "15px",
    color: "#805774",
    fontWeight: "600",
  },
};

export default PropertiesPage;
