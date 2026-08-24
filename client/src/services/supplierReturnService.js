import api from "@/lib/api";


const getSupplierReturns = async ({
    page = 1,
    limit = 20,
    status = "",
    purchaseNumber = "",
    supplier = "",
}) => {

    const params = {
        page,
        limit,
    };


    if (status) {
        params.status = status;
    }


    if (purchaseNumber) {
        params.purchaseNumber = purchaseNumber;
    }


    if (supplier) {
        params.supplier = supplier;
    }


    const response =
        await api.get(
            "/supplier-returns",
            {
                params,
            }
        );


    return response.data;

};


const getSupplierReturnByNumber = async (
    returnNumber
) => {

    const response =
        await api.get(
            `/supplier-returns/${returnNumber}`
        );


    return response.data;

};


const sendSupplierReturn = async (
    returnId
) => {

    const response =
        await api.post(
            `/supplier-returns/${returnId}/send`
        );


    return response.data;

};


const rejectSupplierReturn = async (
    returnId
) => {

    const response =
        await api.post(
            `/supplier-returns/${returnId}/reject`
        );


    return response.data;

};


const supplierReturnService = {

    getSupplierReturns,

    getSupplierReturnByNumber,

    sendSupplierReturn,

    rejectSupplierReturn,

};


export default supplierReturnService;