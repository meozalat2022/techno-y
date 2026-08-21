const Counter =
    require("../../models/Counter");


const generateReturnNumber = async (
    session
) => {

    const counter =
        await Counter.findOneAndUpdate(

            {
                name:
                    "customerReturn",
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


    return `RET-${counter.sequence
        .toString()
        .padStart(6, "0")}`;

};


module.exports =
    generateReturnNumber;