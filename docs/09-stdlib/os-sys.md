# os, sys, pathlib

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса.

---

## 🍎 Объясняем просто

!!! example "Модули «общения» с системой"
    - **`os`** — работать с файлами, папками, переменными окружения
    - **`sys`** — общаться с самим Python: аргументы командной строки, версия, пути поиска модулей
    - **`pathlib`** — современные пути (см. [Файлы](../06-files-errors/files.md))

    ```python
    import os, sys
    print(os.getcwd())      # текущая папка
    print(sys.version)      # версия Python
    ```

---

## 🗂️ Модуль `os` — основные функции

### Файлы и папки

| Функция | Что делает |
|---|---|
| `os.getcwd()` | Текущая папка |
| `os.chdir(path)` | Перейти в папку |
| `os.listdir(path=".")` | Список файлов и папок |
| `os.mkdir(path)` | Создать папку |
| `os.makedirs(path, exist_ok=False)` | Создать со всеми родителями |
| `os.rmdir(path)` | Удалить пустую папку |
| `os.removedirs(path)` | Удалить с родителями |
| `os.remove(path)` | Удалить файл |
| `os.unlink(path)` | То же (низкоуровневое) |
| `os.rename(src, dst)` | Переименовать |
| `os.replace(src, dst)` | Переименовать с заменой |
| `os.stat(path)` | Метаданные |
| `os.chmod(path, mode)` | Изменить права |
| `os.chown(path, uid, gid)` | Сменить владельца (Unix) |
| `os.symlink(src, dst)` | Создать симлинк |
| `os.readlink(path)` | Прочитать симлинк |
| `os.walk(top)` | Обойти дерево каталогов |

```python
import os

print(os.getcwd())               # F:\project
print(os.listdir("."))           # список файлов

os.mkdir("new_folder")
os.makedirs("a/b/c", exist_ok=True)

for root, dirs, files in os.walk("."):
    print(root, dirs, files)
```

### `os.path` — операции с путями

| Функция | Что делает |
|---|---|
| `os.path.join(a, b, ...)` | Склеить путь |
| `os.path.exists(p)` | Существует? |
| `os.path.isfile(p)` | Файл? |
| `os.path.isdir(p)` | Папка? |
| `os.path.islink(p)` | Симлинк? |
| `os.path.getsize(p)` | Размер (байт) |
| `os.path.abspath(p)` | Абсолютный путь |
| `os.path.basename(p)` | Имя файла |
| `os.path.dirname(p)` | Папка |
| `os.path.splitext(p)` | (без расширения, расширение) |
| `os.path.normpath(p)` | Нормализовать |
| `os.path.relpath(p, start)` | Относительный путь |
| `os.path.samefile(a, b)` | Тот же файл? |
| `os.path.getmtime(p)` | Время изменения |
| `os.path.getatime(p)` | Время доступа |
| `os.path.getctime(p)` | Время создания |
| `os.path.expanduser("~")` | Домашняя папка |
| `os.path.expandvars("$HOME")` | Переменные окружения |

!!! tip "`pathlib` — современная замена"
    Многие функции `os.path` дублируются методами `Path`:
    ```python
    from pathlib import Path
    p = Path("data") / "file.txt"
    p.exists()
    p.is_file()
    p.stat().st_size
    ```
    Для нового кода — используйте `pathlib`.

### Переменные окружения

```python
import os

print(os.environ)                       # все переменные (dict-like)
print(os.environ.get("PATH"))           # одна переменная
os.environ["MY_VAR"] = "123"            # временно установить
print(os.getenv("MY_VAR", "default"))   # с дефолтом
```

### Процессы

| Функция | Что делает |
|---|---|
| `os.system(cmd)` | Запустить команду в shell |
| `os.popen(cmd)` | Открыть канал к команде |
| `os.getpid()` | PID процесса |
| `os.getppid()` | PID родителя |
| `os.getuid()` | UID (Unix) |
| `os.getlogin()` | Имя пользователя |
| `os.cpu_count()` | Сколько CPU |
| `os.name` | `'posix'` / `'nt'` |

```python
print(os.name)          # 'nt' на Windows, 'posix' на Linux/mac
print(os.cpu_count())   # например, 8
```

### Разное

