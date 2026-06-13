import React from 'react';
import PrimaryButton from '@/components/PrimaryButton';

interface CtaBannerProps {
    handleScrollToSection: (id: string) => void;
}

export default function CtaBanner({ handleScrollToSection }: CtaBannerProps) {
    return (
        <section className="bg-[#FCFCFC] py-20 dark:bg-neutral-950">
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
                <div className="relative space-y-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-yellow-500 via-amber-500 to-emerald-600 p-6 text-white shadow-xl sm:rounded-[3rem] sm:p-12">
                    <span className="rounded-full border border-white/15 bg-white/20 px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase">
                        Satu Sentuhan Cerdas
                    </span>
                    <h3 className="text-2xl leading-snug font-black tracking-tighter uppercase italic sm:text-5xl sm:leading-none">
                        Mulai Pantau Kematangan & Gizi Pisang Sekarang
                    </h3>
                    <p className="mx-auto max-w-lg text-sm leading-relaxed opacity-90">
                        Gabung bersama pengguna SmartBanana lain yang menjaga kualitas asupan dan mendeteksi profil gizi mikro pisang harian bermula dari jepretan kamera cerdas.
                    </p>

                    <div className="relative z-10 pt-4">
                        <PrimaryButton
                            onClick={() => handleScrollToSection('insight')}
                            className="bg-slate-900 text-xs tracking-widest text-white uppercase hover:bg-slate-800 active:bg-slate-950 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                        >
                            Mulai Analisis Pisang
                        </PrimaryButton>
                    </div>

                    {/* Decorative items */}
                    <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-white/5"></div>
                    <div className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-white/5"></div>
                </div>
            </div>
        </section>
    );
}
