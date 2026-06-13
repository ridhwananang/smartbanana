import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={cn(
                'inline-flex cursor-pointer items-center rounded-2xl border border-white/20 bg-yellow-800/30 px-7 py-3 text-sm font-bold tracking-wider text-white uppercase backdrop-blur-md transition duration-150 ease-in-out hover:bg-white/10 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:opacity-25',
                className
            )}
        >
            {children}
        </button>
    );
}
