import { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { getMyNotifications, markAsRead as markNotificationAsRead } from "../../services/notificationService";

function LandlordLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(() => {
    getMyNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Failed to load landlord notifications", e));
  }, []);

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);
    return () => clearInterval(timer);
  }, [loadNotifications]);

  const addNotification = (message) => {
    setNotifications((prev) => [
      { notificationID: Date.now(), message, title: "Livora", isRead: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => ((n.notificationID ?? n.id) === id ? { ...n, isRead: true, read: true } : n)),
    );
    try {
      await markNotificationAsRead(id);
      loadNotifications();
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ ...styles.main, marginLeft: collapsed ? "80px" : "240px" }}>
        <div style={styles.navbarWrapper}>
          <Navbar notifications={notifications} markAsRead={markAsRead} />
        </div>

        <div style={styles.content}>
          <Outlet context={{ addNotification, refreshNotifications: loadNotifications }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", minHeight: "100vh", background: "var(--pastel-gray)" },
  main: { flex: 1, display: "flex", flexDirection: "column", transition: "0.3s ease", minHeight: "100vh" },
  navbarWrapper: { height: "60px", flexShrink: 0 },
  content: { flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" },
};

export default LandlordLayout;
