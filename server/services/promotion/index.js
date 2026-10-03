const Promotion = require("../../models/Promotion");
const LOYALTY_CONFIG = require("../../constants/loyaltyConfig");

const normalizeCode = value =>
    String(value || "")
        .trim()
        .toUpperCase();

const validatePromotionWindow = ({ startsAt, expiresAt }) => {
    const start = new Date(startsAt);
    const end = new Date(expiresAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error("تاريخ بداية ونهاية الكود غير صالحين.");
    }

    if (end <= start) {
        throw new Error("تاريخ انتهاء الكود يجب أن يكون بعد تاريخ بدايته.");
    }

    return { start, end };
};

const normalizePercent = value => {
    const percent = Number(value);

    if (!Number.isFinite(percent) || percent <= 0 || percent > 100) {
        throw new Error("نسبة الخصم يجب أن تكون أكبر من 0 وأقل من أو تساوي 100%.");
    }

    return Math.round(percent * 100) / 100;
};

const assertValidCode = code => {
    if (!/^[A-Z0-9][A-Z0-9_-]{2,49}$/.test(code)) {
        throw new Error("كود الخصم يجب أن يحتوي على 3 إلى 50 حرفًا أو رقمًا، ويمكن استخدام - و _.");
    }
};

const getPromotionByCode = async ({ code, session = null }) => {
    const normalizedCode = normalizeCode(code);
    assertValidCode(normalizedCode);

    const query = Promotion.findOne({ code: normalizedCode });

    if (session) {
        query.session(session);
    }

    return query;
};

const calculateDiscount = ({ subtotal, discountPercent }) => {
    const safeSubtotal = Math.max(Number(subtotal) || 0, 0);
    const requestedDiscount =
        Math.round(
            safeSubtotal *
            (Number(discountPercent) / 100) *
            100
        ) / 100;

    const maxDiscount =
        Math.max(
            safeSubtotal -
                LOYALTY_CONFIG.MIN_PAYABLE_EGP,
            0
        );

    return Math.min(
        requestedDiscount,
        maxDiscount
    );
};

const validateForCheckout = async ({ code, subtotal, session = null }) => {
    const promotion = await getPromotionByCode({ code, session });

    if (!promotion) {
        const error = new Error("كود الخصم غير صحيح.");
        error.statusCode = 400;
        throw error;
    }

    const now = new Date();

    if (!promotion.isActive) {
        const error = new Error("كود الخصم غير مفعل حاليًا.");
        error.statusCode = 400;
        throw error;
    }

    if (now < promotion.startsAt) {
        const error = new Error("كود الخصم لم يبدأ العمل بعد.");
        error.statusCode = 400;
        throw error;
    }

    if (now >= promotion.expiresAt) {
        const error = new Error("كود الخصم منتهي الصلاحية.");
        error.statusCode = 400;
        throw error;
    }

    const safeSubtotal = Math.max(Number(subtotal) || 0, 0);
    const discount = calculateDiscount({
        subtotal: safeSubtotal,
        discountPercent: promotion.discountPercent,
    });

    return {
        promotion,
        preview: {
            code: promotion.code,
            discountPercent: promotion.discountPercent,
            discount,
        },
    };
};

const createPromotion = async ({ code, discountPercent, startsAt, expiresAt, isActive = true, createdBy }) => {
    const normalizedCode = normalizeCode(code);
    assertValidCode(normalizedCode);
    const percent = normalizePercent(discountPercent);
    const { start, end } = validatePromotionWindow({ startsAt, expiresAt });

    return Promotion.create({
        code: normalizedCode,
        discountPercent: percent,
        startsAt: start,
        expiresAt: end,
        isActive: isActive !== false,
        createdBy: createdBy || null,
    });
};

const updatePromotion = async ({ id, code, discountPercent, startsAt, expiresAt, isActive }) => {
    const promotion = await Promotion.findById(id);

    if (!promotion) {
        const error = new Error("كود الخصم غير موجود.");
        error.statusCode = 404;
        throw error;
    }

    if (code !== undefined) {
        const normalizedCode = normalizeCode(code);
        assertValidCode(normalizedCode);
        promotion.code = normalizedCode;
    }

    if (discountPercent !== undefined) {
        promotion.discountPercent = normalizePercent(discountPercent);
    }

    const nextStart = startsAt !== undefined ? startsAt : promotion.startsAt;
    const nextEnd = expiresAt !== undefined ? expiresAt : promotion.expiresAt;
    const { start, end } = validatePromotionWindow({
        startsAt: nextStart,
        expiresAt: nextEnd,
    });

    promotion.startsAt = start;
    promotion.expiresAt = end;

    if (isActive !== undefined) {
        promotion.isActive = Boolean(isActive);
    }

    await promotion.save();
    return promotion;
};

const getAdminPromotions = async () =>
    Promotion.find({}).sort({ createdAt: -1 });

const deactivatePromotion = async id => {
    const promotion = await Promotion.findById(id);

    if (!promotion) {
        const error = new Error("كود الخصم غير موجود.");
        error.statusCode = 404;
        throw error;
    }

    promotion.isActive = false;
    await promotion.save();
    return promotion;
};

module.exports = {
    normalizeCode,
    calculateDiscount,
    validateForCheckout,
    createPromotion,
    updatePromotion,
    getAdminPromotions,
    deactivatePromotion,
};
