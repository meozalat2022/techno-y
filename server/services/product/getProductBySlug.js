const Product =
    require("../../models/Product");

const MESSAGES =
    require("../../constants/messages");


const getProductBySlug = async (
    slug
) => {

    const product =
        await Product.findOne({

            slug,

            isActive: true,

        })
            .populate(
                "category",
                "name"
            )
            .populate(
                "brand",
                "name"
            );


    if (!product) {

        throw new Error(
            MESSAGES.PRODUCT.NOT_FOUND
        );

    }


    return product;

};


module.exports = getProductBySlug;