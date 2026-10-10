# Аргументы функций

!!! abstract "Уровень: ⭐⭐ Средний → ⭐⭐⭐ Продвинутый"
    Подойдёт для 8–11 класса. Нужно знать: [определение функций](definition.md).

---

## 🍎 Объясняем просто

!!! example "Аргументы — как ингредиенты"
    Функция-рецепт может принимать разное количество ингредиентов:
    - Обязательные (без них не сваришь)
    - Со значением по умолчанию («соль по вкусу»)
    - «И то, и это, и вот это тоже» (`*args`)
    - «Пара ключ-значение» (`**kwargs`)

    В Python есть **шесть** видов аргументов, и все они могут сочетаться.

---

## 1️⃣ Позиционные аргументы

Передаются **по порядку**:

```python
def introduce(name, age):
    print(f"{name}, {age} лет")

introduce("Аня", 12)     # по позиции
```

Если передать в другом порядке — получатся странности:

```python
introduce(12, "Аня")     # → "12, Аня лет"
```

Порядок — ответственность вызывающего.

---

## 2️⃣ Именованные аргументы

Можно явно указать, что куда:

```python
introduce(age=12, name="Аня")   # порядок не важен
```

Часто используют для читаемости, особенно если аргументов много:

```python
create_user(username="admin", password="1234", role="guest")
```

---

## 3️⃣ Значения по умолчанию

```python
def greet(name, greeting="Привет"):
    print(f"{greeting}, {name}!")

greet("Аня")                       # Привет, Аня!
greet("Аня", "Здравствуйте")       # Здравствуйте, Аня!
greet("Аня", greeting="Хай")       # Хай, Аня!
```

!!! warning "Опасность изменяемых значений по умолчанию ⚠️"
    **Классическая ошибка Python.**
    ```python
    def add_item(item, target=[]):    # ❌ НЕПРАВИЛЬНО
        target.append(item)
        return target

    print(add_item(1))   # [1]
    print(add_item(2))   # [1, 2]  ← !!!
    ```
    
    Значение по умолчанию создаётся **один раз**, при определении функции,
    и «живёт» между вызовами. Изменяя список, вы меняете «общий» список.
    
    **Правильно — использовать `None`:**
    ```python
    def add_item(item, target=None):
        if target is None:
            target = []
        target.append(item)
        return target
    ```

---

## 4️⃣ `*args` — произвольное число позиционных

Звёздочка перед именем собирает **все лишние позиционные** аргументы в **кортеж**:

```python
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3))          # 6
print(sum_all(1, 2, 3, 4, 5))    # 15
print(sum_all())                 # 0
```

Внутри функции `args` — это обычный кортеж:

```python
def show(*args):
    print(type(args))    # <class 'tuple'>
    print(args)

show(1, "a", [1, 2])
```

**Имя `args` — не магия**, можно назвать как угодно, но `*args` — общепринято.

---

## 5️⃣ `**kwargs` — произвольное число именованных

Две звёздочки собирают все лишние **именованные** аргументы в **словарь**:

```python
def describe(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

describe(name="Аня", age=12, city="Москва")
# name: Аня
# age: 12
# city: Москва
```

Имя `kwargs` = **key**word **arg**ument**s** — но снова, это просто соглашение.

---

## 6️⃣ Keyword-only аргументы

Всё, что идёт **после `*`** (или после `*args`), должно передаваться **только именованно**:

```python
def create_user(name, *, email, age):
    print(f"{name}: {email}, {age}")

create_user("Аня", email="a@b.ru", age=12)     # ✅
create_user("Аня", "a@b.ru", 12)               # ❌ TypeError
```

Это удобно, чтобы защитить важные параметры от случайного порядка:

```python
def send(message, *, urgent=False, cc=None):
    ...

send("Привет")                       # ✅
send("Привет", urgent=True)          # ✅
send("Привет", True)                 # ❌ — True не пойдёт по позиции
```

---

## 7️⃣ Positional-only аргументы

До символа `/` — только позиционные (Python 3.8+):

```python
def divide(a, b, /):
    return a / b

divide(10, 2)          # ✅
divide(a=10, b=2)      # ❌ TypeError
```

Полезно, когда имя аргумента — внутреннее дело функции. Пользователь не должен зависеть от имени.

!!! info "Подробнее: зачем это нужно 🔬"
    Positional-only позволяет разработчику **переименовать** аргумент без
    поломки чужих программ. Это популярно в стандартной библиотеке Python.
    
    Пример из встроенных функций: `len(obj, /)` — имя `obj` не гарантируется.
    Если ты напишешь `len(obj=[1, 2])`, получишь `TypeError`.

