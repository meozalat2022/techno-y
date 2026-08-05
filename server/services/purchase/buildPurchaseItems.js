const buildPurchaseItems = (
    items,
    products,
) => {

    const productMap = new Map(
        products.map(product => [
            product._id.toString(),
            product,
        ])
    );

    return items.map(item => {

        const product = productMap.get(
            item.product.toString()
        );

        return {

            product: product._id,

            title: product.title,

            sku: product.sku,

            brand: product.brand.name,

            category: product.category.name,

            pricing: {
                unitCost: item.unitCost,
            },

            quantity: item.quantity,

            receivedQuantity: 0,

        };

    });

};

module.exports = buildPurchaseItems;