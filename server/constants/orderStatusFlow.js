const ORDER_STATUS =
    require("./orderStatus");


const ORDER_STATUS_FLOW = {

    [ORDER_STATUS.PENDING]: [

        ORDER_STATUS.CONFIRMED,

        ORDER_STATUS.CANCELLED,

    ],


    [ORDER_STATUS.CONFIRMED]: [

        ORDER_STATUS.PACKED,

        ORDER_STATUS.CANCELLED,

    ],


    [ORDER_STATUS.PROCESSING]: [

        ORDER_STATUS.PACKED,

        ORDER_STATUS.CANCELLED,

    ],


    [ORDER_STATUS.PACKED]: [

        ORDER_STATUS.SHIPPED,

        ORDER_STATUS.CANCELLED,

    ],


    [ORDER_STATUS.SHIPPED]: [

        ORDER_STATUS.DELIVERED,

    ],


    [ORDER_STATUS.DELIVERED]:
        [],


    [ORDER_STATUS.CANCELLED]:
        [],

};


module.exports =
    ORDER_STATUS_FLOW;