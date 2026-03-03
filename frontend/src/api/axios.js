import axios from "axios";

const API = axios.create({
  baseURL: "https://kindlift.onrender.com",
  headers: {
    "Content-Type": "application/json",
  }
});

export default API;