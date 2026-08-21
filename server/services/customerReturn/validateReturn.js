const ORDER_STATUS =
    require(
        "../../constants/orderStatus"
    );


const validateReturn = ({
    order,
    items,
    reason,
}) => {

    if (
        order.status !==
        ORDER_STATUS.DELIVERED
    ) {

        throw new Error(
            "Only delivered orders can be returned."
        );

    }


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        throw new Error(
            "Return must contain at least one item."
        );

    }


    if (
        typeof reason !==
            "string" ||
        !reason.trim()
    ) {

        throw new Error(
            "Return reason is required."
        );

    }


    const orderItemMap =
        new Map(
            order.items.map(item => [
                item.product.toString(),
                item,
            ])
        );


    const returnProductIds =
        new Set();


    for (const item of items) {

        if (!item.product) {

            throw new Error(
                "Product is required."
            );

        }


        const productId =
            item.product.toString();


        if (
            returnProductIds.has(
                productId
            )
        ) {

            throw new Error(
                "A product can only appear once in a return request."
            );

        }


        returnProductIds.add(
            productId
        );


        const orderItem =
            orderItemMap.get(
                productId
            );


        if (!orderItem) {

            throw new Error(
                "Product does not belong to this order."
            );

        }


        if (
            !Number.isFinite(
                item.quantity
            ) ||
            item.quantity <= 0
        ) {

            throw new Error(
                "Return quantity must be greater than zero."
            );

        }


        const returnedQuantity =
            orderItem.returnedQuantity ||
            0;


        const remainingReturnable =
            orderItem.quantity -
            returnedQuantity;


        if (
            item.quantity >
            remainingReturnable
        ) {

            throw new Error(
                `Cannot return more than the remaining returnable quantity for ${orderItem.title}.`
            );

        }

    }

};


module.exports = validateReturn;