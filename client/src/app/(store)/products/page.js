import {
    Suspense,
} from "react";

import ProductCatalog from
    "@/components/store/products/ProductCatalog";


export const metadata = {

    title:
        "قطع غيار الأجهزة المنزلية",

    description:
        "تصفح قطع غيار الأجهزة المنزلية من تكنو-واي، وابحث حسب نوع القطعة والماركة والقسم والموديل.",

    alternates: {

        canonical:
            "/products",

    },

    openGraph: {

        title:
            "قطع غيار الأجهزة المنزلية | تكنو-واي",

        description:
            "تصفح منتجات وقطع غيار الأجهزة المنزلية المتوفرة لدى تكنو-واي.",

        url:
            "/products",

        type:
            "website",

    },

};


export default function ProductsPage() {

    return (

        <Suspense
            fallback={
                <CatalogFallback />
            }
        >

            <ProductCatalog />

        </Suspense>

    );

}


function CatalogFallback() {

    return (

        <div
            className="
                mx-auto
                max-w-7xl
                px-4
                py-16
                sm:px-6
                lg:px-8
            "
        >

            <div
                className="
                    h-8
                    w-48
                    animate-pulse
                    rounded-lg
                    bg-slate-200
                "
            />


            <div
                className="
                    mt-8
                    grid
                    grid-cols-2
                    gap-4
                    md:grid-cols-3
                    xl:grid-cols-4
                "
            >

                {
                    Array.from({
                        length: 8,
                    }).map(
                        (_, index) => (

                            <div
                                key={index}
                                className="
                                    aspect-[3/4]
                                    animate-pulse
                                    rounded-2xl
                                    bg-slate-100
                                "
                            />

                        )
                    )
                }

            </div>

        </div>

    );

}