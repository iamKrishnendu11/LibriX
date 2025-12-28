import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectDB from "./configs/db.js";
import { connectCloudinary } from "./configs/cloudinaryConfig.js";

import sellerAuthRouter from "./routes/sellerAuth.route.js";
import buyerAuthRouter from "./routes/buyerAuth.route.js";
import lenderAuthRoutes from "./routes/lenderAuth.route.js";
import lendBookRouter from "./routes/lendBook.route.js";
import ocrRouter from "./routes/ocr.route.js";
import bookRouter from "./routes/book.route.js";
import orderRouter from "./routes/order.route.js";
import rentOrderRouter from "./routes/rentOrder.route.js";
import bidsRouter from "./routes/bid.route.js";

const app = express();
const port = process.env.PORT || 3000;

/* ------------------ DATABASE ------------------ */
await connectDB();
connectCloudinary();

/* ------------------ CORS (FIXED) ------------------ */
const allowedOrigins = [
  "https://librix-eta.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// IMPORTANT: handle preflight requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});


/* ------------------ MIDDLEWARE ------------------ */
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
app.use("/api/bids", bidsRouter);

app.get("/", (req, res) => {
  res.send("🚀 LibriX backend running successfully");
});

/* ------------------ SOCKET.IO ------------------ */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: token missing"));
  }

  try {
    const decodedUnverified = jwt.decode(token);
    if (!decodedUnverified?.role) {
      return next(new Error("Authentication error: role missing"));
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

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  if (socket.userId && socket.role) {
    socket.join(`${socket.role}_${socket.userId}`);
  }

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ------------------ START SERVER ------------------ */
server.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
