const Order = require("../../models/Order");

const getOrderByNumber = async (orderNumber) => {

    const order = await Order.findOne({
        orderNumber,
    });

    if (!order) {
        throw new Error("Order not found.");
    }

    return order;

};

module.exports = getOrderByNumber;