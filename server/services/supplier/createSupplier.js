const Supplier = require("../../models/Supplier");

const validateSupplier = require("./validateSupplier");

const createSupplier = async (supplierData) => {

    validateSupplier(supplierData);

    const supplier = await Supplier.create({
        ...supplierData,
    });

    return supplier;

};

module.exports = createSupplier;