| Функция | Что делает |
|---|---|
| `os.urandom(n)` | n случайных байт (крипто) |
| `os.get_terminal_size()` | Размер терминала |
| `os.linesep` | Разделитель строк (`\n` / `\r\n`) |
| `os.sep` | Разделитель пути (`/` / `\`) |
| `os.pathsep` | Разделитель PATH (`:` / `;`) |

---

## 🐍 Модуль `sys` — про сам Python

| Имя | Что даёт |
|---|---|
| `sys.argv` | Аргументы командной строки (список) |
| `sys.exit(code=0)` | Выход из программы |
| `sys.version` | Версия Python (строка) |
| `sys.version_info` | Версия (кортеж) |
| `sys.platform` | Платформа (`'win32'`, `'linux'`, `'darwin'`) |
| `sys.path` | Пути поиска модулей (список) |
| `sys.modules` | Уже импортированные модули (dict) |
| `sys.executable` | Путь к Python |
| `sys.stdin` | Стандартный ввод |
| `sys.stdout` | Стандартный вывод |
| `sys.stderr` | Стандартный поток ошибок |
| `sys.getrecursionlimit()` | Лимит рекурсии |
| `sys.setrecursionlimit(n)` | Установить лимит |
| `sys.getsizeof(obj)` | Размер объекта в байтах |
| `sys.maxsize` | Максимальное «обычное» число |
| `sys.float_info` | Информация о float |
| `sys.int_info` | Информация о int |
| `sys.byteorder` | Порядок байт (`'little'` / `'big'`) |
| `sys.implementation` | Реализация Python (CPython и т.д.) |

### `sys.argv` — аргументы командной строки

Запуск: `python script.py hello 42`

```python
import sys

print(sys.argv)
# ['script.py', 'hello', '42']

if len(sys.argv) > 1:
    print(f"Привет, {sys.argv[1]}!")
```

`sys.argv[0]` — имя скрипта. Дальше — то, что ввёл пользователь.

### `sys.exit()`

```python
import sys

if not user_authorized:
    print("Нет доступа", file=sys.stderr)
    sys.exit(1)   # 0 — успех, ненулевое — ошибка
```

### Перенаправление вывода

```python
import sys

with open("log.txt", "w", encoding="utf-8") as f:
    print("Это уйдёт в файл", file=f)

print("Это в stderr", file=sys.stderr)
```

### Потоки ввода-вывода

```python
import sys

# Читать весь stdin
data = sys.stdin.read()

# Читать построчно
for line in sys.stdin:
    print("Получено:", line.rstrip())
```

---

## 💡 Примеры

### Пример 1. Программа-калькулятор из командной строки 🧮

Запуск: `python calc.py 5 + 3`

```python
import sys

if len(sys.argv) != 4:
    print("Использование: python calc.py a + b")
    sys.exit(1)

a = float(sys.argv[1])
op = sys.argv[2]
b = float(sys.argv[3])

ops = {"+": a + b, "-": a - b, "*": a * b, "/": a / b if b else None}
print(ops.get(op, "Неизвестный оператор"))
```

### Пример 2. Список файлов в папке 📂

```python
import os

for name in sorted(os.listdir(".")):
    if os.path.isfile(name):
        size = os.path.getsize(name)
        print(f"{size:>10} {name}")
```

### Пример 3. Сюжетный — счётчик запусков 🚀

```python
import os
from pathlib import Path

counter_file = Path.home() / ".my_program_counter"
count = int(counter_file.read_text()) if counter_file.exists() else 0
count += 1
counter_file.write_text(str(count))
print(f"Программа запускалась {count} раз")
```

### Пример 4. Чистая папка для работы 🧹

```python
from pathlib import Path
import shutil

work = Path("temp_work")
if work.exists():
    shutil.rmtree(work)
work.mkdir()

print(f"Создана папка: {work.absolute()}")
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `os.listdir` не сортирует"
    Порядок зависит от файловой системы. Если он важен — `sorted(...)`.

!!! warning "Ошибка 2. Удаление непустой папки через `os.rmdir`"
    ```python
    os.rmdir("folder_with_files")   # ❌ OSError
    ```
    Удаляйте через `shutil.rmtree(...)`.

!!! warning "Ошибка 3. Относительные пути зависят от `cwd`"
    ```python
    open("file.txt")    # работает, если запускать из нужной папки
    ```
    Надёжнее — абсолютные пути через `Path(__file__).parent`.

!!! warning "Ошибка 4. Пути в стиле Windows на Linux"
    ```python
    open("data\\file.txt")   # ❌ на Linux
    ```
    Используйте `pathlib` или `os.path.join`.

!!! warning "Ошибка 5. `sys.argv[1]` без проверки"
    ```python
    name = sys.argv[1]       # ❌ IndexError, если не передали
    name = sys.argv[1] if len(sys.argv) > 1 else "гость"
    ```

---

## 🧪 Упражнения

1. ⭐ Выведите текущую папку и её содержимое.
2. ⭐ Выведите версию Python и платформу.
3. ⭐⭐ Создайте папку `test`, в ней файл `hello.txt`, выведите её размер.
4. ⭐⭐ Пройдите `os.walk(".")` и посчитайте общее число файлов.
5. ⭐⭐ Программа-калькулятор с аргументами командной строки.
6. ⭐⭐⭐ Скрипт «счетчик запусков», хранящий число в файле.
7. ⭐⭐⭐ Копия папки через `shutil.copytree` с прогрессом.

---

## 🔗 Что дальше

→ [json](json.md) — сохранение структурированных данных.