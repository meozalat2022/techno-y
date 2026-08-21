const mongoose =
    require("mongoose");

const CUSTOMER_RETURN_STATUS =
    require(
        "../constants/customerReturnStatus"
    );


const returnItemSchema =
    new mongoose.Schema(
        {

            product: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "Product",
                required: true,
            },

            title: {
                type: String,
                required: true,
            },

            sku: {
                type: String,
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

            unitPrice: {
                type: Number,
                required: true,
                min: 0,
            },

        },
        {
            _id: false,
        }
    );


const customerReturnSchema =
    new mongoose.Schema(
        {

            returnNumber: {
                type: String,
                required: true,
                unique: true,
                index: true,
            },

            order: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "Order",
                required: true,
            },

            orderNumber: {
                type: String,
                required: true,
                index: true,
            },

            customer: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "User",
                required: true,
            },

            items: {
                type: [returnItemSchema],
                required: true,
            },

            reason: {
                type: String,
                required: true,
                trim: true,
            },

            notes: {
                type: String,
                default: "",
            },

            status: {
                type: String,
                enum:
                    Object.values(
                        CUSTOMER_RETURN_STATUS
                    ),
                default:
                    CUSTOMER_RETURN_STATUS
                        .REQUESTED,
            },

            requestedAt: {
                type: Date,
                default: Date.now,
            },

            receivedAt: {
                type: Date,
                default: null,
            },

            receivedBy: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "User",
                default: null,
            },

        },
        {
            timestamps: true,
        }
    );


customerReturnSchema.index({
    status: 1,
    createdAt: -1,
});


module.exports =
    mongoose.model(
        "CustomerReturn",
        customerReturnSchema
    );