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


const updateProduct = async ({
    productId,
    updateData,
}) => {

    const product =
        await Product.findOne({

            _id: productId,

            isActive: true,

        });


    if (!product) {

        throw new Error(
            MESSAGES.PRODUCT.NOT_FOUND
        );

    }


    const data = {
        ...updateData,
    };


    /*
     * Inventory fields must only be changed
     * through the Inventory module.
     */
    delete data.stockQuantity;
    delete data.stockStatus;
    delete data.onlineSafetyStock;


    if (data.title) {

        data.slug =
            await generateUniqueSlug(
                data.title,
                productId
            );

    }


    if (data.category) {

        const category =
            await Category.findById(
                data.category
            );

        if (!category) {

            throw new Error(
                MESSAGES.CATEGORY.NOT_FOUND
            );

        }

    }


    if (data.brand) {

        const brand =
            await Brand.findById(
                data.brand
            );

        if (!brand) {

            throw new Error(
                MESSAGES.BRAND.NOT_FOUND
            );

        }

    }


    if (data.sku) {

        const existingSku =
            await Product.findOne({

                sku: data.sku,

                _id: {
                    $ne: productId,
                },

            });


        if (existingSku) {

            throw new Error(
                MESSAGES.PRODUCT
                    .SKU_ALREADY_EXISTS
            );

        }

    }


    Object.assign(
        product,
        data
    );


    await product.save();


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


module.exports = updateProduct;