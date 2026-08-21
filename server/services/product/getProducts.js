const Product =
    require("../../models/Product");


const getProducts = async (queryParams) => {

    const page =
        Math.max(
            Number(queryParams.page) || 1,
            1
        );

    const limit =
        Math.min(
            Math.max(
                Number(queryParams.limit) || 12,
                1
            ),
            100
        );

    const skip =
        (page - 1) * limit;


    const filter = {
        isActive: true,
    };


    if (queryParams.search) {

        const keyword =
            queryParams.search.trim();

        if (keyword) {

            filter.$or = [

                {
                    title: {
                        $regex: keyword,
                        $options: "i",
                    },
                },

                {
                    sku: {
                        $regex: keyword,
                        $options: "i",
                    },
                },

            ];

        }

    }


    if (queryParams.category) {

        filter.category =
            queryParams.category;

    }


    if (queryParams.brand) {

        filter.brand =
            queryParams.brand;

    }


    if (
        queryParams.featured === "true"
    ) {

        filter.featured = true;

    }


    const sortOptions = {

        newest: {
            createdAt: -1,
        },

        oldest: {
            createdAt: 1,
        },

        price_asc: {
            regularPrice: 1,
        },

        price_desc: {
            regularPrice: -1,
        },

    };


    const sort =
        sortOptions[
            queryParams.sort
        ] ||
        sortOptions.newest;


    const totalProducts =
        await Product.countDocuments(
            filter
        );


    const products =
        await Product.find(filter)

            .populate(
                "category",
                "name"
            )

            .populate(
                "brand",
                "name"
            )

            .sort(sort)

            .skip(skip)

            .limit(limit);


    return {

        products,

        pagination: {

            page,

            limit,

            total:
                totalProducts,

            pages:
                Math.ceil(
                    totalProducts / limit
                ),

        },

    };

};


module.exports = getProducts;