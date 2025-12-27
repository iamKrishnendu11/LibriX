import mongoose from "mongoose";

const lendPaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "RentOrder", required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "received"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("LendPayment", lendPaymentSchema);