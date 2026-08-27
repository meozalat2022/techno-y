const Order =
    require("../../models/Order");

const PAYMENT_METHODS =
    require("../../constants/paymentMethods");

const queryPaymentStatus =
    require("./opay/queryPaymentStatus");

const reconcileOpayPayment =
    require("./reconcileOpayPayment");


const getOpayPaymentStatus = async ({
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


    const reference =
        order.payment.reference ||
        order.orderNumber;


    const paymentData =
        await queryPaymentStatus({
            reference,
        });


    const result =
        await reconcileOpayPayment({

            order,

            paymentData,

        });


    return {

        orderNumber:
            order.orderNumber,

        reference:
            result.order.payment
                .reference,

        providerOrderNo:
            result.order.payment
                .providerOrderNo,

        providerStatus:
            result.order.payment
                .providerStatus,

        paymentStatus:
            result.order.payment
                .status,

        orderStatus:
            result.order.status,

        amount:
            paymentData.amount,

        failureCode:
            result.order.payment
                .failureCode,

        failureReason:
            result.order.payment
                .failureReason,

    };

};


module.exports =
    getOpayPaymentStatus;
