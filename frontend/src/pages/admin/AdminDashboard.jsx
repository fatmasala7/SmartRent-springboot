import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  approveLandlord,
  approveProperty,
  getAllUsers,
  getPendingLandlords,
  getPendingProperties,
  rejectLandlord,
  rejectProperty,
  toggleUserStatus,
} from "../../services/adminService";
import "./AdminDashboard.css";
import { getImageUrlFromProperty, PROPERTY_PLACEHOLDER, formatDate, formatCurrency } from "../../utils/displayHelpers";

const defaultProfileImage =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [landlords, setLandlords] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("landlords");
  const [landlordComments, setLandlordComments] = useState({});
  const [propertyComments, setPropertyComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [landlordsData, propertiesData, usersData] = await Promise.all([
          getPendingLandlords(),
          getPendingProperties(),
          getAllUsers(),
        ]);

        setLandlords(landlordsData);
        setProperties(propertiesData);
        setUsers(usersData);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApproveLandlord = async (id) => {
    try {
      const result = await approveLandlord(id);
      setLandlords((prev) => prev.filter((item) => item.userID !== id));
      setUsers((prev) =>
        prev.map((item) =>
          item.userID === id
            ? { ...item, isApproved: true, isActive: true }
            : item,
        ),
      );
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRejectLandlord = async (id) => {
    try {
      const comment = landlordComments[id] || "";
      const result = await rejectLandlord(id, comment);
      setLandlords((prev) => prev.filter((item) => item.userID !== id));
      setUsers((prev) =>
        prev.map((item) =>
          item.userID === id ? { ...item, isApproved: false } : item,
        ),
      );
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleApproveProperty = async (id) => {
    try {
      const result = await approveProperty(id);
      setProperties((prev) => prev.filter((item) => item.propertyID !== id));
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRejectProperty = async (id) => {
    try {
      const comment = propertyComments[id] || "";
      const result = await rejectProperty(id, comment);
      setProperties((prev) => prev.filter((item) => item.propertyID !== id));
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleToggleUserStatus = async (account) => {
    try {
      const result = await toggleUserStatus(account.userID, account.isActive);
      setUsers((prev) =>
        prev.map((item) =>
          item.userID === account.userID
            ? { ...item, isActive: !item.isActive }
            : item,
        ),
      );
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-page">
          <div className="admin-section">
            <p className="admin-empty">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-page">
        <div className="admin-hero">
          <div className="admin-hero-content">
            <div className="admin-hero-top">
              <div>
                <p className="admin-kicker">Control center</p>
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-hero-subtitle">
                  Review landlord registrations, property listings, and manage
                  user account activity from one place.
                </p>
              </div>

              <div className="admin-hero-actions">
                <span className="role-badge admin">
                  {user?.role || "Admin"}
                </span>
                <button className="admin-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="admin-overview-grid">
              <div className="admin-stat-card">
                <span>Pending landlords</span>
                <strong>{landlords.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Pending properties</span>
                <strong>{properties.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Users</span>
                <strong>{users.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Signed in as</span>
                <strong>{user?.fullName}</strong>
              </div>
            </div>
          </div>
        </div>

        {message && <p className="admin-message ui-alert">{message}</p>}

        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "landlords" ? "active" : ""}`}
            onClick={() => setActiveTab("landlords")}
          >
            Landlords
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "properties" ? "active" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            Properties
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        {activeTab === "landlords" && (
          <section className="admin-section">
            <div className="ui-section-header">
              <div>
                <h2 className="admin-section-title">Pending Landlords</h2>
                <p>Check account details before approving landlord access.</p>
              </div>
              <span className="status-chip pending">
                {landlords.length} Pending
              </span>
            </div>

            {landlords.length === 0 ? (
              <p className="admin-empty">No pending landlords.</p>
            ) : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Contact</th>
                      <th>National / Passport ID</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Reject Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landlords.map((landlord) => (
                      <tr key={landlord.userID}>
                        <td>
                          <div className="table-main-cell">
                            <img
                              src={landlord.profileImage || defaultProfileImage}
                              alt={landlord.fullName}
                              className="admin-profile-image"
                            />
                            <div>
                              <strong>{landlord.fullName}</strong>
                              <p>{landlord.role}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-details-stack">
                            <span>{landlord.email}</span>
                            <span>{landlord.phoneNumber || "-"}</span>
                          </div>
                        </td>
                        <td>{landlord.nationalOrPassportID || "-"}</td>
                        <td>
                          <span className="status-chip pending">Pending</span>
                        </td>
                        <td>
                          {formatDate(landlord.createdAt)}
                        </td>
                        <td>
                          <textarea
                            className="admin-comment-box"
                            placeholder="Reason for rejection..."
                            value={landlordComments[landlord.userID] || ""}
                            onChange={(e) =>
                              setLandlordComments((prev) => ({
                                ...prev,
                                [landlord.userID]: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="admin-action-btn approve"
                            onClick={() =>
                              handleApproveLandlord(landlord.userID)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="admin-action-btn reject"
                            onClick={() =>
                              handleRejectLandlord(landlord.userID)
                            }
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "properties" && (
          <section className="admin-section">
            <div className="ui-section-header">
              <div>
                <h2 className="admin-section-title">Pending Properties</h2>
                <p>
                  Review listing details and landlord information before
                  approval.
                </p>
              </div>
              <span className="status-chip available">
                {properties.length} In Review
              </span>
            </div>

            {properties.length === 0 ? (
              <p className="admin-empty">No pending properties.</p>
            ) : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Property</th>
                      <th>Details</th>
                      <th>Landlord</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Reject Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.propertyID}>
                        <td>
                          <img
                            src={getImageUrlFromProperty(property, PROPERTY_PLACEHOLDER)}
                            alt={property.title}
                            className="admin-property-image"
                          />
                        </td>
                        <td>
                          <div className="table-property-cell">
                            <div>
                              <strong>{property.title}</strong>
                              <p>{property.description}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-details-stack">
                            <span>{property.location}</span>
                            <span>{formatCurrency(property.price, "EGP")}</span>
                            <span>{property.propertyType}</span>
                            <span>
                              {property.isActive
                                ? "Active listing"
                                : "Inactive listing"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-details-stack">
                            <span>{property.landlordName || "-"}</span>
                            <span>{property.landlordEmail || "-"}</span>
                            <span>{property.landlordPhone || "-"}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-chip available">
                            {property.rentalStatus}
                          </span>
                        </td>
                        <td>
                          {formatDate(property.createdAt)}
                        </td>
                        <td>
                          <textarea
                            className="admin-comment-box"
                            placeholder="Reason for rejection..."
                            value={propertyComments[property.propertyID] || ""}
                            onChange={(e) =>
                              setPropertyComments((prev) => ({
                                ...prev,
                                [property.propertyID]: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="admin-action-btn approve"
                            onClick={() =>
                              handleApproveProperty(property.propertyID)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="admin-action-btn reject"
                            onClick={() =>
                              handleRejectProperty(property.propertyID)
                            }
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "users" && (
          <section className="admin-section">
            <div className="ui-section-header">
              <div>
                <h2 className="admin-section-title">All Users</h2>
                <p>View all non-admin users and manage account activity.</p>
              </div>
              <span className="status-chip available">
                {users.length} Users
              </span>
            </div>

            {users.length === 0 ? (
              <p className="admin-empty">No users found.</p>
            ) : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Contact</th>
                      <th>National / Passport ID</th>
                      <th>Role</th>
                      <th>Approved</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((account) => (
                      <tr key={account.userID}>
                        <td>
                          <div className="table-main-cell">
                            <img
                              src={account.profileImage || defaultProfileImage}
                              alt={account.fullName}
                              className="admin-profile-image"
                            />
                            <div>
                              <strong>{account.fullName}</strong>
                              <p>User #{account.userID}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-details-stack">
                            <span>{account.email}</span>
                            <span>{account.phoneNumber || "-"}</span>
                          </div>
                        </td>
                        <td>{account.nationalOrPassportID || "-"}</td>
                        <td>
                          <span
                            className={`role-badge ${account.role.toLowerCase()}`}
                          >
                            {account.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-chip ${account.isApproved ? "approved" : "pending"}`}
                          >
                            {account.isApproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-chip ${account.isActive ? "active" : "inactive"}`}
                          >
                            {account.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {new Date(account.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className={`admin-action-btn ${account.isActive ? "deactivate" : "activate"}`}
                            onClick={() => handleToggleUserStatus(account)}
                          >
                            {account.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
