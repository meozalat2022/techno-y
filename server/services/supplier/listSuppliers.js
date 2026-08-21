const Supplier =
    require("../../models/Supplier");


const listSuppliers = async ({
    page = 1,
    limit = 20,
    search = "",
}) => {

    page =
        Math.max(
            Number(page) || 1,
            1
        );


    limit =
        Math.min(
            Math.max(
                Number(limit) || 20,
                1
            ),
            100
        );


    const query = {
        isActive: true,
    };


    const keyword =
        search.trim();


    if (keyword) {

        query.$or = [

            {
                name: {
                    $regex: keyword,
                    $options: "i",
                },
            },

            {
                contactPerson: {
                    $regex: keyword,
                    $options: "i",
                },
            },

            {
                email: {
                    $regex: keyword,
                    $options: "i",
                },
            },

            {
                phone: {
                    $regex: keyword,
                    $options: "i",
                },
            },

        ];

    }


    const skip =
        (page - 1) * limit;


    const [
        suppliers,
        total,
    ] =
        await Promise.all([

            Supplier.find(query)

                .sort({
                    name: 1,
                })

                .skip(skip)

                .limit(limit),


            Supplier.countDocuments(
                query
            ),

        ]);


    return {

        suppliers,

        pagination: {

            page,

            limit,

            total,

            pages:
                Math.ceil(
                    total / limit
                ),

        },

    };

};


module.exports = listSuppliers;