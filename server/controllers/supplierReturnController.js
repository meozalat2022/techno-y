const MESSAGES =
    require("../constants/messages");

const asyncHandler =
    require(
        "../middleware/asyncHandler"
    );

const supplierReturnService =
    require(
        "../services/supplierReturn"
    );

const {
    successResponse,
} =
    require(
        "../utils/apiResponse"
    );


const createSupplierReturn =
    asyncHandler(
        async (req, res) => {

            const supplierReturn =
                await supplierReturnService
                    .createSupplierReturn({

                        purchaseNumber:
                            req.body
                                .purchaseNumber,

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

                supplierReturn,

                MESSAGES.SUPPLIER_RETURN
                    .CREATED,

                201

            );

        }
    );


const sendSupplierReturn =
    asyncHandler(
        async (req, res) => {

            const supplierReturn =
                await supplierReturnService
                    .sendSupplierReturn({

                        returnId:
                            req.params.id,

                        user:
                            req.user,

                    });


            return successResponse(

                res,

                supplierReturn,

                MESSAGES.SUPPLIER_RETURN
                    .SENT

            );

        }
    );


const rejectSupplierReturn =
    asyncHandler(
        async (req, res) => {

            const supplierReturn =
                await supplierReturnService
                    .rejectSupplierReturn(
                        req.params.id
                    );


            return successResponse(

                res,

                supplierReturn,

                MESSAGES.SUPPLIER_RETURN
                    .REJECTED

            );

        }
    );


const getSupplierReturns =
    asyncHandler(
        async (req, res) => {

            const result =
                await supplierReturnService
                    .getSupplierReturns(
                        req.query
                    );


            return successResponse(

                res,

                result.returns,

                MESSAGES.SUPPLIER_RETURN
                    .LIST_RETRIEVED,

                200,

                result.pagination

            );

        }
    );


const getSupplierReturnByNumber =
    asyncHandler(
        async (req, res) => {

            const supplierReturn =
                await supplierReturnService
                    .getSupplierReturnByNumber(
                        req.params
                            .returnNumber
                    );


            return successResponse(

                res,

                supplierReturn,

                MESSAGES.SUPPLIER_RETURN
                    .RETRIEVED

            );

        }
    );


module.exports = {

    createSupplierReturn,

    sendSupplierReturn,

    rejectSupplierReturn,

    getSupplierReturns,

    getSupplierReturnByNumber,

};