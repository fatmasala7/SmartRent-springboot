import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/landlord/StatsCard";
import RecentProperties from "../../components/landlord/RecentProperties";
import VisitsBox from "../../components/landlord/VisitsBox";
import { MdAddHome, MdHomeWork, MdEvent, MdAssignment } from "react-icons/md";
import { getMyProperties } from "../../services/propertyService";
import { getMyNotifications } from "../../services/notificationService";

function LandlordDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ properties: 0, visits: 0, applications: 0, notifications: 0 });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getMyProperties()
      .then((props) => {
        setProperties(props);
        setStats((prev) => ({ ...prev, properties: props.length }));
      })
      .catch(console.error);
    getMyNotifications()
      .then((notifs) => {
        const unread = notifs.filter((n) => !n.isRead).length;
        setStats((prev) => ({ ...prev, notifications: unread }));
      })
      .catch(console.error);
  }, []);

  return (
    <div style={styles.page}>
      <div>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>
          Overview of your properties and activities
        </p>
      </div>

      <div style={styles.grid}>
        <StatsCard
          title="Properties"
          value={stats.properties}
          color="var(--jellybean-blue)"
        />
        <StatsCard
          title="Visits"
          value={stats.visits}
          color="var(--weldon-blue)"
        />
        <StatsCard
          title="Applications"
          value={stats.applications}
          color="var(--blackberry)"
        />
        <StatsCard
          title="Notifications"
          value={stats.notifications}
          color="var(--boy-red)"
        />
      </div>

      <div style={styles.actionsBox}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>

        <div style={styles.actionsGrid}>
          <div
            style={styles.actionCard}
            onClick={() => navigate("/landlord/create-property")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            <MdAddHome size={26} />
            <span>Add Property</span>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate("/landlord/properties")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            <MdHomeWork size={26} />
            <span>View Properties</span>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate("/landlord/visit-requests")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            <MdEvent size={26} />
            <span>Check Requests</span>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate("/landlord/rental-applications")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            <MdAssignment size={26} />
            <span>Applications</span>
          </div>
        </div>
      </div>

      <div style={styles.bottomGrid}>
        <RecentProperties />
        <VisitsBox />
      </div>
    </div>
  );
}

//styles

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  title: {
    fontSize: "28px",
    margin: 0,
    color: "var(--text-dark)",
  },

  subtitle: {
    color: "#777",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  actionsBox: {
    background: "#fff",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginBottom: "16px",
    color: "var(--blackberry)",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },

  actionCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "0.25s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    color: "var(--blackberry)",
    fontWeight: "500",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
};

export default LandlordDashboard;
