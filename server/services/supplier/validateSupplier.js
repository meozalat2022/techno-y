const MESSAGES =
    require("../../constants/messages");


const validateSupplier = ({
    supplierData,
    partial = false,
}) => {

    const {
        name,
        phone,
    } = supplierData;


    if (
        !partial ||
        name !== undefined
    ) {

        if (
            typeof name !== "string" ||
            !name.trim()
        ) {

            throw new Error(
                MESSAGES.SUPPLIER.NAME_REQUIRED
            );

        }

    }


    if (
        !partial ||
        phone !== undefined
    ) {

        if (
            typeof phone !== "string" ||
            !phone.trim()
        ) {

            throw new Error(
                MESSAGES.SUPPLIER.PHONE_REQUIRED
            );

        }

    }

};


module.exports = validateSupplier;