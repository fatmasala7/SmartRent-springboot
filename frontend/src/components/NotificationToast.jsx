import { useState, useEffect } from "react";

function NotificationToast({ notification, onClose }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);

    const timer = setTimeout(() => handleClose(), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      style={{
        ...styles.toast,
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? "translateX(0)" : "translateX(110%)",
      }}
    >
      <div style={styles.iconWrap}>{notification.icon || "🔔"}</div>

      <div style={styles.content}>
        <div style={styles.title}>{notification.title}</div>
        <div style={styles.message}>{notification.message}</div>
      </div>

      <button style={styles.closeBtn} onClick={handleClose}>
        ✕
      </button>

      <div style={styles.progressBar}>
        <div style={styles.progressFill} />
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          notification={toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (notification) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...notification, id }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toastContainer = (
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  );

  return { addToast, toastContainer };
}
//styles
const styles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 9999,
    maxWidth: "360px",
    width: "100%",
  },
  toast: {
    background: "white",
    borderRadius: "16px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    boxShadow: "0 8px 32px rgba(128,87,116,0.18)",
    border: "1px solid rgba(128,87,116,0.12)",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  iconWrap: {
    fontSize: "22px",
    flexShrink: 0,
    marginTop: "2px",
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: "14px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "3px",
  },
  message: {
    fontSize: "12px",
    color: "#716458",
    lineHeight: "1.5",
    opacity: 0.85,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#76A0B3",
    padding: "2px",
    flexShrink: 0,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "rgba(128,87,116,0.08)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #805774, #417C9C)",
    animation: "shrink 4s linear forwards",
    width: "100%",
  },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `@keyframes shrink { from { width: 100%; } to { width: 0%; } }`;
document.head.appendChild(styleTag);

export default NotificationToast;
