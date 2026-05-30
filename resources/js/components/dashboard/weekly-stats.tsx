import React from 'react';
import { Loader2, TrendingUp } from 'lucide-react';

interface WeeklyDayData {
    date: string;
    day: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    scan_count: number;
}

interface WeeklyStatsProps {
    stats: WeeklyDayData[];
    maxCalories: number;
}

export default function WeeklyStats({ stats, maxCalories }: WeeklyStatsProps) {
    return (
        <div className="shadow-xl border border-slate-100 dark:border-neutral-800 rounded-[2.5rem] bg-white dark:bg-neutral-950 p-6 sm:p-8 relative overflow-hidden">
            {/* Visual glowing frame background */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-100 dark:bg-amber-950/20 opacity-30 blur-3xl"></div>
            
            <div className="pb-6">
                <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase italic flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <span>Statistik Kalori 7 Hari Terakhir</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mt-1">Riwayat tren konsumsi energi harian Anda dalam satu minggu terakhir.</p>
            </div>
            
            <div className="pt-2">
                {stats.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground text-sm font-semibold">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" />
                        Memuat grafik statistik...
                    </div>
                ) : (
                    <div className="flex h-52 items-end justify-between gap-4 px-2 pt-6 border-b border-slate-100 dark:border-neutral-800 pb-2">
                        {stats.map((dayData, idx) => {
                            const barHeightPercent = (dayData.total_calories / maxCalories) * 100;
                            return (
                                <div key={idx} className="group relative flex flex-col items-center flex-1">
                                    {/* Beautiful Tooltip Bubble */}
                                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl shadow-xl z-20 pointer-events-none text-center min-w-[90px] duration-200">
                                        <p className="font-black text-amber-400">{dayData.total_calories} kkal</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{dayData.scan_count} kali scan</p>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                    </div>
                                    
                                    {/* Bar container */}
                                    <div className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-850 rounded-t-xl overflow-hidden h-36 flex items-end">
                                        <div 
                                            className="w-full bg-gradient-to-t from-amber-400 to-amber-500 group-hover:from-amber-500 group-hover:to-amber-600 transition-all rounded-t-lg duration-700 ease-out origin-bottom cursor-pointer shadow-xs shadow-amber-500/10"
                                            style={{ height: `${Math.max(barHeightPercent, 4)}%` }} // Ensure even 0 looks like a minor indicator
                                        />
                                    </div>
                                    
                                    {/* Day Label */}
                                    <span className="text-[10px] font-black text-slate-400 mt-3 group-hover:text-slate-800 dark:group-hover:text-white transition-colors uppercase tracking-wider">
                                        {dayData.day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
