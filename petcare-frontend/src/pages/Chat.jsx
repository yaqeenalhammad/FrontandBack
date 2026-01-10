import { useParams } from "react-router-dom";
import { publicChatMessages, vetChatMessages } from "../data/chats";

export default function Chat() {
  const { room } = useParams(); 
  const messages = room === "vet" ? vetChatMessages : publicChatMessages;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>
        {room === "vet" ? "Private Vet Chat 🩺" : "Public Chat 💬"}
      </h2>

      <div style={box}>
        {messages.map((m) => (
          <div key={m.id} style={msg}>
            <div style={{ fontWeight: 700 }}>
              {m.user} <span style={{ fontWeight: 400, color: "#777" }}>• {m.time}</span>
            </div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input style={input} placeholder="Type a message ..." />
        <button style={send}>Send</button>
      </div>
    </div>
  );
}

const box = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 14,
  height: 360,
  overflowY: "auto",
  display: "grid",
  gap: 10,
};

const msg = {
  padding: 10,
  borderRadius: 12,
  background: "#f7fbfd",
  border: "1px solid #e7f2f7",
};

const input = {
  flex: 1,
  padding: 10,
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
};

const send = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  background: "#9fd3ea",
  color: "#fff",
  cursor: "pointer",
};
