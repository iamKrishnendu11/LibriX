import jwt from "jsonwebtoken";

export const buyerProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.BUYER_ACCESS_TOKEN_SECRET
    );

    if (decoded.role !== "buyer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.buyerId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};
