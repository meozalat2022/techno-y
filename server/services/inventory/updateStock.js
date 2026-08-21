const Product =
    require("../../models/Product");

const STOCK_OPERATIONS =
    require("../../constants/stockOperations");

const STOCK_STATUS =
    require("../../constants/stockStatus");

const MESSAGES =
    require("../../constants/messages");


const updateStock = async ({
    productId,
    quantity,
    operation,
    session,
}) => {

    const product =
        await Product.findById(
            productId
        ).session(session);


    if (!product) {

        throw new Error(
            MESSAGES.PRODUCT.NOT_FOUND
        );

    }


    const previousStock =
        product.stockQuantity;

    let newStock;


    if (
        operation ===
        STOCK_OPERATIONS.INCREASE
    ) {

        newStock =
            previousStock +
            quantity;

    } else if (
        operation ===
        STOCK_OPERATIONS.DECREASE
    ) {

        if (
            previousStock <
            quantity
        ) {

            throw new Error(
                MESSAGES.STOCK.INSUFFICIENT
            );

        }

        newStock =
            previousStock -
            quantity;

    } else {

        throw new Error(
            MESSAGES.STOCK
                .INVALID_OPERATION
        );

    }


    product.stockQuantity =
        newStock;


    product.stockStatus =
        newStock > 0
            ? STOCK_STATUS.IN_STOCK
            : STOCK_STATUS.OUT_OF_STOCK;


    await product.save({
        session,
    });


    return {

        productId:
            product._id,

        previousStock,

        newStock,

    };

};


module.exports = updateStock;