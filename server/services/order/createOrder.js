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


const createOrder = async ({
    customer,
    items,
    shippingAddress,
    payment,
    loyaltyPointsToRedeem = 0,
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


        /*
         * Loyalty reservation and pending earning
         * happen in the same MongoDB transaction as
         * order creation + inventory reservation.
         */
        const loyaltyResult =
            await loyaltyService
                .applyOrderCreation({

                    userId:
                        user._id,

                    orderNumber,

                    subtotal:
                        baseTotals
                            .subtotal,

                    requestedPoints:
                        loyaltyPointsToRedeem,

                    session,

                });


        const totals =
            calculateTotals({

                orderItems,

                discount:
                    loyaltyResult
                        .discount,

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
