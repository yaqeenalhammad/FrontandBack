import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pets } from "../data/pets";

export default function PetDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const pet = useMemo(() => {
    const cleanId = (id || "").trim();
    return pets.find((p) => String(p.id).trim() === cleanId);
  }, [id]);

  const isValidFullName = (name) => {
    const clean = name.trim().replace(/\s+/g, " ");
    const parts = clean.split(" ");
    if (parts.length < 2) return false;
    return /^[A-Za-z\u0600-\u06FF ]+$/.test(clean);
  };

  const isValidPhone = (value) => {
    return /^07\d{8}$/.test(value);
  };

  const submitRequest = () => {
    setError("");

    if (!fullName || !phone || !reason) {
      setError("Please fill all fields.");
      return;
    }

    if (!isValidFullName(fullName)) {
      setError("Full name must be at least two words (letters only).");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Phone must be a valid number (07********).");
      return;
    }

    alert("Adoption request submitted successfully ✅");

    setShowForm(false);
    setFullName("");
    setPhone("");
    setReason("");
    setError("");
  };

  if (!pet) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => navigate(-1)} style={backBtn} type="button">
          ← Back
        </button>
        <h2>Pet not found</h2>
        <p>Try going back to the adoption list.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={backBtn} type="button">
          ← Back
        </button>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={styles.badge}>🐾</div>
          <div>
            <h1 style={styles.title}>{pet.name}</h1>
            <div style={styles.subTitle}>
              {pet.type} • {pet.city} • {pet.ageMonths} months
            </div>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.imageBox}>
            <img src={pet.image} alt={pet.name} style={styles.image} />
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Information</h2>

          <p>ID: {pet.id}</p>
          <p>Gender: {pet.gender}</p>
          <p>City: {pet.city}</p>
          <p>Vaccinated: {pet.vaccinated ? "Yes" : "No"}</p>

          <h2 style={{ ...styles.sectionTitle, marginTop: 14 }}>Description</h2>
          <p>{pet.description}</p>

          {!showForm && (
            <button
              style={styles.primaryBtn}
              onClick={() => setShowForm(true)}
              type="button"
            >
              Adopt Now
            </button>
          )}

          {showForm && (
            <div style={styles.formBox}>
              <h3>Adoption Form 🐾</h3>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <input
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Phone Number (07********)"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />

              <textarea
                style={{ ...styles.input, height: 80 }}
                placeholder="Why do you want to adopt this pet?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <button style={styles.primaryBtn} onClick={submitRequest}>
                Submit
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const backBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  cursor: "pointer",
};

const styles = {
  page: {
    padding: 24,
    background: "#f7fbfd",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  badge: {
    fontSize: 24,
  },
  title: {
    margin: 0,
  },
  subTitle: {
    fontSize: 13,
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  imageBox: {
    height: 300,
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxHeight: "100%",
    objectFit: "contain",
  },
  sectionTitle: {
    marginTop: 0,
  },
  primaryBtn: {
    marginTop: 10,
    padding: 10,
    background: "#4fa3c7",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
  secondaryBtn: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  formBox: {
    marginTop: 16,
    padding: 14,
    border: "1px solid #ddd",
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 8,
  },
};
