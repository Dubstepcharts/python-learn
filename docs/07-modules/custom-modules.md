# Свои модули и пакеты

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса. Нужно знать: [import](import.md).

---

## 🍎 Объясняем просто

!!! example "Модуль — это просто `.py`-файл"
    Любой `.py`-файл — уже модуль. Если ты импортируешь его из другого
    файла — его содержимое станет доступно. Больше ничего создавать не надо.

    ```
    мой_проект/
    ├── main.py
    └── helpers.py       ← это модуль
    ```

    ```python
    # main.py
    import helpers
    helpers.say_hello()
    ```

---

## 📖 Как создать модуль

**`helpers.py`:**
```python
"""Мои вспомогательные функции."""

PI = 3.14159

def say_hello(name):
    return f"Привет, {name}!"

def square(x):
    return x ** 2

class Counter:
    def __init__(self):
        self.value = 0
    def inc(self):
        self.value += 1
```

**`main.py`:**
```python
import helpers

print(helpers.say_hello("Аня"))   # Привет, Аня!
print(helpers.square(5))          # 25
print(helpers.PI)                 # 3.14159

c = helpers.Counter()
c.inc()
print(c.value)                    # 1
```

---

## 🧱 Пакеты — папки с модулями

Пакет — это папка с модулями и файлом `__init__.py`:

```
mypackage/
├── __init__.py
├── math_utils.py
├── string_utils.py
└── subpackage/
    ├── __init__.py
    └── helpers.py
```

**`__init__.py`** может быть пустым (просто помечает папку как пакет) или содержать код инициализации:

```python
# __init__.py
"""Мой пакет для учебных задач."""
__version__ = "1.0.0"

from .math_utils import square
from .string_utils import reverse
```

Тогда можно:

```python
import mypackage
print(mypackage.square(5))
print(mypackage.__version__)

# или конкретный модуль
from mypackage import math_utils
print(math_utils.square(5))

# или напрямую функцию
from mypackage.math_utils import square
```

!!! info "Подробнее: `__init__.py` нужен всегда? 🔬"
    Формально в Python 3.3+ можно создавать «namespace packages» и без него.
    Но **для учебного проекта** лучше всегда делать `__init__.py` — это
    явно показывает, что перед нами пакет, и поведение предсказуемо.

---

## 🎯 `__name__ == "__main__"`

Важная конструкция:

```python
# helpers.py
def main():
    print("Запущено как программа!")

if __name__ == "__main__":
    main()
```

- Когда файл **запускают напрямую** (`python helpers.py`) — `__name__ == "__main__"`, и `main()` выполняется
- Когда файл **импортируют** (`import helpers`) — `__name__ == "helpers"`, и `main()` **не** выполняется

!!! tip "Зачем это нужно"
    Так можно делать файл и **модулем**, и **скриптом** одновременно. Часто
    используется: код «запуска программы» изолируют от функций, которые
    другие модули будут импортировать.

---

## 📌 Что доступно снаружи

По умолчанию — **всё**, что не начинается с `_`. Имена с подчёркиванием —
«внутренние»:

```python
# mymodule.py
public_var = 10
_private_var = 20    # считается «внутренним»
__very_private = 30

def public_func(): pass
def _private_func(): pass
```

Точный список «публичного» можно задать через `__all__`:

```python
# mymodule.py
__all__ = ["public_func", "PUBLIC_CONST"]

def public_func(): ...
def _internal(): ...
```

`__all__` влияет на `from module import *` и на документацию.

---

## 📌 Метаданные модуля

У любого модуля есть встроенные атрибуты:

```python
import mymodule

print(mymodule.__name__)       # "mymodule"
print(mymodule.__file__)       # путь к файлу
print(mymodule.__doc__)        # докстрока модуля
print(mymodule.__dict__)       # все имена
print(dir(mymodule))           # публичные имена
```

Докстрока модуля — это **первая строка файла в тройных кавычках**:

```python
"""Это докстрока модуля.

Она описывает, зачем этот модуль.
"""
```

---

## 🔄 Проблема с путями

Если модуль лежит **в другой папке**, Python его не найдёт. Решения:

### 1. Держать модули рядом с основным файлом

```
project/
├── main.py
└── helpers.py       ← рядом, всё просто
```

### 2. Пакеты с `__init__.py`

```
project/
├── main.py
└── utils/
    ├── __init__.py
    └── text.py
```

```python
from utils import text
# или
from utils.text import process
```

### 3. `sys.path` (не рекомендуется)

```python
import sys
sys.path.append("/путь/к/папке")
import mymodule
```

