import api from "@/lib/api";


const getCategories = async () => {

    const response =
        await api.get(
            "/categories"
        );


    return response.data;

};


const getFeaturedProducts = async (
    limit = 8
) => {

    const response =
        await api.get(
            "/products",
            {
                params: {
                    featured: true,
                    limit,
                    page: 1,
                    sort: "newest",
                },
            }
        );


    return response.data;

};


const getNewestProducts = async (
    limit = 8
) => {

    const response =
        await api.get(
            "/products",
            {
                params: {
                    limit,
                    page: 1,
                    sort: "newest",
                },
            }
        );


    return response.data;

};


const storeHomeService = {

    getCategories,

    getFeaturedProducts,

    getNewestProducts,

};


export default storeHomeService;