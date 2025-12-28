import axios from "axios";

const axiosSeller = axios.create({
  baseURL: "https://librix-03l6.onrender.com/api",
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