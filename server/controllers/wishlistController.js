
const asyncHandler =
    require("../middleware/asyncHandler");


const {
    successResponse,
} =
    require("../utils/apiResponse");


const getWishlist =
    require(
        "../services/wishlist/getWishlist"
    );


const addToWishlist =
    require(
        "../services/wishlist/addToWishlist"
    );


const removeFromWishlist =
    require(
        "../services/wishlist/removeFromWishlist"
    );


const getCustomerWishlist =
    asyncHandler(
        async (req, res) => {

            const wishlist =
                await getWishlist(
                    req.user._id
                );


            return successResponse(

                res,

                wishlist,

                "Wishlist retrieved successfully"

            );

        }
    );


const addCustomerWishlist =
    asyncHandler(
        async (req, res) => {

            const result =
                await addToWishlist({

                    userId:
                        req.user._id,

                    productId:
                        req.params.productId,

                });


            return successResponse(

                res,

                result,

                result.added
                    ? "Product added to wishlist"
                    : "Product is already in wishlist",

                result.added
                    ? 201
                    : 200

            );

        }
    );


const removeCustomerWishlist =
    asyncHandler(
        async (req, res) => {

            const result =
                await removeFromWishlist({

                    userId:
                        req.user._id,

                    productId:
                        req.params.productId,

                });


            return successResponse(

                res,

                result,

                result.removed
                    ? "Product removed from wishlist"
                    : "Product was not in wishlist"

            );

        }
    );


module.exports = {

    getCustomerWishlist,

    addCustomerWishlist,

    removeCustomerWishlist,

};
