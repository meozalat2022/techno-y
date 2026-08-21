const MESSAGES =
    require("../../constants/messages");


const validatePurchase = ({
    supplier,
    items,
}) => {

    if (!supplier) {

        throw new Error(
            MESSAGES.PURCHASE.SUPPLIER_REQUIRED
        );

    }


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        throw new Error(
            MESSAGES.PURCHASE.ITEMS_REQUIRED
        );

    }


    const productIds =
        new Set();


    for (const item of items) {

        if (!item.product) {

            throw new Error(
                MESSAGES.PURCHASE.PRODUCT_REQUIRED
            );

        }


        const productId =
            item.product.toString();


        if (
            productIds.has(productId)
        ) {

            throw new Error(
                MESSAGES.PURCHASE.DUPLICATE_PRODUCT
            );

        }


        productIds.add(
            productId
        );


        if (
            !Number.isFinite(
                item.quantity
            ) ||
            item.quantity <= 0
        ) {

            throw new Error(
                MESSAGES.PURCHASE.QUANTITY_INVALID
            );

        }


        if (
            !Number.isFinite(
                item.unitCost
            ) ||
            item.unitCost < 0
        ) {

            throw new Error(
                MESSAGES.PURCHASE.UNIT_COST_INVALID
            );

        }

    }

};


module.exports = validatePurchase;