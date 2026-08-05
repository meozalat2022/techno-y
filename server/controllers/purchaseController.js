const asyncHandler = require("../middleware/asyncHandler");

const purchaseService =
    require("../services/purchase");

const createPurchase =
    asyncHandler(async (req, res) => {

        const purchase =
            await purchaseService.createPurchase(
                req.body,
                req.user
            );

        res.status(201).json({

            success: true,

            message:
                "Purchase created successfully.",

            data: purchase,

        });

    });

    const submitPurchase =
    asyncHandler(async (req, res) => {

        const purchase =
            await purchaseService.submitPurchase(
                req.params.id
            );

        res.json({

            success: true,

            message:
                "Purchase submitted successfully.",

            data: purchase,

        });

    });
    const receivePurchase = asyncHandler(async (req, res) => {

    const purchase =
        await purchaseService.receivePurchase(
            req.params.id,
            req.body.items,
            req.user
        );

    res.json({
        success: true,
        message: "Purchase received successfully.",
        data: purchase,
    });

});

module.exports = {
    createPurchase,
    submitPurchase,
    receivePurchase
};