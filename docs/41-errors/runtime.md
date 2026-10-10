# Ошибки во время работы

Программа запустилась — и **упала**. Эти ошибки невидимы заранее, они
возникают, когда код уже выполняется.

---

## ❌ `ValueError: invalid literal for int() with base 10: 'привет'`

**Что видишь:**

```
ValueError: invalid literal for int() with base 10: 'привет'
```

**Почему:** пытаетесь превратить в число строку, которая **не является
числом**.

```python
age = int("привет")            # ❌
```

**Частая причина:** `int(input(...))` — пользователь ввёл не число.

```python
age = int(input("Возраст: "))   # пользователь ввёл "двенадцать"
```

**Как исправить:**

```python
try:
    age = int(input("Возраст: "))
except ValueError:
    print("Нужно ввести число!")
```

Или безопасный ввод в цикле:

```python
def read_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Это не число, попробуйте ещё раз")

age = read_int("Возраст: ")
```

**Родственные ошибки:**

- `invalid literal for int() with base 10: '3.14'` — `int("3.14")` не
  работает. Нужно `float("3.14")` или `int(float("3.14"))`.
- `could not convert string to float: 'abc'` — то же с `float`.

---

## ❌ `TypeError: unsupported operand type(s) for +: 'int' and 'str'`

**Что видишь:**

```
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

**Почему:** складываете число и строку.

```python
age = 12
print("Мне " + age + " лет")   # ❌
```

**Как исправить:**

```python
# Вариант 1: превратить число в строку
print("Мне " + str(age) + " лет")

# Вариант 2: f-строка (лучше!)
print(f"Мне {age} лет")

# Вариант 3: запятые в print
print("Мне", age, "лет")
```

**Родственные:**

- `can only concatenate str (not "int") to str` — то же.
- `unsupported operand type(s) for +: 'str' and 'int'` — наоборот.

---

## ❌ `TypeError: can only concatenate str (not "int") to str`

Полная формулировка:

```
TypeError: can only concatenate str (not "int") to str
```

Значит: `"abc" + 5` — нельзя. Проверьте, что у вас строка + строка или
число + число.

---

## ❌ `TypeError: 'int' object is not callable`

**Что видишь:**

```
TypeError: 'int' object is not callable
```

**Почему:** вызвали **скобками** не функцию, а число/строку/что-то другое.

```python
x = 5
print(x())              # ❌ x — это число, не функция
```

**Частая причина:** переопределили встроенную функцию.

```python
list = [1, 2, 3]        # ❌ теперь list — список, а не тип
list("abc")              # TypeError
```

**Как исправить:** не называйте переменные так же, как встроенные функции
(`list`, `str`, `int`, `sum`, `max`, `print`). Перезапустите Python, если
уже переопределили.

---

## ❌ `NameError: name 'x' is not defined`

**Что видишь:**

```
NameError: name 'x' is not defined
```

**Почему:** используете переменную, которая **не была создана**.

```python
print(score)             # ❌
score = 10
```

**Как исправить:**

1. Проверьте, создана ли переменная **до** использования.
2. Проверьте **опечатку**: `age` vs `ages` vs `Age`.
3. Проверьте **регистр**: `Name` и `name` — разные.

**Родственные:**

- `name 'np' is not defined` — забыли `import numpy as np`.
- `name 'true' is not defined` — Python пишет `True` с большой буквы.

---

## ❌ `NameError: name 'привет' is not defined`

**Что видишь:** та же ошибка, но с русским словом.

**Почему:** забыли кавычки у строки.

```python
print(Привет)            # ❌
print("Привет")           # ✅
```

---

## ❌ `IndexError: list index out of range`

**Что видишь:**

```
IndexError: list index out of range
```

**Почему:** обращаетесь к элементу списка по индексу, которого **нет**.

```python
lst = [1, 2, 3]
print(lst[5])             # ❌ индекс 5 не существует
```

Индексы идут **от 0 до len-1**.

**Как исправить:**

```python
lst = [1, 2, 3]
if len(lst) > 5:
    print(lst[5])
else:
    print("Индекса 5 нет")
```

**Частая причина:** цикл `for i in range(1, len(lst))` вместо
`range(len(lst))` — и потом `lst[i]` за границей.

---

## ❌ `KeyError: 'name'`

**Что видишь:**

```
KeyError: 'name'
```

**Почему:** в словаре нет такого ключа.

```python
user = {"age": 12}
print(user["name"])        # ❌ ключа "name" нет
```

**Как исправить:**

```python
# Вариант 1: проверить наличие
if "name" in user:
    print(user["name"])

# Вариант 2: get() с дефолтом
print(user.get("name", "не указано"))

# Вариант 3: setdefault
name = user.setdefault("name", "Аня")
```

---

## ❌ `AttributeError: 'str' object has no attribute 'append'`

**Что видишь:**

```
AttributeError: 'str' object has no attribute 'append'
```

**Почему:** у строки **нет** метода `append` — он есть только у списков.

```python
s = "привет"
s.append("!")              # ❌
```

**Как исправить:**

```python
s = "привет"
s = s + "!"                 # ✅ конкатенация
s += "!"                     # ✅ то же

