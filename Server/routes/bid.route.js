// routes/bid.route.js
import express from "express";
import multer from "multer";
import { cloudinary } from "../configs/cloudinaryConfig.js"; 
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { 
  placeBidRequest, 
  getAllOpenBids, 
  getMyAcceptedOffers // ✅ Added import
} from "../controllers/bid.controller.js";
import { createOffer, handleOfferResponse } from "../controllers/offer.controller.js";
import { buyerProtect } from "../middlewares/buyerAuth.middleware.js";
import { sellerProtect } from "../middlewares/sellerAuth.middleware.js";

const router = express.Router();

// Multer Config for Offer Images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "offer_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// --- Buyer Routes ---
router.post("/post-request", buyerProtect, placeBidRequest);
router.get("/my-accepted-offers", buyerProtect, getMyAcceptedOffers); // ✅ Resolves 404
router.post("/respond-offer", buyerProtect, handleOfferResponse);

// --- Seller Routes ---
router.get("/all", getAllOpenBids);
router.post("/create-offer", sellerProtect, upload.single("image"), createOffer);

export default router;