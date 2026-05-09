import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./RegisterPage.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    role: "Tenant",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Egyptian",
    phoneNumber: "",
    email: "",
    idType: "NationalID",
    nationalOrPassportID: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role.trim()) {
      newErrors.role = "Please select account type.";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required.";
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = "Nationality is required.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^01[0-2,5]\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid Egyptian phone number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.idType.trim()) {
      newErrors.idType = "ID type is required.";
    }

    if (!formData.nationalOrPassportID.trim()) {
      newErrors.nationalOrPassportID = "ID number is required.";
    } else if (
      formData.idType === "NationalID" &&
      !/^\d{14}$/.test(formData.nationalOrPassportID)
    ) {
      newErrors.nationalOrPassportID = "National ID must be exactly 14 digits.";
    } else if (
      formData.idType === "Passport" &&
      formData.nationalOrPassportID.trim().length < 6
    ) {
      newErrors.nationalOrPassportID =
        "Passport number must be at least 6 characters.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
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

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    setErrors((prev) => ({
      ...prev,
      role: "",
    }));
  };

  const handleIdTypeSelect = (idType) => {
    setFormData((prev) => ({
      ...prev,
      idType,
      nationalOrPassportID: "",
    }));

    setErrors((prev) => ({
      ...prev,
      idType: "",
      nationalOrPassportID: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      const result = await registerUser(formData);
      setMessage(result.message);

      setFormData({
        role: "Tenant",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "Egyptian",
        phoneNumber: "",
        email: "",
        idType: "NationalID",
        nationalOrPassportID: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
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

      <div className="register-page-shell">
        <div className="register-layout">
          <div className="register-card-v2">
            <div className="register-header">
              <div>
                <p className="register-brand-badge">Join Livora</p>
                <h1 className="register-main-title">Create Your Account</h1>
                <p className="register-subtitle">
                  Complete your account details to start using Livora.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-section">
                <p className="register-section-label">I WANT TO...</p>

                <div className="register-role-grid">
                  <button
                    type="button"
                    className={`register-role-card ${
                      formData.role === "Tenant" ? "active" : ""
                    }`}
                    onClick={() => handleRoleSelect("Tenant")}
                  >
                    <span className="register-role-icon">🔎</span>
                    <strong>Find a Place</strong>
                    <span>I’m a Tenant</span>
                  </button>

                  <button
                    type="button"
                    className={`register-role-card ${
                      formData.role === "Landlord" ? "active" : ""
                    }`}
                    onClick={() => handleRoleSelect("Landlord")}
                  >
                    <span className="register-role-icon">🏠</span>
                    <strong>List My Property</strong>
                    <span>I’m a Landlord</span>
                  </button>
                </div>

                {errors.role && <p className="field-error">{errors.role}</p>}
              </div>

              <div className="register-section">
                <h3 className="register-block-title">Personal Information</h3>

                <div className="register-form-grid two-cols">
                  <div className="auth-form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="As on your ID"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? "input-error" : ""}
                    />
                    {errors.fullName && (
                      <p className="field-error">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? "input-error" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="field-error">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label>Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={errors.gender ? "input-error" : ""}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="field-error">{errors.gender}</p>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label>Nationality *</label>
                    <input
                      type="text"
                      name="nationality"
                      placeholder="Egyptian"
                      value={formData.nationality}
                      onChange={handleChange}
                      className={errors.nationality ? "input-error" : ""}
                    />
                    {errors.nationality && (
                      <p className="field-error">{errors.nationality}</p>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label>Phone Number *</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="e.g. 01012345678"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={errors.phoneNumber ? "input-error" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="field-error">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="auth-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && (
                      <p className="field-error">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="register-section">
                <h3 className="register-block-title">Identity Verification</h3>

                <div className="auth-form-group">
                  <label>ID Type *</label>

                  <div className="register-id-type-row">
                    <button
                      type="button"
                      className={`register-id-chip ${
                        formData.idType === "NationalID" ? "active" : ""
                      }`}
                      onClick={() => handleIdTypeSelect("NationalID")}
                    >
                      National ID
                    </button>

                    <button
                      type="button"
                      className={`register-id-chip ${
                        formData.idType === "Passport" ? "active" : ""
                      }`}
                      onClick={() => handleIdTypeSelect("Passport")}
                    >
                      Passport
                    </button>
                  </div>

                  {errors.idType && (
                    <p className="field-error">{errors.idType}</p>
                  )}
                </div>

                <div className="auth-form-group">
                  <label>
                    {formData.idType === "NationalID"
                      ? "National ID Number *"
                      : "Passport Number *"}
                  </label>
                  <input
                    type="text"
                    name="nationalOrPassportID"
                    placeholder={
                      formData.idType === "NationalID"
                        ? "Enter 14-digit national ID"
                        : "Enter passport number"
                    }
                    value={formData.nationalOrPassportID}
                    onChange={handleChange}
                    className={errors.nationalOrPassportID ? "input-error" : ""}
                  />

                  {formData.idType === "NationalID" && (
                    <div className="register-id-helper">
                      <span>
                        Your 14-digit National ID as printed on your card
                      </span>
                      <span>
                        {formData.nationalOrPassportID.length}/14 digits
                      </span>
                    </div>
                  )}

                  {errors.nationalOrPassportID && (
                    <p className="field-error">{errors.nationalOrPassportID}</p>
                  )}
                </div>
              </div>

              <div className="register-section">
                <h3 className="register-block-title">Account Security</h3>

                <div className="auth-form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "input-error" : ""}
                  />
                  {errors.password && (
                    <p className="field-error">{errors.password}</p>
                  )}
                </div>

                <div className="auth-form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "input-error" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="field-error">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button type="submit" className="register-submit-btn">
                Create My Account
              </button>
            </form>

            {message && <p className="auth-message ui-alert">{message}</p>}

            <p className="register-bottom-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
