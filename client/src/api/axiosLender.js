import axios from "axios";

const lenderAxios = axios.create({
  baseURL: "http://localhost:3000/api",
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