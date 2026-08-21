const express =
    require("express");

const {
    getInventoryHistory,
    adjustStock,
} =
    require(
        "../controllers/inventoryController"
    );

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


const router =
    express.Router();


router.get(
    "/product/:productId",
    protect,
    admin,
    getInventoryHistory
);


router.post(
    "/adjust",
    protect,
    admin,
    adjustStock
);


module.exports = router;