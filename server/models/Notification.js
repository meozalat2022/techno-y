const mongoose =
    require("mongoose");


const NOTIFICATION_TYPES = {
    ORDER_CREATED:
        "ORDER_CREATED",

    ORDER_CANCELLED:
        "ORDER_CANCELLED",

    CUSTOMER_RETURN_REQUESTED:
        "CUSTOMER_RETURN_REQUESTED",
};


const notificationSchema =
    new mongoose.Schema(
        {

            type: {
                type: String,
                enum: Object.values(
                    NOTIFICATION_TYPES
                ),
                required: true,
            },


            title: {
                type: String,
                required: true,
                trim: true,
            },


            message: {
                type: String,
                required: true,
                trim: true,
            },


            orderId: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "Order",
                default: null,
            },


            orderNumber: {
                type: String,
                default: "",
                trim: true,
            },


            returnId: {
                type:
                    mongoose.Schema.Types
                        .ObjectId,
                ref: "CustomerReturn",
                default: null,
            },


            returnNumber: {
                type: String,
                default: "",
                trim: true,
            },


            link: {
                type: String,
                default: "",
                trim: true,
            },


            read: {
                type: Boolean,
                default: false,
            },

        },
        {
            timestamps: true,
        }
    );


notificationSchema.index({
    read: 1,
    createdAt: -1,
});


notificationSchema.index({
    createdAt: -1,
});


notificationSchema.statics.TYPES =
    NOTIFICATION_TYPES;


module.exports =
    mongoose.model(
        "Notification",
        notificationSchema
    );
