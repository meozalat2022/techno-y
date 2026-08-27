const Order =
    require("../../models/Order");

const PAYMENT_METHODS =
    require("../../constants/paymentMethods");

const PAYMENT_STATUS =
    require("../../constants/paymentStatus");

const ORDER_STATUS =
    require("../../constants/orderStatus");

const queryPaymentStatus =
    require("./opay/queryPaymentStatus");

const closeCashierPayment =
    require("./opay/closeCashierPayment");

const reconcileOpayPayment =
    require("./reconcileOpayPayment");

const updateOrderStatus =
    require("../order/updateOrderStatus");


const normalizeStatus =
    value =>
        String(
            value || ""
        )
            .trim()
            .toUpperCase();


const getExpiryMinutes = () => {

    const configured =
        Number(
            process.env
                .OPAY_PENDING_EXPIRY_MINUTES
        );


    if (
        Number.isFinite(
            configured
        ) &&
        configured > 0
    ) {

        return configured;

    }


    return 30;

};


const cancelWithoutProviderSession =
    async order => {

        return updateOrderStatus({

            orderNumber:
                order.orderNumber,

            status:
                ORDER_STATUS.CANCELLED,

            user:
                null,

            paymentPatch: {

                provider:
                    "opay",

                reference:
                    order.payment.reference ||
                    order.orderNumber,

                providerStatus:
                    "EXPIRED",

                status:
                    PAYMENT_STATUS.FAILED,

                failureCode:
                    "LOCAL_EXPIRY",

                failureReason:
                    "OPay payment session expired before a provider session was created.",

            },

        });

    };


const expireOneOrder =
    async order => {

        const reference =
            order.payment.reference ||
            order.orderNumber;


        /*
         * If no OPay cashier session was ever created,
         * there is nothing to close remotely.
         */
        if (
            !order.payment
                .providerOrderNo &&
            !order.payment
                .cashierUrl &&
            !order.payment
                .providerStatus
        ) {

            const cancelledOrder =
                await cancelWithoutProviderSession(
                    order
                );


            return {
                orderNumber:
                    order.orderNumber,
                action:
                    "cancelled-without-provider-session",
                orderStatus:
                    cancelledOrder.status,
                paymentStatus:
                    cancelledOrder.payment.status,
            };

        }


        const paymentData =
            await queryPaymentStatus({
                reference,
            });


        const providerStatus =
            normalizeStatus(
                paymentData.status
            );


        /*
         * Never close first. If OPay already knows the
         * payment succeeded, reconcile SUCCESS and keep
         * the order.
         */
        if (
            providerStatus ===
                "SUCCESS" ||
            [
                "FAIL",
                "CLOSE",
            ].includes(
                providerStatus
            )
        ) {

            const result =
                await reconcileOpayPayment({

                    order,

                    paymentData,

                });


            return {
                orderNumber:
                    order.orderNumber,
                action:
                    result.action,
                providerStatus,
                orderStatus:
                    result.order.status,
                paymentStatus:
                    result.order.payment.status,
            };

        }


        if (
            ![
                "INITIAL",
                "PENDING",
            ].includes(
                providerStatus
            )
        ) {

            return {
                orderNumber:
                    order.orderNumber,
                action:
                    "skipped-unknown-provider-status",
                providerStatus,
            };

        }


        await closeCashierPayment({
            reference,
        });


        const verifiedAfterClose =
            await queryPaymentStatus({
                reference,
            });


        const result =
            await reconcileOpayPayment({

                order,

                paymentData:
                    verifiedAfterClose,

            });


        return {
            orderNumber:
                order.orderNumber,
            action:
                result.action,
            providerStatus:
                normalizeStatus(
                    verifiedAfterClose.status
                ),
            orderStatus:
                result.order.status,
            paymentStatus:
                result.order.payment.status,
        };

    };


const expirePendingOpayOrders =
    async () => {

        const expiryMinutes =
            getExpiryMinutes();


        const cutoff =
            new Date(
                Date.now() -
                expiryMinutes *
                    60 *
                    1000
            );


        const orders =
            await Order.find({

                "payment.method":
                    PAYMENT_METHODS.OPAY,

                "payment.status":
                    PAYMENT_STATUS.PENDING,

                status: {
                    $ne:
                        ORDER_STATUS.CANCELLED,
                },

                createdAt: {
                    $lte:
                        cutoff,
                },

            })
                .sort({
                    createdAt: 1,
                })
                .limit(50);


        const results = [];


        for (
            const order
            of orders
        ) {

            try {

                const result =
                    await expireOneOrder(
                        order
                    );


                results.push(
                    result
                );

            } catch (error) {

                results.push({

                    orderNumber:
                        order.orderNumber,

                    action:
                        "error",

                    message:
                        error.message,

                });

            }

        }


        return {
            checked:
                orders.length,
            results,
        };

    };


module.exports =
    expirePendingOpayOrders;
