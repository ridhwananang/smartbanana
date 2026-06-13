import React from 'react';

export default function PromoFeatures() {
    return (
        <section
            id="fitur"
            className="border-t border-slate-50 bg-[#FCFCFC] py-24 dark:border-neutral-900 dark:bg-neutral-950"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-16 text-center">
                    <span className="rounded-full border border-yellow-100 bg-yellow-50 px-3 py-1 text-[10px] font-black tracking-wider text-yellow-600 uppercase dark:border-yellow-950/40 dark:bg-yellow-950/20 dark:text-yellow-400">
                        Keunggulan Utama
                    </span>
                    <h2 className="mt-3 mb-4 text-3xl font-black tracking-tighter text-slate-800 uppercase italic md:text-4xl dark:text-white">
                        Fitur Utama SmartBanana
                    </h2>
                    <div className="mx-auto h-1 w-16 rounded-full bg-yellow-500"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="group cursor-pointer rounded-3xl border border-slate-100/80 bg-slate-50/50 p-6 transition hover:border-yellow-405 dark:border-neutral-900 dark:bg-neutral-900/30 dark:hover:border-yellow-500">
                        <div className="dark:border-neutral-855 relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-50 shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="Promo 1"
                            />
                            <div className="dark:text-yellow-455 absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black text-yellow-600 backdrop-blur-md dark:bg-neutral-900/90">
                                VISION AI
                            </div>
                        </div>
                        <h3 className="mb-2 text-lg font-black tracking-tight text-slate-800 uppercase italic transition group-hover:text-yellow-600 dark:text-white dark:group-hover:text-yellow-400">
                            Klasifikasi Citra Cepat
                        </h3>
                        <p className="text-slate-550 text-xs leading-relaxed font-semibold dark:text-neutral-400">
                            Gunakan algoritma visi komputer terbaru untuk mendeteksi 3 tingkat kematangan pisang secara visual dan instan.
                        </p>
                    </div>

                    <div className="group cursor-pointer rounded-3xl border border-slate-100/80 bg-slate-50/50 p-6 transition hover:border-yellow-405 dark:border-neutral-900 dark:bg-neutral-900/30 dark:hover:border-yellow-500">
                        <div className="dark:border-neutral-855 relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-50 shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1566393028639-d108a42c46a7?auto=format&fit=crop&w=400"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="Promo 2"
                            />
                            <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black text-emerald-600 backdrop-blur-md dark:bg-neutral-900/90 dark:text-emerald-450">
                                USDA SPEC
                            </div>
                        </div>
                        <h3 className="mb-2 text-lg font-black tracking-tight text-slate-800 uppercase italic transition group-hover:text-yellow-600 dark:text-white dark:group-hover:text-yellow-400">
                            Gizi Mikro Otentik USDA
                        </h3>
                        <p className="text-slate-550 text-xs leading-relaxed font-semibold dark:text-neutral-400">
                            Membongkar profil nutrisi mikro esensial pisang (Kalium, Magnesium, Serat, Gula) sesuai data resmi ilmiah USDA.
                        </p>
                    </div>

                    <div className="group cursor-pointer rounded-3xl border border-slate-100/80 bg-slate-50/50 p-6 transition hover:border-yellow-405 dark:border-neutral-900 dark:bg-neutral-900/30 dark:hover:border-yellow-500">
                        <div className="dark:border-neutral-855 relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-50 shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=400"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="Promo 3"
                            />
                            <div className="dark:text-indigo-455 absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black text-indigo-600 backdrop-blur-md dark:bg-neutral-900/90">
                                BIO-FEEDBACK
                            </div>
                        </div>
                        <h3 className="mb-2 text-lg font-black tracking-tight text-slate-800 uppercase italic transition group-hover:text-yellow-600 dark:text-white dark:group-hover:text-yellow-400">
                            Dashboard Bio-Feedback
                        </h3>
                        <p className="text-slate-550 text-xs leading-relaxed font-semibold dark:text-neutral-400">
                            Pantau riwayat scan harian Anda serta peroleh anjuran bio-feedback nutrisi yang dipersonalisasi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
