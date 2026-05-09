import {
  Navigate,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import MyVisitRequestsPage from "./pages/MyVisitRequestsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import AddReviewPage from "./pages/AddReviewPage";
import NotificationsPage from "./pages/NotificationsPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";

import LandlordLayout from "./components/layouts/LandlordLayout";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import MyPropertiesPage from "./pages/landlord/MyPropertiesPage";
import CreatePropertyPage from "./pages/landlord/CreatePropertyPage";
import EditPropertyPage from "./pages/landlord/EditPropertyPage";
import LandlordPropertyDetailsPage from "./pages/landlord/LandlordPropertyDetailsPage";
import VisitsRequestsPage from "./pages/landlord/VisitsRequestsPage";
import RentalApplicationsPage from "./pages/landlord/RentalApplicationsPage";
import LandlordProfilePage from "./pages/landlord/LandlordProfilePage";
import EditProfilePage from "./pages/landlord/EditProfilePage";

import "./App.css";

function AppTopNav() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const hiddenOnRoutes = ["/login", "/register"];
  const isLandlordRoute = location.pathname.startsWith("/landlord");
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (
    hiddenOnRoutes.includes(location.pathname) ||
    isLandlordRoute ||
    isAdminRoute
  ) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isApprovedUser = user?.isApproved === true || user?.isApproved === 1 || user?.isApproved === "true";

  const initials = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="top-nav">
      <div className="top-nav-brand" onClick={() => navigate("/")}>
        <div className="top-nav-logo">LV</div>
        <div className="top-nav-brand-text">
          <h3>Livora</h3>
          <p>Rental Platform</p>
        </div>
      </div>

      <nav className="top-nav-links">
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>

        {user?.role === "Tenant" && (
          <>
            <Link to="/favorites">Favorites</Link>
            <Link to="/visits">Visits</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/rentals">Rentals</Link>
            <Link to="/notifications">Notifications</Link>
          </>
        )}

        <div className="top-nav-divider" />

        {!user ? (
          <>
            <Link to="/login" className="top-nav-login">
              Login
            </Link>
            <Link to="/register" className="top-nav-register">
              Register
            </Link>
          </>
        ) : (
          <>
            <div className="top-nav-user">
              <div className="top-nav-user-avatar">{initials}</div>
              <span className="top-nav-user-name">
                {user.fullName || user.email}
              </span>
            </div>

            {user.role === "Admin" && <Link to="/admin">Admin</Link>}
            {user.role === "Landlord" && (
              <Link to={isApprovedUser ? "/landlord/dashboard" : "/pending-approval"}>
                Landlord
              </Link>
            )}

            <button
              type="button"
              className="top-nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  const [properties, setProperties] = useState([]);

  const addProperty = (property) => {
    setProperties((prev) => [
      ...prev,
      {
        ...property,
        id: Date.now(),
        images: property.images || [],
        reviews: property.reviews || [],
      },
    ]);
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const editProperty = (updated) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  };

  const addReview = (propertyId, review) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, reviews: [...(p.reviews || []), review] }
          : p,
      ),
    );
  };

  return (
    <ProfileProvider>
      <AppTopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <MyVisitRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quick-rent/:id"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rentals"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <MyRentalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <AddReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["Tenant", "Admin"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/landlord"
          element={
            <ProtectedRoute allowedRoles={["Landlord", "Admin"]}>
              <LandlordLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<LandlordDashboard />} />
          <Route path="properties" element={<MyPropertiesPage />} />
          <Route path="create-property" element={<CreatePropertyPage />} />
          <Route path="edit-property/:id" element={<EditPropertyPage />} />
          <Route path="properties/:id" element={<LandlordPropertyDetailsPage />} />
          <Route path="visit-requests" element={<VisitsRequestsPage />} />
          <Route
            path="rental-applications"
            element={<RentalApplicationsPage />}
          />
          <Route path="profile" element={<LandlordProfilePage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProfileProvider>
  );
}

export default App;
