const Product =
    require("../../models/Product");

const Category =
    require("../../models/Category");

const Brand =
    require("../../models/Brand");

const generateUniqueSlug =
    require("../../utils/slug");

const MESSAGES =
    require("../../constants/messages");

const STOCK_STATUS =
    require("../../constants/stockStatus");

const validateBundleDefinition =
    require("./validateBundleDefinition");


const createProduct = async (
    productData
) => {

    const category =
        await Category.findById(
            productData.category
        );


    if (!category) {

        throw new Error(
            MESSAGES.CATEGORY.NOT_FOUND
        );

    }


    const brand =
        await Brand.findById(
            productData.brand
        );


    if (!brand) {

        throw new Error(
            MESSAGES.BRAND.NOT_FOUND
        );

    }


    const existingSku =
        await Product.findOne({
            sku: productData.sku,
        });


    if (existingSku) {

        throw new Error(
            MESSAGES.PRODUCT
                .SKU_ALREADY_EXISTS
        );

    }


    /*
     * Validate bundle definition.
     *
     * For normal products:
     * bundleItems must be empty.
     *
     * For bundles:
     * components must exist, be active,
     * unique, non-bundles, etc.
     */
    const normalizedBundleItems =
        await validateBundleDefinition({

            isBundle:
                Boolean(
                    productData.isBundle
                ),

            bundleItems:
                productData.bundleItems,

            productId:
                null,

        });


    const slug =
        await generateUniqueSlug(
            productData.title
        );


    /*
     * Stock is owned by the Inventory module.
     *
     * A newly created product therefore
     * starts with zero physical stock.
     *
     * Bundles do not have independent
     * physical stock.
     */
    const product =
        await Product.create({

            ...productData,

            isBundle:
                Boolean(
                    productData.isBundle
                ),

            bundleItems:
                normalizedBundleItems,

            slug,

            stockQuantity:
                0,

            stockStatus:
                STOCK_STATUS.OUT_OF_STOCK,

        });


    await product.populate(
        "category",
        "name"
    );


    await product.populate(
        "brand",
        "name"
    );


    return product;

};


module.exports =
    createProduct;