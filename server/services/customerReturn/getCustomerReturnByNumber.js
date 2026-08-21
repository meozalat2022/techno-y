const CustomerReturn =
    require(
        "../../models/CustomerReturn"
    );

const ROLES =
    require("../../constants/roles");


const getCustomerReturnByNumber =
    async ({
        returnNumber,
        user,
    }) => {

        const customerReturn =
            await CustomerReturn
                .findOne({
                    returnNumber,
                })

                .populate(
                    "customer",
                    "firstName lastName email phone"
                )

                .populate(
                    "receivedBy",
                    "firstName lastName email"
                );


        if (!customerReturn) {

            throw new Error(
                "Customer return not found."
            );

        }


        if (
            user.role !==
                ROLES.ADMIN &&
            customerReturn.customer
                ?._id
                ?.toString() !==
                user._id.toString()
        ) {

            throw new Error(
                "You are not authorized to view this return."
            );

        }


        return customerReturn;

    };


module.exports =
    getCustomerReturnByNumber;