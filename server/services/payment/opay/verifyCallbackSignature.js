const crypto =
    require("crypto");

const {
    getOpayConfig,
} =
    require("../../../config/opay");


const safeCompareHex = (
    left,
    right
) => {

    if (
        typeof left !== "string" ||
        typeof right !== "string"
    ) {
        return false;
    }


    const normalizedLeft =
        left.trim().toLowerCase();

    const normalizedRight =
        right.trim().toLowerCase();


    if (
        normalizedLeft.length !==
        normalizedRight.length
    ) {
        return false;
    }


    try {

        return crypto.timingSafeEqual(

            Buffer.from(
                normalizedLeft,
                "hex"
            ),

            Buffer.from(
                normalizedRight,
                "hex"
            )

        );

    } catch {

        return false;

    }

};


const buildCallbackSignString =
    payload => {

        const refunded =
            payload.refunded === true ||
            payload.refunded === "true";

        const token =
            payload.token || "";

        const transactionId =
            payload.transactionId || "";

        return (
            `{Amount:"${payload.amount}",` +
            `Currency:"${payload.currency}",` +
            `Reference:"${payload.reference}",` +
            `Refunded:${refunded ? "t" : "f"},` +
            `Status:"${payload.status}",` +
            `Timestamp:"${payload.timestamp}",` +
            `Token:"${token}",` +
            `TransactionID:"${transactionId}"}`
        );

    };


const verifyCallbackSignature = ({
    payload,
    signature,
}) => {

    if (
        !payload ||
        typeof payload !== "object" ||
        !signature
    ) {
        return false;
    }


    const {
        secretKey,
    } =
        getOpayConfig();


    const signString =
        buildCallbackSignString(
            payload
        );


    const expectedSignature =
        crypto
            .createHmac(
                "sha3-512",
                secretKey
            )
            .update(
                signString
            )
            .digest(
                "hex"
            );


    return safeCompareHex(
        expectedSignature,
        signature
    );

};


module.exports = {
    verifyCallbackSignature,
    buildCallbackSignString,
};
