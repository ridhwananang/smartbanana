import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    InputHTMLAttributes,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    if (isPassword) {
        return (
            <div className="relative w-full">
                <input
                    {...props}
                    type={inputType}
                    className={
                        'w-full rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pl-4 pr-11 py-3 text-sm dark:text-white shadow-xs focus:border-yellow-500 focus:ring-yellow-500 ' +
                        className
                    }
                    ref={localRef}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-350 cursor-pointer focus:outline-hidden"
                >
                    {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                        <Eye className="h-4.5 w-4.5" />
                    )}
                </button>
            </div>
        );
    }

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm dark:text-white shadow-xs focus:border-yellow-500 focus:ring-yellow-500 ' +
                className
            }
            ref={localRef}
        />
    );
});
