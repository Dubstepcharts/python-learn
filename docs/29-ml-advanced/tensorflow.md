# TensorFlow / Keras

!!! abstract "Уровень: ⭐⭐⭐"

---

## 🚀 Установка

```bash
pip install tensorflow
```

Для GPU — отдельные сборки (`tensorflow-gpu`). На Apple Silicon — `tensorflow-macos`.

Проверка:

```python
import tensorflow as tf
print(tf.__version__)
print(tf.config.list_physical_devices("GPU"))
```

---

## 📌 Keras — высокоуровневый API

Keras встроен в TensorFlow. Позволяет строить модели **в несколько строк**.

```python
import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Input(shape=(4,)),
    layers.Dense(16, activation="relu"),
    layers.Dense(3, activation="softmax"),
])

model.summary()
```

Всё — `Sequential` со списком слоёв.

---

## 📌 Полный цикл обучения

```python
import tensorflow as tf
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Данные
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Модель
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(4,)),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(8, activation="relu"),
    tf.keras.layers.Dense(3, activation="softmax"),
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=16,
    validation_split=0.2,
    verbose=1,
)

loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Accuracy: {acc:.2%}")
```

**В Keras:**
1. Создать модель
2. `compile` — задать оптимизатор, loss, метрики
3. `fit` — обучить
4. `evaluate` — оценить
5. `predict` — предсказать

---

## 📌 Слои

| Слой | Для чего |
|---|---|
| `Dense` | Полносвязный |
| `Conv2D` | Свёрточный (картинки) |
| `MaxPooling2D` | Пулинг |
| `Flatten` | Уплощение |
| `Dropout` | Регуляризация |
| `BatchNormalization` | Нормализация |
| `LSTM`, `GRU` | Рекуррентные (текст, время) |
| `Embedding` | Слова → векторы |
| `Attention` | Внимание (трансформеры) |

---

## 📌 CNN на MNIST

```python
import tensorflow as tf

# Данные
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train = x_train / 255.0
x_test = x_test / 255.0

# Модель
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(28, 28, 1)),
    tf.keras.layers.Conv2D(32, 3, activation="relu"),
    tf.keras.layers.MaxPool2D(),
    tf.keras.layers.Conv2D(64, 3, activation="relu"),
    tf.keras.layers.MaxPool2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(10, activation="softmax"),
])

model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])

model.fit(x_train, y_train, epochs=5, batch_size=32, validation_split=0.1)

test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_acc:.2%}")
```

**Точность ~99%** на MNIST — задача считается «решённой».

---

## 📌 Сохранение модели

```python
model.save("model.keras")              # весь формат
model = tf.keras.models.load_model("model.keras")

model.save_weights("weights.h5")        # только веса
model.load_weights("weights.h5")
```

---

## 📌 Callbacks — управление обучением

```python
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint("best.keras", save_best_only=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3),
]

model.fit(X_train, y_train, epochs=100, callbacks=callbacks)
```

**EarlyStopping** — остановиться, если val_loss не улучшается.
**ModelCheckpoint** — сохранять лучшую модель.
**ReduceLROnPlateau** — уменьшить learning rate при застое.

---

## 📌 Готовые модели

```python
from tensorflow.keras.applications import ResNet50, EfficientNetB0, MobileNetV2

base = EfficientNetB0(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base.trainable = False

model = tf.keras.Sequential([
    base,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(10, activation="softmax"),
])
```

**Transfer learning** — основа практического ML. Берём предобученную сеть,
заменяем голову под свою задачу.

---

## 📌 Keras vs PyTorch

| | Keras | PyTorch |
|---|---|---|
| Синтаксис | Проще | Гибче |
| Обучение | `model.fit` | Ручной цикл |
| Отладка | Ограничена | Pythonic — легко |
| Исследования | Реже | Стандарт |
| Продакшен | Отличен (TFLite, TF Serving) | Хорош (TorchScript) |
| Для кого | Новичкам проще | Исследователям |

**Совет:** для первого знакомства — **Keras**. Хотите контролировать
всё — **PyTorch**.

---

## ⚠️ Частые ошибки

!!! warning "Не масштабировали данные"
    Точность будет низкой. Всегда `StandardScaler` или `/255.0`.

!!! warning "Слишком много эпох без EarlyStopping"
    Переобучение. Добавьте callback.

!!! warning "Слишком маленький batch"
    Обучение нестабильно. 32–128 — обычно хорошо.

!!! warning "Путают `categorical_crossentropy` и `sparse_categorical_crossentropy`"
    - `sparse_` — метки целые (0, 1, 2...)
    - без `sparse_` — one-hot

!!! warning "GPU не виден"
    Проверьте `tf.config.list_physical_devices("GPU")`. Иногда нужен
    `tensorflow[and-cuda]` или специальная сборка.

---

## 🧪 Упражнения

1. ⭐ Ирисы на Keras.
2. ⭐ Сохраните и загрузите модель.
3. ⭐⭐ MNIST с точностью >98%.
4. ⭐⭐ Добавьте `EarlyStopping`.
5. ⭐⭐ CNN на CIFAR-10.
6. ⭐⭐⭐ Transfer learning: EfficientNet на своём датасете.

---

## 🔗 Что дальше

→ [Веб-скрапинг: продакшн](../30-scraping-pro/index.md).