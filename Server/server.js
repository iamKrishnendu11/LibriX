import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";


import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinaryConfig.js";

import sellerAuthRouter from "./routes/sellerAuth.route.js";
import buyerAuthRouter from "./routes/buyerAuth.route.js";
import lenderAuthRoutes from "./routes/lenderAuth.route.js";
import lendBookRouter from "./routes/lendBook.route.js";
import ocrRouter from "./routes/ocr.route.js";
import bookRouter from "./routes/book.route.js";
import orderRouter from "./routes/order.route.js";
import rentOrderRouter from "./routes/rentOrder.route.js";

const app = express();
const port = process.env.PORT || 3000;

/* ------------------ DATABASE ------------------ */
await connectDB();
connectCloudinary();

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

/* ------------------ ROUTES ------------------ */
app.use("/api/seller", sellerAuthRouter);
app.use("/api/buyer", buyerAuthRouter);
app.use("/api/lender", lenderAuthRoutes);
app.use("/api/ocr", ocrRouter);
app.use("/api/books", bookRouter);
app.use("/api/orders", orderRouter);
app.use("/api/lend-books", lendBookRouter);
app.use("/api/rent-orders", rentOrderRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the LibriX Server!");
});

/* ------------------ SOCKET.IO ------------------ */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("❌ Socket auth failed: token missing");
    return next(new Error("Authentication error"));
  }

  try {
    // Decode WITHOUT verification to read role
    const decodedUnverified = jwt.decode(token);

    if (!decodedUnverified?.role) {
      console.log("❌ Socket auth failed: role missing");
      return next(new Error("Authentication error"));
    }

    let secret;

    switch (decodedUnverified.role) {
      case "seller":
        secret = process.env.SELLER_ACCESS_TOKEN_SECRET;
        break;
      case "buyer":
        secret = process.env.BUYER_ACCESS_TOKEN_SECRET;
        break;
      case "lender":
        secret = process.env.LENDER_ACCESS_TOKEN_SECRET;
        break;
      default:
        throw new Error("Invalid role");
    }

    const decoded = jwt.verify(token, secret);

    socket.userId = decoded.id;
    socket.role = decoded.role;

    console.log(`✅ ${decoded.role} socket authenticated:`, decoded.id);
    next();
  } catch (err) {
    console.log("❌ Socket auth failed:", err.message);
    next(new Error("Authentication error"));
  }
});


io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  if (socket.userId && socket.role) {
    const room = `${socket.role}_${socket.userId}`;
    socket.join(room);
    console.log(`👤 ${room} joined room`);
  }

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});


/* ------------------ START SERVER ------------------ */
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
