import { useState } from "react";

export default function LostPetsSearch() {
  const [petId, setPetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const search = async () => {
    setError("");
    setResult(null);

    const id = petId.trim();
    if (!id) {
      setError("Enter Pet ID (e.g., PET-10293)");
      return;
    }

    try {
      setLoading(true);

      // ✅ backend لازم يدعم هالإشي: GET /api/lost-pets/:petId
      const res = await fetch(`http://localhost:5000/api/lost-pets/${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Not found");
        return;
      }

      setResult(data);
    } catch {
      setError("Cannot connect to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Search Lost Pet by ID</h2>
        <p style={styles.subtitle}>Type the Pet ID to see last seen info and contact.</p>

        <div style={styles.row}>
          <input
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            style={styles.input}
            placeholder="PET-10293"
          />
          <button
            onClick={search}
            disabled={loading || !petId.trim()}
            style={{
              ...styles.button,
              opacity: loading || !petId.trim() ? 0.6 : 1,
              cursor: loading || !petId.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {result && (
          <div style={styles.post}>
            <div style={styles.postTop}>
              <div>
                <div style={styles.petName}>{result.petName || "Lost Pet"}</div>
                <div style={styles.meta}>
                  {result.petId} • {result.type || "Pet"} • {result.gender || "Unknown"} •{" "}
                  {result.color || "-"}
                </div>
              </div>
              <div style={styles.badge}>
                {result.city || "-"} / {result.area || "-"}
              </div>
            </div>

            <div style={styles.desc}>{result.description || "-"}</div>

            <div style={styles.rowInfo}>
              <div style={styles.small}>
                <b>Lost Date:</b> {result.lostDate || "-"}
              </div>
              <div style={styles.small}>
                <b>Last Seen:</b> {result.lastSeenAt || "-"}
              </div>
            </div>

            <div style={styles.small}>
              <b>Contact:</b> {result.contactPhone || "-"}
            </div>

            {result.reward && <div style={styles.reward}>Reward: {result.reward}</div>}
          </div>
        )}
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
    width: "min(900px, 100%)",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  },
  title: { margin: 0, fontSize: 22, color: "#0f172a" },
  subtitle: { margin: "6px 0 14px", color: "#475569", fontSize: 13 },
  row: { display: "grid", gridTemplateColumns: "1fr 160px", gap: 10 },
  input: {
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
  },
  button: {
    borderRadius: 14,
    border: "none",
    background: "#4fa3c7",
    color: "white",
    fontWeight: 900,
  },
  error: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(255, 228, 230, 0.85)",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    color: "#9f1239",
    fontWeight: 700,
  },
  post: {
    marginTop: 14,
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
  rowInfo: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10 },
  small: { fontSize: 12, color: "#0f172a" },
  reward: { marginTop: 10, fontSize: 12, fontWeight: 900, color: "#065f46" },
};
