const MESSAGES =
    require("../../constants/messages");


const validateSupplierReturn = ({
    purchase,
    items,
    reason,
}) => {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        throw new Error(
            MESSAGES.SUPPLIER_RETURN
                .ITEMS_REQUIRED
        );

    }


    if (
        typeof reason !==
            "string" ||
        !reason.trim()
    ) {

        throw new Error(
            MESSAGES.SUPPLIER_RETURN
                .REASON_REQUIRED
        );

    }


    const purchaseItemMap =
        new Map(
            purchase.items.map(item => [
                item.product.toString(),
                item,
            ])
        );


    const productIds =
        new Set();


    for (const item of items) {

        if (!item.product) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .PRODUCT_REQUIRED
            );

        }


        const productId =
            item.product.toString();


        if (
            productIds.has(
                productId
            )
        ) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .DUPLICATE_PRODUCT
            );

        }


        productIds.add(
            productId
        );


        const purchaseItem =
            purchaseItemMap.get(
                productId
            );


        if (!purchaseItem) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .PRODUCT_NOT_IN_PURCHASE
            );

        }


        if (
            !Number.isFinite(
                item.quantity
            ) ||
            item.quantity <= 0
        ) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .QUANTITY_INVALID
            );

        }


        const returnedQuantity =
            purchaseItem
                .returnedQuantity ||
            0;


        const remainingReturnable =
            purchaseItem
                .receivedQuantity -
            returnedQuantity;


        if (
            item.quantity >
            remainingReturnable
        ) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .EXCEEDS_RETURNABLE(
                        purchaseItem.title
                    )
            );

        }

    }

};


module.exports =
    validateSupplierReturn;