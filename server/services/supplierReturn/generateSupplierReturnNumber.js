const Counter =
    require("../../models/Counter");


const generateSupplierReturnNumber =
    async (session) => {

        const counter =
            await Counter.findOneAndUpdate(

                {
                    name:
                        "supplierReturn",
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


        return `SRET-${counter.sequence
            .toString()
            .padStart(6, "0")}`;

    };


module.exports =
    generateSupplierReturnNumber;