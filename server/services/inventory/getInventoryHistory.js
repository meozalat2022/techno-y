const InventoryMovement = require("../../models/InventoryMovement");

const getInventoryHistory = async (
    productId,
    page = 1,
    limit = 20
) => {

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([

        InventoryMovement.find({
            product: productId,
        })
            .populate(
                "performedBy",
                "firstName lastName email"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        InventoryMovement.countDocuments({
            product: productId,
        }),

    ]);

    return {

        history,

        pagination: {

            page,

            limit,

            total,

            pages: Math.ceil(total / limit),

        },

    };

};

module.exports = getInventoryHistory;