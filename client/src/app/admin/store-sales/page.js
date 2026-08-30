"use client";


import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CheckCircle2,
    Minus,
    Plus,
    ReceiptText,
    RefreshCw,
    Search,
    ShoppingBasket,
    Trash2,
} from "lucide-react";

import productService from
    "@/services/productService";

import storeSaleService from
    "@/services/storeSaleService";


const createRequestId = () => {

    if (
        typeof crypto !==
            "undefined" &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        return crypto.randomUUID();

    }


    return `store-sale-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

};


export default function StoreSalesPage() {

    const [
        query,
        setQuery,
    ] =
        useState("");


    const [
        results,
        setResults,
    ] =
        useState([]);


    const [
        searching,
        setSearching,
    ] =
        useState(false);


    const [
        basket,
        setBasket,
    ] =
        useState([]);


    const [
        notes,
        setNotes,
    ] =
        useState("");


    const [
        clientRequestId,
        setClientRequestId,
    ] =
        useState(
            createRequestId
        );


    const [
        submitting,
        setSubmitting,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState("");


    const [
        success,
        setSuccess,
    ] =
        useState(null);


    const [
        recentSales,
        setRecentSales,
    ] =
        useState([]);


    const [
        loadingRecent,
        setLoadingRecent,
    ] =
        useState(true);


    const loadRecentSales =
        useCallback(
            async () => {

                setLoadingRecent(
                    true
                );


                try {

                    const response =
                        await storeSaleService
                            .getStoreSales({
                                page: 1,
                                limit: 8,
                            });


                    setRecentSales(
                        response.data ||
                        []
                    );

                } catch {

                    /*
                     * Recent history is supplementary.
                     * Do not block the cashier workflow
                     * if history could not load.
                     */

                } finally {

                    setLoadingRecent(
                        false
                    );

                }

            },
            []
        );


    useEffect(
        () => {

            loadRecentSales();

        },
        [
            loadRecentSales,
        ]
    );


    const handleSearch =
        async event => {

            event.preventDefault();

            const value =
                query.trim();


            if (!value) {

                setResults([]);

                return;

            }


            setSearching(true);

            setError("");

            setSuccess(null);


            try {

                const response =
                    await productService
                        .getProducts({
                            page: 1,
                            limit: 10,
                            search: value,
                            sort: "newest",
                        });


                setResults(
                    response.data ||
                    []
                );

            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر البحث عن المنتجات."
                );

            } finally {

                setSearching(false);

            }

        };


    const addProduct =
        product => {

            setError("");

            setSuccess(null);


            if (
                product.trackInventory ===
                false
            ) {

                setError(
                    "تتبع المخزون غير مفعّل لهذا المنتج، لذلك لا يمكن تسجيله في مبيعات المحل."
                );

                return;

            }


            const stock =
                Number(
                    product.stockQuantity
                ) || 0;


            if (
                stock <=
                0
            ) {

                setError(
                    "هذا المنتج غير متوفر في المخزون الفعلي."
                );

                return;

            }


            setBasket(
                previous => {

                    const existing =
                        previous.find(
                            item =>
                                item.product
                                    ._id ===
                                product._id
                        );


                    if (existing) {

                        if (
                            existing.quantity >=
                            stock
                        ) {

                            setError(
                                "تم الوصول إلى أقصى كمية متاحة من هذا المنتج."
                            );

                            return previous;

                        }


                        return previous.map(
                            item =>
                                item.product
                                    ._id ===
                                product._id
                                    ? {
                                        ...item,

                                        quantity:
                                            item.quantity +
                                            1,
                                    }
                                    : item
                        );

                    }


                    return [
                        ...previous,
                        {
                            product,
                            quantity: 1,
                        },
                    ];

                }
            );

        };


    const updateQuantity =
        (
            productId,
            nextQuantity
        ) => {

            setError("");

            setSuccess(null);


            setBasket(
                previous =>
                    previous.map(
                        item => {

                            if (
                                item.product
                                    ._id !==
                                productId
                            ) {

                                return item;

                            }


                            const stock =
                                Number(
                                    item.product
                                        .stockQuantity
                                ) || 0;


                            const safeQuantity =
                                Math.min(
                                    Math.max(
                                        Number(
                                            nextQuantity
                                        ) || 1,
                                        1
                                    ),
                                    stock
                                );


                            return {
                                ...item,
                                quantity:
                                    safeQuantity,
                            };

                        }
                    )
            );

        };


    const removeItem =
        productId => {

            setBasket(
                previous =>
                    previous.filter(
                        item =>
                            item.product
                                ._id !==
                            productId
                    )
            );

            setError("");

            setSuccess(null);

        };


    const totalUnits =
        useMemo(
            () =>
                basket.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.quantity,
                    0
                ),
            [
                basket,
            ]
        );


    const resetSale =
        () => {

            setBasket([]);

            setNotes("");

            setQuery("");

            setResults([]);

            setClientRequestId(
                createRequestId()
            );

        };


    const handleSubmit =
        async () => {

            if (
                basket.length ===
                0
            ) {

                setError(
                    "أضف منتجًا واحدًا على الأقل قبل تسجيل البيع."
                );

                return;

            }


            setSubmitting(true);

            setError("");

            setSuccess(null);


            try {

                const response =
                    await storeSaleService
                        .createStoreSale({

                            clientRequestId,

                            notes:
                                notes.trim(),

                            items:
                                basket.map(
                                    item => ({
                                        product:
                                            item.product
                                                ._id,

                                        quantity:
                                            item.quantity,
                                    })
                                ),

                        });


                const sale =
                    response.data;


                setSuccess({
                    saleNumber:
                        sale.saleNumber,

                    idempotentReplay:
                        Boolean(
                            sale
                                .idempotentReplay
                        ),
                });


                resetSale();


                await loadRecentSales();


            } catch (error) {

                /*
                 * IMPORTANT:
                 * clientRequestId is intentionally preserved
                 * on failure. If the API completed the sale but
                 * the browser lost the response, retrying with
                 * the same ID returns the original sale instead
                 * of deducting stock again.
                 */
                setError(
                    translateStoreSaleError(
                        error.response
                            ?.data
                            ?.message ||
                        error.message
                    )
                );

            } finally {

                setSubmitting(false);

            }

        };


    return (

        <div
            dir="rtl"
            className="
                space-y-6
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-end
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
                        مبيعات المحل
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >
                        سجّل المنتجات المباعة داخل المحل لتحديث المخزون الفعلي والمتاح أونلاين فورًا.
                    </p>
                </div>

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        shadow-sm
                    "
                >
                    <span
                        className="
                            text-slate-500
                        "
                    >
                        إجمالي وحدات البيع الحالية:
                    </span>{" "}
                    <strong
                        className="
                            text-slate-900
                        "
                    >
                        {totalUnits}
                    </strong>
                </div>
            </div>


            {success && (

                <div
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-5
                        py-4
                        text-emerald-800
                    "
                >
                    <CheckCircle2
                        size={20}
                        className="
                            mt-0.5
                            shrink-0
                        "
                    />

                    <div>
                        <div
                            className="
                                font-bold
                            "
                        >
                            تم تسجيل البيع بنجاح
                        </div>

                        <div
                            className="
                                mt-1
                                text-sm
                            "
                        >
                            رقم حركة البيع:{" "}
                            <span
                                dir="ltr"
                                className="
                                    font-mono
                                    font-bold
                                "
                            >
                                {
                                    success
                                        .saleNumber
                                }
                            </span>

                            {
                                success
                                    .idempotentReplay &&
                                " — تم إرجاع نفس العملية السابقة دون خصم المخزون مرة أخرى."
                            }
                        </div>
                    </div>
                </div>

            )}


            {error && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        px-5
                        py-4
                        text-sm
                        leading-6
                        text-red-700
                    "
                >
                    {error}
                </div>

            )}


            <div
                className="
                    grid
                    gap-6
                    xl:grid-cols-[minmax(0,1fr)_420px]
                "
            >

                <section
                    className="
                        space-y-5
                    "
                >

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
                                items-center
                                gap-3
                            "
                        >
                            <Search
                                size={19}
                                className="
                                    text-slate-500
                                "
                            />

                            <div>
                                <h2
                                    className="
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    ابحث عن المنتج
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    ابحث باسم المنتج أو SKU. يمكن استخدام قارئ باركود يكتب الـ SKU في هذا الحقل.
                                </p>
                            </div>
                        </div>


                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="
                                mt-4
                                flex
                                gap-2
                            "
                        >
                            <input
                                autoFocus
                                value={
                                    query
                                }
                                onChange={
                                    event =>
                                        setQuery(
                                            event.target
                                                .value
                                        )
                                }
                                placeholder="اسم المنتج أو SKU"
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-slate-500
                                "
                            />

                            <button
                                type="submit"
                                disabled={
                                    searching
                                }
                                className="
                                    rounded-xl
                                    bg-slate-900
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    disabled:opacity-50
                                "
                            >
                                {
                                    searching
                                        ? "جاري البحث..."
                                        : "بحث"
                                }
                            </button>
                        </form>


                        {
                            results.length >
                            0 &&
                            (
                                <div
                                    className="
                                        mt-4
                                        divide-y
                                        divide-slate-100
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                    "
                                >
                                    {
                                        results.map(
                                            product => (

                                                <SearchResult
                                                    key={
                                                        product._id
                                                    }
                                                    product={
                                                        product
                                                    }
                                                    onAdd={
                                                        addProduct
                                                    }
                                                />

                                            )
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>


                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                border-b
                                border-slate-200
                                px-5
                                py-4
                            "
                        >
                            <ShoppingBasket
                                size={20}
                                className="
                                    text-slate-500
                                "
                            />

                            <div>
                                <h2
                                    className="
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    المنتجات المباعة
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    المخزون هنا هو المخزون الفعلي داخل المحل.
                                </p>
                            </div>
                        </div>


                        {
                            basket.length ===
                            0
                                ? (
                                    <div
                                        className="
                                            px-5
                                            py-12
                                            text-center
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        لم تتم إضافة منتجات إلى عملية البيع بعد.
                                    </div>
                                )
                                : (
                                    <div
                                        className="
                                            divide-y
                                            divide-slate-100
                                        "
                                    >
                                        {
                                            basket.map(
                                                item => (

                                                    <BasketItem
                                                        key={
                                                            item.product
                                                                ._id
                                                        }
                                                        item={
                                                            item
                                                        }
                                                        onQuantityChange={
                                                            updateQuantity
                                                        }
                                                        onRemove={
                                                            removeItem
                                                        }
                                                    />

                                                )
                                            )
                                        }
                                    </div>
                                )
                        }
                    </div>

                </section>


                <aside
                    className="
                        space-y-5
                    "
                >

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                            xl:sticky
                            xl:top-5
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <ReceiptText
                                size={20}
                                className="
                                    text-slate-500
                                "
                            />

                            <h2
                                className="
                                    font-bold
                                    text-slate-900
                                "
                            >
                                تسجيل البيع
                            </h2>
                        </div>


                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >
                            <SummaryStat
                                label="عدد الأصناف"
                                value={
                                    basket.length
                                }
                            />

                            <SummaryStat
                                label="إجمالي الوحدات"
                                value={
                                    totalUnits
                                }
                            />
                        </div>


                        <label
                            className="
                                mt-5
                                block
                            "
                        >
                            <span
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                ملاحظات
                                <span
                                    className="
                                        mr-1
                                        text-xs
                                        font-normal
                                        text-slate-400
                                    "
                                >
                                    (اختياري)
                                </span>
                            </span>

                            <textarea
                                rows="3"
                                value={
                                    notes
                                }
                                onChange={
                                    event =>
                                        setNotes(
                                            event.target
                                                .value
                                        )
                                }
                                placeholder="مثال: بيع كاونتر / ملاحظة خاصة..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-slate-500
                                "
                            />
                        </label>


                        <div
                            className="
                                mt-5
                                rounded-xl
                                bg-amber-50
                                px-4
                                py-3
                                text-xs
                                leading-6
                                text-amber-800
                            "
                        >
                            هذه الشاشة تُحدّث المخزون فقط. استمر في تسجيل العملية المالية في برنامج الحسابات المعتاد.
                        </div>


                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                submitting ||
                                basket.length ===
                                    0
                            }
                            className="
                                mt-5
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-slate-900
                                px-5
                                py-3
                                text-sm
                                font-bold
                                text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {
                                submitting
                                    ? (
                                        <>
                                            <RefreshCw
                                                size={17}
                                                className="
                                                    animate-spin
                                                "
                                            />
                                            جاري التسجيل...
                                        </>
                                    )
                                    : "تسجيل البيع"
                            }
                        </button>
                    </div>


                    <RecentSales
                        sales={
                            recentSales
                        }
                        loading={
                            loadingRecent
                        }
                        onRefresh={
                            loadRecentSales
                        }
                    />

                </aside>

            </div>

        </div>

    );

}


function SearchResult({
    product,
    onAdd,
}) {

    const physicalStock =
        Number(
            product.stockQuantity
        ) || 0;


    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4
                p-4
            "
        >
            <div
                className="
                    min-w-0
                "
            >
                <div
                    className="
                        truncate
                        font-semibold
                        text-slate-900
                    "
                >
                    {product.title}
                </div>

                <div
                    className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-x-4
                        gap-y-1
                        text-xs
                        text-slate-500
                    "
                >
                    <span
                        dir="ltr"
                        className="
                            font-mono
                        "
                    >
                        {product.sku}
                    </span>

                    <span>
                        المخزون الفعلي:{" "}
                        <strong
                            className="
                                text-slate-700
                            "
                        >
                            {physicalStock}
                        </strong>
                    </span>

                    <span>
                        المتاح أونلاين:{" "}
                        <strong
                            className="
                                text-blue-700
                            "
                        >
                            {
                                product
                                    .onlineAvailableQuantity ??
                                Math.max(
                                    physicalStock -
                                    Number(
                                        product
                                            .onlineSafetyStock ||
                                        0
                                    ),
                                    0
                                )
                            }
                        </strong>
                    </span>
                </div>
            </div>


            <button
                type="button"
                onClick={
                    () =>
                        onAdd(
                            product
                        )
                }
                disabled={
                    physicalStock <=
                        0 ||
                    product
                        .trackInventory ===
                        false
                }
                className="
                    shrink-0
                    rounded-lg
                    bg-slate-900
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    disabled:opacity-40
                "
            >
                إضافة
            </button>
        </div>
    );

}


function BasketItem({
    item,
    onQuantityChange,
    onRemove,
}) {

    const {
        product,
        quantity,
    } =
        item;


    const stock =
        Number(
            product.stockQuantity
        ) || 0;


    return (
        <div
            className="
                flex
                flex-col
                gap-4
                p-5
                md:flex-row
                md:items-center
                md:justify-between
            "
        >
            <div
                className="
                    min-w-0
                "
            >
                <div
                    className="
                        font-semibold
                        text-slate-900
                    "
                >
                    {product.title}
                </div>

                <div
                    className="
                        mt-1
                        flex
                        flex-wrap
                        gap-x-4
                        gap-y-1
                        text-xs
                        text-slate-500
                    "
                >
                    <span
                        dir="ltr"
                        className="
                            font-mono
                        "
                    >
                        {product.sku}
                    </span>

                    <span>
                        المخزون الحالي:{" "}
                        {stock}
                    </span>

                    <span>
                        المتبقي بعد البيع:{" "}
                        <strong>
                            {
                                stock -
                                quantity
                            }
                        </strong>
                    </span>
                </div>
            </div>


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
                        items-center
                        overflow-hidden
                        rounded-lg
                        border
                        border-slate-300
                    "
                >
                    <button
                        type="button"
                        onClick={
                            () =>
                                onQuantityChange(
                                    product._id,
                                    quantity -
                                        1
                                )
                        }
                        disabled={
                            quantity <=
                            1
                        }
                        className="
                            p-2
                            hover:bg-slate-50
                            disabled:opacity-30
                        "
                        aria-label="تقليل الكمية"
                    >
                        <Minus
                            size={16}
                        />
                    </button>

                    <input
                        type="number"
                        min="1"
                        max={
                            stock
                        }
                        value={
                            quantity
                        }
                        onChange={
                            event =>
                                onQuantityChange(
                                    product._id,
                                    event.target
                                        .value
                                )
                        }
                        className="
                            w-14
                            border-x
                            border-slate-300
                            py-2
                            text-center
                            text-sm
                            font-bold
                            outline-none
                        "
                    />

                    <button
                        type="button"
                        onClick={
                            () =>
                                onQuantityChange(
                                    product._id,
                                    quantity +
                                        1
                                )
                        }
                        disabled={
                            quantity >=
                            stock
                        }
                        className="
                            p-2
                            hover:bg-slate-50
                            disabled:opacity-30
                        "
                        aria-label="زيادة الكمية"
                    >
                        <Plus
                            size={16}
                        />
                    </button>
                </div>


                <button
                    type="button"
                    onClick={
                        () =>
                            onRemove(
                                product._id
                            )
                    }
                    className="
                        rounded-lg
                        border
                        border-red-200
                        p-2.5
                        text-red-600
                        hover:bg-red-50
                    "
                    aria-label="حذف المنتج"
                >
                    <Trash2
                        size={17}
                    />
                </button>
            </div>
        </div>
    );

}


function SummaryStat({
    label,
    value,
}) {

    return (
        <div
            className="
                rounded-xl
                bg-slate-50
                p-4
                text-center
            "
        >
            <div
                className="
                    text-xs
                    text-slate-500
                "
            >
                {label}
            </div>

            <div
                className="
                    mt-1
                    text-xl
                    font-black
                    text-slate-900
                "
            >
                {value}
            </div>
        </div>
    );

}


function RecentSales({
    sales,
    loading,
    onRefresh,
}) {

    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-200
                    px-5
                    py-4
                "
            >
                <div>
                    <h2
                        className="
                            font-bold
                            text-slate-900
                        "
                    >
                        آخر مبيعات المحل
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        أحدث حركات المخزون المسجلة من الكاونتر.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        onRefresh
                    }
                    className="
                        rounded-lg
                        p-2
                        text-slate-500
                        hover:bg-slate-100
                    "
                    aria-label="تحديث"
                >
                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />
                </button>
            </div>


            {
                loading
                    ? (
                        <div
                            className="
                                px-5
                                py-8
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >
                            جاري التحميل...
                        </div>
                    )
                    : sales.length ===
                        0
                        ? (
                            <div
                                className="
                                    px-5
                                    py-8
                                    text-center
                                    text-sm
                                    text-slate-500
                                "
                            >
                                لا توجد مبيعات محل مسجلة بعد.
                            </div>
                        )
                        : (
                            <div
                                className="
                                    divide-y
                                    divide-slate-100
                                "
                            >
                                {
                                    sales.map(
                                        sale => (

                                            <div
                                                key={
                                                    sale._id ||
                                                    sale.saleNumber
                                                }
                                                className="
                                                    px-5
                                                    py-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                    "
                                                >
                                                    <span
                                                        dir="ltr"
                                                        className="
                                                            font-mono
                                                            text-sm
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                    >
                                                        {
                                                            sale.saleNumber
                                                        }
                                                    </span>

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-slate-500
                                                        "
                                                    >
                                                        {
                                                            formatDate(
                                                                sale.createdAt
                                                            )
                                                        }
                                                    </span>
                                                </div>

                                                <div
                                                    className="
                                                        mt-2
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        sale.items
                                                            ?.length ||
                                                        0
                                                    }{" "}
                                                    صنف —{" "}
                                                    {
                                                        (
                                                            sale.items ||
                                                            []
                                                        )
                                                            .reduce(
                                                                (
                                                                    total,
                                                                    item
                                                                ) =>
                                                                    total +
                                                                    Number(
                                                                        item.quantity ||
                                                                        0
                                                                    ),
                                                                0
                                                            )
                                                    }{" "}
                                                    وحدة
                                                </div>
                                            </div>

                                        )
                                    )
                                }
                            </div>
                        )
            }
        </div>
    );

}


function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    return new Intl.DateTimeFormat(
        "ar-EG",
        {
            dateStyle:
                "short",

            timeStyle:
                "short",
        }
    ).format(
        new Date(value)
    );

}


function translateStoreSaleError(
    message
) {

    const value =
        String(
            message ||
            ""
        );


    if (
        /insufficient physical stock/i
            .test(value)
    ) {

        return "الكمية المطلوبة أكبر من المخزون الفعلي المتاح. حدّث الصفحة وراجع الكمية.";

    }


    if (
        /inventory tracking is disabled/i
            .test(value)
    ) {

        return "تتبع المخزون غير مفعّل لأحد المنتجات في عملية البيع.";

    }


    if (
        /same product cannot appear more than once/i
            .test(value)
    ) {

        return "تمت إضافة نفس المنتج أكثر من مرة داخل عملية البيع.";

    }


    if (
        /not found/i
            .test(value)
    ) {

        return "تعذر العثور على أحد المنتجات. حدّث الصفحة وحاول مرة أخرى.";

    }


    return (
        value ||
        "تعذر تسجيل البيع. حاول مرة أخرى."
    );

}
