import api from "@/lib/api";


const getSuppliers = async ({
    page = 1,
    limit = 20,
    search = "",
}) => {

    const response =
        await api.get(
            "/suppliers",
            {
                params: {
                    page,
                    limit,
                    search,
                },
            }
        );


    return response.data;

};


const getSupplier = async (
    supplierId
) => {

    const response =
        await api.get(
            `/suppliers/${supplierId}`
        );


    return response.data;

};


const createSupplier = async (
    supplierData
) => {

    const response =
        await api.post(
            "/suppliers",
            supplierData
        );


    return response.data;

};


const updateSupplier = async (
    supplierId,
    supplierData
) => {

    const response =
        await api.put(
            `/suppliers/${supplierId}`,
            supplierData
        );


    return response.data;

};


const deleteSupplier = async (
    supplierId
) => {

    const response =
        await api.delete(
            `/suppliers/${supplierId}`
        );


    return response.data;

};


const supplierService = {

    getSuppliers,

    getSupplier,

    createSupplier,

    updateSupplier,

    deleteSupplier,

};


export default supplierService;