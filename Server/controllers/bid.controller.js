// controllers/bid.controller.js
import Bid from "../models/bid.model.js";
import Offer from "../models/offer.model.js"; // ✅ CRUCIAL: Added missing import

// Buyers post their book requests
export const placeBidRequest = async (req, res) => {
  try {
    const { bookName, comment } = req.body;

    if (!bookName || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "Book name and comment are required" 
      });
    }

    const newBid = await Bid.create({
      buyer: req.buyerId, 
      bookName,
      comment
    });

    res.status(201).json({
      success: true,
      message: "Bid request posted successfully",
      bid: newBid
    });
  } catch (error) {
    console.error("BID CONTROLLER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// For Sellers to see what books are in demand
export const getAllOpenBids = async (req, res) => {
  try {
    const bids = await Bid.find({ status: "open" })
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, bids });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ For the "My Orders" Bids tab: Fetch accepted offers for a buyer
export const getMyAcceptedOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ 
      buyer: req.buyerId, 
      status: "accepted" 
    })
    .populate("bidRequest")
    .populate("seller", "name")
    .sort({ updatedAt: -1 });

    res.json({ success: true, offers });
  } catch (error) {
    console.error("GET ACCEPTED OFFERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};