const ROLES = require("../constants/roles");

const admin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return next();
  }

  return res.status(403).json({
    message: "Admin access required",
  });
};

module.exports = admin;