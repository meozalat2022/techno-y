const API_URL =
    process.env
        .NEXT_PUBLIC_API_URL;


export const serverFetch =
    async (
        path,
        options = {}
    ) => {

        const response =
            await fetch(
                `${API_URL}${path}`,
                {

                    ...options,

                    next: {
                        revalidate:
                            300,

                        ...options.next,
                    },

                }
            );


        if (!response.ok) {

            throw new Error(
                `API request failed: ${response.status}`
            );

        }


        return response.json();

    };