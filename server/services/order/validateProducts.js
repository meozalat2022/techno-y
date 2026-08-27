const MESSAGES =
    require("../../constants/messages");

const STOCK_STATUS =
    require("../../constants/stockStatus");

const productService =
    require("../product");


const getOnlineAvailableQuantity =
    product => {

        if (
            product.trackInventory ===
            false
        ) {

            return Infinity;

        }


        return Math.max(

            Number(
                product.stockQuantity
            ) -
            Number(
                product.onlineSafetyStock ||
                0
            ),

            0

        );

    };


const validateProducts = async ({
    items,
}) => {

    const productIds =
        items.map(
            item =>
                item.product
        );


    const products =
        await productService
            .findProducts(
                productIds
            );


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


    for (
        const item
        of items
    ) {

        const product =
            productMap.get(
                item.product
                    .toString()
            );


        if (!product) {

            throw new Error(
                MESSAGES.PRODUCT
                    .NOT_FOUND
            );

        }


        if (
            product.trackInventory ===
                false
        ) {

            continue;

        }


        const onlineAvailable =
            getOnlineAvailableQuantity(
                product
            );


        if (
            product.stockStatus !==
                STOCK_STATUS.IN_STOCK ||
            onlineAvailable <=
                0
        ) {

            throw new Error(
                MESSAGES.PRODUCT
                    .OUT_OF_STOCK(
                        product.title
                    )
            );

        }


        if (
            item.quantity >
            onlineAvailable
        ) {

            throw new Error(
                MESSAGES.PRODUCT
                    .INSUFFICIENT_STOCK(
                        product.title,
                        onlineAvailable
                    )
            );

        }

    }


    return products;

};


module.exports =
    validateProducts;
