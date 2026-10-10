# math, random, statistics

!!! abstract "Уровень: ⭐ → ⭐⭐"
    Подойдёт для всех классов. Нужно знать: [арифметические операторы](../01-basics/operators.md).

---

## 🍎 Объясняем просто

!!! example "Три модуля — три инструмента"
    - **`math`** — «точная математика»: корни, тригонометрия, логарифмы, π.
    - **`random`** — «случайности»: кубики, жребий, перемешивание.
    - **`statistics`** — «статистика»: среднее, медиана, мода.

    ```python
    import math, random, statistics
    print(math.sqrt(16))              # 4.0
    print(random.randint(1, 6))       # 1..6
    print(statistics.mean([1, 2, 3])) # 2
    ```

---

## 📐 Модуль `math` — все функции

### Константы

| Имя | Значение | Смысл |
|---|---|---|
| `math.pi` | 3.14159… | Число π |
| `math.e` | 2.71828… | Число e |
| `math.tau` | 6.28318… | 2π (полный оборот) |
| `math.inf` | ∞ | Бесконечность |
| `math.nan` | NaN | Не число |
| `math.nan` (проверка) | `math.isnan(x)` | — |

### Округление и знак

| Функция | Что делает |
|---|---|
| `math.ceil(x)` | Вверх до целого |
| `math.floor(x)` | Вниз до целого |
| `math.trunc(x)` | Отбросить дробную часть |
| `math.fabs(x)` | Модуль (float) |
| `math.copysign(x, y)` | Модуль x, знак y |

```python
import math
print(math.ceil(2.1))         # 3
print(math.floor(2.9))        # 2
print(math.trunc(-2.9))       # -2
print(math.fabs(-5))          # 5.0
print(math.copysign(3, -1))   # -3.0
```

### Степени и корни

| Функция | Что делает |
|---|---|
| `math.sqrt(x)` | Квадратный корень |
| `math.isqrt(x)` | Целый квадратный корень (3.8+) |
| `math.pow(x, y)` | x в степени y (float) |
| `math.exp(x)` | e^x |
| `math.expm1(x)` | e^x − 1 (точнее для малых x) |
| `math.log(x, base=e)` | Логарифм |
| `math.log2(x)` | Логарифм по 2 |
| `math.log10(x)` | Логарифм по 10 |
| `math.log1p(x)` | log(1 + x) (точнее для малых x) |
| `math.cbrt(x)` | Кубический корень (3.11+) |
| `math.hypot(*coords)` | √(x² + y² + …) |

```python
print(math.sqrt(25))          # 5.0
print(math.isqrt(26))         # 5 (целое)
print(math.pow(2, 10))        # 1024.0
print(math.log(math.e))       # 1.0
print(math.log(8, 2))         # 3.0
print(math.hypot(3, 4))       # 5.0 (теорема Пифагора)
```

### Тригонометрия

| Функция | Что делает |
|---|---|
| `math.sin(x)` | Синус |
| `math.cos(x)` | Косинус |
| `math.tan(x)` | Тангенс |
| `math.asin(x)` | Арксинус |
| `math.acos(x)` | Арккосинус |
| `math.atan(x)` | Арктангенс |
| `math.atan2(y, x)` | Арктангенс с учётом четверти |
| `math.sinh(x)` | Гиперболический синус |
| `math.cosh(x)` | Гиперболический косинус |
| `math.tanh(x)` | Гиперболический тангенс |
| `math.asinh(x)` | Обратный гиперболический |
| `math.acosh(x)` | Обратный гиперболический |
| `math.atanh(x)` | Обратный гиперболический |

```python
print(math.sin(math.pi / 2))    # 1.0
print(math.cos(0))              # 1.0
print(math.atan2(1, 1))         # π/4 ≈ 0.785
```

### Целочисленные операции

| Функция | Что делает |
|---|---|
| `math.factorial(n)` | n! |
| `math.gcd(*ints)` | Наибольший общий делитель |
| `math.lcm(*ints)` | Наименьшее общее кратное (3.9+) |
| `math.comb(n, k)` | Биномиальный коэффициент C(n, k) |
| `math.perm(n, k=None)` | Перестановки P(n, k) |
| `math.prod(iter, start=1)` | Произведение (3.8+) |
| `math.sumprod(p, q)` | Сумма произведений (3.12+) |
| `math.dist(p, q)` | Евклидово расстояние между точками |
| `math.fsum(iter)` | Точная сумма (без потери) |

