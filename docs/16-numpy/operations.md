# NumPy: операции

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"
    Нужно знать: [Основы NumPy](basics.md).

---

## 📖 Векторизация

NumPy выполняет операции **сразу над всем массивом**, без циклов:

```python
import numpy as np

a = np.array([1, 2, 3, 4])
a + 10          # [11, 12, 13, 14]
a * 2           # [2, 4, 6, 8]
a ** 2          # [1, 4, 9, 16]
```

Это **в разы быстрее** цикла. Всегда старайтесь писать векторно.

---

## 📌 Арифметические операции

| Оператор | Что делает |
|---|---|
| `+`, `-`, `*`, `/` | Поэлементно |
| `**` | Степень |
| `//`, `%` | Целое деление, остаток |
| `np.add`, `np.subtract`, `np.multiply`, `np.divide` | То же в функциях |
| `np.power`, `np.mod`, `np.floor_divide` | — |

### Сравнения

```python
a = np.array([1, 2, 3])
a > 1             # array([False, True, True])
a == 2            # array([False, True, False])
```

### Логические

```python
np.logical_and(a > 0, a < 3)
np.logical_or(a < 2, a > 2)
np.logical_not(a > 1)
```

---

## 📌 Математические функции

| Функция | Что делает |
|---|---|
| `np.sqrt(a)` | Корень |
| `np.exp(a)` | e^a |
| `np.log(a)`, `np.log2`, `np.log10`, `np.log1p` | Логарифмы |
| `np.sin`, `np.cos`, `np.tan` | Тригонометрия |
| `np.arcsin`, `np.arccos`, `np.arctan` | Обратные |
| `np.abs(a)` | Модуль |
| `np.sign(a)` | Знак |
| `np.round(a, n)` | Округление |
| `np.floor`, `np.ceil`, `np.trunc` | Целая часть |
| `np.clip(a, lo, hi)` | Обрезка диапазона |
| `np.power(a, b)` | Степень |
| `np.square(a)` | Квадрат |
| `np.cbrt(a)` | Куб. корень |
| `np.hypot(a, b)` | √(a² + b²) |

Все работают **поэлементно** над массивом.

---

## 📌 Агрегации

| Функция | Что считает |
|---|---|
| `np.sum(a)` | Сумма |
| `np.prod(a)` | Произведение |
| `np.mean(a)` | Среднее |
| `np.median(a)` | Медиана |
| `np.std(a)` | σ |
| `np.var(a)` | Дисперсия |
| `np.min(a)`, `np.max(a)` | Мин/макс |
| `np.argmin(a)`, `np.argmax(a)` | Индексы минимума/максимума |
| `np.cumsum(a)` | Накопительная сумма |
| `np.cumprod(a)` | Накопительное произведение |
| `np.ptp(a)` | Размах (max − min) |
| `np.percentile(a, q)` | Перцентиль |
| `np.quantile(a, q)` | Квантиль |
| `np.all(a)` | Все истинны? |
| `np.any(a)` | Хотя бы одно? |
| `np.count_nonzero(a)` | Сколько ненулевых |

### Параметр `axis`

Для многомерных — считаем по оси:

```python
a = np.array([[1, 2, 3],
              [4, 5, 6]])

a.sum()               # 21 — сумма всех
a.sum(axis=0)         # [5, 7, 9] — сумма по столбцам
a.sum(axis=1)         # [6, 15] — сумма по строкам
```

**Мнемоника:** `axis=0` — «свернуть строки, остались столбцы»; `axis=1` — наоборот.

---

## 📌 Broadcasting — «расширение» размеров

Если формы не совпадают, NumPy **автоматически расширяет** меньшую:

```python
a = np.array([1, 2, 3])
b = 10
a + b                # [11, 12, 13] — b растянулось

m = np.array([[1, 2, 3],
              [4, 5, 6]])
v = np.array([10, 20, 30])
m + v                # v прибавилось к каждой строке
# [[11, 22, 33],
#  [14, 25, 36]]
```

**Правило:** размерности сравниваются справа. Совместимы, если равны или одна из них = 1.

```
(3, 4) + (4,)      → (3, 4)     ✅
(3, 4) + (3, 1)    → (3, 4)     ✅
(3, 4) + (3,)      → ❌ ошибка
```

!!! info "Подробнее: как работает broadcasting 🔬"
    NumPy «дополняет» меньшую форму единицами слева и растягивает её
    (виртуально, без копирования) до формы большей. Это делает код
    кратким и быстрым, но легко ошибиться, если формы неочевидны.
    
    Проверяйте `a.shape`, `b.shape` при непонятных ошибках.

---

## 📌 Линейная алгебра

```python
from numpy.linalg import inv, det, eig, solve, norm, matrix_rank

A = np.array([[1, 2], [3, 4]])

inv(A)                   # обратная матрица
det(A)                   # определитель
eig(A)                   # собственные значения и векторы
A @ B                    # матричное умножение
A.dot(B)                 # то же
np.dot(a, b)             # скалярное произведение
norm(v)                  # длина вектора
solve(A, b)              # решить Ax = b
matrix_rank(A)           # ранг
```

