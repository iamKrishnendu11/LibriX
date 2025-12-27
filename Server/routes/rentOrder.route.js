import express from "express";
import { 
  placeRentOrder, 
  getLenderNotifications, 
  getLenderOrders,
  getLenderAnalytics
} from "../controllers/rentOrder.controller.js";
import { buyerProtect } from "../middlewares/buyerAuth.middleware.js";
import { lenderProtect } from "../middlewares/lenderAuth.middleware.js";

const router = express.Router();

router.post("/rent", buyerProtect, placeRentOrder);

// ✅ NEW ROUTE: Fetch all books currently being lent by this user
router.get("/lender/orders", lenderProtect, getLenderOrders);

router.get("/lender/notifications", lenderProtect, getLenderNotifications);
// routes/rentOrder.route.js
router.get("/lender/analytics", lenderProtect, getLenderAnalytics);

export default router;