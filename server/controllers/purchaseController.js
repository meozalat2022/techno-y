const MESSAGES =
    require("../constants/messages");

const asyncHandler =
    require("../middleware/asyncHandler");

const purchaseService =
    require("../services/purchase");

const {
    successResponse,
} = require("../utils/apiResponse");


const createPurchase =
    asyncHandler(async (req, res) => {

        const purchase =
            await purchaseService.createPurchase({

                purchaseData:
                    req.body,

                user:
                    req.user,

            });

        return successResponse(

            res,

            purchase,

            MESSAGES.PURCHASE.CREATED,

            201

        );

    });


const getPurchases =
    asyncHandler(async (req, res) => {

        const result =
            await purchaseService.getPurchases(
                req.query
            );

        return successResponse(

            res,

            result.purchases,

            MESSAGES.PURCHASE.LIST_RETRIEVED,

            200,

            result.pagination

        );

    });


const getPurchaseByNumber =
    asyncHandler(async (req, res) => {

        const purchase =
            await purchaseService.getPurchaseByNumber(
                req.params.purchaseNumber
            );

        return successResponse(

            res,

            purchase,

            MESSAGES.PURCHASE.RETRIEVED

        );

    });


const submitPurchase =
    asyncHandler(async (req, res) => {

        const purchase =
            await purchaseService.submitPurchase(
                req.params.id
            );

        return successResponse(

            res,

            purchase,

            MESSAGES.PURCHASE.SUBMITTED

        );

    });


const receivePurchase =
    asyncHandler(async (req, res) => {

        const purchase =
            await purchaseService.receivePurchase({

                purchaseId:
                    req.params.id,

                receivedItems:
                    req.body.items,

                user:
                    req.user,

            });

        return successResponse(

            res,

            purchase,

            MESSAGES.PURCHASE.RECEIVED

        );

    });


module.exports = {

    createPurchase,

    getPurchases,

    getPurchaseByNumber,

    submitPurchase,

    receivePurchase,

};