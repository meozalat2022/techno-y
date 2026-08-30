const Order = require("../../models/Order");

const saveOrder = async ({
    orderNumber,
    customer,
    shippingAddress,
    payment,
    orderItems,
    totals,
    loyalty,
    user,
    session,
}) => {



   const [order ]= await Order.create(
    [{
        orderNumber,


        customer: {
    user: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
},

        shippingAddress,

        payment,

        shipping: {
            company: "",
            method: "Standard",
            cost: 0,
            trackingNumber: "",
        },

        items: orderItems,

        totals,

        loyalty,
    }],
    {
        session,
    }
);

return order;

};

module.exports = saveOrder;