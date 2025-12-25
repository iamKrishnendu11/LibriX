import express from "express";
import { placeOrder, handleOrderAction } from "../controllers/order.controller.js";
import { buyerProtect } from "../../customer/middlewares/buyerAuth.middleware.js";
import { sellerProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/buy", buyerProtect, placeOrder);
router.post("/seller-action", sellerProtect, handleOrderAction);

export default router;