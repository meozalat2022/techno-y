const requestOpay = async ({
    url,
    headers,
    bodyText,
}) => {

    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () =>
                controller.abort(),
            15000
        );


    try {

        const response =
            await fetch(
                url,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",

                        ...headers,

                    },

                    body:
                        bodyText,

                    signal:
                        controller.signal,

                }
            );


        const text =
            await response.text();


        let data;


        try {

            data =
                text
                    ? JSON.parse(text)
                    : {};

        } catch {

            data = {
                raw: text,
            };

        }


        if (!response.ok) {

            const error =
                new Error(
                    data?.message ||
                    `OPay request failed with HTTP ${response.status}.`
                );

            error.statusCode =
                response.status;

            error.opayResponse =
                data;

            throw error;

        }


        return data;

    } catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "OPay request timed out."
            );

        }


        throw error;

    } finally {

        clearTimeout(
            timeout
        );

    }

};


module.exports =
    requestOpay;
