# matplotlib: основы

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [NumPy](../16-numpy/index.md).

---

## 🚀 Установка

```bash
pip install matplotlib
```

```python
import matplotlib.pyplot as plt
```

`plt` — соглашение.

---

## ✍️ Первый график

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 1, 5, 3]

plt.plot(x, y)
plt.show()
```

Готово.

---

## 📖 Два подхода

### 1. Быстрый (pyplot)

```python
plt.plot(x, y)
plt.title("Заголовок")
plt.show()
```

### 2. Объектный (для сложных рисунков)

```python
fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_title("Заголовок")
ax.set_xlabel("X")
ax.set_ylabel("Y")
plt.show()
```

Второй **рекомендуется** для всего, кроме одного простого графика.

---

## 📌 Основные функции

| Функция | Что рисует |
|---|---|
| `plt.plot(x, y)` | Линия |
| `plt.scatter(x, y)` | Точки |
| `plt.bar(x, heights)` | Вертикальные столбики |
| `plt.barh(y, widths)` | Горизонтальные |
| `plt.hist(data, bins)` | Гистограмма |
| `plt.pie(values)` | Круговая |
| `plt.boxplot(data)` | Ящик с усами |
| `plt.imshow(img)` | Картинка |
| `plt.contour`, `plt.contourf` | Изолинии |
| `plt.quiver`, `plt.streamplot` | Векторы |
| `plt.errorbar` | С планками ошибок |
| `plt.fill_between` | Залить между |
| `plt.stem` | «Стебли» |
| `plt.step` | Ступеньки |

---

## 📌 Оформление

```python
plt.plot(x, y, label="Мой график", color="red", linewidth=2,
         linestyle="--", marker="o")

plt.title("Заголовок", fontsize=14)
plt.xlabel("Ось X")
plt.ylabel("Ось Y")
plt.legend(loc="best")
plt.grid(True)
plt.xlim(0, 10)
plt.ylim(-1, 10)
plt.show()
```

### Параметры `plot`

| Параметр | Значит |
|---|---|
| `color` | Цвет линии |
| `linewidth` | Толщина |
| `linestyle` | `-`, `--`, `-.`, `:` |
| `marker` | `o`, `s`, `^`, `*`, `+`, `.`, `x` |
| `markersize` | Размер маркера |
| `alpha` | Прозрачность (0–1) |
| `label` | Подпись для легенды |

### Цвета

`"red"`, `"blue"`, `"green"`, `"k"` (чёрный), `"#FF6B6B"`, `(0.2, 0.5, 0.8)`, `"C0"`, `"C1"` (палитра по умолчанию).

---

## 📌 Несколько графиков

### На одном рисунке

```python
plt.plot(x, y1, label="Первая")
plt.plot(x, y2, label="Вторая")
plt.legend()
plt.show()
```

### Сетка

```python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, y1)
axes[0, 0].set_title("График 1")

axes[0, 1].scatter(x, y2)
axes[0, 1].set_title("График 2")

axes[1, 0].bar(x, y1)
axes[1, 0].set_title("График 3")

axes[1, 1].hist(y2, bins=5)
axes[1, 1].set_title("График 4")

plt.tight_layout()
plt.show()
```

---

## 📌 Сохранение

```python
plt.savefig("plot.png", dpi=150, bbox_inches="tight")
```

Форматы: `png`, `pdf`, `svg`, `jpg`, `eps`.

---

## 📌 Стили

```python
plt.style.use("ggplot")
plt.style.use("seaborn-v0_8-darkgrid")
plt.style.use("bmh")
plt.style.use("dark_background")

print(plt.style.available)      # список всех
```

Популярные: `default`, `ggplot`, `classic`, `bmh`, `seaborn-v0_8-*`, `fivethirtyeight`, `dark_background`, `Solarize_Light2`.

---

## 📌 Кириллица

По умолчанию русские буквы в подписях могут «поехать». Решение:

```python
plt.rcParams["font.family"] = "DejaVu Sans"    # обычно уже поддерживает
```

Если не помогает:

```python
import matplotlib
matplotlib.rc("font", family="DejaVu Sans")
```

---

## 💡 Примеры

### Пример 1. Функция синуса 🌊

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
y = np.sin(x)

plt.plot(x, y, label="sin(x)", color="blue")
plt.title("График синуса")
plt.xlabel("x")
plt.ylabel("sin(x)")
plt.grid(True)
plt.legend()
plt.show()
```

### Пример 2. Продажи по месяцам 📈

```python
months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"]
sales = [100, 120, 90, 150, 170, 140]

plt.figure(figsize=(8, 5))
plt.plot(months, sales, marker="o", color="green")
plt.title("Продажи за полгода")
plt.ylabel("Тыс. руб.")
plt.grid(True, alpha=0.3)
plt.show()
```

### Пример 3. Сравнение двух классов 📊

```python
x = np.arange(4)
subject = ["Матем", "Рус", "Физ", "Хим"]
grades_7a = [4.5, 4.2, 4.8, 4.6]
grades_7b = [4.1, 4.3, 3.9, 4.4]

width = 0.35
plt.bar(x - width/2, grades_7a, width, label="7А")
plt.bar(x + width/2, grades_7b, width, label="7Б")
plt.xticks(x, subject)
plt.ylabel("Средний балл")
plt.legend()
plt.title("Успеваемость")
plt.show()
```

### Пример 4. Точечная диаграмма 🔵

```python
rng = np.random.default_rng(0)
x = rng.normal(170, 10, 200)
y = rng.normal(65, 8, 200)

plt.scatter(x, y, alpha=0.6, c="steelblue")
plt.xlabel("Рост, см")
plt.ylabel("Вес, кг")
plt.title("Рост и вес 200 человек")
plt.grid(True, alpha=0.3)
plt.show()
```

---

## 📌 Аннотации

```python
plt.plot(x, y)
plt.annotate("Важная точка", xy=(3, 5), xytext=(4, 6),
             arrowprops={"arrowstyle": "->"})
plt.text(1, 8, "Просто текст", fontsize=12)
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `plt.show()`"
    График не появится (или появится после завершения скрипта).

!!! warning "Кириллица — «кракозябры»"
    ```python
    plt.rcParams["font.family"] = "DejaVu Sans"
    ```

!!! warning "Слипшиеся подписи"
    ```python
    plt.tight_layout()
    ```
    Или `plt.xticks(rotation=45)`.

!!! warning "Каждый `plt.plot` рисует на текущем рисунке"
    Если хочется начать заново — `plt.figure()` или `plt.clf()`.

!!! warning "В цикле много фигур"
    Закрывайте через `plt.close(fig)`, чтобы не копить память.

---

## 🧪 Упражнения

1. ⭐ Постройте `y = x²` для x от −5 до 5.
2. ⭐ Синус и косинус на одном графике.
3. ⭐⭐ Столбики продаж по 5 месяцам.
4. ⭐⭐ Круговая диаграмма долей.
5. ⭐⭐ Гистограмма 500 случайных чисел.
6. ⭐⭐⭐ Сетка 2×2 с четырьмя графиками.
7. ⭐⭐⭐ Сохраните график в PNG с `dpi=300`.

---

## 🔗 Что дальше

→ [Виды графиков](charts.md).