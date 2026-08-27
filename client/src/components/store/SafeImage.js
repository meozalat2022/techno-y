"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ImageOff,
} from "lucide-react";

export default function SafeImage({
    src,
    alt = "",
    className = "",
    fallbackClassName = "",
    iconSize = 34,
}) {
    const [failed, setFailed] =
        useState(false);

    useEffect(
        () => {
            setFailed(false);
        },
        [src]
    );

    if (!src || failed) {
        return (
            <div
                role="img"
                aria-label={
                    alt ||
                    "لا توجد صورة"
                }
                className={`
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-[#FAF6EE]
                    text-[#B8AFA2]
                    ${fallbackClassName}
                `}
            >
                <ImageOff
                    size={iconSize}
                    aria-hidden="true"
                />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() =>
                setFailed(true)
            }
        />
    );
}
