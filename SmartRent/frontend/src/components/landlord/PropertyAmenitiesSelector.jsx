function PropertyAmenitiesSelector({ selected, onChange }) {
  const amenitiesList = [
    "WiFi",
    "Air Conditioning",
    "Parking",
    "Balcony",
    "Security",
    "Elevator",
    "Furnished",
    "Pet Friendly",
  ];

  const toggleAmenity = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((a) => a !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Amenities</h3>

      <div style={styles.grid}>
        {amenitiesList.map((item) => (
          <label key={item} style={styles.item}>
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggleAmenity(item)}
            />
            <span style={{ marginLeft: "8px" }}>{item}</span>
          </label>
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
    gap: "10px",
  },
  title: {
    color: "var(--blackberry)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "10px",
  },
  item: {
    background: "#f9f9f9",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default PropertyAmenitiesSelector;
