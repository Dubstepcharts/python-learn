# Все встроенные функции Python

!!! abstract "Уровень: ⭐ → ⭐⭐⭐ Справочник"
    Эту страницу не нужно читать подряд. Она — **словарь**. Возвращайтесь к
    ней, когда забыли, что делает та или иная функция.

---

## 📖 Что это

В Python есть ~70 функций, доступных **без импорта**. Они называются
**built-in** («встроенные»). Их видно везде — и в скрипте, и в интерактивном
режиме.

Проверить полный список:
```python
import builtins
print(dir(builtins))
```

Ниже — **все** встроенные функции с примерами. Сгруппированы по категориям.

---

## 🧮 Математика и числа

| Функция | Что делает | Пример |
|---|---|---|
| `abs(x)` | Модуль числа | `abs(-5)` → `5` |
| `divmod(a, b)` | Пара (частное, остаток) | `divmod(10, 3)` → `(3, 1)` |
| `pow(a, b, m)` | `a ** b`, при `m` — по модулю | `pow(2, 10)` → `1024` |
| `round(x, n)` | Округление | `round(3.14159, 2)` → `3.14` |
| `sum(iter)` | Сумма | `sum([1, 2, 3])` → `6` |
| `min(iter)` | Минимум | `min([3, 1, 2])` → `1` |
| `max(iter)` | Максимум | `max([3, 1, 2])` → `3` |

```python
print(abs(-7))              # 7
print(divmod(17, 5))        # (3, 2)
print(pow(2, 8))            # 256
print(pow(2, 8, 100))       # 56 (2**8 mod 100)
print(round(3.14159, 3))    # 3.142
print(sum(range(1, 101)))   # 5050
```

---

## 🔢 Преобразование типов

| Функция | Что делает | Пример |
|---|---|---|
| `int(x)` | В целое | `int("42")` → `42` |
| `float(x)` | В дробное | `float("3.14")` → `3.14` |
| `str(x)` | В строку | `str(42)` → `"42"` |
| `bool(x)` | В `True`/`False` | `bool(0)` → `False` |
| `complex(r, i)` | Комплексное | `complex(1, 2)` → `(1+2j)` |
| `list(iter)` | В список | `list("abc")` → `['a','b','c']` |
| `tuple(iter)` | В кортеж | `tuple([1,2])` → `(1,2)` |
| `dict(...)` | В словарь | `dict(a=1)` → `{'a': 1}` |
| `set(iter)` | В множество | `set([1,1,2])` → `{1,2}` |
| `frozenset(iter)` | В `frozenset` | `frozenset([1,2])` |
| `bytes(x)` | В байты | `bytes("hi", "utf-8")` |
| `bytearray(x)` | В `bytearray` | `bytearray(5)` |
| `memoryview(x)` | View на буфер | `memoryview(b"abc")` |

```python
print(int("42"))            # 42
print(int("ff", 16))        # 255
print(float("3.14"))        # 3.14
print(str(42))              # "42"
print(bool([]))             # False
print(list("abc"))          # ['a', 'b', 'c']
print(set([1, 1, 2]))       # {1, 2}
```

---

## 🔤 Строки и символы

| Функция | Что делает | Пример |
|---|---|---|
| `chr(n)` | Код → символ | `chr(65)` → `'A'` |
| `ord(c)` | Символ → код | `ord('A')` → `65` |
| `ascii(x)` | «Безопасное» представление | `ascii('привет')` → `"'\\u043f...'"` |
| `repr(x)` | Строковое представление | `repr("hi")` → `"'hi'"` |
| `format(x, spec)` | Форматирование | `format(3.14, ".1f")` → `"3.1"` |
| `bin(n)` | Двоичная строка | `bin(5)` → `'0b101'` |
| `oct(n)` | Восьмеричная | `oct(8)` → `'0o10'` |
| `hex(n)` | Шестнадцатеричная | `hex(255)` → `'0xff'` |

```python
print(chr(65))              # A
print(ord("Я"))             # 1071
print(hex(255))             # 0xff
print(bin(10))              # 0b1010
print(format(3.14159, ".2f"))  # 3.14
```

---

## 📦 Работа с коллекциями

