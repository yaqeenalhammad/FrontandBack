import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LostPetsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLostPets = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/lost-pets");
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to load lost pets");
        setItems([]);
        return;
      }

      
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError("Cannot connect to server. Is backend running?");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostPets();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Lost Pets</h2>
            <p style={styles.subtitle}>
              Browse recent lost pet reports and help reunite them with their families.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.secondaryBtn} onClick={fetchLostPets} type="button">
              Refresh
            </button>

            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/lost-pets/new")}
              type="button"
            >
              + Report Lost Pet
            </button>
          </div>
        </div>

        {loading && <div style={styles.info}>Loading...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div style={styles.info}>
            No posts yet. Click <b>“Report Lost Pet”</b> to add the first one.
            <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
              If you already posted but nothing appears, the backend needs a GET endpoint:
              <code> /api/lost-pets</code>.
            </div>
          </div>
        )}

        <div style={styles.grid}>
          {items.map((p) => (
            <div
              key={p.id || `${p.email || "x"}-${p.lostDate || "x"}-${p.area || "x"}`}
              style={styles.post}
            >
              <div style={styles.postTop}>
                <div>
                  <div style={styles.petName}>{p.petName?.trim() ? p.petName : "Lost Pet"}</div>

                  <div style={styles.meta}>
                    {(p.type || "Pet")} • {(p.gender || "Unknown")} • {(p.color || "-")}
                  </div>
                </div>

                <div style={styles.badge}>
                  {(p.city || "-")} / {(p.area || "-")}
                </div>
              </div>

              <div style={styles.desc}>{p.description || "-"}</div>

              <div style={styles.row}>
                <div style={styles.small}>
                  <b>Lost Date:</b> {p.lostDate || "-"}
                </div>
                <div style={styles.small}>
                  <b>Contact:</b> {p.contactPhone || "-"}
                </div>
              </div>

              {p.reward && <div style={styles.reward}>Reward: {p.reward}</div>}

              {Array.isArray(p.imageUrls) && p.imageUrls.length > 0 && (
                <div style={styles.images}>
                  {p.imageUrls.slice(0, 4).map((src, idx) => (
                    <img key={idx} src={src} alt="lost" style={styles.img} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 28,
    background: "linear-gradient(135deg, #f6f2eb, #e8f4fb)",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "min(1100px, 100%)",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: 22, color: "#0f172a" },
  subtitle: { margin: "6px 0 0", color: "#475569", fontSize: 13 },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#4fa3c7",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 800,
  },
  error: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(255, 228, 230, 0.85)",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    color: "#9f1239",
    fontWeight: 700,
    marginBottom: 12,
  },
  info: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(241, 245, 249, 0.85)",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    color: "#0f172a",
    fontWeight: 700,
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 12,
  },
  post: {
    borderRadius: 16,
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    padding: 12,
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  postTop: { display: "flex", justifyContent: "space-between", gap: 10 },
  petName: { fontWeight: 900, color: "#0f172a" },
  meta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(79,163,199,0.12)",
    color: "#0f172a",
    height: "fit-content",
    fontWeight: 800,
  },
  desc: { marginTop: 10, color: "#334155", lineHeight: 1.5, fontSize: 13 },
  row: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10 },
  small: { fontSize: 12, color: "#0f172a" },
  reward: { marginTop: 10, fontSize: 12, fontWeight: 900, color: "#065f46" },
  images: { marginTop: 10, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 },
  img: { width: "100%", height: 120, objectFit: "cover", borderRadius: 12 },
};
