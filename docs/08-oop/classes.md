# Классы и объекты

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 9–11 класса. Нужно знать: [функции](../05-functions/index.md).

---

## 🍎 Объясняем просто

!!! example "Класс — чертёж, объект — изделие"
    **Класс** — как чертёж машины. На чертеже — общая идея: колёса, руль,
    мотор. **Объект** — конкретная машина, собранная по чертежу: красная,
    номер A123BC.
    
    ```python
    class Car:                    # чертёж
        pass

    my_car = Car()                # объект — конкретная машина
    your_car = Car()              # ещё один объект
    ```
    
    Один класс — сколько угодно объектов.

---

## 📖 Что такое класс

**Класс** — шаблон, описывающий:
- Какие **атрибуты** (данные) будут у объекта
- Какие **методы** (функции) он умеет выполнять

**Объект** (экземпляр) — конкретная «штука», созданная по классу.

```python
class Dog:
    # атрибут класса (общий для всех собак)
    species = "Canis familiaris"

    def __init__(self, name, age):
        # атрибуты экземпляра — уникальны для каждой собаки
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name}: Гав!"

# Создаём объекты
rex = Dog("Рекс", 3)
bim = Dog("Бим", 5)

print(rex.name)          # Рекс
print(bim.age)           # 5
print(rex.bark())        # Рекс: Гав!
print(rex.species)       # Canis familiaris — общий атрибут
```

---

## 🎯 `__init__` и `self`

**`__init__`** — специальный метод, вызывается **автоматически** при создании объекта. Используется для инициализации.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 5)      # __init__(p, 3, 5)
print(p.x, p.y)      # 3 5
```

**`self`** — это ссылка на **сам объект**. Через `self` метод обращается к своим атрибутам и методам.

!!! info "Подробнее: почему `self` передаётся явно 🔬"
    В других языках (`Java`, `C++`) есть неявное `this`. В Python решили
    сделать его явным — это делает код понятнее и позволяет вызывать методы
    класса как обычные функции:
    ```python
    p = Point(1, 2)
    Point.move(p, 5, 5)   # то же, что p.move(5, 5)
    ```
    
    Имя `self` — соглашение, а не магия. Но менять его не принято.

---

## 📌 Виды атрибутов

### Атрибуты экземпляра

Уникальны для каждого объекта, задаются через `self.`:

```python
class User:
    def __init__(self, name):
        self.name = name
        self.login_count = 0

u1 = User("Аня")
u2 = User("Борис")
u1.login_count += 1
print(u1.login_count, u2.login_count)   # 1 0
```

### Атрибуты класса

Общие для всех объектов:

```python
class Circle:
    pi = 3.14159              # атрибут класса

    def __init__(self, r):
        self.r = r

    def area(self):
        return Circle.pi * self.r ** 2   # обращение через класс

c1 = Circle(5)
c2 = Circle(10)
print(Circle.pi)     # 3.14159 — у класса
print(c1.pi)         # 3.14159 — доступ через объект тоже работает
```

!!! warning "Осторожно с изменяемыми атрибутами класса"
    ```python
    class Team:
        members = []       # ❌ ОПАСНО: список общий для всех!
    
    a = Team()
    b = Team()
    a.members.append("Аня")
    print(b.members)       # ['Аня'] — b тоже видит!
    ```
    
    Правильно — инициализировать в `__init__`:
    ```python
    class Team:
        def __init__(self):
            self.members = []      # ✅ у каждого свой
    ```

### Приватные (условно)

Соглашение: атрибуты с `_` — «внутренние». С `__` — «не трогать»:

```python
class Account:
    def __init__(self, balance):
        self._balance = balance     # «приватный» по соглашению
        self.__pin = "1234"         # name mangling: _Account__pin

    def get_balance(self):
        return self._balance
```

`__pin` → Python переименует в `_Account__pin`. Это не защита, а **сигнал**:
«не лезь сюда снаружи».

---

## 🎯 Методы

### Обычные методы экземпляра

Принимают `self`:

```python
class Counter:
    def __init__(self):
        self.value = 0

    def inc(self):
        self.value += 1

    def reset(self):
        self.value = 0
```

### `@staticmethod`

Метод, которому не нужен ни `self`, ни `cls`:

```python
class Math:
    @staticmethod
    def add(a, b):
        return a + b

print(Math.add(2, 3))     # 5
```

### `@classmethod`

Первый аргумент — **класс**, обычно `cls`:

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_string(cls, s):
        name, age = s.split(",")
        return cls(name, int(age))

p = Person.from_string("Аня,12")
print(p.name, p.age)      # Аня 12
```

Часто используется как «альтернативный конструктор».

### `@property` — «свойство»

