const Category =
    require("../models/Category");

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
            "رابط القسم بالإنجليزية مطلوب."
        );

    }


    if (
        !slugPattern.test(
            slug
        )
    ) {

        throw new Error(
            "رابط القسم يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط، مثال: refrigerator-spare-parts"
        );

    }

};


const createCategory =
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
                "اسم القسم مطلوب."
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


        const existingCategory =
            await Category.findOne({
                $or: [
                    {
                        name,
                    },
                    {
                        slug,
                    },
                ],
            });


        if (existingCategory) {

            res.status(409);

            throw new Error(
                MESSAGES.CATEGORY
                    .ALREADY_EXISTS
            );

        }


        const category =
            await Category.create({

                name,

                slug,

                image:
                    String(
                        req.body.image ||
                        ""
                    ).trim(),

                isActive:
                    req.body.isActive !==
                    false,

            });


        return successResponse(

            res,

            category,

            MESSAGES.CATEGORY
                .CREATED,

            201

        );

    });


const getCategories =
    asyncHandler(async (
        req,
        res
    ) => {

        const categories =
            await Category.find({
                isActive: true,
            }).sort({
                createdAt: -1,
            });


        return successResponse(

            res,

            categories,

            MESSAGES.CATEGORY
                .LIST_RETRIEVED

        );

    });


const getAdminCategories =
    asyncHandler(async (
        req,
        res
    ) => {

        const categories =
            await Category.find({})
                .sort({
                    createdAt: -1,
                });


        return successResponse(

            res,

            categories,

            MESSAGES.CATEGORY
                .LIST_RETRIEVED

        );

    });


const getCategoryBySlug =
    asyncHandler(async (
        req,
        res
    ) => {

        const category =
            await Category.findOne({

                slug:
                    req.params.slug,

                isActive:
                    true,

            });


        if (!category) {

            res.status(404);

            throw new Error(
                MESSAGES.CATEGORY
                    .NOT_FOUND
            );

        }


        return successResponse(

            res,

            category,

            MESSAGES.CATEGORY
                .RETRIEVED

        );

    });


const updateCategory =
    asyncHandler(async (
        req,
        res
    ) => {

        const category =
            await Category.findById(
                req.params.id
            );


        if (!category) {

            res.status(404);

            throw new Error(
                MESSAGES.CATEGORY
                    .NOT_FOUND
            );

        }


        const name =
            req.body.name !==
            undefined
                ? String(
                    req.body.name
                ).trim()
                : category.name;


        const slug =
            req.body.slug !==
            undefined
                ? normalizeSlug(
                    req.body.slug
                )
                : category.slug;


        if (!name) {

            res.status(400);

            throw new Error(
                "اسم القسم مطلوب."
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
            await Category.findOne({

                _id: {
                    $ne:
                        category._id,
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
                MESSAGES.CATEGORY
                    .ALREADY_EXISTS
            );

        }


        category.name =
            name;

        category.slug =
            slug;


        if (
            req.body.image !==
            undefined
        ) {

            category.image =
                String(
                    req.body.image ||
                    ""
                ).trim();

        }


        if (
            req.body.isActive !==
            undefined
        ) {

            category.isActive =
                Boolean(
                    req.body.isActive
                );

        }


        await category.save();


        return successResponse(

            res,

            category,

            MESSAGES.CATEGORY
                .UPDATED

        );

    });


const deleteCategory =
    asyncHandler(async (
        req,
        res
    ) => {

        const category =
            await Category.findById(
                req.params.id
            );


        if (!category) {

            res.status(404);

            throw new Error(
                MESSAGES.CATEGORY
                    .NOT_FOUND
            );

        }


        const linkedProducts =
            await Product.countDocuments({
                category:
                    category._id,
            });


        if (
            linkedProducts >
            0
        ) {

            res.status(409);

            throw new Error(
                "لا يمكن حذف القسم لأنه مرتبط بمنتجات. انقل المنتجات إلى قسم آخر أولاً."
            );

        }


        category.isActive =
            false;


        await category.save();


        return successResponse(

            res,

            null,

            MESSAGES.CATEGORY
                .DELETED

        );

    });


module.exports = {

    createCategory,

    getCategories,

    getAdminCategories,

    getCategoryBySlug,

    updateCategory,

    deleteCategory,

};
