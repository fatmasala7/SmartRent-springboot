function PropertyForm({ data, onChange }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Property Information</h3>

      <input
        style={styles.input}
        type="text"
        placeholder="Property Title"
        value={data.title}
        onChange={(e) => onChange("title", e.target.value)}
      />

      <input
        style={styles.input}
        type="text"
        placeholder="Location"
        value={data.location}
        onChange={(e) => onChange("location", e.target.value)}
      />

      <input
        style={styles.input}
        type="number"
        placeholder="Price"
        value={data.price}
        onChange={(e) => onChange("price", e.target.value)}
      />

      <textarea
        style={styles.textarea}
        placeholder="Description"
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
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
    marginBottom: "8px",
    color: "var(--blackberry)",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "100px",
    resize: "none",
  },
};

export default PropertyForm;
