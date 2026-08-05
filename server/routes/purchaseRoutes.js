const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

const {
    createPurchase,
    submitPurchase,
    receivePurchase,
} = require("../controllers/purchaseController");

router.post(
    "/",
    protect,
    admin,
    createPurchase
);

router.post(
    "/:id/submit",
    protect,
    admin,
    submitPurchase
);
router.post(
    "/:id/receive",
    protect,
    admin,
    receivePurchase
);

module.exports = router;