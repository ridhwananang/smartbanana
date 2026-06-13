import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../components/Navbar';
import ApplicationLogo from '../components/ApplicationLogo';
import AiChatbot from '../components/AiChatbot';

interface GuestLayoutProps {
    children: ReactNode;
    user?: any;
    laravelVersion?: string;
    phpVersion?: string;
    onScrollToSection?: (id: string) => void;
    onNavigate?: (page: string) => void;
    onLogout?: () => void;
    minimal?: boolean;
}

export default function GuestLayout({
    children,
    user = null,
    laravelVersion = '11.x',
    phpVersion = '8.3',
    onScrollToSection,
    onNavigate,
    onLogout,
    minimal = false,
}: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#FCFCFC] dark:bg-neutral-950 font-sans text-slate-950 dark:text-white selection:bg-yellow-500 selection:text-white">
            {/* Header / Navigation system */}
            {minimal ? (
                <header className="flex h-20 items-center justify-between px-6 sm:px-12 border-b border-slate-100 dark:border-neutral-900 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg sticky top-0 z-50">
                    <Link href="/" className="cursor-pointer">
                        <ApplicationLogo />
                    </Link>
                    <Link href="/" className="text-xs font-bold text-slate-500 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition">
                        ← Kembali ke Beranda
                    </Link>
                </header>
            ) : (
                <Navbar
                    onScrollToSection={onScrollToSection!}
                    user={user}
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                />
            )}

            {/* Main Application Page Frame */}
            <main className="flex-1">{children}</main>

            {/* Shared Footer block following Indonesia localization */}
            {minimal ? (
                <footer className="py-6 border-t border-slate-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 text-center text-xs text-slate-400 dark:text-neutral-550">
                    © 2026 SmartBanana Indonesia. Seluruh hak cipta dilindungi.
                </footer>
            ) : (
                <footer className="bg-slate-900 pt-20 pb-10 text-white">
                    <div
                        id="footer-container"
                        className="mx-auto max-w-7xl px-4 sm:px-6"
                    >
                        <div className="mb-16 grid gap-12 md:grid-cols-4">
                            <div className="col-span-1 space-y-6 md:col-span-2 text-left">
                                <div className="flex items-center gap-3">
                                    <ApplicationLogo iconClassName="w-6 h-6" />
                                </div>
                                <p className="max-w-sm text-xs leading-relaxed text-slate-400">
                                    SmartBanana adalah asisten kecerdasan buatan masa depan
                                    yang menggabungkan visi komputer dengan ilmu biokimia
                                    untuk mendeteksi tingkat kematangan, kesegaran,
                                    dan profil nutrisi lengkap buah pisang secara instan.
                                </p>
                                <div className="flex gap-4">
                                    <a
                                        href="#"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-yellow-500"
                                    >
                                        <span className="font-mono text-xs font-bold">
                                            IG
                                        </span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-yellow-500"
                                    >
                                        <span className="font-mono text-xs font-bold">
                                            X
                                        </span>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-yellow-500"
                                    >
                                        <span className="font-mono text-xs font-bold">
                                            FB
                                        </span>
                                    </a>
                                </div>
                            </div>

                            <div className="text-left">
                                <h5 className="mb-6 text-[10px] font-bold tracking-widest text-yellow-500 uppercase">
                                    Navigasi
                                </h5>
                                <ul className="space-y-4 text-xs text-slate-400">
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection!('hero')
                                            }
                                            className="cursor-pointer text-left transition hover:text-white"
                                        >
                                            Dashboard
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection!('insight')
                                            }
                                            className="cursor-pointer text-left transition hover:text-white"
                                        >
                                            Bongkar Gizi
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                onScrollToSection!('fitur')
                                            }
                                            className="cursor-pointer text-left transition hover:text-white"
                                        >
                                            Premium Plan
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-left">
                                <h5 className="mb-6 text-[10px] font-bold tracking-widest text-yellow-500 uppercase">
                                    Legalitas
                                </h5>
                                <ul className="space-y-4 text-xs text-slate-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition hover:text-white"
                                        >
                                            Kebijakan Privasi
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition hover:text-white"
                                        >
                                            Syarat & Ketentuan
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition hover:text-white"
                                        >
                                            Cookie Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition hover:text-white"
                                        >
                                            Bantuan
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-10 sm:flex-row">
                            <p className="text-xs font-semibold text-slate-500">
                                © 2026 SmartBanana Indonesia. Seluruh hak cipta
                                dilindungi.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                                    <span>LARAVEL: {laravelVersion}</span>
                                    <span>•</span>
                                    <span>PHP: {phpVersion}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-600">
                                        POWERED BY
                                    </span>
                                    <span className="text-[10px] font-black tracking-widest text-slate-400 italic">
                                        SMARTBANANA AI ENGINE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
            <AiChatbot />
        </div>
    );
}
