import mongoose from "mongoose"; // ✅ Added missing import for Analytics
import RentOrder from "../models/rentOrder.model.js";
import LendPayment from "../models/lendPayment.model.js";
import Notification from "../models/notification.model.js";
import LendBook from "../models/lendBook.model.js";
import { io } from "../server.js";

/* ----------------------------------------------------
   1️⃣ BUYER PLACES RENTAL ORDER
---------------------------------------------------- */
export const placeRentOrder = async (req, res) => {
  try {
    const { bookId, durationWeeks } = req.body;

    const book = await LendBook.findById(bookId).populate("lenderId");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const lenderId = book.lenderId._id.toString();
    const amount = book.rent_price_per_week * durationWeeks;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (durationWeeks * 7));

    const order = await RentOrder.create({
      book: book._id,
      buyer: req.buyerId,
      lender: lenderId,
      amount,
      durationWeeks,
      dueDate,
      status: "pending",
    });

    const lenderNote = await Notification.create({
      recipient: lenderId,
      recipientModel: "lender",
      title: "New Rental Request",
      message: `A rental order arrived for "${book.title}" for ${durationWeeks} weeks.`,
      orderId: order._id,
      type: "order_request"
    });

    // ✅ Emit with .toObject() to prevent circular dependency crashes
    if (io) {
      io.to(`lender_${lenderId}`).emit("new_notification", lenderNote.toObject());
    }

    simulateRentLifecycle(order._id);

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ----------------------------------------------------
   2️⃣ AUTOMATED LIFECYCLE SIMULATION
---------------------------------------------------- */
const simulateRentLifecycle = (orderId) => {
  setTimeout(async () => {
    try {
      const order = await RentOrder.findById(orderId).populate("book buyer lender");
      if (!order) return;

      await LendPayment.create({
        order: order._id,
        lender: order.lender?._id,
        amount: order.amount,
        status: "received"
      });

      const lenderPayNote = await Notification.create({
        recipient: order.lender?._id,
        recipientModel: "lender",
        title: "Payment Received",
        message: `Payment of ₹${order.amount} received for "${order.book?.title}".`,
        type: "payment"
      });

      const buyerDelNote = await Notification.create({
        recipient: order.buyer?._id,
        recipientModel: "buyer",
        title: "Order Update",
        message: `Your order for "${order.book?.title}" is out for delivery!`,
        type: "order_update"
      });

      if (io) {
        io.to(`lender_${order.lender?._id}`).emit("new_notification", lenderPayNote.toObject());
        io.to(`buyer_${order.buyer?._id}`).emit("new_notification", buyerDelNote.toObject());
      }

      setTimeout(async () => {
        try {
          order.status = "delivered";
          await order.save();

          const deliveredNote = await Notification.create({
            recipient: order.buyer?._id,
            recipientModel: "buyer",
            title: "Delivery Completed",
            message: `Your book "${order.book?.title}" has been delivered. Enjoy reading!`,
            type: "order_update"
          });

          if (io) {
            io.to(`buyer_${order.buyer?._id}`).emit("new_notification", deliveredNote.toObject());
          }
        } catch (err) { console.error("Delivery simulation error:", err); }
      }, 300000); // 5 mins

    } catch (err) { console.error("Lifecycle simulation error:", err); }
  }, 300000); // 5 mins
};

/* ----------------------------------------------------
   3️⃣ FETCH LENDER NOTIFICATIONS
---------------------------------------------------- */
export const getLenderNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.lenderId, 
      recipientModel: "lender",
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ----------------------------------------------------
   4️⃣ FETCH LENDER ORDERS
---------------------------------------------------- */
export const getLenderOrders = async (req, res) => {
  try {
    const lenderId = req.lenderId;

    const orders = await RentOrder.find({ lender: lenderId })
      .populate("book")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("GET LENDER ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rental history" });
  }
};

/* ----------------------------------------------------
   5️⃣ LENDER DASHBOARD ANALYTICS (Fixed empty chart issue)
---------------------------------------------------- */
export const getLenderAnalytics = async (req, res) => {
  try {
    const lenderId = req.lenderId;
    
    // Group existing revenue by month
    const analytics = await RentOrder.aggregate([
      { $match: { lender: new mongoose.Types.ObjectId(lenderId) } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" }
        }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // ✅ IMPROVEMENT: Generate a continuous 6-month window so the chart is never empty
    const currentMonth = new Date().getMonth();
    const lastSixMonths = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      const foundData = analytics.find(a => a._id === monthIdx + 1);
      
      lastSixMonths.push({
        month: monthNames[monthIdx],
        revenue: foundData ? foundData.revenue : 0 // Defaults to 0 instead of skipping
      });
    }

    res.json({ success: true, revenueData: lastSixMonths });
  } catch (error) {
    console.error("GET LENDER ANALYTICS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};