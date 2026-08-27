const inventoryService =
    require("../services/inventory");

const asyncHandler =
    require("../middleware/asyncHandler");


const getInventoryHistory =
    asyncHandler(async (
        req,
        res
    ) => {

        const {
            productId,
        } =
            req.params;

        const {
            page = 1,
            limit = 20,
        } =
            req.query;


        const result =
            await inventoryService
                .getInventoryHistory(
                    productId,
                    page,
                    limit
                );


        res.status(200)
            .json({

                success:
                    true,

                data:
                    result.history,

                pagination:
                    result.pagination,

            });

    });


const adjustStock =
    asyncHandler(async (
        req,
        res
    ) => {

        const product =
            await inventoryService
                .adjustStock({

                    ...req.body,

                    user:
                        req.user,

                });


        res.status(200)
            .json({

                success:
                    true,

                message:
                    "Stock adjusted successfully.",

                data:
                    product,

            });

    });


const setOnlineSafetyStock =
    asyncHandler(async (
        req,
        res
    ) => {

        const product =
            await inventoryService
                .setOnlineSafetyStock({

                    productId:
                        req.params
                            .productId,

                    onlineSafetyStock:
                        req.body
                            .onlineSafetyStock,

                });


        res.status(200)
            .json({

                success:
                    true,

                message:
                    "Online safety stock updated successfully.",

                data:
                    product,

            });

    });


module.exports = {

    getInventoryHistory,

    adjustStock,

    setOnlineSafetyStock,

};
