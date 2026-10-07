"use client";


import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Edit3,
    PackagePlus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";

import productService from
    "@/services/productService";

import categoryService from
    "@/services/categoryService";

import brandService from
    "@/services/brandService";

import ProductFormModal from
    "@/components/admin/products/ProductFormModal";

import ar from
    "@/locales/ar";

import uploadService from
    "@/services/uploadService";


const PRODUCTS_PER_PAGE = 24;
const formatCurrency =
    value => {

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


export default function ProductsPage() {

    const [
        products,
        setProducts,
    ] =
        useState([]);


    const [
        categories,
        setCategories,
    ] =
        useState([]);


    const [
        brands,
        setBrands,
    ] =
        useState([]);


    const [
        pagination,
        setPagination,
    ] =
        useState({

            page: 1,

            limit: PRODUCTS_PER_PAGE,

            total: 0,

            pages: 1,

        });


    const [
        searchInput,
        setSearchInput,
    ] =
        useState("");


    const [
        filters,
        setFilters,
    ] =
        useState({

            search: "",

            category: "",

            brand: "",

            sort: "newest",

            page: 1,

        });


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
        modalOpen,
        setModalOpen,
    ] =
        useState(false);


    const [
        selectedProduct,
        setSelectedProduct,
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

                                ...filters,

                                limit: PRODUCTS_PER_PAGE,

                            });


                    setProducts(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.meta ||
                        {
                            page: 1,
                            limit: PRODUCTS_PER_PAGE,
                            total: 0,
                            pages: 1,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        ar.products
                            .loadError

                    );

                } finally {

                    setLoading(false);

                }

            },
            [filters]
        );


    const loadOptions =
        useCallback(
            async () => {

                try {

                    const [
                        categoriesResponse,
                        brandsResponse,
                    ] =
                        await Promise.all([

                            categoryService
                                .getCategories(),

                            brandService
                                .getBrands(),

                        ]);


                    setCategories(
                        categoriesResponse
                            .data ||
                        []
                    );


                    setBrands(
                        brandsResponse
                            .data ||
                        []
                    );


                } catch {

                    // Product list can still
                    // render even if filters
                    // fail to load.

                }

            },
            []
        );


    useEffect(
        () => {

            loadOptions();

        },
        [loadOptions]
    );


    useEffect(
        () => {

            loadProducts();

        },
        [loadProducts]
    );


    const handleSearch =
        event => {

            event.preventDefault();


            setFilters(
                previous => ({

                    ...previous,

                    search:
                        searchInput.trim(),

                    page: 1,

                })
            );

        };


    const changeFilter =
        (
            field,
            value
        ) => {

            setFilters(
                previous => ({

                    ...previous,

                    [field]:
                        value,

                    page: 1,

                })
            );

        };


    const openCreate =
        () => {

            setSelectedProduct(
                null
            );

            setModalOpen(
                true
            );

        };


    const openEdit =
        product => {

            setSelectedProduct(
                product
            );

            setModalOpen(
                true
            );

        };


    const closeModal =
        () => {

            if (saving) {
                return;
            }


            setModalOpen(
                false
            );

            setSelectedProduct(
                null
            );

        };


  const handleSave =
    async (
        productData,
        imageChanges = {}
    ) => {

        setSaving(true);

        setMessage("");

        setError("");


        try {

            if (selectedProduct) {

                await productService
                    .updateProduct(

                        selectedProduct._id,

                        productData

                    );


                const removedImages =
                    imageChanges
                        .removedExistingImages ||
                    [];


                if (
                    removedImages.length >
                    0
                ) {

                    await Promise.allSettled(

                        removedImages.map(
                            image =>
                                uploadService
                                    .deleteImage(
                                        image.publicId
                                    )
                        )

                    );

                }


                setMessage(
                    ar.products
                        .updateSuccess
                );

            } else {

                await productService
                    .createProduct(
                        productData
                    );


                setMessage(
                    ar.products
                        .createSuccess
                );

            }


            setModalOpen(
                false
            );

            setSelectedProduct(
                null
            );


            await loadProducts();


        } catch (error) {

            setError(

                error.response
                    ?.data
                    ?.message ||
                ar.products
                    .saveError

            );

        } finally {

            setSaving(false);

        }

    };

    const handleDelete =
        async product => {

            const confirmed =
                window.confirm(
                    `هل أنت متأكد من حذف المنتج "${product.title}"؟`
                );


            if (!confirmed) {
                return;
            }


            setMessage("");

            setError("");


            try {

                await productService
                    .deleteProduct(
                        product._id
                    );


                setMessage(
                    ar.products
                        .deleteSuccess
                );


                await loadProducts();


            } catch (error) {

                setError(

                    error.response
                        ?.data
                        ?.message ||
                    ar.products
                        .deleteError

                );

            }

        };


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
                        {ar.products.title}
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        {
                            ar.products
                                .description
                        }
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        openCreate
                    }
                    className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        rounded-lg
                        bg-slate-900
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        hover:bg-slate-800
                    "
                >

                    <PackagePlus
                        size={18}
                    />

                    {
                        ar.products
                            .addProduct
                    }

                </button>

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

                <div
                    className="
                        grid
                        gap-3
                        lg:grid-cols-[2fr_1fr_1fr_1fr]
                    "
                >

                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="
                            flex
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
                                    ar.products
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
                            className="
                                rounded-lg
                                bg-slate-800
                                px-4
                                text-sm
                                font-medium
                                text-white
                            "
                        >
                            {ar.common.search}
                        </button>

                    </form>


                    <select
                        value={
                            filters.category
                        }
                        onChange={
                            event =>
                                changeFilter(
                                    "category",
                                    event
                                        .target
                                        .value
                                )
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                        "
                    >

                        <option value="">
                            {
                                ar.products
                                    .allCategories
                            }
                        </option>

                        {
                            categories.map(
                                category => (

                                    <option
                                        key={
                                            category
                                                ._id
                                        }
                                        value={
                                            category
                                                ._id
                                        }
                                    >
                                        {
                                            category
                                                .name
                                        }
                                    </option>

                                )
                            )
                        }

                    </select>


                    <select
                        value={
                            filters.brand
                        }
                        onChange={
                            event =>
                                changeFilter(
                                    "brand",
                                    event
                                        .target
                                        .value
                                )
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                        "
                    >

                        <option value="">
                            {
                                ar.products
                                    .allBrands
                            }
                        </option>

                        {
                            brands.map(
                                brand => (

                                    <option
                                        key={
                                            brand
                                                ._id
                                        }
                                        value={
                                            brand
                                                ._id
                                        }
                                    >
                                        {
                                            brand.name
                                        }
                                    </option>

                                )
                            )
                        }

                    </select>


                    <select
                        value={
                            filters.sort
                        }
                        onChange={
                            event =>
                                changeFilter(
                                    "sort",
                                    event
                                        .target
                                        .value
                                )
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-2.5
                            text-sm
                        "
                    >

                        <option value="newest">
                            {
                                ar.products
                                    .newest
                            }
                        </option>

                        <option value="oldest">
                            {
                                ar.products
                                    .oldest
                            }
                        </option>

                        <option value="price_asc">
                            {
                                ar.products
                                    .priceLowToHigh
                            }
                        </option>

                        <option value="price_desc">
                            {
                                ar.products
                                    .priceHighToLow
                            }
                        </option>

                    </select>

                </div>

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

                            <LoadingState />

                        )
                        : products.length ===
                            0
                            ? (

                                <EmptyState />

                            )
                            : (

                                <ProductsTable
                                    products={
                                        products
                                    }
                                    onEdit={
                                        openEdit
                                    }
                                    onDelete={
                                        handleDelete
                                    }
                                />

                            )
                }

            </div>


            <Pagination
                pagination={
                    pagination
                }
                onPageChange={
                    page =>
                        setFilters(
                            previous => ({

                                ...previous,

                                page,

                            })
                        )
                }
            />


            <ProductFormModal
                open={
                    modalOpen
                }
                product={
                    selectedProduct
                }
                categories={
                    categories
                }
                brands={
                    brands
                }
                saving={
                    saving
                }
                onClose={
                    closeModal
                }
                onSubmit={
                    handleSave
                }
            />

        </div>

    );

}


