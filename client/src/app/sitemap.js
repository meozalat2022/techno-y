import {
    serverFetch,
} from "@/lib/serverApi";


const SITE_URL =
    "https://techno-y.com";


export default async function sitemap() {

    const staticPages = [

        {
            url:
                SITE_URL,

            lastModified:
                new Date(),

            changeFrequency:
                "daily",

            priority:
                1,
        },

        {
            url:
                `${SITE_URL}/products`,

            lastModified:
                new Date(),

            changeFrequency:
                "daily",

            priority:
                0.9,
        },

        {
            url:
                `${SITE_URL}/contact`,

            lastModified:
                new Date(),

            changeFrequency:
                "monthly",

            priority:
                0.6,
        },

    ];


    let products = [];


    try {

        const response =
            await serverFetch(
                "/products?page=1&limit=100&sort=newest",
                {
                    next: {
                        revalidate:
                            3600,
                    },
                }
            );


        products =
            response.data ||
            [];

    } catch {

        products = [];

    }


    const productPages =
        products.map(
            product => ({

                url:
                    `${SITE_URL}/products/${product.slug}`,

                lastModified:
                    product.updatedAt
                        ? new Date(
                            product.updatedAt
                        )
                        : new Date(),

                changeFrequency:
                    "weekly",

                priority:
                    0.8,

            })
        );


    return [

        ...staticPages,

        ...productPages,

    ];

}