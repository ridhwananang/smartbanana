import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const faqItems = [
        {
            q: 'Bagaimana cara kerja teknologi visual AI SmartBanana?',
            a: 'Teknologi kami memproses foto pisang Anda menggunakan pengenalan citra berbasis visi komputer (FCOS/YOLO) yang diekspos melalui Google Colab dan Ngrok. Sistem secara instan mengklasifikasikan tingkat kematangan pisang ke dalam tiga kategori (Mentah, Sedang, Matang).',
        },
        {
            q: 'Dari mana asal data nutrisi yang disediakan?',
            a: 'Seluruh data profil nutrisi makro dan mikro (termasuk Kalium, Magnesium, Serat, Gula) disesuaikan secara ilmiah berdasarkan referensi resmi Departemen Pertanian Amerika Serikat (USDA). Kandungan ini mengalami perubahan secara biologis seiring kematangan buah.',
        },
        {
            q: 'Teknologi apa saja yang digunakan untuk membangun sistem ini?',
            a: 'Aplikasi ini dikembangkan menggunakan arsitektur modern berbasis Laravel (sebagai RESTful API & Controller) yang terintegrasi secara mulus dengan Inertia.js React di sisi frontend, didukung oleh Tailwind CSS untuk styling responsif, serta API Google Colab berbasis FastAPI untuk visi komputernya.',
        },
        {
            q: 'Apakah riwayat pemindaian pisang harian saya tersimpan dengan aman?',
            a: 'Tentu saja. Seluruh data asupan nutrisi harian dan riwayat pemindaian Anda disimpan secara aman di basis data PostgreSQL menggunakan enkripsi Eloquent ORM Laravel serta sistem proteksi autentikasi yang ketat.',
        },
    ];

    return (
        <section className="border-t border-b border-slate-100 bg-slate-50/50 py-20 dark:border-neutral-900 dark:bg-neutral-900/10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="mb-12 text-center">
                    <span className="mx-auto block max-w-max rounded-full border border-yellow-100 bg-yellow-50 px-3 py-1 text-[10px] font-black tracking-widest text-yellow-600 uppercase dark:border-yellow-950/40 dark:bg-yellow-950/20 dark:text-yellow-400">
                        Tanya Jawab
                    </span>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                        Pertanyaan Umum
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        Kami merangkum jawaban atas kebimbangan terselubung Anda
                    </p>
                </div>

                <div className="space-y-3.5 animate-fade-in">
                    {faqItems.map((faq, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-neutral-900 dark:bg-neutral-900/50"
                        >
                            <button
                                type="button"
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-sm font-extrabold text-slate-800 transition-colors hover:text-yellow-500 sm:text-base dark:text-white dark:hover:text-yellow-400"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown
                                    className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-yellow-500' : ''}`}
                                />
                            </button>

                            {activeFaq === i && (
                                <div className="border-t border-slate-50 px-6 pt-3 pb-5 text-xs leading-relaxed font-medium text-slate-500 sm:text-sm dark:border-neutral-900/60 dark:text-neutral-400 text-left">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
