# Магические методы (dunder)

!!! abstract "Уровень: ⭐⭐⭐ Продвинутый"
    Подойдёт для 10–11 класса. Нужно знать: [классы](classes.md), [полиморфизм](polymorphism.md).

---

## 🍎 Объясняем просто

!!! example "Магические методы — «встроенные реакции» объекта"
    Когда ты пишешь `len(x)`, `x + y`, `print(x)`, `for i in x` — Python
    **на самом деле** вызывает специальные методы объекта:
    - `len(x)` → `x.__len__()`
    - `x + y` → `x.__add__(y)`
    - `print(x)` → `x.__str__()`
    - `for i in x` → `x.__iter__()`

    Их называют **магическими** (или **dunder** — **d**ouble **under**score,
    двойное подчёркивание). Реализуя их в своём классе, ты встраиваешь его
    в «родную» логику Python.

---

## 📖 Общее правило

- Имена: `__название__` (два подчёркивания с обеих сторон)
- В большинстве случаев **не вызывайте их напрямую** — используйте синтаксис:
  - `len(x)`, не `x.__len__()`
  - `x + y`, не `x.__add__(y)`
- Исключения: `__init__`, `__new__`, `super()` — вызывают явно

---

## 🏗️ 1. Жизненный цикл объекта

| Метод | Когда вызывается | Использование |
|---|---|---|
| `__new__(cls, ...)` | До `__init__`, создаёт объект | Метаклассы, `singleton` |
| `__init__(self, ...)` | Инициализация | Установка атрибутов |
| `__del__(self)` | При удалении объекта | Закрытие ресурсов (⚠️ ненадёжно) |

```python
class Singleton:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Singleton()
b = Singleton()
print(a is b)         # True
```

---

## 🔤 2. Строковые представления

| Метод | Что вызывает | Назначение |
|---|---|---|
| `__str__(self)` | `str(x)`, `print(x)`, `f"{x}"` | «Читаемый» вид для людей |
| `__repr__(self)` | `repr(x)`, вывод в консоли | «Отладочный» вид для разработчика |
| `__format__(self, spec)` | `format(x, spec)`, `f"{x:spec}"` | Своё форматирование |
| `__bytes__(self)` | `bytes(x)` | Байтовое представление |

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Точка ({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(1, 2)
print(p)             # Точка (1, 2)
print(repr(p))       # Point(1, 2)
print([p])           # [Point(1, 2)] — в списке использует __repr__
```

!!! info "Подробнее: `__str__` vs `__repr__` 🔬"
    - **`__str__`** — «для пользователя». Что-то понятное.
    - **`__repr__`** — «для отладки». Идеально: `eval(repr(x)) == x`.
    
    Если `__str__` не определён — Python возьмёт `__repr__`. Наоборот — нет.

---

## ⚖️ 3. Сравнение

| Метод | Оператор |
|---|---|
| `__eq__(self, other)` | `==` |
| `__ne__(self, other)` | `!=` |
| `__lt__(self, other)` | `<` |
| `__le__(self, other)` | `<=` |
| `__gt__(self, other)` | `>` |
| `__ge__(self, other)` | `>=` |
| `__hash__(self)` | `hash(x)` |

```python
class Version:
    def __init__(self, major, minor):
        self.major, self.minor = major, minor

    def __eq__(self, other):
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other):
        return (self.major, self.minor) < (other.major, other.minor)

    def __hash__(self):
        return hash((self.major, self.minor))

v1 = Version(1, 2)
v2 = Version(1, 3)
print(v1 == v2)      # False
print(v1 < v2)       # True
```

!!! tip "`@functools.total_ordering`"
    Реализуйте `__eq__` и один из `__lt__`/`__le__`/`__gt__`/`__ge__` —
    декоратор сгенерирует остальные.

---

## ➕ 4. Арифметические операторы

| Метод | Оператор | Метод | Оператор |
|---|---|---|---|
| `__add__` | `+` | `__radd__` | `+` (справа) |
| `__sub__` | `-` | `__rsub__` | `-` (справа) |
| `__mul__` | `*` | `__rmul__` | `*` (справа) |
| `__truediv__` | `/` | `__rtruediv__` | `/` (справа) |
| `__floordiv__` | `//` | `__rfloordiv__` | `//` (справа) |
| `__mod__` | `%` | `__rmod__` | `%` (справа) |
| `__pow__` | `**` | `__rpow__` | `**` (справа) |
| `__matmul__` | `@` | `__rmatmul__` | `@` (справа) |
| `__divmod__` | `divmod(a, b)` | `__rdivmod__` | — |

### In-place версии

| Метод | Оператор |
|---|---|
| `__iadd__` | `+=` |
| `__isub__` | `-=` |
| `__imul__` | `*=` |
| `__itruediv__` | `/=` |
| `__ifloordiv__` | `//=` |
| `__imod__` | `%=` |
| `__ipow__` | `**=` |
| `__imatmul__` | `@=` |

### Унарные

| Метод | Оператор |
|---|---|
| `__neg__` | `-x` |
| `__pos__` | `+x` |
| `__abs__` | `abs(x)` |
| `__invert__` | `~x` |

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, k):        # умножение на число
        return Vector(self.x * k, self.y * k)

    def __rmul__(self, k):       # k * vector
        return self.__mul__(k)

    def __neg__(self):
        return Vector(-self.x, -self.y)

    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def __str__(self):
        return f"({self.x}, {self.y})"

