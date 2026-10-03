"use client";

import { useEffect, useState } from "react";
import { Edit3, Percent, RefreshCw, Ticket, Trash2 } from "lucide-react";
import promotionService from "@/services/promotionService";

const emptyForm = {
    code: "",
    discountPercent: "10",
    startsAt: "",
    expiresAt: "",
    isActive: true,
};

const unwrapData = response => response?.data || [];

const toInputDateTime = value => {
    if (!value) return "";
    const date = new Date(value);
    const pad = number => String(number).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toIso = value => new Date(value).toISOString();

const getStatus = promotion => {
    const now = new Date();
    const start = new Date(promotion.startsAt);
    const end = new Date(promotion.expiresAt);

    if (!promotion.isActive) {
        return { label: "متوقف", className: "bg-slate-100 text-slate-600" };
    }
    if (now < start) {
        return { label: "لم يبدأ", className: "bg-amber-100 text-amber-700" };
    }
    if (now >= end) {
        return { label: "منتهي", className: "bg-red-100 text-red-700" };
    }
    return { label: "فعال", className: "bg-emerald-100 text-emerald-700" };
};

const formatDate = value => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("ar-EG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
};

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadPromotions = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await promotionService.getAdminPromotions();
            setPromotions(unwrapData(response));
        } catch (err) {
            setError(err.response?.data?.message || "تعذر تحميل أكواد الخصم.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromotions();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const updateField = (field, value) => {
        setForm(previous => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const payload = {
                code: form.code.trim().toUpperCase(),
                discountPercent: Number(form.discountPercent),
                startsAt: toIso(form.startsAt),
                expiresAt: toIso(form.expiresAt),
                isActive: form.isActive,
            };

            if (editingId) {
                await promotionService.updatePromotion(editingId, payload);
                setMessage("تم تحديث كود الخصم بنجاح.");
            } else {
                await promotionService.createPromotion(payload);
                setMessage("تم إنشاء كود الخصم بنجاح.");
            }

            resetForm();
            await loadPromotions();
        } catch (err) {
            setError(err.response?.data?.message || "تعذر حفظ كود الخصم.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = promotion => {
        setEditingId(promotion._id);
        setForm({
            code: promotion.code || "",
            discountPercent: String(promotion.discountPercent ?? ""),
            startsAt: toInputDateTime(promotion.startsAt),
            expiresAt: toInputDateTime(promotion.expiresAt),
            isActive: promotion.isActive !== false,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeactivate = async promotion => {
        if (!window.confirm(`هل تريد إيقاف كود الخصم "${promotion.code}"؟`)) return;
        setError("");
        setMessage("");
        try {
            await promotionService.deactivatePromotion(promotion._id);
            setMessage("تم إيقاف كود الخصم.");
            if (editingId === promotion._id) resetForm();
            await loadPromotions();
        } catch (err) {
            setError(err.response?.data?.message || "تعذر إيقاف كود الخصم.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-sm font-semibold text-slate-500">التسويق</div>
                    <h1 className="mt-1 text-2xl font-black text-slate-900">أكواد الخصم</h1>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                        أنشئ أكواد خصم بنسبة محددة وحدد فترة صلاحيتها، وسيتم التحقق منها على الخادم عند إنشاء الطلب.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadPromotions}
                    disabled={loading}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    تحديث
                </button>
            </div>

            {(error || message) && (
                <div className={`rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    {error || message}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Ticket size={19} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-900">{editingId ? "تعديل كود الخصم" : "إنشاء كود خصم جديد"}</h2>
                        <p className="mt-1 text-xs text-slate-500">النسبة تُطبق على إجمالي المنتجات قبل خصم نقاط الولاء.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700">كود الخصم</span>
                        <input
                            value={form.code}
                            onChange={event => updateField("code", event.target.value.toUpperCase())}
                            placeholder="WELCOME10"
                            maxLength={50}
                            required
                            dir="ltr"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left outline-none focus:border-slate-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700">نسبة الخصم %</span>
                        <div className="relative">
                            <input
                                type="number"
                                min="0.01"
                                max="100"
                                step="0.01"
                                value={form.discountPercent}
                                onChange={event => updateField("discountPercent", event.target.value)}
                                required
                                dir="ltr"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-11 text-left outline-none focus:border-slate-500"
                            />
                            <Percent size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700">يبدأ في</span>
                        <input
                            type="datetime-local"
                            value={form.startsAt}
                            onChange={event => updateField("startsAt", event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700">ينتهي في</span>
                        <input
                            type="datetime-local"
                            value={form.expiresAt}
                            onChange={event => updateField("expiresAt", event.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                        />
                    </label>

                    <label className="flex items-center gap-3 text-sm font-bold text-slate-700 md:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={event => updateField("isActive", event.target.checked)}
                            className="h-4 w-4"
                        />
                        الكود مفعل
                    </label>

                    <div className="flex flex-wrap gap-3 md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                        >
                            {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إنشاء الكود"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
                            >
                                إلغاء التعديل
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="font-black text-slate-900">الأكواد الحالية</h2>
                </div>

                {loading ? (
                    <div className="px-5 py-12 text-center text-sm text-slate-500">جاري تحميل الأكواد...</div>
                ) : promotions.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-slate-500">لا توجد أكواد خصم حتى الآن.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-5 py-3 text-right">الكود</th>
                                    <th className="px-5 py-3 text-right">الخصم</th>
                                    <th className="px-5 py-3 text-right">البداية</th>
                                    <th className="px-5 py-3 text-right">النهاية</th>
                                    <th className="px-5 py-3 text-right">الحالة</th>
                                    <th className="px-5 py-3 text-right">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promotions.map(promotion => {
                                    const status = getStatus(promotion);
                                    return (
                                        <tr key={promotion._id} className="border-t border-slate-100">
                                            <td dir="ltr" className="px-5 py-4 text-left font-black">{promotion.code}</td>
                                            <td dir="ltr" className="px-5 py-4 text-left font-bold">{promotion.discountPercent}%</td>
                                            <td className="px-5 py-4 text-slate-600">{formatDate(promotion.startsAt)}</td>
                                            <td className="px-5 py-4 text-slate-600">{formatDate(promotion.expiresAt)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => handleEdit(promotion)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50" aria-label="تعديل">
                                                        <Edit3 size={17} />
                                                    </button>
                                                    {promotion.isActive && (
                                                        <button type="button" onClick={() => handleDeactivate(promotion)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label="إيقاف">
                                                            <Trash2 size={17} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
