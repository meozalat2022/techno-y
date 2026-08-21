const Counter =
    require("../../models/Counter");


const generateOrderNumber = async (
    session
) => {

    const counter =
        await Counter.findOneAndUpdate(

            {
                name: "order",
            },

            {
                $inc: {
                    sequence: 1,
                },
            },

            {
                new: true,
                upsert: true,
                session,
            }

        );


    return `ORD-${counter.sequence
        .toString()
        .padStart(6, "0")}`;

};


module.exports =
    generateOrderNumber;