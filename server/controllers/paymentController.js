const asyncHandler =
    require("../middleware/asyncHandler");

const paymentService =
    require("../services/payment");

const {
    successResponse,
} =
    require("../utils/apiResponse");


const createOpayPayment =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await paymentService
                .initializeOpayPayment({

                    orderNumber:
                        req.params.orderNumber,

                    user:
                        req.user,

                });


        return successResponse(

            res,

            result,

            "OPay payment created successfully."

        );

    });


const getOpayPaymentStatus =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await paymentService
                .getOpayPaymentStatus({

                    orderNumber:
                        req.params.orderNumber,

                    user:
                        req.user,

                });


        return successResponse(

            res,

            result,

            "OPay payment status retrieved successfully."

        );

    });


const closeOpayPayment =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await paymentService
                .closeOpayPayment({

                    orderNumber:
                        req.params.orderNumber,

                    user:
                        req.user,

                });


        return successResponse(

            res,

            result,

            "OPay payment closed successfully."

        );

    });


const receiveOpayCallback =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await paymentService
                .handleOpayCallback({

                    body:
                        req.body,

                });


        return res
            .status(200)
            .json({

                success: true,

                message:
                    "OPay callback processed successfully.",

                data:
                    result,

            });

    });


module.exports = {

    createOpayPayment,

    getOpayPaymentStatus,

    closeOpayPayment,

    receiveOpayCallback,

};
