import { Head, usePage, useHttp } from '@inertiajs/react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Api from '@/actions/App/Http/Controllers/Api';
import { dashboard } from '@/routes';
import { toast } from 'sonner';
import { X, Sparkles } from 'lucide-react';

// import WelcomeHeader from '@/components/dashboard/welcome-header';
import NutritionProgress from '@/components/dashboard/nutrition-progress';
import FoodScanner from '@/components/dashboard/food-scanner';
import RecentScans from '@/components/dashboard/recent-scans';
import BananaAiAdvice from '@/components/dashboard/banana-ai-advice';

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
        sugar?: Macro;
        fiber?: Macro;
        potassium?: Macro;
        magnesium?: Macro;
        vitamin_c?: Macro;
        vitamin_b6?: Macro;
        sodium?: Macro;
        calcium?: Macro;
        iron?: Macro;
    };
}



export default function Dashboard() {
    const { auth } = usePage().props as {
        auth: { user: { name: string; email: string } };
    };
    const { submit } = useHttp();

    // States
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null,
    );
    const [scannedBanana, setScannedBanana] = useState<any | null>(null);

    const floatFormat = (val: any, decimals = 1) => {
        const num = parseFloat(val);
        if (isNaN(num)) return '0';
        return num.toFixed(decimals).replace('.0', '');
    };

    const getRipenessSuggestions = (itemName: string) => {
        const item = itemName.toLowerCase();
        if (item.includes('unripe') || item.includes('mentah')) {
            return {
                title: "Rekomendasi Cerdas AI (Pisang Mentah) 🟢",
                bullet1: "Bagus untuk Diabetes: Sangat kaya pati resisten yang ramah insulin dan menjaga gula darah tetap stabil.",
                bullet2: "Kreasi Kuliner: Sangat lezat diolah menjadi keripik pisang garing, direbus, dikukus, atau dijadikan kolak rendah gula.",
                bullet3: "Tips Penyimpanan: Simpan di suhu ruangan jika ingin mematangkannya. Hindari kulkas agar proses matang alaminya tidak terhenti.",
                bgClass: "from-emerald-500/10 to-emerald-600/5 dark:from-emerald-950/20 dark:to-emerald-950/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
            };
        } else if (item.includes('semi-rape') || item.includes('semi-ripe') || item.includes('sedang')) {
            return {
                title: "Rekomendasi Cerdas AI (Pisang Sedang) 🟡",
                bullet1: "Pencernaan Sehat: Pilihan paling seimbang dan aman untuk perut karena tekstur seratnya sangat mudah dicerna usus.",
                bullet2: "Kreasi Kuliner: Nikmat disantap segar langsung, diiris tipis di atas mangkuk oatmeal, sereal, yogurt, atau campuran salad buah.",
                bullet3: "Tips Penyimpanan: Bungkus ujung tangkai pisang dengan plastic wrap untuk memperlambat proses kematangan yang berlebih.",
                bgClass: "from-yellow-500/10 to-yellow-600/5 dark:from-yellow-950/20 dark:to-yellow-950/5 border-yellow-500/20 text-yellow-800 dark:text-yellow-300"
            };
        } else {
            return {
                title: "Rekomendasi Cerdas AI (Pisang Matang) 🟤",
                bullet1: "Energi Instan: Kandungan gula alami (fruktosa & glukosa) tertinggi, sangat optimal dikonsumsi sebelum/sesudah olahraga.",
                bullet2: "Kreasi Kuliner: Paling sempurna diolah menjadi banana bread, bolu pisang panggang, pancake sehat, atau dicampur ke jus smoothie.",
                bullet3: "Tips Penyimpanan: Jika sudah terlalu matang, kupas kulitnya, potong-potong, lalu bekukan di freezer untuk es krim sehat (nice cream).",
                bgClass: "from-amber-500/10 to-amber-600/5 dark:from-neutral-900/40 dark:to-amber-950/5 border-amber-500/20 text-amber-850 dark:text-amber-300"
            };
        }
    };

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
                streamRef.current.getTracks().forEach((track) => track.stop());
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
            const dashRes = (await submit(Api.DashboardController.index())) as {
                data: DashboardData;
            };
            setDashboardData(dashRes.data);
        } catch (e) {
            console.error('Failed to load dashboard data:', e);
            toast.error('Gagal memuat data dashboard.');
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
                toast.error('Ukuran file gambar maksimal 5 MB.');
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
                toast.error('Ukuran file gambar maksimal 5 MB.');
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
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Gagal mengakses kamera:', err);
            toast.error(
                'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.',
            );
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
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
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const file = new File(
                                [blob],
                                `camera_${Date.now()}.jpg`,
                                { type: 'image/jpeg' },
                            );
                            scanForm.setData('image', file);
                            setImagePreview(URL.createObjectURL(file));
                            stopCamera();
                            toast.success('Foto berhasil diambil!');
                        }
                    },
                    'image/jpeg',
                    0.85,
                );
            }
        }
    };

    // Trigger AI Scan
    const handleScanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanForm.data.image) {
            toast.error('Silakan unggah foto buah pisang terlebih dahulu.');
            return;
        }

        try {
            const res = (await scanForm.submit(Api.ScanController.store())) as {
                status: string;
                data: any;
            };
            if (res.status === 'success') {
                toast.success(
                    `Berhasil mendeteksi ${res.data.nutrition.item}! Data gizi ditambahkan.`,
                );
                setScannedBanana(res.data);
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
            toast.error(
                scanForm.errors.image ||
                    'Gagal memindai kematangan pisang. Coba lagi.',
            );
        }
    };

    // Reset/Hapus Scan Item
    const handleResetScan = async (scanId: number) => {
        try {
            toast.promise(submit(Api.ScanController.destroy({ id: scanId })), {
                loading: 'Menghapus data gizi...',
                success: () => {
                    loadDashboardData();
                    return 'Data gizi berhasil dihapus!';
                },
                error: 'Gagal menghapus data gizi.',
            });
        } catch (e) {
            console.error(e);
        }
    };

    // Total Calories Consumed
    const consumed = dashboardData?.summary?.total_calories ?? 0;

    return (
        <>
            <Head title="Dashboard - SmartBanana" />

            {/* Custom Scan Keyframe animation stylesheet */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes scan-animation {
                    0%, 100% { top: 0%; opacity: 0.8; }
                    50% { top: 100%; opacity: 0.3; }
                }
            `,
                }}
            />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header Welcome */}
                {/* <WelcomeHeader userName={auth.user.name} /> */}

                {/* Row 1: Scan AI Form and Recent Scans list */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        totalScans={dashboardData?.summary?.scan_count ?? 0}
                        onDelete={handleResetScan}
                    />
                </div>

                {/* Row 2: Summary ring and macros */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <NutritionProgress
                        consumed={consumed}
                        calorieGoal={dashboardData?.calorie_goal ?? 2000}
                        macros={dashboardData?.macros}
                        scans={dashboardData?.recent_scans ?? []}
                    />
                </div>

                {/* Row 3: AI Advice and Tips */}
                <BananaAiAdvice scans={dashboardData?.recent_scans ?? []} />
            </div>

            {/* Scanned Banana Full Nutrition Details Modal Overlay */}
            {scannedBanana && (
                <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md duration-200 fade-in">
                    <div className="relative flex max-h-[90vh] w-full max-w-2xl animate-in flex-col gap-6 overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-6 text-left shadow-2xl duration-200 zoom-in-95 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-500 text-white shadow-md shadow-yellow-500/20">
                                    🍌
                                </div>
                                <div>
                                    <h3 className="text-base font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
                                        Hasil Pemindaian AI Cerdas
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                                        Semua Kandungan Nutrisi Pisang (USDA
                                        Terverifikasi)
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setScannedBanana(null)}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-red-500 active:scale-95 dark:bg-neutral-800"
                                title="Tutup"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                            {/* Left Column: Image and Details */}
                            <div className="space-y-4 text-center md:text-left">
                                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner sm:aspect-square dark:border-neutral-800 dark:bg-neutral-950">
                                    <img
                                        src={
                                            scannedBanana.result.scan_image.startsWith('http')
                                                ? scannedBanana.result.scan_image
                                                : `/storage/${scannedBanana.result.scan_image}`
                                        }
                                        alt="Scanned banana"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/images/placeholder-food.png';
                                        }}
                                    />
                                    <div className="absolute top-3 left-3 rounded-full bg-yellow-500/90 px-3 py-1 text-[9px] font-black tracking-widest text-white uppercase shadow-md backdrop-blur-xs">
                                        {Math.round(
                                            scannedBanana.result.confidence *
                                                100,
                                        )}
                                        % Match
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <h4 className="text-lg leading-tight font-black text-slate-800 uppercase italic dark:text-white">
                                        {scannedBanana.nutrition.item}
                                    </h4>
                                    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                                        <span className="text-yellow-750 rounded-md bg-yellow-50 px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase dark:bg-yellow-950/20 dark:text-yellow-400">
                                            {scannedBanana.result.meal_type ===
                                            'breakfast'
                                                ? 'Sarapan'
                                                : scannedBanana.result
                                                        .meal_type === 'lunch'
                                                  ? 'Makan Siang'
                                                  : scannedBanana.result
                                                          .meal_type ===
                                                      'dinner'
                                                    ? 'Makan Malam'
                                                    : 'Cemilan'}
                                        </span>
                                        <span className="text-slate-650 rounded-md bg-slate-100 px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                            {scannedBanana.result.serving_qty}{' '}
                                            Porsi (
                                            {
                                                scannedBanana.nutrition
                                                    .serving_size
                                            }
                                            )
                                        </span>
                                    </div>
                                    <p className="mt-2 text-left text-[10px] leading-relaxed font-semibold text-slate-500 italic dark:text-neutral-400">
                                        {scannedBanana.result.analisis_ai}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Complete Nutrition Grid */}
                            <div className="space-y-4">
                                <h5 className="text-xs font-black tracking-widest text-slate-400 uppercase dark:text-neutral-500">
                                    Rincian Kandungan Nutrisi (
                                    {scannedBanana.result.serving_qty} Porsi)
                                </h5>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* 1. Calories */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">⚡</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Kalori
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {Math.round(
                                                scannedBanana.nutrition
                                                    .calories,
                                            )}{' '}
                                            kkal
                                        </p>
                                    </div>

                                    {/* 2. Carbs */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🍞</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Karbohidrat
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {floatFormat(
                                                scannedBanana.nutrition.carbs,
                                            )}{' '}
                                            g
                                        </p>
                                    </div>

                                    {/* 3. Protein */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🥩</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Protein
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {floatFormat(
                                                scannedBanana.nutrition.protein,
                                            )}{' '}
                                            g
                                        </p>
                                    </div>

                                    {/* 4. Fat */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🥑</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Lemak
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {floatFormat(
                                                scannedBanana.nutrition.fat,
                                            )}{' '}
                                            g
                                        </p>
                                    </div>

                                    {/* 5. Potassium */}
                                    <div className="col-span-2 rounded-2xl border border-yellow-100/50 bg-yellow-50/40 p-3 dark:border-yellow-950/20 dark:bg-yellow-950/10">
                                        <div className="mb-1 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm">
                                                    🍌
                                                </span>
                                                <span className="text-yellow-650 dark:text-yellow-450 text-[8px] font-black tracking-wider uppercase">
                                                    Kalium (Potassium)
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-black text-yellow-600">
                                                Tertinggi
                                            </span>
                                        </div>
                                        <p className="text-sm leading-none font-black text-yellow-600 dark:text-yellow-400">
                                            {Math.round(
                                                scannedBanana.nutrition
                                                    .potassium,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>

                                    {/* 6. Fiber */}
                                    <div className="rounded-2xl border border-emerald-100/50 bg-emerald-50/40 p-3 dark:border-emerald-950/20 dark:bg-emerald-950/10">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🌾</span>
                                            <span className="text-emerald-650 dark:text-emerald-450 text-[8px] font-black tracking-wider uppercase">
                                                Serat
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                            {floatFormat(
                                                scannedBanana.nutrition.fiber,
                                            )}{' '}
                                            g
                                        </p>
                                    </div>

                                    {/* 7. Sugar */}
                                    <div className="rounded-2xl border border-rose-100/50 bg-rose-50/40 p-3 dark:border-rose-950/20 dark:bg-rose-950/10">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🍭</span>
                                            <span className="text-rose-655 dark:text-rose-455 text-[8px] font-black tracking-wider uppercase">
                                                Gula
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-rose-500">
                                            {floatFormat(
                                                scannedBanana.nutrition.sugar,
                                            )}{' '}
                                            g
                                        </p>
                                    </div>

                                    {/* 8. Magnesium */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">💎</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Magnesium
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {Math.round(
                                                scannedBanana.nutrition
                                                    .magnesium,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>

                                    {/* 9. Vitamin B6 */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">💊</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Vit B6
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {floatFormat(
                                                scannedBanana.nutrition
                                                    .vitamin_b6,
                                                2,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>

                                    {/* 10. Vitamin C */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🍊</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Vit C
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {floatFormat(
                                                scannedBanana.nutrition
                                                    .vitamin_c,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>

                                    {/* 11. Calcium */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🦴</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Kalsium
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {Math.round(
                                                scannedBanana.nutrition.calcium,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>

                                    {/* 12. Iron */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🔋</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Zat Besi
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {floatFormat(
                                                scannedBanana.nutrition.iron,
                                                2,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>

                                    {/* 13. Sodium */}
                                    <div className="dark:border-neutral-850 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:bg-neutral-900">
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="text-sm">🧂</span>
                                            <span className="text-[8px] font-black tracking-wider text-slate-400 uppercase">
                                                Natrium
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">
                                            {Math.round(
                                                scannedBanana.nutrition.sodium,
                                            )}{' '}
                                            mg
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Smart Recommendation Card - Full Width at Bottom */}
                        {(() => {
                            const tips = getRipenessSuggestions(scannedBanana.nutrition.item);
                            return (
                                <div className={`p-5 rounded-[2rem] border bg-gradient-to-tr ${tips.bgClass} text-left space-y-3.5 shadow-xs`}>
                                    <h5 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 leading-none">
                                        <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                                        <span>{tips.title}</span>
                                    </h5>
                                    <ul className="text-[10px] font-semibold space-y-2 leading-relaxed pl-4 list-disc list-outside">
                                        <li>{tips.bullet1}</li>
                                        <li>{tips.bullet2}</li>
                                        <li>{tips.bullet3}</li>
                                    </ul>
                                </div>
                            );
                        })()}

                        {/* Footer buttons */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-neutral-800">
                            <button
                                onClick={() => setScannedBanana(null)}
                                className="cursor-pointer rounded-2xl bg-yellow-500 px-6 py-3 text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-600 active:scale-95"
                            >
                                Selesai & Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
