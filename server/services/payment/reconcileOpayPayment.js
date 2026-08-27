const PAYMENT_METHODS =
    require("../../constants/paymentMethods");

const PAYMENT_STATUS =
    require("../../constants/paymentStatus");

const ORDER_STATUS =
    require("../../constants/orderStatus");

const updateOrderStatus =
    require("../order/updateOrderStatus");


const toCentAmount =
    value =>
        Math.round(
            Number(value) * 100
        );


const normalizeProviderStatus =
    value =>
        String(
            value || ""
        )
            .trim()
            .toUpperCase();


const assertVerifiedPaymentMatchesOrder = ({
    order,
    paymentData,
}) => {

    const reference =
        String(
            paymentData.reference ||
            ""
        );


    if (
        reference !==
        order.orderNumber
    ) {

        throw new Error(
            "OPay payment reference does not match the Techno-Y order."
        );

    }


    const expectedAmount =
        toCentAmount(
            order.totals.total
        );


    const providerAmount =
        Number(
            paymentData.amount
                ?.total
        );


    if (
        !Number.isFinite(
            providerAmount
        ) ||
        providerAmount !==
            expectedAmount
    ) {

        throw new Error(
            "OPay payment amount does not match the Techno-Y order."
        );

    }


    if (
        String(
            paymentData.amount
                ?.currency ||
            ""
        ).toUpperCase() !==
        "EGP"
    ) {

        throw new Error(
            "OPay payment currency does not match the Techno-Y order."
        );

    }


    if (
        order.payment
            .providerOrderNo &&
        paymentData.orderNo &&
        String(
            order.payment
                .providerOrderNo
        ) !==
        String(
            paymentData.orderNo
        )
    ) {

        throw new Error(
            "OPay provider order number does not match the stored payment."
        );

    }

};


const buildPaymentPatch = ({
    order,
    paymentData,
    callbackPayload,
    providerStatus,
    paymentStatus,
}) => {

    const patch = {

        provider:
            "opay",

        reference:
            paymentData.reference ||
            order.orderNumber,

        providerOrderNo:
            paymentData.orderNo ||
            order.payment
                .providerOrderNo ||
            "",

        providerStatus,

        failureCode:
            paymentData.failureCode ||
            callbackPayload
                ?.errorCode ||
            "",

        failureReason:
            paymentData.failureReason ||
            callbackPayload
                ?.displayedFailure ||
            callbackPayload
                ?.errorMsg ||
            "",

        status:
            paymentStatus,

    };


    if (
        paymentData.transactionId ||
        callbackPayload
            ?.transactionId
    ) {

        patch.transactionId =
            String(
                paymentData.transactionId ||
                callbackPayload
                    .transactionId
            );

    }


    return patch;

};


const reconcileOpayPayment = async ({
    order,
    paymentData,
    callbackPayload = null,
}) => {

    if (
        order.payment.method !==
        PAYMENT_METHODS.OPAY
    ) {

        throw new Error(
            "This order is not configured for OPay payment."
        );

    }


    assertVerifiedPaymentMatchesOrder({
        order,
        paymentData,
    });


    const providerStatus =
        normalizeProviderStatus(
            paymentData.status
        );


    if (
        providerStatus ===
        "SUCCESS"
    ) {

        order.payment.provider =
            "opay";

        order.payment.reference =
            paymentData.reference ||
            order.orderNumber;

        order.payment.providerOrderNo =
            paymentData.orderNo ||
            order.payment
                .providerOrderNo ||
            "";

        order.payment.providerStatus =
            providerStatus;

        order.payment.status =
            PAYMENT_STATUS.PAID;

        order.payment.failureCode =
            "";

        order.payment.failureReason =
            "";


        if (
            paymentData.transactionId ||
            callbackPayload
                ?.transactionId
        ) {

            order.payment.transactionId =
                String(
                    paymentData.transactionId ||
                    callbackPayload
                        .transactionId
                );

        }


        if (
            !order.payment.paidAt
        ) {

            order.payment.paidAt =
                new Date();

        }


        await order.save();


        return {
            order,
            action:
                "paid",
        };

    }


    if (
        [
            "FAIL",
            "CLOSE",
        ].includes(
            providerStatus
        )
    ) {

        /*
         * Persist the terminal payment state,
         * cancel the order and restore inventory
         * in one retryable MongoDB transaction.
         *
         * This avoids the race between:
         *   1) POST /opay/:orderNumber/close
         *   2) OPay's automatic callback
         */
        const paymentPatch =
            buildPaymentPatch({

                order,

                paymentData,

                callbackPayload,

                providerStatus,

                paymentStatus:
                    PAYMENT_STATUS
                        .FAILED,

            });


        const cancelledOrder =
            await updateOrderStatus({

                orderNumber:
                    order.orderNumber,

                status:
                    ORDER_STATUS
                        .CANCELLED,

                user:
                    null,

                paymentPatch,

            });


        return {
            order:
                cancelledOrder,
            action:
                "cancelled",
        };

    }


    order.payment.provider =
        "opay";

    order.payment.reference =
        paymentData.reference ||
        order.orderNumber;

    order.payment.providerOrderNo =
        paymentData.orderNo ||
        order.payment
            .providerOrderNo ||
        "";

    order.payment.providerStatus =
        providerStatus;

    order.payment.status =
        PAYMENT_STATUS.PENDING;

    order.payment.failureCode =
        paymentData.failureCode ||
        "";

    order.payment.failureReason =
        paymentData.failureReason ||
        "";


    if (
        paymentData.transactionId ||
        callbackPayload
            ?.transactionId
    ) {

        order.payment.transactionId =
            String(
                paymentData.transactionId ||
                callbackPayload
                    .transactionId
            );

    }


    await order.save();


    return {
        order,
        action:
            "pending",
    };

};


module.exports =
    reconcileOpayPayment;
