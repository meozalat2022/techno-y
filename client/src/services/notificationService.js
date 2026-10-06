import api from "@/lib/api";


const getNotifications = async (
    limit = 30
) => {

    const response =
        await api.get(
            "/notifications",
            {
                params: {
                    limit,
                },
            }
        );


    return response.data;
};


const getUnreadCount = async () => {

    const response =
        await api.get(
            "/notifications/unread-count"
        );


    return response.data;
};


const markAsRead = async id => {

    const response =
        await api.patch(
            `/notifications/${id}/read`
        );


    return response.data;
};


const markAllAsRead = async () => {

    const response =
        await api.patch(
            "/notifications/read-all"
        );


    return response.data;
};


const notificationService = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};


export default notificationService;
