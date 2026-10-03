const MESSAGES =
    require("../../constants/messages");


const buildOrderItems = ({
    products,
    items,
}) => {

    const productMap =
        new Map(
            products.map(
                product => [
                    product._id.toString(),
                    product,
                ]
            )
        );


    return items.map(item => {

        const product =
            productMap.get(
                item.product.toString()
            );


        if (!product) {

            throw new Error(
                MESSAGES.PRODUCT.NOT_FOUND
            );

        }


        const hasValidSalePrice =
            product.salePrice > 0 &&
            product.salePrice <
                product.regularPrice;


        const finalPrice =
            hasValidSalePrice
                ? product.salePrice
                : product.regularPrice;


        /*
         * Bundle component snapshot.
         *
         * We store the exact Bundle definition that existed
         * when the order was created.
         *
         * This is important because a Bundle may be changed
         * later. Historical orders must continue to know
         * exactly which physical products were consumed and
         * therefore which products must be restored if the
         * Bundle is returned.
         */
        const bundleComponents =
            product.isBundle === true
                ? (
                    Array.isArray(
                        product.bundleItems
                    )
                        ? product.bundleItems.map(
                            component => ({

                                product:
                                    component.product,

                                quantity:
                                    Number(
                                        component.quantity
                                    ),

                            })
                        )
                        : []
                )
                : [];


        /*
         * If this is a Bundle, it must have a valid
         * component snapshot.
         *
         * A Bundle without component information cannot
         * safely participate in inventory operations.
         */
        if (
            product.isBundle === true &&
            bundleComponents.length === 0
        ) {

            throw new Error(
                `Bundle "${product.title}" does not have valid component information.`
            );

        }


        /*
         * For normal products these fields represent the
         * product's own physical inventory.
         *
         * For Bundles the actual physical inventory belongs
         * to the component products. The Bundle itself does
         * not receive or lose physical stock.
         */
        const inventoryStockBefore =
            product.stockQuantity;


        const inventoryStockAfter =
            product.stockQuantity -
            item.quantity;


        return {

            product:
                product._id,

            title:
                product.title,

            sku:
                product.sku,

            image:
                product.images.length > 0
                    ? product.images[0]
                    : {
                        url: "",
                        publicId: "",
                    },

            brand:
                product.brand.name,

            category:
                product.category.name,

            compatibleModels: [
                ...product.compatibleModels,
            ],

            /*
             * Identifies whether this order line
             * represents a Bundle.
             */
            isBundle:
                product.isBundle === true,

            /*
             * Historical Bundle component snapshot.
             */
            bundleComponents,

            pricing: {

                regularPrice:
                    product.regularPrice,

                salePrice:
                    product.salePrice,

                finalPrice,

            },

            quantity:
                item.quantity,

            inventory: {

                stockBefore:
                    inventoryStockBefore,

                stockAfter:
                    inventoryStockAfter,

            },

        };

    });

};


module.exports =
    buildOrderItems;