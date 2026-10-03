const express = require("express");
const router = express.Router();

const {
    validatePromoCode,
    getAdminPromotions,
    createPromotion,
    updatePromotion,
    deactivatePromotion,
} = require("../controllers/promotionController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/validate", protect, validatePromoCode);

router.get("/admin/all", protect, admin, getAdminPromotions);
router.post("/", protect, admin, createPromotion);
router.put("/:id", protect, admin, updatePromotion);
router.delete("/:id", protect, admin, deactivatePromotion);

module.exports = router;
