"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    RefreshCw,
    X,
} from "lucide-react";

import inventoryService from
    "@/services/inventoryService";

import ar from
    "@/locales/ar";


const formatDate =
    value => {

        if (!value) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                dateStyle:
                    "medium",

                timeStyle:
                    "short",
            }
        ).format(
            new Date(value)
        );

    };


export default function InventoryHistoryModal({
    open,
    product,
    onClose,
}) {

    const [
        history,
        setHistory,
    ] =
        useState([]);


    const [
        pagination,
        setPagination,
    ] =
        useState({
            page: 1,
            pages: 1,
            total: 0,
        });


    const [
        page,
        setPage,
    ] =
        useState(1);


    const [
        loading,
        setLoading,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState("");


    const loadHistory =
        useCallback(
            async () => {

                if (
                    !open ||
                    !product
                ) {
                    return;
                }


                setLoading(true);

                setError("");


                try {

                    const response =
                        await inventoryService
                            .getInventoryHistory({

                                productId:
                                    product._id,

                                page,

                                limit: 20,

                            });


                    setHistory(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.pagination ||
                        {
                            page: 1,
                            pages: 1,
                            total: 0,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.inventory
                            .historyLoadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                open,
                product,
                page,
            ]
        );


    useEffect(
        () => {

            if (open) {
                setPage(1);
            }

        },
        [
            open,
            product,
        ]
    );


    useEffect(
        () => {

            loadHistory();

        },
        [
            loadHistory,
        ]
    );


    if (
        !open ||
        !product
    ) {

        return null;

    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
        >

            <div
                className="
                    max-h-[92vh]
                    w-full
                    max-w-6xl
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-6
                        py-4
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
                                ar.inventory
                                    .history
                            }
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            {product.title}
                            {" — "}
                            {product.sku}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-slate-500
                            hover:bg-slate-100
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                <div
                    className="
                        max-h-[72vh]
                        overflow-auto
                    "
                >

                    {
                        loading
                            ? (

                                <div
                                    className="
                                        flex
                                        min-h-[350px]
                                        items-center
                                        justify-center
                                    "
                                >
                                    <RefreshCw
                                        size={26}
                                        className="
                                            animate-spin
                                            text-slate-400
                                        "
                                    />
                                </div>

                            )
                            : error
                                ? (

                                    <div
                                        className="
                                            p-6
                                        "
                                    >

                                        <div
                                            className="
                                                rounded-xl
                                                bg-red-50
                                                p-4
                                                text-sm
                                                text-red-700
                                            "
                                        >
                                            {error}
                                        </div>

                                    </div>

                                )
                                : history.length ===
                                    0
                                    ? (

                                        <div
                                            className="
                                                flex
                                                min-h-[320px]
                                                items-center
                                                justify-center
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            {
                                                ar.inventory
                                                    .noHistory
                                            }
                                        </div>

                                    )
                                    : (

                                        <HistoryTable
                                            history={
                                                history
                                            }
                                        />

                                    )
                    }

                </div>


                {
                    pagination.pages >
                    1 &&
                    (

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-t
                                border-slate-200
                                px-6
                                py-4
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                صفحة{" "}
                                {
                                    pagination.page
                                }{" "}
                                من{" "}
                                {
                                    pagination.pages
                                }
                            </span>


                            <div
                                className="
                                    flex
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    disabled={
                                        page <= 1
                                    }
                                    onClick={
                                        () =>
                                            setPage(
                                                previous =>
                                                    previous -
                                                    1
                                            )
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-2
                                        text-sm
                                        disabled:opacity-40
                                    "
                                >
                                    السابق
                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        pagination.pages
                                    }
                                    onClick={
                                        () =>
                                            setPage(
                                                previous =>
                                                    previous +
                                                    1
                                            )
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-2
                                        text-sm
                                        disabled:opacity-40
                                    "
                                >
                                    التالي
                                </button>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>

    );

}


function HistoryTable({
    history,
}) {

    return (

        <div
            className="
                overflow-x-auto
            "
        >

            <table
                className="
                    w-full
                    min-w-[1050px]
                    text-sm
                "
            >

                <thead
                    className="
                        sticky
                        top-0
                        bg-slate-50
                        text-slate-500
                    "
                >

                    <tr>

                        <Head>
                            {
                                ar.inventory
                                    .date
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .movementType
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .quantity
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .previousStock
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .newStock
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .reference
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .performedBy
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .notes
                            }
                        </Head>

                    </tr>

                </thead>


                <tbody
                    className="
                        divide-y
                        divide-slate-100
                    "
                >

                    {
                        history.map(
                            movement => (

                                <tr
                                    key={
                                        movement._id
                                    }
                                >

                                    <Cell>
                                        {
                                            formatDate(
                                                movement
                                                    .createdAt
                                            )
                                        }
                                    </Cell>


                                    <Cell>

                                        <MovementBadge
                                            type={
                                                movement.type
                                            }
                                        />

                                    </Cell>


                                    <Cell>
                                        {
                                            movement.quantity
                                        }
                                    </Cell>


                                    <Cell>
                                        {
                                            movement
                                                .previousStock
                                        }
                                    </Cell>


                                    <Cell>

                                        <strong
                                            className="
                                                text-slate-900
                                            "
                                        >
                                            {
                                                movement
                                                    .newStock
                                            }
                                        </strong>

                                    </Cell>


                                    <Cell>

                                        <div>
                                            {
                                                ar.inventory
                                                    .referenceTypes[
                                                    movement
                                                        .referenceType
                                                ] ||
                                                movement
                                                    .referenceType ||
                                                "—"
                                            }
                                        </div>


                                        <div
                                            dir="ltr"
                                            className="
                                                mt-1
                                                font-mono
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            {
                                                movement
                                                    .reference ||
                                                "—"
                                            }
                                        </div>

                                    </Cell>


                                    <Cell>

                                        {
                                            movement
                                                .performedBy
                                                ? `${movement.performedBy.firstName || ""} ${movement.performedBy.lastName || ""}`
                                                    .trim() ||
                                                movement
                                                    .performedBy
                                                    .email
                                                : "—"
                                        }

                                    </Cell>


                                    <Cell>
                                        {
                                            movement.notes ||
                                            "—"
                                        }
                                    </Cell>

                                </tr>

                            )
                        )
                    }

                </tbody>

            </table>

        </div>

    );

}


function MovementBadge({
    type,
}) {

    const incoming = [
        "purchase",
        "order_cancellation",
        "return_in",
        "adjustment_in",
        "initial_stock",
    ].includes(type);


    return (

        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${
                    incoming
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                }
            `}
        >

            {
                ar.inventory
                    .movementTypes[type] ||
                type
            }

        </span>

    );

}


function Head({
    children,
}) {

    return (

        <th
            className="
                whitespace-nowrap
                px-4
                py-3
                text-right
                text-xs
                font-semibold
            "
        >
            {children}
        </th>

    );

}


function Cell({
    children,
}) {

    return (

        <td
            className="
                px-4
                py-4
                text-slate-600
            "
        >
            {children}
        </td>

    );

}