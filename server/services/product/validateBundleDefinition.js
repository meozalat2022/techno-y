const mongoose = require("mongoose");

const Product =
    require("../../models/Product");


const validateBundleDefinition = async ({
    isBundle,
    bundleItems,
    productId = null,
}) => {

    const items =
        Array.isArray(bundleItems)
            ? bundleItems
            : [];


    /*
     * Normal products must not contain
     * bundle components.
     */
    if (!isBundle) {

        if (items.length > 0) {

            throw new Error(
                "Non-bundle products cannot contain bundle items"
            );

        }

        return;

    }


    /*
     * A bundle must contain at least
     * one component.
     */
    if (items.length === 0) {

        throw new Error(
            "Bundle must contain at least one component product"
        );

    }


    const ids = [];
    const seen = new Set();


    for (const item of items) {

        if (!item?.product) {

            throw new Error(
                "Bundle item product is required"
            );

        }


        if (
            !Number.isInteger(
                Number(item.quantity)
            ) ||
            Number(item.quantity) < 1
        ) {

            throw new Error(
                "Bundle item quantity must be a positive integer"
            );

        }


        const id =
            String(item.product);


        /*
         * Prevent duplicate component products.
         */
        if (seen.has(id)) {

            throw new Error(
                "A bundle cannot contain the same product more than once"
            );

        }


        seen.add(id);
        ids.push(item.product);

    }


    /*
     * A bundle cannot contain itself.
     */
    if (
        productId &&
        ids.some(
            id =>
                String(id) ===
                String(productId)
        )
    ) {

        throw new Error(
            "A bundle cannot contain itself"
        );

    }


    /*
     * Load all components in one query.
     */
    const components =
        await Product.find({
            _id: {
                $in: ids,
            },
            isActive: true,
        }).select(
            "_id isBundle"
        );


    /*
     * Every referenced component must
     * exist and be active.
     */
    if (
        components.length !==
        ids.length
    ) {

        throw new Error(
            "One or more bundle component products were not found"
        );

    }


    /*
     * Nested bundles are not allowed
     * in V1.
     */
    const nestedBundle =
        components.find(
            component =>
                component.isBundle === true
        );


    if (nestedBundle) {

        throw new Error(
            "Nested bundles are not allowed"
        );

    }


    /*
     * Return a normalized structure.
     */
    return items.map(
        item => ({
            product:
                item.product,

            quantity:
                Number(item.quantity),
        })
    );

};


module.exports =
    validateBundleDefinition;