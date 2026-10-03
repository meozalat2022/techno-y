const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
            minlength: 3,
            maxlength: 50,
        },

        discountPercent: {
            type: Number,
            required: true,
            min: 0.01,
            max: 100,
        },

        startsAt: {
            type: Date,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

promotionSchema.index({ code: 1 }, { unique: true });
promotionSchema.index({ isActive: 1, startsAt: 1, expiresAt: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);
