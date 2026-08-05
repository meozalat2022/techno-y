const Purchase = require("../../models/Purchase");

const findDocumentOrThrow = require("../../utils/findDocumentOrThrow");

const canSubmitPurchase = require("./canSubmitPurchase");

const PURCHASE_STATUS = require("../../constants/purchaseStatus");

const submitPurchase = async (purchaseId) => {

    const purchase =
        await findDocumentOrThrow(
            Purchase,
            {
                _id: purchaseId,
            },
            "Purchase"
        );

    if (!canSubmitPurchase(purchase)) {
        throw new Error(
            "Only draft purchases can be submitted."
        );
    }

    purchase.status =
        PURCHASE_STATUS.ORDERED;

    await purchase.save();

    return purchase;

};

module.exports = submitPurchase;