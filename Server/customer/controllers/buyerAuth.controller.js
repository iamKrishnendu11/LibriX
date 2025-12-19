import Buyer from "../models/buyer.model.js";
import jwt from "jsonwebtoken";
import {
  generateBuyerAccessToken,
  generateBuyerRefreshToken
} from "../../utils/token.js";

/* REGISTER */
export const registerBuyer = async (req, res) => {
  const exists = await Buyer.findOne({
    $or: [{ phone: req.body.phone }, { email: req.body.email }]
  });

  if (exists)
    return res.status(400).json({ message: "Buyer already exists" });

  const buyer = await Buyer.create(req.body);

  const accessToken = generateBuyerAccessToken(buyer._id, "buyer");
  const refreshToken = generateBuyerRefreshToken(buyer._id, "buyer");

  buyer.refreshToken = refreshToken;
  await buyer.save();

  res.status(201).json({ accessToken, refreshToken });
};

/* LOGIN */
export const loginBuyer = async (req, res) => {
  const { phone, password } = req.body;

  const buyer = await Buyer.findOne({ phone }).select("+password");
  if (!buyer)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await buyer.comparePassword(password);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateBuyerAccessToken(buyer._id, "buyer");
  const refreshToken = generateBuyerRefreshToken(buyer._id, "buyer");

  buyer.refreshToken = refreshToken;
  await buyer.save();

  res.json({ accessToken, refreshToken });
};

/* GET PROFILE */
export const getBuyerProfile = async (req, res) => {
  const buyer = await Buyer.findById(req.buyerId).select(
    "-password -refreshToken"
  );

  if (!buyer)
    return res.status(404).json({ message: "Buyer not found" });

  res.json(buyer);
};

/* UPDATE PROFILE */
export const updateBuyerProfile = async (req, res) => {
  const buyer = await Buyer.findByIdAndUpdate(
    req.buyerId,
    req.body,
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  res.json({
    message: "Profile updated successfully",
    buyer
  });
};

/* REFRESH TOKEN */
export const refreshBuyerToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const buyer = await Buyer.findOne({ refreshToken });
  if (!buyer) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.BUYER_REFRESH_TOKEN_SECRET,
    (err) => {
      if (err) return res.sendStatus(403);

      const newAccessToken = generateBuyerAccessToken(buyer._id, "buyer");
      res.json({ accessToken: newAccessToken });
    }
  );
};

/* LOGOUT */
export const logoutBuyer = async (req, res) => {
  await Buyer.findByIdAndUpdate(req.buyerId, { refreshToken: null });
  res.json({ message: "Logged out successfully" });
};
