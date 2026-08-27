import api from "@/lib/api";


const createOrder = async (
    orderData
) => {

    const response =
        await api.post(
            "/orders",
            orderData
        );


    return response.data;

};


const getOrders = async ({
    page = 1,
    limit = 20,
    search = "",
    status = "",
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


    const response =
        await api.get(
            "/orders",
            {
                params,
            }
        );


    return response.data;

};


const getOrderByNumber = async (
    orderNumber
) => {

    const response =
        await api.get(
            `/orders/${orderNumber}`
        );


    return response.data;

};


const getMyOrders = async ({
    page = 1,
    limit = 10,
}) => {

    const response =
        await api.get(
            "/orders/my-orders",
            {
                params: {
                    page,
                    limit,
                },
            }
        );


    return response.data;

};


const getMyOrderByNumber = async (
    orderNumber
) => {

    const response =
        await api.get(
            `/orders/my-orders/${orderNumber}`
        );


    return response.data;

};


const updateOrderStatus = async (
    orderNumber,
    status
) => {

    const response =
        await api.patch(
            `/orders/${orderNumber}/status`,
            {
                status,
            }
        );


    return response.data;

};


const createOpayPayment = async (
    orderNumber
) => {

    const response =
        await api.post(
            `/payments/opay/${orderNumber}/create`
        );


    return response.data;

};


const getOpayPaymentStatus = async (
    orderNumber
) => {

    const response =
        await api.get(
            `/payments/opay/${orderNumber}/status`
        );


    return response.data;

};


const closeOpayPayment = async (
    orderNumber
) => {

    const response =
        await api.post(
            `/payments/opay/${orderNumber}/close`
        );


    return response.data;

};


const orderService = {

    createOrder,

    getOrders,

    getOrderByNumber,

    getMyOrders,

    getMyOrderByNumber,

    updateOrderStatus,

    createOpayPayment,

    getOpayPaymentStatus,

    closeOpayPayment,

};


export default orderService;