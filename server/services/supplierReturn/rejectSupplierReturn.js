const SupplierReturn =
    require(
        "../../models/SupplierReturn"
    );

const MESSAGES =
    require("../../constants/messages");

const SUPPLIER_RETURN_STATUS =
    require(
        "../../constants/supplierReturnStatus"
    );


const rejectSupplierReturn =
    async (returnId) => {

        const supplierReturn =
            await SupplierReturn.findOne({

                _id:
                    returnId,

                status:
                    SUPPLIER_RETURN_STATUS
                        .REQUESTED,

            });


        if (!supplierReturn) {

            throw new Error(
                MESSAGES.SUPPLIER_RETURN
                    .CANNOT_REJECT
            );

        }


        supplierReturn.status =
            SUPPLIER_RETURN_STATUS
                .REJECTED;


        await supplierReturn.save();


        return supplierReturn;

    };


module.exports =
    rejectSupplierReturn;