const Brand =
    require("../models/Brand");

const Product =
    require("../models/Product");

const asyncHandler =
    require("../middleware/asyncHandler");

const {
    successResponse,
} =
    require("../utils/apiResponse");

const MESSAGES =
    require("../constants/messages");


const slugPattern =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/;


const normalizeSlug = value =>
    String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );


const validateEnglishSlug = slug => {

    if (!slug) {

        throw new Error(
            "رابط الماركة بالإنجليزية مطلوب."
        );

    }


    if (
        !slugPattern.test(
            slug
        )
    ) {

        throw new Error(
            "رابط الماركة يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط، مثال: lg أو black-and-decker"
        );

    }

};


const createBrand =
    asyncHandler(async (
        req,
        res
    ) => {

        const name =
            String(
                req.body.name ||
                ""
            ).trim();


        const slug =
            normalizeSlug(
                req.body.slug
            );


        if (!name) {

            res.status(400);

            throw new Error(
                "اسم الماركة مطلوب."
            );

        }


        try {

            validateEnglishSlug(
                slug
            );

        } catch (error) {

            res.status(400);

            throw error;

        }


        const existingBrand =
            await Brand.findOne({
                $or: [
                    {
                        name,
                    },
                    {
                        slug,
                    },
                ],
            });


        if (existingBrand) {

            res.status(409);

            throw new Error(
                MESSAGES.BRAND
                    .ALREADY_EXISTS
            );

        }


        const brand =
            await Brand.create({

                name,

                slug,

                logo:
                    String(
                        req.body.logo ||
                        ""
                    ).trim(),

                isActive:
                    req.body.isActive !==
                    false,

            });


        return successResponse(

            res,

            brand,

            MESSAGES.BRAND
                .CREATED,

            201

        );

    });


const getBrands =
    asyncHandler(async (
        req,
        res
    ) => {

        const brands =
            await Brand.find({
                isActive: true,
            }).sort({
                createdAt: -1,
            });


        return successResponse(

            res,

            brands,

            MESSAGES.BRAND
                .LIST_RETRIEVED

        );

    });


const getAdminBrands =
    asyncHandler(async (
        req,
        res
    ) => {

        const brands =
            await Brand.find({})
                .sort({
                    createdAt: -1,
                });


        return successResponse(

            res,

            brands,

            MESSAGES.BRAND
                .LIST_RETRIEVED

        );

    });


const getBrandBySlug =
    asyncHandler(async (
        req,
        res
    ) => {

        const brand =
            await Brand.findOne({

                slug:
                    req.params.slug,

                isActive:
                    true,

            });


        if (!brand) {

            res.status(404);

            throw new Error(
                MESSAGES.BRAND
                    .NOT_FOUND
            );

        }


        return successResponse(

            res,

            brand,

            MESSAGES.BRAND
                .RETRIEVED

        );

    });


const updateBrand =
    asyncHandler(async (
        req,
        res
    ) => {

        const brand =
            await Brand.findById(
                req.params.id
            );


        if (!brand) {

            res.status(404);

            throw new Error(
                MESSAGES.BRAND
                    .NOT_FOUND
            );

        }


        const name =
            req.body.name !==
            undefined
                ? String(
                    req.body.name
                ).trim()
                : brand.name;


        const slug =
            req.body.slug !==
            undefined
                ? normalizeSlug(
                    req.body.slug
                )
                : brand.slug;


        if (!name) {

            res.status(400);

            throw new Error(
                "اسم الماركة مطلوب."
            );

        }


        try {

            validateEnglishSlug(
                slug
            );

        } catch (error) {

            res.status(400);

            throw error;

        }


        const duplicate =
            await Brand.findOne({

                _id: {
                    $ne:
                        brand._id,
                },

                $or: [
                    {
                        name,
                    },
                    {
                        slug,
                    },
                ],

            });


        if (duplicate) {

            res.status(409);

            throw new Error(
                MESSAGES.BRAND
                    .ALREADY_EXISTS
            );

        }


        brand.name =
            name;

        brand.slug =
            slug;


        if (
            req.body.logo !==
            undefined
        ) {

            brand.logo =
                String(
                    req.body.logo ||
                    ""
                ).trim();

        }


        if (
            req.body.isActive !==
            undefined
        ) {

            brand.isActive =
                Boolean(
                    req.body.isActive
                );

        }


        await brand.save();


        return successResponse(

            res,

            brand,

            MESSAGES.BRAND
                .UPDATED

        );

    });


const deleteBrand =
    asyncHandler(async (
        req,
        res
    ) => {

        const brand =
            await Brand.findById(
                req.params.id
            );


        if (!brand) {

            res.status(404);

            throw new Error(
                MESSAGES.BRAND
                    .NOT_FOUND
            );

        }


        const linkedProducts =
            await Product.countDocuments({
                brand:
                    brand._id,
            });


        if (
            linkedProducts >
            0
        ) {

            res.status(409);

            throw new Error(
                "لا يمكن حذف الماركة لأنها مرتبطة بمنتجات. انقل المنتجات إلى ماركة أخرى أولاً."
            );

        }


        brand.isActive =
            false;


        await brand.save();


        return successResponse(

            res,

            null,

            MESSAGES.BRAND
                .DELETED

        );

    });


module.exports = {

    createBrand,

    getBrands,

    getAdminBrands,

    getBrandBySlug,

    updateBrand,

    deleteBrand,

};
