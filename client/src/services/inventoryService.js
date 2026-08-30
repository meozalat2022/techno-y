import api from "@/lib/api";


const getInventoryHistory = async ({
    productId,
    page = 1,
    limit = 20,
}) => {

    const response =
        await api.get(
            `/inventory/product/${productId}`,
            {
                params: {
                    page,
                    limit,
                },
            }
        );


    return response.data;

};


const adjustStock = async ({
    productId,
    quantity,
    operation,
    reason,
}) => {

    const response =
        await api.post(
            "/inventory/adjust",
            {
                productId,
                quantity,
                operation,
                reason,
            }
        );


    return response.data;

};


const setOnlineSafetyStock =
    async ({
        productId,
        onlineSafetyStock,
    }) => {

        const response =
            await api.put(
                `/inventory/product/${productId}/safety-stock`,
                {
                    onlineSafetyStock,
                }
            );


        return response.data;

    };


const inventoryService = {

    getInventoryHistory,

    adjustStock,

    setOnlineSafetyStock,

};


export default inventoryService;