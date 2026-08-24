import api from "@/lib/api";


const getProducts = async ({
    page = 1,
    limit = 12,
    search = "",
    category = "",
    brand = "",
    sort = "newest",
    featured = false,
}) => {

    const params = {
        page,
        limit,
        sort,
    };


    if (search) {
        params.search = search;
    }


    if (category) {
        params.category = category;
    }


    if (brand) {
        params.brand = brand;
    }


    if (featured) {
        params.featured = true;
    }


    const response =
        await api.get(
            "/products",
            {
                params,
            }
        );


    return response.data;

};


const getProductBySlug = async (
    slug
) => {

    const response =
        await api.get(
            `/products/${slug}`
        );


    return response.data;

};


const createProduct = async (
    productData
) => {

    const response =
        await api.post(
            "/products",
            productData
        );


    return response.data;

};


const updateProduct = async (
    productId,
    productData
) => {

    const response =
        await api.put(
            `/products/${productId}`,
            productData
        );


    return response.data;

};


const deleteProduct = async (
    productId
) => {

    const response =
        await api.delete(
            `/products/${productId}`
        );


    return response.data;

};


const productService = {

    getProducts,

    getProductBySlug,

    createProduct,

    updateProduct,

    deleteProduct,

};


export default productService;