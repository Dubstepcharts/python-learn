# Декораторы

!!! abstract "Уровень: ⭐⭐⭐ Продвинутый"
    Подойдёт для 10–11 класса. Нужно знать: [функции](definition.md), [возврат](return.md), [область видимости](scope.md).

---

## 🍎 Объясняем просто

!!! example "Декоратор — как «подарочная упаковка»"
    У тебя есть функция. Хочется, чтобы она делала что-то **дополнительное**
    перед или после основного действия (логирование, кэширование, проверка
    прав). Декоратор — это «обёртка»: берёт функцию, добавляет поведение
    и возвращает новую функцию.

    ```python
    @my_decorator
    def my_function():
        ...
    ```
    
    Символ `@` — это «применить декоратор к функции ниже».

---

## 📖 Как это работает

Декоратор — **функция, которая принимает функцию и возвращает функцию**.

```python
def my_decorator(func):
    def wrapper():
        print("До вызова")
        func()
        print("После вызова")
    return wrapper

@my_decorator
def say_hello():
    print("Привет!")

say_hello()
# До вызова
# Привет!
# После вызова
```

Строка `@my_decorator` над `def` равнозначна:

```python
say_hello = my_decorator(say_hello)
```

---

## ✍️ Свои декораторы

### С аргументами

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Вызов {func.__name__} с {args}, {kwargs}")
        result = func(*args, **kwargs)
        print(f"Результат: {result}")
        return result
    return wrapper

@my_decorator
def add(a, b):
    return a + b

add(2, 3)
# Вызов add с (2, 3), {}
# Результат: 5
```

### С `@functools.wraps` — сохранить метаданные

Без `@wraps` обёрнутая функция «теряет» своё имя, докстроку, аннотации:

```python
import functools

def my_decorator(func):
    @functools.wraps(func)          # ← важно!
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def hello():
    """Приветствие."""
    return "hi"

print(hello.__name__)   # "hello" (без wraps было бы "wrapper")
print(hello.__doc__)    # "Приветствие."
```

### С параметрами (трёхуровневый)

Хотите передать декоратору аргументы? Нужна **ещё одна обёртка**:

```python
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def say(msg):
    print(msg)

say("Привет")
# Привет
# Привет
# Привет
```

### Класс как декоратор

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Вызов #{self.count}")
        return self.func(*args, **kwargs)

@CountCalls
def greet():
    print("Привет")

greet()   # Вызов #1 \n Привет
greet()   # Вызов #2 \n Привет
```

---

## 📚 Все встроенные декораторы Python

### `@property` — «свойство»

Превращает метод в «атрибут», к которому обращаются без скобок. Часто для контроля доступа:

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Радиус не может быть отрицательным")
        self._radius = value

    @property
    def area(self):
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.radius)      # 5 — без скобок
print(c.area)        # 78.53975
c.radius = 10        # вызывает setter
# c.radius = -1      # ValueError
```

У `property` есть ещё `@deleter`:

```python
    @radius.deleter
    def radius(self):
        del self._radius
```

### `@staticmethod` и `@classmethod`

Внутри класса:

```python
class Math:
    @staticmethod
    def add(a, b):          # не получает ни self, ни cls
        return a + b

    @classmethod
    def create(cls):        # получает сам класс
        return cls()

print(Math.add(2, 3))       # 5 — можно вызывать без объекта
```

### `@functools.lru_cache` и `@functools.cache`

Кэшируют результат функции. Если вызвать с теми же аргументами — вернётся сохранённое значение, без пересчёта.

```python
import functools

@functools.lru_cache(maxsize=None)     # без ограничения размера
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(100))   # мгновенно, хоть и рекурсия
```

`@functools.cache` (Python 3.9+) — то же, но проще:

```python
@functools.cache
def fib(n):
    ...
