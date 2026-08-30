const mongoose =
    require("mongoose");

const LOYALTY_TRANSACTION_TYPES =
    require(
        "../constants/loyaltyTransactionTypes"
    );


const loyaltyTransactionSchema =
    new mongoose.Schema(
        {
            user: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref:
                    "User",
                required:
                    true,
                index:
                    true,
            },

            type: {
                type:
                    String,
                enum:
                    Object.values(
                        LOYALTY_TRANSACTION_TYPES
                    ),
                required:
                    true,
                index:
                    true,
            },

            /*
             * Magnitude for human-readable history.
             * Balance changes are represented separately
             * as signed deltas below.
             */
            points: {
                type:
                    Number,
                required:
                    true,
                min:
                    0,
            },

            availableDelta: {
                type:
                    Number,
                default:
                    0,
            },

            pendingDelta: {
                type:
                    Number,
                default:
                    0,
            },

            availableBalanceAfter: {
                type:
                    Number,
                required:
                    true,
            },

            pendingBalanceAfter: {
                type:
                    Number,
                required:
                    true,
            },

            order: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref:
                    "Order",
                default:
                    null,
            },

            orderNumber: {
                type:
                    String,
                default:
                    "",
                trim:
                    true,
                index:
                    true,
            },

            customerReturn: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref:
                    "CustomerReturn",
                default:
                    null,
            },

            returnNumber: {
                type:
                    String,
                default:
                    "",
                trim:
                    true,
            },

            /*
             * Makes every lifecycle event idempotent.
             * Example:
             * ORDER:ORD-000123:DELIVER
             */
            eventKey: {
                type:
                    String,
                required:
                    true,
                unique:
                    true,
                index:
                    true,
            },

            note: {
                type:
                    String,
                default:
                    "",
                trim:
                    true,
            },

            performedBy: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref:
                    "User",
                default:
                    null,
            },
        },
        {
            timestamps:
                true,
        }
    );


loyaltyTransactionSchema.index({
    user:
        1,
    createdAt:
        -1,
});


module.exports =
    mongoose.model(
        "LoyaltyTransaction",
        loyaltyTransactionSchema
    );
