const express =
    require("express");

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
    createStoreSale,
    getStoreSales,
    getStoreSaleByNumber,
} =
    require(
        "../controllers/storeSaleController"
    );


const router =
    express.Router();


router.use(
    protect,
    admin
);


router.get(
    "/",
    getStoreSales
);


router.get(
    "/:saleNumber",
    getStoreSaleByNumber
);


router.post(
    "/",
    createStoreSale
);


module.exports =
    router;
