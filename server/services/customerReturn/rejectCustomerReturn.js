const CustomerReturn =
    require(
        "../../models/CustomerReturn"
    );

const CUSTOMER_RETURN_STATUS =
    require(
        "../../constants/customerReturnStatus"
    );


const rejectCustomerReturn =
    async (returnId) => {

        const customerReturn =
            await CustomerReturn.findOne({

                _id:
                    returnId,

                status:
                    CUSTOMER_RETURN_STATUS
                        .REQUESTED,

            });


        if (!customerReturn) {

            throw new Error(
                "Return request not found or cannot be rejected."
            );

        }


        customerReturn.status =
            CUSTOMER_RETURN_STATUS
                .REJECTED;


        await customerReturn.save();


        return customerReturn;

    };


module.exports =
    rejectCustomerReturn;