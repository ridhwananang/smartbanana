import React from 'react';
import { Loader2, Upload, Camera, Sparkles } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import InputLabel from '@/components/InputLabel';

interface FoodScannerProps {
    scanForm: {
        data: {
            image: File | null;
            meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
            serving_qty: number;
        };
        setData: (field: string | any, value?: any) => void;
        processing: boolean;
        errors: {
            image?: string;
        };
    };
    imagePreview: string | null;
    setImagePreview: (val: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isCameraActive: boolean;
    startCamera: () => void;
    stopCamera: () => void;
    capturePhoto: () => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function FoodScanner({
    scanForm,
    imagePreview,
    setImagePreview,
    fileInputRef,
    videoRef,
    isCameraActive,
    startCamera,
    stopCamera,
    capturePhoto,
    handleImageChange,
    handleDragOver,
    handleDrop,
    onSubmit,
}: FoodScannerProps) {
    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        Pindai Kematangan Pisang
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                        Upload foto pisang — AI akan mengenali tingkat kematangan &amp; nutrisinya.
                    </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    AI Aktif
                </span>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {/* Upload / Camera Area */}
                {isCameraActive ? (
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-black dark:border-neutral-800">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="h-56 w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                                className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 active:scale-95"
                            >
                                Ambil Foto
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                                className="cursor-pointer rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                            imagePreview
                                ? 'border-amber-300 bg-amber-50/30 dark:border-amber-700/40 dark:bg-amber-950/10'
                                : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 dark:border-neutral-700 dark:hover:border-amber-700/40 dark:hover:bg-amber-950/10'
                        }`}
                    >
                        {imagePreview ? (
                            <div className="relative h-36 w-full">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full rounded-lg object-contain"
                                />
                                {scanForm.processing && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/50">
                                        <div
                                            className="absolute left-0 right-0 h-0.5 bg-amber-400"
                                            style={{ animation: 'scan-animation 2.2s ease-in-out infinite' }}
                                        />
                                        <Loader2 className="h-7 w-7 animate-spin text-white" />
                                        <span className="text-xs font-semibold text-white">Menganalisis...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900">
                                    <Upload className="h-5 w-5 text-slate-400 dark:text-neutral-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-neutral-300">
                                        Tarik &amp; lepas foto pisang di sini
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-400 dark:text-neutral-500">
                                        atau klik untuk memilih file (JPEG, PNG, maks. 5 MB)
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                    Gunakan Kamera
                                </button>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef as any}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                )}

                {/* Form Fields */}
                <div className="space-y-1.5">
                    <InputLabel htmlFor="meal_type" value="Waktu Makan" />
                    <Select
                        value={scanForm.data.meal_type}
                        onValueChange={(val: any) => scanForm.setData('meal_type', val)}
                    >
                        <SelectTrigger className="cursor-pointer rounded-xl border-slate-200 text-xs dark:border-neutral-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="breakfast" className="cursor-pointer">Sarapan</SelectItem>
                            <SelectItem value="lunch" className="cursor-pointer">Makan Siang</SelectItem>
                            <SelectItem value="dinner" className="cursor-pointer">Makan Malam</SelectItem>
                            <SelectItem value="snack" className="cursor-pointer">Cemilan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-neutral-800">
                    {imagePreview && !scanForm.processing && (
                        <button
                            type="button"
                            onClick={() => {
                                setImagePreview(null);
                                scanForm.setData('image', null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900"
                        >
                            Reset Gambar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={scanForm.processing || !scanForm.data.image}
                        className="ml-auto flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {scanForm.processing ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Menganalisis...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-3.5 w-3.5" />
                                Pindai Sekarang
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
