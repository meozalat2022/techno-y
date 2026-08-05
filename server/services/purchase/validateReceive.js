const canReceivePurchase = require("./canReceivePurchase");

const validateReceive = (
    purchase,
    receivedItems
) => {

    if (!canReceivePurchase(purchase)) {
        throw new Error(
            `Purchase cannot receive inventory while its status is "${purchase.status}".`
        );
    }

    if (
        !Array.isArray(receivedItems) ||
        receivedItems.length === 0
    ) {
        throw new Error(
            "No received items were provided."
        );
    }

    const purchaseItemMap = new Map(
    purchase.items.map(item => [
        item.product.toString(),
        item,
    ])
);

for (const receivedItem of receivedItems) {

    const purchaseItem =
        purchaseItemMap.get(
            receivedItem.product.toString()
        );

    if (!purchaseItem) {
        throw new Error(
            "Product does not belong to this purchase."
        );
    }

    if (receivedItem.quantityReceived <= 0) {
        throw new Error(
            "Received quantity must be greater than zero."
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
            `Cannot receive more than the remaining quantity for ${purchaseItem.title}.`
        );
    }

}



};



module.exports = validateReceive;