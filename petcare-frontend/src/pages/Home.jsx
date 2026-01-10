import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header / Hero */}
        <div
          style={styles.header}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 22px 60px rgba(0,0,0,0.12)";
            e.currentTarget.style.borderColor = "rgba(79,163,199,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = styles.header.boxShadow;
            e.currentTarget.style.borderColor = styles.header.border;
          }}
        >
          <div style={styles.logoWrap}>
            <img src={Logo} alt="PetCare Jordan" style={styles.logo} />
          </div>

          <div>
            <h1 style={styles.title}>Home</h1>
            <p style={styles.subtitle}>Choose a module to continue</p>
          </div>
        </div>

        {/* Adoption */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Adoption</h2>
          <div style={styles.grid}>
            <Card title="Dogs" icon="🐶" desc="Browse dogs for adoption" onClick={() => navigate("/adoption/dogs")} />
            <Card title="Cats" icon="🐱" desc="Browse cats for adoption" onClick={() => navigate("/adoption/cats")} />
            <Card title="Birds" icon="🐦" desc="Browse birds for adoption" onClick={() => navigate("/adoption/birds")} />
            <Card title="Other Pets" icon="🐾" desc="Other animals" onClick={() => navigate("/adoption/other")} />
          </div>
        </section>

        {/* Health */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Health</h2>
          <div style={styles.grid}>
            <Card
              title="Vaccination Records"
              icon="💉"
              desc="View & track vaccines"
              onClick={() => navigate("/vaccines")}
            />
            <Card
              title="Private Vet Chat"
              icon="🩺"
              desc="Chat privately with a vet"
              onClick={() => navigate("/chat/vet")}
            />
          </div>
        </section>

        {/* Community */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Community</h2>
          <div style={styles.grid}>
            <Card
              title="Public Chat"
              icon="💬"
              desc="Ask & share with others"
              onClick={() => navigate("/chat/public")}
            />
          </div>
        </section>

        {/* Lost & Found */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Lost & Found</h2>
          <div style={styles.grid}>
            <Card title="Browse Lost Pets" icon="📌" desc="See reported lost pets" onClick={() => navigate("/lost-pets")} />
            <Card
              title="Search by Pet ID"
              icon="🔎"
              desc="Enter Pet ID to locate info"
              onClick={() => navigate("/lost-pets/search")}
            />
            <Card
              title="Report Lost Pet"
              icon="📝"
              desc="Create a new lost report"
              onClick={() => navigate("/lost-pets/new")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ title, icon, desc, onClick }) {
  return (
    <button
      style={styles.card}
      onClick={onClick}
      type="button"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 18px 42px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = "rgba(79,163,199,0.40)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
        e.currentTarget.style.borderColor = styles.card.border;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <div style={styles.cardIconWrap}>
        <div style={styles.cardIcon}>{icon}</div>
      </div>

      <div style={styles.cardText}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardDesc}>{desc}</div>
      </div>

      <div style={styles.cardArrow} aria-hidden>
        ›
      </div>
    </button>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 28,
    background:
      "radial-gradient(900px 600px at 20% 10%, rgba(79,163,199,0.22), transparent 60%)," +
      "radial-gradient(850px 560px at 80% 0%, rgba(159,211,234,0.25), transparent 60%)," +
      "radial-gradient(900px 700px at 50% 100%, rgba(186,230,253,0.30), transparent 65%)," +
      "linear-gradient(135deg, #f6f2eb, #e8f4fb)",
  },

  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,253,249,0.92)",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
    backdropFilter: "blur(10px)",
    transition: "transform .14s ease, box-shadow .14s ease, border-color .14s ease",
    marginBottom: 18,
  },

  logoWrap: {
    width: 74,
    height: 74,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(79,163,199,0.16), rgba(159,211,234,0.18))",
    border: "1px solid rgba(79,163,199,0.20)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
    flex: "0 0 auto",
  },

  logo: {
    width: 56,
    height: 56,
    objectFit: "contain",
    display: "block",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    color: "#1b5f7a",
    letterSpacing: 0.2,
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: 13,
    fontWeight: 600,
    color: "#5f6b73",
  },

  section: {
    margin: "18px 0 0",
  },

  sectionTitle: {
    margin: "14px 0 10px",
    fontSize: 13,
    fontWeight: 900,
    color: "#2d88ad",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
  },

  card: {
    width: "100%",
    border: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
    transition: "transform .14s ease, box-shadow .14s ease, border-color .14s ease",
    backdropFilter: "blur(8px)",
    outline: "none",
  },

  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    background: "rgba(79,163,199,0.14)",
    border: "1px solid rgba(79,163,199,0.18)",
    flex: "0 0 auto",
  },

  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontSize: 22,
  },

  cardText: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    fontWeight: 900,
    color: "#0f172a",
    fontSize: 14,
  },

  cardDesc: {
    margin: 0,
    fontSize: 12,
    color: "#55616a",
    fontWeight: 600,
    lineHeight: 1.35,
  },

  cardArrow: {
    fontSize: 22,
    fontWeight: 900,
    color: "rgba(45,136,173,0.55)",
    paddingLeft: 6,
    transition: "transform .14s ease, color .14s ease",
  },
};