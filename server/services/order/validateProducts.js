const MESSAGES =
    require("../../constants/messages");

const STOCK_STATUS =
    require("../../constants/stockStatus");

const productService =
    require("../product");

const validateProducts = async ({
    items,
}) => {

    const productIds =
        items.map(item => item.product);

    const products =
        await productService.findProducts(
            productIds
        );

    const productMap = new Map(
        products.map(product => [
            product._id.toString(),
            product,
        ])
    );

    for (const item of items) {

        const product =
            productMap.get(
                item.product.toString()
            );

        if (!product) {
            throw new Error(
                MESSAGES.PRODUCT.NOT_FOUND
            );
        }

        if (
            product.stockStatus !==
            STOCK_STATUS.IN_STOCK
        ) {
            throw new Error(
                MESSAGES.PRODUCT.OUT_OF_STOCK(
                    product.title
                )
            );
        }

        if (
            item.quantity >
            product.stockQuantity
        ) {
            throw new Error(
                MESSAGES.PRODUCT.INSUFFICIENT_STOCK(
                    product.title,
                    product.stockQuantity
                )
            );
        }

    }

    return products;

};

module.exports = validateProducts;