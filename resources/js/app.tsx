import { createInertiaApp, router } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Custom loading spinner overlay with debouncing to prevent flickering on fast loads
let loadingTimeout: any = null;

function showLoading() {
    if (document.getElementById('custom-loader-overlay')) return;

    loadingTimeout = setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.id = 'custom-loader-overlay';
        overlay.className =
            'fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 opacity-0';

        overlay.innerHTML = `
            <div class="flex flex-col items-center gap-4">
                <div class="relative flex items-center justify-center p-4">
                    <!-- Spinning logo -->
                    <img 
                        src="/images/loading.png" 
                        onerror="this.onerror=null; this.src='/images/fav-logo.png';" 
                        alt="Loading..." 
                        class="size-66 animate-spin object-contain" 
                    />
                    <!-- Scanning laser line effect -->
                    <div class="absolute inset-x-0 h-0.5 bg-amber-500 shadow-md shadow-amber-500/80 animate-pulse top-1/2"></div>
                </div>
                <p class="text-xs font-bold tracking-widest text-slate-300 uppercase animate-pulse select-none">
                    Memindai <span class="text-amber-500">Nutrisi</span>...
                </p>
            </div>
        `;

        document.body.appendChild(overlay);

        // Trigger reflow to start fade-in transition
        overlay.offsetHeight;
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
    }, 180); // 180ms delay prevents blinking on quick loads
}

function hideLoading() {
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }

    const overlay = document.getElementById('custom-loader-overlay');
    if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        // Wait for CSS fade-out transition to complete before removing from DOM
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Bind Inertia page transition events
router.on('start', showLoading);
router.on('finish', hideLoading);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'auth/login':
            case name === 'auth/register':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: false, // Disable default thin loading bar
});

// This will set light / dark mode on load...
initializeTheme();
