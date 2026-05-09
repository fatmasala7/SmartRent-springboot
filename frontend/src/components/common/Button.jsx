function Button({ children, variant = "primary", ...props }) {
  const styles = {
    base: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "0.2s",
    },

    primary: {
      background: "var(--jellybean-blue)",
      color: "#fff",
    },

    secondary: {
      background: "var(--weldon-blue)",
      color: "#fff",
    },

    danger: {
      background: "var(--boy-red)",
      color: "#fff",
    },
  };

  return (
    <button
      {...props}
      style={{
        ...styles.base,
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

export default Button;