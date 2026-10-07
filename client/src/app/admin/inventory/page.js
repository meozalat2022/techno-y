"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    History,
    RefreshCw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
} from "lucide-react";

import productService from
    "@/services/productService";

import inventoryService from
    "@/services/inventoryService";

import StockAdjustmentModal from
    "@/components/admin/inventory/StockAdjustmentModal";

import InventoryHistoryModal from
    "@/components/admin/inventory/InventoryHistoryModal";

import SafetyStockModal from
    "@/components/admin/inventory/SafetyStockModal";

import ar from
    "@/locales/ar";


export default function InventoryPage() {

    const [
        products,
        setProducts,
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
            limit: 20,
        });


    const [
        page,
        setPage,
    ] =
        useState(1);


    const [
        searchInput,
        setSearchInput,
    ] =
        useState("");


    const [
        search,
        setSearch,
    ] =
        useState("");


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


    const [
        message,
        setMessage,
    ] =
        useState("");


    const [
        adjustmentProduct,
        setAdjustmentProduct,
    ] =
        useState(null);


    const [
        historyProduct,
        setHistoryProduct,
    ] =
        useState(null);


    const [
        safetyStockProduct,
        setSafetyStockProduct,
    ] =
        useState(null);


    const [
        saving,
        setSaving,
    ] =
        useState(false);


    const loadProducts =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await productService
                            .getProducts({

                                page,

                                limit: 20,

                                search,

                                sort:
                                    "newest",

                            });


                    setProducts(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.meta ||
                        {
                            page: 1,
                            pages: 1,
                            total: 0,
                            limit: 20,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.inventory
                            .loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                search,
            ]
        );


    useEffect(
        () => {

            loadProducts();

        },
        [
            loadProducts,
        ]
    );


    const handleSearch =
        event => {

            event.preventDefault();

            setPage(1);

            setSearch(
                searchInput.trim()
            );

        };


    const handleAdjustment =
        async adjustment => {

            setSaving(true);

            setError("");

            setMessage("");


            try {

                await inventoryService
                    .adjustStock(
                        adjustment
                    );


                setAdjustmentProduct(
                    null
                );


                setMessage(
                    ar.inventory
                        .adjustmentSuccess
                );


                await loadProducts();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.inventory
                        .adjustmentError

                );

            } finally {

                setSaving(false);

            }

        };


    const handleSafetyStock =
        async payload => {

            setSaving(true);

            setError("");

            setMessage("");


            try {

                await inventoryService
                    .setOnlineSafetyStock(
                        payload
                    );


                setSafetyStockProduct(
                    null
                );


                setMessage(
                    "تم تحديث مخزون الأمان للأونلاين بنجاح."
                );


                await loadProducts();


            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر تحديث مخزون الأمان."
                );

            } finally {

                setSaving(false);

            }

        };


    return (

        <div>

            <div>

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    {ar.inventory.title}
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    {
                        ar.inventory
                            .description
                    }
                </p>

            </div>


            <div
                className="
                    mt-6
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <form
                    onSubmit={
                        handleSearch
                    }
                    className="
                        flex
                        max-w-2xl
                        gap-2
                    "
                >

                    <div
                        className="
                            flex
                            flex-1
                            items-center
                            rounded-lg
                            border
                            border-slate-300
                            px-3
                        "
                    >

                        <Search
                            size={17}
                            className="
                                text-slate-400
                            "
                        />

                        <input
                            value={
                                searchInput
                            }
                            onChange={
                                event =>
                                    setSearchInput(
                                        event
                                            .target
                                            .value
                                    )
                            }
                            placeholder={
                                ar.inventory
                                    .searchPlaceholder
                            }
                            className="
                                w-full
                                bg-transparent
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                            "
                        />

                    </div>


                    <button
                        type="submit"
                        className="
                            rounded-lg
                            bg-slate-900
                            px-5
                            text-sm
                            font-medium
                            text-white
                        "
                    >
                        {ar.common.search}
                    </button>

                </form>

            </div>


            {message && (

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-4
                        py-3
                        text-sm
                        text-emerald-700
                    "
                >
                    {message}
                </div>

            )}


            {error && (

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                    "
                >
                    {error}
                </div>

            )}


            <div
                className="
                    mt-5
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                {
                    loading
                        ? (

                            <div
                                className="
                                    flex
                                    min-h-[320px]
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
                        : products.length ===
                            0
                            ? (

                                <div
                                    className="
                                        flex
                                        min-h-[300px]
                                        items-center
                                        justify-center
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    {
                                        ar.inventory
                                            .noProducts
                                    }
                                </div>

                            )
                            : (

                                <InventoryTable
                                    products={
                                        products
                                    }
                                    onAdjust={
                                        setAdjustmentProduct
                                    }
                                    onHistory={
                                        setHistoryProduct
                                    }
                                    onSafetyStock={
                                        setSafetyStockProduct
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
                            mt-5
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <span
                            className="
                                text-sm
                                text-slate-500
                            "
                        >
                            صفحة{" "}
                            {pagination.page}{" "}
                            من{" "}
                            {pagination.pages}
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
                                    bg-white
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
                                    bg-white
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


            <StockAdjustmentModal
                open={
                    Boolean(
                        adjustmentProduct
                    )
                }
                product={
                    adjustmentProduct
                }
                saving={
                    saving
                }
                onClose={
                    () =>
                        setAdjustmentProduct(
                            null
                        )
                }
                onSubmit={
                    handleAdjustment
                }
            />


            <InventoryHistoryModal
                open={
                    Boolean(
                        historyProduct
                    )
                }
                product={
                    historyProduct
                }
                onClose={
                    () =>
                        setHistoryProduct(
                            null
                        )
                }
            />


            <SafetyStockModal
                open={
                    Boolean(
                        safetyStockProduct
                    )
                }
                product={
                    safetyStockProduct
                }
                saving={
                    saving
                }
                onClose={
                    () =>
                        setSafetyStockProduct(
                            null
                        )
                }
                onSubmit={
                    handleSafetyStock
                }
            />

        </div>

    );

}


function InventoryTable({
    products,
    onAdjust,
    onHistory,
    onSafetyStock,
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
                    min-w-[1180px]
                    text-sm
                "
            >

                <thead
                    className="
                        bg-slate-50
                        text-slate-500
                    "
                >

                    <tr>

                        <Head>
                            {
                                ar.inventory
                                    .product
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .sku
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .category
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .currentStock
                            }
                        </Head>

                        <Head>
                            مخزون الأمان
                        </Head>

                        <Head>
                            المتاح أونلاين
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .stockStatus
                            }
                        </Head>

                        <Head>
                            {
                                ar.inventory
                                    .actions
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
                        products.map(
                            product => (

                                <tr
                                    key={
                                        product._id
                                    }
                                    className="
                                        hover:bg-slate-50/70
                                    "
                                >

                                    <Cell>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >

                                            {
                                                product.images
                                                    ?.length >
                                                0
                                                    ? (

                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                                    .url
                                                            }
                                                            alt=""
                                                            className="
                                                                h-11
                                                                w-11
                                                                rounded-lg
                                                                border
                                                                border-slate-200
                                                                object-cover
                                                            "
                                                        />

                                                    )
                                                    : (

                                                        <div
                                                            className="
                                                                h-11
                                                                w-11
                                                                rounded-lg
                                                                bg-slate-100
                                                            "
                                                        />

                                                    )
                                            }


                                            <div
                                                className="
                                                    font-semibold
                                                    text-slate-900
                                                "
                                            >
                                                {
                                                    product.title
                                                }
                                            </div>

                                        </div>

                                    </Cell>


                                    <Cell>

                                        <span
                                            dir="ltr"
                                            className="
                                                font-mono
                                                text-xs
                                            "
                                        >
                                            {product.sku}
                                        </span>

                                    </Cell>


                                    <Cell>
                                        {
                                            product.category
                                                ?.name ||
                                            "—"
                                        }
                                    </Cell>


                                    <Cell>

                                        <strong
                                            className="
                                                text-lg
                                                text-slate-900
                                            "
                                        >
                                            {
                                                product
                                                    .stockQuantity
                                            }
                                        </strong>

                                    </Cell>


                                    <Cell>
                                        {
                                            product
                                                .onlineSafetyStock ??
                                            0
                                        }
                                    </Cell>


                                    <Cell>

                                        <strong
                                            className="
                                                text-blue-700
                                            "
                                        >
                                            {
                                                product
                                                    .onlineAvailableQuantity ??
                                                Math.max(
                                                    Number(
                                                        product
                                                            .stockQuantity ||
                                                        0
                                                    ) -
                                                    Number(
                                                        product
                                                            .onlineSafetyStock ||
                                                        0
                                                    ),
                                                    0
                                                )
                                            }
                                        </strong>

                                    </Cell>


                                    <Cell>

                                        <StockStatusBadge
                                            product={
                                                product
                                            }
                                        />

                                    </Cell>


                                    <Cell>

                                        <div
                                            className="
                                                flex
                                                gap-2
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={
                                                    () =>
                                                        onAdjust(
                                                            product
                                                        )
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
                                                    text-xs
                                                    font-medium
                                                    text-slate-700
                                                    hover:bg-slate-50
                                                "
                                            >

                                                <SlidersHorizontal
                                                    size={15}
                                                />

                                                {
                                                    ar.inventory
                                                        .adjustStock
                                                }

                                            </button>


                                            <button
                                                type="button"
                                                onClick={
                                                    () =>
                                                        onSafetyStock(
                                                            product
                                                        )
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    rounded-lg
                                                    border
                                                    border-blue-200
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-medium
                                                    text-blue-700
                                                    hover:bg-blue-50
                                                "
                                            >

                                                <ShieldCheck
                                                    size={15}
                                                />

                                                مخزون الأمان

                                            </button>


                                            <button
                                                type="button"
                                                onClick={
                                                    () =>
                                                        onHistory(
                                                            product
                                                        )
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
                                                    text-xs
                                                    font-medium
                                                    text-slate-700
                                                    hover:bg-slate-50
                                                "
                                            >

                                                <History
                                                    size={15}
                                                />

                                                {
                                                    ar.inventory
                                                        .history
                                                }

                                            </button>

                                        </div>

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


function StockStatusBadge({
    product,
}) {

    if (
        product.stockQuantity ===
        0
    ) {

        return (

            <span
                className="
                    inline-flex
                    rounded-full
                    bg-red-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-red-700
                "
            >
                {
                    ar.inventory
                        .outOfStock
                }
            </span>

        );

    }


    if (
        product.stockQuantity <=
        product.lowStockThreshold
    ) {

        return (

            <span
                className="
                    inline-flex
                    rounded-full
                    bg-amber-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-amber-700
                "
            >
                {
                    ar.inventory
                        .lowStock
                }
            </span>

        );

    }


    return (

        <span
            className="
                inline-flex
                rounded-full
                bg-emerald-50
                px-2.5
                py-1
                text-xs
                font-medium
                text-emerald-700
            "
        >
            {ar.inventory.inStock}
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
                whitespace-nowrap
                px-4
                py-4
                text-slate-600
            "
        >
            {children}
        </td>

    );

}