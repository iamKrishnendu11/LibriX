import jwt from "jsonwebtoken";

export const lenderProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔴 Debug
  console.log("🔐 Lender Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Lender token missing or bad format");
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    // 🔴 Debug
    console.log("🔐 Lender Token:", token);

    const decoded = jwt.verify(
      token,
      process.env.LENDER_ACCESS_TOKEN_SECRET
    );

    // 🔴 Debug
    console.log("✅ Lender Token Decoded:", decoded);

    if (decoded.role !== "lender") {
      console.log("❌ Role mismatch:", decoded.role);
      return res.status(403).json({ message: "Forbidden - Not lender" });
    }

    // ✅ Normalize lender ID
    req.lenderId = decoded.id || decoded._id || decoded.userId;

    // 🔴 Debug
    console.log("🧩 lenderId set to:", req.lenderId);

    if (!req.lenderId) {
      console.log("❌ lenderId still undefined after decode");
      return res.status(401).json({ message: "Invalid lender token payload" });
    }

    next();
  } catch (err) {
    console.error("❌ Lender auth error:", err.message);
    res.status(401).json({ message: "Token expired or invalid" });
  }
};