| Функция | Что делает | Пример |
|---|---|---|
| `len(seq)` | Длина | `len([1,2,3])` → `3` |
| `sorted(iter)` | Новый отсортированный | `sorted([3,1])` → `[1,3]` |
| `reversed(seq)` | Обратный порядок | `list(reversed([1,2,3]))` |
| `enumerate(seq)` | Пары (индекс, элемент) | `list(enumerate("ab"))` |
| `zip(*iters)` | Соединить по позициям | `list(zip([1,2],[3,4]))` |
| `map(f, iters)` | Применить функцию | `list(map(str, [1,2]))` |
| `filter(f, iter)` | Оставить подходящие | `list(filter(bool, [0,1,2]))` |
| `iter(x)` | Получить итератор | `iter([1,2,3])` |
| `next(it, default)` | Следующий элемент | `next(iter([1,2,3]))` → `1` |
| `all(iter)` | Все истинны? | `all([True, True])` → `True` |
| `any(iter)` | Хотя бы один истинный? | `any([False, True])` → `True` |
| `slice(start, stop, step)` | Объект среза | `[1,2,3,4][slice(1,3)]` |
| `range(...)` | Диапазон | `list(range(3))` → `[0,1,2]` |

```python
print(len("привет"))         # 6
print(sorted([3, 1, 2]))     # [1, 2, 3]
print(list(reversed("abc"))) # ['c', 'b', 'a']
print(list(zip("ab", [1,2])))   # [('a', 1), ('b', 2)]
print(list(enumerate("ab")))    # [(0, 'a'), (1, 'b')]
print(list(map(str.upper, "abc")))   # ['A', 'B', 'C']
print(all([True, 1, "x"]))   # True
print(any([0, "", []]))      # False
```

---

## 🧠 Объекты и классы

| Функция | Что делает | Пример |
|---|---|---|
| `type(x)` | Тип объекта | `type(42)` → `<class 'int'>` |
| `isinstance(obj, cls)` | Проверка типа | `isinstance(42, int)` → `True` |
| `issubclass(sub, sup)` | Подкласс? | `issubclass(bool, int)` → `True` |
| `id(x)` | Адрес в памяти | `id(x)` |
| `hash(x)` | Хеш | `hash("abc")` |
| `callable(x)` | Можно ли вызвать | `callable(print)` → `True` |
| `dir(x)` | Атрибуты объекта | `dir([])` |
| `vars(x)` | `__dict__` объекта | `vars(obj)` |
| `hasattr(o, n)` | Есть атрибут? | `hasattr([], "append")` |
| `getattr(o, n, d)` | Получить атрибут | `getattr([], "append")` |
| `setattr(o, n, v)` | Установить атрибут | `setattr(obj, "x", 1)` |
| `delattr(o, n)` | Удалить атрибут | `delattr(obj, "x")` |
| `object()` | Базовый объект | `object()` |
| `super()` | Родительский класс | `super().__init__()` |
| `property(fget, fset, fdel, doc)` | Свойство | см. декораторы |
| `classmethod(f)` | Метод класса | см. декораторы |
| `staticmethod(f)` | Статический метод | см. декораторы |

```python
print(type(42))              # <class 'int'>
print(isinstance(42, int))   # True
print(callable(len))         # True
print(hasattr("hi", "upper"))  # True
print(getattr("hi", "upper")())   # HI
```

---

## 🧑‍💻 Интерактив: ввод-вывод

| Функция | Что делает |
|---|---|
| `print(*objs, sep, end, file, flush)` | Печать |
| `input(prompt)` | Прочитать строку от пользователя |
| `open(file, mode, ...)` | Открыть файл |
| `breakpoint()` | Войти в отладчик `pdb` |
| `help(obj)` | Встроенная справка |

```python
print("a", "b", "c", sep="-", end="!\n")   # a-b-c!
name = input("Имя: ")
```

---

## 🛠️ Выполнение кода

| Функция | Что делает |
|---|---|
| `eval(expr)` | Выполнить **выражение** как код |
| `exec(code)` | Выполнить **блок** кода |
| `compile(src, file, mode)` | Скомпилировать в код-объект |
| `globals()` | Словарь глобальных переменных |
| `locals()` | Словарь локальных переменных |

!!! warning "⚠️ `eval` и `exec` — ОПАСНЫ"
    Если строку передаёт пользователь — он может выполнить **любой** код,
    включая удаление файлов. Никогда не используйте `eval` на «чужом» тексте.
    
    ```python
    eval("2 + 2")           # 4 — безопасно
    eval("__import__('os').system('rm -rf /')")   # КАТАСТРОФА
    ```
    
    В учебном коде — забудьте про `eval`. Используйте `int()`, `float()`,
    `ast.literal_eval` для безопасного разбора.

---

## 📥 Импорт и модули

