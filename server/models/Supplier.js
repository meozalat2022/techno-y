const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        contactPerson: {
            type: String,
            default: "",
            trim: true,
        },

        email: {
            type: String,
            default: "",
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        notes: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

supplierSchema.index({
    name: 1,
});

supplierSchema.index({
    phone: 1,
});

module.exports = mongoose.model(
    "Supplier",
    supplierSchema
);