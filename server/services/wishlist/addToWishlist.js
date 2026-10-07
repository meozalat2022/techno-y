
const mongoose =
    require("mongoose");


const User =
    require("../../models/User");


const Product =
    require("../../models/Product");


const addToWishlist =
    async ({
        userId,
        productId,
    }) => {

        // --------------------------------------------------
        // 1. Validate Product ID
        // --------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                productId
            )
        ) {

            throw new Error(
                "Invalid product ID."
            );
        }


        // --------------------------------------------------
        // 2. Verify product exists and is active
        // --------------------------------------------------

        const product =
            await Product.findOne({

                _id:
                    productId,

                isActive:
                    true,

            })
                .select(
                    "_id"
                )
                .lean();


        if (!product) {

            throw new Error(
                "Product not found."
            );
        }


        // --------------------------------------------------
        // 3. Add product only if it isn't already there
        // --------------------------------------------------

        const result =
            await User.updateOne(

                {
                    _id:
                        userId,

                    wishlist: {
                        $ne:
                            productId,
                    },
                },

                {
                    $push: {
                        wishlist:
                            productId,
                    },
                }

            );


        // --------------------------------------------------
        // 4. Return current wishlist state
        // --------------------------------------------------

        const user =
            await User.findById(
                userId
            )
                .select(
                    "wishlist"
                )
                .lean();


        if (!user) {

            throw new Error(
                "User not found."
            );
        }


        return {

            added:
                result.modifiedCount > 0,

            wishlist:
                user.wishlist || [],

        };
    };


module.exports =
    addToWishlist;
