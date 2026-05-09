import { useLocation, useNavigate } from "react-router-dom";
import { MdNotifications } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const routeTitles = {
  dashboard: "Dashboard",
  properties: "My Properties",
  "create-property": "Create Property",
  "edit-property": "Edit Property",
  profile: "My Profile",
  "visit-requests": "Visit Requests",
  "rental-applications": "Rental Applications",
};

function getPageTitle(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];

  if (!isNaN(last)) {
    if (parts.includes("properties")) return "Property Details";
    if (parts.includes("edit-property")) return "Edit Property";
    return "Details";
  }

  return routeTitles[last] || last?.replace("-", " ") || "Dashboard";
}

function Navbar({ notifications = [], markAsRead }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const pageTitle = getPageTitle(location.pathname);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();
  const notifRef = useRef();

  const normalizedNotifications = (notifications || []).map((n) => ({
    id: n.notificationID ?? n.id,
    title: n.title || "Livora Notification",
    message: n.message || n.title || "New notification",
    isRead: Boolean(n.isRead ?? n.read),
    createdAt: n.createdAt,
  }));
  const unreadCount = normalizedNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = (id) => {
    markAsRead?.(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const landlord = {
    name: user?.fullName || "Landlord User",
    email: user?.email || "landlord@email.com",
    avatar: "👤",
  };

  return (
    <div style={styles.navbar}>
      <h3 style={styles.title}>{pageTitle}</h3>

      <div style={styles.right}>
        <div style={styles.notifWrap} ref={notifRef}>
          <div style={styles.iconBtn} onClick={() => setNotifOpen((p) => !p)}>
            <MdNotifications size={16} />
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </div>

          {notifOpen && (
            <div style={styles.dropdown}>
              {normalizedNotifications.length === 0 && (
                <p style={styles.empty}>No notifications</p>
              )}

              {normalizedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n.id)}
                  style={{
                    ...styles.item,
                    background: n.isRead ? "#fff" : "#eef2ff",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 3 }}>{n.title}</strong>
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.profileWrap} ref={profileRef}>
          <div style={styles.user} onClick={() => setProfileOpen((p) => !p)}>
            <span style={styles.avatar}>{landlord.avatar}</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", fontWeight: "600" }}>
                {landlord.name}
              </span>
              <span style={{ fontSize: "10px", color: "#777" }}>Landlord</span>
            </div>
          </div>

          {profileOpen && (
            <div style={styles.profileDropdown}>
              <p style={styles.name}>{landlord.name}</p>
              <p style={styles.email}>{landlord.email}</p>

              <button
                style={styles.profileBtn}
                onClick={() => navigate("/landlord/profile")}
              >
                View Profile
              </button>

              <button
                style={styles.editBtn}
                onClick={() => navigate("/landlord/edit-profile")}
              >
                Edit Profile
              </button>

              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
//styles
const styles = {
  navbar: {
    height: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 18px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  title: {
    marginLeft: "90px",
    fontSize: "15px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  right: { display: "flex", alignItems: "center", gap: "10px" },
  notifWrap: { position: "relative" },
  iconBtn: { cursor: "pointer", display: "flex", alignItems: "center" },
  badge: {
    position: "absolute",
    top: "-3px",
    right: "-3px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "9px",
    width: "14px",
    height: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "30px",
    width: "200px",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  item: {
    padding: "6px",
    borderRadius: "5px",
    fontSize: "11px",
    marginBottom: "4px",
    cursor: "pointer",
  },
  profileWrap: { position: "relative" },
  user: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  avatar: { fontSize: "16px" },
  profileDropdown: {
    position: "absolute",
    right: 0,
    top: "35px",
    width: "240px",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  name: { margin: 0, fontWeight: "600" },
  email: { margin: 0, fontSize: "11px", color: "#777" },
  profileBtn: {
    width: "100%",
    padding: "7px",
    borderRadius: "6px",
    border: "none",
    background: "#eee",
    fontSize: "11px",
    cursor: "pointer",
    marginBottom: "6px",
  },
  editBtn: {
    width: "100%",
    padding: "7px",
    borderRadius: "6px",
    border: "none",
    background: "#417C9C",
    color: "#fff",
    fontSize: "11px",
    cursor: "pointer",
    marginBottom: "6px",
  },
  logoutBtn: {
    width: "100%",
    padding: "7px",
    borderRadius: "6px",
    border: "none",
    background: "#805774",
    color: "#fff",
    fontSize: "11px",
    cursor: "pointer",
  },
};

export default Navbar;
