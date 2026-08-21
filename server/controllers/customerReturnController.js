const asyncHandler =
    require(
        "../middleware/asyncHandler"
    );

const customerReturnService =
    require(
        "../services/customerReturn"
    );

const {
    successResponse,
} =
    require(
        "../utils/apiResponse"
    );


const createCustomerReturn =
    asyncHandler(
        async (req, res) => {

            const customerReturn =
                await customerReturnService
                    .createCustomerReturn({

                        orderNumber:
                            req.body
                                .orderNumber,

                        items:
                            req.body.items,

                        reason:
                            req.body.reason,

                        notes:
                            req.body.notes,

                        user:
                            req.user,

                    });


            return successResponse(

                res,

                customerReturn,

                "Return request created successfully",

                201

            );

        }
    );


const receiveCustomerReturn =
    asyncHandler(
        async (req, res) => {

            const customerReturn =
                await customerReturnService
                    .receiveCustomerReturn({

                        returnId:
                            req.params.id,

                        user:
                            req.user,

                    });


            return successResponse(

                res,

                customerReturn,

                "Customer return received successfully"

            );

        }
    );


const rejectCustomerReturn =
    asyncHandler(
        async (req, res) => {

            const customerReturn =
                await customerReturnService
                    .rejectCustomerReturn(
                        req.params.id
                    );


            return successResponse(

                res,

                customerReturn,

                "Customer return rejected successfully"

            );

        }
    );


const getCustomerReturns =
    asyncHandler(
        async (req, res) => {

            const result =
                await customerReturnService
                    .getCustomerReturns(
                        req.query
                    );


            return successResponse(

                res,

                result.returns,

                "Customer returns retrieved successfully",

                200,

                result.pagination

            );

        }
    );


const getCustomerReturnByNumber =
    asyncHandler(
        async (req, res) => {

            const customerReturn =
                await customerReturnService
                    .getCustomerReturnByNumber({

                        returnNumber:
                            req.params
                                .returnNumber,

                        user:
                            req.user,

                    });


            return successResponse(

                res,

                customerReturn,

                "Customer return retrieved successfully"

            );

        }
    );


module.exports = {

    createCustomerReturn,

    receiveCustomerReturn,

    rejectCustomerReturn,

    getCustomerReturns,

    getCustomerReturnByNumber,

};