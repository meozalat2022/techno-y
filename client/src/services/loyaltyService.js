import api from "@/lib/api";

const getRules = async () => {
    const response = await api.get("/loyalty/rules");
    return response.data;
};

const getMyLoyalty = async () => {
    const response = await api.get("/loyalty/me");
    return response.data;
};

const getMyTransactions = async ({ page = 1, limit = 20 } = {}) => {
    const response = await api.get("/loyalty/me/transactions", { params: { page, limit } });
    return response.data;
};

const loyaltyService = { getRules, getMyLoyalty, getMyTransactions };
export default loyaltyService;
