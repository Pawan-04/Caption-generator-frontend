// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4001/api",
//   withCredentials: true // 🔥 VERY IMPORTANT
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export default api;