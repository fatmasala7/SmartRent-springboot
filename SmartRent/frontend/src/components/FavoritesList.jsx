import PropertyCard from "./PropertyCard";
import { colors } from "../styles/colors";

function FavoritesList({ favorites, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: colors.weldonBlue,
        }}
      >
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>🤍</div>
        <h3 style={{ color: colors.blackberry, marginBottom: "10px" }}>
          No Favorites Yet
        </h3>
        <p>Start exploring properties and save your favorites!</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {favorites.map((property) => (
        <div key={property.id} style={{ position: "relative" }}>
          <PropertyCard property={property} />
          <button
            onClick={() => onRemove(property.id)}
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              background: colors.boyRed,
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              width: "calc(100% - 36px)",
            }}
          >
            Remove from Favorites
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoritesList;
