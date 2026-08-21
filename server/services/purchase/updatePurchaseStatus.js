const PURCHASE_STATUS =
    require("../../constants/purchaseStatus");


const updatePurchaseStatus = (purchase) => {

    const allReceived =
        purchase.items.every(
            item =>
                item.receivedQuantity ===
                item.quantity
        );


    if (allReceived) {

        purchase.status =
            PURCHASE_STATUS.RECEIVED;

        if (!purchase.receivedAt) {
            purchase.receivedAt =
                new Date();
        }

        return;

    }


    const partiallyReceived =
        purchase.items.some(
            item =>
                item.receivedQuantity > 0
        );


    if (partiallyReceived) {

        purchase.status =
            PURCHASE_STATUS
                .PARTIALLY_RECEIVED;

        return;

    }


    purchase.status =
        PURCHASE_STATUS.ORDERED;

};


module.exports =
    updatePurchaseStatus;