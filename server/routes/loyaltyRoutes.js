const express =
    require("express");

const {
    protect,
} =
    require(
        "../middleware/authMiddleware"
    );

const {
    getMyLoyalty,
    getMyTransactions,
    getRules,
} =
    require(
        "../controllers/loyaltyController"
    );


const router =
    express.Router();


router.get(
    "/rules",
    getRules
);


router.get(
    "/me",
    protect,
    getMyLoyalty
);


router.get(
    "/me/transactions",
    protect,
    getMyTransactions
);


module.exports =
    router;
