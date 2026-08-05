const findDocumentOrThrow = require("../../utils/findDocumentOrThrow");
const Supplier = require("../../models/Supplier");

const getSupplier = async (id) => {

    const supplier = await findDocumentOrThrow(
        Supplier,
        {
            _id: id,
            isActive: true,
        },
        "Supplier"
    );

    return supplier;
};

module.exports = getSupplier;