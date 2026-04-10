import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.0.100:8082",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default API;