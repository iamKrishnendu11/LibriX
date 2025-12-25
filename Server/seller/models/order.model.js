import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "cancelled", "ready", "picked up", "delivered"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);