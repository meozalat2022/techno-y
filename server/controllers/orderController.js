const MESSAGES = require("../constants/messages");
const asyncHandler = require("../middleware/asyncHandler");
const orderService = require("../services/order");
const { successResponse } = require("../utils/apiResponse");

const createOrder = asyncHandler(async (req, res) => {

    console.log("Passing user to saveOrder:", req.user);

    const result = await orderService.createOrder({

        ...req.body,

        user: req.user,

    });

    return successResponse(
        res,
        result,
        MESSAGES.ORDER.CREATED,
        201
    );

});

const getOrderByNumber = asyncHandler(async (req, res) => {

    const order =
        await orderService.getOrderByNumber(
            req.params.orderNumber
        );

    return successResponse(
        res,
        order,
        MESSAGES.ORDER.RETRIEVED
    );

});

const getOrders = asyncHandler(async (req, res) => {

    const result =
        await orderService.getOrders(req.query);

    return successResponse(

        res,

        result.orders,

        MESSAGES.ORDER.LIST_RETRIEVED,

        200,

        result.pagination

    );

});
const updateOrderStatus = asyncHandler(async (req, res) => {

    const order =
        await orderService.updateOrderStatus(
            req.params.orderNumber,
            req.body.status
        );

    return successResponse(
        res,
        order,
        MESSAGES.ORDER.STATUS_UPDATED
    );

});

const getDashboardStats = asyncHandler(async (req, res) => {

    const stats =
        await orderService.getDashboardStats();

    return successResponse(
        res,
        stats,
        MESSAGES.ORDER.DASHBOARD_RETRIEVED
    );

});

const getMyOrders =
asyncHandler(async (req, res) => {

    const result =
        await orderService.getMyOrders(
            req.user._id,
            req.query
        );

    return successResponse(

        res,

        result,

        MESSAGES.ORDER.RETRIEVED

    );

});

const getMyOrderByNumber =
asyncHandler(async (req, res) => {

    const order =
    await orderService.createOrder({
        ...req.body,
        user: req.user,
    });

    return successResponse(

        res,

        order,

        MESSAGES.ORDER.RETRIEVED

    );

});
module.exports = {
    createOrder,
    getOrderByNumber,
    getOrders,
    updateOrderStatus,
    getDashboardStats,
    getMyOrders,
    getMyOrderByNumber,
};
