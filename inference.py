import os
import json
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ── Konfigurasi & Variabel Global ───────────────────────────────
MODEL_DIR  = "model_pisang"
MODEL_FILE = "cnn_kematangan_pisang.keras"
CONFIG_FILE = "config.json"

MODEL_PATH  = os.path.join(MODEL_DIR, MODEL_FILE)
CONFIG_PATH = os.path.join(MODEL_DIR, CONFIG_FILE)

# Parameter Default
IMG_SIZE    = (224, 224)   # MobileNetV2 default
CLASS_NAMES = ["banana fully-ripe", "banana semi-ripe", "banana unripe"]
MODEL_TYPE  = "mobilenetv2"

# Pemetaan label ke key database gizi Laravel
LABEL_MAPPING = {
    "banana unripe":     "banana-unripe",
    "banana semi-ripe":  "banana-semi-ripe",
    "banana fully-ripe": "banana-fully-ripe"
}

# Muat Konfigurasi
if os.path.exists(CONFIG_PATH):
    try:
        with open(CONFIG_PATH) as f:
            config = json.load(f)
            if "img_size" in config:
                IMG_SIZE = tuple(config["img_size"])
            if "class_names" in config:
                CLASS_NAMES = config["class_names"]
            if "model_type" in config:
                MODEL_TYPE = config["model_type"]
        print(f"[OK] Config dimuat: IMG_SIZE={IMG_SIZE}, MODEL_TYPE={MODEL_TYPE}")
        print(f"[OK] CLASS_NAMES={CLASS_NAMES}")
    except Exception as e:
        print(f"[WARNING] Gagal membaca config.json: {e}")

# Muat Model
model = None
model_error_msg = None

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"[OK] Model berhasil dimuat dari: {MODEL_PATH}")
    elif os.path.exists(MODEL_FILE):
        model = tf.keras.models.load_model(MODEL_FILE)
        MODEL_PATH = MODEL_FILE
        print(f"[OK] Model berhasil dimuat dari: {MODEL_FILE}")
    else:
        model_error_msg = f"File model tidak ditemukan di {MODEL_PATH}"
        print(f"[WARNING] {model_error_msg}")
except Exception as e:
    model_error_msg = f"Gagal memuat model: {e}"
    print(f"[ERROR] {model_error_msg}")


# ── Preprocessing sesuai tipe model ────────────────────────────
def preprocess_image(img_bytes: bytes):
    """
    Preprocessing gambar sesuai model:
    - mobilenetv2 → preprocess_input (range [-1, 1])
    - cnn / lainnya → /255.0 (range [0, 1])
    """
    from PIL import Image
    import io

    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32)

    if MODEL_TYPE == "mobilenetv2":
        # WAJIB untuk MobileNetV2 — range [-1, 1]
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
        arr = preprocess_input(arr)
    else:
        # CNN biasa — normalisasi [0, 1]
        arr = arr / 255.0

    return np.expand_dims(arr, axis=0)  # (1, H, W, C)


# ── Inferensi / Predict Logic ──────────────────────────────────
def predict(img_bytes: bytes):
    global model, model_error_msg

    if model is None:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Model belum siap atau tidak ditemukan.",
                "message": model_error_msg or "Periksa folder 'model_pisang'."
            }
        )

    # 1. Preprocess
    try:
        img_array = preprocess_image(img_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Format gambar tidak didukung atau rusak. Error: {e}"
        )

    # 2. Prediksi
    try:
        preds      = model.predict(img_array, verbose=0)
        probs      = preds[0]
        class_idx  = int(np.argmax(probs))
        confidence = float(probs[class_idx])
        raw_label  = CLASS_NAMES[class_idx]
        db_label   = LABEL_MAPPING.get(raw_label, raw_label)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Kesalahan saat memproses model. Error: {e}"
        )

    return {
        "class":      db_label,
        "confidence": round(confidence, 4),
        "items": [
            {
                "label": db_label,
                "score": round(confidence, 4)
            }
        ]
    }


# ── FastAPI Setup ──────────────────────────────────────────────
app = FastAPI(title="SmartBanana AI API — MobileNetV2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message":      "SmartBanana AI API",
        "model_loaded": model is not None,
        "model_type":   MODEL_TYPE,
        "img_size":     IMG_SIZE,
        "classes":      CLASS_NAMES,
        "tf_version":   tf.__version__,
        "error":        model_error_msg
    }

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    img_bytes = await file.read()
    result    = predict(img_bytes)
    return result


# ── Run Server ─────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