v = Vector(1, 2)
print(v + Vector(3, 4))    # (4, 6)
print(v * 3)               # (3, 6)
print(3 * v)               # (3, 6)
print(-v)                  # (-1, -2)
print(abs(Vector(3, 4)))   # 5.0
```

!!! info "Подробнее: зачем `__r*__` 🔬"
    `__radd__` вызывается, если левый операнд «не умеет» сложение:
    ```python
    v * 3      # Vector.__mul__(v, 3)
    3 * v      # int.__mul__(3, v) → NotImplemented → Vector.__rmul__(v, 3)
    ```

---

## 🔢 5. Битовые операторы

| Метод | Оператор | Метод | Оператор |
|---|---|---|---|
| `__and__` | `&` | `__rand__` | `&` |
| `__or__` | `\|` | `__ror__` | `\|` |
| `__xor__` | `^` | `__rxor__` | `^` |
| `__lshift__` | `<<` | `__rlshift__` | `<<` |
| `__rshift__` | `>>` | `__rrshift__` | `>>` |
| `__iand__` | `&=` | `__ior__` | `\|=` |
| `__ixor__` | `^=` | `__ilshift__` | `<<=` |
| `__irshift__` | `>>=` | — | — |

---

## 📦 6. Контейнеры

| Метод | Что вызывает |
|---|---|
| `__len__(self)` | `len(x)` |
| `__getitem__(self, k)` | `x[k]` |
| `__setitem__(self, k, v)` | `x[k] = v` |
| `__delitem__(self, k)` | `del x[k]` |
| `__contains__(self, v)` | `v in x` |
| `__iter__(self)` | `for i in x` |
| `__reversed__(self)` | `reversed(x)` |
| `__missing__(self, k)` | Словарь — нет ключа (только для `dict`) |

```python
class MyList:
    def __init__(self, data):
        self.data = list(data)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, i):
        return self.data[i]

    def __setitem__(self, i, v):
        self.data[i] = v

    def __contains__(self, v):
        return v in self.data

    def __iter__(self):
        return iter(self.data)

    def __str__(self):
        return str(self.data)

m = MyList([1, 2, 3])
print(len(m))            # 3
print(m[1])              # 2
m[0] = 99
print(2 in m)            # True
for x in m:
    print(x)
```

---

## 🔢 7. Числовые преобразования

| Метод | Что вызывает |
|---|---|
| `__int__(self)` | `int(x)` |
| `__float__(self)` | `float(x)` |
| `__complex__(self)` | `complex(x)` |
| `__index__(self)` | Использование в срезах, `bin`, `hex`, `oct` |
| `__round__(self, n)` | `round(x, n)` |
| `__trunc__(self)` | `math.trunc(x)` |
| `__floor__(self)` | `math.floor(x)` |
| `__ceil__(self)` | `math.ceil(x)` |

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __int__(self):
        return int(self.celsius)

    def __float__(self):
        return float(self.celsius)

    def __round__(self, n=0):
        return round(self.celsius, n)

t = Temperature(36.6)
print(int(t))         # 36
print(float(t))       # 36.6
print(round(t, 1))    # 36.6
```

---

## 📞 8. Вызов, атрибуты, дескрипторы

| Метод | Назначение |
|---|---|
| `__call__(self, ...)` | Сделать объект «вызываемым» — `obj()` |
| `__getattr__(self, name)` | Нет обычного атрибута — вызвать этот |
| `__setattr__(self, name, v)` | При `obj.x = v` |
| `__delattr__(self, name)` | При `del obj.x` |
| `__getattribute__(self, name)` | При **любом** доступе (опасно) |
| `__dir__(self)` | Список атрибутов — `dir(obj)` |
| `__get__(self, obj, cls)` | Дескриптор: получение |
| `__set__(self, obj, val)` | Дескриптор: запись |
| `__delete__(self, obj)` | Дескриптор: удаление |
| `__set_name__(self, owner, name)` | При создании класса |

