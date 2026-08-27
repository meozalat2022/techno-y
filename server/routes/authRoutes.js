const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");

const {
    protect,
} = require("../middleware/authMiddleware");

const validate =
    require("../middleware/validateMiddleware");

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} = require("../validations/authValidation");

const {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
} = require("../middleware/rateLimiters");

router.post(
    "/register",
    registerLimiter,
    registerValidation,
    validate,
    registerUser
);

router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validate,
    loginUser
);

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    forgotPasswordValidation,
    validate,
    forgotPassword
);

router.post(
    "/reset-password",
    resetPasswordLimiter,
    resetPasswordValidation,
    validate,
    resetPassword
);

router.post(
    "/logout",
    logoutUser
);

router.get(
    "/me",
    protect,
    getCurrentUser
);

module.exports = router;
