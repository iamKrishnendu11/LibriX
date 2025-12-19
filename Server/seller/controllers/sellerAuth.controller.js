import Seller from "../models/seller.model.js";
import jwt from "jsonwebtoken";
import {
  generateSellerAccessToken,
  generateSellerRefreshToken,
} from "../../utils/token.js";

/* REGISTER */
export const registerSeller = async (req, res) => {
  const sellerExists = await Seller.findOne({
    $or: [{ phone: req.body.phone }, { email: req.body.email }]
  });

  if (sellerExists)
    return res.status(400).json({ message: "Seller already exists" });

  const seller = await Seller.create(req.body);

  const accessToken = generateSellerAccessToken(seller._id);
  const refreshToken = generateSellerRefreshToken(seller._id);

  seller.refreshToken = refreshToken;
  await seller.save();

  res.status(201).json({ accessToken, refreshToken });
};

/* LOGIN */
export const loginSeller = async (req, res) => {
  const { phone, password } = req.body;

  const seller = await Seller.findOne({ phone }).select("+password");
  if (!seller) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await seller.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateSellerAccessToken(seller._id);
  const refreshToken = generateSellerRefreshToken(seller._id);

  seller.refreshToken = refreshToken;
  await seller.save();

  res.json({ accessToken, refreshToken });
};

/* REFRESH TOKEN */
export const refreshSellerToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const seller = await Seller.findOne({ refreshToken });
  if (!seller) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.SELLER_REFRESH_TOKEN_SECRET,
    (err) => {
      if (err) return res.sendStatus(403);

      const newAccessToken = generateSellerAccessToken(seller._id);
      res.json({ accessToken: newAccessToken });
    }
  );
};

/* LOGOUT */
export const logoutSeller = async (req, res) => {
  await Seller.findByIdAndUpdate(req.sellerId, { refreshToken: null });
  res.json({ message: "Logged out successfully" });
};

/* GET SELLER PROFILE */
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select(
      "-password -refreshToken"
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE SELLER PROFILE */
export const updateSellerProfile = async (req, res) => {
  try {
    const updates = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.sellerId,
      updates,
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({
      message: "Profile updated successfully",
      seller
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
