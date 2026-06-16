import React from 'react';
import { Sparkles, Activity, Heart, ShieldAlert, BookOpen, Zap } from 'lucide-react';

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
    let unripeCount = 0, semiRipeCount = 0, ripeCount = 0;
    scans.forEach((scan) => {
        const item = (scan.nutrition?.item ?? '').toLowerCase();
        if (item.includes('unripe') || item.includes('mentah')) unripeCount++;
        else if (item.includes('semi-rape') || item.includes('semi-ripe') || item.includes('sedang')) semiRipeCount++;
        else ripeCount++;
    });

    const hasScans = scans.length > 0;

    type AdviceConfig = {
        badge: string;
        badgeClass: string;
        description: string;
        points: { title: string; desc: string; icon: React.ReactNode }[];
    };

    let advice: AdviceConfig = {
        badge: 'Status: Menunggu Scan',
        badgeClass: 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400',
        description: 'Lakukan pemindaian pisang pertama Anda hari ini. AI SmartBanana akan menganalisis profil kematangan dan menghasilkan rekomendasi nutrisi personal.',
        points: [
            { title: 'Pisang Mentah — Prebiotik & Insulin', desc: 'Pati Resisten Tipe 2 tidak dicerna di usus halus, berfermentasi di kolon dan menghasilkan Butirat yang menjaga sensitivitas insulin dan kesehatan dinding usus.', icon: <Activity className="h-4 w-4 text-green-500" /> },
            { title: 'Pisang Sedang — Energi Bertahap', desc: 'Kombinasi pektin dan karbohidrat semi-kompleks melepas energi secara bertahap, ideal untuk menopang konsentrasi tanpa lonjakan gula darah.', icon: <Heart className="h-4 w-4 text-yellow-500" /> },
            { title: 'Pisang Matang — Glukosa Instan', desc: 'Hampir seluruh pati telah dikonversi menjadi fruktosa dan glukosa bebas — bahan bakar otot tercepat, ideal dikonsumsi sebelum/sesudah olahraga.', icon: <Sparkles className="h-4 w-4 text-amber-500" /> },
        ],
    };

    if (hasScans) {
        if (unripeCount > 0 && semiRipeCount === 0 && ripeCount === 0) {
            advice = {
                badge: '100% Mentah (Unripe)',
                badgeClass: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
                description: 'Konsumsi hari ini didominasi pisang mentah dengan Pati Resisten maksimal. Karbohidrat ini melewati usus halus tanpa dicerna dan berfermentasi di kolon, melepas Butirat yang melindungi dinding usus dan mengoptimalkan respons insulin.',
                points: [
                    { title: 'Sensitivitas Insulin Optimal', desc: 'Kurva glikemik tetap datar karena pelepasan glukosa yang sangat lambat. Pilihan terbaik bagi penderita pradiabetes atau diet rendah gula.', icon: <Activity className="h-4 w-4 text-green-500" /> },
                    { title: 'Integritas Dinding Usus', desc: 'Butirat dari fermentasi pati resisten menutrisi sel epitel kolon, meredakan inflamasi kronis, dan memperkuat sawar usus untuk perlindungan jangka panjang.', icon: <ShieldAlert className="h-4 w-4 text-green-500" /> },
                    { title: 'Panduan Konsumsi AI', desc: 'Konsumsi terbaik di pagi hari bersama air yang cukup. Bila rentan kembung, kombinasikan dengan pisang sedang agar lebih nyaman di lambung.', icon: <BookOpen className="h-4 w-4 text-green-500" /> },
                ],
            };
        } else if (ripeCount > 0 && unripeCount === 0 && semiRipeCount === 0) {
            advice = {
                badge: '100% Matang (Ripe)',
                badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
                description: 'Seluruh pisang yang dikonsumsi hari ini berada di fase matang sempurna. Patinya telah terhidrolisis menjadi gula sederhana yang siap diserap instan oleh otot dan otak.',
                points: [
                    { title: 'Stamina & Pengisian Glikogen', desc: 'Memberikan bahan bakar cepat bagi otot. Konsumsi 30–45 menit sebelum olahraga untuk performa puncak dan pemulihan glikogen pasca latihan.', icon: <Zap className="h-4 w-4 text-amber-500" /> },
                    { title: 'Antioksidan & Sitokin Aktif', desc: 'Bercak coklat menandakan kadar sitokin TNF puncak yang bersifat antitumor dan membantu menangkal stres oksidatif seluler.', icon: <Heart className="h-4 w-4 text-amber-500" /> },
                    { title: 'Panduan Konsumsi AI', desc: 'Batasi menjelang tidur jika tidak ada aktivitas fisik intensif. Kombinasikan dengan protein (yogurt/kacang) untuk memperlambat penyerapan gula.', icon: <BookOpen className="h-4 w-4 text-amber-500" /> },
                ],
            };
        } else if (semiRipeCount > 0 && unripeCount === 0 && ripeCount === 0) {
            advice = {
                badge: '100% Sedang (Semi-Ripe)',
                badgeClass: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
                description: 'Anda memilih pisang dalam fase transisi biokimia terbaik. Rantai patinya telah melunak sebagian menjadi gula sederhana, namun serat pektin masih utuh — pasokan energi bertahap yang ramah pencernaan.',
                points: [
                    { title: 'Energi Bertahap & Fokus', desc: 'Rasio kalori yang konstan meredam rasa lapar berlebih tanpa memicu kantuk, menjaga produktivitas tetap tinggi sepanjang hari.', icon: <Activity className="h-4 w-4 text-yellow-600" /> },
                    { title: 'Bersahabat dengan Lambung', desc: 'pH basa pisang sedang membantu menetralisir asam lambung berlebih. Sangat dianjurkan untuk penderita gastritis atau maag kronis.', icon: <Heart className="h-4 w-4 text-yellow-600" /> },
                    { title: 'Panduan Konsumsi AI', desc: 'Cocok sebagai snack pukul 10.00 atau 16.00 bersama kacang almon, yogurt rendah lemak, atau granola untuk profil gizi lebih lengkap.', icon: <BookOpen className="h-4 w-4 text-yellow-600" /> },
                ],
            };
        } else {
            advice = {
                badge: 'Multi-Stage (Campuran)',
                badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
                description: 'Hari ini Anda mengonsumsi pisang dari berbagai fase kematangan — strategi nutrisi paling optimal. Pola campuran ini menggabungkan pati resisten prebiotik dengan glukosa instan sekaligus.',
                points: [
                    { title: 'Kinerja Seluler & Flora Usus', desc: 'Glukosa dari pisang matang memberi energi instan, sementara pati resisten dari pisang mentah/sedang berfermentasi untuk flora usus jangka panjang.', icon: <Activity className="h-4 w-4 text-blue-500" /> },
                    { title: 'Akumulasi Elektrolit Optimal', desc: 'Kalium dan magnesium kumulatif dari berbagai kematangan menjaga konduksi impuls saraf jantung dan mencegah kram otot.', icon: <Heart className="h-4 w-4 text-blue-500" /> },
                    { title: 'Panduan Konsumsi AI', desc: 'Konsumsi pisang matang sebelum/sesudah olahraga, dan pisang mentah/sedang untuk sarapan atau snack rutin harian.', icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
                ],
            };
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        Saran &amp; Tips Bio-Medis AI
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                        Analisis berdasarkan kombinasi tingkat kematangan pisang yang dikonsumsi hari ini.
                    </p>
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-[10px] font-semibold sm:self-center ${advice.badgeClass}`}>
                    {advice.badge}
                </span>
            </div>

            {/* Description */}
            <p className="mb-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                {advice.description}
            </p>

            {/* 3 Recommendation points */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {advice.points.map((pt, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-950">
                                {pt.icon}
                            </div>
                            <h4 className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 leading-tight">
                                {pt.title}
                            </h4>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-500 dark:text-neutral-400">
                            {pt.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
