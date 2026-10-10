# Наследование

!!! abstract "Уровень: ⭐⭐ Средний → ⭐⭐⭐ Продвинутый"
    Подойдёт для 9–11 класса. Нужно знать: [классы](classes.md).

---

## 🍎 Объясняем просто

!!! example "Наследование — как семейное дерево"
    Если есть класс `Animal` с общим поведением (ест, спит), а нужно ещё
    `Dog` и `Cat` — не надо копировать код. Скажем: «Собака **— это**
    животное». Тогда `Dog` автоматически получит всё, что умеет `Animal`,
    плюс добавит своё.

    ```python
    class Animal:
        def eat(self):
            return "Ем"

    class Dog(Animal):          # Dog наследует Animal
        def bark(self):
            return "Гав"

    d = Dog()
    print(d.eat())     # Ем — унаследовал
    print(d.bark())    # Гав — свой
    ```

---

## 📖 Синтаксис

```python
class Имя(Родитель):
    ...
```

Родителя называют **суперклассом**, **базовым классом** или **предком**.
Дочерний — **подклассом**, **производным** или **потомком**.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        return f"{self.name} ест"

class Dog(Animal):
    def bark(self):
        return f"{self.name}: Гав!"

class Cat(Animal):
    def meow(self):
        return f"{self.name}: Мяу!"

rex = Dog("Рекс")
print(rex.eat())      # Рекс ест
print(rex.bark())     # Рекс: Гав!
```

---

## 🎯 `super()` — обращение к родителю

Когда дочерний класс **переопределяет** метод, иногда нужно вызвать родительскую версию. Это делается через `super()`.

```python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)      # вызываем родительский __init__
        self.breed = breed

rex = Dog("Рекс", "лабрадор")
print(rex.name)      # Рекс — установлено родителем
print(rex.breed)     # лабрадор
```

!!! warning "Забыли вызвать `super().__init__()`"
    ```python
    class Dog(Animal):
        def __init__(self, name, breed):
            self.breed = breed       # ❌ self.name не установлен!
    ```
    Класс `Animal` инициализацию выполнит только если вы её вызовете.

---

## 🎯 Переопределение методов

Дочерний класс может заменить поведение родителя:

```python
class Animal:
    def sound(self):
        return "..."

class Dog(Animal):
    def sound(self):
        return "Гав"

class Cat(Animal):
    def sound(self):
        return "Мяу"

for a in [Dog(), Cat(), Animal()]:
    print(a.sound())
# Гав
# Мяу
# ...
```

Это уже **полиморфизм** — «разные объекты по-разному отвечают на один вызов».

---

## 🎯 Множественное наследование

Класс может наследоваться от нескольких родителей:

```python
class Swimmer:
    def swim(self):
        return "плыву"

class Flyer:
    def fly(self):
        return "лечу"

class Duck(Swimmer, Flyer):
    def quack(self):
        return "кря-кря"

d = Duck()
print(d.swim())     # плыву
print(d.fly())      # лечу
print(d.quack())    # кря-кря
```

### MRO — порядок разрешения методов

Когда метод есть у нескольких родителей, Python ищет его в порядке **MRO** (Method Resolution Order) — слева направо, потом вверх по иерархии.

```python
class A:
    def hello(self): return "A"
class B(A):
    def hello(self): return "B"
class C(A):
    def hello(self): return "C"
class D(B, C):
    pass

print(D().hello())   # B — потому что B первый
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)
```

!!! info "Подробнее: алгоритм C3 🔬"
    Python использует **алгоритм C3-линеаризации** — сложный, но дающий
    предсказуемый порядок. Правило простое: если сомневаетесь — смотрите
    `D.__mro__` или `D.mro()`. Ещё метод `super()` подчиняется MRO, и это
    позволяет делать «кооперативное наследование».

### Ромбовидное наследование

```
    A
   / \
  B   C
   \ /
    D
```

Если `A.__init__` вызывается один раз — благодаря MRO — можно писать:

```python
class A:
    def __init__(self):
        super().__init__()
        print("A")
class B(A):
    def __init__(self):
        super().__init__()
        print("B")
class C(A):
    def __init__(self):
        super().__init__()
        print("C")
class D(B, C):
    def __init__(self):
        super().__init__()
        print("D")

D()
# A
# C
# B
# D
```

Каждый класс вызывается **один раз**, в порядке MRO. Так делают **mixin**-классы.

---

## 🧩 Mixin — «примеси»

**Mixin** — маленький класс, добавляющий одну возможность. Не предназначен
для самостоятельного использования, а подмешивается к другим.

```python
class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class User(JsonMixin):
    def __init__(self, name, age):
        self.name = name
        self.age = age

u = User("Аня", 12)
print(u.to_json())     # {"name": "Аня", "age": 12}
```

---

## 📌 Абстрактные классы

Иногда нужно сказать: «Этот класс только описывает интерфейс, а конкретное
поведение задаст потомок». Для этого — `ABC` (Abstract Base Class).

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

    def perimeter(self):
        return 2 * (self.w + self.h)

# Shape()             # ❌ TypeError — нельзя создать
r = Rectangle(3, 4)
print(r.area())       # 12
```

