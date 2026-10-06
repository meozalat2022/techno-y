
const mongoose =
    require("mongoose");


const EVENT_TYPES = {
    SHOWN:
        "shown",

    ACCEPTED:
        "accepted",

    PURCHASED:
        "purchased",
};


const RECOMMENDATION_TYPES = {
    EXACT:
        "exact",

    PARTIAL:
        "partial",
};


const bundleRecommendationEventSchema =
    new mongoose.Schema(
        {
            eventType: {
                type:
                    String,

                enum:
                    Object.values(
                        EVENT_TYPES
                    ),

                required:
                    true,
            },


            bundle: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref:
                    "Product",

                required:
                    true,
            },


            /*
             * Store the bundle title as a
             * historical snapshot.
             */
            bundleTitle: {
                type:
                    String,

                required:
                    true,

                trim:
                    true,
            },


            recommendationType: {
                type:
                    String,

                enum:
                    Object.values(
                        RECOMMENDATION_TYPES
                    ),

                required:
                    true,
            },


            /*
             * Anonymous browser session ID.
             */
            sessionId: {
                type:
                    String,

                default:
                    "",

                trim:
                    true,

                maxlength:
                    120,
            },


            /*
             * Cart state when the recommendation
             * was shown / accepted.
             */
            cartFingerprint: {
                type:
                    String,

                default:
                    "",

                trim:
                    true,

                maxlength:
                    1000,
            },


            /*
             * The order that resulted from the
             * recommendation.
             *
             * This is populated only for
             * PURCHASED events.
             */
            order: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref:
                    "Order",

                default:
                    null,
            },
        },

        {
            timestamps:
                true,
        }
    );


bundleRecommendationEventSchema.index({
    eventType:
        1,

    createdAt:
        -1,
});


bundleRecommendationEventSchema.index({
    bundle:
        1,

    eventType:
        1,

    createdAt:
        -1,
});


bundleRecommendationEventSchema.index({
    createdAt:
        -1,
});


bundleRecommendationEventSchema.statics.EVENT_TYPES =
    EVENT_TYPES;


bundleRecommendationEventSchema.statics.RECOMMENDATION_TYPES =
    RECOMMENDATION_TYPES;


module.exports =
    mongoose.model(
        "BundleRecommendationEvent",
        bundleRecommendationEventSchema
    );