| Функция | Что делает |
|---|---|
| `__import__(name)` | Импортировать модуль программно (редко нужно) |
| `globals()`, `locals()` | Словари имён |

Обычный `import` — это **оператор**, а не функция.

---

## 🔁 Итераторы и генераторы

| Функция | Что делает |
|---|---|
| `iter(x)` | Итератор из объекта |
| `next(it, default)` | Следующий элемент |
| `aiter(x)` | Асинхронный итератор (3.10+) |
| `anext(it, default)` | Асинхронный next (3.10+) |

```python
it = iter([1, 2, 3])
print(next(it))         # 1
print(next(it))         # 2
print(next(it, "end"))  # 3
print(next(it, "end"))  # "end"
```

---

## 🧩 Прочее

| Функция | Что делает |
|---|---|
| `repr(x)` | «Отладочное» представление |
| `hash(x)` | Хеш |
| `id(x)` | Адрес |
| `callable(x)` | Вызываемый? |
| `format(x, spec)` | Форматирование |
| `slice(...)` | Срез |
| `vars(x)` | `__dict__` |
| `input(...)` | См. ввод-вывод |

---

## ⛔ Встроенные исключения

Все встроенные исключения — тоже часть builtins. Полная иерархия:

```
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── ArithmeticError
    │   ├── FloatingPointError
    │   ├── OverflowError
    │   └── ZeroDivisionError
    ├── AssertionError
    ├── AttributeError
    ├── BufferError
    ├── EOFError
    ├── ImportError
    │   └── ModuleNotFoundError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── MemoryError
    ├── NameError
    │   └── UnboundLocalError
    ├── OSError
    │   ├── BlockingIOError
    │   ├── ChildProcessError
    │   ├── ConnectionError
    │   │   ├── BrokenPipeError
    │   │   ├── ConnectionAbortedError
    │   │   ├── ConnectionRefusedError
    │   │   └── ConnectionResetError
    │   ├── FileExistsError
    │   ├── FileNotFoundError
    │   ├── InterruptedError
    │   ├── IsADirectoryError
    │   ├── NotADirectoryError
    │   ├── PermissionError
    │   ├── ProcessLookupError
    │   └── TimeoutError
    ├── ReferenceError
    ├── RuntimeError
    │   ├── NotImplementedError
    │   └── RecursionError
    ├── StopAsyncIteration
    ├── StopIteration
    ├── SyntaxError
    │   └── IndentationError
    │       └── TabError
    ├── SystemError
    ├── TypeError
    ├── ValueError
    │   └── UnicodeError
    │       ├── UnicodeDecodeError
    │       ├── UnicodeEncodeError
    │       └── UnicodeTranslateError
    └── Warning
        ├── BytesWarning
        ├── DeprecationWarning
        ├── EncodingWarning
        ├── FutureWarning
        ├── ImportWarning
        ├── PendingDeprecationWarning
        ├── ResourceWarning
        ├── RuntimeWarning
        ├── SyntaxWarning
        ├── UnicodeWarning
        └── UserWarning
```

**Что запомнить:**

| Исключение | Когда возникает |
|---|---|
| `SyntaxError` | Синтаксис написан неправильно |
| `IndentationError` | Отступы съехали |
| `NameError` | Переменная не определена |
| `TypeError` | Не тот тип (напр. `"a" + 1`) |
| `ValueError` | Тип верный, значение нет (`int("abc")`) |
| `IndexError` | Индекс за пределами списка |
| `KeyError` | Ключа нет в словаре |
| `AttributeError` | У объекта нет такого метода/атрибута |
| `ZeroDivisionError` | Деление на ноль |
| `ImportError` | Не найден модуль |
| `FileNotFoundError` | Файла нет |
| `StopIteration` | Итератор закончился |
| `RecursionError` | Слишком глубокая рекурсия |
| `KeyboardInterrupt` | Ctrl+C от пользователя |

---

## 📋 Полная алфавитная таблица встроенных функций

