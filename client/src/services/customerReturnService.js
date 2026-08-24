import api from "@/lib/api";


const createCustomerReturn = async ({
    orderNumber,
    items,
    reason,
    notes = "",
}) => {

    const response =
        await api.post(
            "/customer-returns",
            {
                orderNumber,
                items,
                reason,
                notes,
            }
        );


    return response.data;

};


const getCustomerReturns = async ({
    page = 1,
    limit = 20,
    status = "",
    orderNumber = "",
}) => {

    const params = {
        page,
        limit,
    };


    if (status) {
        params.status = status;
    }


    if (orderNumber) {
        params.orderNumber =
            orderNumber;
    }


    const response =
        await api.get(
            "/customer-returns",
            {
                params,
            }
        );


    return response.data;

};


const getCustomerReturnByNumber =
    async (
        returnNumber
    ) => {

        const response =
            await api.get(
                `/customer-returns/${returnNumber}`
            );


        return response.data;

    };


const receiveCustomerReturn =
    async (
        returnId
    ) => {

        const response =
            await api.post(
                `/customer-returns/${returnId}/receive`
            );


        return response.data;

    };


const rejectCustomerReturn =
    async (
        returnId
    ) => {

        const response =
            await api.post(
                `/customer-returns/${returnId}/reject`
            );


        return response.data;

    };


const customerReturnService = {

    createCustomerReturn,

    getCustomerReturns,

    getCustomerReturnByNumber,

    receiveCustomerReturn,

    rejectCustomerReturn,

};


export default customerReturnService;