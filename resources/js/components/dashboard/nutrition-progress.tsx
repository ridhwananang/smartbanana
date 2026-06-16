import React from 'react';
import { ShieldCheck, Zap, Heart, Activity, Flame, Droplets, Sun, Bone, Battery, Sparkles } from 'lucide-react';

interface Macro {
    value: number;
    goal: number;
    unit: string;
}

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

interface NutritionProgressProps {
    consumed: number;
    calorieGoal: number;
    macros:
        | {
              protein: Macro;
              carbs: Macro;
              fat: Macro;
              sugar?: Macro;
              fiber?: Macro;
              potassium?: Macro;
              magnesium?: Macro;
              vitamin_c?: Macro;
              vitamin_b6?: Macro;
              sodium?: Macro;
              calcium?: Macro;
              iron?: Macro;
          }
        | undefined;
    scans?: ScanItem[];
}

const fmt = (val: any, d = 1) => {
    const n = parseFloat(val);
    return isNaN(n) ? '0' : n.toFixed(d).replace(/\.0$/, '');
};

const bar = (val: number, goal: number) => Math.min(100, goal > 0 ? (val / goal) * 100 : 0);

export default function NutritionProgress({
    consumed,
    calorieGoal,
    macros,
    scans = [],
}: NutritionProgressProps) {
    // Hitung distribusi kematangan
    let unripe = 0, semiRipe = 0, ripe = 0;
    scans.forEach((scan) => {
        const item = (scan.nutrition?.item || '').toLowerCase();
        const qty = parseFloat(scan.serving_qty as any) || 1;
        if (item.includes('unripe') || item.includes('mentah')) unripe += qty;
        else if (item.includes('semi-ripe') || item.includes('semi-rape') || item.includes('sedang')) semiRipe += qty;
        else ripe += qty;
    });
    const total = unripe + semiRipe + ripe;

    const caloriePct = bar(consumed, calorieGoal);

    // Bio-feedback berdasarkan kandungan nutrisi
    const getBioStatus = () => {
        if (!macros || (macros.fiber?.value ?? 0) === 0) return null;
        const fiber = macros.fiber?.value ?? 0;
        const sugar = macros.sugar?.value ?? 0;
        if (fiber > sugar) return { label: 'Tinggi Serat & Pati Resisten', color: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' };
        if (sugar > 15) return { label: 'Tinggi Gula Alami — Energi Siap Pakai', color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' };
        return { label: 'Nutrisi Seimbang', color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' };
    };
    const bioStatus = getBioStatus();

    const mainMacros = [
        {
            label: 'Serat & Pati Resisten',
            sublabel: 'Gut Health',
            value: macros?.fiber ? `${fmt(macros.fiber.value)} g` : '0 g',
            pct: bar(macros?.fiber?.value ?? 0, macros?.fiber?.goal ?? 25),
            barColor: 'bg-green-500',
            icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
        },
        {
            label: 'Karbohidrat',
            sublabel: 'Energi Utama',
            value: macros?.carbs ? `${fmt(macros.carbs.value)} g` : '0 g',
            pct: bar(macros?.carbs?.value ?? 0, macros?.carbs?.goal ?? 300),
            barColor: 'bg-amber-500',
            icon: <Zap className="h-4 w-4 text-amber-500" />,
        },
        {
            label: 'Kalium',
            sublabel: 'Elektrolit & Otot',
            value: macros?.potassium ? `${Math.round(macros.potassium.value)} mg` : '0 mg',
            pct: bar(macros?.potassium?.value ?? 0, macros?.potassium?.goal ?? 3500),
            barColor: 'bg-red-400',
            icon: <Heart className="h-4 w-4 text-red-400" />,
        },
    ];

    const microNutrients = [
        { label: 'Protein', value: macros?.protein ? `${fmt(macros.protein.value)} g` : '0 g', icon: <Flame className="h-3.5 w-3.5 text-orange-400" /> },
        { label: 'Lemak', value: macros?.fat ? `${fmt(macros.fat.value)} g` : '0 g', icon: <Droplets className="h-3.5 w-3.5 text-blue-400" /> },
        { label: 'Gula', value: macros?.sugar ? `${fmt(macros.sugar.value)} g` : '0 g', icon: <Activity className="h-3.5 w-3.5 text-pink-400" /> },
        { label: 'Magnesium', value: macros?.magnesium ? `${Math.round(macros.magnesium.value)} mg` : '0 mg', icon: <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> },
        { label: 'Vit B6', value: macros?.vitamin_b6 ? `${fmt(macros.vitamin_b6.value, 2)} mg` : '0 mg', icon: <Sun className="h-3.5 w-3.5 text-purple-400" /> },
        { label: 'Vit C', value: macros?.vitamin_c ? `${fmt(macros.vitamin_c.value)} mg` : '0 mg', icon: <Sun className="h-3.5 w-3.5 text-teal-400" /> },
        { label: 'Kalsium', value: macros?.calcium ? `${Math.round(macros.calcium.value)} mg` : '0 mg', icon: <Bone className="h-3.5 w-3.5 text-sky-400" /> },
        { label: 'Zat Besi', value: macros?.iron ? `${fmt(macros.iron.value, 2)} mg` : '0 mg', icon: <Battery className="h-3.5 w-3.5 text-cyan-400" /> },
        { label: 'Natrium', value: macros?.sodium ? `${Math.round(macros.sodium.value)} mg` : '0 mg', icon: <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Spektrum Nutrisi Harian</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                        Akumulasi gizi dari seluruh pisang yang di-scan hari ini.
                    </p>
                </div>
                {bioStatus && (
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className={`h-1.5 w-1.5 rounded-full ${bioStatus.dot}`} />
                        <span className={bioStatus.color}>{bioStatus.label}</span>
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* LEFT: Kalori + Ripeness */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    {/* Calorie summary */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                            Kalori Hari Ini
                        </p>
                        <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
                            {consumed}
                            <span className="ml-1 text-sm font-normal text-slate-400">kkal</span>
                        </p>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                                style={{ width: `${caloriePct}%` }}
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400 dark:text-neutral-500">
                            Target {calorieGoal} kkal / hari
                        </p>
                    </div>

                    {/* Ripeness distribution */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-neutral-500 mb-3">
                            Kematangan
                        </p>
                        {total > 0 ? (
                            <div className="space-y-2">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700 flex">
                                    {unripe > 0 && (
                                        <div className="h-full bg-green-500 transition-all" style={{ width: `${(unripe / total) * 100}%` }} />
                                    )}
                                    {semiRipe > 0 && (
                                        <div className="h-full bg-yellow-400 transition-all" style={{ width: `${(semiRipe / total) * 100}%` }} />
                                    )}
                                    {ripe > 0 && (
                                        <div className="h-full bg-amber-500 transition-all" style={{ width: `${(ripe / total) * 100}%` }} />
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 text-[10px] text-slate-500 dark:text-neutral-400">
                                    {unripe > 0 && <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Mentah: {unripe}</span>}
                                    {semiRipe > 0 && <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />Sedang: {semiRipe}</span>}
                                    {ripe > 0 && <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Matang: {ripe}</span>}
                                </div>
                            </div>
                        ) : (
                            <p className="text-[10px] italic text-slate-400 dark:text-neutral-500">
                                Belum ada scan hari ini.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT: Macros + Micros */}
                <div className="lg:col-span-9 flex flex-col gap-5">
                    {/* 3 Main Macros */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {mainMacros.map((m) => (
                            <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5">
                                        {m.icon}
                                        <span className="text-[10px] font-semibold text-slate-500 dark:text-neutral-400">{m.sublabel}</span>
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">{m.value}</p>
                                <p className="text-[10px] text-slate-400 dark:text-neutral-500 mb-2">{m.label}</p>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${m.barColor}`}
                                        style={{ width: `${m.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Micro-nutrients grid */}
                    <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                            Mineral &amp; Vitamin
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {microNutrients.map((m) => (
                                <div key={m.label} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        {m.icon}
                                        <span className="truncate text-[10px] text-slate-500 dark:text-neutral-400">{m.label}</span>
                                    </div>
                                    <span className="ml-2 flex-shrink-0 text-[10px] font-semibold text-slate-700 dark:text-neutral-300">{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
