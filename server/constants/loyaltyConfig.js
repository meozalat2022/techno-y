module.exports = {

    /*
     * Earning:
     * Every 10 EGP of eligible merchandise spend earns 1 point.
     *
     * Redemption:
     * 10 points = 1 EGP.
     *
     * Effective reward rate:
     * 1 point per 10 EGP, each point worth 0.10 EGP => 1%.
     */
    EGP_PER_EARN_POINT:
        10,

    POINTS_PER_REDEMPTION_EGP:
        10,

    MIN_REDEMPTION_POINTS:
        100,

    REDEMPTION_STEP_POINTS:
        10,

    /*
     * Keep at least 1 EGP payable on an order.
     * This avoids zero-value OPay/COD edge cases.
     */
    MIN_PAYABLE_EGP:
        1,

};
