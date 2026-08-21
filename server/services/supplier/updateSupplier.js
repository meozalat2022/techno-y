const Supplier =
    require("../../models/Supplier");

const findDocumentOrThrow =
    require("../../utils/findDocumentOrThrow");

const validateSupplier =
    require("./validateSupplier");


const updateSupplier = async ({
    supplierId,
    supplierData,
}) => {

    validateSupplier({
        supplierData,
        partial: true,
    });


    const supplier =
        await findDocumentOrThrow(
            Supplier,
            {
                _id: supplierId,
                isActive: true,
            },
            "Supplier"
        );


    const allowedFields = [

        "name",

        "contactPerson",

        "email",

        "phone",

        "address",

        "notes",

    ];


    for (const field of allowedFields) {

        if (
            supplierData[field] !==
            undefined
        ) {

            supplier[field] =
                supplierData[field];

        }

    }


    await supplier.save();


    return supplier;

};


module.exports = updateSupplier;