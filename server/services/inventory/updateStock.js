const Product = require("../../models/Product");
const STOCK_OPERATIONS =
    require("../../constants/stockOperations");

const updateStock = async ({
    productId,
    quantity,
    operation,
    session,
}) => {

    const product =
        await Product.findById(productId)
            .session(session);

    if (!product) {
        throw new Error(
            MESSAGES.PRODUCT.NOT_FOUND
        );
    }

    const previousStock =
        product.stockQuantity;

    let newStock;

    if (operation === STOCK_OPERATIONS.INCREASE) {

        newStock =
            previousStock + quantity;

    } else if (operation === STOCK_OPERATIONS.DECREASE) {

        if (previousStock < quantity) {
            throw new Error(
                MESSAGES.STOCK.INSUFFICIENT
            );
        }

        newStock =
            previousStock - quantity;

    } else {

        throw new Error(
            MESSAGES.STOCK.INVALID_OPERATION
        );

    }

    product.stockQuantity =
        newStock;

    await product.save({
        session,
    });

    return {

        productId: product._id,
        previousStock,
        newStock,

    };

};

module.exports = updateStock;