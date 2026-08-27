const express =
    require("express");

const router =
    express.Router();

const {
    createOpayPayment,
    getOpayPaymentStatus,
    closeOpayPayment,
    receiveOpayCallback,
} =
    require(
        "../controllers/paymentController"
    );

const {
    protect,
} =
    require(
        "../middleware/authMiddleware"
    );


router.post(
    "/opay/callback",
    receiveOpayCallback
);


router.post(
    "/opay/:orderNumber/create",
    protect,
    createOpayPayment
);


router.get(
    "/opay/:orderNumber/status",
    protect,
    getOpayPaymentStatus
);


router.post(
    "/opay/:orderNumber/close",
    protect,
    closeOpayPayment
);


module.exports =
    router;
