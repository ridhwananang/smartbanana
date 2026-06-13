import { Link, usePage } from '@inertiajs/react';
import { Menu, ChevronDown, LayoutGrid, Home } from 'lucide-react';
import ApplicationLogo from '@/components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props as any;
    const { isCurrentUrl } = useCurrentUrl();

    const navLinks: { name: string; href: string; icon: any }[] = [];

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-slate-100 dark:border-neutral-900 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
                    {/* Mobile Menu Trigger */}
                    {navLinks.length > 0 && (
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-2 h-10 w-10 border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-850"
                                    >
                                        <Menu className="h-5 w-5 text-slate-650 dark:text-neutral-300" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="flex h-full w-64 flex-col items-stretch justify-between bg-white dark:bg-neutral-950 border-r border-slate-100 dark:border-neutral-900 p-6"
                                >
                                    <SheetTitle className="sr-only">
                                        Menu Navigasi
                                    </SheetTitle>
                                    <SheetHeader className="flex justify-start text-left border-b border-slate-50 dark:border-neutral-900 pb-4">
                                        <ApplicationLogo />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-6 pt-6">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {navLinks.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={`flex items-center space-x-3 py-2 text-sm font-bold transition duration-200 ${
                                                            isCurrentUrl(item.href)
                                                                ? 'text-yellow-500'
                                                                : 'text-slate-550 dark:text-neutral-300 hover:text-yellow-500 dark:hover:text-yellow-400'
                                                        }`}
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-4 w-4" />
                                                        )}
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="group flex items-center"
                    >
                        <ApplicationLogo />
                    </Link>

                    {/* Desktop Navigation Links */}
                    {navLinks.length > 0 && (
                        <div className="hidden lg:flex items-center gap-8 ml-8 h-full">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative py-2 group cursor-pointer text-sm font-bold transition duration-200 ${
                                        isCurrentUrl(item.href)
                                            ? 'text-yellow-500'
                                            : 'text-slate-500 dark:text-neutral-350 hover:text-yellow-500 dark:hover:text-yellow-400'
                                    }`}
                                >
                                    <span>{item.name}</span>
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${
                                        isCurrentUrl(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Side User Menu Content */}
                    <div className="ml-auto flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 rounded-2xl border border-yellow-100 dark:border-yellow-950/40 bg-yellow-50/50 dark:bg-yellow-950/20 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 px-3 py-1.5 cursor-pointer transition select-none active:scale-95 duration-150">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-black text-white shadow-md shadow-yellow-500/20">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:flex flex-col text-left">
                                        <span className="text-xs leading-none font-black text-slate-800 dark:text-white">
                                            {auth.user.name.split(' ')[0]}
                                        </span>
                                        <span className="mt-1 text-[9px] leading-none font-bold text-slate-400 dark:text-neutral-500">
                                            Sesi Aktif
                                        </span>
                                    </div>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 hidden sm:block" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </>
    );
}
