const Supplier = require("../../models/Supplier");
const findDocumentOrThrow = require("../../utils/findDocumentOrThrow");


const deleteSupplier = async (id) => {

   const supplier = await findDocumentOrThrow(
    Supplier,
    {
        _id: id,
        isActive: true,
    },
    "Supplier"
);

    if (!supplier) {
        throw new Error("Supplier not found.");
    }

    supplier.isActive = false;

    await supplier.save();

    return supplier;

};

module.exports = deleteSupplier;