const crypto =
    require("crypto");

const {
    getOpayConfig,
} =
    require("../../../config/opay");

const requestOpay =
    require("./requestOpay");


const closeCashierPayment = async ({
    reference,
}) => {

    const config =
        getOpayConfig();


    const body = {

        country:
            "EG",

        reference,

    };


    const bodyText =
        JSON.stringify(
            body
        );


    const signature =
        crypto
            .createHmac(
                "sha512",
                config.secretKey
            )
            .update(
                bodyText
            )
            .digest(
                "hex"
            );


    const response =
        await requestOpay({

            url:
                `${config.baseUrl}/api/v1/international/payment/close`,

            headers: {

                Authorization:
                    `Bearer ${signature}`,

                MerchantId:
                    config.merchantId,

            },

            bodyText,

        });


    if (
        ![
            "00000",
            "00",
        ].includes(
            String(
                response?.code ||
                ""
            )
        ) ||
        !response?.data
    ) {

        const error =
            new Error(
                response?.message ||
                "Unable to close OPay payment."
            );

        error.opayResponse =
            response;

        throw error;

    }


    return response.data;

};


module.exports =
    closeCashierPayment;
