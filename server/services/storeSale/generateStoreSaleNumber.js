const Counter =
    require("../../models/Counter");


const generateStoreSaleNumber =
    async session => {

        const counter =
            await Counter.findOneAndUpdate(

                {
                    name:
                        "store_sale",
                },

                {
                    $inc: {
                        sequence:
                            1,
                    },
                },

                {
                    new:
                        true,

                    upsert:
                        true,

                    session,
                }

            );


        return `SS-${counter.sequence
            .toString()
            .padStart(
                6,
                "0"
            )}`;

    };


module.exports =
    generateStoreSaleNumber;
