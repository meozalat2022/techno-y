const express = require("express");
const router = express.Router();

const {
    createCategory,
    getCategories,
    getAdminCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

const {
    protect,
} = require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

router.get(
    "/",
    getCategories
);

router.get(
    "/admin/all",
    protect,
    admin,
    getAdminCategories
);

router.get(
    "/:slug",
    getCategoryBySlug
);

router.post(
    "/",
    protect,
    admin,
    createCategory
);

router.put(
    "/:id",
    protect,
    admin,
    updateCategory
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteCategory
);

module.exports = router;
