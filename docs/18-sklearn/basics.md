# scikit-learn: основы

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [NumPy](../16-numpy/index.md), [pandas](../12-pandas/index.md).

---

## 🚀 Установка

```bash
pip install scikit-learn
```

```python
from sklearn import ...
```

---

## 🍎 Общий принцип

Все модели в sklearn работают одинаково:

```python
model = SomeModel(параметры)
model.fit(X_train, y_train)         # обучение
y_pred = model.predict(X_test)       # предсказание
model.score(X_test, y_test)          # качество
```

Это называется **единый API** — выучив одну модель, вы умеете работать с любой.

---

## ✍️ Первый пример — ирисы

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# 1. Данные
iris = load_iris()
X = iris.data       # признаки
y = iris.target      # метки классов

# 2. Разделение
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Модель и обучение
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# 4. Предсказание
y_pred = model.predict(X_test)

# 5. Качество
acc = accuracy_score(y_test, y_pred)
print(f"Точность: {acc:.2%}")
```

Четыре строчки — и у вас работает модель машинного обучения.

---

## 📌 Встроенные датасеты

```python
from sklearn.datasets import (
    load_iris,          # ирисы (классификация)
    load_digits,        # рукописные цифры
    load_wine,          # вино
    load_breast_cancer, # рак груди
    load_diabetes,      # диабет (регрессия)
    load_boston,        # Бостон (устарел, но иногда встречается)
    fetch_california_housing,   # жильё Калифорнии
    make_classification,        # синтетические
    make_regression,
)

data = load_iris()
print(data.DESCR)          # описание
print(data.data.shape)     # (150, 4)
print(data.feature_names)  # названия признаков
print(data.target_names)   # классы
```

---

## 📌 Разделение данных

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,      # 20% на тест
    random_state=42,     # воспроизводимость
    shuffle=True,
    stratify=y,          # сохранить пропорции классов
)
```

Правило: **70/30** или **80/20** — стандарт. Для больших данных — 90/10.

### Кросс-валидация

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5)
print(f"Среднее: {scores.mean():.3f} ± {scores.std():.3f}")
```

Разбивает данные на 5 частей и обучает 5 раз. **Надёжнее** одного теста.

---

## 📌 Масштабирование признаков

Некоторые модели чувствительны к масштабу. Приведите признаки к одному
диапазону:

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)         # НЕ fit!
```

**Правило:** `.fit_transform` на train, `.transform` на test. Иначе
«утечка данных».

---

## 📌 Метрики

### Классификация

```python
from sklearn.metrics import (
    accuracy_score,          # точность
    precision_score,          # точность предсказания положительных
    recall_score,             # полнота
    f1_score,                 # F1 = 2·P·R/(P+R)
    confusion_matrix,         # матрица ошибок
    classification_report,    # всё сразу
    roc_auc_score,            # площадь под ROC-кривой
)

print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))
```

### Регрессия

```python
from sklearn.metrics import (
    mean_squared_error,     # MSE
    mean_absolute_error,    # MAE
    r2_score,                # R² (0..1, ближе к 1 — лучше)
    root_mean_squared_error, # RMSE (в новых версиях)
)

print(f"R²: {r2_score(y_test, y_pred):.3f}")
```

---

## 📌 Конвейер (Pipeline)

Собираем шаги в цепочку:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression()),
])

pipe.fit(X_train, y_train)
score = pipe.score(X_test, y_test)
```

Удобно: один `fit` применяет всё по порядку.

---

## 📌 Сохранение модели

```python
import joblib

joblib.dump(model, "model.pkl")     # сохранить
model = joblib.load("model.pkl")     # загрузить
```

Альтернатива — `pickle`. `joblib` быстрее и работает с numpy-массивами.

---

## 💡 Полный пример — предсказание сорта вина

```python
import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Данные
wine = load_wine()
X, y = wine.data, wine.target

# Разделение
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

# Масштабирование
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Модель
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Оценка
y_pred = model.predict(X_test)
print(f"Точность: {accuracy_score(y_test, y_pred):.2%}")
print(classification_report(y_test, y_pred, target_names=wine.target_names))

# Кросс-валидация
cv = cross_val_score(model, X, y, cv=5)
print(f"CV: {cv.mean():.3f}")
```

---

## ⚠️ Частые ошибки

!!! warning "Обучили на тесте"
    **Никогда** не проверяйте модель на данных, на которых она училась.

!!! warning "Утечка данных"
    `fit_transform` на train, `transform` на test. Не наоборот.

!!! warning "Забыли `random_state`"
    Без него результаты не воспроизводимы.

!!! warning "Не масштабировали данные"
    Многие модели (SVM, KNN, нейросети) требуют масштабирования.

!!! warning "Переобучение"
    Модель идеальна на train, плоха на test — уменьшите сложность
    (меньше признаков, регуляризация).

!!! warning "Несбалансированные классы"
    Accuracy может ввести в заблуждение. Смотрите precision/recall/F1.

---

## 🧪 Упражнения

1. ⭐ Загрузите датасет ирисов, посмотрите его описание.
2. ⭐ Обучите `DecisionTreeClassifier` и посчитайте accuracy.
3. ⭐⭐ Сравните 3 модели: логистическую регрессию, дерево, случайный лес.
4. ⭐⭐ Сделайте кросс-валидацию и сравните среднее.
5. ⭐⭐ Постройте матрицу ошибок.
6. ⭐⭐⭐ Соберите `Pipeline` со `StandardScaler` + модель.
7. ⭐⭐⭐ Сохраните модель в файл и загрузите обратно.

---

## 🔗 Что дальше

→ [Алгоритмы](algorithms.md) — полный обзор.