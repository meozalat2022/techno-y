const Product =
    require("../../models/Product");


const inventoryService =
    require("../inventory");


const INVENTORY_MOVEMENT_TYPES =
    require(
        "../../constants/inventoryMovementTypes"
    );


const REFERENCE_TYPES =
    require(
        "../../constants/inventoryReferenceTypes"
    );


const STOCK_OPERATIONS =
    require(
        "../../constants/stockOperations"
    );



/*
 * Deduct inventory for one physical product.
 *
 * This preserves the existing online safety-stock
 * behavior and inventory movement creation.
 */
const deductPhysicalProduct =
    async ({
        productId,
        quantity,
        orderNumber,
        user,
        session,
    }) => {

        const product =
            await Product.findById(
                productId
            )
                .select(
                    "trackInventory onlineSafetyStock isBundle"
                )
                .session(
                    session
                );


        if (!product) {

            throw new Error(
                "Product not found."
            );

        }


        /*
         * A Bundle itself never owns physical
         * inventory.
         */
        if (
            product.isBundle === true
        ) {

            throw new Error(
                "Bundle products cannot be deducted as physical inventory."
            );

        }


        if (
            product.trackInventory ===
            false
        ) {

            return;

        }


        const stockUpdate =
            await inventoryService
                .updateStock({

                    productId,

                    quantity,

                    operation:
                        STOCK_OPERATIONS
                            .DECREASE,

                    minimumRemainingStock:
                        Number(
                            product
                                .onlineSafetyStock ||
                            0
                        ),

                    session,

                });


        await inventoryService
            .createMovement({

                product:
                    stockUpdate
                        .productId,

                type:
                    INVENTORY_MOVEMENT_TYPES
                        .SALE,

                quantity,

                previousStock:
                    stockUpdate
                        .previousStock,

                newStock:
                    stockUpdate
                        .newStock,

                referenceType:
                    REFERENCE_TYPES
                        .ORDER,

                reference:
                    orderNumber,

                notes:
                    "Online order placed",

                performedBy:
                    user?._id ||
                    null,

                session,

            });

    };



const updateInventory = async ({
    orderItems,
    orderNumber,
    user,
    session,
}) => {

    for (
        const item
        of orderItems
    ) {

        /*
         * NORMAL PRODUCT
         *
         * Existing behavior remains unchanged.
         */
        if (
            item.isBundle !== true
        ) {

            await deductPhysicalProduct({

                productId:
                    item.product,

                quantity:
                    item.quantity,

                orderNumber,

                user,

                session,

            });

            continue;

        }



        /*
         * BUNDLE PRODUCT
         *
         * The Bundle itself has no physical stock.
         *
         * Instead, deduct each component according
         * to:
         *
         * bundle quantity × component quantity
         *
         * Example:
         *
         * Order:
         * Bundle × 2
         *
         * Bundle:
         * Vacuum A × 1
         * Vacuum B × 2
         *
         * Physical deduction:
         * Vacuum A × 2
         * Vacuum B × 4
         */
        const components =
            Array.isArray(
                item.bundleComponents
            )
                ? item.bundleComponents
                : [];


        if (
            components.length === 0
        ) {

            throw new Error(
                "Bundle order item has no component snapshot."
            );

        }


        for (
            const component
            of components
        ) {

            const componentQuantity =
                Number(
                    component.quantity
                );


            if (
                !Number.isInteger(
                    componentQuantity
                ) ||
                componentQuantity <= 0
            ) {

                throw new Error(
                    "Invalid Bundle component quantity."
                );

            }


            const totalQuantity =
                item.quantity *
                componentQuantity;


            await deductPhysicalProduct({

                productId:
                    component.product,

                quantity:
                    totalQuantity,

                orderNumber,

                user,

                session,

            });

        }

    }

};


module.exports =
    updateInventory;