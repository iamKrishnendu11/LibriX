import jwt from "jsonwebtoken";

export const sellerProtect = (req, res, next) => {
  console.log("SELLER SECRET:", process.env.SELLER_ACCESS_TOKEN_SECRET);

  const auth = req.headers.authorization;
  console.log("AUTH HEADER:", auth);

  if (!auth || !auth.startsWith("Bearer ")) {
    console.log("❌ Seller token missing or bad format");
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.SELLER_ACCESS_TOKEN_SECRET
    );

    console.log("DECODED SELLER:", decoded);

    if (decoded.role !== "seller") {
      console.log("❌ Role mismatch:", decoded.role);
      return res.status(403).json({ message: "Forbidden - Not seller" });
    }

    // ✅ Normalize seller ID
    req.sellerId = decoded.id || decoded._id || decoded.userId;

    console.log("🧩 sellerId set to:", req.sellerId);

    if (!req.sellerId) {
      console.log("❌ sellerId still undefined after decode");
      return res.status(401).json({ message: "Invalid seller token payload" });
    }

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    res.status(401).json({ message: "Token expired or invalid" });
  }
};
