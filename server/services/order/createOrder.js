const mongoose = require("mongoose");

const validateRequest = require("./validateRequest");
const validateProducts = require("./validateProducts");
const buildOrderItems = require("./buildOrderItems");
const calculateTotals = require("./calculateTotals");
const generateOrderNumber = require("./generateOrderNumber");
const saveOrder = require("./saveOrder");
const updateInventory = require("./updateInventory");

const createOrder = async ({
    customer,
    items,
    shippingAddress,
    payment,
    user,
}) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();



        // Validation
        validateRequest({
            customer,
            items,
            shippingAddress,
            payment,
        });

        // Fetch & validate products
        const products = await validateProducts({ items });

        // Build order snapshot
        const orderItems = buildOrderItems(
            {
                products,
                items
            }
        );

        // Calculate totals
        const totals = calculateTotals({orderItems});

        // Generate order number
        const orderNumber =
            await generateOrderNumber(session);

        // Save order
        const order = await saveOrder({

            orderNumber,

            customer,

            shippingAddress,

            payment,

            orderItems,

            totals,

            user,

            session,

        });

        // throw new Error("Transaction rollback test");

        // Reduce inventory
        await updateInventory({

            orderItems,
            orderNumber,
            user,
            session
        });

        // Commit transaction
        await session.commitTransaction();

        return order;

    } catch (error) {

        // Roll back everything
        await session.abortTransaction();

        throw error;

    } finally {

        // Always close the session
        session.endSession();

    }

};

module.exports = createOrder;