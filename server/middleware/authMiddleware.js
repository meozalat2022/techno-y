const jwt = require("jsonwebtoken");
const User = require("../models/User");
const MESSAGES = require("../constants/messages");

const protect = async (
  req,
  res,
  next
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: MESSAGES.AUTH.NOT_AUTHORIZED,
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await User.findById(
      decoded.userId
    ).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      message: MESSAGES.AUTH.INVALID_TOKEN,
    });
  }
};

module.exports = {
  protect,
};