import React from 'react';
import { Utensils, Apple, Trash2 } from 'lucide-react';

interface ScanItem {
    id: number;
    scan_image: string | null;
    meal_type: string;
    serving_qty: number;
    confidence: number;
    total_calories: number;
    nutrition?: {
        item: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

interface RecentScansProps {
    scans: ScanItem[];
    consumed: number;
    totalScans: number;
    onDelete: (id: number) => void;
}

export default function RecentScans({ scans, consumed, totalScans, onDelete }: RecentScansProps) {
    const mealTypeColors = {
        breakfast: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
        lunch: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
        dinner: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300',
        snack: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
    };
    
    const mealLabels = {
        breakfast: 'Sarapan',
        lunch: 'Makan Siang',
        dinner: 'Makan Malam',
        snack: 'Cemilan'
    };

    return (
        <div className="shadow-xl border border-slate-100 dark:border-neutral-800 rounded-[2.5rem] bg-white dark:bg-neutral-950 flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden">
            {/* Visual glowing frame background */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-100 dark:bg-amber-950/20 opacity-30 blur-3xl"></div>
            
            <div>
                <div className="pb-6">
                    <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase italic flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-amber-500" />
                        <span>Makanan Hari Ini</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mt-1">Makanan yang telah dipindai dan dikonsumsi pada hari ini.</p>
                </div>
                
                <div className="overflow-y-auto max-h-[300px] space-y-4 px-2">
                    {scans.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-2">
                            <div className="p-3.5 bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-full">
                                <Apple className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">Belum ada makanan hari ini</p>
                            <p className="text-[10px] font-semibold text-slate-400 max-w-[280px]">Gunakan panel sebelah kiri untuk memindai asupan pertama Anda!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {scans.map((scan) => {
                                return (
                                    <div key={scan.id} className="flex items-center justify-between py-3.5 gap-4 group">
                                        <div className="flex items-center gap-3">
                                            {/* Scan Image Thumbnail */}
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-neutral-900 rounded-xl overflow-hidden border border-slate-100 dark:border-neutral-850 flex-shrink-0 flex items-center justify-center">
                                                {scan.scan_image ? (
                                                    <img 
                                                        src={`/storage/${scan.scan_image}`} 
                                                        alt={scan.nutrition?.item || 'Food'} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/images/placeholder-food.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <Apple className="w-6 h-6 text-slate-300" />
                                                )}
                                            </div>
                                            
                                            {/* Food Name & Details */}
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                                                    {scan.nutrition?.item || 'Makanan Tidak Dikenal'}
                                                </h4>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-[9px] py-0.5 px-2 font-black uppercase tracking-wider rounded-md ${mealTypeColors[scan.meal_type as keyof typeof mealTypeColors] || 'bg-slate-100 text-slate-700'}`}>
                                                        {mealLabels[scan.meal_type as keyof typeof mealLabels] || scan.meal_type}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold">
                                                        {scan.serving_qty} porsi
                                                    </span>
                                                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                                                        {Math.round(scan.confidence * 100)}% AI
                                                    </span>
                                                </div>
                                                {scan.nutrition && (
                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold mt-1.5 flex-wrap">
                                                        <span className="bg-red-50 dark:bg-red-950/30 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-md">
                                                            {Math.round(scan.nutrition.calories * scan.serving_qty)} kkal
                                                        </span>
                                                        <span className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-md">
                                                            P: {Math.round(scan.nutrition.protein * scan.serving_qty)}g
                                                        </span>
                                                        <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md">
                                                            K: {Math.round(scan.nutrition.carbs * scan.serving_qty)}g
                                                        </span>
                                                        <span className="bg-emerald-50 dark:bg-emerald-600 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                                                            L: {Math.round(scan.nutrition.fat * scan.serving_qty)}g
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <span className="text-sm font-black text-amber-500 block">+{Math.round(scan.total_calories)}</span>
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase">kkal</span>
                                            </div>
                                            
                                            <button 
                                                type="button" 
                                                onClick={() => onDelete(scan.id)}
                                                className="w-8 h-8 rounded-xl text-slate-450 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center justify-center cursor-pointer"
                                                title="Hapus Makanan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-100 dark:border-neutral-800 mt-6 pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span>Scan Hari Ini: <strong className="text-slate-800 dark:text-white">{totalScans} Kali</strong></span>
                <span>Total Kalori: <strong className="text-amber-500">{consumed} kkal</strong></span>
            </div>
        </div>
    );
}
