const Product =
    require("../../models/Product");

const MESSAGES =
    require("../../constants/messages");


const deleteProduct = async (
    productId
) => {

    const product =
        await Product.findOne({

            _id: productId,

            isActive: true,

        });


    if (!product) {

        throw new Error(
            MESSAGES.PRODUCT.NOT_FOUND
        );

    }


    product.isActive = false;

    await product.save();


    return product;

};


module.exports = deleteProduct;