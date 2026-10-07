
const express =
    require("express");


const router =
    express.Router();


const {
    getCustomerWishlist,

    addCustomerWishlist,

    removeCustomerWishlist,

} =
    require(
        "../controllers/wishlistController"
    );


const {
    protect,
} =
    require(
        "../middleware/authMiddleware"
    );


/*
 * All wishlist operations belong
 * to the currently authenticated customer.
 */

router.get(
    "/",
    protect,
    getCustomerWishlist
);


router.post(
    "/:productId",
    protect,
    addCustomerWishlist
);


router.delete(
    "/:productId",
    protect,
    removeCustomerWishlist
);


module.exports =
    router;