function ProductsTable({
    products,
    onEdit,
    onDelete,
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
                    min-w-[950px]
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

                        <TableHead>
                            {ar.products.product}
                        </TableHead>

                        <TableHead>
                            {ar.products.sku}
                        </TableHead>

                        <TableHead>
                            {ar.products.category}
                        </TableHead>

                        <TableHead>
                            {ar.products.brand}
                        </TableHead>

                        <TableHead>
                            {ar.products.regularPrice}
                        </TableHead>

                        <TableHead>
                            {ar.products.salePrice}
                        </TableHead>

                        <TableHead>
                            {ar.products.stock}
                        </TableHead>

                        <TableHead>
                            {ar.products.stockStatus}
                        </TableHead>

                        <TableHead>
                            {ar.products.actions}
                        </TableHead>

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

                                    <TableCell>

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

                                    </TableCell>


                                    <TableCell>

                                        <span
                                            dir="ltr"
                                            className="
                                                font-mono
                                                text-xs
                                            "
                                        >
                                            {product.sku}
                                        </span>

                                    </TableCell>


                                    <TableCell>
                                        {
                                            product.category
                                                ?.name ||
                                            "—"
                                        }
                                    </TableCell>


                                    <TableCell>
                                        {
                                            product.brand
                                                ?.name ||
                                            "—"
                                        }
                                    </TableCell>


                                    <TableCell>
                                        {
                                            formatCurrency(
                                                product
                                                    .regularPrice
                                            )
                                        }
                                    </TableCell>


                                    <TableCell>

                                        {
                                            product
                                                .salePrice >
                                            0
                                                ? formatCurrency(
                                                    product
                                                        .salePrice
                                                )
                                                : "—"
                                        }

                                    </TableCell>


                                    <TableCell>

                                        <span
                                            className="
                                                font-semibold
                                                text-slate-900
                                            "
                                        >
                                            {
                                                product
                                                    .stockQuantity
                                            }
                                        </span>

                                    </TableCell>


                                    <TableCell>

                                        <StockBadge
                                            status={
                                                product
                                                    .stockStatus
                                            }
                                        />

                                    </TableCell>


                                    <TableCell>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <button
                                                type="button"
                                                title={
                                                    ar.common.edit
                                                }
                                                onClick={
                                                    () =>
                                                        onEdit(
                                                            product
                                                        )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-slate-300
                                                    p-2
                                                    text-slate-600
                                                    hover:bg-slate-100
                                                "
                                            >

                                                <Edit3
                                                    size={16}
                                                />

                                            </button>


                                            <button
                                                type="button"
                                                title={
                                                    ar.common.delete
                                                }
                                                onClick={
                                                    () =>
                                                        onDelete(
                                                            product
                                                        )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-red-200
                                                    p-2
                                                    text-red-600
                                                    hover:bg-red-50
                                                "
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </TableCell>

                                </tr>

                            )
                        )
                    }

                </tbody>

            </table>

        </div>

    );

}


