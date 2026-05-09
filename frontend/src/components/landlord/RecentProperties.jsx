function RecentProperties() {
  const properties = [
    { id: 1, name: "Modern Apartment", status: "Active", price: "$1200" },
    { id: 2, name: "Studio Room", status: "Pending", price: "$800" },
    { id: 3, name: "Villa Lux", status: "Active", price: "$2500" },
  ];

  return (
    <div style={styles.box}>
      <h3 style={styles.title}>Recent Properties</h3>

      {properties.map((p) => (
        <div key={p.id} style={styles.item}>
          <div>
            <p style={styles.name}>{p.name}</p>
            <span style={styles.status}>{p.status}</span>
          </div>

          <div style={styles.price}>{p.price}</div>
        </div>
      ))}
    </div>
  );
}
//styles
const styles = {
  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  title: {
    marginBottom: "15px",
    color: "var(--blackberry)",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  name: {
    margin: 0,
    fontWeight: "bold",
  },

  status: {
    fontSize: "12px",
    color: "#777",
  },

  price: {
    fontWeight: "bold",
    color: "var(--jellybean-blue)",
  },
};

export default RecentProperties;
