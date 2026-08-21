const Counter =
    require("../../models/Counter");

const generatePurchaseNumber = async (
    session
) => {

    const counter =
        await Counter.findOneAndUpdate(

            {
                name: "purchase",
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

    return `PUR-${counter.sequence
        .toString()
        .padStart(6, "0")}`;

};

module.exports = generatePurchaseNumber;