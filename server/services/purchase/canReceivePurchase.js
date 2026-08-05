const PURCHASE_STATUS = require("../../constants/purchaseStatus");

const canReceivePurchase = (purchase) => {

    return [
        PURCHASE_STATUS.ORDERED,
        PURCHASE_STATUS.PARTIALLY_RECEIVED,
    ].includes(purchase.status);

};

module.exports = canReceivePurchase;