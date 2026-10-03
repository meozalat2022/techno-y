const Product =
    require("../../models/Product");


const applyBundleAvailability =
    require("./applyBundleAvailability");


const getProducts = async (
    queryParams
) => {

    const page =
        Math.max(
            Number(
                queryParams.page
            ) || 1,
            1
        );


    const limit =
        Math.min(
            Math.max(
                Number(
                    queryParams.limit
                ) || 24,
                1
            ),
            100
        );


    const filter = {

        isActive: true,

    };


    if (
        queryParams.search
    ) {

        const keyword =
            queryParams.search.trim();


        if (keyword) {

            filter.$or = [

                {
                    title: {

                        $regex:
                            keyword,

                        $options:
                            "i",

                    },
                },

                {
                    sku: {

                        $regex:
                            keyword,

                        $options:
                            "i",

                    },
                },

            ];

        }

    }


    if (
        queryParams.category
    ) {

        filter.category =
            queryParams.category;

    }


    if (
        queryParams.brand
    ) {

        filter.brand =
            queryParams.brand;

    }


    if (
        queryParams.featured ===
        "true"
    ) {

        filter.featured =
            true;

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


    const totalPages =
        Math.max(
            Math.ceil(
                totalProducts /
                    limit
            ),
            1
        );


    const currentPage =
        Math.min(
            page,
            totalPages
        );


    const skip =
        (currentPage - 1) *
        limit;


    const products =
        await Product.find(
            filter
        )

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


    /*
     * Calculate Bundle availability
     * from component inventory before
     * returning the products to the client.
     */
    await applyBundleAvailability(
        products
    );


    return {

        products,

        pagination: {

            page:
                currentPage,

            limit,

            total:
                totalProducts,

            pages:
                totalPages,

        },

    };

};


module.exports =
    getProducts;