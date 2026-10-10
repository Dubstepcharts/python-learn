# import

!!! abstract "Уровень: ⭐ Начальный → ⭐⭐ Средний"
    Подойдёт для 7–11 класса.

---

## 🍎 Объясняем просто

!!! example "Модуль — как готовый инструмент"
    Зачем писать `sqrt` самому, если он уже есть в `math`? Можно «взять»
    готовый инструмент через `import`. Тогда в программе появятся все
    функции и классы из этого модуля.

    ```python
    import math
    print(math.sqrt(16))   # 4.0
    ```

---

## ✍️ Все формы импорта

### 1. `import module`

Импортирует модуль. Доступ — через `module.name`:

```python
import math
print(math.pi)
print(math.sqrt(25))
```

### 2. `import module as alias`

Сокращение:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

print(np.array([1, 2, 3]))
```

### 3. `from module import name`

Импортирует конкретные имена:

```python
from math import sqrt, pi
print(sqrt(16))   # 4.0
print(pi)         # 3.141592653589793
```

### 4. `from module import name as alias`

С псевдонимом:

```python
from math import sqrt as square_root
print(square_root(16))    # 4.0
```

### 5. `from module import *`

Импортирует **всё** публичное — но так делать **не надо**:

```python
from math import *
print(sqrt(16))
```

!!! warning "Почему `import *` — плохо"
    - Непонятно, что откуда пришло
    - Можно случайно перезаписать свои функции (`sum`, `min`)
    - IDE не подсказывает
    - Линтеры ругаются

    Единственное место, где иногда уместно: `from tkinter import *`
    в учебных примерах. В реальном коде — **никогда**.

### 6. `import package.submodule`

Для вложенных модулей:

```python
import os.path
print(os.path.join("a", "b"))
```

### 7. `from package.submodule import name`

```python
from os.path import join, exists
```

### 8. `importlib` — динамический импорт

Если имя модуля известно только во время работы:

```python
import importlib

name = "math"
m = importlib.import_module(name)
print(m.sqrt(16))
```

---

## 📖 Что происходит при `import`

1. Python ищет модуль в `sys.path` (текущая папка, стандартные пути, site-packages)
2. Если нашёл — **выполняет** файл модуля **один раз** и запоминает в `sys.modules`
3. Повторный `import` уже не выполняет — берёт из кеша

Можно проверить:

```python
import sys
print(sys.modules.keys())    # словарь всех уже импортированных модулей
```

Посмотреть пути поиска:

```python
import sys
print(sys.path)
```

!!! info "Подробнее: `sys.path` 🔬"
    Это **список** путей, где Python ищет модули. Первый элемент обычно —
    папка запуска скрипта. Дальше — системные пути и папка `site-packages`,
    куда `pip` ставит библиотеки.

    Можно добавить свой путь **временно**:
    ```python
    import sys
    sys.path.append("/путь/к/моим/модулям")
    ```

---

## 🔍 Примеры

### Пример 1. `math`

```python
import math

print(math.sqrt(16))     # 4.0
print(math.pi)           # 3.141592653589793
print(math.floor(3.7))   # 3
print(math.ceil(3.2))    # 4
```

### Пример 2. `random`

```python
import random

print(random.randint(1, 10))        # 1..10
print(random.choice(["а", "б"]))    # случайный
random.shuffle([1, 2, 3])           # перемешать
```

### Пример 3. Свой алиас

```python
import datetime as dt

now = dt.datetime.now()
print(now.year, now.month, now.day)
```

### Пример 4. Импорт только нужного

```python
from collections import Counter, defaultdict

c = Counter("abracadabra")
print(c.most_common(2))    # [('a', 5), ('b', 2)]
```

### Пример 5. Сюжетный — игра 🎲

```python
import random

score = 0
for _ in range(5):
    dice = random.randint(1, 6)
    print(f"Кубик: {dice}")
    score += dice

print(f"Итого: {score}")
```

---

## 📌 Относительные импорты (внутри пакета)

Внутри пакета можно импортировать «относительно»:

```python
# В файле mypackage/submodule.py
from . import helper          # из того же пакета
from .. import other          # из родительского пакета
from .utils import clean      # из mypackage/utils.py
```

- Одна точка — «текущий пакет»
- Две точки — «на уровень выше»

Работает **только внутри пакета** (папки с `__init__.py`). В обычном скрипте — не сработает.

---

## 📌 Что делать при ошибке `ModuleNotFoundError`

```python
import nonexistent_module
# ModuleNotFoundError: No module named 'nonexistent_module'
```

Возможные причины:
1. **Опечатка** в имени
2. Модуль **не установлен** — поставьте через `pip install ...`
3. Модуль **не в `sys.path`** — например, свой файл лежит в другой папке
4. **Разные окружения** — установили в глобальное, а работаете в виртуальном

Проверить, куда ставить:

```python
import sys
print(sys.executable)   # путь к текущему Python
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли импортировать"
    ```python
    print(sqrt(16))    # ❌ NameError
    ```
    Нужно сначала `from math import sqrt`.

!!! warning "Ошибка 2. Путаница имени модуля и имени функции"
    ```python
    import math
    print(sqrt(16))    # ❌ — функции sqrt ещё нет в пространстве имён
    ```
    **Правильно:** `math.sqrt(16)` или `from math import sqrt`.

!!! warning "Ошибка 3. Назвали свой файл как модуль"
    Если создать файл `random.py` в папке проекта, `import random` загрузит
    **ваш** файл, а не стандартный! Никогда не называйте свои файлы именами
    стандартных модулей (`random.py`, `math.py`, `json.py`, `os.py`...).

!!! warning "Ошибка 4. `import *` перезаписывает функции"
    ```python
    from math import *     # здесь тоже есть sum? нет. А в других модулях — да
    ```
    Пример: `from tkinter import *` может затереть `print` или `list`.

!!! warning "Ошибка 5. Импорт внутри функции без причины"
    ```python
    def f():
        import math       # работает, но зачем?
        return math.sqrt(2)
    ```
    Импорт внутри функции — для **ленивой** загрузки (когда модуль тяжёлый
    и нужен редко). В обычном коде — импортируйте сверху файла.

---

## 🧪 Упражнения

1. ⭐ Импортируйте `math` и выведите `pi`, `e`, `sqrt(2)`.
2. ⭐ Импортируйте `random` и сгенерируйте 5 случайных чисел.
3. ⭐⭐ Импортируйте `datetime as dt` и выведите текущую дату.
4. ⭐⭐ Импортируйте только `Counter` из `collections`.
5. ⭐⭐ Динамически загрузите модуль по имени строки через `importlib`.
6. ⭐⭐⭐ Создайте файл `my_module.py` с функцией `add`, импортируйте его в другом файле и вызовите функцию.

---

## 🔗 Что дальше

→ [Свои модули](custom-modules.md) — как делать свои.