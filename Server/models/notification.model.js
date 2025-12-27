import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'recipientModel' // Dynamic reference based on the model name
  }, 
  recipientModel: { 
    type: String, 
    // Added "lender" to the enum list to fix your validation error
    enum: ["buyer", "seller", "lender"], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    // Since you have both 'Order' and 'RentOrder', you might want to 
    // ensure this matches the ID you are passing
    ref: "RentOrder" 
  },
  orderStatus: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  },
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ["order_request", "order_update", "payment"] }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);