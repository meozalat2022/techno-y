const ROLES = require("../constants/roles");
const MESSAGES = require("../constants/messages");

const admin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return next();
  }

  return res.status(403).json({
    message: MESSAGES.AUTH.ADMIN_ACCESS_REQUIRED,
  });
};

module.exports = admin;