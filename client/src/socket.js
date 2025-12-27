import { io } from "socket.io-client";

let socket = null;
let currentRole = null;

export const initSocket = (role) => {
  if (socket && currentRole === role) {
    return socket;
  }

  // 🔴 Kill old socket if role changed
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const tokenKey =
    role === "buyer"
      ? "buyerAccessToken"
      : role === "seller"
      ? "sellerAccessToken"
      : "lenderAccessToken";

  const token = localStorage.getItem(tokenKey);

  if (!token) {
    console.warn("⚠️ No token found, socket not initialized");
    return null;
  }

  currentRole = role;

  socket = io("http://localhost:3000", {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id, "Role:", role);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => socket;
