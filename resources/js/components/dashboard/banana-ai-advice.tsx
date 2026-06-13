import React from 'react';
import { Sparkles, Activity, Heart, ShieldAlert, BookOpen } from 'lucide-react';

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

interface BananaAiAdviceProps {
    scans: ScanItem[];
}

export default function BananaAiAdvice({ scans }: BananaAiAdviceProps) {
    // 1. Analyze banana counts by ripeness stages
    let unripeCount = 0;
    let semiRipeCount = 0;
    let ripeCount = 0;

    scans.forEach((scan) => {
        const item = (scan.nutrition?.item ?? '').toLowerCase();
        if (item.includes('unripe') || item.includes('mentah')) {
            unripeCount++;
        } else if (item.includes('semi-rape') || item.includes('semi-ripe') || item.includes('sedang')) {
            semiRipeCount++;
        } else {
            // Defaults to ripe for normal bananas
            ripeCount++;
        }
    });

    const hasScans = scans.length > 0;

    // 2. Generate content dynamically
    let advice = {
        title: "Analisis & Rekomendasi Bio-Klinis AI",
        badge: "Status: Menunggu Scan",
        badgeClass: "bg-slate-100 text-slate-700 dark:bg-neutral-900 dark:text-neutral-400 border-slate-200/20",
        bgGradient: "from-slate-500/5 to-slate-650/5 dark:from-neutral-900/40 dark:to-neutral-950/10 border-slate-250/20",
        description: "Silakan lakukan pemindaian kematangan buah pisang Anda di atas terlebih dahulu. AI SmartBanana akan menganalisis profil kematangan buah pisang secara presisi dan menghasilkan rekomendasi biologis, saran medis, serta takaran konsumsi ideal di sini secara dinamis.",
        points: [
            {
                title: "Pisang Mentah (Green/Unripe)",
                desc: "Kaya akan Pati Resisten Tipe 2 (RS2) yang berfungsi langsung sebagai prebiotik untuk menyehatkan bakteri baik di usus besar.",
                icon: <Activity className="w-4 h-4 text-emerald-500" />
            },
            {
                title: "Pisang Sedang (Yellow-Green/Semi-Ripe)",
                desc: "Memiliki perbandingan serat pektin dan gula sederhana yang sangat seimbang. Sangat aman dan ramah bagi penderita lambung sensitif.",
                icon: <Heart className="w-4 h-4 text-yellow-500" />
            },
            {
                title: "Pisang Matang (Brown-Spotted/Fully-Ripe)",
                desc: "Menghasilkan konsentrasi glukosa siap serap yang tinggi untuk energi instan otot serta sitokin TNF pendukung daya tahan seluler.",
                icon: <Sparkles className="w-4 h-4 text-amber-500" />
            }
        ]
    };

    if (hasScans) {
        if (unripeCount > 0 && semiRipeCount === 0 && ripeCount === 0) {
            // Only Unripe Bananas consumed
            advice = {
                title: "Optimalisasi Prebiotik & Insulin",
                badge: "Bio-Spectrum: 100% Pisang Mentah (Unripe) 🟢",
                badgeClass: "bg-emerald-50/80 border border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-300",
                bgGradient: "from-emerald-500/10 to-emerald-600/5 dark:from-emerald-950/25 dark:to-neutral-950/5 border-emerald-500/20",
                description: "Profil konsumsi Anda hari ini didominasi oleh pisang mentah dengan kandungan Pati Resisten (Resistant Starch) maksimal. Karbohidrat ini tidak terurai menjadi gula di usus halus, melainkan berfermentasi di kolon Anda untuk melepaskan Butirat (Short Chain Fatty Acid).",
                points: [
                    {
                        title: "Sensitivitas Insulin Optimal",
                        desc: "Laju pelepasan glukosa yang sangat lambat menjaga kurva glikemik Anda tetap datar, menjadikannya camilan terbaik bagi penderita pradiabetes.",
                        icon: <Activity className="w-4 h-4 text-emerald-500" />
                    },
                    {
                        title: "Integritas Dinding Pencernaan",
                        desc: "Butirat hasil fermentasi pati resisten menutrisi sel epitel kolon, meredakan inflamasi, dan memperkuat sawar usus Anda.",
                        icon: <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    },
                    {
                        title: "Panduan Konsumsi Cerdas AI",
                        desc: "Sangat dianjurkan dikonsumsi pada pagi hari bersama air putih yang cukup. Hindari memakannya dalam keadaan perut kosong jika Anda rentan kembung.",
                        icon: <BookOpen className="w-4 h-4 text-emerald-500" />
                    }
                ]
            };
        } else if (ripeCount > 0 && unripeCount === 0 && semiRipeCount === 0) {
            // Only Ripe Bananas consumed
            advice = {
                title: "Glukosa Siap Pakai & Aktivasi Imun",
                badge: "Bio-Spectrum: 100% Pisang Matang (Ripe) 🟤",
                badgeClass: "bg-amber-50/80 border border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-300",
                bgGradient: "from-amber-500/10 to-amber-600/5 dark:from-neutral-900/40 dark:to-amber-950/5 border-amber-500/20",
                description: "Seluruh pisang yang Anda konsumsi hari ini berada dalam fase matang sempurna. Kandungan zat patinya telah sepenuhnya terhidrolisis menjadi gula sederhana (fruktosa, glukosa, sukrosa) yang siap diserap instan oleh otot dan otak.",
                points: [
                    {
                        title: "Stamina & Pengisian Glikogen",
                        desc: "Memberikan bahan bakar instan berkecepatan tinggi bagi kontraksi otot, menjadikannya pilihan pre-workout/post-workout yang ideal.",
                        icon: <Activity className="w-4 h-4 text-amber-500" />
                    },
                    {
                        title: "Antioksidan & Sitokin Aktif",
                        desc: "Bercak cokelat pada pisang matang menandakan kadar sitokin TNF (Tumor Necrosis Factor) puncak yang membantu menangkal stres oksidatif seluler.",
                        icon: <Heart className="w-4 h-4 text-amber-500" />
                    },
                    {
                        title: "Panduan Konsumsi Cerdas AI",
                        desc: "Sangat baik dikonsumsi sebelum/sesudah aktivitas fisik berat. Batasi konsumsi menjelang tidur malam jika tidak ada pengeluaran energi intensif.",
                        icon: <BookOpen className="w-4 h-4 text-amber-500" />
                    }
                ]
            };
        } else if (semiRipeCount > 0 && unripeCount === 0 && ripeCount === 0) {
            // Only Semi-Ripe Bananas consumed
            advice = {
                title: "Keseimbangan Kimiawi & Serat Lembut",
                badge: "Bio-Spectrum: 100% Pisang Sedang (Semi-Ripe) 🟡",
                badgeClass: "bg-yellow-50/80 border border-yellow-100 text-yellow-750 dark:bg-yellow-950/20 dark:border-yellow-900/30 dark:text-yellow-300",
                bgGradient: "from-yellow-500/10 to-yellow-600/5 dark:from-yellow-950/25 dark:to-neutral-950/5 border-yellow-500/20",
                description: "Anda memilih pisang dalam fase transisi terbaik. Rantai patinya telah melunak sebagian menjadi gula sederhana, namun serat struktural pektinnya masih utuh, menawarkan pasokan energi bertahap tanpa membebani usus.",
                points: [
                    {
                        title: "Camilan Antara Waktu Makan",
                        desc: "Rasio pelepasan kalori yang konstan meredam rasa lapar berlebih di tengah aktivitas kerja atau kuliah tanpa memicu kantuk.",
                        icon: <Activity className="w-4 h-4 text-yellow-500" />
                    },
                    {
                        title: "Bebas Iritasi Asam Lambung",
                        desc: "Tekstur semi-ripe yang lunak memiliki pH basa yang baik, membantu menenangkan dinding lambung yang sering terkena gejala maag.",
                        icon: <Heart className="w-4 h-4 text-yellow-500" />
                    },
                    {
                        title: "Panduan Konsumsi Cerdas AI",
                        desc: "Cocok dikonsumsi sebagai selingan di pagi hari (pukul 10.00) atau sore hari (pukul 16.00) bersama potongan kacang almon atau yogurt.",
                        icon: <BookOpen className="w-4 h-4 text-yellow-500" />
                    }
                ]
            };
        } else {
            // Mixed stage consumption
            advice = {
                title: "Sinergi Spektrum Bio-Nutrisi Ganda",
                badge: "Bio-Spectrum: Konsumsi Campuran (Mixed Stage) 🌈",
                badgeClass: "bg-blue-50/80 border border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-300",
                bgGradient: "from-blue-500/10 to-blue-600/5 dark:from-neutral-900/40 dark:to-neutral-950/5 border-blue-500/20",
                description: "Hari ini Anda mengonsumsi pisang dari berbagai fase kematangan berbeda. Pola ini sangat kaya variasi nutrisi karena menggabungkan pelepasan energi cepat (pisang matang) dan serat prebiotik lambat (pisang mentah/sedang).",
                points: [
                    {
                        title: "Dukungan Kinerja Seluler & Usus",
                        desc: "Tubuh Anda memanfaatkan glukosa instan untuk kebutuhan energi segera, sementara usus Anda memfermentasi pati resisten untuk flora jangka panjang.",
                        icon: <Activity className="w-4 h-4 text-blue-500" />
                    },
                    {
                        title: "Akumulasi Elektrolit Saraf & Otot",
                        desc: "Asupan kalium dan magnesium kumulatif yang melimpah hari ini menjaga konduksi impuls saraf jantung Anda tetap stabil dan mencegah kram.",
                        icon: <Heart className="w-4 h-4 text-blue-500" />
                    },
                    {
                        title: "Panduan Konsumsi Cerdas AI",
                        desc: "Makanlah pisang matang sebagai sumber energi saat beraktivitas berat, dan sisihkan pisang mentah/sedang untuk sarapan pagi Anda.",
                        icon: <BookOpen className="w-4 h-4 text-blue-500" />
                    }
                ]
            };
        }
    }

    return (
        <div className="shadow-2xl border border-slate-100/80 dark:border-neutral-900/50 rounded-[2.5rem] bg-white dark:bg-neutral-950 p-6 sm:p-8 relative overflow-hidden">
            {/* Visual glowing frame background */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-100/20 dark:bg-yellow-950/10 opacity-30 blur-3xl"></div>
            
            <div className="pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase italic flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span>Saran & Tips Bio-Medis AI SmartBanana</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mt-1">
                        Analisis cerdas berdasarkan kombinasi tingkat kematangan pisang yang Anda scan dan konsumsi hari ini.
                    </p>
                </div>
                
                <span className={`self-start sm:self-center text-[8px] py-1 px-3.5 font-black uppercase tracking-wider rounded-full border shadow-xs leading-none ${advice.badgeClass}`}>
                    {advice.badge}
                </span>
            </div>
            
            <div className={`p-5 rounded-[2rem] border bg-gradient-to-tr ${advice.bgGradient} transition-all duration-500 text-left space-y-4`}>
                <p className="text-xs leading-relaxed font-semibold text-slate-650 dark:text-neutral-350 italic">
                    {advice.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {advice.points.map((pt, idx) => (
                        <div key={idx} className="bg-white/80 dark:bg-neutral-900/80 border border-slate-100/50 dark:border-neutral-850 p-4 rounded-2xl space-y-2 hover:shadow-md transition-shadow duration-305">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-850">
                                    {pt.icon}
                                </div>
                                <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight leading-tight">
                                    {pt.title}
                                </h4>
                            </div>
                            <p className="text-[10px] leading-relaxed font-semibold text-slate-550 dark:text-neutral-400">
                                {pt.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