```

!!! info "Подробнее: когда кэш помогает 🔬"
    Если функция — «чистая» (результат зависит только от аргументов, побочных
    эффектов нет), кэширование безопасно. Если функция читает файл, время,
    случайные числа — кэш может вернуть устаревшие данные.
    
    Кэш работает только с **хешируемыми** аргументами (числа, строки,
    кортежи). Списки нельзя.

### `@functools.cached_property`

Кэширует результат вычисления свойства **после первого обращения**:

```python
import functools

class Data:
    def __init__(self, nums):
        self.nums = nums

    @functools.cached_property
    def total(self):
        print("Считаю...")
        return sum(self.nums)

d = Data([1, 2, 3, 4, 5])
print(d.total)   # Считаю... \n 15
print(d.total)   # 15 (без пересчёта)
```

### `@functools.singledispatch`

Разные реализации функции **в зависимости от типа** первого аргумента:

```python
import functools

@functools.singledispatch
def describe(x):
    return f"Неизвестный тип: {type(x)}"

@describe.register
def _(x: int):
    return f"Целое: {x}"

@describe.register
def _(x: str):
    return f"Строка: {x}"

@describe.register
def _(x: list):
    return f"Список из {len(x)} элементов"

print(describe(42))         # Целое: 42
print(describe("hi"))       # Строка: hi
print(describe([1, 2, 3]))  # Список из 3 элементов
print(describe(3.14))       # Неизвестный тип: <class 'float'>
```

Это «перегрузка по типу» — Python-версия того, что в C++ называется overload.

### `@functools.total_ordering`

Автоматически добавляет все методы сравнения (`<`, `<=`, `>`, `>=`), если реализованы `__eq__` и один из них:

```python
import functools

@functools.total_ordering
class Version:
    def __init__(self, major, minor):
        self.major = major
        self.minor = minor

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

v1 = Version(1, 5)
v2 = Version(2, 0)
print(v1 < v2)     # True
print(v1 <= v2)    # True — сгенерировано автоматически
print(v1 > v2)     # False
```

### `@dataclass` — класс данных

Генерирует `__init__`, `__repr__`, `__eq__` автоматически:

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1)              # Point(x=1, y=2)
print(p1 == p2)        # True
```

С настройками:

```python
@dataclass(frozen=True)     # неизменяемый
class RGB:
    r: int
    g: int
    b: int

@dataclass(order=True)      # сгенерирует <, <=, >, >=
class Version:
    major: int
    minor: int
```

### `@contextlib.contextmanager`

Превращает генератор в контекстный менеджер для `with`:

```python
from contextlib import contextmanager

@contextmanager
def open_file(path):
    print(f"Открываю {path}")
    f = open(path, "w")
    try:
        yield f
    finally:
        print(f"Закрываю {path}")
        f.close()

with open_file("test.txt") as f:
    f.write("Привет")
# Открываю test.txt
# Закрываю test.txt
```

### `@abstractmethod`

Из `abc` — требует реализации в подклассе:

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def sound(self):
        pass

class Dog(Animal):
    def sound(self):
        return "Гав"

# Animal()   # ❌ TypeError — нельзя создать
print(Dog().sound())   # Гав
```

### `@typing.overload`

Для подсказок типов, когда функция возвращает разное в зависимости от аргументов:

```python
from typing import overload

@overload
def parse(x: int) -> int: ...
@overload
def parse(x: str) -> list[str]: ...

def parse(x):
    if isinstance(x, int):
        return x * 2
    return x.split()
```

Это только для IDE/`mypy`, при запуске не влияет.

### `@typing.final` / `@typing.no_type_check`

- `@final` — помечает метод/класс как «нельзя переопределять» (для статических анализаторов)
- `@no_type_check` — отключает проверку типов для функции

### `@warnings.deprecated` (Python 3.13+)

Помечает функцию как устаревшую:

```python
import warnings

@warnings.deprecated("Используйте new_function")
def old_function():
    ...
