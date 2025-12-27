import express from "express";
import { placeRentOrder, getLenderNotifications } from "../controllers/rentOrder.controller.js";
import { buyerProtect } from "../middlewares/buyerAuth.middleware.js";
import { lenderProtect } from "../middlewares/lenderAuth.middleware.js";

const router = express.Router();

router.post("/rent", buyerProtect, placeRentOrder);
router.get("/lender/notifications", lenderProtect, getLenderNotifications);

export default router;