```python
class CallCounter:
    def __init__(self):
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Вызов #{self.count}")

c = CallCounter()
c()
c()
```

!!! warning "`__getattr__` vs `__getattribute__`"
    - `__getattr__` вызывается **только если** обычный поиск провалился
    - `__getattribute__` — **при каждом** обращении. Использовать осторожно —
    можно «сломать» объект.

```python
class Proxy:
    def __init__(self, target):
        self._target = target

    def __getattr__(self, name):
        # Перенаправляет неизвестные атрибуты к _target
        return getattr(self._target, name)

p = Proxy("привет")
print(p.upper())    # ПРИВЕТ
```

---

## 🎭 9. Менеджер контекста (`with`)

| Метод | Назначение |
|---|---|
| `__enter__(self)` | Вход в `with` |
| `__exit__(self, exc_type, exc, tb)` | Выход из `with` |

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self

    def __exit__(self, *args):
        import time
        elapsed = time.time() - self.start
        print(f"Заняло {elapsed:.3f} сек")

with Timer():
    sum(range(1_000_000))
```

`__exit__` может вернуть `True`, чтобы **проглотить** исключение.

---

## 🔁 10. Итераторы и генераторы

| Метод | Назначение |
|---|---|
| `__iter__(self)` | Возвращает итератор |
| `__next__(self)` | Следующий элемент |
| `__aiter__(self)` | Асинхронный итератор |
| `__anext__(self)` | Асинхронный next |
| `__await__(self)` | Объект можно `await` |
| `__aenter__`, `__aexit__` | Асинхронный `with` |

```python
class CountUp:
    def __init__(self, n):
        self.n = n
        self.i = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.i >= self.n:
            raise StopIteration
        self.i += 1
        return self.i

for x in CountUp(5):
    print(x)
```

---

## 🧩 11. Прочее

| Метод | Назначение |
|---|---|
| `__bool__(self)` | `bool(x)`, `if x:` |
| `__sizeof__(self)` | `sys.getsizeof(x)` |
| `__reduce__(self)` | Для `pickle` |
| `__reduce_ex__(self, protocol)` | То же с протоколом |
| `__getstate__(self)`, `__setstate__(self, state)` | Для pickle |
| `__copy__(self)` | `copy.copy(x)` |
| `__deepcopy__(self, memo)` | `copy.deepcopy(x)` |
| `__getnewargs__(self)` | Для pickle |
| `__fspath__(self)` | `open(obj)`, `os.fspath(obj)` |
| `__class_getitem__(cls, item)` | `MyClass[int]` |
| `__init_subclass__(cls, ...)` | При создании подкласса |
| `__prepare__(cls, name, bases)` | Метаклассы |
| `__instancecheck__(cls, obj)` | `isinstance(obj, cls)` |
| `__subclasscheck__(cls, sub)` | `issubclass(sub, cls)` |

```python
class FalsyList:
    def __init__(self, items):
        self.items = items

    def __len__(self):
        return len(self.items)

    def __bool__(self):
        # Пусть «истина», если длина > 2
        return len(self.items) > 2

print(bool(FalsyList([1])))         # False
print(bool(FalsyList([1, 2, 3])))   # True
```

```python
from pathlib import Path

class MyPath:
    def __init__(self, p):
        self.p = p

    def __fspath__(self):
        return str(self.p)

with open(MyPath("test.txt"), "w") as f:   # работает!
    f.write("hi")
