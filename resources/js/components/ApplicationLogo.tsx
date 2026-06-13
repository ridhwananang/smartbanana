import { ScanEye } from 'lucide-react';

interface ApplicationLogoProps {
    className?: string;
    iconClassName?: string;
}

export default function ApplicationLogo({
    className = '',
    iconClassName = 'w-10 h-10',
}: ApplicationLogoProps) {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            <div className="p-2 transition-transform duration-300">
                <img
                    src="/images/banana.png"
                    alt="App Logo"
                    className={`h-18 w-23 ${iconClassName}`}
                />
            </div>
            {/* <span className="text-2xl font-bold tracking-tighter uppercase italic">
                SMART<span className="text-yellow-500">BANANA</span>
            </span> */}
        </div>
    );
}
