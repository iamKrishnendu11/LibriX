import jwt from "jsonwebtoken";

export const generateSellerAccessToken = (id) => {
  return jwt.sign(
    { id, role: "seller" },
    process.env.SELLER_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.SELLER_ACCESS_TOKEN_EXPIRE }
  );
};

export const generateSellerRefreshToken = (id) => {
  return jwt.sign(
    { id, role: "seller" },
    process.env.SELLER_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.SELLER_REFRESH_TOKEN_EXPIRE }
  );
};

export const generateBuyerAccessToken = (id) => {
  return jwt.sign(
    { id, role: "buyer" },
    process.env.BUYER_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.BUYER_ACCESS_TOKEN_EXPIRE }
  );
};

export const generateBuyerRefreshToken = (id) => {
  return jwt.sign(
    { id, role: "buyer" },
    process.env.BUYER_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.BUYER_REFRESH_TOKEN_EXPIRE }
  );
};