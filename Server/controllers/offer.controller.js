// controllers/offer.controller.js
import Offer from "../models/offer.model.js";
import Notification from "../models/notification.model.js";
import Bid from "../models/bid.model.js";
import { io } from "../server.js";

// --- SELLERS CREATE AN OFFER FOR A BID ---
export const createOffer = async (req, res) => {
  try {
    const { bidId, price, condition, message, buyerId, bookName } = req.body;
    if (!req.file) return res.status(400).json({ message: "Book image is required" });

    // 1. Create the Offer
    const offer = await Offer.create({
      bidRequest: bidId,
      seller: req.sellerId,
      buyer: buyerId,
      bookImage: req.file.path, // Cloudinary URL
      price,
      condition,
      message
    });

    // 2. Notify the Buyer
    const notification = await Notification.create({
      recipient: buyerId,
      recipientModel: "buyer",
      title: "New Offer Received!",
      message: `A seller offered "${bookName}" for ₹${price}. Click to view details.`,
      imageUrl: req.file.path, 
      type: "order_request",
      orderId: offer._id,
      orderStatus: "pending"
    });

    // ✅ FIX: Use .toObject() to prevent Socket.io circular reference crashes
    if (io) {
      io.to(`buyer_${buyerId}`).emit("new_notification", notification.toObject());
    }

    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- BUYERS RESPOND (ACCEPT/DECLINE) TO OFFER ---
export const handleOfferResponse = async (req, res) => {
  try {
    const { offerId, action } = req.body;
    const status = action === "accept" ? "accepted" : "declined";

    // 1. Update Offer Status in DB
    const offer = await Offer.findByIdAndUpdate(offerId, { status }, { new: true })
      .populate("bidRequest seller buyer");

    // 2. ✅ CRUCIAL FIX: Update the original notification document status
    // This prevents the buttons from reappearing during the next fetch/poll
    await Notification.findOneAndUpdate(
      { orderId: offerId, type: "order_request" }, 
      { orderStatus: status }
    );

    if (status === "accepted") {
      await Bid.findByIdAndUpdate(offer.bidRequest._id, { status: "fulfilled" });
      
      // Trigger automated 5-minute lifecycle
      simulateOfferLifecycle(offer);
    }

    // 3. Notify the Seller of the response
    const sellerNote = await Notification.create({
      recipient: offer.seller._id,
      recipientModel: "seller",
      title: `Offer ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your offer for "${offer.bidRequest.bookName}" has been ${status}.`,
      type: "order_update"
    });

    // ✅ FIX: Emit plain object
    if (io) io.to(`seller_${offer.seller._id}`).emit("new_notification", sellerNote.toObject());

    res.json({ success: true, message: `Offer ${status}ed` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- AUTOMATED 5-10 MINUTE LIFECYCLE SIMULATION ---
const simulateOfferLifecycle = (offer) => {
  // Step 1: Payment & Out for Delivery (After 5 Minutes)
  setTimeout(async () => {
    try {
      const sellerPayNote = await Notification.create({
        recipient: offer.seller._id,
        recipientModel: "seller",
        title: "Payment Received",
        message: `Payment of ₹${offer.price} received for "${offer.bidRequest.bookName}".`,
        type: "payment"
      });

      const buyerDelNote = await Notification.create({
        recipient: offer.buyer._id,
        recipientModel: "buyer",
        title: "Order Update",
        message: `Your order for "${offer.bidRequest.bookName}" is out for delivery!`,
        type: "order_update"
      });

      if (io) {
        io.to(`seller_${offer.seller._id}`).emit("new_notification", sellerPayNote.toObject());
        io.to(`buyer_${offer.buyer._id}`).emit("new_notification", buyerDelNote.toObject());
      }

      // Step 2: Delivered (After 5 more Minutes)
      setTimeout(async () => {
        try {
          const deliveredNote = await Notification.create({
            recipient: offer.buyer._id,
            recipientModel: "buyer",
            title: "Order Delivered",
            message: `Your book "${offer.bidRequest.bookName}" has been delivered.`,
            type: "order_update"
          });

          if (io) io.to(`buyer_${offer.buyer._id}`).emit("new_notification", deliveredNote.toObject());
        } catch (err) { console.error("Delivered SIM error:", err); }
      }, 300000); // 5 mins

    } catch (err) { console.error("Payment SIM error:", err); }
  }, 300000); // 5 mins
};