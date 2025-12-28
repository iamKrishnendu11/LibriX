import express from "express";
import { 
  placeOrder, 
  handleOrderAction, 
  getBuyerNotifications,
  getSellerNotifications,
  getMyOrders,
  getSellerOrders, // ✅ ADD THIS IMPORT
} from "../controllers/order.controller.js";
import { buyerProtect } from "../middlewares/buyerAuth.middleware.js";
import { sellerProtect } from "../middlewares/sellerAuth.middleware.js";

const router = express.Router();

router.post("/buy", buyerProtect, placeOrder);
router.post("/seller-action", sellerProtect, handleOrderAction);

// ✅ NEW ROUTE: Fetch all purchase and rental orders for the buyer
router.get("/my-orders", buyerProtect, getMyOrders);
router.get("/seller/all-orders", sellerProtect, getSellerOrders);

// ✅ EXISTING ROUTES: Notifications
router.get("/seller/notifications", sellerProtect, getSellerNotifications);
router.get("/buyer/notifications", buyerProtect, getBuyerNotifications);

export default router;