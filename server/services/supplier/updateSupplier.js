const Supplier = require("../../models/Supplier");
const findDocumentOrThrow = require("../../utils/findDocumentOrThrow");

const validateSupplier = require("./validateSupplier");

const updateSupplier = async (
    id,
    supplierData
) => {

    validateSupplier(supplierData);

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

    Object.assign(supplier, supplierData);

    await supplier.save();

    return supplier;

};

module.exports = updateSupplier;