import React from 'react';
import { Trash2, Apple } from 'lucide-react';

interface ScanItem {
    id: number;
    scan_image: string | null;
    meal_type: string;
    serving_qty: number;
    confidence: number;
    total_calories: number;
    nutrition?: {
        item: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        sugar?: number;
        fiber?: number;
        potassium?: number;
        magnesium?: number;
        vitamin_c?: number;
        vitamin_b6?: number;
        sodium?: number;
        calcium?: number;
        iron?: number;
    };
}

interface RecentScansProps {
    scans: ScanItem[];
    totalScans: number;
    onDelete: (id: number) => void;
}

const mealLabels: Record<string, string> = {
    breakfast: 'Sarapan',
    lunch: 'Makan Siang',
    dinner: 'Makan Malam',
    snack: 'Cemilan',
};

const getRipenessTag = (item: string) => {
    const lower = item.toLowerCase();
    if (lower.includes('unripe') || lower.includes('mentah')) {
        return { label: 'Mentah', className: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' };
    }
    if (lower.includes('semi-ripe') || lower.includes('semi-rape') || lower.includes('sedang')) {
        return { label: 'Sedang', className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400' };
    }
    return { label: 'Matang', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' };
};

const fmt = (val: any, d = 1) => {
    const n = parseFloat(val);
    return isNaN(n) ? '0' : n.toFixed(d).replace(/\.0$/, '');
};

export default function RecentScans({ scans, totalScans, onDelete }: RecentScansProps) {
    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Riwayat Scan Hari Ini</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                        Pisang yang telah dipindai dan dikonsumsi hari ini.
                    </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {totalScans} scan
                </span>
            </div>

            {/* List */}
            <div className="max-h-[340px] overflow-y-auto">
                {scans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-neutral-900">
                            <Apple className="h-5 w-5 text-slate-300 dark:text-neutral-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-neutral-300">Belum Ada Pemindaian</p>
                            <p className="mt-0.5 text-xs text-slate-400 dark:text-neutral-500">
                                Gunakan panel sebelah kiri untuk memindai pisang Anda.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
                        {scans.map((scan) => {
                            const ripeness = getRipenessTag(scan.nutrition?.item ?? '');
                            const cal = Math.round((scan.nutrition?.calories ?? 0) * scan.serving_qty);

                            return (
                                <div key={scan.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                    {/* Thumbnail */}
                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900">
                                        {scan.scan_image ? (
                                            <img
                                        src={scan.scan_image ?? '/images/placeholder-food.png'}
                                                alt={scan.nutrition?.item ?? 'Pisang'}
                                                className="h-full w-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-food.png'; }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Apple className="h-5 w-5 text-slate-300 dark:text-neutral-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${ripeness.className}`}>
                                                {ripeness.label}
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                                                {mealLabels[scan.meal_type] ?? scan.meal_type}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 truncate text-xs font-medium text-slate-700 dark:text-neutral-300">
                                            {scan.nutrition?.item ?? 'Pisang'}
                                        </p>
                                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400 dark:text-neutral-500">
                                            <span>{cal} kkal</span>
                                            <span>·</span>
                                            <span>K: {fmt(scan.nutrition?.carbs ? scan.nutrition.carbs * scan.serving_qty : 0)}g</span>
                                            <span>·</span>
                                            <span>P: {fmt(scan.nutrition?.protein ? scan.nutrition.protein * scan.serving_qty : 0)}g</span>
                                            {scan.nutrition?.potassium !== undefined && (
                                                <>
                                                    <span>·</span>
                                                    <span>K⁺: {Math.round(scan.nutrition.potassium * scan.serving_qty)}mg</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Confidence + Delete */}
                                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500">
                                            {(scan.confidence * 100).toFixed(1)}%
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(scan.id)}
                                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-neutral-700 dark:hover:border-red-900/40 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                                            title="Hapus"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            {scans.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-neutral-800">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-neutral-500">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Mentah</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-400" /> Sedang</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Matang</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                        Total: {scans.reduce((s, sc) => s + Math.round((sc.nutrition?.calories ?? 0) * sc.serving_qty), 0)} kkal
                    </span>
                </div>
            )}
        </div>
    );
}
