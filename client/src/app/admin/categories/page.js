"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Edit3,
    FolderPlus,
    RefreshCw,
    Trash2,
} from "lucide-react";

import categoryService from
    "@/services/categoryService";

const emptyForm = {
    name: "",
    slug: "",
    image: "",
    isActive: true,
};

const unwrapData = response =>
    response?.data || [];

export default function AdminCategoriesPage() {
    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        form,
        setForm,
    ] = useState(emptyForm);

    const [
        editingId,
        setEditingId,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const loadCategories =
        async () => {
            setLoading(true);
            setError("");

            try {
                const response =
                    await categoryService
                        .getAdminCategories();

                setCategories(
                    unwrapData(response)
                );
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر تحميل الأقسام."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadCategories();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit =
        async event => {
            event.preventDefault();

            setSaving(true);
            setError("");
            setMessage("");

            try {
                const payload = {
                    name:
                        form.name.trim(),
                    slug:
                        form.slug.trim(),
                    image:
                        form.image.trim(),
                    isActive:
                        form.isActive,
                };

                if (editingId) {
                    await categoryService
                        .updateCategory(
                            editingId,
                            payload
                        );

                    setMessage(
                        "تم تحديث القسم بنجاح."
                    );
                } else {
                    await categoryService
                        .createCategory(
                            payload
                        );

                    setMessage(
                        "تم إضافة القسم بنجاح."
                    );
                }

                resetForm();
                await loadCategories();
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر حفظ القسم."
                );
            } finally {
                setSaving(false);
            }
        };

    const handleEdit =
        category => {
            setEditingId(
                category._id
            );

            setForm({
                name:
                    category.name || "",
                slug:
                    category.slug || "",
                image:
                    category.image || "",
                isActive:
                    category.isActive !==
                    false,
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

    const handleDelete =
        async category => {
            const confirmed =
                window.confirm(
                    `هل تريد حذف قسم "${category.name}"؟`
                );

            if (!confirmed) {
                return;
            }

            setError("");
            setMessage("");

            try {
                await categoryService
                    .deleteCategory(
                        category._id
                    );

                setMessage(
                    "تم حذف القسم."
                );

                if (
                    editingId ===
                    category._id
                ) {
                    resetForm();
                }

                await loadCategories();
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "تعذر حذف القسم."
                );
            }
        };

    return (
        <div
            dir="rtl"
            className="space-y-6"
        >
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    إدارة الأقسام
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    أضف وعدّل أقسام المنتجات التي تظهر في المتجر.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="mb-5 flex items-center gap-2">
                    <FolderPlus size={20} />
                    <h2 className="font-bold">
                        {editingId
                            ? "تعديل القسم"
                            : "إضافة قسم جديد"}
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-semibold">
                            اسم القسم
                        </span>

                        <input
                            required
                            value={form.name}
                            onChange={
                                event =>
                                    setForm(
                                        current => ({
                                            ...current,
                                            name:
                                                event.target.value,
                                        })
                                    )
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                            placeholder="مثال: قطع غيار الثلاجات"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-semibold">
                            رابط القسم (بالإنجليزية)
                        </span>

                        <input
                            required
                            dir="ltr"
                            value={form.slug}
                            onChange={
                                event =>
                                    setForm(
                                        current => ({
                                            ...current,
                                            slug:
                                                event.target.value,
                                        })
                                    )
                            }
                            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                            title="استخدم حروف إنجليزية صغيرة وأرقام وشرطات فقط."
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-left outline-none focus:border-slate-500"
                            placeholder="refrigerator-spare-parts"
                        />

                        <p className="text-xs leading-5 text-slate-500">
                            يُستخدم في رابط صفحة القسم. مثال:{" "}
                            <span
                                dir="ltr"
                                className="font-mono"
                            >
                                washing-machine-spare-parts
                            </span>
                            . اكتب الرابط بالإنجليزية ولا تكتب اسم القسم العربي هنا.
                        </p>
                    </label>

                    <label className="space-y-2 md:col-span-2">
                        <span className="text-sm font-semibold">
                            رابط صورة القسم (اختياري)
                        </span>

                        <input
                            dir="ltr"
                            value={form.image}
                            onChange={
                                event =>
                                    setForm(
                                        current => ({
                                            ...current,
                                            image:
                                                event.target.value,
                                        })
                                    )
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-left outline-none focus:border-slate-500"
                            placeholder="https://..."
                        />
                    </label>

                    {editingId && (
                        <label className="flex items-center gap-3">
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
                                                    event.target.checked,
                                            })
                                        )
                                }
                            />
                            <span className="text-sm font-semibold">
                                القسم نشط
                            </span>
                        </label>
                    )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving
                            ? "جاري الحفظ..."
                            : editingId
                                ? "حفظ التعديلات"
                                : "إضافة القسم"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold"
                        >
                            إلغاء التعديل
                        </button>
                    )}
                </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                    <h2 className="font-bold">
                        الأقسام الحالية
                    </h2>

                    <button
                        type="button"
                        onClick={
                            loadCategories
                        }
                        className="rounded-lg p-2 hover:bg-slate-100"
                        aria-label="تحديث"
                    >
                        <RefreshCw
                            size={18}
                        />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        جاري تحميل الأقسام...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                        لا توجد أقسام.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-5 py-3 text-right">
                                        الاسم
                                    </th>
                                    <th className="px-5 py-3 text-right">
                                        Slug
                                    </th>
                                    <th className="px-5 py-3 text-right">
                                        الحالة
                                    </th>
                                    <th className="px-5 py-3 text-right">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.map(
                                    category => (
                                        <tr
                                            key={
                                                category._id
                                            }
                                            className="border-t border-slate-100"
                                        >
                                            <td className="px-5 py-4 font-semibold">
                                                {
                                                    category.name
                                                }
                                            </td>

                                            <td
                                                dir="ltr"
                                                className="px-5 py-4 text-left text-slate-600"
                                            >
                                                {
                                                    category.slug
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    category.isActive
                                                        ? "نشط"
                                                        : "غير نشط"
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                                                        aria-label="تعديل"
                                                    >
                                                        <Edit3
                                                            size={17}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
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
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
