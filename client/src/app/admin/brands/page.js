"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Edit3,
    RefreshCw,
    Tags,
    Trash2,
} from "lucide-react";

import brandService from
    "@/services/brandService";


const emptyForm = {

    name: "",

    slug: "",

    logo: "",

    isActive: true,

};


const unwrapData =
    response =>
        response?.data ||
        [];


export default function AdminBrandsPage() {

    const [
        brands,
        setBrands,
    ] =
        useState([]);


    const [
        form,
        setForm,
    ] =
        useState(
            emptyForm
        );


    const [
        editingId,
        setEditingId,
    ] =
        useState(null);


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        saving,
        setSaving,
    ] =
        useState(false);


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


    const loadBrands =
        async () => {

            setLoading(
                true
            );

            setError("");


            try {

                const response =
                    await brandService
                        .getAdminBrands();


                setBrands(
                    unwrapData(
                        response
                    )
                );

            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر تحميل الماركات."
                );

            } finally {

                setLoading(
                    false
                );

            }

        };


    useEffect(
        () => {

            loadBrands();

        },
        []
    );


    const resetForm =
        () => {

            setForm(
                emptyForm
            );

            setEditingId(
                null
            );

        };


    const handleSubmit =
        async event => {

            event.preventDefault();


            setSaving(
                true
            );

            setError("");

            setMessage("");


            try {

                const payload = {

                    name:
                        form.name
                            .trim(),

                    slug:
                        form.slug
                            .trim(),

                    logo:
                        form.logo
                            .trim(),

                    isActive:
                        form.isActive,

                };


                if (editingId) {

                    await brandService
                        .updateBrand(
                            editingId,
                            payload
                        );


                    setMessage(
                        "تم تحديث الماركة بنجاح."
                    );

                } else {

                    await brandService
                        .createBrand(
                            payload
                        );


                    setMessage(
                        "تم إضافة الماركة بنجاح."
                    );

                }


                resetForm();


                await loadBrands();

            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر حفظ الماركة."
                );

            } finally {

                setSaving(
                    false
                );

            }

        };


    const handleEdit =
        brand => {

            setEditingId(
                brand._id
            );


            setForm({

                name:
                    brand.name ||
                    "",

                slug:
                    brand.slug ||
                    "",

                logo:
                    brand.logo ||
                    "",

                isActive:
                    brand.isActive !==
                    false,

            });


            window.scrollTo({

                top: 0,

                behavior:
                    "smooth",

            });

        };


    const handleDelete =
        async brand => {

            const confirmed =
                window.confirm(
                    `هل تريد حذف ماركة "${brand.name}"؟`
                );


            if (!confirmed) {

                return;

            }


            setError("");

            setMessage("");


            try {

                await brandService
                    .deleteBrand(
                        brand._id
                    );


                setMessage(
                    "تم حذف الماركة."
                );


                if (
                    editingId ===
                    brand._id
                ) {

                    resetForm();

                }


                await loadBrands();

            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر حذف الماركة."
                );

            }

        };


    return (

        <div
            dir="rtl"
            className="space-y-6"
        >

            <div>

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    إدارة الماركات
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    أضف وعدّل الماركات المتاحة عند إنشاء أو تعديل المنتجات.
                </p>

            </div>


            {error && (

                <div
                    className="
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


            {message && (

                <div
                    className="
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-sm
                        text-green-700
                    "
                >
                    {message}
                </div>

            )}


            <form
                onSubmit={
                    handleSubmit
                }
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
                        mb-5
                        flex
                        items-center
                        gap-2
                    "
                >
                    <Tags
                        size={20}
                    />

                    <h2
                        className="
                            font-bold
                        "
                    >
                        {
                            editingId
                                ? "تعديل الماركة"
                                : "إضافة ماركة جديدة"
                        }
                    </h2>
                </div>


                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >

                    <label
                        className="
                            space-y-2
                        "
                    >
                        <span
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            اسم الماركة
                        </span>

                        <input
                            required
                            value={
                                form.name
                            }
                            onChange={
                                event =>
                                    setForm(
                                        current => ({
                                            ...current,
                                            name:
                                                event.target
                                                    .value,
                                        })
                                    )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                px-4
                                py-3
                                outline-none
                                focus:border-slate-500
                            "
                            placeholder="مثال: LG"
                        />
                    </label>


                    <label
                        className="
                            space-y-2
                        "
                    >
                        <span
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            رابط الماركة (بالإنجليزية)
                        </span>

                        <input
                            required
                            dir="ltr"
                            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                            title="استخدم حروف إنجليزية صغيرة وأرقام وشرطات فقط."
                            value={
                                form.slug
                            }
                            onChange={
                                event =>
                                    setForm(
                                        current => ({
                                            ...current,
                                            slug:
                                                event.target
                                                    .value,
                                        })
                                    )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                px-4
                                py-3
                                text-left
                                outline-none
                                focus:border-slate-500
                            "
                            placeholder="lg"
                        />

                        <p
                            className="
                                text-xs
                                leading-5
                                text-slate-500
                            "
                        >
                            يُستخدم في رابط الماركة. أمثلة:{" "}
                            <span
                                dir="ltr"
                                className="
                                    font-mono
                                "
                            >
                                lg
                            </span>
                            {" "}أو{" "}
                            <span
                                dir="ltr"
                                className="
                                    font-mono
                                "
                            >
                                black-and-decker
                            </span>
                            .
                        </p>
                    </label>


                    <label
                        className="
                            space-y-2
                            md:col-span-2
                        "
                    >
                        <span
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            رابط شعار الماركة (اختياري)
                        </span>

                        <input
                            dir="ltr"
                            value={
                                form.logo
                            }
                            onChange={
                                event =>
                                    setForm(
                                        current => ({
                                            ...current,
                                            logo:
                                                event.target
                                                    .value,
                                        })
                                    )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-300
                                px-4
                                py-3
                                text-left
                                outline-none
                                focus:border-slate-500
                            "
                            placeholder="https://..."
                        />
                    </label>


                    {editingId && (

                        <label
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <input
                                type="checkbox"
                                checked={
                                    form.isActive
                                }
                                onChange={
                                    event =>
                                        setForm(
                                            current => ({
                                                ...current,
                                                isActive:
                                                    event.target
                                                        .checked,
                                            })
                                        )
                                }
                            />

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                "
                            >
                                الماركة نشطة
                            </span>
                        </label>

                    )}

                </div>


                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        gap-3
                    "
                >

                    <button
                        type="submit"
                        disabled={
                            saving
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
                            saving
                                ? "جاري الحفظ..."
                                : editingId
                                    ? "حفظ التعديلات"
                                    : "إضافة الماركة"
                        }
                    </button>


                    {editingId && (

                        <button
                            type="button"
                            onClick={
                                resetForm
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-300
                                px-5
                                py-3
                                text-sm
                                font-semibold
                            "
                        >
                            إلغاء التعديل
                        </button>

                    )}

                </div>

            </form>


            <div
                className="
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
                        p-5
                    "
                >
                    <h2
                        className="
                            font-bold
                        "
                    >
                        الماركات الحالية
                    </h2>

                    <button
                        type="button"
                        onClick={
                            loadBrands
                        }
                        className="
                            rounded-lg
                            p-2
                            hover:bg-slate-100
                        "
                        aria-label="تحديث"
                    >
                        <RefreshCw
                            size={18}
                        />
                    </button>
                </div>


                {loading ? (

                    <div
                        className="
                            p-8
                            text-center
                            text-sm
                            text-slate-500
                        "
                    >
                        جاري تحميل الماركات...
                    </div>

                ) : brands.length ===
                    0 ? (

                    <div
                        className="
                            p-8
                            text-center
                            text-sm
                            text-slate-500
                        "
                    >
                        لا توجد ماركات.
                    </div>

                ) : (

                    <div
                        className="
                            overflow-x-auto
                        "
                    >
                        <table
                            className="
                                w-full
                                min-w-[650px]
                                text-sm
                            "
                        >
                            <thead
                                className="
                                    bg-slate-50
                                    text-slate-600
                                "
                            >
                                <tr>
                                    <th
                                        className="
                                            px-5
                                            py-3
                                            text-right
                                        "
                                    >
                                        الاسم
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-3
                                            text-right
                                        "
                                    >
                                        رابط الماركة
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-3
                                            text-right
                                        "
                                    >
                                        الحالة
                                    </th>

                                    <th
                                        className="
                                            px-5
                                            py-3
                                            text-right
                                        "
                                    >
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    brands.map(
                                        brand => (

                                            <tr
                                                key={
                                                    brand._id
                                                }
                                                className="
                                                    border-t
                                                    border-slate-100
                                                "
                                            >
                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        font-semibold
                                                    "
                                                >
                                                    {
                                                        brand.name
                                                    }
                                                </td>

                                                <td
                                                    dir="ltr"
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-left
                                                        text-slate-600
                                                    "
                                                >
                                                    {
                                                        brand.slug
                                                    }
                                                </td>

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >
                                                    {
                                                        brand.isActive
                                                            ? "نشطة"
                                                            : "غير نشطة"
                                                    }
                                                </td>

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >
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
                                                                    handleEdit(
                                                                        brand
                                                                    )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-slate-200
                                                                p-2
                                                                hover:bg-slate-50
                                                            "
                                                            aria-label="تعديل"
                                                        >
                                                            <Edit3
                                                                size={17}
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                () =>
                                                                    handleDelete(
                                                                        brand
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
                                                            aria-label="حذف"
                                                        >
                                                            <Trash2
                                                                size={17}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                )}

            </div>

        </div>

    );

}
