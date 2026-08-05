const PURCHASE_STATUS = require("../../constants/purchaseStatus");

const canSubmitPurchase = (purchase) => {

    return purchase.status === PURCHASE_STATUS.DRAFT;

};

module.exports = canSubmitPurchase;