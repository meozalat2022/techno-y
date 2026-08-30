const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ROLES = require("../constants/roles");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.CUSTOMER,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        loyalty: {
            /*
             * Spendable balance.
             * It may temporarily become negative after a
             * return if the customer already spent points
             * that were earned from the returned order.
             * Checkout always treats negative as zero
             * spendable points.
             */
            availablePoints: {
                type: Number,
                default: 0,
            },

            /*
             * Earned from placed orders but not spendable
             * until the order reaches DELIVERED.
             */
            pendingPoints: {
                type: Number,
                default: 0,
            },
        },

        passwordResetToken: {
            type: String,
            default: undefined,
            select: false,
        },

        passwordResetExpires: {
            type: Date,
            default: undefined,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre(
    "save",
    async function () {
        if (!this.isModified("password")) {
            return;
        }

        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(
            this.password,
            salt
        );
    }
);

userSchema.methods.matchPassword =
    async function (enteredPassword) {
        return bcrypt.compare(
            enteredPassword,
            this.password
        );
    };

module.exports = mongoose.model(
    "User",
    userSchema
);
