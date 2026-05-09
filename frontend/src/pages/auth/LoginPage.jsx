import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const result = await loginUser(formData);

      const role = result.user.role;
      const isApprovedLandlord =
        role === "Landlord" &&
        (result.user.isApproved === true ||
          result.user.isApproved === 1 ||
          result.user.isApproved === "true");

      if (role === "Landlord" && !isApprovedLandlord) {
        setMessage("Your landlord account is pending admin approval.");
        navigate("/pending-approval");
        return;
      }

      login(result);
      setMessage(`Welcome ${result.user.fullName}`);

      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Landlord") {
        navigate("/landlord/dashboard");
      } else {
        // Tenant (default)
        navigate("/");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-brand">
          <div className="top-nav-logo">LV</div>
          <div className="top-nav-brand-text">
            <h3>Livora</h3>
          </div>
        </div>

        <div className="top-nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>

      <div className="auth-page auth-page-split">
        <div className="auth-showcase">
          <div className="auth-showcase-badge">Livora Platform</div>
          <h2>
            Find the right place, manage listings, and access your rental
            journey.
          </h2>
          <p>Sign in to continue browsing properties.</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-top">
            <div>
              <p className="auth-kicker">Welcome back</p>
              <h1 className="auth-title">Login</h1>
              <p className="auth-subtitle">
                Enter your account details to continue.
              </p>
            </div>

            {user?.role && (
              <div className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="auth-submit-btn">
              Login
            </button>
          </form>

          {message && <p className="auth-message ui-alert">{message}</p>}

          <p className="auth-footer-link">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
