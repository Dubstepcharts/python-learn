# matplotlib: виды графиков

!!! abstract "Уровень: ⭐⭐"

---

## 📊 Столбики — `bar` / `barh`

```python
import matplotlib.pyplot as plt

cities = ["Москва", "Питер", "Казань", "Сочи"]
pop = [12.6, 5.4, 1.3, 0.4]

plt.bar(cities, pop, color="steelblue", edgecolor="black")
plt.title("Население городов, млн")
plt.ylabel("млн чел.")
plt.show()
```

Горизонтальные — `plt.barh(...)`.

**Группированные**:

```python
import numpy as np

x = np.arange(len(cities))
width = 0.4
plt.bar(x - width/2, pop_2020, width, label="2020")
plt.bar(x + width/2, pop_2024, width, label="2024")
plt.xticks(x, cities)
plt.legend()
```

**Стек** — параметр `bottom`:

```python
plt.bar(cities, boys, label="Мальчики")
plt.bar(cities, girls, bottom=boys, label="Девочки")
```

---

## 📈 Гистограмма — `hist`

```python
import numpy as np

data = np.random.normal(170, 10, 1000)
plt.hist(data, bins=30, color="purple", alpha=0.7, edgecolor="black")
plt.title("Распределение роста")
plt.xlabel("см")
plt.show()
```

**Параметры:** `bins`, `density=True` (нормировка), `cumulative=True`, `histtype="step"` / `"stepfilled"` / `"bar"`.

---

## 🥧 Круговая — `pie`

```python
labels = ["Аня", "Борис", "Вика", "Глеб"]
votes = [15, 20, 30, 10]

plt.pie(votes, labels=labels, autopct="%1.1f%%", startangle=90,
        colors=["gold", "lightskyblue", "lightgreen", "pink"])
plt.title("Результаты голосования")
plt.axis("equal")   # ровный круг
plt.show()
```

**Параметры:** `explode` (выделить кусок), `shadow`, `autopct`, `startangle`, `colors`, `wedgeprops`.

---

## 📦 Ящик с усами — `boxplot`

Показывает медиану, квартили, выбросы.

```python
data = [np.random.normal(0, 1, 100) for _ in range(4)]
plt.boxplot(data, labels=["A", "B", "C", "D"])
plt.title("Сравнение групп")
plt.ylabel("Значение")
plt.show()
```

---

## 🌡️ Тепловая карта — `imshow`

```python
matrix = np.random.rand(5, 5)
plt.imshow(matrix, cmap="viridis")
plt.colorbar()
plt.title("Матрица 5×5")
plt.show()
```

Популярные `cmap`: `viridis`, `plasma`, `magma`, `inferno`, `cividis`, `Blues`, `Reds`, `coolwarm`, `RdBu`.

---

## 🌈 Контурные — `contour` / `contourf`

```python
x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

plt.contourf(X, Y, Z, levels=20, cmap="RdBu")
plt.colorbar()
plt.show()
```

---

## 📉 Столбики с ошибками — `errorbar`

```python
x = [1, 2, 3, 4]
y = [10, 12, 9, 15]
err = [1, 1.5, 0.8, 2]

plt.errorbar(x, y, yerr=err, fmt="o-", capsize=5)
plt.show()
```

---

## 🎯 Диаграмма рассеяния с цветом — `scatter`

```python
rng = np.random.default_rng(0)
x = rng.normal(0, 1, 200)
y = rng.normal(0, 1, 200)
colors = rng.random(200)
sizes = rng.integers(20, 200, 200)

plt.scatter(x, y, c=colors, s=sizes, cmap="plasma", alpha=0.7)
plt.colorbar()
plt.show()
```

---

## 🕸️ Радар

```python
import numpy as np
import matplotlib.pyplot as plt

labels = ["Скорость", "Сила", "Ловкость", "Ум", "Харизма"]
values = [4, 3, 5, 4, 2]

angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
values += values[:1]
angles += angles[:1]

fig, ax = plt.subplots(subplot_kw={"projection": "polar"})
ax.plot(angles, values, "o-", linewidth=2)
ax.fill(angles, values, alpha=0.25)
ax.set_xticks(angles[:-1])
ax.set_xticklabels(labels)
plt.show()
```

---

## 🌐 3D графики

```python
from mpl_toolkits.mplot3d import Axes3D
import numpy as np

fig = plt.figure(figsize=(8, 6))
ax = fig.add_subplot(111, projection="3d")

x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

ax.plot_surface(X, Y, Z, cmap="viridis")
ax.set_title("3D-поверхность")
plt.show()
```

Другие 3D-функции: `scatter`, `plot_wireframe`, `contour3D`, `bar3d`.

---

## 📌 Совмещение графиков

```python
fig, ax1 = plt.subplots()

ax1.plot(x, y1, "b-")
ax1.set_ylabel("Ось 1", color="b")

ax2 = ax1.twinx()      # вторая ось Y
ax2.plot(x, y2, "r-")
ax2.set_ylabel("Ось 2", color="r")

plt.show()
```

---

## 💡 Пример — дашборд

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)
noisy = np.sin(x) + rng.normal(0, 0.2, 100)

fig, axs = plt.subplots(2, 2, figsize=(12, 8))

axs[0, 0].plot(x, y1, label="sin")
axs[0, 0].plot(x, y2, label="cos")
axs[0, 0].legend()
axs[0, 0].set_title("Тригонометрия")

axs[0, 1].scatter(x, noisy, s=10, alpha=0.6)
axs[0, 1].set_title("Шум")

axs[1, 0].hist(noisy, bins=20, color="orange", edgecolor="black")
axs[1, 0].set_title("Распределение")

axs[1, 1].bar(["A", "B", "C"], [3, 7, 5], color=["red", "green", "blue"])
axs[1, 1].set_title("Столбики")

plt.tight_layout()
plt.show()
```

---

## ⚠️ Частые ошибки

!!! warning "`pie` без `axis(\"equal\")`"
    Круг может выглядеть овалом.

!!! warning "`hist` со слишком большим `bins`"
    График становится «шумным». 20–50 — обычно достаточно.

!!! warning "3D медленный на больших данных"
    Уменьшите количество точек.

!!! warning "Тепловая карта без `colorbar`"
    Непонятно, что значит цвет. Добавляйте `plt.colorbar()`.

---

## 🧪 Упражнения

1. ⭐ Столбики по 5 городам.
2. ⭐ Гистограмма 500 случайных чисел.
3. ⭐⭐ Круговая диаграмма долей.
4. ⭐⭐ Группированные столбики: два года.
5. ⭐⭐ Ящик с усами для 3 групп.
6. ⭐⭐⭐ Тепловая карта случайной матрицы 10×10.
7. ⭐⭐⭐ 3D-поверхность `z = x² + y²`.

---

## 🔗 Что дальше

→ [seaborn](seaborn.md).