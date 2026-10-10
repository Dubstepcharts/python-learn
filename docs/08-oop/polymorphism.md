# Полиморфизм

!!! abstract "Уровень: ⭐⭐ Средний → ⭐⭐⭐ Продвинутый"
    Подойдёт для 9–11 класса. Нужно знать: [наследование](inheritance.md).

---

## 🍎 Объясняем просто

!!! example "Одна команда — разное поведение"
    Скажи слово «говорить» собаке, кошке и попугаю — каждая ответит
    по-своему: «Гав», «Мяу», «Кря». Команда одна, поведение разное.
    Это и есть полиморфизм: **один интерфейс — много реализаций**.

    ```python
    for animal in [Dog(), Cat(), Parrot()]:
        print(animal.speak())     # Гав / Мяу / Кря
    ```

---

## 📖 Что такое полиморфизм

**Полиморфизм** — способность разных классов по-разному отвечать на
**один и тот же вызов**. В Python это выражается в нескольких формах:

1. **Переопределение методов** (через наследование)
2. **Duck typing** — «если выглядит как утка и крякает как утка — это утка»
3. **Перегрузка операторов** (магические методы)
4. **Перегрузка функций** через `*args`, `**kwargs`, `singledispatch`

---

## 🎯 Форма 1. Переопределение методов

Классический вариант через наследование:

```python
class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Гав"

class Cat(Animal):
    def speak(self):
        return "Мяу"

animals = [Dog(), Cat(), Animal()]
for a in animals:
    print(a.speak())
```

Метод `speak` — один, а поведений — сколько классов.

---

## 🦆 Форма 2. Duck typing

**Идея:** если объект **умеет** то, что нужно, не важно, какого он класса.
Python не проверяет тип — просто пробует вызвать метод.

```python
class Duck:
    def quack(self): return "Кря"
    def walk(self): return "Идёт вперевалочку"

class Person:
    def quack(self): return "Человек подражает утке"
    def walk(self): return "Человек идёт прямо"

def do_stuff(duck):
    print(duck.quack())
    print(duck.walk())

do_stuff(Duck())
do_stuff(Person())     # работает! Хоть Person и не Duck
```

!!! info "Подробнее: зачем это 🔬"
    В статически типизированных языках (`Java`, `C++`) пришлось бы объявить
    общий интерфейс `DuckLike` и явно реализовать его. Python просто
    вызывает метод — если его нет, будет `AttributeError`.
    
    Это делает код **гибче**, но требует дисциплины: ошибки всплывают
    во время выполнения, а не компиляции.

---

## 🎯 Форма 3. Перегрузка операторов

Магические методы позволяют своим объектам «вести себя как числа»:

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __str__(self):
        return f"({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)         # (4, 6)
```

Один и тот же `+` работает для чисел, строк, списков и наших векторов.

---

## 🎯 Форма 4. Перегрузка функций

### С `*args`

```python
def add(*args):
    return sum(args)

print(add(1, 2))
print(add(1, 2, 3, 4))
```

### С типами через `singledispatch`

```python
from functools import singledispatch

@singledispatch
def describe(x):
    return f"Неизвестно: {x}"

@describe.register
def _(x: int):
    return f"Целое: {x}"

@describe.register
def _(x: str):
    return f"Строка: {x!r}"

@describe.register
def _(x: list):
    return f"Список из {len(x)}"

print(describe(42))         # Целое: 42
print(describe("hi"))       # Строка: 'hi'
print(describe([1, 2, 3]))  # Список из 3
```

Так делают «функции с разным поведением по типу».

---

## 🎯 Абстрактные интерфейсы + полиморфизм

Комбинируем ABC и полиморфизм, чтобы задать **контракт**:

```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

class Card(PaymentMethod):
    def pay(self, amount):
        return f"С карты списано {amount}"

class Cash(PaymentMethod):
    def pay(self, amount):
        return f"Наличными: {amount}"

class Crypto(PaymentMethod):
    def pay(self, amount):
        return f"Крипта: {amount} BTC"

def checkout(method: PaymentMethod, amount):
    print(method.pay(amount))

for m in [Card(), Cash(), Crypto()]:
    checkout(m, 100)
