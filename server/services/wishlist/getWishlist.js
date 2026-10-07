
const User =
    require("../../models/User");


const getWishlist =
    async userId => {

        const user =
            await User.findById(
                userId
            )
                .populate({
                    path:
                        "wishlist",

                    match: {
                        isActive:
                            true,
                    },

                    populate: [
                        {
                            path:
                                "category",

                            select:
                                "name",
                        },

                        {
                            path:
                                "brand",

                            select:
                                "name",
                        },
                    ],
                })
                .select(
                    "wishlist"
                )
                .lean();


        if (!user) {

            throw new Error(
                "User not found."
            );
        }


        return user.wishlist || [];
    };


module.exports =
    getWishlist;
