const Counter = require("../../models/Counter");

const generateAdjustmentNumber = async (session) => {

    const counter = await Counter.findOneAndUpdate(
        { name: "adjustment" },
        { $inc: { sequence: 1 } },
        {
            returnDocument: "after",
            upsert: true,
            session,
        }
    );

    return `ADJ-${counter.sequence
        .toString()
        .padStart(6, "0")}`;

};

module.exports = generateAdjustmentNumber;