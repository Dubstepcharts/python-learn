# Исключения

!!! abstract "Уровень: ⭐⭐ Средний → ⭐⭐⭐ Продвинутый"
    Подойдёт для 9–11 класса. Нужно знать: [работа с файлами](files.md), [все встроенные функции](../09-stdlib/builtins.md).

---

## 🍎 Объясняем просто

!!! example "Исключение — это «программа упала»"
    Когда Python не может выполнить команду, он **выбрасывает исключение**:
    - `1 / 0` → `ZeroDivisionError`
    - `int("привет")` → `ValueError`
    - `open("нет.txt")` → `FileNotFoundError`

    Мы можем **поймать** такое исключение и сделать что-то другое, вместо того
    чтобы программа «упала». Это и есть `try/except`.

---

## 📖 Простейшая конструкция

```python
try:
    number = int(input("Введи число: "))
    print(f"Квадрат: {number ** 2}")
except ValueError:
    print("Это не число!")
```

- **`try`** — код, который может упасть
- **`except`** — что делать, если упало
- Если упало исключение другого типа — оно **не ловится**, программа падает, как без `try`

---

## 🎯 Все формы `try`

### `try` / `except`

```python
try:
    risky_operation()
except SomeError:
    handle_it()
```

### Несколько разных `except`

```python
try:
    x = int(input())
    y = 100 / x
except ValueError:
    print("Не число")
except ZeroDivisionError:
    print("На ноль делить нельзя")
```

Порядок важен: Python идёт сверху вниз и берёт **первый** подходящий.

### Один `except` на несколько исключений

```python
try:
    ...
except (ValueError, TypeError, KeyError) as e:
    print(f"Что-то пошло не так: {e}")
```

### `else` — если исключения НЕ было

```python
try:
    x = int(input())
except ValueError:
    print("Не число")
else:
    print(f"Введено: {x}")     # выполнится только если ошибки не было
```

### `finally` — выполняется **всегда**

```python
try:
    f = open("file.txt")
    data = f.read()
except FileNotFoundError:
    print("Файла нет")
finally:
    f.close()      # ← выполнится в любом случае
```

`finally` полезен для освобождения ресурсов, закрытия файлов и т.п. (хотя для файлов лучше `with`).

### Всё вместе

```python
try:
    x = int(input("Число: "))
    result = 10 / x
except ValueError:
    print("Это не число")
except ZeroDivisionError:
    print("На ноль нельзя")
else:
    print(f"Результат: {result}")
finally:
    print("Программа завершается")
```

Порядок выполнения:
1. `try` — попытка
2. Если ошибка — подходящий `except`
3. Если ошибки не было — `else`
4. В любом случае — `finally`

---

## 🎯 Ловля всех исключений

```python
try:
    risky()
except Exception as e:
    print(f"Поймали: {type(e).__name__}: {e}")
```

!!! warning "Не ловите всё подряд!"
    ```python
    try:
        ...
    except:      # ❌ ловит ВСЁ, включая Ctrl+C и системные
        pass
    ```
    
    Плохие последствия:
    - Программа молча «проглатывает» баги
    - `KeyboardInterrupt` (Ctrl+C) не работает
    - Отладка превращается в ад
    
    **Правильно:**
    ```python
    except Exception as e:        # ловим только «обычные» ошибки
        print(e)
    ```
    или ещё лучше — **конкретные типы**.

---

## 🎯 Все встроенные исключения

