import { vaccineRecords } from "../data/vaccines";

export default function Vaccines() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Vaccination Records 💉</h2>

      <div style={{ display: "grid", gap: 12, maxWidth: 850 }}>
        {vaccineRecords.map((r) => (
          <div key={r.id} style={row}>
            <div style={{ fontWeight: 700 }}>{r.petName}</div>
            <div>{r.vaccineName}</div>
            <div>Date: {r.date}</div>
            <div>Next: {r.nextDue}</div>
            <div>Status: <b>{r.status}</b></div>
            <div style={{ color: "#555" }}>{r.clinic}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const row = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 14,
  display: "grid",
  gap: 6,
};
