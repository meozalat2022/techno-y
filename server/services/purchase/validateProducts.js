const productService = require("../product");

const validateProducts = async (items) => {

    const productIds = items.map(
        item => item.product
    );

    return await productService.findProducts(
        productIds
    );

};

module.exports = validateProducts;