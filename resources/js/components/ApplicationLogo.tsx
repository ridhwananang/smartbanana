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
                    src="/images/fav-logo.png"
                    alt="App Logo"
                    className={`size-15 ${iconClassName}`}
                />
            </div>
            <span className="text-2xl font-bold tracking-tighter uppercase italic">
                NUTRI<span className="text-amber-500">VISION</span>
            </span>
        </div>
    );
}
