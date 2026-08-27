const mongoose =
    require("mongoose");


const storeSaleItemSchema =
    new mongoose.Schema(
        {
            product: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref:
                    "Product",
                required:
                    true,
            },

            sku: {
                type:
                    String,
                required:
                    true,
                trim:
                    true,
            },

            title: {
                type:
                    String,
                required:
                    true,
                trim:
                    true,
            },

            quantity: {
                type:
                    Number,
                required:
                    true,
                min:
                    1,
            },
        },
        {
            _id:
                false,
        }
    );


const storeSaleSchema =
    new mongoose.Schema(
        {
            saleNumber: {
                type:
                    String,
                required:
                    true,
                unique:
                    true,
                index:
                    true,
            },

            /*
             * Idempotency key supplied by the client.
             * Re-sending the same request must never
             * deduct stock twice.
             */
            clientRequestId: {
                type:
                    String,
                required:
                    true,
                unique:
                    true,
                index:
                    true,
                trim:
                    true,
            },

            items: {
                type: [
                    storeSaleItemSchema,
                ],
                required:
                    true,
                validate: {
                    validator:
                        value =>
                            Array.isArray(
                                value
                            ) &&
                            value.length >
                                0,
                    message:
                        "Store sale must contain at least one item.",
                },
            },

            notes: {
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
                required:
                    true,
            },
        },
        {
            timestamps:
                true,
        }
    );


storeSaleSchema.index({
    createdAt:
        -1,
});


module.exports =
    mongoose.model(
        "StoreSale",
        storeSaleSchema
    );
