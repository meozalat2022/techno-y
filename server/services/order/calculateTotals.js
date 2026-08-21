const calculateTotals = ({
    orderItems,
}) => {

    const subtotal =
        orderItems.reduce(
            (sum, item) =>
                sum +
                (
                    item.pricing.finalPrice *
                    item.quantity
                ),
            0
        );

    const shipping = 0;

    const discount = 0;

    const total =
        subtotal +
        shipping -
        discount;

    return {

        subtotal,

        shipping,

        discount,

        total,

    };

};

module.exports = calculateTotals;