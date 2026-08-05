const Order = require("../../models/Order");

const getMyOrderByNumber = async (
    user,
    orderNumber
) => {

    const order = await Order.findOne({
        orderNumber,
    });

    if (!order) {
        throw new Error("Order not found.");
    }

    // Admin can view any order
    if (user.role === "admin") {
        return order;
    }

    // Customer can only view their own order
    if (
        order.customer.user?.toString() !==
        user._id.toString()
    ) {
        throw new Error(
            "You are not authorized to view this order."
        );
    }

    return order;

};

module.exports = getMyOrderByNumber;