"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ImageOff,
} from "lucide-react";


export default function ProductGallery({
    images = [],
    title,
}) {

    const [
        selectedIndex,
        setSelectedIndex,
    ] = useState(0);

    const [
        failedImages,
        setFailedImages,
    ] = useState({});


    useEffect(
        () => {
            setSelectedIndex(0);
            setFailedImages({});
        },
        [images]
    );


    const selectedImage =
        images[selectedIndex];

    const selectedFailed =
        !selectedImage?.url ||
        failedImages[selectedIndex];


    const markFailed = index => {
        setFailedImages(
            previous => ({
                ...previous,
                [index]: true,
            })
        );
    };


    return (

        <div>

            <div
                className="
                    aspect-square
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#E7E0D5]
                    bg-[#FFFEFC]
                "
            >

                {
                    !selectedFailed
                        ? (

                            <img
                                src={selectedImage.url}
                                alt={title}
                                onError={() =>
                                    markFailed(
                                        selectedIndex
                                    )
                                }
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                    p-5
                                    sm:p-8
                                "
                            />

                        )
                        : (

                            <ImageFallback />

                        )
                }

            </div>


            {
                images.length > 1 && (

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-4
                            gap-3
                        "
                    >

                        {
                            images.map(
                                (
                                    image,
                                    index
                                ) => {

                                    const active =
                                        index ===
                                        selectedIndex;

                                    const failed =
                                        !image?.url ||
                                        failedImages[index];


                                    return (

                                        <button
                                            key={
                                                image.publicId ||
                                                index
                                            }
                                            type="button"
                                            onClick={() =>
                                                setSelectedIndex(
                                                    index
                                                )
                                            }
                                            aria-label={
                                                `عرض صورة ${index + 1} من ${title}`
                                            }
                                            className={`
                                                aspect-square
                                                overflow-hidden
                                                rounded-xl
                                                border
                                                bg-[#FFFEFC]
                                                transition
                                                ${
                                                    active
                                                        ? "border-[#1F4E5F] ring-1 ring-[#1F4E5F]"
                                                        : "border-[#E7E0D5] hover:border-[#C8BBAA]"
                                                }
                                            `}
                                        >

                                            {
                                                failed
                                                    ? (

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
                                                                size={24}
                                                            />
                                                        </div>

                                                    )
                                                    : (

                                                        <img
                                                            src={image.url}
                                                            alt=""
                                                            onError={() =>
                                                                markFailed(
                                                                    index
                                                                )
                                                            }
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-contain
                                                                p-2
                                                            "
                                                        />

                                                    )
                                            }

                                        </button>

                                    );

                                }
                            )
                        }

                    </div>

                )
            }

        </div>

    );

}


function ImageFallback() {

    return (

        <div
            className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                gap-3
                px-6
                text-center
                text-[#918C84]
            "
        >

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#FAF6EE]
                    text-[#B8AFA2]
                "
            >
                <ImageOff size={28} />
            </div>

            <p
                className="
                    text-sm
                    font-semibold
                "
            >
                الصورة غير متاحة حاليًا
            </p>

        </div>

    );

}
