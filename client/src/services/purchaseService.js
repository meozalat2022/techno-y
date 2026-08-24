import api from "@/lib/api";


const getPurchases = async ({
    page = 1,
    limit = 20,
    search = "",
    status = "",
    supplier = "",
}) => {

    const params = {
        page,
        limit,
    };


    if (search) {
        params.search = search;
    }

    if (status) {
        params.status = status;
    }

    if (supplier) {
        params.supplier = supplier;
    }


    const response =
        await api.get(
            "/purchases",
            {
                params,
            }
        );


    return response.data;

};


const getPurchaseByNumber = async (
    purchaseNumber
) => {

    const response =
        await api.get(
            `/purchases/${purchaseNumber}`
        );


    return response.data;

};


const createPurchase = async (
    purchaseData
) => {

    const response =
        await api.post(
            "/purchases",
            purchaseData
        );


    return response.data;

};


const submitPurchase = async (
    purchaseId
) => {

    const response =
        await api.post(
            `/purchases/${purchaseId}/submit`
        );


    return response.data;

};


const receivePurchase = async (
    purchaseId,
    items
) => {

    const response =
        await api.post(
            `/purchases/${purchaseId}/receive`,
            {
                items,
            }
        );


    return response.data;

};


const purchaseService = {

    getPurchases,

    getPurchaseByNumber,

    createPurchase,

    submitPurchase,

    receivePurchase,

};


export default purchaseService;