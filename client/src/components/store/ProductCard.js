import Link from "next/link";

import {
    ShoppingCart,
    ImageOff,
} from "lucide-react";

import SafeImage from
    "@/components/store/SafeImage";


import formatCurrency from
    "@/utils/formatCurrency";

import getOnlineAvailableQuantity from
    "@/utils/getOnlineAvailableQuantity";


export default function ProductCard({
    product,
}) {

    const hasSale =
        Number(product.salePrice) > 0 &&
        Number(product.salePrice) <
            Number(product.regularPrice);


    const price =
        hasSale
            ? product.salePrice
            : product.regularPrice;


    const image =
        product.images?.[0]?.url;


    const onlineAvailableQuantity =
        getOnlineAvailableQuantity(
            product
        );


    const outOfStock =
        onlineAvailableQuantity <=
        0;


    return (

        <article
            className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FFFEFC]
                transition
                hover:-translate-y-0.5
                hover:border-[#D9D0C3]
                hover:shadow-sm
            "
        >

            <Link
                href={
                    `/products/${product.slug}`
                }
                className="
                    relative
                    block
                    aspect-square
                    overflow-hidden
                    bg-[#FAF6EE]
                "
            >

                {
                    image
                        ? (

                            <SafeImage
                                src={image}
                                alt={product.title}
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                    p-4
                                    transition
                                    duration-300
                                    group-hover:scale-105
                                "
                                iconSize={42}
                            />

                        )
                        : (

                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    text-[#B8AFA2]
                                "
                            >
                                <ImageOff
                                    size={42}
                                />
                            </div>

                        )
                }


                {
                    hasSale &&
                    (

                        <span
                            className="
                                absolute
                                right-3
                                top-3
                                rounded-full
                                bg-[#C94A45]
                                px-2.5
                                py-1
                                text-xs
                                font-bold
                                text-white
                            "
                        >
                            عرض
                        </span>

                    )
                }


                {
                    outOfStock &&
                    (
                        <span
                            className="
                                absolute
                                bottom-3
                                right-3
                                rounded-full
                                bg-slate-900/90
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-white
                            "
                        >
                            غير متوفر أونلاين
                        </span>
                    )
                }

            </Link>


            <div
                className="
                    flex
                    flex-1
                    flex-col
                    p-4
                "
            >

                <div
                    className="
                        text-xs
                        text-[#918C84]
                    "
                >
                    {
                        product.category
                            ?.name ||
                        "قطع غيار"
                    }

                    {
                        product.brand?.name
                            ? ` • ${product.brand.name}`
                            : ""
                    }
                </div>


                <Link
                    href={
                        `/products/${product.slug}`
                    }
                    className="
                        mt-2
                        line-clamp-2
                        min-h-[48px]
                        text-sm
                        font-bold
                        leading-6
                        text-[#252525]
                        hover:text-[#1F4E5F]
                    "
                >
                    {product.title}
                </Link>


                <div
                    className="
                        mt-4
                    "
                >

                    <div
                        className="
                            text-lg
                            font-black
                            text-[#252525]
                        "
                    >
                        {
                            formatCurrency(
                                price
                            )
                        }
                    </div>


                    {
                        hasSale &&
                        (

                            <div
                                className="
                                    mt-1
                                    text-xs
                                    text-[#918C84]
                                    line-through
                                "
                            >
                                {
                                    formatCurrency(
                                        product
                                            .regularPrice
                                    )
                                }
                            </div>

                        )
                    }

                </div>


                <div
                    className="
                        mt-auto
                        pt-4
                    "
                >

                    <Link
                        href={
                            `/products/${product.slug}`
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#1F4E5F]
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#173C49]
                        "
                    >

                        <ShoppingCart
                            size={17}
                        />

                        عرض المنتج

                    </Link>

                </div>

            </div>

        </article>

    );

}