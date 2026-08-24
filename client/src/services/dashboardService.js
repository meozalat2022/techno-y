import api from "@/lib/api";


const getDashboardStats =
    async () => {

        const response =
            await api.get(
                "/orders/dashboard"
            );


        return response.data;

    };


const dashboardService = {

    getDashboardStats,

};


export default dashboardService;