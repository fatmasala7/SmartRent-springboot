import { useState } from "react";

function ApplicationDetailsPage() {
  const [application] = useState({
    id: 1,
    propertyTitle: "Modern Sea View Apartment",
    status: "pending",

    tenant: {
      name: "Ahmed Ali",
      email: "ahmed@email.com",
      phone: "01012345678",
      job: "Software Engineer",
      income: "15000 EGP",
    },

    details: {
      budget: 12000,
      moveInDate: "2026-05-01",
      duration: "12 months",
      notes: "I prefer quiet area with parking.",
    },

    documents: [
      { name: "ID Card", url: "#" },
      { name: "Salary Slip", url: "#" },
      { name: "Work Contract", url: "#" },
    ],
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { background: "var(--blackberry)" };
      case "approved":
        return { background: "var(--jellybean-blue)" };
      case "rejected":
        return { background: "var(--boy-red)" };
      default:
        return { background: "#999" };
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>{application.propertyTitle}</h1>

        <span
          style={{ ...styles.status, ...getStatusStyle(application.status) }}
        >
          {application.status}
        </span>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Tenant Information</h3>

          <p>
            <b>Name:</b> {application.tenant.name}
          </p>
          <p>
            <b>Email:</b> {application.tenant.email}
          </p>
          <p>
            <b>Phone:</b> {application.tenant.phone}
          </p>
          <p>
            <b>Job:</b> {application.tenant.job}
          </p>
          <p>
            <b>Income:</b> {application.tenant.income}
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Application Details</h3>

          <p>
            <b>Budget:</b> {application.details.budget} EGP
          </p>
          <p>
            <b>Move-in Date:</b> {application.details.moveInDate}
          </p>
          <p>
            <b>Duration:</b> {application.details.duration}
          </p>
          <p>
            <b>Notes:</b> {application.details.notes}
          </p>
        </div>

        <div style={{ ...styles.card, gridColumn: "span 2" }}>
          <h3 style={styles.sectionTitle}>Documents</h3>

          <div style={styles.docs}>
            {application.documents.map((doc, i) => (
              <div key={i} style={styles.docItem}>
                📄 {doc.name}
                <button style={styles.viewBtn}>View</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card, gridColumn: "span 2" }}>
          <h3 style={styles.sectionTitle}>Decision</h3>

          <div style={styles.actions}>
            <button style={styles.approveBtn}>Approve Application</button>
            <button style={styles.rejectBtn}>Reject Application</button>
            <button style={styles.contactBtn}>Contact Tenant</button>
          </div>
        </div>
      </div>
    </div>
  );
}

//styles

const styles = {
  page: {
    padding: "24px",
    background: "var(--pastel-gray)",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    color: "var(--blackberry)",
    fontSize: "24px",
  },

  status: {
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginBottom: "10px",
    color: "var(--blackberry)",
  },

  docs: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  docItem: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f7f7f7",
    padding: "8px",
    borderRadius: "8px",
  },

  viewBtn: {
    background: "var(--weldon-blue)",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  approveBtn: {
    background: "var(--jellybean-blue)",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  rejectBtn: {
    background: "var(--boy-red)",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  contactBtn: {
    background: "var(--weldon-blue)",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ApplicationDetailsPage;
