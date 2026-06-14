import React from 'react';
import { Utensils, Apple, Trash2 } from 'lucide-react';

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

export default function RecentScans({
    scans,
    totalScans,
    onDelete,
}: RecentScansProps) {
    const mealTypeColors = {
        breakfast:
            'bg-emerald-50/80 border border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300',
        lunch: 'bg-blue-50/80 border border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-300',
        dinner: 'bg-indigo-50/80 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-350',
        snack: 'bg-yellow-50/80 border border-yellow-100 text-yellow-750 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-300',
    };

    const mealLabels = {
        breakfast: 'Sarapan',
        lunch: 'Makan Siang',
        dinner: 'Makan Malam',
        snack: 'Cemilan',
    };

    const floatFormat = (val: any, decimals = 1) => {
        const num = parseFloat(val);
        if (isNaN(num)) return '0';
        return num.toFixed(decimals).replace('.0', '');
    };

    return (
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-100/80 bg-white p-6 shadow-2xl sm:p-8 dark:border-neutral-900/50 dark:bg-neutral-950">
            {/* Glowing background highlights */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-yellow-100/30 opacity-30 blur-3xl dark:bg-yellow-950/10"></div>
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-100/20 opacity-20 blur-3xl dark:bg-emerald-950/10"></div>

            <div className="flex h-full flex-col justify-between gap-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                        <span>Riwayat Scan Hari Ini</span>
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        Pisang yang telah dipindai dan dikonsumsi pada hari ini.
                    </p>
                </div>

                <div className="scrollbar-thumb-yellow-450/20 max-h-[350px] scrollbar-thin scrollbar-track-transparent space-y-4 overflow-y-auto pr-1">
                    {scans.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-3 py-14 text-center">
                            <div className="space-y-1">
                                <p className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-white">
                                    Belum Ada Pemindaian Hari Ini
                                </p>
                                <p className="mx-auto max-w-[280px] text-[10px] leading-relaxed font-semibold text-slate-400">
                                    Gunakan panel sebelah kiri untuk memindai
                                    tingkat kematangan pisang Anda sekarang!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {scans.map((scan) => {
                                return (
                                    <div
                                        key={scan.id}
                                        className="dark:border-neutral-850 hover:border-yellow-450/30 group relative flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-100 bg-slate-50/25 p-4 transition-all duration-300 hover:bg-slate-50/60 hover:shadow-lg sm:flex-row sm:items-center dark:bg-neutral-900/15 dark:hover:border-yellow-500/20 dark:hover:bg-neutral-900/30"
                                    >
                                        <div className="flex flex-1 items-start gap-4">
                                            {/* Scan Image Thumbnail with hover effect */}
                                            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-inner sm:h-20 sm:w-20 dark:border-neutral-800 dark:bg-neutral-900">
                                                {scan.scan_image ? (
                                                    <img
                                                        src={
                                                            scan.scan_image.startsWith('http')
                                                                ? scan.scan_image
                                                                : `/storage/${scan.scan_image}`
                                                        }
                                                        alt={
                                                            scan.nutrition
                                                                ?.item || 'Food'
                                                        }
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                                                        onError={(e) => {
                                                            (
                                                                e.target as HTMLImageElement
                                                            ).src =
                                                                '/images/placeholder-food.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <Apple className="text-slate-350 h-8 w-8 dark:text-neutral-600" />
                                                )}
                                                <div className="absolute right-1 bottom-1 rounded-md bg-yellow-500/90 px-1.5 py-0.5 text-[7px] font-black tracking-wider text-white uppercase shadow-md">
                                                    {Math.round(
                                                        scan.confidence * 100,
                                                    )}
                                                    % Match
                                                </div>
                                            </div>

                                            {/* Food Name, Meal badges, and detailed nutrition block */}
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <div className="space-y-1">
                                                    <h4 className="truncate text-sm leading-tight font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                                                        {scan.nutrition?.item ||
                                                            'Makanan Tidak Dikenal'}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span
                                                            className={`rounded-lg px-2 py-0.5 text-[8px] font-black tracking-wider uppercase shadow-xs ${mealTypeColors[scan.meal_type as keyof typeof mealTypeColors] || 'bg-slate-100 text-slate-700'}`}
                                                        >
                                                            {mealLabels[
                                                                scan.meal_type as keyof typeof mealLabels
                                                            ] || scan.meal_type}
                                                        </span>
                                                        <span className="dark:bg-neutral-850 rounded-lg border border-slate-200/20 bg-slate-100 px-2 py-0.5 text-[8px] font-black tracking-wider text-slate-500 uppercase dark:border-neutral-800/30 dark:text-neutral-400">
                                                            {scan.serving_qty}{' '}
                                                            porsi
                                                        </span>
                                                    </div>
                                                </div>

                                                {scan.nutrition && (
                                                    <div className="space-y-1.5">
                                                        {/* Macro Nutrients Row */}
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            <span className="bg-red-550/5 dark:text-rose-455 flex items-center gap-0.5 rounded-lg border border-red-100/50 px-2 py-0.5 text-[8px] font-black tracking-wider text-rose-600 uppercase dark:border-red-900/20 dark:bg-rose-950/20">
                                                                ⚡{' '}
                                                                {Math.round(
                                                                    scan
                                                                        .nutrition
                                                                        .calories *
                                                                        scan.serving_qty,
                                                                )}{' '}
                                                                kkal
                                                            </span>
                                                            <span className="bg-orange-550/5 dark:text-orange-455 flex items-center gap-0.5 rounded-lg border border-orange-100/50 px-2 py-0.5 text-[8px] font-black tracking-wider text-orange-600 uppercase dark:border-orange-900/20 dark:bg-orange-950/20">
                                                                🥩 P:{' '}
                                                                {floatFormat(
                                                                    scan
                                                                        .nutrition
                                                                        .protein *
                                                                        scan.serving_qty,
                                                                )}
                                                                g
                                                            </span>
                                                            <span className="bg-blue-550/5 dark:text-blue-455 flex items-center gap-0.5 rounded-lg border border-blue-100/50 px-2 py-0.5 text-[8px] font-black tracking-wider text-blue-600 uppercase dark:border-blue-900/20 dark:bg-blue-950/20">
                                                                🍞 K:{' '}
                                                                {floatFormat(
                                                                    scan
                                                                        .nutrition
                                                                        .carbs *
                                                                        scan.serving_qty,
                                                                )}
                                                                g
                                                            </span>
                                                            <span className="bg-emerald-550/5 dark:text-emerald-455 flex items-center gap-0.5 rounded-lg border border-emerald-100/50 px-2 py-0.5 text-[8px] font-black tracking-wider text-emerald-600 uppercase dark:border-emerald-900/20 dark:bg-emerald-950/20">
                                                                🥑 L:{' '}
                                                                {floatFormat(
                                                                    scan
                                                                        .nutrition
                                                                        .fat *
                                                                        scan.serving_qty,
                                                                )}
                                                                g
                                                            </span>
                                                        </div>

                                                        {/* Micro Nutrients Wrap */}
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            {scan.nutrition
                                                                .sugar !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🍭 Gula:{' '}
                                                                    {floatFormat(
                                                                        scan
                                                                            .nutrition
                                                                            .sugar *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    g
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .fiber !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🌾 Serat:{' '}
                                                                    {floatFormat(
                                                                        scan
                                                                            .nutrition
                                                                            .fiber *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    g
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .potassium !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🍌 Kalium:{' '}
                                                                    {Math.round(
                                                                        scan
                                                                            .nutrition
                                                                            .potassium *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .magnesium !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    💎 Mg:{' '}
                                                                    {Math.round(
                                                                        scan
                                                                            .nutrition
                                                                            .magnesium *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .vitamin_c !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🍊 Vit C:{' '}
                                                                    {floatFormat(
                                                                        scan
                                                                            .nutrition
                                                                            .vitamin_c *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .vitamin_b6 !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    💊 Vit B6:{' '}
                                                                    {floatFormat(
                                                                        scan
                                                                            .nutrition
                                                                            .vitamin_b6 *
                                                                            scan.serving_qty,
                                                                        2,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .calcium !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🦴 Kalsium:{' '}
                                                                    {Math.round(
                                                                        scan
                                                                            .nutrition
                                                                            .calcium *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .iron !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🔋 Besi:{' '}
                                                                    {floatFormat(
                                                                        scan
                                                                            .nutrition
                                                                            .iron *
                                                                            scan.serving_qty,
                                                                        2,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                            {scan.nutrition
                                                                .sodium !==
                                                                undefined && (
                                                                <span className="dark:border-neutral-850 flex items-center gap-0.5 rounded-md border border-slate-100 bg-white px-1.5 py-0.5 text-[7.5px] font-bold text-slate-500 dark:bg-neutral-900 dark:text-neutral-400">
                                                                    🧂 Natrium:{' '}
                                                                    {Math.round(
                                                                        scan
                                                                            .nutrition
                                                                            .sodium *
                                                                            scan.serving_qty,
                                                                    )}
                                                                    mg
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Delete circular button */}
                                        <div className="dark:border-neutral-850/60 flex items-center justify-end border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(scan.id)
                                                }
                                                className="border-slate-150 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-white text-slate-400 shadow-xs transition-all hover:border-red-200/50 hover:bg-red-50 hover:text-red-500 hover:shadow-sm active:scale-90 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-red-950/30"
                                                title="Hapus Pemindaian"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="dark:border-neutral-850/80 mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                <span>
                    Scan Hari Ini:{' '}
                    <strong className="text-slate-800 dark:text-white">
                        {totalScans} Kali
                    </strong>
                </span>
            </div>
        </div>
    );
}
