const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrderByNumber,
    getOrders,
    updateOrderStatus,
    getDashboardStats,
    getMyOrders,
    getMyOrderByNumber,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");




router.get(
    "/",
    getOrders
);

router.get(
    "/dashboard",
    getDashboardStats
);

router.patch(
    "/:orderNumber/status",
    updateOrderStatus
);

router.get(
    "/my-orders",
    protect,
    getMyOrders
);

router.post("/", protect, createOrder);
router.get(
    "/my-orders/:orderNumber",
    protect,
    getMyOrderByNumber
);

router.get(
    
    "/:orderNumber",
    getOrderByNumber
);

module.exports = router;