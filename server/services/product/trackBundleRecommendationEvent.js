
const mongoose =
    require("mongoose");


const Product =
    require(
        "../../models/Product"
    );


const BundleRecommendationEvent =
    require(
        "../../models/BundleRecommendationEvent"
    );


const trackBundleRecommendationEvent =
    async ({
        eventType,
        bundleId,
        recommendationType,
        sessionId = "",
        cartFingerprint = "",
        orderId = null,
    }) => {

        // --------------------------------------------------
        // 1. Validate event type
        // --------------------------------------------------

        if (
            !Object.values(
                BundleRecommendationEvent
                    .EVENT_TYPES
            ).includes(
                eventType
            )
        ) {

            throw new Error(
                "Invalid bundle recommendation event type."
            );
        }


        // --------------------------------------------------
        // 2. Validate recommendation type
        // --------------------------------------------------

        if (
            !Object.values(
                BundleRecommendationEvent
                    .RECOMMENDATION_TYPES
            ).includes(
                recommendationType
            )
        ) {

            throw new Error(
                "Invalid bundle recommendation type."
            );
        }


        // --------------------------------------------------
        // 3. Validate bundle ID
        // --------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                bundleId
            )
        ) {

            throw new Error(
                "Invalid bundle ID."
            );
        }


        // --------------------------------------------------
        // 4. PURCHASED must have an order ID
        // --------------------------------------------------

        if (
            eventType ===
                "purchased" &&
            !orderId
        ) {

            throw new Error(
                "Order ID is required for a purchased bundle recommendation event."
            );
        }


        // --------------------------------------------------
        // 5. Validate order ID
        // --------------------------------------------------

        if (
            orderId &&
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {

            throw new Error(
                "Invalid order ID."
            );
        }


        // --------------------------------------------------
        // 6. Verify bundle exists
        // --------------------------------------------------

        const bundle =
            await Product.findOne({

                _id:
                    bundleId,

                isBundle:
                    true,

            })
                .select(
                    "title"
                )
                .lean();


        if (!bundle) {

            throw new Error(
                "Bundle not found."
            );
        }


        // --------------------------------------------------
        // 7. Prevent duplicate purchased events
        // --------------------------------------------------

        if (
            eventType ===
                "purchased"
        ) {

            const existingEvent =
                await BundleRecommendationEvent
                    .findOne({

                        eventType:
                            "purchased",

                        bundle:
                            bundle._id,

                        order:
                            orderId,

                    })
                    .lean();


            if (existingEvent) {

                return existingEvent;
            }
        }


        // --------------------------------------------------
        // 8. Create analytics event
        // --------------------------------------------------

        return BundleRecommendationEvent.create({

            eventType,

            bundle:
                bundle._id,

            bundleTitle:
                bundle.title,

            recommendationType,

            sessionId:
                String(
                    sessionId || ""
                )
                    .trim()
                    .slice(
                        0,
                        120
                    ),

            cartFingerprint:
                String(
                    cartFingerprint || ""
                )
                    .trim()
                    .slice(
                        0,
                        1000
                    ),

            order:
                orderId || null,
        });
    };


module.exports =
    trackBundleRecommendationEvent;
