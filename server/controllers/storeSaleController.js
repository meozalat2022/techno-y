const asyncHandler =
    require("../middleware/asyncHandler");

const storeSaleService =
    require("../services/storeSale");

const {
    successResponse,
} =
    require("../utils/apiResponse");


const createStoreSale =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await storeSaleService
                .createStoreSale({

                    ...req.body,

                    user:
                        req.user,

                });


        return successResponse(

            res,

            {
                ...result.storeSale
                    .toObject(),

                idempotentReplay:
                    result
                        .idempotentReplay,
            },

            result.idempotentReplay
                ? "Store sale already recorded. Existing result returned."
                : "Store sale recorded successfully.",

            result.idempotentReplay
                ? 200
                : 201

        );

    });


const getStoreSales =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await storeSaleService
                .getStoreSales(
                    req.query
                );


        return successResponse(

            res,

            result.sales,

            "Store sales retrieved successfully.",

            200,

            result.pagination

        );

    });


const getStoreSaleByNumber =
    asyncHandler(async (
        req,
        res
    ) => {

        const storeSale =
            await storeSaleService
                .getStoreSaleByNumber(
                    req.params
                        .saleNumber
                );


        return successResponse(

            res,

            storeSale,

            "Store sale retrieved successfully."

        );

    });


module.exports = {

    createStoreSale,

    getStoreSales,

    getStoreSaleByNumber,

};
