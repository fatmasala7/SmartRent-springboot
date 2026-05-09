function StatsCard({ title, value, icon, color }) {
  return (
    <div style={styles.card}>
      <div
        style={{
          ...styles.iconBox,
          background: color || "var(--jellybean-blue)",
        }}
      >
        {icon}
      </div>

      <div>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.value}>{value}</p>
      </div>
    </div>
  );
}
//styles
const styles = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px 20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "0.3s",
  },

  iconBox: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "22px",
  },

  title: {
    margin: 0,
    fontSize: "13px",
    color: "#777",
  },

  value: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default StatsCard;
