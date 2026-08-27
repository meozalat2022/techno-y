import api from "@/lib/api";

const getCategories = async () => {
    const response =
        await api.get(
            "/categories"
        );

    return response.data;
};

const getAdminCategories =
    async () => {
        const response =
            await api.get(
                "/categories/admin/all"
            );

        return response.data;
    };

const createCategory =
    async payload => {
        const response =
            await api.post(
                "/categories",
                payload
            );

        return response.data;
    };

const updateCategory =
    async (
        id,
        payload
    ) => {
        const response =
            await api.put(
                `/categories/${id}`,
                payload
            );

        return response.data;
    };

const deleteCategory =
    async id => {
        const response =
            await api.delete(
                `/categories/${id}`
            );

        return response.data;
    };

const categoryService = {
    getCategories,
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};

export default categoryService;
