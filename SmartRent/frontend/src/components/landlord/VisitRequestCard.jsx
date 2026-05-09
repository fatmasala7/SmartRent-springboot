function Button({
  children,
  variant = "primary",
  onClick,
}) {
  const styles = {
    base: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.2s ease",
      userSelect: "none",
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

  const variantStyle = styles[variant] || styles.primary;

  const handleMouseDown = (e) => {
    e.currentTarget.style.transform = "scale(0.97)";
    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  };

  const handleMouseUp = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <button
      style={{ ...styles.base, ...variantStyle }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </button>
  );
}

export default Button;