---

## 📋 Порядок аргументов в `def`

Всё вместе — строгий порядок:

```python
def func(pos_only, /, pos_or_kw, *, kw_only):
    ...
```

Полная схема:

```
def func( positional_only, / , обычные , *args , keyword_only , **kwargs ):
```

1. **Positional-only** — до `/`
2. **Positional-or-keyword** — обычные
3. **`*args`** — перехватывает лишние позиционные
4. **Keyword-only** — после `*` или `*args`
5. **`**kwargs`** — перехватывает лишние именованные

Пример:

```python
def build(a, b, /, c, d, *args, e, f, **kwargs):
    print(f"a={a}, b={b}, c={c}, d={d}")
    print(f"args={args}")
    print(f"e={e}, f={f}")
    print(f"kwargs={kwargs}")

build(1, 2, 3, 4, 5, 6, e=7, f=8, g=9, h=10)
# a=1, b=2, c=3, d=4
# args=(5, 6)
# e=7, f=8
# kwargs={'g': 9, 'h': 10}
```

---

## 📌 Распаковка при вызове

Можно распаковать коллекции **при вызове** функции:

### `*` для списка/кортежа

```python
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(add(*nums))   # 6 — то же, что add(1, 2, 3)
```

### `**` для словаря

```python
def greet(name, greeting):
    print(f"{greeting}, {name}!")

params = {"name": "Аня", "greeting": "Привет"}
greet(**params)   # Привет, Аня!
```

### Всё вместе

```python
def f(a, b, c, d):
    print(a, b, c, d)

args = [1, 2]
kwargs = {"c": 3, "d": 4}
f(*args, **kwargs)   # 1 2 3 4
```

---

## 💡 Полные примеры

### Пример 1. Гибкая функция логирования 📝

```python
def log(*messages, level="INFO", **context):
    prefix = f"[{level}]"
    print(prefix, *messages)
    for key, value in context.items():
        print(f"  {key}={value}")

log("Запуск", "сервер", level="WARN", host="localhost", port=8000)
# [WARN] Запуск сервер
#   host=localhost
#   port=8000
```

### Пример 2. Обёртка над `print` 🖨️

```python
def debug(*args, **kwargs):
    kwargs.setdefault("sep", " | ")
    print("[DEBUG]", *args, **kwargs)

debug(1, 2, 3)              # [DEBUG] 1 | 2 | 3
debug("a", "b", end="!\n")  # [DEBUG] a | b!
```

### Пример 3. Смешивание всех видов 🎛️

```python
def order(product, qty, /, *, discount=0, currency="RUB"):
    total = qty * 100 * (1 - discount)
    print(f"{product}: {total:.2f} {currency}")

order("apple", 5)                            # apple: 500.00 RUB
order("apple", 5, discount=0.2)              # apple: 400.00 RUB
order("apple", 5, discount=0.2, currency="USD")
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `*` перед args"
    ```python
    def f(args):     # ❌ это обычный аргумент по имени args
    def f(*args):    # ✅ кортеж
    ```

!!! warning "Ошибка 2. Путают `args` и `kwargs` при вызове"
    ```python
    f(*[1, 2])       # ✅ распаковка списка → позиционные
    f(**{"a": 1})    # ✅ распаковка словаря → именованные
    f([1, 2])        # ❌ передаст список как один аргумент
    ```

!!! warning "Ошибка 3. Обязательный после необязательного"
    ```python
    def f(a=1, b):   # ❌ SyntaxError
    def f(a, b=1):   # ✅
    ```

!!! warning "Ошибка 4. Изменяемое значение по умолчанию"
    ```python
    def add(x, lst=[]):   # ❌
    ```
    Используйте `None` и создавайте внутри.

!!! warning "Ошибка 5. `args` как имя снаружи"
    ```python
    def f(*args): ...
    print(args)   # ❌ NameError — args определён только внутри
    ```

---

## 🧪 Упражнения

1. ⭐ Функция `greet(name, greeting="Привет")` — со значением по умолчанию.
2. ⭐ Функция `sum_all(*args)` — сумма всех аргументов.
3. ⭐⭐ `count_args(*args)` — сколько аргументов передано.
4. ⭐⭐ `describe(**kwargs)` — печатает все пары ключ-значение.
5. ⭐⭐ Функция `login(username, password, *, remember=False)`.
6. ⭐⭐⭐ Функция `average(*args)`, которая возвращает среднее.
7. ⭐⭐⭐ Напишите функцию, принимающую и `*args`, и `**kwargs`, и выводящую их типы и содержимое.

---

## 🔗 Что дальше

→ [Возврат значений](return.md) — что и как возвращают функции.