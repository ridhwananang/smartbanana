import React from 'react';
import { Loader2, Upload, Camera, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
        <div className="shadow-xl border border-slate-100 dark:border-neutral-800 rounded-[2.5rem] bg-white dark:bg-neutral-950 overflow-hidden relative p-6 sm:p-8 flex flex-col justify-between">
            {/* Visual glowing frame background */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-100 dark:bg-amber-950/20 opacity-40 blur-3xl"></div>
            
            <div>
                <div className="pb-6">
                    <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase italic flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                        <span>Pindai Makanan dengan AI</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mt-1">
                        Unggah foto makanan Anda. AI akan mengidentifikasi gizi, kalori, dan tipe makronutrisinya secara instan.
                    </p>
                </div>
                
                <form onSubmit={onSubmit}>
                    <div className="space-y-4">
                        {/* Upload Dropzone / Camera Streaming Area */}
                        {isCameraActive ? (
                            <div className="relative w-full rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center min-h-[260px] border-2 border-amber-500">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    className="w-full h-60 object-cover"
                                />
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-30">
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            capturePhoto();
                                        }}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs tracking-wider uppercase rounded-2xl px-5 py-2.5 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                                    >
                                        <Camera className="w-4 h-4 text-white" />
                                        <span>Ambil Foto</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            stopCamera();
                                        }}
                                        className="bg-slate-900 hover:bg-slate-850 text-white font-black text-xs tracking-wider uppercase rounded-2xl px-5 py-2.5 shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
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
                                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden group ${
                                    imagePreview 
                                        ? 'border-amber-400 bg-amber-50/5 dark:bg-neutral-900/50' 
                                        : 'border-slate-200 hover:border-amber-400 dark:border-neutral-800 hover:bg-amber-50/5 dark:hover:bg-neutral-900/10'
                                }`}
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-40 flex items-center justify-center">
                                        <img 
                                            src={imagePreview} 
                                            alt="Food Preview" 
                                            className="h-full rounded-2xl object-contain max-w-[85%] z-10 transition-transform group-hover:scale-102"
                                        />
                                        {/* AI Scanning Bar Overlay */}
                                        {scanForm.processing && (
                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-2xl z-20">
                                                <div 
                                                    className="absolute left-0 right-0 h-1.5 bg-amber-500 shadow-[0_0_12px_#f59e0b] w-full"
                                                    style={{
                                                        animation: 'scan-animation 2.2s ease-in-out infinite',
                                                    }}
                                                />
                                                <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                                                <span className="text-[10px] font-black text-white tracking-widest uppercase animate-pulse">Analisis AI Berjalan...</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3 flex flex-col items-center">
                                        <div className="p-3.5 bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-full inline-block group-hover:scale-105 transition-transform shadow-xs">
                                            <Upload className="w-6 h-6 text-slate-500 dark:text-neutral-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 dark:text-white">Tarik & lepas foto makanan di sini, atau klik untuk memilih</p>
                                            <p className="text-[10px] font-semibold text-slate-400 mt-1">Mendukung JPEG, PNG hingga 5 MB</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-2 pt-1">
                                            <div className="h-[1px] w-8 bg-slate-200 dark:bg-neutral-800" />
                                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Atau</span>
                                            <div className="h-[1px] w-8 bg-slate-200 dark:bg-neutral-800" />
                                        </div>
         
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startCamera();
                                            }}
                                            className="text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-slate-800 active:scale-95 transition cursor-pointer"
                                        >
                                            <Camera className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                            <span>Gunakan Kamera</span>
                                        </button>
                                    </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 text-left">
                                <InputLabel htmlFor="meal_type" value="Waktu Makan" />
                                <Select 
                                    value={scanForm.data.meal_type} 
                                    onValueChange={(val: any) => scanForm.setData('meal_type', val)}
                                >
                                    <SelectTrigger className="capitalize text-xs cursor-pointer rounded-2xl py-3 px-4 border-slate-200 bg-white shadow-xs focus:ring-amber-500 focus:border-amber-500">
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
                            
                            <div className="space-y-1.5 text-left">
                                <InputLabel htmlFor="serving_qty" value="Jumlah Porsi" />
                                <Input 
                                    id="serving_qty"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={scanForm.data.serving_qty}
                                    onChange={(e) => scanForm.setData('serving_qty', parseFloat(e.target.value) || 1)}
                                    className="text-xs font-bold rounded-2xl py-3 px-4 border-slate-200 bg-white shadow-xs focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-neutral-855 mt-6 pt-4 flex justify-between gap-4">
                        {imagePreview && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setImagePreview(null);
                                    scanForm.setData('image', null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="text-[10px] font-black tracking-wider uppercase border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition cursor-pointer"
                                disabled={scanForm.processing}
                            >
                                Reset Gambar
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={scanForm.processing || !scanForm.data.image}
                            className="ml-auto text-[10px] font-black tracking-wider uppercase shadow-lg shadow-amber-500/20 bg-amber-500 text-white rounded-2xl px-6 py-3.5 hover:bg-amber-600 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 cursor-pointer transition"
                        >
                            {scanForm.processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menganalisis...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-white fill-white" />
                                    <span>Pindai Sekarang</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
