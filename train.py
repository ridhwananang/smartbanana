import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, callbacks
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam

# ── Konfigurasi ───────────────────────────────────────────────────────────────
DATASET_PATH     = os.path.join('archive', 'content', 'dataset_gambar')
SAVE_DIR         = 'model_pisang'
MODEL_SAVE_PATH  = os.path.join(SAVE_DIR, 'cnn_kematangan_pisang.keras')
CONFIG_SAVE_PATH = os.path.join(SAVE_DIR, 'config.json')

IMG_SIZE         = (224, 224)   # Optimal untuk MobileNetV2
BATCH_SIZE       = 16           # Batch size kecil untuk training lokal
EPOCHS_HEAD      = 15           # Phase 1: latih head saja
EPOCHS_FINE      = 20           # Phase 2: fine-tuning
LR_HEAD          = 1e-3
LR_FINE          = 1e-5         # Harus kecil untuk fine-tuning
SEED             = 42

print('=' * 55)
print('[OK] Memulai Setup Training Lokal (MobileNetV2)')
print(f'   TensorFlow versi : {tf.__version__}')
gpu = tf.config.list_physical_devices('GPU')
if gpu:
    print(f'   GPU              : [AKTIF] ({gpu[0].name})')
else:
    print(f'   GPU              : [TIDAK AKTIF] (Menggunakan CPU)')
print('=' * 55)

# Buat folder model jika belum ada
os.makedirs(SAVE_DIR, exist_ok=True)

# ── Verifikasi path ───────────────────────────────────────────────────────────
if not os.path.exists(DATASET_PATH):
    print(f'[ERROR] Path dataset TIDAK ditemukan: {DATASET_PATH}')
    print('   Pastikan folder archive/content/dataset_gambar berisi folder pisang.')
    exit(1)

# ── Data Generator TRAINING (dengan augmentasi) ───────────────────────────────
train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,  # ← WAJIB untuk MobileNetV2
    validation_split=0.2,
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)

# ── Data Generator VALIDASI ───────────────────────────────────────────────────
val_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,  # ← WAJIB untuk MobileNetV2
    validation_split=0.2
)

# ── Load gambar dari folder ───────────────────────────────────────────────────
train_data = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    seed=SEED,
    shuffle=True
)

val_data = val_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    seed=SEED,
    shuffle=False
)

CLASS_NAMES = list(train_data.class_indices.keys())
NUM_CLASSES = len(CLASS_NAMES)

print(f'   Urutan kelas  : {train_data.class_indices}')
print(f'   Training      : {train_data.samples} gambar')
print(f'   Validasi      : {val_data.samples} gambar')

# ── Membangun Model MobileNetV2 ───────────────────────────────────────────────
base_model = MobileNetV2(
    input_shape=(*IMG_SIZE, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False  # Freeze base model dulu

inputs = keras.Input(shape=(*IMG_SIZE, 3))
x = base_model(inputs, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.4)(x)
outputs = layers.Dense(NUM_CLASSES, activation='softmax')(x)

model = keras.Model(inputs, outputs)

# ── Phase 1: Latih Classifier Head ────────────────────────────────────────────
model.compile(
    optimizer=Adam(learning_rate=LR_HEAD),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

cb_early = callbacks.EarlyStopping(
    monitor='val_accuracy', patience=5, restore_best_weights=True, verbose=1
)
cb_reduce_lr = callbacks.ReduceLROnPlateau(
    monitor='val_loss', factor=0.5, patience=3, min_lr=1e-7, verbose=1
)

print('\n🚀 Phase 1: Melatih Classifier Head...')
print('=' * 60)
history_head = model.fit(
    train_data,
    epochs=EPOCHS_HEAD,
    validation_data=val_data,
    callbacks=[cb_early, cb_reduce_lr],
    verbose=1
)

# ── Phase 2: Fine-Tuning ──────────────────────────────────────────────────────
# Unfreeze 50 layer terakhir dari MobileNetV2 base
base_model.trainable = True
fine_tune_at = len(base_model.layers) - 50

for layer in base_model.layers[:fine_tune_at]:
    layer.trainable = False

# Compile ulang dengan LR sangat kecil
model.compile(
    optimizer=Adam(learning_rate=LR_FINE),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

cb_checkpoint = callbacks.ModelCheckpoint(
    MODEL_SAVE_PATH,
    monitor='val_accuracy',
    save_best_only=True,
    verbose=1
)

print('\n🚀 Phase 2: Fine-Tuning MobileNetV2...')
print('=' * 60)
history_fine = model.fit(
    train_data,
    epochs=EPOCHS_FINE,
    validation_data=val_data,
    callbacks=[cb_early, cb_reduce_lr, cb_checkpoint],
    verbose=1
)

# ── Evaluasi Akhir ────────────────────────────────────────────────────────────
loss_score, acc_score = model.evaluate(val_data, verbose=0)

# Simpan Konfigurasi
config = {
    'img_size': list(IMG_SIZE),
    'class_names': CLASS_NAMES,
    'num_classes': NUM_CLASSES,
    'val_accuracy': float(acc_score),
    'model_type': 'mobilenetv2',
    'preprocessing': 'mobilenet_v2'
}

with open(CONFIG_SAVE_PATH, 'w') as f:
    json.dump(config, f, indent=2)

print('\n' + '=' * 60)
print('TRAINING SELESAI & BERHASIL!')
print(f'   Model disimpan ke  : {MODEL_SAVE_PATH}')
print(f'   Config disimpan ke : {CONFIG_SAVE_PATH}')
print(f'   Val Accuracy Akhir : {acc_score*100:.2f}%')
print('=' * 60)
