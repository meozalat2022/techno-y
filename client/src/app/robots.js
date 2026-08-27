export default function robots() {

    return {

        rules: [

            {

                userAgent:
                    "*",

                allow:
                    "/",

                disallow: [

                    "/admin/",

                    "/login",

                    "/account/",

                    "/cart",

                    "/checkout",

                    "/payment/",

                ],

            },

        ],

        sitemap:
            "https://techno-y.com/sitemap.xml",

        host:
            "https://techno-y.com",

    };

}