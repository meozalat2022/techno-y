const mongoose =
    require("mongoose");

const SUPPLIER_RETURN_STATUS =
    require(
        "../constants/supplierReturnStatus"
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

            unitCost: {
                type: Number,
                required: true,
                min: 0,
            },

        },
        {
            _id: false,
        }
    );


const supplierReturnSchema =
    new mongoose.Schema(
        {

            returnNumber: {
                type: String,
                required: true,
                unique: true,
                index: true,
            },

            purchase: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "Purchase",
                required: true,
            },

            purchaseNumber: {
                type: String,
                required: true,
                index: true,
            },

            supplier: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "Supplier",
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
                        SUPPLIER_RETURN_STATUS
                    ),
                default:
                    SUPPLIER_RETURN_STATUS
                        .REQUESTED,
            },

            createdBy: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "User",
                required: true,
            },

            requestedAt: {
                type: Date,
                default: Date.now,
            },

            sentAt: {
                type: Date,
                default: null,
            },

            sentBy: {
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


supplierReturnSchema.index({
    status: 1,
    createdAt: -1,
});


module.exports =
    mongoose.model(
        "SupplierReturn",
        supplierReturnSchema
    );