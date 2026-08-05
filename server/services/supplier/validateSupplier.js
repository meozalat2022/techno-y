const validateSupplier = ({
    name,
    phone,
}) => {

    if (!name?.trim()) {
        throw new Error("Supplier name is required.");
    }

    if (!phone?.trim()) {
        throw new Error("Supplier phone is required.");
    }

};

module.exports = validateSupplier;