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

  socket = io("https://librix-03l6.onrender.com", {
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

// Accept an optional "role" and auto-initialize the socket when needed.
export const getSocket = (role) => {
  if (!socket && role) return initSocket(role);
  if (socket && role && currentRole !== role) return initSocket(role);
  return socket;
};
