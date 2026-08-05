const Counter = require("../../models/Counter");

const generateOrderNumber = async (session) => {

    let counter = await Counter.findOne(
        { name: "order" },
        null,
        { session }
    );

    if (!counter) {

        counter = new Counter({
            name: "order",
            sequence: 0,
        });

    }

    counter.sequence += 1;

    await counter.save({ session });

    return `ORD-${counter.sequence
        .toString()
        .padStart(6, "0")}`;

};

module.exports = generateOrderNumber;