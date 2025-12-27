import axios from "axios";

const axiosSeller = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ✅ ALWAYS attach latest token
axiosSeller.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sellerAccessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSeller;