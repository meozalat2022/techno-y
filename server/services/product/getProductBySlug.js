const Product =
    require("../../models/Product");


const MESSAGES =
    require("../../constants/messages");


const applyBundleAvailability =
    require("./applyBundleAvailability");


const getProductBySlug =
    async slug => {

        const product =
            await Product.findOne({

                slug,

                isActive: true,

            })

                .populate(
                    "category",
                    "name"
                )

                .populate(
                    "brand",
                    "name"
                );


        if (!product) {

            throw new Error(
                MESSAGES.PRODUCT.NOT_FOUND
            );

        }


        /*
         * If this is a Bundle, calculate its
         * available quantity from its components.
         *
         * Normal products are left completely
         * unchanged.
         */
        await applyBundleAvailability(
            product
        );


        return product;

    };


module.exports =
    getProductBySlug;