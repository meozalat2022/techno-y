const calculateTotals = ({
    orderItems,
    discount = 0,
}) => {

    const subtotal =
        orderItems.reduce(
            (
                sum,
                item
            ) =>
                sum +
                (
                    item.pricing
                        .finalPrice *
                    item.quantity
                ),
            0
        );


    const shipping =
        0;


    const safeDiscount =
        Math.min(
            Math.max(
                Number(
                    discount
                ) || 0,
                0
            ),
            subtotal
        );


    const total =
        Math.max(
            subtotal +
                shipping -
                safeDiscount,
            0
        );


    return {

        subtotal,

        shipping,

        discount:
            safeDiscount,

        total,

    };

};


module.exports =
    calculateTotals;
