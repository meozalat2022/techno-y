const Supplier = require("../../models/Supplier");

const listSuppliers = async ({
    page = 1,
    limit = 20,
    search = "",
}) => {

    const query = {
        isActive: true,
    };

    if (search.trim()) {

        query.name = {
            $regex: search,
            $options: "i",
        };

    }

    const skip = (page - 1) * limit;

    const [suppliers, total] = await Promise.all([

        Supplier.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit),

        Supplier.countDocuments(query),

    ]);

    return {

        suppliers,

        pagination: {

            page,

            limit,

            total,

            pages: Math.ceil(total / limit),

        },

    };

};

module.exports = listSuppliers;