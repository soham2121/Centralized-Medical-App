import axios from "axios";

const API = axios.create({
  baseURL: "https://your-render-url.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default API;