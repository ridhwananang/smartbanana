import os
import json
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ── Konfigurasi & Variabel Global ───────────────────────────────
MODEL_DIR = "model_pisang"
MODEL_FILE = "cnn_kematangan_pisang.keras"
CONFIG_FILE = "config.json"

MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILE)
CONFIG_PATH = os.path.join(MODEL_DIR, CONFIG_FILE)

# Parameter Default (Akan diperbarui jika config.json terbaca)
IMG_SIZE = (128, 128)
CLASS_NAMES = ["banana unripe", "banana semi-ripe", "banana fully-ripe"]

# Pemetaan dari label AI ke key database gizi Laravel
LABEL_MAPPING = {
    "banana unripe": "banana-unripe",
    "banana semi-ripe": "banana-semi-ripe",
    "banana fully-ripe": "banana-fully-ripe"
}

# Muat Konfigurasi jika ada
if os.path.exists(CONFIG_PATH):
    try:
        with open(CONFIG_PATH) as f:
            config = json.load(f)
            if "img_size" in config:
                IMG_SIZE = tuple(config["img_size"])
            if "class_names" in config:
                CLASS_NAMES = config["class_names"]
        print(f"[OK] Konfigurasi dimuat: Ukuran Gambar={IMG_SIZE}, Kelas={CLASS_NAMES}")
    except Exception as e:
        print(f"[WARNING] Gagal membaca {CONFIG_PATH}, menggunakan default. Error: {e}")

# Muat Model (Lazy Loading / Pengamanan agar FastAPI tetap bisa start)
model = None
model_error_msg = None

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"[OK] Model Kematangan Pisang berhasil dimuat dari: {MODEL_PATH}")
    elif os.path.exists(MODEL_FILE):
        model = tf.keras.models.load_model(MODEL_FILE)
        MODEL_PATH = MODEL_FILE
        print(f"[OK] Model Kematangan Pisang berhasil dimuat dari: {MODEL_FILE}")
    else:
        model_error_msg = (
            f"File model '{MODEL_FILE}' tidak ditemukan di folder '{MODEL_DIR}/' "
            "atau root proyek. Silakan unduh model .keras dari Google Drive Anda "
            "dan letakkan ke folder 'model_pisang/'."
        )
        print(f"[WARNING] {model_error_msg}")
except Exception as e:
    model_error_msg = f"Gagal memuat model Keras. Error: {e}"
    print(f"[ERROR] {model_error_msg}")


# ── Inferensi / Predict Logic ──────────────────────────────────
def predict(img_bytes: bytes):
    global model, model_error_msg
    if model is None:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Model belum siap atau tidak ditemukan.",
                "message": model_error_msg or "Silakan periksa folder 'model_pisang' Anda."
            }
        )

    # 1. Decode & Preprocess Gambar
    try:
        img = tf.image.decode_image(img_bytes, channels=3, expand_animations=False)
        img = tf.image.resize(img, IMG_SIZE)
        img = tf.cast(img, tf.float32) / 255.0  # Normalisasi piksel 0-1
        img = tf.expand_dims(img, 0)            # Tambah dimensi batch (1, H, W, C)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Format gambar tidak didukung atau rusak. Error: {e}"
        )

    # 2. Prediksi
    try:
        preds = model.predict(img)
        probs = preds[0]
        class_idx = int(np.argmax(probs))
        confidence = float(probs[class_idx])
        raw_label = CLASS_NAMES[class_idx]
        
        # Petakan label agar sesuai dengan database gizi Laravel
        db_label = LABEL_MAPPING.get(raw_label, raw_label)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat memproses model. Error: {e}"
        )

    return {
        "class": db_label,
        "confidence": round(confidence, 4),
        "items": [
            {
                "label": db_label,
                "score": round(confidence, 4)
            }
        ]
    }


# ── FastAPI Server Setup ───────────────────────────────────────
app = FastAPI(title="SmartBanana AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "SmartBanana AI API",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH if model is not None else None,
        "classes": CLASS_NAMES,
        "error": model_error_msg
    }

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    img_bytes = await file.read()
    result = predict(img_bytes)
    return result


# ── Run Server ─────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    # Menjalankan server pada port 7860 sesuai konfigurasi default
    uvicorn.run(app, host="0.0.0.0", port=7860)
