const Product =
    require("../../models/Product");

const MESSAGES =
    require("../../constants/messages");


const findProducts = async (productIds) => {

    const uniqueProductIds =
        [
            ...new Set(
                productIds.map(
                    productId =>
                        productId.toString()
                )
            ),
        ];


    const products =
        await Product.find({

            _id: {
                $in: uniqueProductIds,
            },

            isActive: true,

        })
            .populate(
                "brand",
                "name"
            )
            .populate(
                "category",
                "name"
            );


    if (
        products.length !==
        uniqueProductIds.length
    ) {

        throw new Error(
            MESSAGES.PRODUCT
                .ONE_OR_MORE_NOT_FOUND
        );

    }


    return products;

};


module.exports = findProducts;