function StockBadge({
    status,
}) {

    const inStock =
        status ===
        "in-stock";


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
                    inStock
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                }
            `}
        >

            {
                inStock
                    ? ar.products.inStock
                    : ar.products.outOfStock
            }

        </span>

    );

}


function TableHead({
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


function TableCell({
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


function LoadingState() {

    return (

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

    );

}


function EmptyState() {

    return (

        <div
            className="
                flex
                min-h-[300px]
                items-center
                justify-center
                p-6
                text-center
                text-sm
                text-slate-500
            "
        >
            {ar.products.noProducts}
        </div>

    );

}


function Pagination({
    pagination,
    onPageChange,
}) {

    if (
        !pagination ||
        pagination.pages <= 1
    ) {

        return null;

    }


    return (

        <div
            className="
                mt-5
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
            "
        >

            <div
                className="
                    text-sm
                    text-slate-500
                "
            >

                {ar.products.page}{" "}
                {pagination.page}{" "}
                {ar.products.from}{" "}
                {pagination.pages}

            </div>


            <div
                className="
                    flex
                    gap-2
                "
            >

                <button
                    type="button"
                    disabled={
                        pagination.page <=
                        1
                    }
                    onClick={
                        () =>
                            onPageChange(
                                pagination.page -
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
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    {ar.products.previous}
                </button>


                <button
                    type="button"
                    disabled={
                        pagination.page >=
                        pagination.pages
                    }
                    onClick={
                        () =>
                            onPageChange(
                                pagination.page +
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
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    {ar.products.next}
                </button>

            </div>

        </div>

    );

}