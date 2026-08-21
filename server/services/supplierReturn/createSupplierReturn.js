const mongoose =
    require("mongoose");

const Purchase =
    require("../../models/Purchase");

const SupplierReturn =
    require(
        "../../models/SupplierReturn"
    );

const MESSAGES =
    require("../../constants/messages");

const SUPPLIER_RETURN_STATUS =
    require(
        "../../constants/supplierReturnStatus"
    );

const validateSupplierReturn =
    require("./validateSupplierReturn");

const generateSupplierReturnNumber =
    require(
        "./generateSupplierReturnNumber"
    );


const createSupplierReturn =
    async ({
        purchaseNumber,
        items,
        reason,
        notes = "",
        user,
    }) => {

        const session =
            await mongoose.startSession();


        try {

            session.startTransaction();


            const purchase =
                await Purchase.findOne({
                    purchaseNumber,
                })
                    .session(session);


            if (!purchase) {

                throw new Error(
                    MESSAGES.SUPPLIER_RETURN
                        .PURCHASE_NOT_FOUND
                );

            }


            const existingRequestedReturn =
                await SupplierReturn.findOne({

                    purchase:
                        purchase._id,

                    status:
                        SUPPLIER_RETURN_STATUS
                            .REQUESTED,

                })
                    .session(session);


            if (existingRequestedReturn) {

                throw new Error(
                    "This purchase already has an open supplier return request."
                );

            }


            validateSupplierReturn({

                purchase,

                items,

                reason,

            });


            const purchaseItemMap =
                new Map(
                    purchase.items.map(
                        item => [
                            item.product
                                .toString(),
                            item,
                        ]
                    )
                );


            const returnItems =
                items.map(item => {

                    const purchaseItem =
                        purchaseItemMap.get(
                            item.product
                                .toString()
                        );


                    return {

                        product:
                            purchaseItem
                                .product,

                        title:
                            purchaseItem
                                .title,

                        sku:
                            purchaseItem.sku,

                        quantity:
                            item.quantity,

                        unitCost:
                            purchaseItem
                                .pricing
                                .unitCost,

                    };

                });


            const returnNumber =
                await generateSupplierReturnNumber(
                    session
                );


            const [supplierReturn] =
                await SupplierReturn.create(
                    [
                        {

                            returnNumber,

                            purchase:
                                purchase._id,

                            purchaseNumber:
                                purchase
                                    .purchaseNumber,

                            supplier:
                                purchase
                                    .supplier,

                            items:
                                returnItems,

                            reason:
                                reason.trim(),

                            notes,

                            createdBy:
                                user._id,

                        },
                    ],
                    {
                        session,
                    }
                );


            await session
                .commitTransaction();


            return supplierReturn;

        } catch (error) {

            await session
                .abortTransaction();

            throw error;

        } finally {

            await session
                .endSession();

        }

    };


module.exports =
    createSupplierReturn;