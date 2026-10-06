const asyncHandler =
    require(
        "../middleware/asyncHandler"
    );

const notificationService =
    require(
        "../services/notification"
    );

const {
    successResponse,
} = require(
    "../utils/apiResponse"
);


const getNotifications =
    asyncHandler(
        async (req, res) => {

            const notifications =
                await notificationService
                    .getNotifications({
                        limit:
                            req.query.limit,
                    });


            return successResponse(
                res,
                notifications,
                "Notifications retrieved successfully"
            );
        }
    );


const getUnreadCount =
    asyncHandler(
        async (req, res) => {

            const count =
                await notificationService
                    .getUnreadCount();


            return successResponse(
                res,
                {
                    count,
                },
                "Unread notification count retrieved successfully"
            );
        }
    );


const markAsRead =
    asyncHandler(
        async (req, res) => {

            const notification =
                await notificationService
                    .markAsRead(
                        req.params.id
                    );


            if (!notification) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Notification not found",
                    });
            }


            return successResponse(
                res,
                notification,
                "Notification marked as read"
            );
        }
    );


const markAllAsRead =
    asyncHandler(
        async (req, res) => {

            const result =
                await notificationService
                    .markAllAsRead();


            return successResponse(
                res,
                {
                    modifiedCount:
                        result.modifiedCount,
                },
                "All notifications marked as read"
            );
        }
    );


module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
};
