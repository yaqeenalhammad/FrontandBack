import { useState } from "react";
import LostPetsList from "./LostPetsList";
import LostPets from "./LostPets";
import LostPetsSearch from "./LostPetsSearch";


export default function LostPetsHub() {
  const [tab, setTab] = useState("posts"); 

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Lost Pets</h2>
            <p style={styles.subtitle}>
              Browse posts, create a Lost/Found report, or search by Pet ID.
            </p>
          </div>

          <div style={styles.tabs}>
            <button
              type="button"
              onClick={() => setTab("posts")}
              style={{ ...styles.tab, ...(tab === "posts" ? styles.tabActive : {}) }}
            >
              Posts
            </button>

            <button
              type="button"
              onClick={() => setTab("create")}
              style={{ ...styles.tab, ...(tab === "create" ? styles.tabActive : {}) }}
            >
              Create Post
            </button>

            <button
              type="button"
              onClick={() => setTab("search")}
              style={{ ...styles.tab, ...(tab === "search" ? styles.tabActive : {}) }}
            >
              Search
            </button>
          </div>
        </div>

        <div style={styles.body}>
          {tab === "posts" && (
            <LostPetsList
              hideHeader
              onCreate={() => setTab("create")}
            />
          )}

          {tab === "create" && (
            <LostPets
              hideHeader
              onCreated={() => setTab("posts")}
            />
          )}

          {tab === "search" && <LostPetsSearch hideHeader />}
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
    flexWrap: "wrap",
    marginBottom: 14,
  },
  title: { margin: 0, fontSize: 22, color: "#0f172a" },
  subtitle: { margin: "6px 0 0", color: "#475569", fontSize: 13 },
  tabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  tab: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 900,
  },
  tabActive: {
    background: "#4fa3c7",
    border: "1px solid rgba(79,163,199,0.8)",
    color: "white",
  },
  body: {
    borderTop: "1px solid rgba(0,0,0,0.06)",
    paddingTop: 14,
  },
};
