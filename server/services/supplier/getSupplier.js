const Supplier =
    require("../../models/Supplier");

const findDocumentOrThrow =
    require("../../utils/findDocumentOrThrow");


const getSupplier = async (
    supplierId
) => {

    return findDocumentOrThrow(
        Supplier,
        {
            _id: supplierId,
            isActive: true,
        },
        "Supplier"
    );

};


module.exports = getSupplier;