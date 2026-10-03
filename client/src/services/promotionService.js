import api from "@/lib/api";

const validatePromoCode = async ({ code, subtotal }) => {
    const response = await api.post(
        "/promotions/validate",
        { code, subtotal }
    );
    return response.data;
};

const getAdminPromotions = async () => {
    const response = await api.get("/promotions/admin/all");
    return response.data;
};

const createPromotion = async payload => {
    const response = await api.post("/promotions", payload);
    return response.data;
};

const updatePromotion = async (id, payload) => {
    const response = await api.put(`/promotions/${id}`, payload);
    return response.data;
};

const deactivatePromotion = async id => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
};

const promotionService = {
    validatePromoCode,
    getAdminPromotions,
    createPromotion,
    updatePromotion,
    deactivatePromotion,
};

export default promotionService;
