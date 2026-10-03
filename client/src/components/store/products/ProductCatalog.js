"use client";


import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    Filter,
    RefreshCw,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import productService from
    "@/services/productService";

import categoryService from
    "@/services/categoryService";

import brandService from
    "@/services/brandService";

import ProductCard from
    "@/components/store/ProductCard";


const PRODUCTS_PER_PAGE = 24;


export default function ProductCatalog() {

    const router =
        useRouter();


    const pathname =
        usePathname();


    const searchParams =
        useSearchParams();


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
            limit:
                PRODUCTS_PER_PAGE,
            total: 0,
            pages: 1,
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
        searchInput,
        setSearchInput,
    ] =
        useState(
            searchParams.get(
                "search"
            ) || ""
        );


    const [
        mobileFiltersOpen,
        setMobileFiltersOpen,
    ] =
        useState(false);


    const filters =
        useMemo(
            () => ({

                page:
                    Math.max(
                        Number(
                            searchParams.get(
                                "page"
                            )
                        ) || 1,
                        1
                    ),

                search:
                    searchParams.get(
                        "search"
                    ) || "",

                category:
                    searchParams.get(
                        "category"
                    ) || "",

                brand:
                    searchParams.get(
                        "brand"
                    ) || "",

                sort:
                    searchParams.get(
                        "sort"
                    ) || "newest",

                featured:
                    searchParams.get(
                        "featured"
                    ) === "true",

            }),
            [
                searchParams,
            ]
        );


    const updateParams =
        useCallback(
            (
                changes,
                {
                    resetPage = true,
                    replace = false,
                } = {}
            ) => {

                const params =
                    new URLSearchParams(
                        searchParams.toString()
                    );


                Object.entries(
                    changes
                ).forEach(
                    ([
                        key,
                        value,
                    ]) => {

                        if (
                            value === "" ||
                            value === null ||
                            value === undefined ||
                            value === false
                        ) {

                            params.delete(
                                key
                            );

                        } else {

                            params.set(
                                key,
                                String(value)
                            );

                        }

                    }
                );


                if (resetPage) {

                    params.delete(
                        "page"
                    );

                }


                const query =
                    params.toString();


                const destination =
                    query
                        ? `${pathname}?${query}`
                        : pathname;


                if (replace) {

                    router.replace(
                        destination,
                        {
                            scroll: false,
                        }
                    );

                } else {

                    router.push(
                        destination,
                        {
                            scroll: false,
                        }
                    );

                }

            },
            [
                pathname,
                router,
                searchParams,
            ]
        );


    const loadOptions =
        useCallback(
            async () => {

                try {

                    const [
                        categoryResponse,
                        brandResponse,
                    ] =
                        await Promise.all([

                            categoryService
                                .getCategories(),

                            brandService
                                .getBrands(),

                        ]);


                    setCategories(
                        categoryResponse
                            .data ||
                        []
                    );


                    setBrands(
                        brandResponse
                            .data ||
                        []
                    );


                } catch {

                    // Product catalog can still
                    // load if filter metadata
                    // fails independently.

                }

            },
            []
        );


    const loadProducts =
        useCallback(
            async () => {

                setLoading(true);

                setError("");


                try {

                    const response =
                        await productService
                            .getProducts({

                                page:
                                    filters.page,

                                limit:
                                    PRODUCTS_PER_PAGE,

                                search:
                                    filters.search,

                                category:
                                    filters.category,

                                brand:
                                    filters.brand,

                                sort:
                                    filters.sort,

                                featured:
                                    filters.featured,

                            });


                    setProducts(
                        response.data ||
                        []
                    );


                    setPagination(
                        response.pagination ||
                        {
                            page: 1,
                            limit:
                                PRODUCTS_PER_PAGE,
                            total: 0,
                            pages: 1,
                        }
                    );


                } catch (error) {

                    setError(

                        error.response
                            ?.data
                            ?.message ||
                        "تعذر تحميل المنتجات."

                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                filters,
            ]
        );


    useEffect(
        () => {

            loadOptions();

        },
        [
            loadOptions,
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


    useEffect(
        () => {

            setSearchInput(
                filters.search
            );

        },
        [
            filters.search,
        ]
    );


    useEffect(
        () => {

            if (
                !mobileFiltersOpen
            ) {
                return;
            }


            const previousOverflow =
                document.body.style
                    .overflow;


            document.body.style
                .overflow =
                "hidden";


            return () => {

                document.body.style
                    .overflow =
                    previousOverflow;

            };

        },
        [
            mobileFiltersOpen,
        ]
    );


    const handleSearch =
        event => {

            event.preventDefault();


            updateParams({
                search:
                    searchInput.trim(),
            });

        };


    const clearFilters =
        () => {

            setSearchInput("");


            router.push(
                pathname,
                {
                    scroll: false,
                }
            );


            setMobileFiltersOpen(
                false
            );

        };


    const activeFilterCount =
        [
            filters.category,
            filters.brand,
            filters.featured,
        ].filter(Boolean)
            .length;


    const selectedCategory =
        categories.find(
            category =>
                category._id ===
                filters.category
        );


    const selectedBrand =
        brands.find(
            brand =>
                brand._id ===
                filters.brand
        );


    return (

        <>

            <section
                className="
                    border-b
                    border-[#E7E0D5]
                    bg-[#FAF6EE]
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-4
                        py-7
                        sm:px-6
                        lg:px-8
                        lg:py-9
                    "
                >

                    <div
                        className="
                            max-w-3xl
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-semibold
                                text-[#6B6862]
                            "
                        >
                            متجر تكنو-واي
                        </div>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-black
                                text-[#252525]
                                sm:text-4xl
                            "
                        >
                            {
                                filters.featured
                                    ? "المنتجات المميزة"
                                    : selectedCategory
                                        ? selectedCategory.name
                                        : selectedBrand
                                            ? `منتجات ${selectedBrand.name}`
                                            : filters.search
                                                ? `نتائج البحث عن "${filters.search}"`
                                                : "كل المنتجات"
                            }
                        </h1>


                        <p
                            className="
                                mt-3
                                text-sm
                                leading-7
                                text-[#6B6862]
                            "
                        >
                            ابحث وفلتر حسب القسم
                            والماركة للوصول إلى قطعة
                            الغيار المناسبة لجهازك.
                        </p>

                    </div>

                </div>

            </section>


            <section
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
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
                            min-w-0
                            flex-1
                            items-center
                            rounded-xl
                            border
                            border-[#D9D0C3]
                            bg-[#FFFEFC]
                            px-3
                            transition
                            focus-within:border-slate-500
                        "
                    >

                        <Search
                            size={18}
                            className="
                                shrink-0
                                text-[#918C84]
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
                            placeholder="ابحث باسم المنتج أو SKU..."
                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                px-3
                                py-3
                                text-sm
                                outline-none
                            "
                        />

                    </div>


                    <button
                        type="submit"
                        className="
                            rounded-xl
                            bg-[#1F4E5F]
                            px-5
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-[#173C49]
                        "
                    >
                        بحث
                    </button>


                    <button
                        type="button"
                        onClick={
                            () =>
                                setMobileFiltersOpen(
                                    true
                                )
                        }
                        className="
                            relative
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-[#D9D0C3]
                            bg-[#FFFEFC]
                            px-4
                            text-sm
                            font-bold
                            text-[#4D4A45]
                            lg:hidden
                        "
                    >

                        <Filter
                            size={18}
                        />

                        <span
                            className="
                                hidden
                                sm:inline
                            "
                        >
                            الفلاتر
                        </span>


                        {
                            activeFilterCount >
                            0 &&
                            (

                                <span
                                    className="
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#1F4E5F]
                                        px-1
                                        text-[10px]
                                        text-white
                                    "
                                >
                                    {
                                        activeFilterCount
                                    }
                                </span>

                            )
                        }

                    </button>

                </form>


                <div
                    className="
                        mt-6
                        grid
                        gap-8
                        lg:grid-cols-[220px_minmax(0,1fr)]
                    "
                >

                    <aside
                        className="
                            hidden
                            lg:block
                        "
                    >

                        <div
                            className="
                                sticky
                                top-5
                            "
                        >

                            <DesktopFilters
                                categories={
                                    categories
                                }
                                brands={
                                    brands
                                }
                                filters={
                                    filters
                                }
                                updateParams={
                                    updateParams
                                }
                                clearFilters={
                                    clearFilters
                                }
                            />

                        </div>

                    </aside>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <CatalogToolbar
                            pagination={
                                pagination
                            }
                            filters={
                                filters
                            }
                            updateParams={
                                updateParams
                            }
                        />


                        <ActiveFilters
                            filters={
                                filters
                            }
                            categories={
                                categories
                            }
                            brands={
                                brands
                            }
                            updateParams={
                                updateParams
                            }
                            clearFilters={
                                clearFilters
                            }
                        />


                        {
                            loading
                                ? (

                                    <ProductGridSkeleton />

                                )
                                : error
                                    ? (

                                        <ErrorState
                                            message={
                                                error
                                            }
                                            onRetry={
                                                loadProducts
                                            }
                                        />

                                    )
                                    : products.length ===
                                        0
                                        ? (

                                            <EmptyState
                                                clearFilters={
                                                    clearFilters
                                                }
                                            />

                                        )
                                        : (

                                            <div
                                                className="
                                                    mt-5
                                                    grid
                                                    grid-cols-2
                                                    gap-4
                                                    md:grid-cols-3
                                                    xl:grid-cols-4
                                                "
                                            >

                                                {
                                                    products.map(
                                                        product => (

                                                            <ProductCard
                                                                key={
                                                                    product._id
                                                                }
                                                                product={
                                                                    product
                                                                }
                                                            />

                                                        )
                                                    )
                                                }

                                            </div>

                                        )
                        }


                        <Pagination
                            pagination={
                                pagination
                            }
                            onPageChange={
                                page =>
                                    updateParams(
                                        {
                                            page,
                                        },
                                        {
                                            resetPage:
                                                false,
                                        }
                                    )
                            }
                        />

                    </div>

                </div>

            </section>


            {
                mobileFiltersOpen &&
                (

                    <MobileFilters
                        categories={
                            categories
                        }
                        brands={
                            brands
                        }
                        filters={
                            filters
                        }
                        updateParams={
                            updateParams
                        }
                        clearFilters={
                            clearFilters
                        }
                        onClose={
                            () =>
                                setMobileFiltersOpen(
                                    false
                                )
                        }
                    />

                )
            }

        </>

    );

}


function DesktopFilters({
    categories,
    brands,
    filters,
    updateParams,
    clearFilters,
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-[#E7E0D5]
                bg-[#FAF6EE]/55
                p-4
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

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        font-black
                        text-[#252525]
                    "
                >
                    <SlidersHorizontal
                        size={18}
                    />

                    تصفية المنتجات
                </div>


                <button
                    type="button"
                    onClick={
                        clearFilters
                    }
                    className="
                        text-xs
                        font-semibold
                        text-[#6B6862]
                        hover:text-[#1F4E5F]
                    "
                >
                    مسح الكل
                </button>

            </div>


            <FilterContent
                categories={
                    categories
                }
                brands={
                    brands
                }
                filters={
                    filters
                }
                updateParams={
                    updateParams
                }
            />

        </div>

    );

}


function FilterContent({
    categories,
    brands,
    filters,
    updateParams,
}) {

    return (

        <div
            className="
                mt-6
                space-y-7
            "
        >

            <FilterSection
                title="القسم"
            >

                <FilterRadio
                    checked={
                        !filters.category
                    }
                    label="كل الأقسام"
                    onChange={
                        () =>
                            updateParams({
                                category: "",
                            })
                    }
                />


                {
                    categories.map(
                        category => (

                            <FilterRadio
                                key={
                                    category._id
                                }
                                checked={
                                    filters.category ===
                                    category._id
                                }
                                label={
                                    category.name
                                }
                                onChange={
                                    () =>
                                        updateParams({
                                            category:
                                                category._id,
                                        })
                                }
                            />

                        )
                    )
                }

            </FilterSection>


            <FilterSection
                title="الماركة"
            >

                <FilterRadio
                    checked={
                        !filters.brand
                    }
                    label="كل الماركات"
                    onChange={
                        () =>
                            updateParams({
                                brand: "",
                            })
                    }
                />


                {
                    brands.map(
                        brand => (

                            <FilterRadio
                                key={
                                    brand._id
                                }
                                checked={
                                    filters.brand ===
                                    brand._id
                                }
                                label={
                                    brand.name
                                }
                                onChange={
                                    () =>
                                        updateParams({
                                            brand:
                                                brand._id,
                                        })
                                }
                            />

                        )
                    )
                }

            </FilterSection>


            <FilterSection
                title="اختيارات"
            >

                <label
                    className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        text-sm
                        text-[#4D4A45]
                    "
                >

                    <input
                        type="checkbox"
                        checked={
                            filters.featured
                        }
                        onChange={
                            event =>
                                updateParams({
                                    featured:
                                        event.target
                                            .checked,
                                })
                        }
                        className="
                            h-4
                            w-4
                        "
                    />

                    المنتجات المميزة فقط

                </label>

            </FilterSection>

        </div>

    );

}


function FilterSection({
    title,
    children,
}) {

    return (

        <div>

            <h3
                className="
                    mb-3
                    text-sm
                    font-black
                    text-[#252525]
                "
            >
                {title}
            </h3>


            <div
                className="
                    max-h-60
                    space-y-2.5
                    overflow-y-auto
                    pl-1
                "
            >
                {children}
            </div>

        </div>

    );

}


function FilterRadio({
    checked,
    label,
    onChange,
}) {

    return (

        <label
            className="
                flex
                cursor-pointer
                items-center
                gap-3
                text-sm
                text-[#4D4A45]
            "
        >

            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="
                    h-4
                    w-4
                "
            />

            <span>
                {label}
            </span>

        </label>

    );

}


function CatalogToolbar({
    pagination,
    filters,
    updateParams,
}) {

    return (

        <div
            className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >

            <div
                className="
                    text-sm
                    text-[#6B6862]
                "
            >

                {
                    pagination.total >
                    0
                        ? (
                            <>
                                وجدنا{" "}
                                <strong
                                    className="
                                        text-[#252525]
                                    "
                                >
                                    {
                                        new Intl.NumberFormat(
                                            "ar-EG"
                                        ).format(
                                            pagination.total
                                        )
                                    }
                                </strong>{" "}
                                منتج
                            </>
                        )
                        : "لا توجد نتائج"
                }

            </div>


            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <span
                    className="
                        hidden
                        text-xs
                        text-[#6B6862]
                        sm:inline
                    "
                >
                    ترتيب:
                </span>


                <select
                    value={
                        filters.sort
                    }
                    onChange={
                        event =>
                            updateParams({
                                sort:
                                    event.target
                                        .value,
                            })
                    }
                    className="
                        rounded-xl
                        border
                        border-[#D9D0C3]
                        bg-[#FFFEFC]
                        px-3
                        py-2.5
                        text-sm
                        text-[#4D4A45]
                        outline-none
                    "
                >

                    <option
                        value="newest"
                    >
                        الأحدث
                    </option>

                    <option
                        value="oldest"
                    >
                        الأقدم
                    </option>

                    <option
                        value="price_asc"
                    >
                        السعر: من الأقل للأعلى
                    </option>

                    <option
                        value="price_desc"
                    >
                        السعر: من الأعلى للأقل
                    </option>

                </select>

            </div>

        </div>

    );

}


function ActiveFilters({
    filters,
    categories,
    brands,
    updateParams,
    clearFilters,
}) {

    const selectedCategory =
        categories.find(
            item =>
                item._id ===
                filters.category
        );


    const selectedBrand =
        brands.find(
            item =>
                item._id ===
                filters.brand
        );


    const chips = [];


    if (filters.search) {

        chips.push({
            key: "search",
            label:
                `بحث: ${filters.search}`,
            remove:
                () =>
                    updateParams({
                        search: "",
                    }),
        });

    }


    if (selectedCategory) {

        chips.push({
            key: "category",
            label:
                selectedCategory.name,
            remove:
                () =>
                    updateParams({
                        category: "",
                    }),
        });

    }


    if (selectedBrand) {

        chips.push({
            key: "brand",
            label:
                selectedBrand.name,
            remove:
                () =>
                    updateParams({
                        brand: "",
                    }),
        });

    }


    if (filters.featured) {

        chips.push({
            key: "featured",
            label:
                "منتجات مميزة",
            remove:
                () =>
                    updateParams({
                        featured: false,
                    }),
        });

    }


    if (
        chips.length ===
        0
    ) {

        return null;

    }


    return (

        <div
            className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-2
            "
        >

            {
                chips.map(
                    chip => (

                        <button
                            key={
                                chip.key
                            }
                            type="button"
                            onClick={
                                chip.remove
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-[#F4EEE4]
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-[#4D4A45]
                                hover:bg-[#EFE6D8]
                            "
                        >
                            {chip.label}

                            <X
                                size={13}
                            />
                        </button>

                    )
                )
            }


            {
                chips.length >
                1 &&
                (

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="
                            px-2
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#6B6862]
                            hover:text-[#1F4E5F]
                        "
                    >
                        مسح الكل
                    </button>

                )
            }

        </div>

    );

}


function MobileFilters({
    categories,
    brands,
    filters,
    updateParams,
    clearFilters,
    onClose,
}) {

    return (

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
                aria-label="إغلاق الفلاتر"
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    bg-black/45
                "
            />


            <aside
                className="
                    absolute
                    right-0
                    top-0
                    flex
                    h-full
                    w-[320px]
                    max-w-[88vw]
                    flex-col
                    bg-[#FFFEFC]
                    shadow-2xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#E7E0D5]
                        px-5
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            font-black
                            text-[#252525]
                        "
                    >
                        <SlidersHorizontal
                            size={19}
                        />

                        تصفية المنتجات
                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-[#6B6862]
                            hover:bg-[#F4EEE4]
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-5
                        pb-6
                    "
                >

                    <FilterContent
                        categories={
                            categories
                        }
                        brands={
                            brands
                        }
                        filters={
                            filters
                        }
                        updateParams={
                            updateParams
                        }
                    />

                </div>


                <div
                    className="
                        flex
                        gap-3
                        border-t
                        border-[#E7E0D5]
                        p-4
                    "
                >

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="
                            flex-1
                            rounded-xl
                            border
                            border-[#D9D0C3]
                            px-4
                            py-3
                            text-sm
                            font-bold
                            text-[#4D4A45]
                        "
                    >
                        مسح الكل
                    </button>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex-1
                            rounded-xl
                            bg-[#1F4E5F]
                            px-4
                            py-3
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        عرض النتائج
                    </button>

                </div>

            </aside>

        </div>

    );

}


function Pagination({
    pagination,
    onPageChange,
}) {

    if (
        !pagination ||
        pagination.pages <=
        1
    ) {

        return null;

    }


    const currentPage =
        pagination.page;


    const totalPages =
        pagination.pages;


    const start =
        Math.max(
            1,
            currentPage - 2
        );


    const end =
        Math.min(
            totalPages,
            currentPage + 2
        );


    const pages = [];


    for (
        let page = start;
        page <= end;
        page += 1
    ) {

        pages.push(page);

    }


    return (

        <div
            className="
                mt-10
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
            "
        >

            <button
                type="button"
                disabled={
                    currentPage <=
                    1
                }
                onClick={
                    () =>
                        onPageChange(
                            currentPage -
                            1
                        )
                }
                className={
                    pageButtonClass
                }
            >
                السابق
            </button>


            {
                start > 1 &&
                (
                    <>
                        <PageButton
                            page={1}
                            currentPage={
                                currentPage
                            }
                            onClick={
                                onPageChange
                            }
                        />

                        {
                            start >
                            2 &&
                            (
                                <span
                                    className="
                                        px-1
                                        text-[#918C84]
                                    "
                                >
                                    …
                                </span>
                            )
                        }
                    </>
                )
            }


            {
                pages.map(
                    page => (

                        <PageButton
                            key={page}
                            page={page}
                            currentPage={
                                currentPage
                            }
                            onClick={
                                onPageChange
                            }
                        />

                    )
                )
            }


            {
                end <
                totalPages &&
                (
                    <>
                        {
                            end <
                            totalPages -
                            1 &&
                            (
                                <span
                                    className="
                                        px-1
                                        text-[#918C84]
                                    "
                                >
                                    …
                                </span>
                            )
                        }

                        <PageButton
                            page={
                                totalPages
                            }
                            currentPage={
                                currentPage
                            }
                            onClick={
                                onPageChange
                            }
                        />
                    </>
                )
            }


            <button
                type="button"
                disabled={
                    currentPage >=
                    totalPages
                }
                onClick={
                    () =>
                        onPageChange(
                            currentPage +
                            1
                        )
                }
                className={
                    pageButtonClass
                }
            >
                التالي
            </button>

        </div>

    );

}


function PageButton({
    page,
    currentPage,
    onClick,
}) {

    const active =
        page ===
        currentPage;


    return (

        <button
            type="button"
            onClick={
                () =>
                    onClick(page)
            }
            className={`
                flex
                h-10
                min-w-10
                items-center
                justify-center
                rounded-xl
                border
                px-3
                text-sm
                font-bold
                ${
                    active
                        ? "border-[#1F4E5F] bg-[#1F4E5F] text-white"
                        : "border-[#D9D0C3] bg-[#FFFEFC] text-[#4D4A45] hover:bg-[#FAF6EE]"
                }
            `}
        >
            {
                new Intl.NumberFormat(
                    "ar-EG"
                ).format(page)
            }
        </button>

    );

}


function ProductGridSkeleton() {

    return (

        <div
            className="
                mt-5
                grid
                grid-cols-2
                gap-4
                md:grid-cols-3
                xl:grid-cols-4
            "
        >

            {
                Array.from({
                    length: 8,
                }).map(
                    (_, index) => (

                        <div
                            key={index}
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[#E7E0D5]
                                bg-[#FFFEFC]
                            "
                        >

                            <div
                                className="
                                    aspect-square
                                    animate-pulse
                                    bg-[#F4EEE4]
                                "
                            />


                            <div
                                className="
                                    space-y-3
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        h-3
                                        w-1/2
                                        animate-pulse
                                        rounded
                                        bg-[#F4EEE4]
                                    "
                                />

                                <div
                                    className="
                                        h-5
                                        animate-pulse
                                        rounded
                                        bg-[#F4EEE4]
                                    "
                                />

                                <div
                                    className="
                                        h-5
                                        w-2/3
                                        animate-pulse
                                        rounded
                                        bg-[#F4EEE4]
                                    "
                                />

                            </div>

                        </div>

                    )
                )
            }

        </div>

    );

}


function EmptyState({
    clearFilters,
}) {

    return (

        <div
            className="
                mt-5
                rounded-2xl
                border
                border-dashed
                border-[#D9D0C3]
                bg-[#FFFEFC]
                px-6
                py-16
                text-center
            "
        >

            <div
                className="
                    text-lg
                    font-black
                    text-[#252525]
                "
            >
                لم نجد منتجات مطابقة
            </div>


            <p
                className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-7
                    text-[#6B6862]
                "
            >
                جرب تغيير كلمة البحث أو إزالة
                بعض الفلاتر.
            </p>


            <button
                type="button"
                onClick={
                    clearFilters
                }
                className="
                    mt-5
                    rounded-xl
                    bg-[#1F4E5F]
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                "
            >
                عرض كل المنتجات
            </button>

        </div>

    );

}


function ErrorState({
    message,
    onRetry,
}) {

    return (

        <div
            className="
                mt-5
                rounded-2xl
                border
                border-[#E8C3C0]
                bg-[#FBEFEE]
                px-6
                py-12
                text-center
            "
        >

            <div
                className="
                    text-sm
                    text-[#C94A45]
                "
            >
                {message}
            </div>


            <button
                type="button"
                onClick={
                    onRetry
                }
                className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#C94A45]
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                "
            >

                <RefreshCw
                    size={16}
                />

                إعادة المحاولة

            </button>

        </div>

    );

}


const pageButtonClass = `
    rounded-xl
    border
    border-[#D9D0C3]
    bg-[#FFFEFC]
    px-4
    py-2.5
    text-sm
    font-bold
    text-[#4D4A45]
    disabled:cursor-not-allowed
    disabled:opacity-40
`;