Полный список — в [справочнике встроенных функций](../09-stdlib/builtins.md#-встроенные-исключения).

**Самые частые:**

| Исключение | Когда |
|---|---|
| `SyntaxError` | Ошибка синтаксиса (до запуска) |
| `IndentationError` | Проблема с отступами |
| `NameError` | Переменная не определена |
| `TypeError` | Неверный тип (`"a" + 1`) |
| `ValueError` | Тип верный, значение нет (`int("abc")`) |
| `IndexError` | Индекс вне диапазона |
| `KeyError` | Ключа нет в словаре |
| `AttributeError` | Нет такого метода/атрибута |
| `ZeroDivisionError` | Деление на ноль |
| `FileNotFoundError` | Файл не найден |
| `PermissionError` | Нет прав |
| `ImportError` / `ModuleNotFoundError` | Модуль не найден |
| `StopIteration` | Итератор исчерпан |
| `RecursionError` | Слишком глубокая рекурсия |
| `KeyboardInterrupt` | Ctrl+C |

---

## 📖 Объект исключения

Пойманное исключение — это **объект**. У него есть:

```python
try:
    int("привет")
except ValueError as e:
    print(type(e).__name__)   # ValueError
    print(e)                  # invalid literal for int() with base 10: 'привет'
    print(e.args)             # ("invalid literal ...",)
```

`as e` даёт доступ к объекту. Имя `e` — не магия, но общепринято.

---

## 📖 Как «бросить» исключение самому

```python
def divide(a, b):
    if b == 0:
        raise ValueError("На ноль делить нельзя!")
    return a / b

divide(10, 0)
# ValueError: На ноль делить нельзя!
```

`raise SomeError("сообщение")` — «выбросить» исключение.

### Перебросить пойманное

```python
try:
    ...
except ValueError:
    print("Логируем ошибку")
    raise        # пробрасывает исключение дальше
```

### `raise ... from ...` — цепочка

```python
try:
    x = int("abc")
except ValueError as e:
    raise RuntimeError("Ошибка разбора") from e
```

В трейсе будет видно и исходную ошибку, и новую.

---

## 📖 Свои исключения

Создать своё исключение — просто унаследоваться от `Exception`:

```python
class MyError(Exception):
    pass

def check(x):
    if x < 0:
        raise MyError("Отрицательное число!")

try:
    check(-1)
except MyError as e:
    print(e)
```

### С дополнительными полями

```python
class ValidationError(Exception):
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

try:
    raise ValidationError("age", "должен быть >= 0")
except ValidationError as e:
    print(e.field)      # age
    print(e.message)    # должен быть >= 0
```

!!! tip "Иерархия своих исключений"
    ```python
    class AppError(Exception): pass
    class InputError(AppError): pass
    class NetworkError(AppError): pass
    ```
    Тогда можно ловить и **все** ошибки приложения (`except AppError`),
    и конкретную (`except InputError`).

---

## 📌 `assert` — быстрая проверка

```python
def divide(a, b):
    assert b != 0, "b не может быть нулём"
    return a / b
```

Если условие False — `AssertionError`. Используется при отладке и в тестах. **Не** для проверки пользовательских данных (потому что `assert` можно отключить флагом `-O`).

---

## 📌 `warnings` — предупреждения

Не исключение, но близко. В отличие от ошибок, **не останавливают** программу:

```python
import warnings

warnings.warn("Эту функцию лучше не использовать", DeprecationWarning)

# Своя категория
class MyWarning(UserWarning): pass
warnings.warn("Моё предупреждение", MyWarning)
```

Виды: `DeprecationWarning`, `UserWarning`, `RuntimeWarning`, `FutureWarning`, `SyntaxWarning`, `ResourceWarning`, `ImportWarning` и др.

---

## 💡 Примеры

### Пример 1. Калькулятор с защитой 🧮

```python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Деление на ноль"
    except TypeError:
        return "Нужны числа"

print(safe_divide(10, 2))     # 5.0
print(safe_divide(10, 0))     # Деление на ноль
print(safe_divide("a", 2))    # Нужны числа
```

### Пример 2. Безопасный ввод 🔁

```python
def read_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Нужно целое число, попробуйте снова")

age = read_int("Возраст: ")
print(f"В следующем году: {age + 1}")
```

### Пример 3. Сюжетный — банкомат 🏦

```python
class InsufficientFunds(Exception):
    pass

class ATM:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFunds(f"Не хватает {amount - self.balance} руб.")
        self.balance -= amount
        return self.balance

atm = ATM(1000)
try:
    atm.withdraw(1500)
except InsufficientFunds as e:
    print(f"Ошибка: {e}")
```

### Пример 4. Чтение файла с проверкой 📂

```python
def read_lines(path):
    try:
        with open(path, encoding="utf-8") as f:
            return f.readlines()
    except FileNotFoundError:
        print(f"Файл {path} не найден")
        return []
    except PermissionError:
        print(f"Нет прав на чтение {path}")
        return []

lines = read_lines("missing.txt")
```

### Пример 5. `finally` для уборки 🧹

```python
lock = False

def critical_section():
    global lock
    lock = True
    try:
        print("Работаем внутри критической секции")
        raise RuntimeError("Что-то сломалось")
    finally:
        lock = False
        print("Освободили ресурс")
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `except` без типа"
    ```python
    try:
        ...
    except:      # ❌ плохо
        pass
    ```
    Ловит даже `KeyboardInterrupt` и системные ошибки.

!!! warning "Ошибка 2. Ловить и молчать"
    ```python
    try:
        risky()
    except Exception:
        pass       # ❌ ошибка исчезла бесследно, отладка невозможна
    ```
    Хотя бы `print(e)`.

!!! warning "Ошибка 3. Слишком широкий `try`"
    ```python
    try:
        x = int(input())
        y = compute(x)
        z = save(y)
        log(z)
    except Exception:
        ...
    ```
    Непонятно, **что именно** упало. Лучше оборачивать **только** опасную строку.

!!! warning "Ошибка 4. `except` в неправильном порядке"
    ```python
    try:
        ...
    except Exception:           # перехватит первым
        ...
    except ValueError:          # уже никогда не выполнится
        ...
    ```
    Идите от **конкретных** к **общим**.

!!! warning "Ошибка 5. `raise` без аргумента вне `except`"
    ```python
    raise        # ❌ вне блока except — бессмысленно
    ```

---

## 🧪 Упражнения

1. ⭐ Спросите число, поймайте `ValueError`.
2. ⭐ Спросите два числа, поделите одно на другое с проверкой `ZeroDivisionError`.
3. ⭐⭐ Функция `safe_int(s, default=0)` — возвращает число или `default`.
4. ⭐⭐ Чтение файла с обработкой `FileNotFoundError`.
5. ⭐⭐ Своё исключение `TooYoungError` для проверки возраста.
6. ⭐⭐⭐ «Банкомат» с классами исключений `InsufficientFunds`, `WrongPin`.
7. ⭐⭐⭐ Напишите цикл, который повторяет ввод, пока пользователь не введёт корректное число, с максимальным количеством попыток.

---

## 🔗 Что дальше

→ Поздравляем! Раздел **«Файлы и ошибки»** пройден. Дальше —
[Модули и пакеты](../07-modules/index.md).