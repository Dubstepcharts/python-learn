# seaborn

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [matplotlib](basics.md), [pandas](../12-pandas/index.md).

---

## 🍎 Объясняем просто

!!! example "seaborn = matplotlib, но красиво «из коробки»"
    seaborn работает поверх matplotlib и рассчитан на **DataFrame**. Одна
    строка — и сложный график с группировкой готов.
    
    ```python
    import seaborn as sns
    sns.scatterplot(data=df, x="рост", y="вес", hue="пол")
    ```

---

## 🚀 Установка

```bash
pip install seaborn
```

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme()      # красивая тема по умолчанию
```

---

## 📌 Основные функции

| Функция | Что рисует |
|---|---|
| `sns.scatterplot` | Точки |
| `sns.lineplot` | Линия (с агрегацией) |
| `sns.barplot` | Столбики со средним и доверительным интервалом |
| `sns.countplot` | Частоты категорий |
| `sns.boxplot` | Ящик с усами |
| `sns.violinplot` | Скрипка |
| `sns.histplot` | Гистограмма |
| `sns.kdeplot` | Плотность |
| `sns.heatmap` | Тепловая карта |
| `sns.pairplot` | Матрица попарных графиков |
| `sns.jointplot` | Точки + распределения |
| `sns.regplot` | Точки + линия регрессии |
| `sns.lmplot` | То же с группировкой |
| `sns.catplot` | Обобщённый категориальный |
| `sns.relplot` | Обобщённый по связям |

Все принимают `data=df` и имена колонок.

---

## 💡 Примеры

### Пример 1. Scatterplot с группировкой

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "рост": [160, 165, 170, 175, 180, 155, 162, 168, 172, 178],
    "вес": [55, 60, 68, 75, 80, 50, 58, 65, 70, 78],
    "пол": ["Ж", "Ж", "М", "М", "М", "Ж", "Ж", "М", "М", "М"],
})

sns.scatterplot(data=df, x="рост", y="вес", hue="пол", s=100)
plt.title("Рост и вес по полу")
plt.show()
```

### Пример 2. Boxplot по группам

```python
sns.boxplot(data=df, x="пол", y="вес")
plt.title("Вес по полу")
plt.show()
```

### Пример 3. Тепловая карта корреляции

```python
import numpy as np

data = pd.DataFrame(np.random.randn(100, 5),
                    columns=["A", "B", "C", "D", "E"])

corr = data.corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)
plt.title("Корреляции")
plt.show()
```

### Пример 4. `pairplot` — все пары

```python
sns.pairplot(df, hue="пол")
plt.show()
```

Рисует **матрицу** графиков «каждая колонка × каждая колонка». Отличный
первый взгляд на данные.

### Пример 5. Линия с агрегацией

```python
tips = sns.load_dataset("tips")     # встроенный датасет
sns.lineplot(data=tips, x="size", y="total_bill")
plt.show()
```

### Пример 6. Гистограмма + KDE

```python
sns.histplot(data=tips, x="total_bill", kde=True, bins=20)
plt.show()
```

### Пример 7. `catplot` — обобщённый

```python
sns.catplot(data=tips, x="day", y="total_bill", kind="box", hue="sex")
plt.show()
```

---

## 📌 Встроенные датасеты

```python
sns.load_dataset("tips")          # чаевые
sns.load_dataset("iris")           # ирисы
sns.load_dataset("titanic")        # Титаник
sns.load_dataset("penguins")       # пингвины
sns.get_dataset_names()            # список всех
```

Отличный способ учиться: эти данные уже «почищены».

---

## 📌 Темы

```python
sns.set_theme(style="whitegrid")
sns.set_theme(style="darkgrid")
sns.set_theme(style="ticks")
sns.set_theme(style="white")
sns.set_theme(style="dark")

sns.set_palette("husl")
sns.set_palette("muted")
sns.set_palette("pastel")
sns.set_palette("bright")
sns.set_palette("dark")
sns.set_palette("colorblind")
```

Полный список стилей и палитр — в документации seaborn.

---

## 📌 Совмещение с matplotlib

seaborn возвращает `ax`, к которому можно применять всё matplotlib:

```python
ax = sns.scatterplot(data=df, x="a", y="b")
ax.set_title("Мой график")
ax.set_xlabel("Ось X")
ax.grid(True)

# Или через fig
g = sns.catplot(...)
g.fig.suptitle("Общий заголовок")
```

---

## ⚠️ Частые ошибки

!!! warning "`set_theme` вызывать один раз"
    В начале скрипта. Многократные вызовы не нужны.

!!! warning "`pairplot` на большом датасете"
    Десятки колонок — сотни графиков. Может зависнуть.

!!! warning "Забыли `plt.show()`"
    seaborn не показывает сам.

!!! warning "Кириллица в подписях"
    Установите `plt.rcParams["font.family"] = "DejaVu Sans"`.

---

## 🧪 Упражнения

1. ⭐ `scatterplot` роста и веса.
2. ⭐ `histplot` значений из `tips`.
3. ⭐⭐ `boxplot` по группам.
4. ⭐⭐ `heatmap` корреляций.
5. ⭐⭐ `pairplot` на датасете `iris`.
6. ⭐⭐⭐ Комбинация: `jointplot` + группировка по категории.

---

## 🔗 Что дальше

→ [scikit-learn](../18-sklearn/index.md) — машинное обучение.