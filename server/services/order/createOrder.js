
const mongoose = require("mongoose");

const validateRequest = require("./validateRequest");
const validateProducts = require("./validateProducts");
const buildOrderItems = require("./buildOrderItems");
const calculateTotals = require("./calculateTotals");
const generateOrderNumber = require("./generateOrderNumber");
const saveOrder = require("./saveOrder");
const updateInventory = require("./updateInventory");

const loyaltyService = require("../loyalty");
const promotionService = require("../promotion");
const notificationService = require("../notification");

const trackBundleRecommendationEvent = require(
    "../product/trackBundleRecommendationEvent"
);


const createOrder = async ({
    customer,
    items,
    shippingAddress,
    payment,
    loyaltyPointsToRedeem = 0,
    promoCode = "",
    user,

    // Optional bundle recommendation context.
    // This is used only for analytics.
    bundleRecommendation = null,
}) => {

    const session =
        await mongoose.startSession();


    try {

        session.startTransaction();


        // --------------------------------------------------
        // 1. Validate request
        // --------------------------------------------------

        validateRequest({
            customer,
            items,
            shippingAddress,
            payment,
        });


        // --------------------------------------------------
        // 2. Validate products
        // --------------------------------------------------

        const products =
            await validateProducts({
                items,
            });


        // --------------------------------------------------
        // 3. Build order items
        // --------------------------------------------------

        const orderItems =
            buildOrderItems({
                products,
                items,
            });


        // --------------------------------------------------
        // 4. Calculate base totals
        // --------------------------------------------------

        const baseTotals =
            calculateTotals({
                orderItems,
            });


        // --------------------------------------------------
        // 5. Generate order number
        // --------------------------------------------------

        const orderNumber =
            await generateOrderNumber(
                session
            );


        // --------------------------------------------------
        // 6. Promotion
        // --------------------------------------------------

        let promotionResult = {
            promotion: null,
            discount: 0,
            preview: null,
        };


        if (
            String(
                promoCode || ""
            ).trim()
        ) {

            promotionResult =
                await promotionService
                    .validateForCheckout({
                        code:
                            promoCode,

                        subtotal:
                            baseTotals.subtotal,

                        session,
                    });


            promotionResult.discount =
                promotionResult
                    .preview
                    .discount;
        }


        // --------------------------------------------------
        // 7. Calculate subtotal after promotion
        // --------------------------------------------------

        const subtotalAfterPromotion =
            Math.max(
                baseTotals.subtotal -
                    Number(
                        promotionResult.discount ||
                        0
                    ),
                0
            );


        // --------------------------------------------------
        // 8. Loyalty points
        // --------------------------------------------------

        const loyaltyResult =
            await loyaltyService
                .applyOrderCreation({

                    userId:
                        user._id,

                    orderNumber,

                    subtotal:
                        subtotalAfterPromotion,

                    requestedPoints:
                        loyaltyPointsToRedeem,

                    session,
                });


        // --------------------------------------------------
        // 9. Calculate final totals
        // --------------------------------------------------

        const combinedDiscount =
            Number(
                promotionResult.discount ||
                0
            ) +
            Number(
                loyaltyResult.discount ||
                0
            );


        const totals =
            calculateTotals({
                orderItems,

                discount:
                    combinedDiscount,
            });


        // --------------------------------------------------
        // 10. Save order
        // --------------------------------------------------

        const order =
            await saveOrder({

                orderNumber,

                customer,

                shippingAddress,

                payment,

                orderItems,

                totals,

                loyalty:
                    loyaltyResult
                        .loyalty,

                promotion:
                    promotionResult
                        .promotion
                    ? {
                        code:
                            promotionResult
                                .promotion
                                .code,

                        discountPercent:
                            promotionResult
                                .promotion
                                .discountPercent,

                        discountAmount:
                            promotionResult
                                .discount,
                    }
                    : undefined,

                user,

                session,
            });


        // --------------------------------------------------
        // 11. Update inventory
        // --------------------------------------------------

        await updateInventory({

            orderItems,

            orderNumber,

            user,

            session,
        });


        // --------------------------------------------------
        // 12. Commit transaction
        // --------------------------------------------------

        await session.commitTransaction();


        // ==================================================
        // 13. BUNDLE RECOMMENDATION PURCHASE ANALYTICS
        // ==================================================
        //
        // IMPORTANT:
        //
        // We only record "purchased" AFTER the order has
        // successfully committed.
        //
        // We also verify that the actual order contains
        // the bundle. We do NOT blindly trust the frontend.
        //
        // If analytics fails, the customer's order remains
        // successful.
        // ==================================================

        if (
            bundleRecommendation &&
            bundleRecommendation.bundleId
        ) {

            try {

                const requestedBundleId =
                    String(
                        bundleRecommendation
                            .bundleId
                    );


                const purchasedBundle =
                    order.orderItems?.find(
                        item =>
                            item.isBundle ===
                                true &&
                            String(
                                item.product
                            ) ===
                                requestedBundleId
                    );


                if (
                    purchasedBundle
                ) {

                    await trackBundleRecommendationEvent({

                        eventType:
                            "purchased",

                        bundleId:
                            requestedBundleId,

                        recommendationType:
                            bundleRecommendation
                                .recommendationType ===
                            "exact"
                                ? "exact"
                                : "partial",

                        sessionId:
                            bundleRecommendation
                                .sessionId ||
                            "",

                        cartFingerprint:
                            bundleRecommendation
                                .cartFingerprint ||
                            "",

                        orderId:
                            order._id,
                    });
                }

            } catch (
                analyticsError
            ) {

                /*
                 * Never let an analytics problem
                 * invalidate a successful order.
                 */
                console.error(
                    "Bundle recommendation purchase analytics failed:",
                    analyticsError
                );
            }
        }


        // --------------------------------------------------
        // 14. Send order-created notification
        // --------------------------------------------------

        await notificationService
            .notifyOrderCreated(
                order
            );


        // --------------------------------------------------
        // 15. Return successful order
        // --------------------------------------------------

        return order;


    } catch (
        error
    ) {

        if (
            session.inTransaction()
        ) {

            await session
                .abortTransaction();
        }


        throw error;


    } finally {

        await session.endSession();
    }
};


module.exports =
    createOrder;
