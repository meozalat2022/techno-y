"use client";


import {
    useEffect,
    useState,
} from "react";

import {
    ImagePlus,
    Loader2,
    Trash2,
    X,
} from "lucide-react";

import uploadService from
    "@/services/uploadService";

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

                    images:
                        product.images ||
                        [],

                });

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
                    form.trackInventory,

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