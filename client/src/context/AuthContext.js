"use client";


import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import authService from
    "@/services/authService";

import wishlistService from
    "@/services/wishlistService";


const AuthContext =
    createContext(null);


export function AuthProvider({
    children,
}) {

    const [
        user,
        setUser,
    ] =
        useState(null);


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        wishlist,
        setWishlist,
    ] =
        useState([]);


    const [
        wishlistLoading,
        setWishlistLoading,
    ] =
        useState(false);


    const refreshWishlist =
        useCallback(
            async () => {

                setWishlistLoading(
                    true
                );

                try {

                    const response =
                        await wishlistService
                            .getWishlist();


                    const products =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : [];


                    setWishlist(
                        products
                    );


                    return products;


                } catch {

                    setWishlist([]);

                    return [];


                } finally {

                    setWishlistLoading(
                        false
                    );

                }

            },
            []
        );


    const refreshUser =
        useCallback(
            async () => {

                try {

                    const response =
                        await authService
                            .getCurrentUser();


                    setUser(
                        response.data
                    );


                    return response.data;


                } catch {

                    setUser(null);

                    setWishlist([]);

                    return null;


                } finally {

                    setLoading(false);

                }

            },
            []
        );


    useEffect(
        () => {

            refreshUser();

        },
        [
            refreshUser,
        ]
    );


    useEffect(
        () => {

            if (user) {

                refreshWishlist();

            } else {

                setWishlist([]);

            }

        },
        [
            user,
            refreshWishlist,
        ]
    );


    const login =
        useCallback(
            async credentials => {

                const response =
                    await authService
                        .login(
                            credentials
                        );


                setUser(
                    response.data
                );


                return response.data;

            },
            []
        );


    const register =
        useCallback(
            async data => {

                const response =
                    await authService
                        .register(
                            data
                        );


                setUser(
                    response.data
                );


                return response.data;

            },
            []
        );


    const logout =
        useCallback(
            async () => {

                try {

                    await authService
                        .logout();

                } finally {

                    setUser(null);

                    setWishlist([]);

                }

            },
            []
        );


    const addWishlistItem =
        useCallback(
            async productId => {

                const response =
                    await wishlistService
                        .addToWishlist(
                            productId
                        );


                await refreshWishlist();


                return response.data;

            },
            [
                refreshWishlist,
            ]
        );


    const removeWishlistItem =
        useCallback(
            async productId => {

                const response =
                    await wishlistService
                        .removeFromWishlist(
                            productId
                        );


                setWishlist(
                    current =>
                        current.filter(
                            product =>
                                product._id !==
                                productId
                        )
                );


                return response.data;

            },
            []
        );


    const isInWishlist =
        useCallback(
            productId => {

                return wishlist.some(
                    product =>
                        product._id ===
                        productId
                );

            },
            [
                wishlist,
            ]
        );


    const value =
        useMemo(
            () => ({

                user,

                loading,

                isAuthenticated:
                    Boolean(user),

                login,

                register,

                logout,

                refreshUser,

                wishlist,

                wishlistLoading,

                wishlistCount:
                    wishlist.length,

                refreshWishlist,

                addWishlistItem,

                removeWishlistItem,

                isInWishlist,

            }),
            [
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
                wishlist,
                wishlistLoading,
                refreshWishlist,
                addWishlistItem,
                removeWishlistItem,
                isInWishlist,
            ]
        );


    return (

        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>

    );

}


export function useAuth() {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );

    }


    return context;

}