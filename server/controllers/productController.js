const MESSAGES =
    require("../constants/messages");

const asyncHandler =
    require("../middleware/asyncHandler");

const productService =
    require("../services/product");

const {
    successResponse,
} = require("../utils/apiResponse");


const createProduct =
    asyncHandler(async (req, res) => {

        const product =
            await productService
                .createProduct(
                    req.body
                );

        return successResponse(

            res,

            product,

            MESSAGES.PRODUCT.CREATED,

            201

        );

    });


const getProducts =
    asyncHandler(async (req, res) => {

        const result =
            await productService
                .getProducts(
                    req.query
                );

        return successResponse(

            res,

            result.products,

            MESSAGES.PRODUCT
                .LIST_RETRIEVED,

            200,

            result.pagination

        );

    });


const getProductBySlug =
    asyncHandler(async (req, res) => {

        const product =
            await productService
                .getProductBySlug(
                    req.params.slug
                );

        return successResponse(

            res,

            product,

            MESSAGES.PRODUCT.RETRIEVED

        );

    });


const updateProduct =
    asyncHandler(async (req, res) => {

        const product =
            await productService
                .updateProduct({

                    productId:
                        req.params.id,

                    updateData:
                        req.body,

                });

        return successResponse(

            res,

            product,

            MESSAGES.PRODUCT.UPDATED

        );

    });


const deleteProduct =
    asyncHandler(async (req, res) => {

        await productService
            .deleteProduct(
                req.params.id
            );

        return successResponse(

            res,

            null,

            MESSAGES.PRODUCT.DELETED

        );

    });


module.exports = {

    createProduct,

    getProducts,

    getProductBySlug,

    updateProduct,

    deleteProduct,

};