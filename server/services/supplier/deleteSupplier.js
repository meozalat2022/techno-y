const Supplier =
    require("../../models/Supplier");

const findDocumentOrThrow =
    require("../../utils/findDocumentOrThrow");


const deleteSupplier = async (
    supplierId
) => {

    const supplier =
        await findDocumentOrThrow(
            Supplier,
            {
                _id: supplierId,
                isActive: true,
            },
            "Supplier"
        );


    supplier.isActive = false;


    await supplier.save();


    return supplier;

};


module.exports = deleteSupplier;