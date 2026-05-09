import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getMyRentals } from "../services/bookingService";
import { getPropertyId, getImageUrlFromProperty, formatCurrency, formatDate } from "../utils/displayHelpers";

const STATUS = {
  Active: { bg: "#E8F5E9", color: "#2E7D32", label: "✅ Active" },
  Expired: { bg: "#FFEBEE", color: "#C62828", label: "❌ Expired" },
  Pending: { bg: "#FFF8E1", color: "#B8860B", label: "⏳ Pending" },
};

const fmt = (d) => formatDate(d);

const daysLeft = (endDate) => {
  if (!endDate) return "-";
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return "-";
  const diff = Math.ceil((end - new Date()) / 86400000);
  return diff < 0 ? "Expired" : diff === 0 ? "Ends today" : `${diff} days left`;
};

function Modal({ onClose, children }) {
  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          fontFamily: "Georgia,serif",
          fontSize: "20px",
          color: "#805774",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <button
        onClick={onClose}
        style={{
          background: "rgba(128,87,116,0.08)",
          border: "none",
          borderRadius: "50%",
          width: 34,
          height: 34,
          cursor: "pointer",
          color: "#805774",
        }}
      >
        ✕
      </button>
    </div>
  );
}

function RentalCard({ rental, onView, onContact, onRenew, onReview }) {
  const [hovered, setHovered] = useState(false);
  const st = STATUS[rental.status] || STATUS.Pending;
  const dl = daysLeft(rental.endDate);
  const image = getImageUrlFromProperty(rental);
  const title = rental.propertyTitle || "Property information unavailable";
  const location = rental.propertyLocation || "-";
  const expiring =
    typeof dl === "string" && dl.includes("days") && parseInt(dl) <= 30;

  return (
    <div
      style={{
        ...s.card,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered
          ? "0 12px 32px rgba(128,87,116,0.13)"
          : "0 4px 16px rgba(128,87,116,0.07)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", width: 200, flexShrink: 0 }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            background: st.bg,
            color: st.color,
          }}
        >
          {st.label}
        </div>
      </div>

      <div
        style={{
          padding: "20px 24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 17,
            fontWeight: 600,
            color: "#805774",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
          📍 {location}
        </div>
        <div
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#417C9C",
            marginBottom: 14,
          }}
        >
          {formatCurrency(rental.price, "EGP")} {" "}
          <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7 }}>
            / month
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            flex: 1,
            marginBottom: 14,
            fontSize: 13,
          }}
        >
          {[
            ["👤", `Landlord: ${rental.landlordName || "-"}`],
            ["📄", `${rental.contractType || "Rental"} Contract`],
            ["📅", `${fmt(rental.startDate)} → ${fmt(rental.endDate)}`],
            ["🏠", rental.propertyType || "Property"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: 8 }}>
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {rental.status === "Active" && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 14,
              background: expiring ? "#FFF8E1" : "#E8F5E9",
              color: expiring ? "#B8860B" : "#2E7D32",
              border: `1px solid ${expiring ? "rgba(184,134,11,0.2)" : "rgba(46,125,50,0.2)"}`,
              alignSelf: "flex-start",
            }}
          >
            {expiring ? "⚠️" : "🗓"} {dl}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            ["View Details", "#417C9C", "none", "white", onView],
            [
              "💬 Contact",
              "rgba(65,124,156,0.06)",
              "1.5px solid rgba(65,124,156,0.3)",
              "#417C9C",
              onContact,
            ],
            [
              "🔄 Renew",
              "transparent",
              "1.5px solid rgba(128,87,116,0.2)",
              "#805774",
              onRenew,
            ],
            ["⭐ Review", "#805774", "none", "white", onReview],
          ].map(([label, bg, border, color, fn]) => (
            <button
              key={label}
              onClick={fn}
              style={{
                flex: 1,
                padding: "9px 10px",
                borderRadius: 10,
                border,
                background: bg,
                color,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Segoe UI',sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MyRentalsPage() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState("All");
  const [contactModal, setContactModal] = useState(null);
  const [renewModal, setRenewModal] = useState(null);

  useEffect(() => {
    getMyRentals()
      .then((items) => setRentals((items || []).map((r) => {
        const propertyId = r.propertyId || r.propertyID;
        return {
          ...r,
          id: r.rentalID || r.id,
          propertyId,
          propertyTitle: r.propertyTitle || (propertyId ? `Property #${propertyId}` : "Property information unavailable"),
          propertyLocation: r.propertyLocation || "-",
          propertyImage: r.propertyImage || r.propertyImageUrl || getImageUrlFromProperty(r),
          price: Number(r.propertyPrice ?? r.price ?? r.finalPrice ?? 0),
          startDate: r.startDate || r.rentStartDate,
          endDate: r.endDate || r.rentEndDate,
          status: r.status || "Active",
        };
      })))
      .catch(console.error);
  }, []);

  const save = (updated) => {
    setRentals(updated);
  };

  const handleRenew = (rental, months) => {
    const newEnd = new Date(rental.endDate);
    newEnd.setMonth(newEnd.getMonth() + months);
    save(
      rentals.map((r) =>
        r.id === rental.id
          ? {
              ...r,
              endDate: newEnd.toISOString().split("T")[0],
              status: "Active",
            }
          : r,
      ),
    );
    setRenewModal(null);
  };

  const counts = {
    All: rentals.length,
    Active: rentals.filter((r) => r.status === "Active").length,
    Expired: rentals.filter((r) => r.status === "Expired").length,
    Pending: rentals.filter((r) => r.status === "Pending").length,
  };
  const filtered =
    filter === "All" ? rentals : rentals.filter((r) => r.status === filter);
  const totalMonthly = rentals
    .filter((r) => r.status === "Active")
    .reduce((sum, r) => sum + (Number(r.price) || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#D8CCC5",
        fontFamily: "'Segoe UI',sans-serif",
        color: "#716458",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#805774 0%,#5a3b4f 60%,#417C9C 100%)",
          padding: "56px 40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: "30%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(65,124,156,0.18)",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 100,
            padding: "5px 14px",
            fontSize: 12,
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 18,
            fontWeight: 500,
          }}
        >
          🏠 My Rentals
        </div>
        <h1
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 40,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.15,
            position: "relative",
            zIndex: 1,
          }}
        >
          My Rentals
          <span
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 18,
              fontWeight: 400,
              display: "block",
              fontFamily: "'Segoe UI',sans-serif",
              marginTop: 6,
            }}
          >
            Manage your active rental contracts
          </span>
        </h1>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 28,
            position: "relative",
            zIndex: 1,
            flexWrap: "wrap",
          }}
        >
          {[
            ["Total", counts.All],
            ["Active", counts.Active],
            ["EGP / month", totalMonthly.toLocaleString()],
          ].map(([lbl, val]) => (
            <div
              key={lbl}
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 14,
                padding: "12px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "Georgia,serif",
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          {["All", "Active", "Expired", "Pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Segoe UI',sans-serif",
                transition: "all 0.2s",
                background: filter === tab ? "#805774" : "white",
                color: filter === tab ? "white" : "#716458",
                border:
                  filter === tab
                    ? "1.5px solid #805774"
                    : "1.5px solid rgba(128,87,116,0.15)",
              }}
            >
              {tab}
              <span
                style={{
                  borderRadius: 100,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    filter === tab
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(128,87,116,0.08)",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏠</div>
            <h3
              style={{
                fontFamily: "Georgia,serif",
                fontSize: 22,
                color: "#805774",
                marginBottom: 8,
              }}
            >
              No rentals found
            </h3>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24 }}>
              Browse properties and apply for rent!
            </p>
            <button
              onClick={() => navigate("/properties")}
              style={{
                background: "#805774",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "13px 28px",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map((r) => (
              <RentalCard
                key={r.id}
                rental={r}
                onView={() => r.propertyId ? navigate(`/property/${r.propertyId}`) : null}
                onContact={() => setContactModal(r)}
                onRenew={() => setRenewModal(r)}
                onReview={() =>
                  navigate("/review", {
                    state: {
                      id: r.propertyId,
                      title: r.propertyTitle,
                      location: r.propertyLocation,
                      image: r.propertyImage,
                      price: r.price,
                    },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {contactModal && (
        <Modal onClose={() => setContactModal(null)}>
          <ModalHeader
            title="Contact Owner"
            onClose={() => setContactModal(null)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#FAF7F5",
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
              border: "1px solid rgba(128,87,116,0.10)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#805774,#417C9C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              👤
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#805774",
                }}
              >
                {contactModal.landlordName}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                {contactModal.propertyTitle}
              </div>
            </div>
          </div>
          {[
            ["📞", "Phone", contactModal.landlordPhone],
            ["📧", "Email", contactModal.landlordEmail],
          ].map(([icon, label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(128,87,116,0.10)",
                marginBottom: 10,
                background: "#FAF7F5",
              }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#76A0B3",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    marginBottom: 2,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{val}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <a
              href={`tel:${contactModal.landlordPhone}`}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "#417C9C",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              📞 Call Now
            </a>
            <a
              href={`mailto:${contactModal.landlordEmail}`}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1.5px solid rgba(128,87,116,0.2)",
                background: "transparent",
                color: "#805774",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              📧 Send Email
            </a>
          </div>
        </Modal>
      )}

      {renewModal && (
        <Modal onClose={() => setRenewModal(null)}>
          <ModalHeader
            title="Renew Contract"
            onClose={() => setRenewModal(null)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#FAF7F5",
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
              border: "1px solid rgba(128,87,116,0.10)",
            }}
          >
            <img
              src={renewModal.propertyImage}
              alt={renewModal.propertyTitle}
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                objectFit: "cover",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#805774",
                }}
              >
                {renewModal.propertyTitle}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                📍 {renewModal.propertyLocation}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#417C9C",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {formatCurrency(renewModal.price, "EGP / month")}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#805774",
              marginBottom: 14,
            }}
          >
            Select renewal duration:
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[3, 6, 12, 24].map((months) => (
              <button
                key={months}
                onClick={() => handleRenew(renewModal, months)}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  border: "1.5px solid rgba(128,87,116,0.15)",
                  background: "#FAF7F5",
                  cursor: "pointer",
                  textAlign: "center",
                  fontFamily: "'Segoe UI',sans-serif",
                }}
              >
                <div
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#805774",
                  }}
                >
                  {months}
                </div>
                <div
                  style={{ fontSize: 12, color: "#76A0B3", marginBottom: 6 }}
                >
                  months
                </div>
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: "#417C9C" }}
                >
                  {((Number(renewModal.price) || 0) * months).toLocaleString()} EGP
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

//styles
const s = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "white",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 24px 60px rgba(128,87,116,0.18)",
  },
  card: {
    background: "#FAF7F5",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(128,87,116,0.10)",
    transition: "all 0.25s ease",
    display: "flex",
  },
};
