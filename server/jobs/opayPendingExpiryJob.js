const mongoose =
    require("mongoose");

const expirePendingOpayOrders =
    require(
        "../services/payment/expirePendingOpayOrders"
    );


const getIntervalMinutes = () => {

    const configured =
        Number(
            process.env
                .OPAY_PENDING_EXPIRY_CHECK_INTERVAL_MINUTES
        );


    if (
        Number.isFinite(
            configured
        ) &&
        configured > 0
    ) {

        return configured;

    }


    return 5;

};


const startOpayPendingExpiryJob =
    () => {

        const intervalMinutes =
            getIntervalMinutes();


        const run =
            async () => {

                /*
                 * server.js currently starts MongoDB
                 * asynchronously, so simply skip a cycle
                 * until the connection is ready.
                 */
                if (
                    mongoose.connection
                        .readyState !== 1
                ) {
                    return;
                }


                try {

                    const result =
                        await expirePendingOpayOrders();


                    if (
                        result.checked > 0
                    ) {

                        console.log(
                            `[OPay expiry] checked ${result.checked} pending order(s).`,
                            result.results
                        );

                    }

                } catch (error) {

                    console.error(
                        "[OPay expiry] job failed:",
                        error.message
                    );

                }

            };


        const timer =
            setInterval(
                run,
                intervalMinutes *
                    60 *
                    1000
            );


        /*
         * Do not run immediately on server startup.
         * The first sweep happens after the configured
         * interval, which also gives MongoDB time to connect.
         */
        return () =>
            clearInterval(
                timer
            );

    };


module.exports =
    startOpayPendingExpiryJob;
