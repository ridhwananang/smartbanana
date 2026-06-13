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
            'fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl transition-opacity duration-300 opacity-0';

        overlay.innerHTML = `
            <style>
                @keyframes scan-laser {
                    0%, 100% { top: 8%; opacity: 0.9; }
                    50% { top: 92%; opacity: 0.9; }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 12px rgba(234, 179, 8, 0.4)); }
                    50% { transform: scale(1.05); filter: drop-shadow(0 8px 24px rgba(234, 179, 8, 0.6)); }
                }
                @keyframes ring-pulse {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.3)); opacity: 0.75; }
                    50% { transform: scale(1.04); filter: drop-shadow(0 0 25px rgba(234, 179, 8, 0.7)); opacity: 0.95; }
                }
            </style>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; text-align: center;">
                <!-- Visual scanning machine container -->
                <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 240px; height: 240px;">
                    <!-- Pulsing/breathing loader ring -->
                    <img
                        src="/images/banana.png"
                        alt="Loading Ring"
                        style="
                            width: 240px;
                            height: 240px;
                            object-fit: contain;
                            animation: ring-pulse 2.0s infinite ease-in-out;
                        "
                    />

                  

                    <!-- Scanning laser line effect -->
                    <div style="
                        position: absolute;
                        left: 10%;
                        right: 10%;
                        height: 3px;
                        background: linear-gradient(90deg, transparent, #eab308, #f59e0b, #eab308, transparent);
                        box-shadow: 0 0 15px #f59e0b, 0 0 8px #eab308;
                        z-index: 20;
                        animation: scan-laser 2.2s infinite ease-in-out;
                    "></div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                    <p class="animate-pulse select-none text-slate-200" style="
                        font-size: 1.15rem; 
                        font-weight: 900; 
                        letter-spacing: 0.15em; 
                        text-transform: uppercase;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.6);
                        margin: 0;
                    ">
                        Memindai <span style="color: #eab308; text-shadow: 0 0 10px rgba(234,179,8,0.4);">Kematangan Pisang</span>...
                    </p>
                    <p class="select-none text-slate-400" style="
                        font-size: 0.75rem; 
                        font-weight: 700; 
                        letter-spacing: 0.08em; 
                        text-transform: uppercase;
                        opacity: 0.7;
                        margin: 0;
                    ">
                        Sistem AI SmartBanana Cerdas
                    </p>
                </div>
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
