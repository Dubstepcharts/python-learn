# Графики в pandas

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [Series и DataFrame](series-dataframe.md).

---

## 🍎 Объясняем просто

!!! example "`.plot()` — и график готов"
    У `Series` и `DataFrame` есть метод `.plot()`. Одна строка — и график
    на экране. Внутри используется `matplotlib`.

    ```python
    df["оценка"].plot(kind="bar")
    ```

---

## 🚀 Подготовка

```bash
pip install matplotlib
```

```python
import pandas as pd
import matplotlib.pyplot as plt
```

---

## 📖 `.plot()` и его `kind`

| `kind=` | Что рисует |
|---|---|
| `"line"` | Линия (по умолчанию) |
| `"bar"` | Вертикальные столбики |
| `"barh"` | Горизонтальные |
| `"hist"` | Гистограмма |
| `"box"` | Ящик с усами |
| `"kde"` / `"density"` | Плотность |
| `"area"` | Область |
| `"pie"` | Круговая |
| `"scatter"` | Точки (нужно `x`, `y`) |
| `"hexbin"` | Гексагональная |

```python
df.plot(kind="bar")
df.plot.bar()               # то же
df.plot.hist(bins=20)
df.plot.scatter(x="a", y="b")
```

---

## 📖 Общие параметры

| Параметр | Значит |
|---|---|
| `title` | Заголовок |
| `xlabel`, `ylabel` | Подписи осей |
| `figsize=(w, h)` | Размер |
| `color` | Цвет |
| `alpha` | Прозрачность |
| `grid=True` | Сетка |
| `legend=False` | Без легенды |
| `rot=45` | Поворот подписей |
| `stacked=True` | Стопкой (для bar/area) |
| `subplots=True` | Каждая колонка — свой график |

---

## 📌 Разные типы графиков

### Линия

```python
df = pd.DataFrame({
    "год": [2020, 2021, 2022, 2023],
    "продажи": [100, 150, 200, 180],
}).set_index("год")

df.plot(title="Продажи по годам", marker="o")
plt.show()
```

### Столбики

```python
df.plot(kind="bar", color="green", title="Продажи")
plt.xticks(rotation=0)
plt.show()
```

### Гистограмма

```python
import numpy as np
data = pd.Series(np.random.randn(1000))
data.plot.hist(bins=30, title="Распределение")
plt.show()
```

### Круговая

```python
counts = pd.Series({"яблоко": 30, "банан": 45, "груша": 25})
counts.plot.pie(autopct="%.1f%%", ylabel="")
plt.show()
```

### Точки

```python
df.plot.scatter(x="рост", y="вес", alpha=0.5)
plt.show()
```

### Несколько колонок

```python
df = pd.DataFrame({
    "математика": [5, 4, 3, 5, 4],
    "русский": [4, 5, 4, 3, 5],
    "физика": [3, 4, 5, 4, 3],
})
df.plot(kind="bar", figsize=(10, 5))
plt.show()
```

### Сетка графиков

```python
df.plot(subplots=True, layout=(1, 3), figsize=(12, 4))
plt.tight_layout()
plt.show()
```

---

## 📌 Сохранение графика

```python
ax = df.plot(title="График")
ax.figure.savefig("plot.png", dpi=150, bbox_inches="tight")
```

Или:

```python
plt.savefig("plot.png")
plt.show()
```

---

## 📌 Стили matplotlib

```python
plt.style.use("ggplot")          # стиль
plt.style.use("seaborn-v0_8")    # стиль
print(plt.style.available)       # все доступные
```

---

## 💡 Примеры

### Пример 1. Продажи по месяцам 📈

```python
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.DataFrame({
    "месяц": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
    "продажи": [120, 150, 200, 180, 220, 250],
}).set_index("месяц")

sales.plot(kind="line", marker="o", title="Продажи за полгода", grid=True)
plt.ylabel("Тыс. руб.")
plt.tight_layout()
plt.show()
```

### Пример 2. Оценки класса 📊

```python
grades = pd.DataFrame({
    "ученик": ["Аня", "Борис", "Вика", "Глеб", "Даша"],
    "оценка": [5, 4, 5, 3, 5],
}).set_index("ученик")

grades.plot(kind="bar", color="steelblue", legend=False, title="Оценки")
plt.xticks(rotation=0)
plt.show()
```

### Пример 3. Сюжетный — распределение роста 📏

```python
import numpy as np

heights = pd.Series(np.random.normal(165, 10, 200))
heights.plot.hist(bins=20, alpha=0.7, title="Рост учеников")
plt.xlabel("см")
plt.show()
```

### Пример 4. Сравнение двух классов 🔀

```python
df = pd.DataFrame({
    "7А": [4.5, 4.2, 4.8, 4.6],
    "7Б": [4.1, 4.3, 3.9, 4.4],
}, index=["Матем", "Рус", "Физ", "Хим"])

df.plot(kind="bar", figsize=(8, 5), title="Средние по предметам")
plt.xticks(rotation=0)
plt.tight_layout()
plt.show()
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `plt.show()`"
    График построится, но окно может не открыться.

!!! warning "Ошибка 2. Кириллица — «кракозябры»"
    ```python
    plt.rcParams["font.family"] = "DejaVu Sans"    # обычно решает
    ```
    Или используйте латиницу в подписях.

!!! warning "Ошибка 3. Слишком много данных в bar"
    Если категорий >50 — лучше `barh` или фильтрация.

!!! warning "Ошибка 4. `.plot()` не отображается в скрипте"
    Скрипт завершится, окно мелькнёт. Запускайте интерактивно или
    сохраняйте в файл через `savefig`.

!!! warning "Ошибка 5. `kind=\"scatter\"` без `x` и `y`"
    ```python
    df.plot.scatter(x="a", y="b")     # ✅
    df.plot(kind="scatter")            # ❌
    ```

---

## 🧪 Упражнения

1. ⭐ Постройте график продаж по месяцам.
2. ⭐ Столбики оценок учеников.
3. ⭐⭐ Гистограмма 500 случайных чисел.
4. ⭐⭐ Круговая диаграмма долей товаров.
5. ⭐⭐ Два линейных графика на одном.
6. ⭐⭐⭐ Сохраните график в PNG.
7. ⭐⭐⭐ Сетка 2×2 с четырьмя разными графиками.

---

## 🔗 Что дальше

→ [Kivy](../13-kivy/index.md) — мобильные приложения.