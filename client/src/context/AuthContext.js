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

                }

            },
            []
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

            }),
            [
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
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