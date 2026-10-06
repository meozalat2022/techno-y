const express =
    require("express");

const router =
    express.Router();

const {
    protect,
} = require(
    "../middleware/authMiddleware"
);

const admin =
    require(
        "../middleware/adminMiddleware"
    );

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} = require(
    "../controllers/notificationController"
);


router.get(
    "/",
    protect,
    admin,
    getNotifications
);


router.get(
    "/unread-count",
    protect,
    admin,
    getUnreadCount
);


router.patch(
    "/read-all",
    protect,
    admin,
    markAllAsRead
);


router.patch(
    "/:id/read",
    protect,
    admin,
    markAsRead
);


module.exports = router;
