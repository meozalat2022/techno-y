const mongoose = require("mongoose");

const validatePurchase = require("./validatePurchase");
const validateSupplier = require("./validateSupplier");
const validateProducts = require("./validateProducts");
const buildPurchaseItems = require("./buildPurchaseItems");
const calculateTotals = require("./calculateTotals");
const generatePurchaseNumber = require("./generatePurchaseNumber");
const savePurchase = require("./savePurchase");

const createPurchase = async (
    purchaseData,
    user
) => {

    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {

        validatePurchase(purchaseData);

        await validateSupplier(
            purchaseData.supplier
        );

        const products =
            await validateProducts(
                purchaseData.items
            );

        const purchaseItems =
            buildPurchaseItems(
                purchaseData.items,
                products
            );

        const totals =
            calculateTotals(
                purchaseItems
            );

        const purchaseNumber =
            await generatePurchaseNumber(
                session
            );

        const purchase =
            await savePurchase(

                purchaseNumber,

                purchaseData.supplier,

                purchaseItems,

                totals,

                user._id,

                session

            );

        await session.commitTransaction();

        return purchase;

        await session.commitTransaction();

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

};

module.exports = createPurchase;