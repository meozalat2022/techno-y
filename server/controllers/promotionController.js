const asyncHandler = require("../middleware/asyncHandler");
const promotionService = require("../services/promotion");
const { successResponse } = require("../utils/apiResponse");

const validatePromoCode = asyncHandler(async (req, res) => {
    const result = await promotionService.validateForCheckout({
        code: req.body.code,
        subtotal: req.body.subtotal,
    });

    return successResponse(
        res,
        result.preview,
        "تم تطبيق كود الخصم بنجاح."
    );
});

const getAdminPromotions = asyncHandler(async (req, res) => {
    const promotions = await promotionService.getAdminPromotions();
    return successResponse(res, promotions, "تم تحميل أكواد الخصم.");
});

const createPromotion = asyncHandler(async (req, res) => {
    const promotion = await promotionService.createPromotion({
        ...req.body,
        createdBy: req.user._id,
    });

    return successResponse(res, promotion, "تم إنشاء كود الخصم بنجاح.", 201);
});

const updatePromotion = asyncHandler(async (req, res) => {
    const promotion = await promotionService.updatePromotion({
        id: req.params.id,
        ...req.body,
    });

    return successResponse(res, promotion, "تم تحديث كود الخصم بنجاح.");
});

const deactivatePromotion = asyncHandler(async (req, res) => {
    const promotion = await promotionService.deactivatePromotion(req.params.id);
    return successResponse(res, promotion, "تم إيقاف كود الخصم.");
});

module.exports = {
    validatePromoCode,
    getAdminPromotions,
    createPromotion,
    updatePromotion,
    deactivatePromotion,
};
