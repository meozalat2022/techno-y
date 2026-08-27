const getOpayConfig = () => {

    const mode =
        process.env.OPAY_MODE === "live"
            ? "live"
            : "test";


    const isLive =
        mode === "live";


    const merchantId =
        (
            isLive
                ? process.env.OPAY_LIVE_MERCHANT_ID
                : process.env.OPAY_TEST_MERCHANT_ID
        )?.trim();


    const publicKey =
        (
            isLive
                ? process.env.OPAY_LIVE_PUBLIC_KEY
                : process.env.OPAY_TEST_PUBLIC_KEY
        )?.trim();


    const secretKey =
        (
            isLive
                ? process.env.OPAY_LIVE_SECRET_KEY
                : process.env.OPAY_TEST_SECRET_KEY
        )?.trim();


    const baseUrl =
        isLive
            ? "https://api.opaycheckout.com"
            : "https://sandboxapi.opaycheckout.com";


    if (!merchantId) {

        throw new Error(
            `Missing OPay ${mode} Merchant ID.`
        );

    }


    if (!publicKey) {

        throw new Error(
            `Missing OPay ${mode} Public Key.`
        );

    }


    if (!secretKey) {

        throw new Error(
            `Missing OPay ${mode} Secret Key.`
        );

    }


    return {

        mode,

        merchantId,

        publicKey,

        secretKey,

        baseUrl,

        returnUrl:
            process.env.OPAY_RETURN_URL
                ?.trim() || "",

        cancelUrl:
            process.env.OPAY_CANCEL_URL
                ?.trim() || "",

        callbackUrl:
            process.env.OPAY_CALLBACK_URL
                ?.trim() || "",

    };

};


module.exports = {
    getOpayConfig,
};