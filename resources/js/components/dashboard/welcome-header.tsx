import { Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
    userName: string;
}

export default function WelcomeHeader({ userName }: WelcomeHeaderProps) {
    return (
        <div className="dark:border-neutral-850 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                    <span>Halo, {userName.split(' ')[0]}!</span>
                </h1>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    Pindai makanan Anda, pantau asupan gizi harian Anda, dan
                    pertahankan pola hidup sehat secara cerdas.
                </p>
            </div>
            {/* Active AI badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-100 bg-amber-50/50 px-4 py-2 sm:self-center dark:border-amber-950/40 dark:bg-amber-950/20">
                <span className="h-2 w-2 animate-ping rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">
                    ASISTEN AI AKTIF
                </span>
            </div>
        </div>
    );
}
