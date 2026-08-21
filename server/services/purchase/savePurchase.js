const Purchase =
    require("../../models/Purchase");

const savePurchase = async ({
    purchaseNumber,
    supplier,
    items,
    totals,
    createdBy,
    session,
}) => {

    const purchase =
        await Purchase.create(
            [
                {

                    purchaseNumber,

                    supplier,

                    items,

                    totals,

                    createdBy,

                },
            ],
            {
                session,
            }
        );

    return purchase[0];

};

module.exports = savePurchase;