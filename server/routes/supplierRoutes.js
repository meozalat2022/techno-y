const express = require("express");



const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    createSupplier,
    listSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplierController");

const router = express.Router();



router.post(
    "/",
    protect,
    adminMiddleware,
    createSupplier
);
router.get(
    "/",
    protect,
    adminMiddleware,
    listSuppliers
);
router.get(
    "/:id",
    protect,
    adminMiddleware,
    getSupplier
);
router.put(
    "/:id",
    protect,
    adminMiddleware,
    updateSupplier
);
router.delete(
    "/:id",
    protect,
    adminMiddleware,
    deleteSupplier
);
module.exports = router