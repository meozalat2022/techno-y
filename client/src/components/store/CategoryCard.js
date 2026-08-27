import Link from "next/link";

import {
    ArrowLeft,
    Boxes,
} from "lucide-react";

import SafeImage from
    "@/components/store/SafeImage";


export default function CategoryCard({
    category,
}) {

    return (

        <Link
            href={
                `/products?category=${category._id}`
            }
            className="
                group
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

            <div
                className="
                    aspect-[4/3]
                    overflow-hidden
                    bg-[#F4EEE4]
                "
            >

                {
                    category.image
                        ? (

                            <SafeImage
                                src={category.image}
                                alt={category.name}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition
                                    duration-300
                                    group-hover:scale-105
                                "
                                iconSize={44}
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

                                <Boxes
                                    size={44}
                                />

                            </div>

                        )
                }

            </div>


            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-4
                "
            >

                <div
                    className="
                        font-bold
                        text-[#252525]
                    "
                >
                    {category.name}
                </div>


                <ArrowLeft
                    size={17}
                    className="
                        text-[#918C84]
                        transition
                        group-hover:-translate-x-1
                        group-hover:text-[#1F4E5F]
                    "
                />

            </div>

        </Link>

    );

}