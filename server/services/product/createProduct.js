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


const createProduct = async (productData) => {

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


    const slug =
        await generateUniqueSlug(
            productData.title
        );


    /*
     * Stock is owned by the Inventory module.
     * A newly created product therefore starts
     * with zero stock.
     */
    const product =
        await Product.create({

            ...productData,

            slug,

            stockQuantity: 0,

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


module.exports = createProduct;