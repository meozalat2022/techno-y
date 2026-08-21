const canReceivePurchase =
    require("./canReceivePurchase");

const MESSAGES =
    require("../../constants/messages");


const validateReceive = (
    purchase,
    receivedItems
) => {

    if (!canReceivePurchase(purchase)) {

        throw new Error(
            MESSAGES.PURCHASE.CANNOT_RECEIVE
        );

    }


    if (
        !Array.isArray(receivedItems) ||
        receivedItems.length === 0
    ) {

        throw new Error(
            MESSAGES.PURCHASE.NO_RECEIVED_ITEMS
        );

    }


    const purchaseItemMap =
        new Map(
            purchase.items.map(item => [
                item.product.toString(),
                item,
            ])
        );


    const receivedProductIds =
        new Set();


    for (const receivedItem of receivedItems) {

        if (!receivedItem.product) {

            throw new Error(
                MESSAGES.PURCHASE.PRODUCT_REQUIRED
            );

        }


        const productId =
            receivedItem.product.toString();


        if (
            receivedProductIds.has(
                productId
            )
        ) {

            throw new Error(
                MESSAGES.PURCHASE
                    .DUPLICATE_RECEIVED_PRODUCT
            );

        }


        receivedProductIds.add(
            productId
        );


        const purchaseItem =
            purchaseItemMap.get(
                productId
            );


        if (!purchaseItem) {

            throw new Error(
                MESSAGES.PURCHASE
                    .PRODUCT_NOT_IN_PURCHASE
            );

        }


        if (
            !Number.isFinite(
                receivedItem.quantityReceived
            ) ||
            receivedItem.quantityReceived <= 0
        ) {

            throw new Error(
                MESSAGES.PURCHASE
                    .RECEIVED_QUANTITY_INVALID
            );

        }


        const remainingQuantity =
            purchaseItem.quantity -
            purchaseItem.receivedQuantity;


        if (
            receivedItem.quantityReceived >
            remainingQuantity
        ) {

            throw new Error(
                MESSAGES.PURCHASE
                    .RECEIVED_QUANTITY_EXCEEDS_REMAINING
            );

        }

    }

};


module.exports = validateReceive;