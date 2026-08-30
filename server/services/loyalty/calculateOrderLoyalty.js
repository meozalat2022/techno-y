const LOYALTY_CONFIG =
    require(
        "../../constants/loyaltyConfig"
    );


const normalizeRequestedPoints =
    value => {

        const points =
            Number(
                value ||
                0
            );


        if (
            !Number.isInteger(
                points
            ) ||
            points <
                0
        ) {

            throw new Error(
                "Loyalty points to redeem must be a whole number zero or greater."
            );

        }


        if (
            points >
                0 &&
            points <
                LOYALTY_CONFIG
                    .MIN_REDEMPTION_POINTS
        ) {

            throw new Error(
                `Minimum loyalty redemption is ${LOYALTY_CONFIG.MIN_REDEMPTION_POINTS} points.`
            );

        }


        if (
            points >
                0 &&
            points %
                LOYALTY_CONFIG
                    .REDEMPTION_STEP_POINTS !==
                0
        ) {

            throw new Error(
                `Loyalty points must be redeemed in steps of ${LOYALTY_CONFIG.REDEMPTION_STEP_POINTS}.`
            );

        }


        return points;

    };


const calculateOrderLoyalty = ({
    subtotal,
    requestedPoints,
    availablePoints,
}) => {

    const safeSubtotal =
        Math.max(
            Number(
                subtotal
            ) || 0,
            0
        );


    const pointsRequested =
        normalizeRequestedPoints(
            requestedPoints
        );


    const spendablePoints =
        Math.max(
            Number(
                availablePoints
            ) || 0,
            0
        );


    if (
        pointsRequested >
        spendablePoints
    ) {

        throw new Error(
            "Insufficient loyalty points."
        );

    }


    const maxDiscountEgp =
        Math.max(
            safeSubtotal -
                LOYALTY_CONFIG
                    .MIN_PAYABLE_EGP,
            0
        );


    const maxPointsByOrder =
        Math.floor(
            maxDiscountEgp *
            LOYALTY_CONFIG
                .POINTS_PER_REDEMPTION_EGP
        );


    const maxPointsRounded =
        Math.floor(
            maxPointsByOrder /
            LOYALTY_CONFIG
                .REDEMPTION_STEP_POINTS
        ) *
        LOYALTY_CONFIG
            .REDEMPTION_STEP_POINTS;


    if (
        pointsRequested >
        maxPointsRounded
    ) {

        throw new Error(
            `This order can redeem a maximum of ${maxPointsRounded} loyalty points.`
        );

    }


    const redemptionAmount =
        pointsRequested /
        LOYALTY_CONFIG
            .POINTS_PER_REDEMPTION_EGP;


    const eligibleSpend =
        Math.max(
            safeSubtotal -
                redemptionAmount,
            0
        );


    const pointsToEarn =
        Math.floor(
            eligibleSpend /
            LOYALTY_CONFIG
                .EGP_PER_EARN_POINT
        );


    return {

        pointsRedeemed:
            pointsRequested,

        redemptionAmount,

        pointsToEarn,

        eligibleSpend,

        maxRedeemablePoints:
            Math.min(
                spendablePoints,
                maxPointsRounded
            ),

    };

};


module.exports =
    calculateOrderLoyalty;
