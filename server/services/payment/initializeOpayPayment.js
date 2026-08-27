const Order =
    require("../../models/Order");

const PAYMENT_METHODS =
    require("../../constants/paymentMethods");

const PAYMENT_STATUS =
    require("../../constants/paymentStatus");

const createCashierPayment =
    require("./opay/createCashierPayment");


const initializeOpayPayment = async ({
    orderNumber,
    user,
}) => {

    const order =
        await Order.findOne({

            orderNumber,

            "customer.user":
                user._id,

        });


    if (!order) {

        throw new Error(
            "Order not found."
        );

    }


    if (
        order.payment.method !==
        PAYMENT_METHODS.OPAY
    ) {

        throw new Error(
            "This order is not configured for OPay payment."
        );

    }


    if (
        order.payment.status ===
        PAYMENT_STATUS.PAID
    ) {

        throw new Error(
            "This order has already been paid."
        );

    }


    if (
        order.payment.cashierUrl &&
        [
            "INITIAL",
            "PENDING",
        ].includes(
            order.payment.providerStatus
        )
    ) {

        return {

            orderNumber:
                order.orderNumber,

            reference:
                order.payment.reference,

            providerOrderNo:
                order.payment.providerOrderNo,

            cashierUrl:
                order.payment.cashierUrl,

            providerStatus:
                order.payment.providerStatus,

        };

    }


    const paymentData =
        await createCashierPayment({
            order,
        });


    order.payment.provider =
        "opay";

    order.payment.reference =
        paymentData.reference ||
        order.orderNumber;

    order.payment.providerOrderNo =
        paymentData.orderNo ||
        "";

    order.payment.cashierUrl =
        paymentData.cashierUrl ||
        "";

    order.payment.providerStatus =
        paymentData.status ||
        "INITIAL";


    await order.save();


    return {

        orderNumber:
            order.orderNumber,

        reference:
            order.payment.reference,

        providerOrderNo:
            order.payment.providerOrderNo,

        cashierUrl:
            order.payment.cashierUrl,

        providerStatus:
            order.payment.providerStatus,

        amount:
            paymentData.amount,

    };

};


module.exports =
    initializeOpayPayment;
