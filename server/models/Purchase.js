const mongoose = require("mongoose");

const PURCHASE_STATUS = require("../constants/purchaseStatus");

const purchaseSchema = new mongoose.Schema(
    {
        purchaseNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                title: String,

                sku: String,

                brand: String,

                category: String,

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                receivedQuantity: {
                    type: Number,
                    default: 0,
                    min: 0,
                },

                pricing: {
                    unitCost: {
                        type: Number,
                        required: true,
                        min: 0,
                    },
                },
            },
        ],

        totals: {

            subtotal: {
                type: Number,
                default: 0,
            },

            discount: {
                type: Number,
                default: 0,
            },

            shipping: {
                type: Number,
                default: 0,
            },

            total: {
                type: Number,
                default: 0,
            },

        },

        status: {
            type: String,
            enum: Object.values(PURCHASE_STATUS),
            default: PURCHASE_STATUS.DRAFT,
        },

        notes: {
            type: String,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receivedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Purchase", purchaseSchema);