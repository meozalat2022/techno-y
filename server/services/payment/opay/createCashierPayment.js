const {
    getOpayConfig,
} =
    require("../../../config/opay");

const requestOpay =
    require("./requestOpay");


const toCentAmount = value =>
    Math.round(
        Number(value) * 100
    );


const createCashierPayment = async ({
    order,
}) => {

    const config =
        getOpayConfig();


    const body = {

        country:
            "EG",

        reference:
            order.orderNumber,

        amount: {

            total:
                toCentAmount(
                    order.totals.total
                ),

            currency:
                "EGP",

        },

        returnUrl:
            config.returnUrl,

        userInfo: {

            userId:
                String(
                    order.customer.user ||
                    ""
                ),

            userName:
                `${order.customer.firstName} ${order.customer.lastName}`
                    .trim(),

            userMobile:
                order.customer.phone,

            userEmail:
                order.customer.email,

        },

        productList:
            order.items.map(
                item => {

                    const product = {

                        productId:
                            String(
                                item.product
                            ),

                        name:
                            item.title,

                        description:
                            [
                                item.brand,
                                item.category,
                            ]
                                .filter(Boolean)
                                .join(" - "),

                        price:
                            toCentAmount(
                                item.pricing.finalPrice
                            ),

                        quantity:
                            item.quantity,

                    };


                    if (
                        item.image?.url
                    ) {

                        product.imageUrl =
                            item.image.url;

                    }


                    return product;

                }
            ),

    };


    if (config.cancelUrl) {

        body.cancelUrl =
            config.cancelUrl;

    }


    if (config.callbackUrl) {

        body.callbackUrl =
            config.callbackUrl;

    }


    const response =
        await requestOpay({

            url:
                `${config.baseUrl}/api/v1/international/cashier/create`,

            headers: {

                Authorization:
                    `Bearer ${config.publicKey}`,

                MerchantId:
                    config.merchantId,

            },

            bodyText:
                JSON.stringify(
                    body
                ),

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
                "OPay could not create the payment."
            );

        error.opayResponse =
            response;

        throw error;

    }


    return response.data;

};


module.exports =
    createCashierPayment;
