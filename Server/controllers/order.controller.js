import Order from "../models/order.model.js";
import Notification from "../models/notification.model.js";
import Book from "../models/book.model.js";
import RentOrder from "../models/rentOrder.model.js"; // Needed for getMyOrders
import { io } from "../server.js";

/* ----------------------------------------------------
   1️⃣ BUYER PLACES ORDER (Standard Buy)
---------------------------------------------------- */
export const placeOrder = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId).populate("seller");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const sellerId = book.seller._id.toString();

    const order = await Order.create({
      book: book._id,
      buyer: req.buyerId,
      seller: sellerId,
      amount: book.price,
      status: "pending",
    });

    const notification = await Notification.create({
      recipient: sellerId,
      recipientModel: "seller",
      title: "New Order Received",
      message: `New order for "${book.title}". Amount: ₹${book.price}`,
      orderId: order._id,
      type: "order_request",
      orderStatus: "pending",
    });

    // ✅ FIX: Use .toObject() to prevent socket disconnection due to circular refs
    if (io) {
      io.to(`seller_${sellerId}`).emit("new_notification", notification.toObject());
    }

    return res.status(201).json({
      success: true,
      message: "Order placed! Notification sent to seller.",
      order,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ----------------------------------------------------
   2️⃣ SELLER ACCEPT / DECLINE
---------------------------------------------------- */
export const handleOrderAction = async (req, res) => {
  try {
    const { orderId, action } = req.body;

    const order = await Order.findById(orderId).populate("book buyer seller");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const buyerId = order.buyer._id.toString();
    const sellerId = order.seller._id.toString();
    const status = action === "accept" ? "accepted" : "cancelled";

    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Update order status
    order.status = status;
    await order.save();

    // ✅ FIX: Update the original notification status so buttons disappear
    await Notification.findOneAndUpdate(
      { orderId, type: "order_request" },
      { orderStatus: status }
    );

    const buyerNotification = await Notification.create({
      recipient: buyerId,
      recipientModel: "buyer",
      title: action === "accept" ? "Order Confirmed" : "Order Cancelled",
      message:
        action === "accept"
          ? `Your order for "${order.book.title}" has been confirmed!`
          : `Your order for "${order.book.title}" was cancelled by the seller.`,
      type: "order_update",
      orderStatus: order.status,
    });

    // ✅ FIX: Real-time emits with .toObject()
    if (io) {
      io.to(`buyer_${buyerId}`).emit("new_notification", buyerNotification.toObject());
      // Signal seller to refresh notification view
      io.to(`seller_${sellerId}`).emit("new_notification");
    }

    if (action === "accept") {
      simulateOrderLifecycle(order);
    }

    return res.json({
      success: true,
      message: `Order ${action}ed successfully`,
    });
  } catch (error) {
    console.error("ORDER ACTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ----------------------------------------------------
   3️⃣ AUTOMATED LIFECYCLE SIMULATION
---------------------------------------------------- */
const simulateOrderLifecycle = (order) => {
  // Step 1: Payment Received & Out for Delivery (after 5 mins)
  setTimeout(async () => {
    try {
      // Seller notification: Payment Received
      const sellerPayNote = await Notification.create({
        recipient: order.seller._id,
        recipientModel: "seller",
        title: "Payment Received",
        message: `Payment of ₹${order.amount} received for "${order.book.title}".`,
        type: "payment"
      });

      // Buyer notification: Out for Delivery
      const buyerDelNote = await Notification.create({
        recipient: order.buyer._id,
        recipientModel: "buyer",
        title: "Order Update",
        message: `Your order for "${order.book.title}" is out for delivery!`,
        type: "order_update"
      });

      if (io) {
        io.to(`seller_${order.seller._id}`).emit("new_notification", sellerPayNote.toObject());
        io.to(`buyer_${order.buyer._id}`).emit("new_notification", buyerDelNote.toObject());
      }

      // Step 2: Order Delivered (after more 5 mins)
      setTimeout(async () => {
        try {
          const deliveredNote = await Notification.create({
            recipient: order.buyer._id,
            recipientModel: "buyer",
            title: "Order Delivered",
            message: `Your book "${order.book.title}" has been delivered.`,
            type: "order_update"
          });

          if (io) {
            io.to(`buyer_${order.buyer._id}`).emit("new_notification", deliveredNote.toObject());
          }
        } catch (err) { console.error("Delivered simulation error:", err); }
      }, 300000); // 5 mins

    } catch (err) { console.error("Payment simulation error:", err); }
  }, 300000); // 5 mins
};

/* ----------------------------------------------------
   4️⃣ FETCH NOTIFICATIONS
---------------------------------------------------- */
export const getBuyerNotifications = async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.buyerId,
    recipientModel: "buyer",
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

export const getSellerNotifications = async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.sellerId,
    recipientModel: "seller",
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

/* ----------------------------------------------------
   5️⃣ FETCH MY ORDERS (Fixes 404 error)
---------------------------------------------------- */
export const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.buyerId;

    // Fetch both Purchases and Rentals
    const [purchaseOrders, rentalOrders] = await Promise.all([
      Order.find({ buyer: buyerId }).populate("book seller").sort({ createdAt: -1 }),
      RentOrder.find({ buyer: buyerId }).populate("book lender").sort({ createdAt: -1 })
    ]);

    // Format Purchases
    const formattedPurchases = purchaseOrders.map(o => ({
      ...o._doc,
      orderType: "purchase",
      bookId: o.book
    }));

    // Format Rentals
    const formattedRentals = rentalOrders.map(o => ({
      ...o._doc,
      orderType: "rental",
      bookId: o.book
    }));

    res.json({ 
      success: true, 
      orders: [...formattedPurchases, ...formattedRentals] 
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};