Превращает метод в атрибут:

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
print(c.radius)     # 5 — без скобок
print(c.area)       # 78.5...
c.radius = 10       # вызывает setter
# c.radius = -1     # ValueError
```

См. также [`@functools.cached_property`](../05-functions/decorators.md#functoolscached_property) — кэширует результат.

---

## 🎯 `@dataclass` — класс данных в одну строку

Автоматически генерирует `__init__`, `__repr__`, `__eq__`:

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
print(p1 + p2)         # ❌ TypeError — надо добавить __add__
```

С настройками:

```python
@dataclass(frozen=True)      # неизменяемый (как кортеж)
class RGB:
    r: int
    g: int
    b: int

@dataclass(order=True)       # сгенерирует <, <=, >, >=
class Version:
    major: int
    minor: int
```

!!! tip "Когда `@dataclass`"
    Если класс — это в основном **набор данных** без сложного поведения,
    `@dataclass` избавит от рутинного `__init__`. Для классов с логикой
    (игры, интерфейсы) — обычный `class`.

---

## 💡 Примеры

### Пример 1. Сюжетный — питомец 🐶

```python
class Pet:
    def __init__(self, name, kind, age=0):
        self.name = name
        self.kind = kind
        self.age = age
        self.hunger = 5

    def feed(self):
        if self.hunger > 0:
            self.hunger -= 1
            return f"{self.name} поел. Голод: {self.hunger}"
        return f"{self.name} не голоден"

    def info(self):
        return f"{self.name} ({self.kind}), {self.age} лет"

pet = Pet("Мурка", "кошка", 3)
print(pet.info())     # Мурка (кошка), 3 лет
print(pet.feed())     # Мурка поел. Голод: 4
print(pet.feed())     # Мурка поел. Голод: 3
```

### Пример 2. Сюжетный — банковский счёт 🏦

```python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Сумма должна быть положительной")
        self._balance += amount

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("Недостаточно средств")
        self._balance -= amount

acc = Account("Аня", 1000)
acc.deposit(500)
acc.withdraw(200)
print(acc.balance)    # 1300
```

### Пример 3. Сюжетный — игра 🎮

```python
class Character:
    def __init__(self, name, hp=100, damage=10):
        self.name = name
        self.hp = hp
        self.damage = damage

    def is_alive(self):
        return self.hp > 0

    def attack(self, other):
        other.hp -= self.damage
        print(f"{self.name} бьёт {other.name} на {self.damage}")

    def __str__(self):
        return f"{self.name} (HP: {self.hp})"

hero = Character("Герой")
villain = Character("Злодей", hp=80, damage=15)

hero.attack(villain)
print(villain)             # Злодей (HP: 70)
```

### Пример 4. Стек 🥞

```python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("Стек пуст")
        return self._items.pop()

    def peek(self):
        return self._items[-1] if self._items else None

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)

s = Stack()
s.push(1); s.push(2); s.push(3)
print(len(s))     # 3
print(s.pop())    # 3
print(s.peek())   # 2
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `self`"
    ```python
    class Dog:
        def bark():                    # ❌ нет self
            return "Гав"
    
    d = Dog()
    d.bark()                           # TypeError
    ```
    Все обычные методы принимают `self` первым.

!!! warning "Ошибка 2. Забыли `self.`"
    ```python
    class Dog:
        def __init__(self, name):
            name = name                # ❌ создаёт локальную переменную
    ```
    **Правильно:** `self.name = name`.

!!! warning "Ошибка 3. Вызов метода без скобок"
    ```python
    d.bark            # ❌ не вызвал, а взял ссылку
    d.bark()          # ✅
    ```

!!! warning "Ошибка 4. Изменяемые атрибуты класса"
    ```python
    class Team:
        members = []      # ❌ общий список для всех
    ```
    Инициализируйте в `__init__`.

!!! warning "Ошибка 5. `__init__` не возвращает ничего"
    ```python
    class A:
        def __init__(self):
            return 5       # ❌ TypeError
    ```
    `__init__` должен возвращать `None`.

---

## 🧪 Упражнения

1. ⭐ Класс `Book` с полями `title`, `author`, `year`. Метод `info()`.
2. ⭐ Класс `Rectangle` с `width`, `height`, методами `area()` и `perimeter()`.
3. ⭐⭐ Класс `BankAccount` с балансом, `deposit`, `withdraw`, `@property balance`.
4. ⭐⭐ Класс `Student` с именем, списком оценок, методом `average()`.
5. ⭐⭐ `@dataclass` `Point` с методом `distance_to(other)`.
6. ⭐⭐⭐ Класс `Fraction` (дробь) с `add`, `sub`, `__str__`.
7. ⭐⭐⭐ Стек и очередь — два класса с общим родителем `Container`.

---

## 🔗 Что дальше

→ [Наследование](inheritance.md) — как один класс расширяет другой.