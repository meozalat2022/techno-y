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
    createSupplierReturn,
    sendSupplierReturn,
    rejectSupplierReturn,
    getSupplierReturns,
    getSupplierReturnByNumber,
} =
    require(
        "../controllers/supplierReturnController"
    );


router.use(
    protect,
    admin
);


router.post(
    "/",
    createSupplierReturn
);


router.get(
    "/",
    getSupplierReturns
);


router.get(
    "/:returnNumber",
    getSupplierReturnByNumber
);


router.post(
    "/:id/send",
    sendSupplierReturn
);


router.post(
    "/:id/reject",
    rejectSupplierReturn
);


module.exports =
    router;