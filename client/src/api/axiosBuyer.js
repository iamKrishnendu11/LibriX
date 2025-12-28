import axios from "axios";

const buyerAxios = axios.create({
  baseURL: "https://librix-03l6.onrender.com/api",
});

buyerAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("buyerAccessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default buyerAxios;
