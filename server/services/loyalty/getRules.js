const LOYALTY_CONFIG =
    require(
        "../../constants/loyaltyConfig"
    );


const getRules = () => ({

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

    minimumPayableEgp:
        LOYALTY_CONFIG
            .MIN_PAYABLE_EGP,

});


module.exports =
    getRules;