```

---

## 🎯 Полиморфизм в стандартной библиотеке

Классический пример — `len()`:

```python
print(len("привет"))        # 6
print(len([1, 2, 3]))       # 3
print(len({"a": 1, "b": 2}))# 2
print(len({1, 2, 3, 4}))    # 4
```

Одна функция — разные типы. Работает потому, что у всех объектов есть `__len__`.

То же с `for`:

```python
for x in "abc": ...          # строка
for x in [1, 2, 3]: ...      # список
for x in {"a": 1}: ...       # словарь (по ключам)
```

Одна конструкция — для всего, что поддерживает итерацию.

---

## 💡 Примеры

### Пример 1. Сюжетный — оружие ⚔️

```python
class Weapon:
    def attack(self, target):
        raise NotImplementedError

class Sword(Weapon):
    def attack(self, target):
        return f"Меч рубит {target}"

class Bow(Weapon):
    def attack(self, target):
        return f"Лук стреляет в {target}"

class Bomb(Weapon):
    def attack(self, target):
        return f"Бомба взрывает {target}"

def fight(weapon, target):
    print(weapon.attack(target))

for w in [Sword(), Bow(), Bomb()]:
    fight(w, "дракона")
```

### Пример 2. Графические фигуры 📐

```python
import math

class Shape:
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2

class Rectangle(Shape):
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

shapes = [Circle(3), Rectangle(4, 5), Circle(1)]
total = sum(s.area() for s in shapes)
print(f"Общая площадь: {total:.2f}")
```

### Пример 3. Duck typing — «говорящие» объекты 🦆

```python
class Robot:
    def say(self): return "Бип-буп"

class Human:
    def say(self): return "Привет!"

class Alien:
    def say(self): return "Земляне, здравствуйте"

def greeting(entity):
    print(entity.say())

for e in [Robot(), Human(), Alien()]:
    greeting(e)
```

### Пример 4. Полиморфизм оператора 🔢

```python
class Money:
    def __init__(self, amount, currency="RUB"):
        self.amount = amount
        self.currency = currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Разные валюты")
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other):
        return Money(self.amount - other.amount, self.currency)

    def __str__(self):
        return f"{self.amount} {self.currency}"

wallet = Money(1000) + Money(500) - Money(200)
print(wallet)      # 1300 RUB
```

---

## 📌 «Есть ли у объекта метод?»

Иногда полезно проверить перед вызовом:

```python
def smart_call(obj, method_name, *args):
    if hasattr(obj, method_name):
        return getattr(obj, method_name)(*args)
    return f"У объекта нет метода {method_name}"

print(smart_call("привет", "upper"))
print(smart_call(42, "upper"))   # У объекта нет метода upper
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Использование `type(x) == SomeClass`"
    ```python
    if type(x) == Animal: ...
    ```
    Плохо: не сработает для подклассов.
    ```python
    if isinstance(x, Animal): ...    # ✅
    ```

!!! warning "Ошибка 2. Проверка `hasattr` вместо духа duck typing"
    ```python
    if hasattr(x, "read"):      # может быть излишне
    ```
    Если вы уверены — вызывайте прямо. `try/except AttributeError` вместо
    `hasattr` иногда чище.

!!! warning "Ошибка 3. Тонкие различия в интерфейсах"
    ```python
    class A:
        def save(self): ...      # без аргументов
    class B:
        def save(self, path): ... # с аргументом
    ```
    «Один интерфейс» — значит **одна сигнатура**. Иначе полиморфизм
    сломается.

!!! warning "Ошибка 4. Переопределение оператора меняет смысл"
    ```python
    class Logger:
        def __add__(self, other):
            print("Складываем логгеры?!")
    ```
    `+` традиционно означает сложение или конкатенацию. Не вкладывайте
    в него странный смысл.

---

## 🧪 Упражнения

1. ⭐ Класс `Shape` и два потомка с методом `area`.
2. ⭐ Функция `describe(obj)`, использующая duck typing: вызывает `obj.info()`.
3. ⭐⭐ Класс `Vector` с `__add__`, `__sub__`, `__str__`.
4. ⭐⭐ Через ABC — интерфейс `Logger` и его реализации `ConsoleLogger`, `FileLogger`.
5. ⭐⭐ `singledispatch` для «описания» значения по типу.
6. ⭐⭐⭐ Своя коллекция с `__len__`, `__iter__`, `__getitem__` — полиморфна как список.

---

## 🔗 Что дальше

→ [Магические методы](magic-methods.md) — **все ~80 dunder-методов**.