import axios from "axios";


const api = axios.create({

    baseURL:
        process.env
            .NEXT_PUBLIC_API_URL,

    withCredentials:
        true,

});


api.interceptors.response.use(

    response =>
        response,

    error => {

        if (
            error.response
                ?.status === 401 &&
            typeof window !==
                "undefined"
        ) {

            const pathname =
                window.location.pathname;


            /*
             * Only Admin pages should be
             * globally redirected on 401.
             *
             * Public storefront pages must
             * allow unauthenticated visitors.
             *
             * Customer account pages handle
             * their own authentication flow.
             */
            if (
                pathname.startsWith(
                    "/admin"
                )
            ) {

                window.location.href =
                    "/login";

            }

        }


        return Promise.reject(
            error
        );

    }

);


export default api;