```

---

## 📋 Полная таблица стандартных декораторов

| Декоратор | Модуль | Что делает |
|---|---|---|
| `@property` | встроенный | Превратить метод в атрибут |
| `@staticmethod` | встроенный | Метод без `self` |
| `@classmethod` | встроенный | Метод с классом вместо `self` |
| `@functools.wraps` | `functools` | Сохранить метаданные в обёртке |
| `@functools.lru_cache` | `functools` | Кэш по аргументам (с ограничением) |
| `@functools.cache` | `functools` (3.9+) | Кэш без ограничения |
| `@functools.cached_property` | `functools` (3.8+) | Кэшируемое свойство |
| `@functools.singledispatch` | `functools` | Перегрузка по типу |
| `@functools.total_ordering` | `functools` | Сгенерировать сравнения |
| `@contextlib.contextmanager` | `contextlib` | Из генератора — контекст |
| `@abc.abstractmethod` | `abc` | Обязательный к реализации метод |
| `@dataclasses.dataclass` | `dataclasses` | Класс данных |
| `@typing.overload` | `typing` | Перегрузка (для IDE) |
| `@typing.final` | `typing` | Запретить переопределение |
| `@typing.no_type_check` | `typing` | Отключить проверку типов |
| `@unittest.mock.patch` | `unittest.mock` | Заменить объект в тесте |
| `@pytest.fixture` | `pytest` | Фикстура для теста |
| `@pytest.mark.parametrize` | `pytest` | Параметризованный тест |
| `@click.command` | `click` | CLI-команда |
| `@app.route` | `flask` | URL-маршрут |

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `@functools.wraps`"
    ```python
    def deco(f):
        def wrapper(*a, **kw):
            return f(*a, **kw)
        return wrapper
    ```
    Без `@functools.wraps(f)` обёртка «теряет» имя, докстроку, аннотации.

!!! warning "Ошибка 2. `wrapper()` без `*args, **kwargs`"
    ```python
    def deco(f):
        def wrapper():       # ❌ не принимает аргументы
            return f()
        return wrapper

    @deco
    def add(a, b): return a + b
    add(1, 2)                # TypeError
    ```
    **Правильно:** `def wrapper(*args, **kwargs): return f(*args, **kwargs)`.

!!! warning "Ошибка 3. Потеря `return` в декораторе"
    ```python
    def deco(f):
        def wrapper(*a, **kw):
            f(*a, **kw)          # ❌ результат теряется
        return wrapper
    ```
    **Правильно:** `return f(*a, **kw)`.

!!! warning "Ошибка 4. Кэш на функциях с побочными эффектами"
    ```python
    @functools.cache
    def get_time():
        return datetime.now()     # ❌ всегда одно и то же время
    ```

!!! warning "Ошибка 5. Кэш с нехешируемыми аргументами"
    ```python
    @functools.lru_cache
    def f(items):        # items — список
        ...
    f([1, 2, 3])         # ❌ TypeError: unhashable type: 'list'
    ```

---

## 🧪 Упражнения

1. ⭐ Напишите декоратор, который печатает «Начало» и «Конец» вокруг вызова.
2. ⭐ Декоратор, считающий время работы функции (`time.time`).
3. ⭐⭐ Декоратор `@repeat(n)`, повторяющий функцию N раз.
4. ⭐⭐ Декоратор `@debug`, печатающий аргументы и результат.
5. ⭐⭐ Примените `@functools.lru_cache` к функции Фибоначчи.
6. ⭐⭐⭐ Сделайте `@property` для класса с валидацией.
7. ⭐⭐⭐ Напишите `@singledispatch` для функции, работающей по-разному с `int`, `str`, `list`.

---

## 🔗 Что дальше

→ Поздравляем! Раздел **«Функции»** пройден. Дальше —
[Файлы и ошибки](../06-files-errors/index.md): работа с файлами и исключения.