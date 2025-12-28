import axios from "axios";

const lenderAxios = axios.create({
  baseURL: "https://librix-03l6.onrender.com/api",
});

lenderAxios.interceptors.request.use((config) => {
  // Matches the key used in your Login and UploadedBooks components
  const token = localStorage.getItem("lenderAccessToken"); 
  
  if (token) {
    // Standard Bearer token format required by your lenderProtect middleware
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default lenderAxios;