const ORDER_STATUS_FLOW = {

    pending: [
        "confirmed",
        "cancelled",
    ],

    confirmed: [
        "packed",
        "cancelled",
    ],

    packed: [
        "shipped",
        "cancelled",
    ],

    shipped: [
        "delivered",
    ],

    delivered: [],

    cancelled: [],

};

module.exports = ORDER_STATUS_FLOW;