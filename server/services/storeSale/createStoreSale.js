const mongoose =
    require("mongoose");

const Product =
    require("../../models/Product");

const StoreSale =
    require("../../models/StoreSale");

const inventoryService =
    require("../inventory");

const validateStoreSale =
    require("./validateStoreSale");

const generateStoreSaleNumber =
    require("./generateStoreSaleNumber");

const STOCK_OPERATIONS =
    require("../../constants/stockOperations");

const INVENTORY_MOVEMENT_TYPES =
    require("../../constants/inventoryMovementTypes");

const REFERENCE_TYPES =
    require("../../constants/inventoryReferenceTypes");


const createStoreSale = async ({
    items,
    clientRequestId,
    notes = "",
    user,
}) => {

    const {
        clientRequestId:
            normalizedRequestId,
    } =
        validateStoreSale({
            items,
            clientRequestId,
        });


    /*
     * Fast idempotency path:
     * if this client request was already committed,
     * simply return the original store sale.
     */
    const existingSale =
        await StoreSale.findOne({
            clientRequestId:
                normalizedRequestId,
        });


    if (existingSale) {

        return {
            storeSale:
                existingSale,
            idempotentReplay:
                true,
        };

    }


    const session =
        await mongoose
            .startSession();


    try {

        session.startTransaction();


        const productIds =
            items.map(
                item =>
                    item.product
            );


        const products =
            await Product.find({

                _id: {
                    $in:
                        productIds,
                },

                isActive:
                    true,

            })
                .select(
                    "title sku stockQuantity trackInventory"
                )
                .session(
                    session
                );


        if (
            products.length !==
            productIds.length
        ) {

            throw new Error(
                "One or more store-sale products were not found."
            );

        }


        const productMap =
            new Map(
                products.map(
                    product => [
                        product._id
                            .toString(),
                        product,
                    ]
                )
            );


        /*
         * Validate every product before changing any stock.
         * The transaction still protects us if anything
         * changes concurrently before commit.
         */
        for (
            const item
            of items
        ) {

            const product =
                productMap.get(
                    item.product
                        .toString()
                );


            if (
                product.trackInventory ===
                false
            ) {

                throw new Error(
                    `Inventory tracking is disabled for ${product.title}.`
                );

            }


            if (
                product.stockQuantity <
                Number(
                    item.quantity
                )
            ) {

                throw new Error(
                    `Insufficient physical stock for ${product.title}. Available: ${product.stockQuantity}.`
                );

            }

        }


        const saleNumber =
            await generateStoreSaleNumber(
                session
            );


        const saleItems =
            [];


        for (
            const item
            of items
        ) {

            const product =
                productMap.get(
                    item.product
                        .toString()
                );


            const quantity =
                Number(
                    item.quantity
                );


            /*
             * Store sale consumes PHYSICAL stock, therefore
             * it intentionally ignores onlineSafetyStock.
             */
            const stockUpdate =
                await inventoryService
                    .updateStock({

                        productId:
                            product._id,

                        quantity,

                        operation:
                            STOCK_OPERATIONS
                                .DECREASE,

                        minimumRemainingStock:
                            0,

                        session,

                    });


            await inventoryService
                .createMovement({

                    product:
                        product._id,

                    type:
                        INVENTORY_MOVEMENT_TYPES
                            .STORE_SALE,

                    quantity,

                    previousStock:
                        stockUpdate
                            .previousStock,

                    newStock:
                        stockUpdate
                            .newStock,

                    reference:
                        saleNumber,

                    referenceType:
                        REFERENCE_TYPES
                            .STORE_SALE,

                    notes:
                        String(
                            notes ||
                            "Physical store sale"
                        ).trim(),

                    performedBy:
                        user?._id ||
                        null,

                    session,

                });


            saleItems.push({

                product:
                    product._id,

                sku:
                    product.sku,

                title:
                    product.title,

                quantity,

            });

        }


        let created;


        try {

            const result =
                await StoreSale.create(
                    [
                        {
                            saleNumber,

                            clientRequestId:
                                normalizedRequestId,

                            items:
                                saleItems,

                            notes:
                                String(
                                    notes ||
                                    ""
                                ).trim(),

                            performedBy:
                                user._id,
                        },
                    ],
                    {
                        session,
                    }
                );


            created =
                result[0];

        } catch (error) {

            /*
             * A concurrent duplicate request may reach the
             * unique clientRequestId index. The whole
             * transaction is rolled back, so stock cannot
             * be deducted twice.
             */
            if (
                error?.code ===
                11000
            ) {

                await session
                    .abortTransaction();


                const duplicate =
                    await StoreSale
                        .findOne({
                            clientRequestId:
                                normalizedRequestId,
                        });


                if (duplicate) {

                    return {
                        storeSale:
                            duplicate,
                        idempotentReplay:
                            true,
                    };

                }

            }


            throw error;

        }


        await session
            .commitTransaction();


        return {
            storeSale:
                created,
            idempotentReplay:
                false,
        };


    } catch (error) {

        if (
            session.inTransaction()
        ) {

            await session
                .abortTransaction();

        }


        throw error;


    } finally {

        await session
            .endSession();

    }

};


module.exports =
    createStoreSale;
