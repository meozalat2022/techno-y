const asyncHandler =
    require("../middleware/asyncHandler");

const loyaltyService =
    require("../services/loyalty");

const {
    successResponse,
} =
    require("../utils/apiResponse");


const getMyLoyalty =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await loyaltyService
                .getMyLoyalty(
                    req.user._id
                );


        return successResponse(

            res,

            result,

            "Loyalty summary retrieved successfully."

        );

    });


const getMyTransactions =
    asyncHandler(async (
        req,
        res
    ) => {

        const result =
            await loyaltyService
                .getMyTransactions({

                    userId:
                        req.user._id,

                    page:
                        req.query.page,

                    limit:
                        req.query.limit,

                });


        return successResponse(

            res,

            result.transactions,

            "Loyalty transactions retrieved successfully.",

            200,

            result.pagination

        );

    });


const getRules =
    asyncHandler(async (
        req,
        res
    ) => {

        return successResponse(

            res,

            loyaltyService
                .getRules(),

            "Loyalty rules retrieved successfully."

        );

    });


module.exports = {

    getMyLoyalty,

    getMyTransactions,

    getRules,

};
