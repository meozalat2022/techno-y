const Order =
    require("../../models/Order");

const PAYMENT_METHODS =
    require("../../constants/paymentMethods");

const PAYMENT_STATUS =
    require("../../constants/paymentStatus");

const closeCashierPayment =
    require("./opay/closeCashierPayment");

const queryPaymentStatus =
    require("./opay/queryPaymentStatus");

const reconcileOpayPayment =
    require("./reconcileOpayPayment");


const normalizeStatus =
    value =>
        String(
            value || ""
        )
            .trim()
            .toUpperCase();


const buildResult = ({
    order,
    reference,
    closeStatus,
    paymentData,
}) => ({

    orderNumber:
        order.orderNumber,

    reference,

    providerOrderNo:
        order.payment
            .providerOrderNo,

    closeStatus:
        normalizeStatus(
            closeStatus
        ),

    providerStatus:
        order.payment
            .providerStatus,

    paymentStatus:
        order.payment
            .status,

    orderStatus:
        order.status,

    inventoryRestored:
        Boolean(
            order.payment
                .inventoryRestored
        ),

    amount:
        paymentData?.amount,

});


const closeOpayPayment = async ({
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
            "This order has already been paid and cannot be cancelled."
        );

    }


    const reference =
        order.payment.reference ||
        order.orderNumber;


    /*
     * Verify with OPay BEFORE closing.
     * This protects a payment that actually succeeded
     * but whose callback was delayed.
     */
    const currentPaymentData =
        await queryPaymentStatus({
            reference,
        });


    const currentStatus =
        normalizeStatus(
            currentPaymentData.status
        );


    if (
        currentStatus ===
        "SUCCESS"
    ) {

        await reconcileOpayPayment({

            order,

            paymentData:
                currentPaymentData,

        });


        throw new Error(
            "Payment has already been completed and the order cannot be cancelled."
        );

    }


    if (
        [
            "FAIL",
            "CLOSE",
        ].includes(
            currentStatus
        )
    ) {

        const result =
            await reconcileOpayPayment({

                order,

                paymentData:
                    currentPaymentData,

            });


        return buildResult({

            order:
                result.order,

            reference,

            closeStatus:
                currentStatus,

            paymentData:
                currentPaymentData,

        });

    }


    const closeData =
        await closeCashierPayment({
            reference,
        });


    const verifiedPaymentData =
        await queryPaymentStatus({
            reference,
        });


    const result =
        await reconcileOpayPayment({

            order,

            paymentData:
                verifiedPaymentData,

        });


    return buildResult({

        order:
            result.order,

        reference,

        closeStatus:
            closeData.orderStatus ||
            closeData.status,

        paymentData:
            verifiedPaymentData,

    });

};


module.exports =
    closeOpayPayment;
