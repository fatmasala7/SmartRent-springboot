import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService";

const TYPE_COLORS = {
  visit_confirmed: { bg: "#E8F5E9", color: "#2E7D32" },
  visit_cancelled: { bg: "#FFEBEE", color: "#C62828" },
  application_approved: { bg: "#E8F5E9", color: "#2E7D32" },
  application_rejected: { bg: "#FFEBEE", color: "#C62828" },
  new_message: { bg: "#E3F2FD", color: "#1565C0" },
  rent_due: { bg: "#FFF8E1", color: "#B8860B" },
  general: { bg: "#F3EAF2", color: "#805774" },
};

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch((e) => console.error(e));
  }, []);

  const refresh = () => getMyNotifications().then(setNotifications).catch(console.error);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    refresh();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    refresh();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    refresh();
  };

  const handleClearAll = async () => {
    await Promise.all(notifications.map((n) => deleteNotification(n.notificationID)));
    refresh();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered =
    filter === "All"
      ? notifications
      : filter === "Unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications.filter((n) => n.isRead);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroCircle1} />
        <div style={styles.heroCircle2} />

        <div style={styles.heroLabel}>🔔 Notifications</div>

        <h1 style={styles.heroTitle}>
          Your Notifications
          <span style={styles.heroSub}>Stay updated on your activity</span>
        </h1>

        <div style={styles.heroStats}>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{notifications.length}</div>
            <div style={styles.heroStatLbl}>Total</div>
          </div>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>{unreadCount}</div>
            <div style={styles.heroStatLbl}>Unread</div>
          </div>
          <div style={styles.heroStat}>
            <div style={styles.heroStatVal}>
              {notifications.length - unreadCount}
            </div>
            <div style={styles.heroStatLbl}>Read</div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.toolbar}>
          <div style={styles.tabs}>
            {["All", "Unread", "Read"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  ...styles.tab,
                  background: filter === tab ? "#805774" : "white",
                  color: filter === tab ? "white" : "#716458",
                  border:
                    filter === tab
                      ? "1.5px solid #805774"
                      : "1.5px solid rgba(128,87,116,0.15)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={styles.toolbarActions}>
            {unreadCount > 0 && (
              <button style={styles.actionBtn} onClick={handleMarkAllRead}>
                ✓ Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button style={styles.actionBtnDanger} onClick={handleClearAll}>
                🗑 Clear all
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🔔</div>
            <h3 style={styles.emptyTitle}>No notifications</h3>
            <p style={styles.emptyText}>You're all caught up!</p>
            <button
              style={styles.exploreBtn}
              onClick={() => navigate("/properties")}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((notification) => (
              <NotificationCard
                key={notification.notificationID}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationCard({ notification, onMarkRead, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const typeColor = TYPE_COLORS[notification.type] || TYPE_COLORS.general;

  const parsedDate = notification.createdAt ? new Date(notification.createdAt) : null;
  const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div
      style={{
        ...styles.card,
        background: notification.isRead ? "#FAF7F5" : "white",
        boxShadow: hovered
          ? "0 8px 24px rgba(128,87,116,0.12)"
          : "0 2px 12px rgba(128,87,116,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!notification.isRead && <div style={styles.unreadDot} />}

      <div
        style={{
          ...styles.iconWrap,
          background: typeColor.bg,
        }}
      >
        <span style={{ fontSize: "20px" }}>{notification.icon}</span>
      </div>

      <div style={styles.cardContent}>
        <div style={styles.cardTitle}>{notification.title}</div>
        <div style={styles.cardMessage}>{notification.message}</div>
        <div style={styles.cardDate}>{formattedDate}</div>
      </div>

      <div style={styles.cardActions}>
        {!notification.isRead && (
          <button
            style={styles.readBtn}
            onClick={() => onMarkRead(notification.notificationID)}
          >
            ✓
          </button>
        )}
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(notification.notificationID)}
        >
          ✕
        </button>
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
  hero: {
    background:
      "linear-gradient(135deg, #805774 0%, #5a3b4f 60%, #417C9C 100%)",
    padding: "56px 40px 48px",
    position: "relative",
    overflow: "hidden",
  },
  heroCircle1: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
  },
  heroCircle2: {
    position: "absolute",
    bottom: "-80px",
    left: "30%",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(65,124,156,0.18)",
  },
  heroLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "100px",
    padding: "5px 14px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "18px",
    fontWeight: "500",
  },
  heroTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "40px",
    fontWeight: "700",
    color: "white",
    lineHeight: "1.15",
    position: "relative",
    zIndex: 1,
  },
  heroSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "18px",
    fontWeight: "400",
    display: "block",
    fontFamily: "'Segoe UI', sans-serif",
    marginTop: "6px",
  },
  heroStats: {
    display: "flex",
    gap: "16px",
    marginTop: "28px",
    position: "relative",
    zIndex: 1,
    flexWrap: "wrap",
  },
  heroStat: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    padding: "12px 24px",
    textAlign: "center",
  },
  heroStatVal: {
    fontSize: "22px",
    fontWeight: "700",
    color: "white",
    fontFamily: "Georgia, serif",
  },
  heroStatLbl: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    marginTop: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  content: { padding: "32px 40px", maxWidth: "800px", margin: "0 auto" },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  tabs: { display: "flex", gap: "8px" },
  tab: {
    padding: "8px 18px",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Segoe UI', sans-serif",
  },
  toolbarActions: { display: "flex", gap: "8px" },
  actionBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#417C9C",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  actionBtnDanger: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1.5px solid rgba(200,50,50,0.2)",
    background: "#fff5f5",
    color: "#c0392b",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  card: {
    borderRadius: "16px",
    padding: "16px 20px",
    border: "1px solid rgba(128,87,116,0.10)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: "18px",
    left: "8px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#805774",
  },
  iconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "15px",
    fontWeight: "600",
    color: "#805774",
    marginBottom: "4px",
  },
  cardMessage: {
    fontSize: "13px",
    color: "#716458",
    lineHeight: "1.5",
    opacity: 0.85,
    marginBottom: "6px",
  },
  cardDate: { fontSize: "11px", color: "#76A0B3" },
  cardActions: { display: "flex", gap: "6px", flexShrink: 0 },
  readBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "none",
    background: "#E8F5E9",
    color: "#2E7D32",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1.5px solid rgba(200,50,50,0.15)",
    background: "#fff5f5",
    color: "#c0392b",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "56px", marginBottom: "16px" },
  emptyTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "22px",
    color: "#805774",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#716458",
    opacity: 0.7,
    marginBottom: "24px",
  },
  exploreBtn: {
    background: "#805774",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "13px 28px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default NotificationsPage;
