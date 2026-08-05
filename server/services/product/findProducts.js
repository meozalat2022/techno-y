const Product = require("../../models/Product");

const findProducts = async (productIds) => {

    const products = await Product.find({
        _id: {
            $in: productIds,
        },
        isActive: true,
    })
        .populate("brand", "name")
        .populate("category", "name");

    if (products.length !== productIds.length) {
        throw new Error(
            "One or more products were not found."
        );
    }

    return products;

};

module.exports = findProducts;