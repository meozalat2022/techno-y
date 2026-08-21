const express =
    require("express");

const router =
    express.Router();

const {
    protect,
} =
    require(
        "../middleware/authMiddleware"
    );

const admin =
    require(
        "../middleware/adminMiddleware"
    );

const {
    createCustomerReturn,
    receiveCustomerReturn,
    rejectCustomerReturn,
    getCustomerReturns,
    getCustomerReturnByNumber,
} =
    require(
        "../controllers/customerReturnController"
    );


router.post(
    "/",
    protect,
    createCustomerReturn
);


router.get(
    "/",
    protect,
    admin,
    getCustomerReturns
);


router.get(
    "/:returnNumber",
    protect,
    getCustomerReturnByNumber
);


router.post(
    "/:id/receive",
    protect,
    admin,
    receiveCustomerReturn
);


router.post(
    "/:id/reject",
    protect,
    admin,
    rejectCustomerReturn
);


module.exports =
    router;