import { Apple } from 'lucide-react';

interface Macro {
    value: number;
    goal: number;
    unit: string;
}

interface NutritionProgressProps {
    consumed: number;
    calorieGoal: number;
    macros:
        | {
              protein: Macro;
              carbs: Macro;
              fat: Macro;
          }
        | undefined;
}

export default function NutritionProgress({
    consumed,
    calorieGoal,
    macros,
}: NutritionProgressProps) {
    const renderMacro = (
        name: string,
        macro: Macro | undefined,
        colorClass: string,
    ) => {
        if (!macro) return null;
        const percent = Math.min((macro.value / macro.goal) * 100, 100);
        return (
            <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    <span>{name}</span>
                    <span>
                        <strong className="font-black text-slate-800 dark:text-white">
                            {macro.value}
                        </strong>{' '}
                        / {macro.goal} {macro.unit}
                    </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-100 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100/80 bg-white p-6 shadow-xl sm:p-8 lg:col-span-3 dark:border-neutral-800 dark:bg-neutral-950">
            {/* Visual glowing frame background */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-100 opacity-40 blur-3xl dark:bg-amber-950/20"></div>

            <div className="pb-6">
                <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                    <span>Keseimbangan Nutrisi Harian</span>
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                    Capaian nutrisi dan energi makanan Anda hari ini.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                <div>
                    {renderMacro(
                        'Kalori',
                        { value: consumed, goal: calorieGoal, unit: 'kkal' },
                        'bg-gradient-to-r from-amber-400 to-amber-600 shadow-md shadow-amber-500/20',
                    )}
                </div>
                <div>
                    {renderMacro(
                        'Protein',
                        macros?.protein,
                        'bg-gradient-to-r from-blue-400 to-blue-600 shadow-md shadow-blue-500/20',
                    )}
                </div>
                <div>
                    {renderMacro(
                        'Karbohidrat',
                        macros?.carbs,
                        'bg-gradient-to-r from-purple-400 to-purple-600 shadow-md shadow-purple-500/20',
                    )}
                </div>
                <div>
                    {renderMacro(
                        'Lemak',
                        macros?.fat,
                        'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/20',
                    )}
                </div>
            </div>
        </div>
    );
}
