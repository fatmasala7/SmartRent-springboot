import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdHomeWork,
  MdAddCircle,
  MdEvent,
  MdAssignment,
  MdMenuOpen,
  MdMenu
} from "react-icons/md";

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      style={{
        ...styles.sidebar,
        width: collapsed ? "80px" : "240px",
      }}
    >

      <div style={styles.header}>
        {!collapsed && <h2 style={styles.logo}>Livora</h2>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.toggle}
        >
          {collapsed ? <MdMenu size={24} /> : <MdMenuOpen size={24} />}
        </button>
      </div>

      <nav style={styles.nav}>

        <SidebarItem to="/landlord/dashboard" icon={<MdDashboard />} label="Dashboard" collapsed={collapsed} />
        <SidebarItem to="/landlord/properties" icon={<MdHomeWork />} label="Properties" collapsed={collapsed} />
        <SidebarItem to="/landlord/create-property" icon={<MdAddCircle />} label="Add Property" collapsed={collapsed} />
        <SidebarItem to="/landlord/visit-requests" icon={<MdEvent />} label="Visits" collapsed={collapsed} />
        <SidebarItem to="/landlord/rental-applications" icon={<MdAssignment />} label="Applications" collapsed={collapsed} />

      </nav>
    </div>
  );
}

function SidebarItem({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        ...(isActive ? styles.active : {}),
        justifyContent: collapsed ? "center" : "flex-start",
      })}
    >
      <div style={styles.iconWrap}>{icon}</div>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

const styles = {
  sidebar: {
    height: "100vh",
    background: "var(--blackberry)",
    color: "#fff",
    padding: "14px 10px",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "0.3s ease",
    zIndex: 1000,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  logo: {
    fontSize: "18px",
    fontWeight: "bold",
  },

  toggle: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "10px",
  },

  active: {
    background: "rgba(255,255,255,0.18)",
    borderLeft: "4px solid var(--jellybean-blue)",
  },

  iconWrap: {
    minWidth: "24px",
    display: "flex",
    justifyContent: "center",
  },
};

export default Sidebar;