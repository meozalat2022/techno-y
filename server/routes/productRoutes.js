const express =
    require("express");

const router =
    express.Router();

const {
    createProduct,
    getProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct,
} =
    require("../controllers/productController");

const {
    protect,
} =
    require("../middleware/authMiddleware");

const admin =
    require("../middleware/adminMiddleware");

const {
    createProductValidation,
    updateProductValidation,
} =
    require("../validations/productValidation");

const validate =
    require("../middleware/validateMiddleware");


router.get(
    "/",
    getProducts
);


router.get(
    "/:slug",
    getProductBySlug
);


router.post(
    "/",
    protect,
    admin,
    createProductValidation,
    validate,
    createProduct
);


router.put(
    "/:id",
    protect,
    admin,
    updateProductValidation,
    validate,
    updateProduct
);


router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);


module.exports = router;