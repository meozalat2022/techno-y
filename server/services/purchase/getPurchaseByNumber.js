const Purchase =
    require("../../models/Purchase");

const MESSAGES =
    require("../../constants/messages");


const getPurchaseByNumber =
    async (purchaseNumber) => {

        const purchase =
            await Purchase.findOne({
                purchaseNumber,
            })

                .populate(
                    "supplier",
                    "name phone email address"
                )

                .populate(
                    "createdBy",
                    "name email"
                );


        if (!purchase) {

            throw new Error(
                MESSAGES.PURCHASE.NOT_FOUND
            );

        }


        return purchase;

    };


module.exports = getPurchaseByNumber;