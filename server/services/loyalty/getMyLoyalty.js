const User =
    require("../../models/User");

const LOYALTY_CONFIG =
    require(
        "../../constants/loyaltyConfig"
    );


const getMyLoyalty =
    async userId => {

        const user =
            await User.findById(
                userId
            )
                .select(
                    "loyalty"
                );


        if (!user) {

            throw new Error(
                "User not found."
            );

        }


        const availablePoints =
            Number(
                user.loyalty
                    ?.availablePoints ||
                0
            );


        const pendingPoints =
            Number(
                user.loyalty
                    ?.pendingPoints ||
                0
            );


        const spendablePoints =
            Math.max(
                availablePoints,
                0
            );


        return {

            availablePoints,

            spendablePoints,

            pendingPoints,

            availableCreditEgp:
                spendablePoints /
                LOYALTY_CONFIG
                    .POINTS_PER_REDEMPTION_EGP,

            rules: {

                egpPerEarnPoint:
                    LOYALTY_CONFIG
                        .EGP_PER_EARN_POINT,

                pointsPerRedemptionEgp:
                    LOYALTY_CONFIG
                        .POINTS_PER_REDEMPTION_EGP,

                minimumRedemptionPoints:
                    LOYALTY_CONFIG
                        .MIN_REDEMPTION_POINTS,

                redemptionStepPoints:
                    LOYALTY_CONFIG
                        .REDEMPTION_STEP_POINTS,

            },

        };

    };


module.exports =
    getMyLoyalty;
