const Product =
    require("../../models/Product");

const MESSAGES =
    require("../../constants/messages");


const setOnlineSafetyStock =
    async ({
        productId,
        onlineSafetyStock,
    }) => {

        const quantity =
            Number(
                onlineSafetyStock
            );


        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity <
                0
        ) {

            const error =
                new Error(
                    "Online safety stock must be a whole number zero or greater."
                );

            error.statusCode =
                400;

            throw error;

        }


        const product =
            await Product.findOne({

                _id:
                    productId,

                isActive:
                    true,

            });


        if (!product) {

            const error =
                new Error(
                    MESSAGES.PRODUCT
                        .NOT_FOUND
                );

            error.statusCode =
                404;

            throw error;

        }


        product.onlineSafetyStock =
            quantity;


        await product.save();


        await product.populate(
            "category",
            "name"
        );


        await product.populate(
            "brand",
            "name"
        );


        return product;

    };


module.exports =
    setOnlineSafetyStock;
