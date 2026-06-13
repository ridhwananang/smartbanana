import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-md border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-yellow-500 shadow-sm focus:ring-yellow-500 dark:focus:ring-offset-neutral-950 ' +
                className
            }
        />
    );
}
