const mongoose =
    require("mongoose");


const validateStoreSale = ({
    items,
    clientRequestId,
}) => {

    const requestId =
        String(
            clientRequestId ||
            ""
        ).trim();


    if (
        requestId.length <
            8 ||
        requestId.length >
            120
    ) {

        throw new Error(
            "clientRequestId is required and must be between 8 and 120 characters."
        );

    }


    if (
        !Array.isArray(
            items
        ) ||
        items.length ===
            0
    ) {

        throw new Error(
            "Store sale must contain at least one item."
        );

    }


    const productIds =
        new Set();


    for (
        const item
        of items
    ) {

        if (
            !item?.product ||
            !mongoose.Types
                .ObjectId
                .isValid(
                    item.product
                )
        ) {

            throw new Error(
                "Each store sale item must contain a valid product ID."
            );

        }


        const productId =
            item.product
                .toString();


        if (
            productIds.has(
                productId
            )
        ) {

            throw new Error(
                "The same product cannot appear more than once in a store sale."
            );

        }


        productIds.add(
            productId
        );


        const quantity =
            Number(
                item.quantity
            );


        if (
            !Number.isInteger(
                quantity
            ) ||
            quantity <=
                0
        ) {

            throw new Error(
                "Store sale quantity must be a whole number greater than zero."
            );

        }

    }


    return {
        clientRequestId:
            requestId,
    };

};


module.exports =
    validateStoreSale;
