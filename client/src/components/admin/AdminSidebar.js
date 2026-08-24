"use client";


import Link from "next/link";

import {
    usePathname,
} from "next/navigation";

import {
    Boxes,
    ClipboardList,
    LayoutDashboard,
    Package,
    RotateCcw,
    ShoppingCart,
    Truck,
    Undo2,
    X,
} from "lucide-react";

import ar from
    "@/locales/ar";


const links = [

    {
        label:
            ar.admin.dashboard,

        href:
            "/admin/dashboard",

        icon:
            LayoutDashboard,
    },

    {
        label:
            ar.admin.products,

        href:
            "/admin/products",

        icon:
            Package,
    },

    {
        label:
            ar.admin.inventory,

        href:
            "/admin/inventory",

        icon:
            Boxes,
    },

    {
        label:
            ar.admin.suppliers,

        href:
            "/admin/suppliers",

        icon:
            Truck,
    },

    {
        label:
            ar.admin.purchases,

        href:
            "/admin/purchases",

        icon:
            ClipboardList,
    },

    {
        label:
            ar.admin.orders,

        href:
            "/admin/orders",

        icon:
            ShoppingCart,
    },

    {
        label:
            ar.admin.customerReturns,

        href:
            "/admin/customer-returns",

        icon:
            RotateCcw,
    },

    {
        label:
            ar.admin.supplierReturns,

        href:
            "/admin/supplier-returns",

        icon:
            Undo2,
    },

];


export default function AdminSidebar({
    mobileOpen = false,
    onClose,
}) {

    const pathname =
        usePathname();


    return (
        <>
            <aside
                className="
                    sticky
                    top-0
                    hidden
                    h-screen
                    w-64
                    shrink-0
                    overflow-y-auto
                    bg-slate-950
                    text-white
                    lg:block
                "
            >
                <SidebarContent
                    pathname={
                        pathname
                    }
                />
            </aside>


            {mobileOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        lg:hidden
                    "
                >
                    <button
                        type="button"
                        aria-label={
                            ar.common
                                .closeMenu
                        }
                        onClick={
                            onClose
                        }
                        className="
                            absolute
                            inset-0
                            bg-black/40
                        "
                    />


                    <aside
                        className="
                            absolute
                            right-0
                            top-0
                            h-full
                            w-[280px]
                            max-w-[85vw]
                            overflow-y-auto
                            bg-slate-950
                            text-white
                            shadow-2xl
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-slate-800
                                px-5
                                py-4
                            "
                        >
                            <div>
                                <div
                                    className="
                                        text-lg
                                        font-bold
                                    "
                                >
                                    تكنو-واي
                                </div>

                                <div
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    {
                                        ar.admin
                                            .administration
                                    }
                                </div>
                            </div>


                            <button
                                type="button"
                                onClick={
                                    onClose
                                }
                                aria-label={
                                    ar.common
                                        .closeMenu
                                }
                                className="
                                    rounded-lg
                                    p-2
                                    text-slate-300
                                    hover:bg-slate-900
                                    hover:text-white
                                "
                            >
                                <X
                                    size={20}
                                />
                            </button>
                        </div>


                        <SidebarLinks
                            pathname={
                                pathname
                            }
                            onNavigate={
                                onClose
                            }
                        />
                    </aside>
                </div>
            )}
        </>
    );

}


function SidebarContent({
    pathname,
}) {

    return (
        <>
            <div
                className="
                    border-b
                    border-slate-800
                    px-6
                    py-6
                "
            >
                <div
                    className="
                        text-xl
                        font-bold
                    "
                >
                    تكنو-واي
                </div>

                <div
                    className="
                        mt-1
                        text-xs
                        text-slate-400
                    "
                >
                    {
                        ar.admin
                            .administration
                    }
                </div>
            </div>


            <SidebarLinks
                pathname={
                    pathname
                }
            />
        </>
    );

}


function SidebarLinks({
    pathname,
    onNavigate,
}) {

    return (
        <nav
            className="
                space-y-1
                p-4
            "
        >
            {links.map(
                link => {

                    const Icon =
                        link.icon;


                    const active =
                        pathname ===
                            link.href ||
                        pathname.startsWith(
                            `${link.href}/`
                        );


                    return (
                        <Link
                            key={
                                link.href
                            }
                            href={
                                link.href
                            }
                            onClick={
                                onNavigate
                            }
                            className={`
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-sm
                                transition
                                ${
                                    active
                                        ? "bg-white text-slate-950"
                                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                                }
                            `}
                        >
                            <Icon
                                size={18}
                            />

                            {
                                link.label
                            }
                        </Link>
                    );

                }
            )}
        </nav>
    );

}