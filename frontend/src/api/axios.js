// import axios from "axios";
//
// const API = axios.create({
//   baseURL: "https://kindlift.onrender.com",
//   headers: {
//     "Content-Type": "application/json",
//   }
// });
//
// export default API;
import axios from "axios";

const api = axios.create({
  baseURL: "https://kindlift-1.onrender.com", // ✅ FIX
});

export default api;