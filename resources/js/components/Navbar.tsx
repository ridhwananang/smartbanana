import { useState } from 'react';
import { Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import ApplicationLogo from './ApplicationLogo';
import { useAppearance } from '@/hooks/use-appearance';

interface NavbarProps {
    onScrollToSection: (id: string) => void;
    user?: any; // Interface data untuk user terautentikasi
    onNavigate?: (page: string) => void;
    onLogout?: () => void;
}

export default function Navbar({
    onScrollToSection,
    user = null,
    onNavigate,
    onLogout,
}: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const navLinks = [
        { name: 'Beranda', id: 'hero' },
        { name: 'Cara Kerja', id: 'cara-kerja' },
        { name: 'Bongkar Gizi', id: 'insight' },
        { name: 'Fitur Unggulan', id: 'fitur' },
    ];

    const handleNavLinkClick = (id: string) => {
        if (onNavigate) {
            onNavigate('welcome');
            setTimeout(() => {
                onScrollToSection(id);
            }, 100);
        } else {
            onScrollToSection(id);
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-100 dark:border-neutral-900 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Brand Logo inside ApplicationLogo */}
                <div
                    onClick={() => {
                        if (onNavigate) onNavigate('welcome');
                        else onScrollToSection('hero');
                        setMobileMenuOpen(false);
                    }}
                    className="group cursor-pointer"
                >
                    <ApplicationLogo />
                </div>

                {/* Desktop Links */}
                <div className="hidden items-center gap-8 md:flex h-full">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavLinkClick(link.id)}
                            className="relative py-2 group cursor-pointer text-sm font-bold text-slate-500 dark:text-neutral-355 transition duration-205 hover:text-yellow-500 dark:hover:text-yellow-400"
                        >
                            <span>{link.name}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                {/* Tombol Aksi Pilihan */}
                <div className="hidden items-center gap-4 md:flex">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                        className="rounded-2xl border border-slate-100 dark:border-neutral-800 p-2.5 text-slate-500 hover:text-yellow-500 hover:bg-slate-50 dark:hover:bg-neutral-900 transition duration-200 cursor-pointer focus:outline-none"
                        title="Ubah Tema"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500 animate-pulse" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 text-slate-550 fill-slate-100" />
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="cursor-pointer text-sm font-bold text-slate-650 dark:text-neutral-350 transition duration-150 hover:text-yellow-500"
                            >
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-3 rounded-2xl border border-yellow-100 dark:border-yellow-950/40 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-1.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-black text-white shadow-md shadow-yellow-500/20">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs leading-none font-black text-slate-800 dark:text-white">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <span className="mt-1 text-[9px] leading-none font-bold text-slate-400">
                                        Sesi Aktif
                                    </span>
                                </div>
                                <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-neutral-800"></div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Keluar Akun"
                                    className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-yellow-500 transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="cursor-pointer text-sm font-bold text-slate-600 dark:text-neutral-355 transition duration-150 hover:text-yellow-500"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="cursor-pointer rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 text-xs font-black tracking-wider uppercase shadow-md transition duration-150 hover:bg-slate-800 dark:hover:bg-slate-100"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile actions */}
                <div className="flex items-center gap-2 md:hidden">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                        className="rounded-xl border border-slate-100 dark:border-neutral-800 p-2 text-slate-500 hover:text-yellow-500 transition duration-200 cursor-pointer"
                        title="Ubah Tema"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 text-slate-500 fill-slate-100" />
                        )}
                    </button>
                    
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 p-2 text-slate-650 dark:text-neutral-350 focus:outline-none"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="animate-fade-in absolute left-0 z-50 w-full border-b border-slate-100 dark:border-neutral-900 bg-white/95 dark:bg-neutral-950/95 px-6 py-4 shadow-lg md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavLinkClick(link.id)}
                                className="py-2 text-left text-sm font-bold text-slate-600 dark:text-neutral-300 transition hover:text-yellow-500"
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="my-1 h-px bg-slate-100 dark:bg-neutral-850"></div>

                        {user ? (
                            <div className="space-y-3">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 hover:bg-yellow-600 py-3.5 text-center text-xs font-black tracking-widest text-white uppercase shadow-md transition duration-150"
                                >
                                    Masuk Ke Dashboard
                                </Link>
                                <div className="flex items-center gap-3 rounded-2xl border border-yellow-100 dark:border-yellow-950/40 bg-yellow-50/50 dark:bg-yellow-950/20 p-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500 text-sm font-black text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-slate-850 dark:text-white text-sm leading-none font-black">
                                            {user.name}
                                        </p>
                                        <p className="mt-1 text-[10px] font-semibold text-slate-450">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        handleLogout(e);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-neutral-900 py-3 text-center text-xs font-black tracking-wider text-slate-650 dark:text-neutral-350 uppercase transition hover:bg-slate-200 dark:hover:bg-neutral-800"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar Sesi
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-3 text-center text-sm font-bold text-slate-600 dark:text-neutral-300 transition hover:text-yellow-500"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full rounded-2xl bg-slate-900 dark:bg-white py-3 text-center text-xs font-black tracking-wider text-white dark:text-slate-950 uppercase transition hover:bg-slate-800 dark:hover:bg-slate-100"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
