import RentOrder from "../models/rentOrder.model.js";
import LendPayment from "../models/lendPayment.model.js";
import Notification from "../models/notification.model.js";
import LendBook from "../models/lendBook.model.js";
import { io } from "../server.js";

export const placeRentOrder = async (req, res) => {
  try {
    const { bookId, durationWeeks } = req.body;

    // 1. Fetch book and validate
    const book = await LendBook.findById(bookId).populate("lenderId");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const lenderId = book.lenderId._id.toString();
    const amount = book.rent_price_per_week * durationWeeks;
    
    // 2. Calculate Due Date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (durationWeeks * 7));

    // 3. Create the Order
    const order = await RentOrder.create({
      book: book._id,
      buyer: req.buyerId,
      lender: lenderId,
      amount,
      durationWeeks,
      dueDate,
      status: "pending",
    });

    // 4. Create Notifications in DB
    const lenderNote = await Notification.create({
      recipient: lenderId,
      recipientModel: "lender",
      title: "New Rental Request",
      message: `A rental order arrived for "${book.title}" for ${durationWeeks} weeks.`,
      orderId: order._id,
      type: "order_request"
    });

    const buyerNote = await Notification.create({
      recipient: req.buyerId,
      recipientModel: "buyer",
      title: "Rental Order Placed",
      message: `Your rental order for "${book.title}" has been confirmed!`,
      orderId: order._id,
      type: "order_update"
    });

    // 5. Emit Real-time (with safety check to prevent 500 errors)
    if (io) {
      io.to(`lender_${lenderId}`).emit("new_notification", lenderNote);
      io.to(`buyer_${req.buyerId}`).emit("new_notification", buyerNote);
    } else {
      console.warn("Socket.io instance not found. Real-time notification skipped.");
    }

    // 6. Start Lifecycle Simulation (Triggered but not awaited)
    simulateRentLifecycle(order._id);

    // 7. Send Success Response
    return res.status(201).json({ success: true, order });

  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
};

const simulateRentLifecycle = (orderId) => {
  // Use a try-catch inside the timeout so background errors don't crash the main process
  setTimeout(async () => {
    try {
      const order = await RentOrder.findById(orderId).populate("book buyer lender");
      if (!order) return;

      // Lender: Payment Received
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

      // Buyer: Out for delivery
      const buyerDelNote = await Notification.create({
        recipient: order.buyer?._id,
        recipientModel: "buyer",
        title: "Order Update",
        message: `Your order for "${order.book?.title}" is out for delivery!`,
        type: "order_update"
      });

      if (io) {
        io.to(`lender_${order.lender?._id}`).emit("new_notification", lenderPayNote);
        io.to(`buyer_${order.buyer?._id}`).emit("new_notification", buyerDelNote);
      }

      // --- AFTER 5 MINUTES (Delivery Complete) ---
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
            io.to(`buyer_${order.buyer?._id}`).emit("new_notification", deliveredNote);
          }
        } catch (err) {
          console.error("Delivery simulation error:", err);
        }
      }, 300000); 

    } catch (err) {
      console.error("Lifecycle simulation error:", err);
    }
  }, 300000); 
};

// Add this to your existing rentOrder.controller.js
export const getLenderNotifications = async (req, res) => {
  try {
    // Assuming you have lenderId from your authentication middleware
    const notifications = await Notification.find({
      recipient: req.lenderId, 
      recipientModel: "lender",
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("GET LENDER NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};