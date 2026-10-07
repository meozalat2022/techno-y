"use client";


import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";


const ToastContext =
    createContext(null);


export function ToastProvider({
    children,
}) {

    const [
        toast,
        setToast,
    ] =
        useState(null);


    const showToast =
        useCallback(
            (
                message,
                type = "success"
            ) => {

                setToast({
                    id:
                        Date.now(),
                    message,
                    type,
                });


                setTimeout(
                    () => {

                        setToast(
                            null
                        );

                    },
                    2500
                );

            },
            []
        );


    const hideToast =
        useCallback(
            () => {

                setToast(
                    null
                );

            },
            []
        );


    const value =
        useMemo(
            () => ({

                showToast,

                hideToast,

            }),
            [
                showToast,
                hideToast,
            ]
        );


    return (

        <ToastContext.Provider
            value={value}
        >

            {children}


            {
                toast &&
                (

                    <div
                        dir="rtl"
                        className="
                            fixed
                            bottom-5
                            right-5
                            z-[100]
                            max-w-[calc(100vw-2rem)]
                            sm:max-w-sm
                        "
                    >

                        <div
                            role="status"
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                ${
                                    toast.type ===
                                    "error"
                                        ? "bg-[#C94A45]"
                                        : "bg-[#1F4E5F]"
                                }
                            `}
                        >

                            <span>
                                {toast.message}
                            </span>


                            <button
                                type="button"
                                onClick={
                                    hideToast
                                }
                                aria-label="إغلاق"
                                className="
                                    shrink-0
                                    text-white/80
                                    transition
                                    hover:text-white
                                "
                            >
                                ×
                            </button>

                        </div>

                    </div>

                )
            }

        </ToastContext.Provider>

    );

}


export function useToast() {

    const context =
        useContext(
            ToastContext
        );


    if (!context) {

        throw new Error(
            "useToast must be used inside ToastProvider."
        );

    }


    return context;

}