| # | Функция | Короткое описание |
|---|---|---|
| 1 | `abs` | Модуль числа |
| 2 | `aiter` | Асинхронный итератор (3.10+) |
| 3 | `all` | Все истинны? |
| 4 | `anext` | Асинхронный next (3.10+) |
| 5 | `any` | Хотя бы один истинный? |
| 6 | `ascii` | ASCII-представление |
| 7 | `bin` | Двоичная строка |
| 8 | `bool` | В `True`/`False` |
| 9 | `breakpoint` | Точка останова для отладки |
| 10 | `bytearray` | Изменяемые байты |
| 11 | `bytes` | Неизменяемые байты |
| 12 | `callable` | Можно ли вызвать? |
| 13 | `chr` | Код → символ |
| 14 | `classmethod` | Декоратор метода класса |
| 15 | `compile` | Компилировать в код-объект |
| 16 | `complex` | Комплексное число |
| 17 | `delattr` | Удалить атрибут |
| 18 | `dict` | Создать словарь |
| 19 | `dir` | Атрибуты объекта |
| 20 | `divmod` | Частное и остаток |
| 21 | `enumerate` | Индексы + элементы |
| 22 | `eval` | Выполнить выражение (⚠️ опасно) |
| 23 | `exec` | Выполнить код (⚠️ опасно) |
| 24 | `filter` | Оставить подходящие |
| 25 | `float` | В дробное |
| 26 | `format` | Форматирование |
| 27 | `frozenset` | Неизменяемое множество |
| 28 | `getattr` | Получить атрибут |
| 29 | `globals` | Глобальные имена |
| 30 | `hasattr` | Есть атрибут? |
| 31 | `hash` | Хеш-значение |
| 32 | `help` | Справка |
| 33 | `hex` | Hex-строка |
| 34 | `id` | Адрес в памяти |
| 35 | `input` | Ввод пользователя |
| 36 | `int` | В целое |
| 37 | `isinstance` | Проверка типа |
| 38 | `issubclass` | Проверка подкласса |
| 39 | `iter` | Итератор |
| 40 | `len` | Длина |
| 41 | `list` | Список |
| 42 | `locals` | Локальные имена |
| 43 | `map` | Применить функцию |
| 44 | `max` | Максимум |
| 45 | `memoryview` | View на буфер |
| 46 | `min` | Минимум |
| 47 | `next` | Следующий элемент |
| 48 | `object` | Базовый объект |
| 49 | `oct` | Восьмеричная строка |
| 50 | `open` | Открыть файл |
| 51 | `ord` | Символ → код |
| 52 | `pow` | Возведение в степень |
| 53 | `print` | Печать |
| 54 | `property` | Свойство |
| 55 | `range` | Диапазон |
| 56 | `repr` | Представление |
| 57 | `reversed` | Обратный порядок |
| 58 | `round` | Округление |
| 59 | `set` | Множество |
| 60 | `setattr` | Установить атрибут |
| 61 | `slice` | Срез |
| 62 | `sorted` | Отсортированная копия |
| 63 | `staticmethod` | Декоратор статического метода |
| 64 | `str` | Строка |
| 65 | `sum` | Сумма |
| 66 | `super` | Родительский класс |
| 67 | `tuple` | Кортеж |
| 68 | `type` | Тип / создать класс |
| 69 | `vars` | `__dict__` |
| 70 | `zip` | Соединить по позициям |
| 71 | `__import__` | Импорт модуля |

Всего — **71** встроенная функция.

---

## ⚠️ Что НЕ входит в builtins

Многие «популярные» функции **не** встроенные — их нужно импортировать:

| Функция | Откуда импортировать |
|---|---|
| `sqrt`, `sin`, `cos`, `pi`, `log` | `math` |
| `random`, `randint`, `choice` | `random` |
| `Counter`, `defaultdict`, `deque`, `namedtuple` | `collections` |
| `reduce`, `lru_cache`, `partial` | `functools` |
| `datetime`, `date`, `timedelta` | `datetime` |
| `json`, `load`, `dump`, `dumps`, `loads` | `json` |
| `re.match`, `re.search`, `re.findall` | `re` |
| `Path` | `pathlib` |
| `sleep` | `time` |

См. раздел [Стандартная библиотека](index.md).

---

## 🧪 Упражнения

1. ⭐ Выведите `abs(-10)`, `divmod(17, 5)`, `hex(255)`.
2. ⭐ Превратите `"42"` в число через `int` и прибавьте 8.
3. ⭐⭐ С `enumerate` выведите нумерованный список любимых книг.
4. ⭐⭐ С `zip` соедините два списка в пары.
5. ⭐⭐ С `filter`+`map` оставьте чётные и возведите их в квадрат.
6. ⭐⭐⭐ С `any`/`all` проверьте, есть ли в списке отрицательные.
7. ⭐⭐⭐ Найдите, что делает `breakpoint()` — попробуйте вызвать и выйти (`q`).

---

## 🔗 Что дальше

→ [Модуль math и random](math-random.md) — то, что часто нужно на практике.