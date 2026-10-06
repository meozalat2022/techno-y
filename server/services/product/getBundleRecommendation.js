const mongoose = require("mongoose");

const Product =
    require("../../models/Product");


const MIN_SAVINGS_PERCENTAGE = 5;


const getEffectivePrice = product => {

    const salePrice =
        Number(product.salePrice) || 0;

    const regularPrice =
        Number(product.regularPrice) || 0;


    return (
        salePrice > 0 &&
        salePrice < regularPrice
    )
        ? salePrice
        : regularPrice;
};


const getOnlineAvailableQuantity = product => {

    if (
        product.trackInventory === false
    ) {
        return Infinity;
    }


    return Math.max(
        Number(product.stockQuantity || 0) -
            Number(product.onlineSafetyStock || 0),
        0
    );
};


const normalizeCartItems = items => {

    if (!Array.isArray(items)) {
        return [];
    }


    return items
        .filter(item =>
            item?.product &&
            mongoose.isValidObjectId(
                item.product
            ) &&
            Number(item.quantity) > 0
        )
        .map(item => ({
            product:
                String(item.product),
            quantity:
                Math.max(
                    1,
                    Number(item.quantity) || 1
                ),
        }));
};


const serializeProduct = product => ({

    _id:
        product._id,

    title:
        product.title,

    slug:
        product.slug,

    sku:
        product.sku,

    regularPrice:
        product.regularPrice,

    salePrice:
        product.salePrice,

    stockQuantity:
        product.stockQuantity,

    stockStatus:
        product.stockStatus,

    isBundle:
        Boolean(product.isBundle),

    images:
        Array.isArray(product.images)
            ? product.images
            : [],

    brand:
        product.brand
            ? {
                _id:
                    product.brand._id,
                name:
                    product.brand.name,
            }
            : null,

    category:
        product.category
            ? {
                _id:
                    product.category._id,
                name:
                    product.category.name,
            }
            : null,
});


const buildRecommendation = ({
    bundle,
    cartMap,
}) => {

    const bundleItems =
        Array.isArray(bundle.bundleItems)
            ? bundle.bundleItems
            : [];


    if (
        bundleItems.length === 0
    ) {
        return null;
    }


    const componentDetails = [];


    let matchedComponentCount = 0;

    let matchedUnits = 0;

    let regularComponentsTotal = 0;


    for (const bundleItem of bundleItems) {

        const component =
            bundleItem.product;

        if (!component) {
            return null;
        }


        const requiredQuantity =
            Number(bundleItem.quantity) || 0;


        if (requiredQuantity <= 0) {
            return null;
        }


        const cartQuantity =
            Number(
                cartMap.get(
                    String(component._id)
                ) || 0
            );


        const matchedQuantity =
            Math.min(
                cartQuantity,
                requiredQuantity
            );


        if (
            matchedQuantity >=
            requiredQuantity
        ) {
            matchedComponentCount += 1;
        }


        matchedUnits +=
            matchedQuantity;


        regularComponentsTotal +=
            getEffectivePrice(component) *
            requiredQuantity;


        componentDetails.push({
            productId:
                String(component._id),

            title:
                component.title,

            quantity:
                requiredQuantity,

            matchedQuantity,

            missingQuantity:
                Math.max(
                    requiredQuantity -
                        matchedQuantity,
                    0
                ),

            price:
                getEffectivePrice(component),

            image:
                component.images?.[0] ||
                null,
        });
    }


    const totalComponentCount =
        bundleItems.length;


    const isExact =
        matchedComponentCount ===
        totalComponentCount;


    const isPartial =
        !isExact &&
        matchedComponentCount > 0 &&
        matchedUnits > 0;


    if (!isExact && !isPartial) {
        return null;
    }


    const bundlePrice =
        getEffectivePrice(bundle);


    const savings =
        regularComponentsTotal -
        bundlePrice;


    if (savings <= 0) {
        return null;
    }


    const savingsPercentage =
        regularComponentsTotal > 0
            ? (
                savings /
                regularComponentsTotal
            ) * 100
            : 0;


    if (
        savingsPercentage <
        MIN_SAVINGS_PERCENTAGE
    ) {
        return null;
    }


    const availableBundleQuantity =
        Math.min(
            ...bundleItems.map(
                bundleItem => {

                    const component =
                        bundleItem.product;

                    const available =
                        getOnlineAvailableQuantity(
                            component
                        );

                    return Number.isFinite(
                        available
                    )
                        ? Math.floor(
                            available /
                            Number(
                                bundleItem.quantity
                            )
                        )
                        : Number.MAX_SAFE_INTEGER;
                }
            )
        );


    if (
        availableBundleQuantity < 1
    ) {
        return null;
    }


    const matchedItems =
        componentDetails
            .filter(item =>
                item.matchedQuantity > 0
            )
            .map(item => ({
                productId:
                    item.productId,
                quantity:
                    item.matchedQuantity,
            }));


    const missingItems =
        componentDetails
            .filter(item =>
                item.missingQuantity > 0
            )
            .map(item => ({
                productId:
                    item.productId,
                title:
                    item.title,
                quantity:
                    item.missingQuantity,
                price:
                    item.price,
                image:
                    item.image,
            }));


    return {
        type:
            isExact
                ? "exact"
                : "partial",

        bundle:
            {
                ...serializeProduct(
                    bundle
                ),

                stockQuantity:
                    availableBundleQuantity,
            },

        matchedItems,

        missingItems,

        matchedComponentCount,

        totalComponentCount,

        regularTotal:
            regularComponentsTotal,

        bundlePrice,

        savings,

        savingsPercentage:
            Number(
                savingsPercentage.toFixed(2)
            ),
    };
};


const getBundleRecommendation = async (
    items
) => {

    const cartItems =
        normalizeCartItems(items);


    if (
        cartItems.length === 0
    ) {
        return null;
    }


    const cartProductIds =
        cartItems.map(
            item => item.product
        );


    const cartProducts =
        await Product.find({
            _id: {
                $in: cartProductIds,
            },
            isActive: true,
        }).select(
            "_id isBundle"
        );


    const cartProductMap =
        new Map(
            cartProducts.map(
                product => [
                    String(product._id),
                    product,
                ]
            )
        );


    const cartMap =
        new Map();


    for (const item of cartItems) {

        const product =
            cartProductMap.get(
                item.product
            );


        if (!product) {
            continue;
        }


        if (product.isBundle) {
            continue;
        }


        cartMap.set(
            item.product,
            (
                cartMap.get(
                    item.product
                ) || 0
            ) + item.quantity
        );
    }


    if (cartMap.size === 0) {
        return null;
    }


    const bundles =
        await Product.find({
            isActive: true,
            isBundle: true,
        })
            .populate({
                path: "bundleItems.product",
                select:
                    "_id title slug sku regularPrice salePrice stockQuantity onlineSafetyStock trackInventory images",
            })
            .populate(
                "category",
                "name"
            )
            .populate(
                "brand",
                "name"
            );


    const recommendations =
        bundles
            .map(bundle =>
                buildRecommendation({
                    bundle,
                    cartMap,
                })
            )
            .filter(Boolean)
            .sort((a, b) => {

                if (
                    a.type !== b.type
                ) {
                    return a.type === "exact"
                        ? -1
                        : 1;
                }


                if (
                    b.savings !==
                    a.savings
                ) {
                    return (
                        b.savings -
                        a.savings
                    );
                }


                return (
                    b.matchedComponentCount -
                    a.matchedComponentCount
                );
            });


    return (
        recommendations[0] ||
        null
    );
};


module.exports =
    getBundleRecommendation;
