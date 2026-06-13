import React from 'react';
import { ScanEye } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

interface HeroSectionProps {
    handleScrollToSection: (id: string) => void;
}

export default function HeroSection({
    handleScrollToSection,
}: HeroSectionProps) {
    return (
        <section
            id="hero"
            className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-amber-500 to-emerald-600 pt-12 pb-24 text-white shadow-inner"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
                <div className="z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-md">
                        <span className="h-2 w-2 animate-ping rounded-full bg-yellow-300"></span>
                        <span className="text-xs font-bold tracking-widest uppercase">
                            SmartBanana Engine v1.0
                        </span>
                    </div>
                    <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight uppercase italic sm:text-3xl lg:text-5xl">
                        Kenali Kematangan <br />
                        Pisang Seketika.
                    </h1>
                    <p className="max-w-sm text-sm leading-relaxed opacity-90 sm:max-w-md sm:text-lg">
                        Sistem klasifikasi kematangan pisang berbasis visi
                        komputer. Pindai tingkat kematangan (Mentah, Sedang,
                        Matang) serta bongkar kandungan nutrisi esensial USDA
                        secara real-time.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <PrimaryButton
                            onClick={() => handleScrollToSection('cara-kerja')}
                            className="bg-white text-black hover:bg-slate-50 hover:text-yellow-600"
                        >
                            Pelajari Cara Kerja
                        </PrimaryButton>

                        <SecondaryButton
                            onClick={() => handleScrollToSection('insight')}
                        >
                            Lihat Penjelasan Gizi
                        </SecondaryButton>
                    </div>
                </div>

                {/* Representasi Kamera Pemindai */}
                <div className="relative z-10 mx-auto mt-8 block w-full max-w-xs select-none sm:max-w-md lg:mt-0">
                    <div className="mx-auto max-w-md rotate-3 transform overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-1 sm:rounded-[3rem] dark:bg-neutral-900/95">
                        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem]">
                            <img
                                src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500"
                                className="h-full w-full object-cover shadow-inner"
                                alt="Visual Pisang"
                            />
                            {/* Sensor Kamera Pemindai */}
                            <div className="bg-yellow-450 absolute top-0 right-0 left-0 h-1 animate-bounce shadow-xl"></div>
                        </div>

                        <div className="absolute right-6 bottom-6 left-6 flex items-center gap-3 rounded-xl border border-white/20 bg-yellow-500/90 p-3 shadow-lg backdrop-blur-md sm:right-10 sm:bottom-10 sm:left-10 sm:gap-4 sm:rounded-2xl sm:p-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-yellow-600 shadow-md sm:h-12 sm:w-12">
                                <ScanEye className="h-5 w-5 animate-pulse sm:h-6 sm:w-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] font-black tracking-widest text-[#FFF] uppercase opacity-80 sm:text-[9px]">
                                    AI DETECTOR
                                </p>
                                <p className="text-sm font-black tracking-tighter text-white uppercase italic sm:text-xl">
                                    Banana Fully Ripe (98%)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom layout curve shape */}
            <div className="absolute right-0 bottom-0 left-0 h-10 rounded-t-3xl bg-[#FCFCFC] dark:bg-neutral-950"></div>
        </section>
    );
}
