import api from "@/lib/api";


const getBrands = async () => {

    const response =
        await api.get(
            "/brands"
        );


    return response.data;

};


const getAdminBrands =
    async () => {

        const response =
            await api.get(
                "/brands/admin/all"
            );


    return response.data;

};


const createBrand =
    async payload => {

        const response =
            await api.post(
                "/brands",
                payload
            );


        return response.data;

};


const updateBrand =
    async (
        id,
        payload
    ) => {

        const response =
            await api.put(
                `/brands/${id}`,
                payload
            );


        return response.data;

};


const deleteBrand =
    async id => {

        const response =
            await api.delete(
                `/brands/${id}`
            );


        return response.data;

};


const brandService = {

    getBrands,

    getAdminBrands,

    createBrand,

    updateBrand,

    deleteBrand,

};


export default brandService;
