
const mongoose =
    require("mongoose");


const User =
    require("../../models/User");


const removeFromWishlist =
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
        // 2. Remove product
        // --------------------------------------------------

        const result =
            await User.updateOne(

                {
                    _id:
                        userId,
                },

                {
                    $pull: {
                        wishlist:
                            productId,
                    },
                }

            );


        // --------------------------------------------------
        // 3. Verify user exists
        // --------------------------------------------------

        if (
            result.matchedCount ===
            0
        ) {

            throw new Error(
                "User not found."
            );
        }


        // --------------------------------------------------
        // 4. Return current wishlist
        // --------------------------------------------------

        const user =
            await User.findById(
                userId
            )
                .select(
                    "wishlist"
                )
                .lean();


        return {

            removed:
                result.modifiedCount > 0,

            wishlist:
                user?.wishlist || [],

        };
    };


module.exports =
    removeFromWishlist;