Работает, но считается «грязным».

### 4. `PYTHONPATH` (для скриптов)

Переменная окружения, которую Python тоже смотрит:

```bash
# Linux/macOS
export PYTHONPATH=/путь/к/папке

# Windows PowerShell
$env:PYTHONPATH = "C:\путь\к\папке"
```

### 5. Установка как пакета (для больших проектов)

С `pyproject.toml` и `pip install -e .` — модуль становится доступен везде.
Это тема для отдельного разговора, за пределами школьного курса.

---

## 💡 Примеры

### Пример 1. Модуль с функциями 🧮

**`geometry.py`:**
```python
import math

def circle_area(r):
    return math.pi * r ** 2

def rectangle_area(w, h):
    return w * h

if __name__ == "__main__":
    # Демо при прямом запуске
    print(f"Круг r=5: {circle_area(5):.2f}")
    print(f"Прямоугольник 3x4: {rectangle_area(3, 4)}")
```

**`main.py`:**
```python
from geometry import circle_area, rectangle_area

print(circle_area(3))        # 28.27...
print(rectangle_area(2, 5))  # 10
```

### Пример 2. Пакет `utils` 📦

```
project/
├── main.py
└── utils/
    ├── __init__.py
    ├── text.py
    └── math_helpers.py
```

**`utils/__init__.py`:**
```python
from .text import clean, count_words
from .math_helpers import average

__all__ = ["clean", "count_words", "average"]
```

**`utils/text.py`:**
```python
def clean(s):
    return " ".join(s.split())

def count_words(s):
    return len(s.split())
```

**`utils/math_helpers.py`:**
```python
def average(nums):
    return sum(nums) / len(nums) if nums else 0
```

**`main.py`:**
```python
from utils import clean, count_words, average

text = "  много   лишних    пробелов  "
print(clean(text))                  # "много лишних пробелов"
print(count_words(text))            # 3
print(average([1, 2, 3, 4]))        # 2.5
```

### Пример 3. Сюжетный — игра 🎮

```
game/
├── main.py
└── engine/
    ├── __init__.py
    ├── characters.py
    └── battle.py
```

**`engine/characters.py`:**
```python
class Character:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp
```

**`engine/battle.py`:**
```python
def attack(attacker, defender, damage):
    defender.hp -= damage
    print(f"{attacker.name} бьёт {defender.name} на {damage}")
```

**`main.py`:**
```python
from engine.characters import Character
from engine.battle import attack

hero = Character("Герой", 100)
villain = Character("Злодей", 80)

attack(hero, villain, 30)
print(f"У {villain.name} осталось {villain.hp} HP")
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Имя файла совпадает с именем модуля"
    Файл `random.py` в вашей папке перекроет стандартный `random`.
    Не называйте свои файлы так же, как стандартные модули.

!!! warning "Ошибка 2. Циклический импорт"
    ```
    # a.py
    from b import func_b
    # b.py
    from a import func_a     # ❌ цикл!
    ```
    Разорвите цикл: перенесите общее в третий модуль или используйте
    `import b` вместо `from b import ...` (иногда помогает).

!!! warning "Ошибка 3. `__init__.py` пустой, но с относительным импортом"
    ```python
    # utils/__init__.py
    from .text import clean   # ✅ работает
    from text import clean    # ❌ не найдёт
    ```
    Внутри пакета нужны **относительные** импорты с точкой.

!!! warning "Ошибка 4. Запуск файла из папки ниже уровнем"
    ```
    project/
    └── package/
        └── main.py
    ```
    ```bash
    cd project/package
    python main.py            # ❌ не найдёт `package` (родителя)
    ```
    Лучше запускать из **корня проекта**:
    ```bash
    cd project
    python -m package.main    # ✅
    ```
    Или используйте `__name__ == "__main__"` и импорты от корня.

---

## 🧪 Упражнения

1. ⭐ Создайте `my_module.py` с функцией `hello`. Импортируйте в другом файле.
2. ⭐ Создайте `math_utils.py` с `square`, `cube`, `average`. Импортируйте все.
3. ⭐⭐ Оформите пакет `utils/` с `text.py` и `numbers.py`.
4. ⭐⭐ Используйте `__name__ == "__main__"` в своём модуле.
5. ⭐⭐ Создайте `__init__.py` с `__all__`.
6. ⭐⭐⭐ Разбейте программу на 3+ модуля: `models.py`, `logic.py`, `main.py`.

---

## 🔗 Что дальше

→ [pip](pip.md) — сторонние библиотеки.