const express = require("express");

const {
    getInventoryHistory, adjustStock
} = require("../controllers/inventoryController");
const { protect: authMiddleware } = require("../middleware/authMiddleware");


const router = express.Router();

router.get(
    "/product/:productId",
    getInventoryHistory
);

router.post(
    "/adjust",
    authMiddleware,
    adjustStock
);

module.exports = router;