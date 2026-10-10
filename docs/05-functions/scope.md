# Область видимости

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса. Нужно знать: [возврат значений](return.md).

---

## 🍎 Объясняем просто

!!! example "Разные «этажи» переменных"
    Представь многоэтажный дом. На верхнем этаже живут **глобальные**
    переменные — их видят все. На нижнем — **локальные** переменные функции,
    они видны только внутри этой функции.
    
    ```python
    x = 10                # глобальная

    def f():
        y = 20            # локальная
        print(x, y)       # видит обе

    f()                   # 10 20
    print(y)              # ❌ NameError: y не существует снаружи
    ```

---

## 📖 Правило LEGB

Python ищет переменную в четырёх «местах» по порядку:

1. **L**ocal — внутри текущей функции
2. **E**nclosing — во внешней функции (если вложены)
3. **G**lobal — на уровне модуля
4. **B**uilt-in — встроенные (`print`, `len`, ...)

Если нигде не нашёл — `NameError`.

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)      # local

    inner()

outer()
```

Если убрать `x = "local"` — выведет `enclosing`. Если убрать и его — `global`.

---

## 🌍 Глобальные переменные

Определены на верхнем уровне файла:

```python
counter = 0

def increment():
    print(counter)   # можно читать

increment()          # 0
```

Но **изменять** их внутри функции просто так нельзя:

```python
counter = 0

def bad_increment():
    counter = counter + 1   # ❌ UnboundLocalError

def good_increment():
    global counter
    counter = counter + 1   # ✅ работает, но так лучше не делать
```

!!! warning "Почему `global` — плохая практика?"
    - Функция перестаёт быть «чёрным ящиком» — она меняет мир снаружи
    - Сложно отследить, кто и когда меняет переменную
    - Тяжело тестировать
    
    **Правильно:** передавайте данные как аргументы и возвращайте результат:
    ```python
    def increment(value):
        return value + 1

    counter = increment(counter)
    ```

---

## 🔒 `nonlocal` — для вложенных функций

Если функция внутри функции хочет изменить переменную внешней (но не глобальной) — используется `nonlocal`:

```python
def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

c = make_counter()
print(c())   # 1
print(c())   # 2
print(c())   # 3
```

`nonlocal` — «возьми переменную из ближайшей внешней функции».

---

## 🔎 Примеры

### Пример 1. Чтение глобальной без `global`

```python
PI = 3.14159

def circle_area(r):
    return PI * r ** 2     # читаем PI — можно без global

print(circle_area(5))
```

### Пример 2. `global` в действии (антипример)

```python
total = 0

def add_to_total(x):
    global total           # ← не надо так!
    total += x

add_to_total(10)
add_to_total(5)
print(total)   # 15
```

**Как правильно:**

```python
def add_total(current, x):
    return current + x

total = add_total(total, 10)
total = add_total(total, 5)
```

### Пример 3. Вложенные функции 🪆

```python
def outer():
    message = "Привет"

    def inner():
        print(message)   # видит message из outer

    inner()

outer()   # Привет
```

### Пример 4. Сюжетный — банкомат 🏦

```python
def make_account(balance):
    def deposit(amount):
        nonlocal balance
        balance += amount
        return balance

    def withdraw(amount):
        nonlocal balance
        if amount > balance:
            return "Недостаточно средств"
        balance -= amount
        return balance

    return deposit, withdraw

deposit, withdraw = make_account(100)
print(deposit(50))       # 150
print(withdraw(30))      # 120
print(withdraw(1000))    # Недостаточно средств
```

---

## 📌 Встроенные имена

Встроенные функции и константы (`len`, `print`, `True`) живут в области **Built-in**:

```python
def f():
    print(len([1, 2, 3]))    # len доступен везде

f()
```

**Не переопределяйте** их:

```python
list = [1, 2, 3]      # ❌ теперь list — это список, а не тип!

def print(x):         # ❌ затирает встроенный print
    return x
```

Если случайно затёрли — перезапустите сессию Python.

---

## 📊 Таблица «кто кого видит»

| Откуда | Видит local | Видит enclosing | Видит global | Видит built-in |
|---|---|---|---|---|
| Внутри функции | ✅ | ✅ (если вложены) | ✅ (только чтение) | ✅ |
| Внутри вложенной | ✅ | ✅ | ✅ (только чтение) | ✅ |
| На верхнем уровне | ❌ | ❌ | ✅ | ✅ |

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Изменение глобальной без `global`"
    ```python
    x = 5
    def f():
        x = 10         # ❌ не меняет глобальную, создаёт локальную
    f()
    print(x)           # 5
    ```

!!! warning "Ошибка 2. `UnboundLocalError`"
    ```python
    x = 5
    def f():
        print(x)       # ❌ UnboundLocalError
        x = 10
    ```
    Python видит `x = 10` и считает `x` локальной для всей функции — но
    локальная ещё не создана, а обращаемся к ней раньше. Путаница.

!!! warning "Ошибка 3. `global` с параметром функции"
    ```python
    def f(x):
        global x   # ❌ SyntaxError
    ```
    Параметры функции — всегда локальны.

!!! warning "Ошибка 4. Не переопределять встроенные"
    ```python
    sum = 5           # ❌
    print(sum([1, 2]))   # TypeError
    ```
    Используйте свои имена: `total`, `my_sum`.

---

## 🧪 Упражнения

1. ⭐ Создайте глобальную переменную и прочитайте её внутри функции.
2. ⭐ Попробуйте изменить глобальную без `global` — что получится?
3. ⭐⭐ Используйте `global`, чтобы увеличить счётчик из функции.
4. ⭐⭐ Напишите `make_counter()` с `nonlocal`.
5. ⭐⭐ Вложенная функция, читающая переменную внешней.
6. ⭐⭐⭐ «Банкомат» из примера выше — своя версия.
7. ⭐⭐⭐ Реализуйте «замыкание» (closure), которое запоминает состояние между вызовами.

---

## 🔗 Что дальше

→ [lambda](lambda.md) — короткие анонимные функции.