# или работайте со списком
lst = list("привет")
lst.append("!")
s = "".join(lst)
```

**Другие варианты этой ошибки:**

- `'NoneType' object has no attribute ...` — функция ничего не вернула
  (нет `return`), а вы работаете с результатом.
- `'int' object has no attribute 'upper'` — числа не имеют строковых
  методов.

---

## ❌ `AttributeError: 'NoneType' object has no attribute 'X'`

**Что видишь:**

```
AttributeError: 'NoneType' object has no attribute 'text'
```

**Почему:** переменная **равна `None`**, а вы пытаетесь вызвать метод.

```python
result = some_function()   # забыли return → вернулось None
print(result.text)          # ❌
```

**Как найти:** проверьте, что функция, которая создаёт объект, **делает
`return`**.

```python
# ❌
def greet():
    print("Привет")

x = greet()                # x = None
print(x.upper())            # ❌

# ✅
def greet():
    return "Привет"

x = greet()
print(x.upper())            # ✅ ПРИВЕТ
```

---

## ❌ `ZeroDivisionError: division by zero`

**Что видишь:**

```
ZeroDivisionError: division by zero
```

**Почему:** делите на ноль.

```python
x = 10
y = 0
print(x / y)               # ❌
```

**Как исправить:**

```python
if y != 0:
    print(x / y)
else:
    print("На ноль делить нельзя")
```

**Частая причина:** `b` введено пользователем как 0.

---

## ❌ `UnboundLocalError: local variable 'x' referenced before assignment`

**Что видишь:**

```
UnboundLocalError: local variable 'x' referenced before assignment
```

**Почему:** в функции вы **читаете** переменную **до** того, как
присвоили ей значение. Python думает, что она локальная (раз есть `x = ...`
где-то в функции), но в момент чтения — ещё не создана.

```python
x = 5

def f():
    print(x)       # ❌ читаем ДО присваивания
    x = 10          # а вот присваивание

f()
```

**Как исправить:**

**Вариант 1.** Если хотите **изменить глобальную** — используйте `global`:

```python
x = 5

def f():
    global x
    print(x)
    x = 10
```

**Вариант 2.** Не смешивайте чтение и присваивание. Присваивайте вначале:

```python
def f():
    x = 10
    print(x)
```

---

## ❌ `RecursionError: maximum recursion depth exceeded`

**Что видишь:**

```
RecursionError: maximum recursion depth exceeded
```

**Почему:** рекурсивная функция **не останавливается**.

```python
def countdown(n):
    print(n)
    countdown(n - 1)      # ❌ нет базового случая
```

**Как исправить:** добавьте **базовый случай** — условие выхода.

```python
def countdown(n):
    if n <= 0:
        return
    print(n)
    countdown(n - 1)
```

**Частая причина:** забыли, что при `n = 0` или отрицательном нужно
остановиться.

---

## ❌ `UnicodeDecodeError: 'utf-8' codec can't decode byte ...`

**Что видишь:**

```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xcf in position 0
```

**Почему:** файл сохранён в кодировке, отличной от UTF-8 (например,
Windows-1251).

**Как исправить:**

```python
with open("file.txt", encoding="cp1251") as f:
    text = f.read()
```

Или пересохранить файл в UTF-8.

**Совет:** всегда пишите `encoding="utf-8"` при `open()`.

---

## 📌 Как читать ошибку **правильно**

```
Traceback (most recent call last):
  File "app.py", line 5, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero
```

1. Смотрим **последнюю строку** — `ZeroDivisionError`.
2. Смотрим **строку выше** — `line 5, in <module>`.
3. Смотрим **строку кода** — `result = 10 / 0`.
4. **Поняли** — исправляем.

---

## 📌 Что делать, если ошибка непонятная

1. **Google**: скопируйте текст ошибки (без личных путей) — 99% уже
   решены.
2. **Принт-дебаг**: расставьте `print(...)` перед падающей строкой.
3. **Упростить код**: закомментируйте куски, пока не найдёте.
4. **Разбить на части**: запускать по кусочку.
5. **Посмотреть тип**: `print(type(x))` перед использованием.

---

## ⚠️ Частые ошибки в этой категории

!!! warning "Паника вместо чтения"
    Красный текст **пугает**, но именно там написан ответ. Читайте.

!!! warning "Игнорирование номера строки"
    «Падает где-то в программе» — плохо. Python сказал **точно** где.

!!! warning "Не воспроизводится"
    Если ошибка появляется раз через раз — введите **логи** или
    **try/except с печатью**. Помогает `loguru`.

!!! warning "Стек-трейс на 100 строк"
    Смотрите **свою** часть (файл, который вы писали), а не весь.

---

## 🔗 Что дальше

→ [Ошибки импорта и путей](import.md).