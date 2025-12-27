import mongoose from "mongoose";

const rentOrderSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LendBook", // Points to your lending model
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true
  },
  lender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lender",
    required: true
  },
  amount: { type: Number, required: true },
  durationWeeks: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "out_for_delivery", "delivered", "returned", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  }
}, { timestamps: true });

export default mongoose.model("RentOrder", rentOrderSchema);