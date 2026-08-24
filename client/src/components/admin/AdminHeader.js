"use client";


import {
    useRouter,
} from "next/navigation";

import {
    LogOut,
    Menu,
} from "lucide-react";

import authService from
    "@/services/authService";

import ar from
    "@/locales/ar";


export default function AdminHeader({
    onMenuOpen,
}) {

    const router =
        useRouter();


    const handleLogout =
        async () => {

            try {

                await authService
                    .logout();

            } finally {

                router.push(
                    "/login"
                );

            }

        };


    return (
        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-16
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white/95
                px-4
                backdrop-blur
                sm:px-6
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >
                <button
                    type="button"
                    onClick={
                        onMenuOpen
                    }
                    aria-label={
                        ar.common.menu
                    }
                    className="
                        rounded-lg
                        border
                        border-slate-300
                        p-2
                        text-slate-700
                        hover:bg-slate-50
                        lg:hidden
                    "
                >
                    <Menu
                        size={19}
                    />
                </button>


                <div>
                    <h2
                        className="
                            font-semibold
                            text-slate-900
                        "
                    >
                        {
                            ar.admin
                                .administration
                        }
                    </h2>

                    <p
                        className="
                            hidden
                            text-xs
                            text-slate-400
                            sm:block
                        "
                    >
                        تكنو-واي
                    </p>
                </div>
            </div>


            <button
                type="button"
                onClick={
                    handleLogout
                }
                className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-300
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                "
            >
                <LogOut
                    size={16}
                />

                <span
                    className="
                        hidden
                        sm:inline
                    "
                >
                    {
                        ar.common.logout
                    }
                </span>
            </button>

        </header>
    );

}