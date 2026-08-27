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
    /*
     * Used by ONLINE orders only.
     * Store sales, purchases, returns and manual
     * adjustments continue to operate on physical stock.
     */
    minimumRemainingStock = 0,
    session,
}) => {

    const safeQuantity =
        Number(quantity);

    const safeMinimumRemainingStock =
        Math.max(
            Number(
                minimumRemainingStock
            ) || 0,
            0
        );


    if (
        !Number.isInteger(
            safeQuantity
        ) ||
        safeQuantity <=
            0
    ) {

        throw new Error(
            MESSAGES.VALIDATION
                .MUST_BE_GREATER_THAN_ZERO(
                    "Quantity"
                )
        );

    }


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
            safeQuantity;

    } else if (
        operation ===
        STOCK_OPERATIONS.DECREASE
    ) {

        const availableForThisOperation =
            Math.max(
                previousStock -
                    safeMinimumRemainingStock,
                0
            );


        if (
            availableForThisOperation <
            safeQuantity
        ) {

            throw new Error(
                MESSAGES.STOCK.INSUFFICIENT
            );

        }


        newStock =
            previousStock -
            safeQuantity;

    } else {

        throw new Error(
            MESSAGES.STOCK
                .INVALID_OPERATION
        );

    }


    product.stockQuantity =
        newStock;


    /*
     * stockStatus represents PHYSICAL stock.
     * Online availability is derived separately from
     * stockQuantity - onlineSafetyStock.
     */
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


module.exports =
    updateStock;
