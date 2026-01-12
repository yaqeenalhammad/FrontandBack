import { useEffect, useMemo, useState } from "react";
import { API_ORIGIN } from "../config/api";
import { createLostPet, getLostPetByTagId, getLostPets } from "../services/lostPetsApi";

const resolveImg = (u) => {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return `${API_ORIGIN}${s}`;
  return `${API_ORIGIN}/${s}`;
};

export default function LostPets() {
  const [tab, setTab] = useState("browse");

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    postType: "Lost",
    tagId: "",
    petName: "",
    petType: "Cat",
    color: "",
    gender: "Unknown",
    ageMonths: "",
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
  const [pubLoading, setPubLoading] = useState(false);
  const [pubError, setPubError] = useState("");
  const [pubSuccess, setPubSuccess] = useState("");

  const [searchId, setSearchId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const isLost = form.postType === "Lost";

  const canPublish = useMemo(() => {
    const baseOk =
      form.tagId.trim() &&
      form.petType.trim() &&
      form.color.trim() &&
      form.city.trim() &&
      form.area.trim() &&
      form.description.trim() &&
      form.contactPhone.trim() &&
      images.length > 0 &&
      String(form.ageMonths).trim() !== "" &&
      String(form.lastSeenAt).trim() !== "";

    if (!baseOk) return false;
    if (isLost) return !!form.lostDate;
    return true;
  }, [form, images, isLost]);

  async function refreshList() {
    setListError("");
    setLoadingList(true);
    try {
      const data = await getLostPets();
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setItems([]);
      setListError(e?.message || "Failed to load");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    refreshList();

    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
    
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setPubError("");
    setPubSuccess("");
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onImagesChange(e) {
    setPubError("");
    setPubSuccess("");

    const files = Array.from(e.target.files || []);
    setImages(files);

    previews.forEach((u) => URL.revokeObjectURL(u));
    const next = files.map((f) => URL.createObjectURL(f));
    setPreviews(next);
  }

  async function onPublish(e) {
    e.preventDefault();
    setPubError("");
    setPubSuccess("");

    if (!canPublish) {
      setPubError("Fill required fields + upload at least 1 image");
      return;
    }

    try {
      setPubLoading(true);

      const payload = {
        ...form,
        ageMonths: Number(form.ageMonths) || 0,
        reward: form.reward ?? "",
        images,
      };

      await createLostPet(payload);

      setPubSuccess("Published");
      setTab("browse");

      setForm((p) => ({
        ...p,
        tagId: "",
        petName: "",
        color: "",
        ageMonths: "",
        lostDate: "",
        lastSeenAt: "",
        city: "",
        area: "",
        description: "",
        contactPhone: "",
        reward: "",
      }));

      setImages([]);
      previews.forEach((u) => URL.revokeObjectURL(u));
      setPreviews([]);

      await refreshList();
    } catch (e2) {
      setPubError(e2?.message || "Publish failed");
    } finally {
      setPubLoading(false);
    }
  }

  async function onSearch(e) {
    e.preventDefault();
    setSearchError("");
    setSearchResult(null);

    const id = searchId.trim();
    if (!id) {
      setSearchError("Enter Tag ID");
      return;
    }

    try {
      setSearchLoading(true);
      const data = await getLostPetByTagId(id);
      setSearchResult(data);
    } catch (e3) {
      setSearchError(e3?.message || "Not found");
    } finally {
      setSearchLoading(false);
    }
  }

  const readLastSeen = (obj) => obj?.lastSeenAt || obj?.lastSeen || "-";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topbar}>
          <div>
            <h2 style={styles.title}>Lost &amp; Found</h2>
            <div style={styles.subtitle}>Browse posts, publish a lost/found report, or search by Tag ID.</div>
          </div>

          <div style={styles.tabs}>
            <button
              type="button"
              onClick={() => setTab("browse")}
              style={{ ...styles.tabBtn, ...(tab === "browse" ? styles.tabActive : null) }}
            >
              Browse
            </button>
            <button
              type="button"
              onClick={() => setTab("publish")}
              style={{ ...styles.tabBtn, ...(tab === "publish" ? styles.tabActive : null) }}
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => setTab("search")}
              style={{ ...styles.tabBtn, ...(tab === "search" ? styles.tabActive : null) }}
            >
              Search
            </button>
          </div>
        </div>

        {tab === "browse" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button type="button" onClick={refreshList} style={styles.secondaryBtn}>
                Refresh
              </button>
            </div>

            {loadingList && <div style={styles.info}>Loading...</div>}
            {listError && <div style={styles.error}>{listError}</div>}

            {!loadingList && !listError && items.length === 0 && <div style={styles.info}>No posts yet</div>}

            <div style={styles.grid}>
              {items.map((p) => (
                <div key={p.id || `${p.tagId}-${p.createdAt || ""}`} style={styles.post}>
                  <div style={styles.postTop}>
                    <div>
                      <div style={styles.petName}>
                        {p.petName?.trim() ? p.petName : "Pet"}
                        <span style={styles.tag}>#{p.tagId || p.petId || "-"}</span>
                      </div>
                      <div style={styles.meta}>
                        {(p.postType || p.kind || "-")} • {(p.petType || p.type || "-")} • {(p.gender || "-")} •{" "}
                        {(p.color || "-")}
                      </div>
                    </div>

                    <div style={styles.badge}>
                      {(p.city || "-")} / {(p.area || "-")}
                    </div>
                  </div>

                  <div style={styles.rowLine}>
                    <div style={styles.small}>
                      <b>Age:</b> {p.ageMonths ?? p.age ?? "-"}
                    </div>
                    <div style={styles.small}>
                      <b>Last Seen:</b> {readLastSeen(p)}
                    </div>
                  </div>

                  <div style={styles.desc}>{p.description || "-"}</div>

                  <div style={styles.rowLine}>
                    <div style={styles.small}>
                      <b>Lost Date:</b> {p.lostDate || "-"}
                    </div>
                    <div style={styles.small}>
                      <b>Contact:</b> {p.contactPhone || "-"}
                    </div>
                  </div>

                  {!!p.reward && <div style={styles.reward}>Reward: {p.reward}</div>}

                  {Array.isArray(p.imageUrls) && p.imageUrls.length > 0 && (
                    <div style={styles.images}>
                      {p.imageUrls.slice(0, 4).map((src, idx) => (
                        <img key={idx} src={resolveImg(src)} alt="lost" style={styles.img} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "publish" && (
          <>
            {pubError && <div style={styles.error}>{pubError}</div>}
            {pubSuccess && <div style={styles.success}>{pubSuccess}</div>}

            <form onSubmit={onPublish} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Post Type *</label>
                <select name="postType" value={form.postType} onChange={onChange} style={styles.input}>
                  <option value="Lost">Lost (Owner)</option>
                  <option value="Found">Found (Community)</option>
                </select>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Tag ID *</label>
                  <input name="tagId" value={form.tagId} onChange={onChange} style={styles.input} />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Pet Name</label>
                  <input name="petName" value={form.petName} onChange={onChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Pet Type *</label>
                  <select name="petType" value={form.petType} onChange={onChange} style={styles.input}>
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

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Color *</label>
                  <input name="color" value={form.color} onChange={onChange} style={styles.input} />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Age (months) *</label>
                  <input
                    name="ageMonths"
                    value={form.ageMonths}
                    onChange={onChange}
                    style={styles.input}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Last Seen (details) *</label>
                  <input name="lastSeenAt" value={form.lastSeenAt} onChange={onChange} style={styles.input} />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Lost Date {isLost ? "*" : ""}</label>
                  <input
                    type="date"
                    name="lostDate"
                    value={form.lostDate}
                    onChange={onChange}
                    style={styles.input}
                    disabled={!isLost}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>City *</label>
                  <input name="city" value={form.city} onChange={onChange} style={styles.input} />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Area *</label>
                  <input name="area" value={form.area} onChange={onChange} style={styles.input} />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description *</label>
                <textarea name="description" value={form.description} onChange={onChange} style={styles.textarea} />
              </div>

              <div style={styles.row}>
                <div style={styles.field}>
                  <label style={styles.label}>Contact Phone *</label>
                  <input name="contactPhone" value={form.contactPhone} onChange={onChange} style={styles.input} />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Reward</label>
                  <input name="reward" value={form.reward} onChange={onChange} style={styles.input} inputMode="decimal" />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Images *</label>
                <input type="file" accept="image/*" multiple onChange={onImagesChange} style={styles.input} />
              </div>

              {previews.length > 0 && (
                <div style={styles.previewGrid}>
                  {previews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} style={styles.previewImg} />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={pubLoading}
                style={{
                  ...styles.primaryBtn,
                  opacity: pubLoading ? 0.6 : 1,
                  cursor: pubLoading ? "not-allowed" : "pointer",
                }}
              >
                {pubLoading ? "Publishing..." : "Publish"}
              </button>
            </form>
          </>
        )}

        {tab === "search" && (
          <>
            <form onSubmit={onSearch} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={styles.input}
                placeholder="Enter Tag ID"
              />
              <button type="submit" style={styles.primaryBtn} disabled={searchLoading}>
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </form>

            {searchError && <div style={{ ...styles.error, marginTop: 12 }}>{searchError}</div>}

            {searchResult && (
              <div style={{ ...styles.post, marginTop: 12 }}>
                <div style={styles.petName}>
                  {searchResult.petName || "Pet"}{" "}
                  <span style={styles.tag}>#{searchResult.tagId || "-"}</span>
                </div>
                <div style={styles.meta}>
                  {(searchResult.postType || "-")} • {(searchResult.petType || "-")} • {(searchResult.gender || "-")} •{" "}
                  {(searchResult.color || "-")}
                </div>
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  <b>Age:</b> {searchResult.ageMonths ?? "-"} | <b>Last Seen:</b> {readLastSeen(searchResult)}
                </div>
                <div style={{ marginTop: 8 }}>{searchResult.description || "-"}</div>

                {Array.isArray(searchResult.imageUrls) && searchResult.imageUrls.length > 0 && (
                  <div style={styles.images}>
                    {searchResult.imageUrls.slice(0, 4).map((src, idx) => (
                      <img key={idx} src={resolveImg(src)} alt="lost" style={styles.img} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
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
    width: "min(1100px, 100%)",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  title: { margin: 0, fontSize: 22, color: "#0f172a" },
  subtitle: { marginTop: 6, color: "#475569", fontSize: 13 },
  tabs: { display: "flex", gap: 8 },
  tabBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 800,
  },
  tabActive: { background: "rgba(79,163,199,0.14)" },
  form: { display: "flex", flexDirection: "column", gap: 14, marginTop: 12 },
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
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#4fa3c7",
    color: "white",
    fontWeight: 900,
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
  success: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(220, 252, 231, 0.85)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
    color: "#14532d",
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
  tag: { marginLeft: 8, fontSize: 12, color: "#64748b", fontWeight: 800 },
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
  rowLine: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10, flexWrap: "wrap" },
  small: { fontSize: 12, color: "#0f172a" },
  reward: { marginTop: 10, fontSize: 12, fontWeight: 900, color: "#065f46" },
  images: { marginTop: 10, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 },
  img: { width: "100%", height: 120, objectFit: "cover", borderRadius: 12 },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 12,
  },
  previewImg: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.08)",
  },
};
