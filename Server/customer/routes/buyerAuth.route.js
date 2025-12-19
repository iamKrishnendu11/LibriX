import express from "express";
import {
  registerBuyer,
  loginBuyer,
  getBuyerProfile,
  updateBuyerProfile,
  refreshBuyerToken,
  logoutBuyer
} from "../controllers/buyerAuth.controller.js";

import { buyerProtect } from "../middlewares/buyerAuth.middleware.js";

const router = express.Router();

/* AUTH */
router.post("/register", registerBuyer);
router.post("/login", loginBuyer);
router.post("/refresh-token", refreshBuyerToken);
router.post("/logout", buyerProtect, logoutBuyer);

/* PROFILE */
router.get("/me", buyerProtect, getBuyerProfile);
router.put("/me", buyerProtect, updateBuyerProfile);

export default router;
