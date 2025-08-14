import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized(No token)" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(tokenDecode.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized (User not found or invalid token payload)",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized (Token expired)" });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized (Invalid token)" });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};

export default authUser;
