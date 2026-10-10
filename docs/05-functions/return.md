# Возврат значений

!!! abstract "Уровень: ⭐ Начальный"
    Подойдёт для 7–11 класса. Нужно знать: [определение функций](definition.md).

---

## 🍎 Объясняем просто

!!! example "return — это «отдать ответ»"
    Функция может просто что-то сделать (напечатать, изменить файл) —
    это «побочный эффект». А может **вернуть результат** — конкретное
    значение, которое ты присвоишь переменной или используешь в выражении.
    
    ```python
    def square(x):
        return x ** 2

    result = square(5)   # result = 25
    print(square(3) + square(4))   # 9 + 16 = 25
    ```

---

## 📖 Что делает `return`

- **Прекращает** выполнение функции
- **Возвращает** указанное значение тому, кто вызвал
- Если функция дошла до конца **без** `return`, она вернёт `None`

```python
def f1():
    return 5

def f2():
    print("hi")
    # нет return — вернётся None

print(f1())   # 5
print(f2())   # hi, затем None
```

---

## ✍️ Формы `return`

### Возврат значения

```python
def add(a, b):
    return a + b
```

### Возврат `None` (явно)

```python
def log(msg):
    print(msg)
    return         # ← необязательно; равнозначно return None
```

### Ранний `return` — досрочный выход

```python
def divide(a, b):
    if b == 0:
        return "делить на ноль нельзя"
    return a / b
```

Используется, чтобы избежать глубокой вложенности `if`:

```python
# Плохо
def process(data):
    if data:
        if len(data) > 0:
            if data[0] != 0:
                return data[0]
    return None

# Хорошо
def process(data):
    if not data:
        return None
    if len(data) == 0:
        return None
    if data[0] == 0:
        return None
    return data[0]
```

### Возврат нескольких значений

Python автоматически упаковывает их в **кортеж**:

```python
def min_max(nums):
    return min(nums), max(nums)

result = min_max([3, 1, 4, 1, 5])
print(result)          # (1, 5)
print(type(result))    # <class 'tuple'>

low, high = min_max([3, 1, 4, 1, 5])
print(low, high)       # 1 5
```

---

## 🔄 `return` vs `print`

Одна из самых важных идей при обучении:

| | `print` | `return` |
|---|---|---|
| Что делает | Показывает на экране | Отдаёт значение программе |
| Можно использовать результат? | ❌ Нет | ✅ Да |
| Для чего | Для пользователя | Для дальнейших вычислений |

```python
def add_print(a, b):
    print(a + b)             # показал на экране и забыл

def add_return(a, b):
    return a + b             # отдал результат

x = add_print(2, 3)          # напечатает 5, x = None
y = add_return(2, 3)         # y = 5
print(y * 10)                # 50
# print(x * 10)              # ❌ TypeError: None * int
```

**Правило:** если результат нужен для дальнейших вычислений — используйте `return`.

---

## 💡 Примеры

### Пример 1. Функция без return

```python
def show_menu():
    print("1. Играть")
    print("2. Настройки")
    print("3. Выход")

result = show_menu()
print(result)   # None
```

### Пример 2. Функция-«калькулятор» 🧮

```python
def calculate(a, b, op):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        return a / b if b != 0 else None
    return None

print(calculate(10, 5, "+"))   # 15
print(calculate(10, 5, "/"))   # 2.0
```

### Пример 3. Разделение на чётные/нечётные 🎲

```python
def split_by_parity(nums):
    evens = []
    odds = []
    for n in nums:
        if n % 2 == 0:
            evens.append(n)
        else:
            odds.append(n)
    return evens, odds   # возвращаем кортеж

even, odd = split_by_parity([1, 2, 3, 4, 5, 6])
print(even)   # [2, 4, 6]
print(odd)    # [1, 3, 5]
```

### Пример 4. Каскад функций 🎬

```python
def get_data():
    return [3, 1, 4, 1, 5, 9, 2, 6]

def process(data):
    return sorted(set(data))

def output(result):
    return f"Уникальные: {result}"

print(output(process(get_data())))
# Уникальные: [1, 2, 3, 4, 5, 6, 9]
```

### Пример 5. Рекурсия с return 🔁

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120
```

---

## 📌 Возврат «сложных» значений

Функция может вернуть что угодно: список, словарь, другой кортеж, другую функцию:

```python
def make_dict(keys, values):
    return dict(zip(keys, values))

def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

counter = make_counter()
print(counter())   # 1
print(counter())   # 2
```

Возврат функции из функции — основа декораторов (см. дальше).

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `print` вместо `return`"
    ```python
    def add(a, b):
        print(a + b)         # ❌

    x = add(2, 3)            # x = None
    ```

!!! warning "Ошибка 2. `return` прерывает всё"
    ```python
    def f():
        return 1
        print("это не выполнится")   # ❌ мёртвый код
    ```

!!! warning "Ошибка 3. Забыли вернуть"
    ```python
    def add(a, b):
        result = a + b       # посчитали, но не вернули

    print(add(2, 3))         # None
    ```

!!! warning "Ошибка 4. `return` вне функции"
    ```python
    return 5   # ❌ SyntaxError
    ```

!!! warning "Ошибка 5. Путают возврат с несколькими значениями и одним кортежем"
    ```python
    def f():
        return (1, 2)

    a, b = f()       # a=1, b=2
    x = f()          # x=(1, 2)
    ```

---

## 🧪 Упражнения

1. ⭐ Функция `square(x)` — возвращает квадрат.
2. ⭐ Функция `is_positive(n)` — `True`/`False`.
3. ⭐⭐ Функция `min_max(nums)` — возвращает минимум и максимум.
4. ⭐⭐ Функция `split_word(s)` — возвращает первую и последнюю букву.
5. ⭐⭐ Функция `divide(a, b)` — возвращает результат или `None` при `b == 0`.
6. ⭐⭐⭐ Функция `statistics(nums)`, возвращающая `(минимум, максимум, среднее)`.
7. ⭐⭐⭐ Функция `fib(n)`, возвращающая n-е число Фибоначчи через рекурсию.

---

## 🔗 Что дальше

→ [Область видимости](scope.md) — где «видна» переменная.