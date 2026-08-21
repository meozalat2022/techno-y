const SupplierReturn =
    require(
        "../../models/SupplierReturn"
    );

const MESSAGES =
    require("../../constants/messages");


const getSupplierReturnByNumber =
    async (returnNumber) => {

        const supplierReturn =
            await SupplierReturn
                .findOne({
                    returnNumber,
                })

                .populate(
                    "supplier",
                    "name phone email address"
                )

                .populate(
                    "createdBy",
                    "firstName lastName email"
                )

                .populate(
                    "sentBy",
                    "firstName lastName email"
                );


        if (!supplierReturn) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .NOT_FOUND
            );

        }


        return supplierReturn;

    };


module.exports =
    getSupplierReturnByNumber;