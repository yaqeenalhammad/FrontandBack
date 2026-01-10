import { useNavigate, useParams } from "react-router-dom";
import { pets } from "../data/pets";

export default function AdoptionList() {
  const navigate = useNavigate();
  const { type } = useParams();

  const list =
    type === "other"
      ? pets.filter((p) => !["dogs", "cats", "birds"].includes(p.type))
      : pets.filter((p) => p.type === type);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0, textTransform: "capitalize" }}>
        Adoption: {type}
      </h2>

      <div style={grid}>
        {list.map((p) => (
          <div
            key={p.id}
            style={card}
            onClick={() => navigate(`/pet/${p.id}`)} 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/pet/${p.id}`);
            }}
          >
            <div style={imageBox}>
              <img src={p.image} alt={p.name} style={image} />
            </div>

            
            <h3 style={{ margin: "10px 0 4px" }}>{p.name}</h3>

            <div style={mini}>
              {p.gender} • {p.city}
            </div>

            
            <button
              style={btn}
              onClick={(e) => {
                e.stopPropagation(); 
                navigate(`/pet/${p.id}`);
              }}
              type="button"
            >
              For More Information
            </button>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <p style={{ marginTop: 20 }}>No pets found for this category.</p>
      )}
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 14,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
};

const imageBox = {
  width: "100%",
  height: 180,
  background: "#f5f5f5",
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const image = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "cover", 
};

const mini = {
  color: "#64748b",
  fontSize: 12,
};

const btn = {
  marginTop: 12,
  padding: 10,
  borderRadius: 12,
  border: "none",
  background: "#4fa3c7",
  color: "#fff",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};