import Order from "../models/order.model.js";
import Notification from "../models/notification.model.js";
import Book from "../models/book.model.js";
import Seller from "../models/seller.model.js";

// --- 1. Buyer places an order ---
export const placeOrder = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId).populate("seller");

    if (!book) return res.status(404).json({ message: "Book not found" });

    const newOrder = await Order.create({
      book: bookId,
      buyer: req.buyerId, // from auth middleware
      seller: book.seller._id,
      amount: book.price,
      status: "pending"
    });

    // Notify Seller
    await Notification.create({
      recipient: book.seller._id,
      recipientModel: "Seller",
      title: "New Order Received",
      message: `New order for "${book.title}". Amount: ₹${book.price}`,
      orderId: newOrder._id,
      type: "order_request"
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. Seller accepts/declines order ---
export const handleOrderAction = async (req, res) => {
  try {
    const { orderId, action } = req.body; // action: 'accept' or 'decline'
    const order = await Order.findById(orderId).populate("book buyer");

    if (action === "decline") {
      order.status = "cancelled";
      await order.save();
      
      await Notification.create({
        recipient: order.buyer._id,
        recipientModel: "Buyer",
        title: "Order Cancelled",
        message: `Your order for "${order.book.title}" was cancelled by the seller.`,
        type: "order_update"
      });
      return res.json({ message: "Order cancelled" });
    }

    // If accepted
    order.status = "accepted";
    await order.save();

    await Notification.create({
      recipient: order.buyer._id,
      recipientModel: "Buyer",
      title: "Order Confirmed",
      message: `Your order for "${order.book.title}" has been confirmed. Ready for pickup!`,
      type: "order_update"
    });

    // --- START DELIVERY SIMULATION ---
    simulateDelivery(order._id);

    res.json({ success: true, message: "Order accepted. Delivery simulation started." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. Delivery Simulation Logic ---
const simulateDelivery = (orderId) => {
  // Step 1: Ready after 5 mins
  setTimeout(async () => {
    const order = await Order.findById(orderId).populate("book buyer seller");
    order.status = "ready";
    await order.save();
  }, 5 * 60 * 1000);

  // Step 2: Picked up after 10 mins
  setTimeout(async () => {
    const order = await Order.findById(orderId).populate("book buyer seller");
    order.status = "picked up";
    order.paymentStatus = "paid"; // Payment simulated on pickup
    await order.save();

    // Notify Seller: Payment Received
    await Notification.create({
      recipient: order.seller._id,
      recipientModel: "Seller",
      title: "Payment Received",
      message: `Payment of ₹${order.amount} received for "${order.book.title}".`,
      type: "payment"
    });

    // Notify Buyer: Out for delivery
    await Notification.create({
      recipient: order.buyer._id,
      recipientModel: "Buyer",
      title: "Out for Delivery",
      message: "Your order is out for delivery.",
      type: "order_update"
    });
  }, 10 * 60 * 1000);

  // Step 3: Delivered after 20 mins
  setTimeout(async () => {
    const order = await Order.findById(orderId);
    order.status = "delivered";
    await order.save();

    // Notify Seller: Successful
    await Notification.create({
      recipient: order.seller._id,
      recipientModel: "Seller",
      title: "Delivery Successful",
      message: "The order has been delivered successfully.",
      type: "order_update"
    });
  }, 20 * 60 * 1000);
};