!!! warning "Потомок обязан реализовать все abstractmethod"
    ```python
    class Bad(Shape):
        def area(self):
            return 0
        # perimeter забыли
    
    Bad()             # ❌ TypeError: Can't instantiate abstract class
    ```

---

## 🔍 `isinstance` и `issubclass`

```python
class Animal: pass
class Dog(Animal): pass

d = Dog()
print(isinstance(d, Dog))          # True
print(isinstance(d, Animal))       # True — Dog тоже Animal
print(issubclass(Dog, Animal))     # True
print(issubclass(Animal, Dog))     # False
```

---

## 🔄 Другие полезные приёмы

### Расширить метод родителя

```python
class Animal:
    def describe(self):
        return "Животное"

class Dog(Animal):
    def describe(self):
        return super().describe() + ", собака"

print(Dog().describe())   # Животное, собака
```

### Свой `__str__` в потомке

```python
class Animal:
    def __str__(self):
        return "Животное"

class Dog(Animal):
    def __str__(self):
        return f"Собака: {self.name}"
```

---

## 💡 Примеры

### Пример 1. Иерархия работников 👔

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def info(self):
        return f"{self.name}: {self.salary} руб."

    def bonus(self):
        return self.salary * 0.05

class Manager(Employee):
    def __init__(self, name, salary, team_size):
        super().__init__(name, salary)
        self.team_size = team_size

    def bonus(self):
        # У менеджера бонус зависит от размера команды
        return super().bonus() + self.team_size * 1000

class Developer(Employee):
    def __init__(self, name, salary, language):
        super().__init__(name, salary)
        self.language = language

    def bonus(self):
        return self.salary * 0.1

team = [Manager("Аня", 100000, 5), Developer("Борис", 80000, "Python")]
for e in team:
    print(e.info(), "→ бонус:", e.bonus())
```

### Пример 2. Сюжетный — оружие в игре ⚔️

```python
class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

    def attack(self):
        return self.damage

class Sword(Weapon):
    def attack(self):
        return self.damage * 1.5   # критический удар

class Bow(Weapon):
    def attack(self):
        return self.damage if self.damage > 10 else 0   # не бьёт слабо

class MagicStaff(Weapon):
    def __init__(self, name, damage, mana_cost):
        super().__init__(name, damage)
        self.mana_cost = mana_cost

    def attack(self):
        return self.damage * 2 if self.mana_cost > 0 else 0

weapons = [Sword("Экскалибур", 50), Bow("Лук", 8), MagicStaff("Посох", 40, 10)]
for w in weapons:
    print(f"{w.name}: {w.attack()} урона")
```

### Пример 3. `ABC` и иерархия фигур 📐

```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self): pass

    @abstractmethod
    def perimeter(self): pass

    def describe(self):
        return f"{self.__class__.__name__}: площадь {self.area():.2f}"

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2
    def perimeter(self): return 2 * math.pi * self.r

class Square(Shape):
    def __init__(self, a): self.a = a
    def area(self): return self.a ** 2
    def perimeter(self): return 4 * self.a

for s in [Circle(5), Square(4)]:
    print(s.describe())
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `super().__init__()`"
    Родительские атрибуты не будут установлены.

!!! warning "Ошибка 2. Наследование «для галочки»"
    ```python
    class Dog(Animal): pass   # если Dog ничего не добавляет — зачем?
    ```

!!! warning "Ошибка 3. Глубокая иерархия (5+ уровней)"
    Чем глубже дерево, тем труднее читать код. Обычно 2–3 уровня — предел.

!!! warning "Ошибка 4. Наследование ради повторного использования"
    Не наследуйтесь только чтобы «взять функцию». Если отношение не
    «является» (`Dog is Animal`) — используйте **композицию** (вложенный
    объект), а не наследование.

!!! warning "Ошибка 5. Не вызвать `super()` в `__init__` mixin"
    В mixin-классах всегда вызывайте `super().__init__(*args, **kwargs)`,
    чтобы цепочка MRO не сломалась.

---

## 🧪 Упражнения

1. ⭐ Родитель `Animal`, потомки `Dog`, `Cat` с методом `sound`.
2. ⭐ Класс `Vehicle` с `speed`, потомки `Car`, `Bike`.
3. ⭐⭐ `Employee` → `Manager` и `Developer` с разными бонусами.
4. ⭐⭐ `Shape(ABC)` → `Rectangle`, `Circle` с `area` и `perimeter`.
5. ⭐⭐ Множественное наследование: `Swimmer`, `Flyer` → `Duck`.
6. ⭐⭐⭐ Mixin `JsonMixin` для сериализации любого класса в JSON.
7. ⭐⭐⭐ Иерархия для игры: `Character` → `Warrior`, `Mage`, `Archer` с разными атаками.

---

## 🔗 Что дальше

→ [Полиморфизм](polymorphism.md) — «один интерфейс — много форм».