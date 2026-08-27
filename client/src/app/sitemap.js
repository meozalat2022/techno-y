import {
    serverFetch,
} from "@/lib/serverApi";


const SITE_URL =
    "https://techno-y.com";

const PAGE_SIZE = 100;


async function getAllProducts() {
    const products = [];
    let page = 1;
    let totalPages = 1;

    do {
        const response =
            await serverFetch(
                `/products?page=${page}&limit=${PAGE_SIZE}&sort=newest`,
                {
                    next: {
                        revalidate: 3600,
                    },
                }
            );

        products.push(
            ...(response.data || [])
        );

        totalPages =
            Math.max(
                1,
                Number(
                    response.pagination
                        ?.pages
                ) || 1
            );

        page += 1;
    } while (
        page <= totalPages
    );

    return products;
}


export default async function sitemap() {
    const now = new Date();

    const staticPages = [
        {
            url: SITE_URL,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url:
                `${SITE_URL}/products`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url:
                `${SITE_URL}/contact`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    let products = [];

    try {
        products =
            await getAllProducts();
    } catch {
        products = [];
    }

    const productPages =
        products
            .filter(
                product =>
                    product?.slug
            )
            .map(
                product => ({
                    url:
                        `${SITE_URL}/products/${product.slug}`,
                    lastModified:
                        product.updatedAt
                            ? new Date(
                                product.updatedAt
                            )
                            : now,
                    changeFrequency:
                        "weekly",
                    priority: 0.8,
                })
            );

    return [
        ...staticPages,
        ...productPages,
    ];
}
