"use client";


import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";


const STORAGE_KEY =
    "technoy-cart-v1";


const CartContext =
    createContext(null);


export function CartProvider({
    children,
}) {

    const [
        items,
        setItems,
    ] =
        useState([]);


    const [
        hydrated,
        setHydrated,
    ] =
        useState(false);


    useEffect(
        () => {

            try {

                const saved =
                    window.localStorage
                        .getItem(
                            STORAGE_KEY
                        );


                if (saved) {

                    const parsed =
                        JSON.parse(
                            saved
                        );


                    if (
                        Array.isArray(
                            parsed
                        )
                    ) {

                        setItems(
                            parsed
                        );

                    }

                }

            } catch {

                window.localStorage
                    .removeItem(
                        STORAGE_KEY
                    );

            } finally {

                setHydrated(
                    true
                );

            }

        },
        []
    );


    useEffect(
        () => {

            if (!hydrated) {
                return;
            }


            window.localStorage
                .setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        items
                    )
                );

        },
        [
            items,
            hydrated,
        ]
    );


    const addItem =
        useCallback(
            (
                product,
                quantity = 1
            ) => {

                if (
                    !product ||
                    product.stockQuantity <= 0
                ) {

                    return {
                        success: false,
                        message:
                            "المنتج غير متوفر حالياً.",
                    };

                }


                const requestedQuantity =
                    Math.max(
                        1,
                        Number(quantity) ||
                        1
                    );


                let result = {
                    success: true,
                    message:
                        "تمت إضافة المنتج إلى السلة.",
                };


                setItems(
                    previous => {

                        const existing =
                            previous.find(
                                item =>
                                    item.productId ===
                                    product._id
                            );


                        if (existing) {

                            const nextQuantity =
                                Math.min(
                                    existing.quantity +
                                        requestedQuantity,
                                    product.stockQuantity
                                );


                            if (
                                nextQuantity ===
                                existing.quantity
                            ) {

                                result = {
                                    success: false,
                                    message:
                                        "تم الوصول إلى أقصى كمية متاحة من هذا المنتج.",
                                };


                                return previous;

                            }


                            return previous.map(
                                item =>
                                    item.productId ===
                                    product._id
                                        ? {
                                            ...item,

                                            quantity:
                                                nextQuantity,

                                            stockQuantity:
                                                product.stockQuantity,

                                            regularPrice:
                                                product.regularPrice,

                                            salePrice:
                                                product.salePrice,

                                            title:
                                                product.title,

                                            slug:
                                                product.slug,

                                            sku:
                                                product.sku,

                                            image:
                                                product.images?.[0] ||
                                                null,

                                            brand:
                                                product.brand?.name ||
                                                "",

                                            category:
                                                product.category?.name ||
                                                "",

                                            isBundle:
                                                Boolean(
                                                    product.isBundle
                                                ),
                                        }
                                        : item
                            );

                        }


                        return [
                            ...previous,

                            {
                                productId:
                                    product._id,

                                slug:
                                    product.slug,

                                title:
                                    product.title,

                                sku:
                                    product.sku,

                                image:
                                    product.images?.[0] ||
                                    null,

                                brand:
                                    product.brand?.name ||
                                    "",

                                category:
                                    product.category?.name ||
                                    "",

                                regularPrice:
                                    product.regularPrice,

                                salePrice:
                                    product.salePrice,

                                stockQuantity:
                                    product.stockQuantity,

                                quantity:
                                    Math.min(
                                        requestedQuantity,
                                        product.stockQuantity
                                    ),

                                isBundle:
                                    Boolean(
                                        product.isBundle
                                    ),
                            },
                        ];

                    }
                );


                return result;

            },
            []
        );


    const updateQuantity =
        useCallback(
            (
                productId,
                quantity
            ) => {

                const parsedQuantity =
                    Number(quantity);


                setItems(
                    previous =>
                        previous.map(
                            item => {

                                if (
                                    item.productId !==
                                    productId
                                ) {

                                    return item;

                                }


                                const safeQuantity =
                                    Math.max(
                                        1,
                                        Math.min(
                                            parsedQuantity ||
                                                1,
                                            item.stockQuantity
                                        )
                                    );


                                return {
                                    ...item,

                                    quantity:
                                        safeQuantity,
                                };

                            }
                        )
                );

            },
            []
        );


    const removeItem =
        useCallback(
            productId => {

                setItems(
                    previous =>
                        previous.filter(
                            item =>
                                item.productId !==
                                productId
                        )
                );

            },
            []
        );


    const replaceItems =
        useCallback(
            nextItems => {

                if (
                    !Array.isArray(
                        nextItems
                    )
                ) {
                    return;
                }


                setItems(
                    nextItems
                );

            },
            []
        );


    const clearCart =
        useCallback(
            () => {

                setItems([]);
            },
            []
        );


    const itemCount =
        useMemo(
            () =>
                items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.quantity,
                    0
                ),
            [
                items,
            ]
        );


    const subtotal =
        useMemo(
            () =>
                items.reduce(
                    (
                        total,
                        item
                    ) => {

                        const hasSale =
                            Number(
                                item.salePrice
                            ) > 0 &&
                            Number(
                                item.salePrice
                            ) <
                            Number(
                                item.regularPrice
                            );


                        const price =
                            hasSale
                                ? Number(
                                    item.salePrice
                                )
                                : Number(
                                    item.regularPrice
                                );


                        return (
                            total +
                            price *
                                item.quantity
                        );

                    },
                    0
                ),
            [
                items,
            ]
        );


    const value =
        useMemo(
            () => ({

                items,

                hydrated,

                itemCount,

                subtotal,

                addItem,

                updateQuantity,

                removeItem,

                replaceItems,

                clearCart,

            }),
            [
                items,
                hydrated,
                itemCount,
                subtotal,
                addItem,
                updateQuantity,
                removeItem,
                replaceItems,
                clearCart,
            ]
        );


    return (

        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>

    );

}


export function useCart() {

    const context =
        useContext(
            CartContext
        );


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider."
        );

    }


    return context;

}