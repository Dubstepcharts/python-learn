# Ошибки импорта и путей

Python не может найти модуль или файл. Такие ошибки пугают новичков, но
решаются быстро.

---

## ❌ `ModuleNotFoundError: No module named 'requests'`

**Что видишь:**

```
ModuleNotFoundError: No module named 'requests'
```

**Почему:** библиотека **не установлена**.

**Как исправить:**

```bash
pip install requests
```

Если не сработало:

```bash
python -m pip install requests
```

Если используете виртуальное окружение — **сначала активируйте**:

```powershell
.\.venv\Scripts\Activate.ps1     # Windows
source .venv/bin/activate          # macOS/Linux
```

Затем:

```bash
pip install requests
```

**Проверить, где стоит:**

```bash
pip show requests
```

Вывод покажет путь — он должен указывать внутрь вашего `.venv`.

---

## ❌ `ModuleNotFoundError: No module named 'my_module'`

**Почему:** ваш собственный модуль **не в той папке**.

```
project/
├── main.py
└── src/
    └── helpers.py
```

```python
# main.py
import helpers           # ❌ не найдёт — файл в src/
```

**Как исправить:**

```python
from src import helpers
# или
import sys
sys.path.append("src")
import helpers
```

Лучше — держите модули **рядом** с `main.py` или оформите **пакет** с
`__init__.py`.

---

## ❌ `ModuleNotFoundError: No module named 'random'` (встроенный!)

**Почему:** вы создали **свой файл** с таким именем.

```
project/
├── main.py
└── random.py          # ← ваш файл перекрывает стандартный
```

```python
# main.py
import random             # загрузит ВАШ random.py, не стандартный!
```

**Как исправить:** **переименуйте свой файл**. Никогда не называйте
свои файлы так же, как стандартные модули:

- `random.py`
- `math.py`
- `json.py`
- `os.py`
- `sys.py`
- `csv.py`
- `email.py`
- `queue.py`
- `socket.py`
- `select.py`
- `types.py`
- `test.py`

**Правило:** имя своего файла не должно совпадать с именем библиотеки.

---

## ❌ `ImportError: cannot import name 'X' from 'Y'`

**Что видишь:**

```
ImportError: cannot import name 'sqrt' from 'math'
```

**Почему:** модуль есть, но **такого имени в нём нет**.

Возможные причины:

1. **Опечатка.** Проверьте: `sqr` vs `sqrt`.
2. **Новая версия.** В вашей версии библиотеки функции ещё/уже нет.
3. **Не установили всё.** Например, `from PIL import Image` работает
   только если стоит `Pillow`.

**Как исправить:**

```bash
# Проверить содержимое модуля
python -c "import math; print(dir(math))"
```

Или посмотреть документацию.

---

## ❌ `ImportError: attempted relative import with no known parent package`

**Почему:** используете **относительный импорт** (`.module`) в скрипте,
который **не является частью пакета**.

```
project/
└── main.py

# main.py
from . import helpers      # ❌ не работает
```

**Как исправить:** для скрипта — **обычный** импорт:

```python
from helpers import something
```

Относительный импорт работает только **внутри пакета** с `__init__.py`.

---

## ❌ `FileNotFoundError: [Errno 2] No such file or directory: 'data.csv'`

**Что видишь:**

```
FileNotFoundError: [Errno 2] No such file or directory: 'data.csv'
```

**Почему:** Python **не нашёл файл** в текущей папке.

**Как исправить:**

1. Проверьте, что файл **есть** рядом с вашим `.py`.
2. Проверьте, что запускаете из **правильной папки**:

```bash
python -c "import os; print(os.getcwd())"
```

3. Используйте **абсолютный путь**:

```python
from pathlib import Path
path = Path(__file__).parent / "data.csv"
with open(path, encoding="utf-8") as f:
    ...
```

**`Path(__file__).parent`** — папка, где лежит ваш скрипт. Надёжнее, чем
относительный путь.

---

## ❌ `IsADirectoryError: [Errno 21] Is a directory`

**Что видишь:**

```
IsADirectoryError: [Errno 21] Is a directory: 'data'
```

**Почему:** пытаетесь **открыть папку** как файл.

```python
with open("data", "r") as f:      # ❌ data — папка
```

**Как исправить:** укажите **файл** внутри:

```python
with open("data/file.txt", "r") as f:
    ...
```

---

## ❌ `PermissionError: [Errno 13] Permission denied`

**Что видишь:**

```
PermissionError: [Errno 13] Permission denied: 'file.txt'
```

**Почему:**

1. Файл **открыт в другой программе** (Excel, Word, другой процесс).
2. Нет **прав** на запись.
3. Файл **только для чтения**.

**Как исправить:**

1. Закройте файл в других программах.
2. Проверьте права: `ls -l file.txt`.
3. Запустите от имени администратора (не рекомендуется, ищите причину).

---

## ❌ `UnicodeDecodeError: 'utf-8' codec can't decode ...`

Уже разбирали в [runtime.md](runtime.md#unicodedecodeerror). Повторим:

**Причина:** файл в другой кодировке.

**Решение:**

```python
with open("file.txt", encoding="cp1251") as f:
    ...
```

Или пересохраните файл в UTF-8.

---

## ❌ `OSError: [Errno 28] No space left on device`

**Почему:** закончилось место на диске.

**Как исправить:** почистите диск. `df -h` (Linux/macOS) или проверьте
свободное место в «Проводнике» (Windows).

---

## 📌 Как избежать проблем с путями

### Правило 1. Всегда `encoding="utf-8"`

```python
open("file.txt", encoding="utf-8")
```

### Правило 2. Используйте `pathlib`

```python
from pathlib import Path

base = Path(__file__).parent
file = base / "data" / "file.txt"
text = file.read_text(encoding="utf-8")
```

### Правило 3. Проверяйте существование

```python
if not file.exists():
    print(f"Файл не найден: {file}")
    return
```

### Правило 4. Не запускайте из «неправильной» папки

В VS Code открывайте **всю папку проекта**, а не отдельный файл. Тогда
`cwd` всегда правильный.

---

## ⚠️ Частые ошибки в этой категории

!!! warning "Свои файлы как `random.py`, `json.py`"
    Перекрывают стандартные модули. Переименуйте.

!!! warning "Забыли активировать venv"
    `pip install` поставил библиотеку **в глобальный Python**, а вы
    запускаете из venv. Проверьте `which python` / `where python`.

!!! warning "Относительный путь и `cwd`"
    `open("data.csv")` ищет в **текущей** папке, а не рядом со скриптом.
    Используйте `Path(__file__).parent`.

!!! warning "Файл открыт в Excel"
    `PermissionError` при `to_excel` — закройте файл.

!!! warning "Пробелы в путях"
    ```python
    open("C:/Users/My Folder/file.txt")     # работает
    open(C:\Users\...)                       # ❌
    ```
    Используйте `/` или `Path`.

---

## 🔗 Что дальше

→ [Ошибки окружения](environment.md).