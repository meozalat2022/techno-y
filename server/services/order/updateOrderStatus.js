const Order = require("../../models/Order");
const MESSAGES = require("../../constants/messages");
const ORDER_STATUS_FLOW =
    require("../../constants/orderStatusFlow");

const updateOrderStatus = async (
    orderNumber,
    status
) => {

    const order = await Order.findOne({
        orderNumber,
    });

    if (!order) {
        throw new Error(
            MESSAGES.ORDER.NOT_FOUND
        );
    }

    const newStatus = status.toLowerCase();

    const allowedStatuses =
        ORDER_STATUS_FLOW[order.status];

    if (!allowedStatuses.includes(newStatus)) {

        throw new Error(
            `Cannot change order status from '${order.status}' to '${newStatus}'.`
        );

    }

    order.status = newStatus;
    await order.save();

    return order;

};

module.exports = updateOrderStatus;