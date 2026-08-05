const calculateTotals = (orderItems) => {

    const subtotal = orderItems.reduce(

        (sum, item) =>
            sum + (item.pricing.finalPrice * item.quantity),

        0

    );

    const shippingCost = 0;

    const discount = 0;

    const total =
        subtotal +
        shippingCost -
        discount;

    return {

        subtotal,

        shippingCost,

        discount,

        total,

    };

};

module.exports = calculateTotals;