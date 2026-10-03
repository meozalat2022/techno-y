"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ImagePlus,
    Loader2,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import productService from
    "@/services/productService";

import uploadService from
    "@/services/uploadService"

import ar from
    "@/locales/ar";


const emptyForm = {

    title: "",

    sku: "",

    description: "",

    category: "",

    brand: "",

    regularPrice: "",

    salePrice: "",

    compatibleModels: "",

    tags: "",

    weight: "",

    featured: false,

    lowStockThreshold: 5,

    trackInventory: true,

    isBundle: false,

    bundleItems: [],

    images: [],

};


export default function ProductFormModal({
    open,
    product,
    categories,
    brands,
    saving,
    onClose,
    onSubmit,
}) {

    const [
        form,
        setForm,
    ] =
        useState(
            emptyForm
        );


    const [
        uploadingImages,
        setUploadingImages,
    ] =
        useState(false);


    const [
        imageError,
        setImageError,
    ] =
        useState("");


    const [
        newlyUploadedIds,
        setNewlyUploadedIds,
    ] =
        useState([]);


    const [
        removedExistingImages,
        setRemovedExistingImages,
    ] =
        useState([]);


    const [
        bundleProducts,
        setBundleProducts,
    ] =
        useState([]);


    const [
        bundleProductsLoading,
        setBundleProductsLoading,
    ] =
        useState(false);


    const [
        bundleProductsError,
        setBundleProductsError,
    ] =
        useState("");


  const loadBundleProducts =
    async () => {

        setBundleProductsLoading(
            true
        );

        setBundleProductsError("");

        try {

            const response =
                await productService.getProducts({
                    page: 1,
                    limit: 1000,
                });


            const products =
                Array.isArray(
                    response?.products
                )
                    ? response.products
                    : Array.isArray(
                        response?.data
                    )
                        ? response.data
                        : [];


            setBundleProducts(
                products.filter(
                    item =>
                        !item.isBundle &&
                        item._id !==
                            product?._id
                )
            );


        } catch (error) {

            setBundleProductsError(
                error?.response?.data?.message ||
                error?.message ||
                "تعذر تحميل المنتجات المتاحة لمكونات الباقة."
            );


        } finally {

            setBundleProductsLoading(
                false
            );

        }

    };


    useEffect(
        () => {

            if (!open) {
                return;
            }


            setImageError("");

            setNewlyUploadedIds([]);

            setRemovedExistingImages([]);


            if (product) {

                setForm({

                    title:
                        product.title || "",

                    sku:
                        product.sku || "",

                    description:
                        product.description || "",

                    category:
                        product.category
                            ?._id ||
                        product.category ||
                        "",

                    brand:
                        product.brand
                            ?._id ||
                        product.brand ||
                        "",

                    regularPrice:
                        product.regularPrice ??
                        "",

                    salePrice:
                        product.salePrice ??
                        0,

                    compatibleModels:
                        (
                            product
                                .compatibleModels ||
                            []
                        ).join(", "),

                    tags:
                        (
                            product.tags ||
                            []
                        ).join(", "),

                    weight:
                        product.weight ??
                        0,

                    featured:
                        Boolean(
                            product.featured
                        ),

                    lowStockThreshold:
                        product
                            .lowStockThreshold ??
                        5,

                    trackInventory:
                        product
                            .trackInventory !==
                        false,

                    isBundle:
                        Boolean(
                            product.isBundle
                        ),

                    bundleItems:
                        Array.isArray(
                            product.bundleItems
                        )
                            ? product.bundleItems.map(
                                item => ({
                                    product:
                                        item.product?._id ||
                                        item.product ||
                                        "",
                                    quantity:
                                        Number(
                                            item.quantity ||
                                            1
                                        ),
                                })
                            )
                            : [],

                    images:
                        product.images ||
                        [],

                });


                if (product.isBundle) {

                    loadBundleProducts();

                }

            } else {

                setForm(
                    emptyForm
                );

            }

        },
        [
            open,
            product,
        ]
    );


    if (!open) {
        return null;
    }


    const updateField =
        (
            field,
            value
        ) => {

            setForm(
                previous => ({

                    ...previous,

                    [field]:
                        value,

                })
            );

        };


    const handleBundleToggle =
        checked => {

            updateField(
                "isBundle",
                checked
            );


            if (checked) {

                loadBundleProducts();

            } else {

                updateField(
                    "bundleItems",
                    []
                );

            }

        };


    const addBundleItem =
        () => {

            const usedIds =
                new Set(
                    form.bundleItems.map(
                        item =>
                            item.product
                    )
                );


            const firstAvailable =
                bundleProducts.find(
                    item =>
                        !usedIds.has(
                            item._id
                        )
                );


            if (!firstAvailable) {

                return;

            }


            updateField(
                "bundleItems",
                [

                    ...form.bundleItems,

                    {
                        product:
                            firstAvailable._id,

                        quantity: 1,
                    },

                ]
            );

        };


    const updateBundleItem =
        (
            index,
            field,
            value
        ) => {

            const nextItems =
                form.bundleItems.map(
                    (
                        item,
                        itemIndex
                    ) =>
                        itemIndex === index
                            ? {
                                ...item,

                                [field]:
                                    field ===
                                    "quantity"
                                        ? Math.max(
                                            1,
                                            Number(
                                                value
                                            ) || 1
                                        )
                                        : value,
                            }
                            : item
                );


            updateField(
                "bundleItems",
                nextItems
            );

        };


    const removeBundleItem =
        index => {

            updateField(
                "bundleItems",
                form.bundleItems.filter(
                    (
                        _,
                        itemIndex
                    ) =>
                        itemIndex !==
                        index
                )
            );

        };


    const handleImageUpload =
        async event => {

            const files =
                Array.from(
                    event.target.files ||
                    []
                );


            event.target.value =
                "";


            if (
                files.length === 0
            ) {
                return;
            }


            const remainingSlots =
                4 -
                form.images.length;


            if (
                remainingSlots <= 0
            ) {

                setImageError(
                    "الحد الأقصى 4 صور للمنتج."
                );

                return;

            }


            const selectedFiles =
                files.slice(
                    0,
                    remainingSlots
                );


            setUploadingImages(
                true
            );

            setImageError("");


            try {

                const images =
                    await uploadService
                        .uploadImages(
                            selectedFiles
                        );


                if (
                    images.length === 0
                ) {

                    throw new Error(
                        "لم يتم رفع الصور."
                    );

                }


                setForm(
                    previous => ({

                        ...previous,

                        images: [
                            ...previous.images,
                            ...images,
                        ],

                    })
                );


                setNewlyUploadedIds(
                    previous => [

                        ...previous,

                        ...images.map(
                            image =>
                                image.publicId
                        ),

                    ]
                );


            } catch (error) {

                setImageError(

                    error.response
                        ?.data
                        ?.message ||
                    "تعذر رفع الصور."

                );

            } finally {

                setUploadingImages(
                    false
                );

            }

        };


    const handleRemoveImage =
        async image => {

            const isNew =
                newlyUploadedIds.includes(
                    image.publicId
                );


            setForm(
                previous => ({

                    ...previous,

                    images:
                        previous.images
                            .filter(
                                current =>
                                    current
                                        .publicId !==
                                    image.publicId
                            ),

                })
            );


            if (isNew) {

                try {

                    await uploadService
                        .deleteImage(
                            image.publicId
                        );

                } catch {
                    // Product data is still safe.
                }


                setNewlyUploadedIds(
                    previous =>
                        previous.filter(
                            id =>
                                id !==
                                image.publicId
                        )
                );


                return;

            }


            setRemovedExistingImages(
                previous => [

                    ...previous,

                    image,

                ]
            );

        };


    const handleClose =
        async () => {

            if (
                saving ||
                uploadingImages
            ) {
                return;
            }


            if (
                newlyUploadedIds.length >
                0
            ) {

                await Promise.allSettled(

                    newlyUploadedIds.map(
                        publicId =>
                            uploadService
                                .deleteImage(
                                    publicId
                                )
                    )

                );

            }


            onClose();

        };


    const handleSubmit =
        event => {

            event.preventDefault();


            if (
                form.isBundle &&
                form.bundleItems.length === 0
            ) {

                return;

            }


            const payload = {

                title:
                    form.title.trim(),

                sku:
                    form.sku.trim(),

                description:
                    form.description
                        .trim(),

                category:
                    form.category,

                brand:
                    form.brand,

                regularPrice:
                    Number(
                        form.regularPrice
                    ),

                salePrice:
                    Number(
                        form.salePrice ||
                        0
                    ),

                compatibleModels:
                    form.compatibleModels
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean),

                tags:
                    form.tags
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean),

                weight:
                    Number(
                        form.weight ||
                        0
                    ),

                featured:
                    form.featured,

                lowStockThreshold:
                    Number(
                        form
                            .lowStockThreshold ||
                        0
                    ),

                trackInventory:
                    form.isBundle
                        ? false
                        : form.trackInventory,

                isBundle:
                    form.isBundle,

                bundleItems:
                    form.isBundle
                        ? form.bundleItems.map(
                            item => ({
                                product:
                                    item.product,

                                quantity:
                                    Number(
                                        item.quantity
                                    ),
                            })
                        )
                        : [],

                images:
                    form.images,

            };


            onSubmit(
                payload,
                {
                    removedExistingImages,
                    newlyUploadedIds,
                }
            );

        };


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
                    max-w-3xl
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-xl
                "
            >

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-white
                        px-6
                        py-4
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >

                        {
                            product
                                ? ar.products
                                    .editProduct
                                : ar.products
                                    .addProduct
                        }

                    </h2>


                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
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


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="p-6"
                >

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        <FormField label="اسم المنتج">

                            <input
                                required
                                value={form.title}
                                onChange={
                                    event =>
                                        updateField(
                                            "title",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField label="SKU">

                            <input
                                required
                                dir="ltr"
                                value={form.sku}
                                onChange={
                                    event =>
                                        updateField(
                                            "sku",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField label="القسم">

                            <select
                                required
                                value={
                                    form.category
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "category",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            >

                                <option value="">
                                    اختر القسم
                                </option>

                                {
                                    categories.map(
                                        category => (

                                            <option
                                                key={
                                                    category._id
                                                }
                                                value={
                                                    category._id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </FormField>


                        <FormField label="الماركة">

                            <select
                                required
                                value={
                                    form.brand
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "brand",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            >

                                <option value="">
                                    اختر الماركة
                                </option>

                                {
                                    brands.map(
                                        brand => (

                                            <option
                                                key={
                                                    brand._id
                                                }
                                                value={
                                                    brand._id
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

                        </FormField>


                        <FormField label="السعر الأساسي">

                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    form.regularPrice
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "regularPrice",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField label="سعر العرض">

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    form.salePrice
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "salePrice",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField label="الوزن">

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    form.weight
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "weight",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField label="حد تنبيه المخزون">

                            <input
                                type="number"
                                min="0"
                                value={
                                    form.lowStockThreshold
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "lowStockThreshold",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>

                    </div>


                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                        "
                    >

                        <CheckboxField
                            label="منتج Bundle"
                            checked={
                                form.isBundle
                            }
                            onChange={
                                handleBundleToggle
                            }
                        />


                        {form.isBundle && (

                            <div className="mt-4">

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <div>

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            مكونات الباقة
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            مخزون الباقة يُحسب تلقائيًا من مخزون مكوناتها.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            addBundleItem
                                        }
                                        disabled={
                                            bundleProductsLoading ||
                                            bundleProducts.length ===
                                                form.bundleItems.length
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-slate-300
                                            bg-white
                                            px-3
                                            py-2
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            hover:bg-slate-100
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        <Plus
                                            size={16}
                                        />

                                        إضافة مكون

                                    </button>

                                </div>


                                {bundleProductsLoading && (

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-slate-500
                                        "
                                    >

                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />

                                        جاري تحميل المنتجات...

                                    </div>

                                )}


                                {bundleProductsError && (

                                    <div
                                        className="
                                            mt-4
                                            rounded-lg
                                            bg-red-50
                                            px-3
                                            py-2
                                            text-sm
                                            text-red-700
                                        "
                                    >
                                        {
                                            bundleProductsError
                                        }
                                    </div>

                                )}


                                {!bundleProductsLoading &&
                                    form.bundleItems.length === 0 && (

                                    <div
                                        className="
                                            mt-4
                                            rounded-xl
                                            border
                                            border-dashed
                                            border-slate-300
                                            bg-white
                                            px-4
                                            py-6
                                            text-center
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        لم تتم إضافة أي مكونات بعد.
                                    </div>

                                )}


                                <div
                                    className="
                                        mt-4
                                        space-y-3
                                    "
                                >

                                    {form.bundleItems.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const selectedIds =
                                                new Set(
                                                    form.bundleItems
                                                        .filter(
                                                            (
                                                                _,
                                                                itemIndex
                                                            ) =>
                                                                itemIndex !==
                                                                index
                                                        )
                                                        .map(
                                                            current =>
                                                                current.product
                                                        )
                                                );


                                            return (

                                                <div
                                                    key={`${index}-${item.product}`}
                                                    className="
                                                        grid
                                                        gap-3
                                                        rounded-xl
                                                        border
                                                        border-slate-200
                                                        bg-white
                                                        p-3
                                                        md:grid-cols-[1fr_120px_auto]
                                                        md:items-end
                                                    "
                                                >

                                                    <FormField
                                                        label="المنتج"
                                                    >

                                                        <select
                                                            required
                                                            value={
                                                                item.product
                                                            }
                                                            onChange={
                                                                event =>
                                                                    updateBundleItem(
                                                                        index,
                                                                        "product",
                                                                        event.target.value
                                                                    )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        >

                                                            <option value="">
                                                                اختر المنتج
                                                            </option>


                                                            {bundleProducts
                                                                .filter(
                                                                    option =>
                                                                        !selectedIds.has(
                                                                            option._id
                                                                        ) ||
                                                                        option._id ===
                                                                            item.product
                                                                )
                                                                .map(
                                                                    option => (

                                                                        <option
                                                                            key={
                                                                                option._id
                                                                            }
                                                                            value={
                                                                                option._id
                                                                            }
                                                                        >

                                                                            {
                                                                                option.title
                                                                            }

                                                                            {
                                                                                option.sku
                                                                                    ? ` — ${option.sku}`
                                                                                    : ""
                                                                            }

                                                                        </option>

                                                                    )
                                                                )}

                                                        </select>

                                                    </FormField>


                                                    <FormField
                                                        label="الكمية"
                                                    >

                                                        <input
                                                            required
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={
                                                                event =>
                                                                    updateBundleItem(
                                                                        index,
                                                                        "quantity",
                                                                        event.target.value
                                                                    )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />

                                                    </FormField>


                                                    <button
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                removeBundleItem(
                                                                    index
                                                                )
                                                        }
                                                        className="
                                                            inline-flex
                                                            h-[42px]
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-red-200
                                                            px-3
                                                            text-red-600
                                                            hover:bg-red-50
                                                        "
                                                        aria-label="حذف المكون"
                                                    >

                                                        <Trash2
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    <div className="mt-5">

                        <FormField label="الوصف">

                            <textarea
                                rows="4"
                                value={
                                    form.description
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "description",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>

                    </div>


                    <div
                        className="
                            mt-5
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        <FormField
                            label="الموديلات المتوافقة"
                            hint="افصل بين الموديلات بفاصلة"
                        >

                            <input
                                value={
                                    form.compatibleModels
                                }
                                onChange={
                                    event =>
                                        updateField(
                                            "compatibleModels",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField
                            label="الكلمات المفتاحية"
                            hint="افصل بين الكلمات بفاصلة"
                        >

                            <input
                                value={form.tags}
                                onChange={
                                    event =>
                                        updateField(
                                            "tags",
                                            event.target.value
                                        )
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>

                    </div>


                    <div className="mt-6">

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <h3
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    صور المنتج
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    حتى 4 صور، بحد أقصى 5 ميجابايت للصورة
                                </p>

                            </div>


                            <label
                                className={`
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
                                    ${
                                        form.images.length >= 4 ||
                                        uploadingImages
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer hover:bg-slate-50"
                                    }
                                `}
                            >

                                {
                                    uploadingImages
                                        ? (
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                        )
                                        : (
                                            <ImagePlus
                                                size={17}
                                            />
                                        )
                                }

                                رفع صور


                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={
                                        form.images.length >=
                                            4 ||
                                        uploadingImages
                                    }
                                    onChange={
                                        handleImageUpload
                                    }
                                    className="hidden"
                                />

                            </label>

                        </div>


                        {imageError && (

                            <div
                                className="
                                    mb-3
                                    rounded-lg
                                    bg-red-50
                                    px-3
                                    py-2
                                    text-sm
                                    text-red-700
                                "
                            >
                                {imageError}
                            </div>

                        )}


                        {
                            form.images.length >
                            0
                                ? (

                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                            sm:grid-cols-4
                                        "
                                    >

                                        {
                                            form.images.map(
                                                image => (

                                                    <div
                                                        key={
                                                            image.publicId
                                                        }
                                                        className="
                                                            group
                                                            relative
                                                            aspect-square
                                                            overflow-hidden
                                                            rounded-xl
                                                            border
                                                            border-slate-200
                                                            bg-slate-50
                                                        "
                                                    >

                                                        <img
                                                            src={
                                                                image.url
                                                            }
                                                            alt=""
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-cover
                                                            "
                                                        />


                                                        <button
                                                            type="button"
                                                            onClick={
                                                                () =>
                                                                    handleRemoveImage(
                                                                        image
                                                                    )
                                                            }
                                                            className="
                                                                absolute
                                                                left-2
                                                                top-2
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-white
                                                                text-red-600
                                                                shadow
                                                                hover:bg-red-50
                                                            "
                                                        >

                                                            <Trash2
                                                                size={15}
                                                            />

                                                        </button>

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                )
                                : (

                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-dashed
                                            border-slate-300
                                            px-4
                                            py-8
                                            text-center
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        لا توجد صور للمنتج
                                    </div>

                                )
                        }

                    </div>


                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            gap-6
                        "
                    >

                        <CheckboxField
                            label="منتج مميز"
                            checked={
                                form.featured
                            }
                            onChange={
                                value =>
                                    updateField(
                                        "featured",
                                        value
                                    )
                            }
                        />


                        {!form.isBundle && (

                            <CheckboxField
                                label="تتبع المخزون"
                                checked={
                                    form.trackInventory
                                }
                                onChange={
                                    value =>
                                        updateField(
                                            "trackInventory",
                                            value
                                        )
                                }
                            />

                        )}

                    </div>


                    <div
                        className="
                            mt-8
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-slate-200
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={
                                saving ||
                                uploadingImages
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-300
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-700
                                hover:bg-slate-50
                            "
                        >
                            إلغاء
                        </button>


                        <button
                            type="submit"
                            disabled={
                                saving ||
                                uploadingImages
                            }
                            className="
                                rounded-lg
                                bg-slate-900
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-slate-800
                                disabled:opacity-60
                            "
                        >

                            {
                                saving
                                    ? "جاري الحفظ..."
                                    : "حفظ"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-900
    outline-none
    transition
    focus:border-slate-500
`;


function FormField({
    label,
    hint,
    children,
}) {

    return (

        <label className="block">

            <span
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                "
            >
                {label}
            </span>


            {children}


            {hint && (

                <span
                    className="
                        mt-1
                        block
                        text-xs
                        text-slate-400
                    "
                >
                    {hint}
                </span>

            )}

        </label>

    );

}


function CheckboxField({
    label,
    checked,
    onChange,
}) {

    return (

        <label
            className="
                flex
                cursor-pointer
                items-center
                gap-2
                text-sm
                text-slate-700
            "
        >

            <input
                type="checkbox"
                checked={checked}
                onChange={
                    event =>
                        onChange(
                            event.target.checked
                        )
                }
                className="
                    h-4
                    w-4
                "
            />

            {label}

        </label>

    );

}