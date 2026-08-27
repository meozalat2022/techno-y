const express =
    require("express");

const router =
    express.Router();

const {
    createBrand,
    getBrands,
    getAdminBrands,
    getBrandBySlug,
    updateBrand,
    deleteBrand,
} =
    require(
        "../controllers/brandController"
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


router.get(
    "/",
    getBrands
);


/*
 * Keep this route BEFORE /:slug,
 * otherwise "admin" would be treated
 * as a brand slug.
 */
router.get(
    "/admin/all",
    protect,
    admin,
    getAdminBrands
);


router.get(
    "/:slug",
    getBrandBySlug
);


router.post(
    "/",
    protect,
    admin,
    createBrand
);


router.put(
    "/:id",
    protect,
    admin,
    updateBrand
);


router.delete(
    "/:id",
    protect,
    admin,
    deleteBrand
);


module.exports =
    router;