---

## 📌 Сортировка и поиск

| Функция | Что делает |
|---|---|
| `np.sort(a)` | Сортировка (копия) |
| `a.sort()` | Сортировка **на месте** |
| `np.argsort(a)` | Индексы сортировки |
| `np.unique(a)` | Уникальные |
| `np.searchsorted(a, v)` | Где вставить |
| `np.where(cond, x, y)` | Тернарная |
| `np.nonzero(a)` | Индексы ненулевых |
| `np.isin(a, values)` | Входит в список |
| `np.isnan(a)`, `np.isinf(a)` | Проверки |

```python
a = np.array([3, 1, 4, 1, 5])
np.sort(a)              # [1 1 3 4 5]
np.unique(a)            # [1 3 4 5]
np.where(a > 2, a, 0)   # [0 0 4 0 5]
```

---

## 📌 Генерация случайных чисел

```python
np.random.seed(42)          # воспроизводимость

np.random.rand(2, 3)            # [0, 1) — 2×3
np.random.randn(100)            # нормальные (N(0, 1))
np.random.randint(1, 10, 5)     # 5 целых из [1, 10)
np.random.choice([1, 2, 3], 5)  # выбор с возвратом
np.random.shuffle(a)             # перемешать
np.random.permutation(a)         # копия, перемешанная
np.random.normal(loc, scale, size)   # N(loc, scale²)
np.random.uniform(low, high, size)
np.random.poisson(lam, size)
np.random.binomial(n, p, size)
np.random.exponential(scale, size)
```

Современный API:

```python
rng = np.random.default_rng(seed=42)
rng.normal(0, 1, 100)
```

---

## 📌 Ввод-вывод

```python
np.save("file.npy", a)             # сохранить
b = np.load("file.npy")            # загрузить
np.savez("multi.npz", a=a, b=b)    # несколько
np.savetxt("data.txt", a)          # текстом
c = np.loadtxt("data.txt")         # из текста
```

---

## 💡 Примеры

### Пример 1. Нормализация данных 📊

```python
data = np.array([10, 20, 30, 40, 50])
normalized = (data - data.min()) / (data.max() - data.min())
print(normalized)   # [0.   0.25 0.5  0.75 1.  ]
```

### Пример 2. Средние по группам 🎓

```python
grades = np.array([
    [5, 4, 5, 4],
    [3, 4, 3, 4],
    [5, 5, 5, 5],
])
print("По предметам:", grades.mean(axis=0))
print("По ученикам:", grades.mean(axis=1))
```

### Пример 3. Матричное умножение 🔢

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(A @ B)               # [[19, 22], [43, 50]]
```

### Пример 4. Решение системы уравнений 📐

```
2x + y = 5
x + 3y = 10
```

```python
A = np.array([[2, 1], [1, 3]])
b = np.array([5, 10])
solution = np.linalg.solve(A, b)
print(solution)            # [1. 3.]
```

### Пример 5. Сюжетный — симуляция бросков 🎲

```python
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=10_000)
print(f"Средний бросок: {rolls.mean():.3f}")     # ~3.5
print(f"Шестёрок: {(rolls == 6).sum()}")          # ~1667
```

---

## ⚠️ Частые ошибки

!!! warning "Путаница `axis`"
    - `axis=0` — по **столбцам** (сворачиваем строки)
    - `axis=1` — по **строкам**

!!! warning "Изменение view вместо копии"
    ```python
    a = np.arange(10)
    b = a[a > 5]      # это КОПИЯ (булева индексация)
    b[0] = 999         # a не изменилось
    ```

!!! warning "`a * b` — поэлементно, не матричное"
    Для матричного умножения — `a @ b` или `a.dot(b)`.

!!! warning "Деление на ноль"
    ```python
    np.array([1, 2]) / 0      # не ошибка, а inf/nan с warning
    ```
    Проверяйте `np.isinf`, `np.isnan`.

!!! warning "Плавающая точка и сравнение"
    ```python
    (0.1 + 0.2) == 0.3        # False!
    np.isclose(0.1 + 0.2, 0.3)   # True
    ```

---

## 🧪 Упражнения

1. ⭐ Сложите массив с числом и с другим массивом.
2. ⭐ Посчитайте `sqrt`, `exp`, `log` массива `[1, 2, 3, 4]`.
3. ⭐⭐ Найдите среднее, σ, мин, макс случайного массива.
4. ⭐⭐ Через `axis=1` посчитайте сумму по строкам.
5. ⭐⭐ Нормализуйте массив в диапазон [0, 1].
6. ⭐⭐⭐ Решите систему уравнений через `np.linalg.solve`.
7. ⭐⭐⭐ Смоделируйте 100 000 бросков кубика и посчитайте распределение.

---

## 🔗 Что дальше

→ [matplotlib](../17-matplotlib/index.md) — графики.