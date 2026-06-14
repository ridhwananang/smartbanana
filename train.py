import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam

# ── Konfigurasi ───────────────────────────────────────────────────────────────
DATASET_PATH     = os.path.join('archive', 'content', 'dataset_gambar')
SAVE_DIR         = 'model_pisang'
IMG_SIZE         = (128, 128)   # ukuran gambar
BATCH_SIZE       = 16           # gambar per batch
EPOCHS           = 30           # disesuaikan ke 30 epoch agar training lokal lebih cepat
LEARNING_RATE    = 0.001        # kecepatan belajar
VALIDATION_SPLIT = 0.2          # 80% training, 20% validasi
SEED             = 42

print('=' * 55)
print('[OK] Memulai Setup Training Lokal')
print(f'   TensorFlow versi : {tf.__version__}')
gpu = tf.config.list_physical_devices('GPU')
if gpu:
    print(f'   GPU              : [AKTIF]')
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
    rescale            = 1./255,      # piksel 0-255 → 0.0-1.0
    rotation_range     = 25,          # rotasi acak ±25 derajat
    zoom_range         = 0.2,         # zoom in/out 20%
    width_shift_range  = 0.2,         # geser horizontal
    height_shift_range = 0.2,         # geser vertikal
    horizontal_flip    = True,        # balik kiri-kanan
    brightness_range   = [0.8, 1.2],  # variasi kecerahan
    shear_range        = 0.15,        # distorsi miring
    fill_mode          = 'nearest',   # isi piksel kosong
    validation_split   = VALIDATION_SPLIT
)

# ── Data Generator VALIDASI (hanya normalisasi, tanpa augmentasi) ─────────────
val_datagen = ImageDataGenerator(
    rescale          = 1./255,
    validation_split = VALIDATION_SPLIT
)

# ── Load gambar dari folder ───────────────────────────────────────────────────
train_data = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size = IMG_SIZE,
    batch_size  = BATCH_SIZE,
    class_mode  = 'categorical',
    subset      = 'training',
    seed        = SEED,
    shuffle     = True
)

val_data = val_datagen.flow_from_directory(
    DATASET_PATH,
    target_size = IMG_SIZE,
    batch_size  = BATCH_SIZE,
    class_mode  = 'categorical',
    subset      = 'validation',
    seed        = SEED,
    shuffle     = False
)

CLASS_NAMES = list(train_data.class_indices.keys())
NUM_CLASSES = len(CLASS_NAMES)

print(f'   Urutan kelas  : {train_data.class_indices}')
print(f'   Training      : {train_data.samples} gambar')
print(f'   Validasi      : {val_data.samples} gambar')

# ── Membangun Model CNN ───────────────────────────────────────────────────────
model = models.Sequential(name='CNN_Kematangan_Pisang')
model.add(layers.Input(shape=IMG_SIZE + (3,)))

# Block 1
model.add(layers.Conv2D(32, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.Conv2D(32, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
model.add(layers.Dropout(0.25))

# Block 2
model.add(layers.Conv2D(64, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.Conv2D(64, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
model.add(layers.Dropout(0.25))

# Block 3
model.add(layers.Conv2D(128, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.Conv2D(128, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
model.add(layers.Dropout(0.3))

# Block 4
model.add(layers.Conv2D(256, (3, 3), padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.MaxPooling2D(pool_size=(2, 2)))
model.add(layers.Dropout(0.3))

# FC Layers
model.add(layers.Flatten())
model.add(layers.Dense(512))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.Dropout(0.5))
model.add(layers.Dense(128, activation='relu'))
model.add(layers.Dropout(0.4))

# Output
model.add(layers.Dense(NUM_CLASSES, activation='softmax'))

model.compile(
    optimizer = Adam(learning_rate=LEARNING_RATE),
    loss      = 'categorical_crossentropy',
    metrics   = ['accuracy']
)

# ── Callbacks ─────────────────────────────────────────────────────────────────
checkpoint_path = os.path.join(SAVE_DIR, 'cnn_kematangan_pisang.keras')
callback_list = [
    callbacks.ModelCheckpoint(
        filepath       = checkpoint_path,
        monitor        = 'val_accuracy',
        save_best_only = True,
        mode           = 'max',
        verbose        = 1
    ),
    callbacks.EarlyStopping(
        monitor              = 'val_accuracy',
        patience             = 10,
        restore_best_weights = True,
        verbose              = 1
    ),
    callbacks.ReduceLROnPlateau(
        monitor   = 'val_loss',
        factor    = 0.5,
        patience  = 5,
        min_lr    = 1e-7,
        verbose   = 1
    )
]

print('\nMemulai Training Model CNN (Silakan tunggu)...')
print('=' * 60)

history = model.fit(
    train_data,
    epochs          = EPOCHS,
    validation_data = val_data,
    callbacks       = callback_list,
    verbose         = 1
)

# ── Menyimpan Konfigurasi Tambahan ────────────────────────────────────────────
path_kelas = os.path.join(SAVE_DIR, 'class_names.json')
with open(path_kelas, 'w') as f:
    json.dump(CLASS_NAMES, f, indent=2)

config = {
    'img_size'   : list(IMG_SIZE),
    'class_names': CLASS_NAMES,
    'num_classes': NUM_CLASSES,
    'val_accuracy': float(max(history.history['val_accuracy']))
}
path_config = os.path.join(SAVE_DIR, 'config.json')
with open(path_config, 'w') as f:
    json.dump(config, f, indent=2)

print('\n' + '=' * 60)
print('TRAINING SELESAI & BERHASIL!')
print(f'   Model disimpan ke      : {checkpoint_path}')
print(f'   Nama Kelas disimpan ke : {path_kelas}')
print(f'   Config disimpan ke     : {path_config}')
print(f'   Val Accuracy Terbaik   : {max(history.history["val_accuracy"])*100:.2f}%')
print('=' * 60)
