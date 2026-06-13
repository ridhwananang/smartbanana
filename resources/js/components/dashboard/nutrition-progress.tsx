import React from 'react';
import { Sparkles, Zap, Heart, ShieldCheck, Activity, Flame, Droplets, Sun, Bone, Battery } from 'lucide-react';

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

export default function NutritionProgress({
    consumed,
    calorieGoal,
    macros,
    scans = [],
}: NutritionProgressProps) {
    // Menghitung status gizi dominan hari ini untuk memberikan bio-feedback cerdas
    const getBioFeedback = () => {
        if (!macros) return null;
        
        const potassiumVal = macros.potassium?.value ?? 0;
        const fiberVal = macros.fiber?.value ?? 0;
        const sugarVal = macros.sugar?.value ?? 0;

        if (potassiumVal > 0 || fiberVal > 0 || sugarVal > 0) {
            // Jika serat lebih dominan dibanding gula (mengindikasikan lebih banyak pisang mentah/sedang)
            if (fiberVal > sugarVal) {
                return {
                    title: "Gut Microbiome Fuel: Tinggi Pati Resisten!",
                    desc: "Pisang yang Anda konsumsi kaya akan Pati Resisten (Resistant Starch) yang berperan sebagai prebiotik hebat untuk menutrisi bakteri baik di lambung serta menjaga stabilitas insulin.",
                    colorClass: "from-emerald-500/20 to-emerald-600/5 dark:from-emerald-950/30 dark:to-emerald-950/5 border-emerald-500/20",
                    icon: <ShieldCheck className="w-5 h-5 text-emerald-500 animate-pulse" />
                };
            }
            // Jika gula lebih dominan (mengindikasikan pisang sangat matang)
            if (sugarVal > 15) {
                return {
                    title: "High-Energy Boost: Sumber Energi Instan!",
                    desc: "Pisang matang yang Anda konsumsi kaya akan gula sederhana alami yang cepat diserap otot. Sangat baik digunakan sebagai penambah tenaga sebelum berolahraga atau memulihkan stamina.",
                    colorClass: "from-yellow-500/20 to-yellow-600/5 dark:from-yellow-950/30 dark:to-yellow-950/5 border-yellow-500/20",
                    icon: <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
                };
            }
            // Definisikan default nutrisi seimbang pisang
            return {
                title: "Balanced Superfood Intake: Nutrisi Seimbang!",
                desc: "Tubuh Anda memperoleh suplai kalium yang optimal untuk melenturkan otot dan menyeimbangkan elektrolit, serta serat sehat untuk pencernaan harian yang prima.",
                colorClass: "from-yellow-500/20 to-yellow-600/5 dark:from-yellow-950/30 dark:to-yellow-950/5 border-yellow-500/20",
                icon: <Heart className="w-5 h-5 text-yellow-500 animate-pulse" />
            };
        }

        return {
            title: "Siap Menganalisis Nutrisi Pisang Anda!",
            desc: "Unggah foto pisang pertama Anda hari ini di panel samping. Kami akan memecah gizi mikro dan makro otentik buah pisang untuk kebugaran tubuh Anda.",
            colorClass: "from-slate-100 to-slate-50 dark:from-neutral-900/40 dark:to-neutral-950/5 border-slate-100 dark:border-neutral-850",
            icon: <Activity className="w-5 h-5 text-slate-400" />
        };
    };

    const feedback = getBioFeedback();

    // 1. Hitung Rasio Distribusi Kematangan Pisang yang discan hari ini
    let unripeCount = 0;
    let semiRipeCount = 0;
    let fullyRipeCount = 0;

    scans.forEach((scan) => {
        const item = (scan.nutrition?.item || '').toLowerCase();
        const qty = parseFloat(scan.serving_qty as any) || 1;
        if (item.includes('unripe') || item.includes('mentah')) {
            unripeCount += qty;
        } else if (item.includes('semi-rape') || item.includes('semi-ripe') || item.includes('sedang')) {
            semiRipeCount += qty;
        } else if (item.includes('fully-rape') || item.includes('fully-ripe') || item.includes('matang')) {
            fullyRipeCount += qty;
        }
    });

    const totalScannedBananas = unripeCount + semiRipeCount + fullyRipeCount;

    const unripePct = totalScannedBananas > 0 ? (unripeCount / totalScannedBananas) * 100 : 0;
    const semiRipePct = totalScannedBananas > 0 ? (semiRipeCount / totalScannedBananas) * 100 : 0;
    const fullyRipePct = totalScannedBananas > 0 ? (fullyRipeCount / totalScannedBananas) * 100 : 0;

    // Helper untuk render 3 Pilar Utama Pisang (Biochemical Pillars)
    const renderPillarCard = (
        name: string,
        value: string | number,
        tagline: string,
        desc: string,
        icon: React.ReactNode,
        badgeClass: string,
        borderHover: string
    ) => {
        const hasData = macros !== undefined;

        return (
            <div className={`relative overflow-hidden p-5 rounded-[2rem] border border-slate-100 dark:border-neutral-850/60 bg-slate-50/25 dark:bg-neutral-900/20 flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-md hover:border-yellow-450/20 dark:hover:border-yellow-500/10 duration-300 transition-all ${borderHover}`}>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 text-left">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${badgeClass}`}>
                            {tagline}
                        </span>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-neutral-400 pt-1">
                            {name}
                        </h4>
                    </div>
                    <div className={`p-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        {icon}
                    </div>
                </div>

                <div className="mt-4 text-left space-y-1.5">
                    {hasData ? (
                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                            {value}
                        </p>
                    ) : (
                        <div className="h-6 w-20 bg-slate-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                    )}
                    <p className="text-[9.5px] leading-relaxed font-semibold text-slate-500 dark:text-neutral-450 italic">
                        {desc}
                    </p>
                </div>
            </div>
        );
    };

    // Helper untuk render Akumulasi Gizi Mikro Pisang Murni (tanpa batas persentase harian yang menyesatkan)
    const renderMicroCard = (
        name: string,
        value: string | number,
        benefit: string,
        icon: React.ReactNode
    ) => {
        const hasData = macros !== undefined;

        return (
            <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-neutral-850/50 bg-slate-50/15 dark:bg-neutral-900/10 backdrop-blur-xs flex flex-col justify-between gap-2.5 group hover:border-yellow-400/20 dark:hover:border-yellow-500/10 transition-all duration-300">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="p-1.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-50 dark:border-neutral-900 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                            {icon}
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">
                            {name}
                        </p>
                    </div>
                    {hasData ? (
                        <p className="text-xs font-black text-slate-800 dark:text-white tracking-tight flex-shrink-0">
                            {value}
                        </p>
                    ) : (
                        <div className="h-4 w-10 bg-slate-200 dark:bg-neutral-800 rounded-xs animate-pulse"></div>
                    )}
                </div>
                
                <p className="text-[8.5px] leading-snug font-bold text-slate-450 dark:text-neutral-500 text-left">
                    💡 {benefit}
                </p>
            </div>
        );
    };

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100/80 bg-white p-6 shadow-xl sm:p-8 lg:col-span-3 dark:border-slate-800/10 dark:bg-neutral-950 flex flex-col gap-8">
            {/* Visual glowing frame background */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-100/30 opacity-40 blur-3xl dark:bg-yellow-950/10"></div>
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-100/20 opacity-30 blur-3xl dark:bg-emerald-950/10"></div>

            {/* Header */}
            <div>
                <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse fill-yellow-500/15" />
                    <span>Spektrum & Bio-Nutrisi Pisang Harian</span>
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    Wawasan bio-nutrisi, kadar kematangan, dan akumulasi gizi murni dari seluruh buah pisang yang Anda scan hari ini.
                </p>
            </div>

            {/* Cerdas Bio-feedback Card */}
            {feedback && (
                <div className={`p-5 rounded-[1.8rem] border flex gap-3.5 bg-gradient-to-tr ${feedback.colorClass} shadow-inner transition-all duration-300`}>
                    <div className="p-3 bg-white dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850 rounded-2xl flex-shrink-0 flex items-center justify-center h-11 w-11 shadow-sm">
                        {feedback.icon}
                    </div>
                    <div className="text-left space-y-1">
                        <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 dark:text-white leading-tight">
                            {feedback.title}
                        </h4>
                        <p className="text-[10px] text-slate-600 dark:text-neutral-300 font-semibold leading-relaxed">
                            {feedback.desc}
                        </p>
                    </div>
                </div>
            )}

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* LEFT HERO: Ripeness Center */}
                <div className="lg:col-span-4 flex flex-col items-center justify-between p-6 rounded-[2rem] border border-slate-100 dark:border-neutral-850/60 bg-gradient-to-b from-yellow-50/30 to-yellow-500/5 dark:from-neutral-900/20 dark:to-yellow-500/2 shadow-inner min-h-[300px]">
                    
                    <div className="w-full text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Konsumsi Hari Ini
                        </p>
                    </div>

                    {/* Glowing circular display of scanned bananas */}
                    <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-white dark:bg-neutral-950 border-4 border-yellow-400 shadow-lg shadow-yellow-400/10">
                        <div className="absolute inset-2 rounded-full border border-dashed border-yellow-250 animate-spin opacity-45" style={{ animationDuration: '20s' }} />
                        <div className="flex flex-col items-center justify-center text-center z-15">
                            <span className="text-4xl" role="img" aria-label="banana">🍌</span>
                            <span className="text-3xl font-black tracking-tight text-slate-800 dark:text-white leading-none mt-1">
                                {totalScannedBananas}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                                Pisang
                            </span>
                        </div>
                    </div>

                    {/* Ripeness Ratio Stacked Progress Bar */}
                    <div className="w-full mt-4 space-y-3">
                        <div className="text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                Spektrum Kematangan
                            </p>
                        </div>

                        {totalScannedBananas > 0 ? (
                            <>
                                {/* Combined horizontal visual bar */}
                                <div className="h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-neutral-800 flex shadow-inner">
                                    {unripePct > 0 && <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${unripePct}%` }} />}
                                    {semiRipePct > 0 && <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${semiRipePct}%` }} />}
                                    {fullyRipePct > 0 && <div className="h-full bg-amber-600 transition-all duration-500" style={{ width: `${fullyRipePct}%` }} />}
                                </div>

                                {/* Legend with counts */}
                                <div className="flex justify-around items-center text-[8.5px] font-black uppercase tracking-wider text-slate-400">
                                    {unripeCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-slate-600 dark:text-neutral-300">Mentah ({unripeCount})</span>
                                        </div>
                                    )}
                                    {semiRipeCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                            <span className="text-slate-600 dark:text-neutral-300">Sedang ({semiRipeCount})</span>
                                        </div>
                                    )}
                                    {fullyRipeCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                            <span className="text-slate-600 dark:text-neutral-300">Matang ({fullyRipeCount})</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-[10px] font-bold text-slate-400 italic text-center leading-relaxed">
                                Silakan memindai pisang pertama Anda untuk melihat rasio kematangan.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT CARDS: Main Macros and Micronutrient Grid */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Primary Macronutrient Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {renderPillarCard(
                            'Pati Resisten & Serat',
                            macros?.fiber ? `${macros.fiber.value.toFixed(1).replace('.0', '')} g` : '0 g',
                            '🟢 Gut Health & Insulin',
                            'Serat tinggi yang lambat dicerna, optimal untuk memelihara mikrobioma usus dan menjaga insulin tetap stabil.',
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />,
                            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450',
                            'hover:border-emerald-500/20 dark:hover:border-emerald-500/10'
                        )}
                        {renderPillarCard(
                            'Energi Cepat & Karbo',
                            macros?.carbs ? `${macros.carbs.value.toFixed(1).replace('.0', '')} g` : '0 g',
                            '⚡ Muscle Fuel',
                            'Gula alami glukosa & fruktosa yang mudah diserap, sangat cocok sebagai asupan penambah tenaga instan sebelum olahraga.',
                            <Zap className="w-5 h-5 text-amber-500" />,
                            'bg-amber-500/10 text-amber-600 dark:text-amber-450',
                            'hover:border-amber-500/20 dark:hover:border-amber-500/10'
                        )}
                        {renderPillarCard(
                            'Kalium & Elektrolit',
                            macros?.potassium ? `${Math.round(macros.potassium.value)} mg` : '0 mg',
                            '🫀 Muscle & Blood Pressure',
                            'Elektrolit vital yang stabil di semua tingkat kematangan, esensial untuk mencegah kram otot dan mengatur sirkulasi cairan.',
                            <Heart className="w-5 h-5 text-red-500 animate-pulse" />,
                            'bg-red-500/10 text-red-650 dark:text-red-455',
                            'hover:border-red-500/20 dark:hover:border-red-500/10'
                        )}
                    </div>

                    {/* Secondary Micronutrients Compact Grid */}
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-3 text-left">
                            Spektrum Mineral & Vitamin Esensial Lainnya
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {renderMicroCard(
                                'Magnesium',
                                macros?.magnesium ? `${Math.round(macros.magnesium.value)} mg` : '0 mg',
                                'Mendukung relaksasi otot dan saraf serta meningkatkan tidur pulas.',
                                <Heart className="w-4 h-4 text-indigo-500" />
                            )}
                            {renderMicroCard(
                                'Vitamin B6',
                                macros?.vitamin_b6 ? `${macros.vitamin_b6.value.toFixed(2)} mg` : '0 mg',
                                'Mendukung hormon serotonin (mood bahagia) & metabolisme protein.',
                                <Sparkles className="w-4 h-4 text-purple-500" />
                            )}
                            {renderMicroCard(
                                'Vitamin C',
                                macros?.vitamin_c ? `${macros.vitamin_c.value.toFixed(1).replace('.0', '')} mg` : '0 mg',
                                'Antioksidan tinggi untuk daya tahan tubuh & kesehatan kulit.',
                                <Sun className="w-4 h-4 text-teal-500" />
                            )}
                            {renderMicroCard(
                                'Kalsium',
                                macros?.calcium ? `${Math.round(macros.calcium.value)} mg` : '0 mg',
                                'Mendukung kekuatan tulang gigi & kelancaran kontraksi otot.',
                                <Bone className="w-4 h-4 text-blue-500" />
                            )}
                            {renderMicroCard(
                                'Zat Besi',
                                macros?.iron ? `${macros.iron.value.toFixed(2)} mg` : '0 mg',
                                'Membantu pembentukan sel darah merah & mencegah anemia.',
                                <Battery className="w-4 h-4 text-cyan-500" />
                            )}
                            {renderMicroCard(
                                'Natrium',
                                macros?.sodium ? `${Math.round(macros.sodium.value)} mg` : '0 mg',
                                'Pisang sangat rendah garam alami sehingga sangat aman bagi penderita darah tinggi.',
                                <ShieldCheck className="w-4 h-4 text-slate-500" />
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
