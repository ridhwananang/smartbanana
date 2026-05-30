import { Head, usePage, useHttp } from '@inertiajs/react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Api from '@/actions/App/Http/Controllers/Api';
import { dashboard } from '@/routes';
import { toast } from 'sonner';

import WelcomeHeader from '@/components/dashboard/welcome-header';
import NutritionProgress from '@/components/dashboard/nutrition-progress';
import FoodScanner from '@/components/dashboard/food-scanner';
import RecentScans from '@/components/dashboard/recent-scans';
import WeeklyStats from '@/components/dashboard/weekly-stats';

interface Macro {
    value: number;
    goal: number;
    unit: string;
}

interface DashboardData {
    date: string;
    calorie_goal: number;
    calorie_left: number;
    summary: {
        total_calories: number;
        total_protein: number;
        total_carbs: number;
        total_fat: number;
        total_fiber: number;
        scan_count: number;
    };
    recent_scans: any[];
    macros: {
        protein: Macro;
        carbs: Macro;
        fat: Macro;
    };
}

interface WeeklyDayData {
    date: string;
    day: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    scan_count: number;
}

export default function Dashboard() {
    const { auth } = usePage().props as { auth: { user: { name: string; email: string } } };
    const { submit } = useHttp();

    // States
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyDayData[]>([]);
    
    // Scanner Upload State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Camera Integration States & Refs
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup camera stream on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Form Hook for Scan
    const scanForm = useHttp({
        image: null as File | null,
        meal_type: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        serving_qty: 1,
    });

    // Fetch All Data
    const loadDashboardData = useCallback(async () => {
        try {
            // Load dashboard stats
            const dashRes = await submit(Api.DashboardController.index()) as { data: DashboardData };
            setDashboardData(dashRes.data);

            // Load 7-day weekly stats
            const statsRes = await submit(Api.StatsController.weekly()) as { data: WeeklyDayData[] };
            setWeeklyStats(statsRes.data);
        } catch (e) {
            console.error('Failed to load dashboard data:', e);
            toast.error('Gagal memuat data dashboard.');
        } finally {
            setIsLoading(false);
        }
    }, [submit]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);


    // Handle Image upload selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file gambar maksimal 5 MB.");
                return;
            }
            scanForm.setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file gambar maksimal 5 MB.");
                return;
            }
            scanForm.setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // WebRTC Camera Handlers
    const startCamera = async () => {
        try {
            setIsCameraActive(true);
            setImagePreview(null);
            scanForm.setData('image', null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' },
                audio: false 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Gagal mengakses kamera:", err);
            toast.error("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        scanForm.setData('image', file);
                        setImagePreview(URL.createObjectURL(file));
                        stopCamera();
                        toast.success("Foto berhasil diambil!");
                    }
                }, 'image/jpeg', 0.85);
            }
        }
    };

    // Trigger AI Scan
    const handleScanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanForm.data.image) {
            toast.error("Silakan unggah foto buah pisang terlebih dahulu.");
            return;
        }

        try {
            const res = await scanForm.submit(Api.ScanController.store()) as { status: string; data: any };
            if (res.status === 'success') {
                toast.success(`Berhasil mendeteksi ${res.data.nutrition.item}! Data gizi ditambahkan.`);
                // Reset form preview and data
                setImagePreview(null);
                scanForm.setData({
                    image: null,
                    meal_type: 'breakfast',
                    serving_qty: 1,
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
                // Reload dashboard data dynamically
                loadDashboardData();
            }
        } catch (err: any) {
            console.error(err);
            toast.error(scanForm.errors.image || "Gagal memindai kematangan pisang. Coba lagi.");
        }
    };

    // Reset/Hapus Scan Item
    const handleResetScan = async (scanId: number) => {
        try {
            toast.promise(
                submit(Api.ScanController.reset({ id: scanId })),
                {
                    loading: 'Menghapus data gizi...',
                    success: () => {
                        loadDashboardData();
                        return 'Data gizi berhasil dihapus!';
                    },
                    error: 'Gagal menghapus data gizi.',
                }
            );
        } catch (e) {
            console.error(e);
        }
    };

    // Total Calories Consumed
    const consumed = dashboardData?.summary?.total_calories ?? 0;

    // Max calories scaling for custom SVG chart
    const maxCalories = Math.max(...weeklyStats.map(d => d.total_calories), 2000);

    if (isLoading && !dashboardData) {
        return (
            <div className="flex flex-col gap-6 p-6 h-full flex-1 justify-center items-center min-h-[400px]">
                <div className="relative flex items-center justify-center p-4">
                    {/* Spinning logo */}
                    <img 
                        src="/images/loading.png" 
                        onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = '/images/fav-logo.png';
                        }} 
                        alt="Loading..." 
                        className="size-16 animate-spin object-contain" 
                    />
                    {/* Scanning laser line effect */}
                    <div className="absolute inset-x-0 h-0.5 bg-amber-500 shadow-md shadow-amber-500/80 animate-pulse top-1/2"></div>
                </div>
                <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-widest animate-pulse">Menyelaraskan data kematangan pisang...</span>
            </div>
        );
    }

    return (
        <>
            <Head title="Dashboard - Nutrivision" />

            {/* Custom Scan Keyframe animation stylesheet */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scan-animation {
                    0%, 100% { top: 0%; opacity: 0.8; }
                    50% { top: 100%; opacity: 0.3; }
                }
            `}} />

            <div className="flex flex-col gap-6 p-6 overflow-x-auto rounded-xl max-w-7xl mx-auto w-full">
                
                {/* Header Welcome */}
                <WelcomeHeader userName={auth.user.name} />

                {/* Row 1: Summary ring and macros */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <NutritionProgress 
                        consumed={consumed} 
                        calorieGoal={dashboardData?.calorie_goal ?? 2000} 
                        macros={dashboardData?.macros} 
                    />
                </div>

                {/* Row 2: Scan AI Form and Recent Scans list */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FoodScanner 
                        scanForm={scanForm}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                        fileInputRef={fileInputRef}
                        videoRef={videoRef}
                        isCameraActive={isCameraActive}
                        startCamera={startCamera}
                        stopCamera={stopCamera}
                        capturePhoto={capturePhoto}
                        handleImageChange={handleImageChange}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        onSubmit={handleScanSubmit}
                    />

                    <RecentScans 
                        scans={dashboardData?.recent_scans ?? []}
                        consumed={consumed}
                        totalScans={dashboardData?.summary?.scan_count ?? 0}
                        onDelete={handleResetScan}
                    />
                </div>

                {/* Row 3: Weekly SVG Bar Chart */}
                <WeeklyStats 
                    stats={weeklyStats} 
                    maxCalories={maxCalories} 
                />

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

