const calculateTotals = (items) => {

    const subtotal =
        items.reduce(
            (sum, item) =>
                sum +
                (
                    item.quantity *
                    item.pricing.unitCost
                ),
            0
        );

    const discount = 0;

    const shipping = 0;

    const total =
        subtotal -
        discount +
        shipping;

    return {

        subtotal,

        discount,

        shipping,

        total,

    };

};

module.exports = calculateTotals;