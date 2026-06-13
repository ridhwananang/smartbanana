import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cn(
                'focus:bg-slate-850 inline-flex cursor-pointer items-center rounded-2xl border border-transparent bg-slate-900 px-7 py-3 text-sm font-black tracking-wider text-white uppercase shadow-xl transition duration-150 ease-in-out hover:bg-slate-800 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none active:scale-95 active:bg-slate-950 disabled:opacity-25',
                disabled && 'opacity-25',
                className
            )}
        >
            {children}
        </button>
    );
}
