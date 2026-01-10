import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5237", // إذا باكك HTTP
  // baseURL: "https://localhost:5237", // إذا باكك HTTPS
});
