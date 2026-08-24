"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Banknote,
    CalendarDays,
    CheckCircle2,
    CircleEllipsis,
    CircleX,
    Clock3,
    PackageCheck,
    RefreshCw,
    ShoppingCart,
    Truck,
} from "lucide-react";

import dashboardService from
    "@/services/dashboardService";

import ar from
    "@/locales/ar";


const formatCurrency = value => {

    return new Intl.NumberFormat(
        "ar-EG",
        {
            style: "currency",
            currency: "EGP",
            maximumFractionDigits: 2,
        }
    ).format(
        Number(value) || 0
    );

};


const formatNumber = value => {

    return new Intl.NumberFormat(
        "ar-EG"
    ).format(
        Number(value) || 0
    );

};


function StatCard({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-3
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {value}
                    </p>

                </div>


                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-700
                    "
                >

                    <Icon
                        size={21}
                    />

                </div>

            </div>

        </div>

    );

}


function StatusCard({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-100
                        text-slate-600
                    "
                >

                    <Icon
                        size={19}
                    />

                </div>


                <span
                    className="
                        text-sm
                        font-medium
                        text-slate-700
                    "
                >
                    {title}
                </span>

            </div>


            <span
                className="
                    text-xl
                    font-bold
                    text-slate-900
                "
            >
                {formatNumber(value)}
            </span>

        </div>

    );

}


export default function DashboardPage() {

    const [
        stats,
        setStats,
    ] =
        useState(null);


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        error,
        setError,
    ] =
        useState("");


    const loadDashboard =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await dashboardService
                            .getDashboardStats();


                    setStats(
                        response.data
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.dashboard
                            .loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            []
        );


    useEffect(
        () => {

            loadDashboard();

        },
        [loadDashboard]
    );


    if (loading) {

        return (

            <div
                className="
                    flex
                    min-h-[400px]
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <RefreshCw
                        size={28}
                        className="
                            mx-auto
                            animate-spin
                            text-slate-500
                        "
                    />

                    <p
                        className="
                            mt-3
                            text-sm
                            text-slate-500
                        "
                    >
                        {ar.common.loading}
                    </p>

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-6
                "
            >

                <p
                    className="
                        text-sm
                        text-red-700
                    "
                >
                    {error}
                </p>


                <button
                    type="button"
                    onClick={
                        loadDashboard
                    }
                    className="
                        mt-4
                        rounded-lg
                        bg-red-700
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                        hover:bg-red-800
                    "
                >
                    {ar.common.retry}
                </button>

            </div>

        );

    }


    const summaryCards = [

        {
            title:
                ar.dashboard
                    .totalOrders,

            value:
                formatNumber(
                    stats?.totalOrders
                ),

            icon:
                ShoppingCart,
        },

        {
            title:
                ar.dashboard
                    .todayOrders,

            value:
                formatNumber(
                    stats?.todayOrders
                ),

            icon:
                CalendarDays,
        },

        {
            title:
                ar.dashboard
                    .totalRevenue,

            value:
                formatCurrency(
                    stats?.totalRevenue
                ),

            icon:
                Banknote,
        },

        {
            title:
                ar.dashboard
                    .todayRevenue,

            value:
                formatCurrency(
                    stats?.todayRevenue
                ),

            icon:
                Banknote,
        },

    ];


    const statusCards = [

        {
            title:
                ar.dashboard.pending,

            value:
                stats?.pending,

            icon:
                Clock3,
        },

        {
            title:
                ar.dashboard.confirmed,

            value:
                stats?.confirmed,

            icon:
                CheckCircle2,
        },

        {
            title:
                ar.dashboard.processing,

            value:
                stats?.processing,

            icon:
                CircleEllipsis,
        },

        {
            title:
                ar.dashboard.packed,

            value:
                stats?.packed,

            icon:
                PackageCheck,
        },

        {
            title:
                ar.dashboard.shipped,

            value:
                stats?.shipped,

            icon:
                Truck,
        },

        {
            title:
                ar.dashboard.delivered,

            value:
                stats?.delivered,

            icon:
                CheckCircle2,
        },

        {
            title:
                ar.dashboard.cancelled,

            value:
                stats?.cancelled,

            icon:
                CircleX,
        },

    ];


    return (

        <div>

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >
                        {ar.dashboard.title}
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        {ar.dashboard.welcome}
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        loadDashboard
                    }
                    className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50
                    "
                >

                    <RefreshCw
                        size={16}
                    />

                    تحديث البيانات

                </button>

            </div>


            <div
                className="
                    mt-7
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {
                    summaryCards.map(
                        card => (

                            <StatCard
                                key={
                                    card.title
                                }
                                {...card}
                            />

                        )
                    )
                }

            </div>


            <section
                className="
                    mt-7
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    md:p-6
                "
            >

                <div>

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        {
                            ar.dashboard
                                .orderStatus
                        }
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        {
                            ar.dashboard
                                .orderStatusDescription
                        }
                    </p>

                </div>


                <div
                    className="
                        mt-5
                        grid
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >

                    {
                        statusCards.map(
                            status => (

                                <StatusCard
                                    key={
                                        status.title
                                    }
                                    {...status}
                                />

                            )
                        )
                    }

                </div>

            </section>

        </div>

    );

}