const Order =
    require("../../models/Order");

const queryPaymentStatus =
    require("./opay/queryPaymentStatus");

const reconcileOpayPayment =
    require("./reconcileOpayPayment");

const {
    verifyCallbackSignature,
} =
    require(
        "./opay/verifyCallbackSignature"
    );


const handleOpayCallback = async ({
    body,
}) => {

    const payload =
        body?.payload;

    const signature =
        body?.sha512;


    if (
        body?.type !==
            "transaction-status" ||
        !payload
    ) {

        throw new Error(
            "Invalid OPay callback payload."
        );

    }


    const signatureValid =
        verifyCallbackSignature({

            payload,

            signature,

        });


    if (!signatureValid) {

        const error =
            new Error(
                "Invalid OPay callback signature."
            );

        error.statusCode =
            401;

        throw error;

    }


    const reference =
        String(
            payload.reference ||
            ""
        );


    if (!reference) {

        throw new Error(
            "OPay callback reference is missing."
        );

    }


    const order =
        await Order.findOne({
            orderNumber:
                reference,
        });


    if (!order) {

        const error =
            new Error(
                "Order not found for OPay callback."
            );

        error.statusCode =
            404;

        throw error;

    }


    const verifiedPaymentData =
        await queryPaymentStatus({
            reference,
        });


    const result =
        await reconcileOpayPayment({

            order,

            paymentData:
                verifiedPaymentData,

            callbackPayload:
                payload,

        });


    return {

        orderNumber:
            order.orderNumber,

        providerStatus:
            String(
                verifiedPaymentData
                    .status ||
                ""
            ).toUpperCase(),

        paymentStatus:
            result.order.payment
                .status,

        orderStatus:
            result.order.status,

        action:
            result.action,

    };

};


module.exports =
    handleOpayCallback;