```

---

## 📋 Полная сводная таблица

| Категория | Методы |
|---|---|
| Создание/удаление | `__new__`, `__init__`, `__del__` |
| Строки | `__str__`, `__repr__`, `__format__`, `__bytes__` |
| Сравнение | `__eq__`, `__ne__`, `__lt__`, `__le__`, `__gt__`, `__ge__`, `__hash__` |
| Арифметика | `__add__`, `__sub__`, `__mul__`, `__truediv__`, `__floordiv__`, `__mod__`, `__pow__`, `__matmul__`, `__divmod__` |
| Арифметика (r) | `__radd__`, `__rsub__`, `__rmul__`, `__rtruediv__`, `__rfloordiv__`, `__rmod__`, `__rpow__`, `__rmatmul__`, `__rdivmod__` |
| Арифметика (in-place) | `__iadd__`, `__isub__`, `__imul__`, `__itruediv__`, `__ifloordiv__`, `__imod__`, `__ipow__`, `__imatmul__` |
| Унарные | `__neg__`, `__pos__`, `__abs__`, `__invert__` |
| Битовые | `__and__`, `__or__`, `__xor__`, `__lshift__`, `__rshift__` |
| Битовые (r) | `__rand__`, `__ror__`, `__rxor__`, `__rlshift__`, `__rrshift__` |
| Битовые (i) | `__iand__`, `__ior__`, `__ixor__`, `__ilshift__`, `__irshift__` |
| Контейнер | `__len__`, `__getitem__`, `__setitem__`, `__delitem__`, `__contains__`, `__iter__`, `__reversed__`, `__missing__` |
| Числа | `__int__`, `__float__`, `__complex__`, `__index__`, `__round__`, `__trunc__`, `__floor__`, `__ceil__` |
| Вызов/атрибуты | `__call__`, `__getattr__`, `__setattr__`, `__delattr__`, `__getattribute__`, `__dir__` |
| Дескрипторы | `__get__`, `__set__`, `__delete__`, `__set_name__` |
| Контекст | `__enter__`, `__exit__` |
| Async | `__aiter__`, `__anext__`, `__await__`, `__aenter__`, `__aexit__` |
| Итераторы | `__iter__`, `__next__` |
| Логика | `__bool__` |
| Pickle | `__reduce__`, `__reduce_ex__`, `__getstate__`, `__setstate__`, `__getnewargs__` |
| Копирование | `__copy__`, `__deepcopy__` |
| Метаклассы | `__init_subclass__`, `__class_getitem__`, `__prepare__`, `__instancecheck__`, `__subclasscheck__` |
| Прочее | `__sizeof__`, `__fspath__` |

---

## 💡 Полный пример — класс «дробь» 🧮

```python
class Fraction:
    def __init__(self, num, den):
        if den == 0:
            raise ZeroDivisionError
        g = self._gcd(abs(num), abs(den))
        self.num = num // g
        self.den = den // g

    @staticmethod
    def _gcd(a, b):
        while b:
            a, b = b, a % b
        return a

    def __add__(self, other):
        n = self.num * other.den + other.num * self.den
        d = self.den * other.den
        return Fraction(n, d)

    def __sub__(self, other):
        n = self.num * other.den - other.num * self.den
        d = self.den * other.den
        return Fraction(n, d)

    def __mul__(self, other):
        return Fraction(self.num * other.num, self.den * other.den)

    def __truediv__(self, other):
        return Fraction(self.num * other.den, self.den * other.num)

    def __eq__(self, other):
        return self.num * other.den == other.num * self.den

    def __lt__(self, other):
        return self.num * other.den < other.num * self.den

    def __str__(self):
        return f"{self.num}/{self.den}"

    def __repr__(self):
        return f"Fraction({self.num}, {self.den})"

a = Fraction(1, 2)
b = Fraction(1, 3)
print(a + b)         # 5/6
print(a - b)         # 1/6
print(a * b)         # 1/6
print(a / b)         # 3/2
print(a == Fraction(2, 4))   # True
print(a > b)         # True
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Вызов dunder-методов напрямую"
    ```python
    x.__len__()      # работает, но так не принято
    len(x)           # ✅
    ```

!!! warning "Ошибка 2. Забыли `__hash__` при `__eq__`"
    ```python
    class A:
        def __eq__(self, other): ...
        # __hash__ становится None!
    ```
    Объекты перестанут работать в `set`/`dict`. Либо определите `__hash__`,
    либо сделайте объект неизменяемым.

!!! warning "Ошибка 3. `__repr__` повторяет `__str__`"
    ```python
    def __repr__(self):
        return f"Объект {self.name}"     # это для людей, не для отладки
    ```
    `__repr__` должен показывать, **как создать** такой объект.

!!! warning "Ошибка 4. Слишком много магии"
    Чем больше dunder-методов, тем сложнее объект. Реализуйте только те,
    что действительно нужны.

!!! warning "Ошибка 5. Изменение `__getattribute__` без нужды"
    Легко «сломать» объект. Используйте `__getattr__` — он безопаснее.

---

## 🧪 Упражнения

1. ⭐ Класс `Money` с `__add__`, `__sub__`, `__str__`, `__eq__`.
2. ⭐ `Vector2D` с `__add__`, `__mul__`, `__abs__`, `__repr__`.
3. ⭐⭐ Класс-контейнер `MyList` с `__len__`, `__getitem__`, `__iter__`.
4. ⭐⭐ `@contextmanager` для измерения времени через `__enter__`/`__exit__`.
5. ⭐⭐ Класс `Polynomial` (многочлен) с `__call__`, `__add__`, `__str__`.
6. ⭐⭐⭐ `Fraction` — полная арифметика, сравнение, хеш.
7. ⭐⭐⭐ Класс `Matrix` с `__matmul__` (умножение матриц), `__add__`, `__getitem__`.

---

## 🔗 Что дальше

→ Поздравляем! Раздел **«ООП»** пройден. Дальше —
[Стандартная библиотека](../09-stdlib/index.md), а затем — **библиотеки** (Turtle, PyQt5, pandas, Kivy).