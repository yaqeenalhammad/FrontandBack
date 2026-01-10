import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LostPets() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    petId: "",              
    petName: "",
    type: "Cat",            
    color: "",
    gender: "Unknown",
    age: "",
    lostDate: "",
    lastSeenAt: "",        
    city: "",
    area: "",
    description: "",
    contactPhone: "",
    reward: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      form.petId.trim() &&
      form.color.trim() &&
      form.lostDate &&
      form.lastSeenAt.trim() &&
      form.city.trim() &&
      form.area.trim() &&
      form.description.trim() &&
      form.contactPhone.trim() &&
      images.length > 0
    );
  }, [form, images]);

  const onChange = (e) => {
    setError("");
    setSuccess("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onImagesChange = (e) => {
    setError("");
    setSuccess("");
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const validate = () => {
    if (!form.petId.trim()) return "Pet ID is required (e.g., PET-10293)";
    if (!form.color.trim()) return "Color is required";
    if (!form.lostDate) return "Lost date is required";
    if (!form.lastSeenAt.trim()) return "Last seen details/time is required";
    if (!form.city.trim()) return "City is required";
    if (!form.area.trim()) return "Area is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.contactPhone.trim()) return "Contact phone is required";
    if (images.length === 0) return "Please upload at least one image";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach((file) => data.append("images", file));

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/lost-pets", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result?.message || "Failed to publish lost pet post");
        return;
      }

      setSuccess("Lost pet post published successfully!");
      setTimeout(() => navigate("/lost-pets"), 700);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Report a Lost Pet</h2>
        <p style={styles.subtitle}>
          Please add the <b>Pet ID</b> so others can search it easily.
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* ✅ PetId + Pet Name */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Pet ID *</label>
              <input
                name="petId"
                value={form.petId}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., PET-10293"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Pet Name (optional)</label>
              <input
                name="petName"
                value={form.petName}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., Luna"
              />
            </div>
          </div>

          {/* Type + Gender */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Type</label>
              <select name="type" value={form.type} onChange={onChange} style={styles.input}>
                <option>Cat</option>
                <option>Dog</option>
                <option>Bird</option>
                <option>Other</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={form.gender} onChange={onChange} style={styles.input}>
                <option>Unknown</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Color + Age */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Color *</label>
              <input
                name="color"
                value={form.color}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., White with black spots"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Age (optional)</label>
              <input
                name="age"
                value={form.age}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., 2 years"
              />
            </div>
          </div>

          {/* Lost Date + Last Seen At ✅ */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Lost Date *</label>
              <input
                type="date"
                name="lostDate"
                value={form.lostDate}
                onChange={onChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Last Seen (When/Details) *</label>
              <input
                name="lastSeenAt"
                value={form.lastSeenAt}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., Yesterday 7pm near the mall"
              />
            </div>
          </div>

          {/* City + Area */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., Amman"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Area *</label>
              <input
                name="area"
                value={form.area}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., Khalda / Sweifieh"
              />
            </div>
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              style={styles.textarea}
              placeholder="Distinctive marks, collar, last seen details..."
            />
          </div>

          {/* Contact + Reward */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Contact Phone *</label>
              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={onChange}
                style={styles.input}
                placeholder="07********"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Reward (optional)</label>
              <input
                name="reward"
                value={form.reward}
                onChange={onChange}
                style={styles.input}
                placeholder="e.g., 50 JOD"
              />
            </div>
          </div>

          {/* Images */}
          <div style={styles.field}>
            <label style={styles.label}>Upload Images *</label>
            <input type="file" accept="image/*" multiple onChange={onImagesChange} style={styles.input} />
          </div>

          {previews.length > 0 && (
            <div style={styles.previewGrid}>
              {previews.map((src, idx) => (
                <img key={idx} src={src} alt={`preview-${idx}`} style={styles.previewImg} />
              ))}
            </div>
          )}

          {/* ✅ Button enabled/disabled nicely */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            style={{
              ...styles.button,
              opacity: loading || !isFormValid ? 0.6 : 1,
              cursor: loading || !isFormValid ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Publishing..." : "Publish Lost Pet Post"}
          </button>
        </form>
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
    width: "min(980px, 100%)",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 22,
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
  },
  title: { margin: 0, fontSize: 22, color: "#0f172a" },
  subtitle: { margin: "6px 0 14px", color: "#475569", fontSize: 13, lineHeight: 1.6 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontWeight: 700, fontSize: 13, color: "#0f172a" },
  input: {
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
  },
  textarea: {
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    outline: "none",
    minHeight: 120,
    resize: "vertical",
    background: "rgba(255,255,255,0.9)",
    lineHeight: 1.6,
  },
  button: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.08)",
    fontWeight: 800,
    background: "linear-gradient(135deg, #2c7da0, #34d399)",
    color: "white",
    boxShadow: "0 14px 28px rgba(44,125,160,0.25)",
  },
  error: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(255, 228, 230, 0.85)",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    color: "#9f1239",
    fontWeight: 700,
  },
  success: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(220, 252, 231, 0.85)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
    color: "#14532d",
    fontWeight: 700,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 12,
    marginTop: 6,
  },
  previewImg: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
};
