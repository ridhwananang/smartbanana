import React from 'react';

export default function NutritionInsight() {
    return (
        <section
            id="insight"
            className="overflow-hidden border-t border-slate-50 bg-[#FCFCFC] py-24 dark:border-neutral-900 dark:bg-neutral-950"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <div>
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 mb-4 inline-block rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest text-yellow-600 uppercase dark:text-yellow-400">
                            Deep Insight AI
                        </div>
                        <h2 className="mb-6 text-3xl leading-tight font-black tracking-tight text-slate-800 uppercase italic sm:text-4xl dark:text-white">
                            Data Lebih Dari <br />
                            Sekadar Angka.
                        </h2>
                        <p className="mb-8 text-sm leading-relaxed font-semibold text-slate-500 sm:text-base dark:text-neutral-400">
                            Setiap hasil scan memberikan rincian mikronutrisi
                            dan makronutrisi pisang secara komprehensif. Kami membantu Anda
                            menganalisis kandungan senyawa penting pisang demi kesehatan tubuh optimal.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 text-left">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-yellow-500 shadow-inner transition hover:bg-slate-100 dark:border-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                    🍌
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                                        Analisis Kematangan Cerdas
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                        Membedakan spektrum pati resisten pisang mentah hingga kadar gula alami pisang matang.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-left">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-emerald-500 shadow-inner transition hover:bg-slate-100 dark:border-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                    ⚡
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                                        Suplai Mineral Esensial
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                        Mendeteksi takaran Kalium dan Magnesium untuk kelenturan otot dan regulasi tekanan darah.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-left">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-indigo-505 shadow-inner transition hover:bg-slate-100 dark:border-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                    🛡️
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                                        Saran Konsumsi Personal
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                        Rekomendasi waktu konsumsi terbaik sesuai fase kematangan pisang demi mendukung metabolisme tubuh.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Representasi visual detail nutrisi pisang */}
                    <div className="relative">
                        <div className="relative z-10 mx-auto max-w-sm rounded-[3rem] border border-slate-100 bg-white p-8 shadow-xl sm:max-w-md dark:border-neutral-900 dark:bg-neutral-900">
                            <div className="mb-6 flex items-center gap-4 text-left">
                                <img
                                    src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=120"
                                    className="border-slate-105 h-16 w-16 rounded-2xl border object-cover shadow-md dark:border-neutral-800"
                                    alt="Scan Detail Preview"
                                />
                                <div>
                                    <h5 className="text-base font-black tracking-tighter text-slate-800 uppercase italic sm:text-lg dark:text-white">
                                        Banana Fully Ripe
                                    </h5>
                                    <span className="text-[10px] font-bold tracking-widest text-yellow-500 uppercase dark:text-yellow-400">
                                        High Potassium Detected
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-end justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase dark:text-neutral-500">
                                            KALIUM
                                        </span>
                                        <span className="text-xs font-black text-slate-700 dark:text-neutral-300">
                                            358 mg
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full border border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950">
                                        <div className="h-full w-[78%] rounded-full bg-yellow-500"></div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-end justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase dark:text-neutral-500">
                                            KARBOHIDRAT
                                        </span>
                                        <span className="text-xs font-black text-slate-700 dark:text-neutral-300">
                                            22.8 g
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full border border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950">
                                        <div className="h-full w-[65%] rounded-full bg-indigo-500"></div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-end justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase dark:text-neutral-500">
                                            SERAT ALAMI
                                        </span>
                                        <span className="text-xs font-black text-slate-700 dark:text-neutral-300">
                                            2.6 g
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full border border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950">
                                        <div className="h-full w-[35%] rounded-full bg-emerald-500"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-neutral-800">
                                <div className="dark:bg-neutral-955 text-slate-550 rounded-2xl bg-slate-50 p-4 text-[10px] leading-relaxed font-semibold italic dark:text-neutral-400 text-left">
                                    "AI mendeteksi tingkat kematangan penuh yang optimal. Kandungan Kalium tinggi yang baik untuk mengontrol tekanan darah dan Vitamin B6 untuk metabolisme energi harian Anda."
                                </div>
                            </div>
                        </div>
                        {/* Visual blur shapes */}
                        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-yellow-250 opacity-30 blur-3xl dark:opacity-10"></div>
                        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-200 opacity-30 blur-3xl dark:opacity-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
