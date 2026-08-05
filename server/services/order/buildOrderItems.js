const buildOrderItems = (products, items) => {

    return items.map(item => {

        const product = products.find(
            p => p._id.toString() === item.product.toString()
        );

        const finalPrice =
            product.salePrice > 0
                ? product.salePrice
                : product.regularPrice;

        return {

            product: product._id,

            title: product.title,

            sku: product.sku,

            image:
                product.images.length > 0
                    ? product.images[0]
                    : {
                        url: "",
                        publicId: "",
                    },

            brand: product.brand.name,

            category: product.category.name,

            compatibleModels: [
                ...product.compatibleModels,
            ],

            pricing: {

                regularPrice: product.regularPrice,

                salePrice: product.salePrice,

                finalPrice,

            },

            quantity: item.quantity,

            inventory: {

                stockBefore:
                    product.stockQuantity,

                stockAfter:
                    product.stockQuantity - item.quantity,

            },

        };

    });

};

module.exports = buildOrderItems;