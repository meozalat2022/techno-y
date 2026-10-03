const mongoose =
    require("mongoose");

const validateRequest =
    require("./validateRequest");

const validateProducts =
    require("./validateProducts");

const buildOrderItems =
    require("./buildOrderItems");

const calculateTotals =
    require("./calculateTotals");

const generateOrderNumber =
    require("./generateOrderNumber");

const saveOrder =
    require("./saveOrder");

const updateInventory =
    require("./updateInventory");

const loyaltyService =
    require("../loyalty");

const promotionService =
    require("../promotion");


const createOrder = async ({
    customer,
    items,
    shippingAddress,
    payment,
    loyaltyPointsToRedeem = 0,
    promoCode = "",
    user,
}) => {

    const session =
        await mongoose.startSession();


    try {

        session.startTransaction();


        validateRequest({
            customer,
            items,
            shippingAddress,
            payment,
        });


        const products =
            await validateProducts({
                items,
            });


        const orderItems =
            buildOrderItems({
                products,
                items,
            });


        const baseTotals =
            calculateTotals({
                orderItems,
            });


        const orderNumber =
            await generateOrderNumber(
                session
            );


        let promotionResult = {
            promotion: null,
            discount: 0,
            preview: null,
        };


        if (String(promoCode || "").trim()) {

            promotionResult =
                await promotionService
                    .validateForCheckout({
                        code: promoCode,
                        subtotal: baseTotals.subtotal,
                        session,
                    });

            promotionResult.discount =
                promotionResult.preview.discount;

        }


        const subtotalAfterPromotion =
            Math.max(
                baseTotals.subtotal -
                    Number(
                        promotionResult.discount ||
                        0
                    ),
                0
            );


        /*
         * Loyalty is calculated after the promotion discount.
         * Both reservations happen inside the same transaction
         * as order creation + inventory reservation.
         */
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
                    promotionResult.promotion
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


        await updateInventory({

            orderItems,

            orderNumber,

            user,

            session,

        });


        await session
            .commitTransaction();


        return order;


    } catch (error) {

        if (
            session.inTransaction()
        ) {

            await session
                .abortTransaction();

        }


        throw error;


    } finally {

        await session
            .endSession();

    }

};


module.exports =
    createOrder;