```python
print(math.factorial(5))       # 120
print(math.gcd(12, 18))        # 6
print(math.lcm(4, 6))          # 12
print(math.comb(5, 2))         # 10
print(math.perm(5, 2))         # 20
print(math.prod([1, 2, 3, 4])) # 24
```

### Проверки

| Функция | Что проверяет |
|---|---|
| `math.isnan(x)` | NaN? |
| `math.isinf(x)` | Бесконечность? |
| `math.isfinite(x)` | Конечное? |
| `math.isclose(a, b, ...)` | Близки ли (с учётом погрешности) |

```python
print(math.isnan(math.nan))            # True
print(math.isinf(math.inf))            # True
print(math.isfinite(42))               # True
print(math.isclose(0.1 + 0.2, 0.3))    # True — в отличие от ==
```

### Другие функции

| Функция | Что делает |
|---|---|
| `math.degrees(x)` | Из радиан в градусы |
| `math.radians(x)` | Из градусов в радианы |
| `math.erf(x)` | Функция ошибок |
| `math.erfc(x)` | Дополнительная функция ошибок |
| `math.gamma(x)` | Гамма-функция |
| `math.lgamma(x)` | Логарифм гаммы |
| `math.nextafter(x, y)` | Следующее представимое число |
| `math.ulp(x)` | Unit in the last place |
| `math.modf(x)` | Дробная и целая части |
| `math.frexp(x)` | Мантисса и экспонента |
| `math.ldexp(x, i)` | x · 2^i |

```python
print(math.degrees(math.pi))     # 180.0
print(math.radians(180))         # π
print(math.modf(3.14))           # (0.14, 3.0)
```

---

## 🎲 Модуль `random` — все функции

!!! warning "Не для криптографии"
    `random` использует генератор **Mersenne Twister** — он предсказуем.
    Для паролей и токенов используйте модуль `secrets`.

### Целые числа

| Функция | Что делает |
|---|---|
| `random.randint(a, b)` | Случайное целое [a, b] **включительно** |
| `random.randrange(start, stop, step)` | Как `range`, но случайный элемент |

```python
print(random.randint(1, 6))       # 1..6, оба включительно
print(random.randrange(1, 10, 2)) # 1, 3, 5, 7, 9
```

### Дробные

| Функция | Что делает |
|---|---|
| `random.random()` | [0.0, 1.0) |
| `random.uniform(a, b)` | Равномерно в [a, b] |
| `random.gauss(mu, sigma)` | Нормальное распределение |
| `random.normalvariate(mu, sigma)` | То же (медленнее, точнее) |
| `random.expovariate(lambd)` | Экспоненциальное |
| `random.lognormvariate(mu, sigma)` | Логнормальное |
| `random.vonmisesvariate(mu, kappa)` | Фон Мизеса |
| `random.paretovariate(alpha)` | Парето |
| `random.weibullvariate(alpha, beta)` | Вейбулла |
| `random.gammavariate(alpha, beta)` | Гамма |
| `random.betavariate(alpha, beta)` | Бета |
| `random.triangular(low, high, mode)` | Треугольное |

```python
print(random.random())            # 0.7234...
print(random.uniform(1, 5))       # 3.14...
print(random.gauss(0, 1))         # нормальное
```

### Работа с коллекциями

| Функция | Что делает |
|---|---|
| `random.choice(seq)` | Случайный элемент |
| `random.choices(seq, weights, k)` | k элементов с возвратом |
| `random.sample(seq, k)` | k **уникальных** элементов |
| `random.shuffle(seq)` | Перемешать список на месте |

```python
fruits = ["яблоко", "банан", "груша"]
print(random.choice(fruits))                 # один
print(random.choices(fruits, k=2))           # 2, могут повторяться
print(random.sample(fruits, 2))              # 2, уникальные
random.shuffle(fruits)                       # перемешали in-place
```

### Управление генератором

| Функция | Что делает |
|---|---|
| `random.seed(x)` | Зафиксировать генератор |
| `random.getstate()` | Текущее состояние |
| `random.setstate(s)` | Восстановить |
| `random.getrandbits(k)` | k случайных бит |

```python
random.seed(42)      # теперь последовательность воспроизводима
print(random.random())   # всегда одно и то же при seed(42)
```

### Класс `Random`

Свой экземпляр генератора — не трогает глобальный:

```python
rng = random.Random(123)
print(rng.randint(1, 100))
```

### Классы распределений

Модуль `random` также содержит **классы** для собственных ГСЧ:
`SystemRandom`, `Random`. Обычно используются редко.

