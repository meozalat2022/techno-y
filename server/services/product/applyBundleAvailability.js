const Product =
    require("../../models/Product");

const STOCK_STATUS =
    require("../../constants/stockStatus");


const applyBundleAvailability =
    async products => {

        const list =
            Array.isArray(products)
                ? products
                : [products];


        if (list.length === 0) {

            return products;

        }


        const bundleProducts =
            list.filter(
                product =>
                    product &&
                    product.isBundle === true
            );


        if (
            bundleProducts.length === 0
        ) {

            return products;

        }


        /*
         * Collect every component product ID
         * used by the returned bundles.
         */
        const componentIds = [];


        for (
            const bundle
            of bundleProducts
        ) {

            const items =
                Array.isArray(
                    bundle.bundleItems
                )
                    ? bundle.bundleItems
                    : [];


            for (
                const item
                of items
            ) {

                if (
                    item &&
                    item.product
                ) {

                    componentIds.push(
                        String(
                            item.product
                        )
                    );

                }

            }

        }


        const uniqueComponentIds =
            [
                ...new Set(
                    componentIds
                ),
            ];


        if (
            uniqueComponentIds.length === 0
        ) {

            for (
                const bundle
                of bundleProducts
            ) {

                bundle.stockQuantity =
                    0;

                bundle.stockStatus =
                    STOCK_STATUS.OUT_OF_STOCK;

            }


            return products;

        }


        /*
         * Load all component inventory
         * in one database query.
         *
         * We deliberately do NOT use the Bundle's
         * stockQuantity. Physical inventory belongs
         * to the component products.
         */
        const components =
            await Product.find({

                _id: {
                    $in:
                        uniqueComponentIds,
                },

                isActive: true,

            }).select(
                "_id stockQuantity onlineSafetyStock"
            );


        const componentMap =
            new Map();


        for (
            const component
            of components
        ) {

            const physicalStock =
                Math.max(
                    Number(
                        component.stockQuantity
                    ) || 0,
                    0
                );


            const safetyStock =
                Math.max(
                    Number(
                        component.onlineSafetyStock
                    ) || 0,
                    0
                );


            const onlineAvailable =
                Math.max(
                    physicalStock -
                        safetyStock,
                    0
                );


            componentMap.set(
                String(
                    component._id
                ),
                onlineAvailable
            );

        }


        /*
         * Calculate availability for every Bundle.
         *
         * Example:
         *
         * Component A:
         * stock = 2
         * required = 1
         * possible = 2
         *
         * Component B:
         * stock = 2
         * required = 1
         * possible = 2
         *
         * Bundle availability = MIN(2, 2) = 2
         */
        for (
            const bundle
            of bundleProducts
        ) {

            const items =
                Array.isArray(
                    bundle.bundleItems
                )
                    ? bundle.bundleItems
                    : [];


            if (
                items.length === 0
            ) {

                bundle.stockQuantity =
                    0;

                bundle.stockStatus =
                    STOCK_STATUS.OUT_OF_STOCK;

                continue;

            }


            let availableBundles =
                Infinity;


            for (
                const item
                of items
            ) {

                const componentId =
                    String(
                        item.product
                    );


                const requiredQuantity =
                    Math.max(
                        Number(
                            item.quantity
                        ) || 1,
                        1
                    );


                /*
                 * Missing or inactive components
                 * make the entire Bundle unavailable.
                 */
                if (
                    !componentMap.has(
                        componentId
                    )
                ) {

                    availableBundles =
                        0;

                    break;

                }


                const availableComponentStock =
                    componentMap.get(
                        componentId
                    );


                const possibleBundles =
                    Math.floor(
                        availableComponentStock /
                            requiredQuantity
                    );


                availableBundles =
                    Math.min(
                        availableBundles,
                        possibleBundles
                    );


                if (
                    availableBundles <= 0
                ) {

                    availableBundles =
                        0;

                    break;

                }

            }


            if (
                availableBundles === Infinity
            ) {

                availableBundles = 0;

            }


            /*
             * Important:
             *
             * We are NOT saving this value to MongoDB.
             *
             * We are only changing the object returned
             * by the product-read service so the existing
             * storefront can immediately understand the
             * Bundle's available quantity.
             */
            bundle.stockQuantity =
                availableBundles;


            bundle.stockStatus =
                availableBundles > 0
                    ? STOCK_STATUS.IN_STOCK
                    : STOCK_STATUS.OUT_OF_STOCK;

        }


        return products;

    };


module.exports =
    applyBundleAvailability;