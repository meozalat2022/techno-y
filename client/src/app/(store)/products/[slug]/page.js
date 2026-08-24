import ProductDetailsClient from
    "@/components/store/products/ProductDetailsClient";

import {
    serverFetch,
} from "@/lib/serverApi";


const SITE_URL =
    "https://techno-y.com";


const getProduct =
    async slug => {

        try {

            const response =
                await serverFetch(
                    `/products/${slug}`,
                    {
                        next: {
                            revalidate:
                                300,
                        },
                    }
                );


            return (
                response.data ||
                null
            );

        } catch {

            return null;

        }

    };


export async function generateMetadata({
    params,
}) {

    const {
        slug,
    } =
        await params;


    const product =
        await getProduct(
            slug
        );


    if (!product) {

        return {

            title:
                "المنتج غير موجود",

            robots: {
                index:
                    false,
                follow:
                    false,
            },

        };

    }


    const title =
        product.seoTitle ||
        product.title;


    const description =
        product.seoDescription ||
        product.description ||
        `اشتري ${product.title} من تكنو-واي لقطع غيار الأجهزة المنزلية.`;


    const image =
        product.images?.[0]
            ?.url;


    return {

        title,

        description,

        alternates: {

            canonical:
                `/products/${product.slug}`,

        },

        openGraph: {

            title:
                `${title} | تكنو-واي`,

            description,

            url:
                `/products/${product.slug}`,

            type:
                "website",

            images:
                image
                    ? [
                        {
                            url:
                                image,
                            alt:
                                product.title,
                        },
                    ]
                    : [],

        },

        twitter: {

            card:
                "summary_large_image",

            title:
                `${title} | تكنو-واي`,

            description,

            images:
                image
                    ? [
                        image,
                    ]
                    : [],

        },

    };

}


export default async function ProductDetailsPage({
    params,
}) {

    const {
        slug,
    } =
        await params;


    const product =
        await getProduct(
            slug
        );


    return (
        <>

            {
                product &&
                (
                    <ProductStructuredData
                        product={
                            product
                        }
                    />
                )
            }


            <ProductDetailsClient
                slug={slug}
            />

        </>
    );

}


function ProductStructuredData({
    product,
}) {

    const hasSale =
        Number(
            product.salePrice
        ) > 0 &&
        Number(
            product.salePrice
        ) <
        Number(
            product.regularPrice
        );


    const price =
        hasSale
            ? product.salePrice
            : product.regularPrice;


    const structuredData = {

        "@context":
            "https://schema.org",

        "@type":
            "Product",

        name:
            product.title,

        sku:
            product.sku,

        description:
            product.seoDescription ||
            product.description ||
            product.title,

        url:
            `${SITE_URL}/products/${product.slug}`,

        image:
            (
                product.images ||
                []
            ).map(
                image =>
                    image.url
            ),

        brand:
            product.brand?.name
                ? {
                    "@type":
                        "Brand",

                    name:
                        product.brand
                            .name,
                }
                : undefined,

        offers: {

            "@type":
                "Offer",

            priceCurrency:
                "EGP",

            price:
                Number(price),

            availability:
                product.stockQuantity >
                0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",

            url:
                `${SITE_URL}/products/${product.slug}`,

        },

    };


    return (

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html:
                    JSON.stringify(
                        structuredData
                    ).replace(
                        /</g,
                        "\\u003c"
                    ),
            }}
        />

    );

}