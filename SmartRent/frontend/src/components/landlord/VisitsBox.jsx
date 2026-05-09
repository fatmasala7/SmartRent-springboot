function VisitsBox() {
  const visits = [
    { id: 1, user: "Ahmed", date: "2026-04-20", status: "Pending" },
    { id: 2, user: "Sara", date: "2026-04-21", status: "Approved" },
  ];

  return (
    <div style={styles.box}>
      <h3 style={styles.title}>Visit Requests</h3>

      {visits.map((v) => (
        <div key={v.id} style={styles.row}>
          <span>{v.user}</span>
          <span>{v.date}</span>
          <span style={styles.status}>{v.status}</span>
        </div>
      ))}
    </div>
  );
}

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

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },

  status: {
    color: "var(--jellybean-blue)",
    fontWeight: "bold",
  },
};

export default VisitsBox;