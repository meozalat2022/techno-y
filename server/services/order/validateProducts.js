const productService = require("../product");

const validateProducts = async (items) => {

    const productIds = items.map(
        item => item.product
    );

    const products =
        await productService.findProducts(productIds);

    const productMap = new Map(
        products.map(product => [
            product._id.toString(),
            product,
        ])
    );

    for (const item of items) {

        const productId = item.product.toString();

        const product = productMap.get(productId);

        if (product.stockStatus !== "in-stock") {
            throw new Error(
                `${product.title} is out of stock.`
            );
        }

        if (item.quantity > product.stockQuantity) {
            throw new Error(
                `Only ${product.stockQuantity} units of ${product.title} are available.`
            );
        }

    }

    return products;

};

module.exports = validateProducts;