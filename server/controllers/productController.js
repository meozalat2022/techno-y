const MESSAGES =
    require("../constants/messages");


const asyncHandler =
    require("../middleware/asyncHandler");


const productService =
    require("../services/product");


const getBundleRecommendation =
    require(
        "../services/product/getBundleRecommendation"
    );


const trackBundleRecommendationEvent =
    require(
        "../services/product/trackBundleRecommendationEvent"
    );


const {
    successResponse,
} =
    require("../utils/apiResponse");


const createProduct =
    asyncHandler(
        async (req, res) => {

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

        }
    );


const getProducts =
    asyncHandler(
        async (req, res) => {

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

        }
    );


const getBundleRecommendations =
    asyncHandler(
        async (req, res) => {

            const recommendation =
                await getBundleRecommendation(
                    req.body?.items
                );


            return successResponse(

                res,

                recommendation,

                "Bundle recommendation retrieved successfully"

            );

        }
    );


const trackBundleRecommendation =
    asyncHandler(
        async (req, res) => {

            const event =
                await trackBundleRecommendationEvent({

                    eventType:
                        req.body?.eventType,

                    bundleId:
                        req.body?.bundleId,

                    recommendationType:
                        req.body?.recommendationType,

                    sessionId:
                        req.body?.sessionId,

                    cartFingerprint:
                        req.body?.cartFingerprint,

                });


            return successResponse(

                res,

                {

                    tracked:
                        true,

                    eventId:
                        event._id,

                },

                "Bundle recommendation event tracked successfully",

                201

            );

        }
    );


const getProductBySlug =
    asyncHandler(
        async (req, res) => {

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

        }
    );


const updateProduct =
    asyncHandler(
        async (req, res) => {

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

        }
    );


const deleteProduct =
    asyncHandler(
        async (req, res) => {

            await productService
                .deleteProduct(
                    req.params.id
                );


            return successResponse(

                res,

                null,

                MESSAGES.PRODUCT.DELETED

            );

        }
    );


module.exports = {

    createProduct,

    getProducts,

    getBundleRecommendations,

    trackBundleRecommendation,

    getProductBySlug,

    updateProduct,

    deleteProduct,

};