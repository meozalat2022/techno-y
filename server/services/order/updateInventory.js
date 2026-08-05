const Product = require("../../models/Product");
const inventoryService = require("../inventory");
const INVENTORY_MOVEMENT_TYPES =
    require("../../constants/inventoryMovementTypes");
    const REFERENCE_TYPES =
    require("../../constants/inventoryReferenceTypes");

const updateInventory = async (
    orderItems,
     orderNumber,
    user,
    session
) => {

   for (const item of orderItems) {

    const product = await Product.findById(
        item.product
    ).session(session);

    if (!product) {
        throw new Error("Product not found.");
    }

    const previousStock =
        product.stockQuantity;

    const newStock =
        previousStock - item.quantity;

    product.stockQuantity = newStock;

    await product.save({ session });

    await inventoryService.createMovement({

        product: product._id,

        type:
            INVENTORY_MOVEMENT_TYPES.SALE,

        quantity: item.quantity,

        previousStock,

        newStock,

       referenceType: REFERENCE_TYPES.ORDER,
reference: orderNumber,

        notes: "Order placed",

        performedBy: user?._id || null,

        session,

    });

}

};

module.exports = updateInventory;