---

## 📊 Модуль `statistics` — все функции

### Средние

| Функция | Что считает |
|---|---|
| `mean(data)` | Среднее арифметическое |
| `fmean(data, weights=None)` | Среднее (float, быстрее) |
| `geometric_mean(data)` | Среднее геометрическое |
| `harmonic_mean(data, weights=None)` | Среднее гармоническое |

```python
print(statistics.mean([1, 2, 3, 4]))    # 2.5
print(statistics.fmean([1, 2, 3, 4]))   # 2.5
```

### Медианы и моды

| Функция | Что делает |
|---|---|
| `median(data)` | Медиана |
| `median_low(data)` | Нижняя медиана |
| `median_high(data)` | Верхняя медиана |
| `median_grouped(data, interval=1)` | Медиана сгруппированных |
| `mode(data)` | Мода (3.8+: первая) |
| `multimode(data)` | Все моды |

```python
print(statistics.median([1, 2, 3, 4, 5]))     # 3
print(statistics.mode([1, 2, 2, 3]))          # 2
print(statistics.multimode([1, 1, 2, 2, 3]))  # [1, 2]
```

### Разброс

| Функция | Что считает |
|---|---|
| `pstdev(data)` | σ — стандартное отклонение (генеральная) |
| `stdev(data)` | s — стандартное отклонение (выборочная) |
| `pvariance(data)` | Дисперсия (генеральная) |
| `variance(data)` | Дисперсия (выборочная) |
| `quantiles(data, n=4)` | Квантили (медианы долей) |

```python
data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(statistics.stdev(data))       # ~2.74
print(statistics.variance(data))    # ~7.5
print(statistics.quantiles(data, n=4))
```

### Корреляции

| Функция | Что считает |
|---|---|
| `covariance(x, y)` | Ковариация |
| `correlation(x, y)` | Коэффициент корреляции Пирсона |
| `linear_regression(x, y)` | Прямая регрессии (slope, intercept) |

---

## 💡 Примеры

### Пример 1. Гипотенуза 📐

```python
import math

a, b = 3, 4
print(math.hypot(a, b))    # 5.0
```

### Пример 2. Кубик 🎲

```python
import random

for _ in range(5):
    print(random.randint(1, 6), end=" ")
```

### Пример 3. Сюжетный — лотерея 🎟️

```python
import random

tickets = list(range(1, 51))
winners = random.sample(tickets, 5)
print("Победители:", sorted(winners))
```

### Пример 4. Статистика оценок 🎓

```python
import statistics

grades = [5, 4, 5, 3, 5, 4, 5, 4, 3, 5]
print(f"Среднее: {statistics.mean(grades):.2f}")
print(f"Медиана: {statistics.median(grades)}")
print(f"Мода: {statistics.mode(grades)}")
print(f"Разброс: {statistics.stdev(grades):.2f}")
```

### Пример 5. Сюжетный — бросок монеты 🪙

```python
import random

flips = [random.choice(["О", "Р"]) for _ in range(100)]
print(f"Орлов: {flips.count('О')}")
print(f"Решек: {flips.count('Р')}")
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `randint(1, 6)` включает 6"
    ```python
    random.randint(1, 6)     # 1..6 включительно
    random.randrange(1, 6)   # 1..5 — как range!
    ```

!!! warning "Ошибка 2. `random.seed` без аргумента"
    `random.seed()` — использует системное время. Для воспроизводимости
    указывайте число: `random.seed(42)`.

!!! warning "Ошибка 3. Использование `random` для паролей"
    ❌ Не используйте `random` для безопасности. Только `secrets`.

!!! warning "Ошибка 4. Ожидание целого от `random.random()`"
    `random.random()` — всегда float в [0, 1).

---

## 🧪 Упражнения

1. ⭐ Выведите π, e, √2, sin(30°).
2. ⭐ 10 раз бросьте кубик через `randint`.
3. ⭐⭐ Найдите НОД и НОК чисел 24 и 36.
4. ⭐⭐ Возведите 2 в 100 через `math.pow` и узнайте, сколько цифр.
5. ⭐⭐ Перемешайте список 10 имён и выведите первые 3.
6. ⭐⭐⭐ Постройте 1000 случайных чисел и найдите их среднее и σ.
7. ⭐⭐⭐ Смоделируйте 100 бросков монеты, выведите процент орлов.

---

## 🔗 Что дальше

→ [datetime](datetime.md) — даты, время, разница.