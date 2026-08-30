import api from "@/lib/api";


const createStoreSale =
    async ({
        items,
        clientRequestId,
        notes = "",
    }) => {

        const response =
            await api.post(
                "/store-sales",
                {
                    items,
                    clientRequestId,
                    notes,
                }
            );


        return response.data;

    };


const getStoreSales =
    async ({
        page = 1,
        limit = 20,
    } = {}) => {

        const response =
            await api.get(
                "/store-sales",
                {
                    params: {
                        page,
                        limit,
                    },
                }
            );


        return response.data;

    };


const getStoreSaleByNumber =
    async saleNumber => {

        const response =
            await api.get(
                `/store-sales/${saleNumber}`
            );


        return response.data;

    };


const storeSaleService = {

    createStoreSale,

    getStoreSales,

    getStoreSaleByNumber,

};


export default storeSaleService;
