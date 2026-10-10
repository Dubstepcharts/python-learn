# Работа с файлами

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса. Нужно знать: [строки](../03-strings/index.md).

---

## 🍎 Объясняем просто

!!! example "Файл — как тетрадь на полке"
    Открыть тетрадь (`open`) → прочитать или записать (`read` / `write`) →
    закрыть (`close`). Пока тетрадь открыта, другие не могут в неё писать.
    Поэтому закрывать — важно. Чтобы не забыть — есть `with`.

---

## 📖 Как открыть файл

Функция `open(путь, режим, encoding=...)` возвращает **файловый объект**.

```python
f = open("example.txt", "r", encoding="utf-8")
content = f.read()
f.close()
```

!!! tip "Кодировка — почти всегда UTF-8"
    Если не указать `encoding`, Python использует системную кодировку. На
    Windows это может быть `cp1251`, на Linux — `utf-8`. Из-за этого один
    и тот же файл может открываться по-разному. **Всегда указывайте
    `encoding="utf-8"` явно.**

---

## 🎛️ Режимы открытия

| Режим | Значит | Если файла нет | Что делает |
|---|---|---|---|
| `"r"` | Read | Ошибка | Читает |
| `"w"` | Write | Создаёт | **Стирает** старьё и пишет заново |
| `"a"` | Append | Создаёт | Дописывает в конец |
| `"x"` | eXclusive | Ошибка | Создаёт, но только если файла нет |
| `"b"` | Binary | — | Байты, не текст |
| `"t"` | Text (по умолчанию) | — | Текст |
| `"+"` | Update | — | И чтение, и запись |

Можно комбинировать: `"rb"` (read binary), `"w+"` (write + read), `"ab"` (append binary).

```python
# Простое чтение
with open("file.txt", "r", encoding="utf-8") as f:
    data = f.read()

# Запись «с нуля»
with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Привет\n")

# Дописать в конец
with open("file.txt", "a", encoding="utf-8") as f:
    f.write("Ещё строка\n")

# Бинарный файл (картинка, архив)
with open("image.png", "rb") as f:
    raw = f.read()
```

!!! warning "`"w"` стирает файл!"
    ```python
    with open("важный.txt", "w") as f:
        f.write("...")
    ```
    Как только файл открыт в режиме `"w"` — старое содержимое **обнуляется**.
    Даже если ничего не напишете. Если нужно сохранить — используйте `"a"`.

---

## 📥 Чтение файла

### Три основных способа

```python
# 1. Весь файл в одну строку
with open("file.txt", encoding="utf-8") as f:
    text = f.read()
print(text)

# 2. Список строк (с \n на конце)
with open("file.txt", encoding="utf-8") as f:
    lines = f.readlines()
print(lines)   # ['первая\n', 'вторая\n']

# 3. Строка за строкой (память экономится)
with open("file.txt", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())   # rstrip убирает \n
```

### Прочитать N символов

```python
with open("file.txt", encoding="utf-8") as f:
    chunk = f.read(100)      # первые 100 символов
```

### Вернуться в начало

```python
with open("file.txt", encoding="utf-8") as f:
    first = f.read(10)
    f.seek(0)                # в начало
    all_text = f.read()
```

!!! info "Подробнее: `f.seek()` и `f.tell()` 🔬"
    - `f.tell()` — текущая позиция (в байтах от начала)
    - `f.seek(pos)` — переместиться в позицию
    - `f.seek(0)` — в начало
    - `f.seek(0, 2)` — в конец (2 = SEEK_END)
    
    В текстовом режиме `seek` работает только для простых смещений
    (например, `0`). Для произвольного доступа используйте бинарный режим.

---

## 📤 Запись в файл

```python
with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Первая строка\n")
    f.write("Вторая строка\n")

# Список строк одной командой
lines = ["раз\n", "два\n", "три\n"]
with open("file.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)
```

!!! warning "`write` не добавляет `\n`!"
    `write("привет")` запишет ровно `привет` — без переноса.
    Если нужна новая строка — пишите `\n` вручную или используйте `print(..., file=f)`:
    ```python
    with open("file.txt", "w", encoding="utf-8") as f:
        print("Строка 1", file=f)
        print("Строка 2", file=f)
    ```

---

## 🎯 Все методы файлового объекта

| Метод | Что делает |
|---|---|
| `read(size=-1)` | Читать всё или `size` символов |
| `readline(size=-1)` | Прочитать одну строку |
| `readlines(hint=-1)` | Все строки в список |
| `write(s)` | Записать строку |
| `writelines(iter)` | Записать список строк |
| `seek(pos, whence=0)` | Переместить указатель |
| `tell()` | Текущая позиция |
| `flush()` | Сбросить буфер на диск |
| `close()` | Закрыть файл |
| `truncate(size=None)` | Обрезать файл |
| `fileno()` | Файловый дескриптор ОС |
| `isatty()` | Связан ли с терминалом |
| `readable()` | Можно ли читать? |
| `writable()` | Можно ли писать? |
| `seekable()` | Поддерживает ли seek? |

Также файловый объект — **итератор**: можно идти `for line in f`.

!!! tip "`flush` — когда нужно"
    Обычно Python пишет на диск с задержкой (буферизация). Если файл
    должен быть виден другим программам **немедленно** — вызывайте
    `f.flush()`. При `with` это произойдёт автоматически при закрытии.

---

## 🔐 `with` — менеджер контекста

Гарантирует закрытие файла даже при ошибке:

```python
with open("file.txt", encoding="utf-8") as f:
    data = f.read()
# Здесь файл уже закрыт, даже если внутри было исключение
```

Сравните:

```python
# Плохо: если что-то упадёт — файл останется открытым
f = open("file.txt")
data = f.read()
f.close()

# Хорошо
with open("file.txt") as f:
    data = f.read()
```

Можно открыть **несколько** файлов сразу:

```python
with open("in.txt", encoding="utf-8") as fin, \
     open("out.txt", "w", encoding="utf-8") as fout:
    for line in fin:
        fout.write(line.upper())
```

!!! info "Подробнее: как работает `with` 🔬"
    `with` вызывает у объекта методы `__enter__` и `__exit__`.
    `open(...)` возвращает объект, у которого эти методы есть.
    Свой контекстный менеджер — см. [раздел про декораторы](../05-functions/decorators.md#contextlibcontextmanager).

---

## 📂 `pathlib` — современные пути

Модуль `pathlib` (Python 3.4+) заменяет «ручную» работу с путями через строки.

```python
from pathlib import Path

p = Path("data") / "file.txt"       # / для склейки путей — красиво!
print(p)                             # data/file.txt
print(p.name)                        # file.txt
print(p.stem)                        # file
print(p.suffix)                      # .txt
print(p.parent)                      # data
print(p.exists())                    # True/False
print(p.is_file())                   # True/False
print(p.is_dir())                    # True/False
print(p.absolute())                  # полный путь
```

### Чтение и запись

```python
from pathlib import Path

p = Path("file.txt")

# Читать весь файл
text = p.read_text(encoding="utf-8")

# Записать
p.write_text("Привет, мир!", encoding="utf-8")

# Прочитать строки
lines = p.read_text(encoding="utf-8").splitlines()

# Записать строки
p.write_text("\n".join(["раз", "два", "три"]), encoding="utf-8")

# Бинарный
raw = p.read_bytes()
p.write_bytes(b"\x00\x01")
```

### Обход папок

```python
from pathlib import Path

folder = Path("data")

# Все файлы и папки внутри
for entry in folder.iterdir():
    print(entry)

# Только файлы
for f in folder.iterdir():
    if f.is_file():
        print(f)

# Рекурсивно: все .txt-файлы
for f in folder.rglob("*.txt"):
    print(f)

# Создать папку
Path("new_folder").mkdir(exist_ok=True)          # без ошибки, если есть
Path("a/b/c").mkdir(parents=True, exist_ok=True) # со всеми родителями

# Удалить
Path("file.txt").unlink(missing_ok=True)
Path("folder").rmdir()                            # только пустую
```

### Все методы и свойства `Path`

| Свойство/метод | Что даёт |
|---|---|
| `name` | Имя файла |
| `stem` | Имя без расширения |
| `suffix` | Расширение (.txt) |
| `suffixes` | Все расширения (для `.tar.gz`) |
| `parent` | Родительская папка |
| `parents` | Все родители (итератор) |
| `parts` | Кортеж частей пути |
| `exists()` | Существует? |
| `is_file()` | Файл? |
| `is_dir()` | Папка? |
| `is_symlink()` | Символическая ссылка? |
| `absolute()` | Абсолютный путь |
| `resolve()` | Канонический путь |
| `samefile(other)` | Это тот же файл? |
| `iterdir()` | Итератор содержимого |
| `glob(pattern)` | Поиск по шаблону |
| `rglob(pattern)` | Рекурсивный поиск |
| `mkdir(...)` | Создать папку |
| `rmdir()` | Удалить пустую папку |
| `unlink()` | Удалить файл |
| `touch()` | Создать пустой файл |
| `rename(target)` | Переименовать |
| `replace(target)` | Переименовать с заменой |
| `read_text()` | Прочитать текст |
| `read_bytes()` | Прочитать байты |
| `write_text(s)` | Записать текст |
| `write_bytes(b)` | Записать байты |
| `stat()` | Метаданные (размер, время) |
| `chmod(mode)` | Изменить права |
| `with_name(name)` | Копия пути с другим именем |
| `with_suffix(suf)` | Копия с другим расширением |
| `joinpath(*parts)` | Склеить путь |
| `as_posix()` | Путь со слэшами `/` |
| `match(pattern)` | Проверка по шаблону |

---

## 🧩 Модуль `io` — файлы «в памяти»

Иногда файл нужен не на диске, а как строка:

```python
import io

# Текстовый «файл» в памяти
buf = io.StringIO()
buf.write("Привет\n")
buf.write("Мир\n")
print(buf.getvalue())    # "Привет\nМир\n"

# Читать, как обычный файл
buf.seek(0)
for line in buf:
    print(line)

# Байтовый «файл» в памяти
raw = io.BytesIO()
raw.write(b"\x00\x01\x02")
print(raw.getvalue())    # b'\x00\x01\x02'
```

Полезно для тестов и для функций, которые ждут «файл», а у нас — строка.

---

## 🗂️ `shutil` — операции с файлами и папками

```python
import shutil

# Копировать файл
shutil.copy("src.txt", "dst.txt")           # с метаданными
shutil.copy2("src.txt", "dst.txt")          # с датами
shutil.copyfile("src.txt", "dst.txt")       # только содержимое

# Копировать папку целиком
shutil.copytree("src_dir", "dst_dir")

# Переместить файл/папку
shutil.move("src.txt", "dst.txt")

# Удалить папку со всем содержимым
shutil.rmtree("folder")

# Размер папки
total = shutil.disk_usage(".")               # (total, used, free)

# Получить путь к архиватору
shutil.which("python")
```

---

## 🧪 `tempfile` — временные файлы

```python
import tempfile

# Временный файл (удаляется при закрытии)
with tempfile.NamedTemporaryFile("w", encoding="utf-8", delete=True) as f:
    f.write("Временные данные")
    f.flush()
    print(f.name)

# Временная папка
with tempfile.TemporaryDirectory() as d:
    print(d)   # удалится автоматически
```

Полезно для тестов, промежуточных данных, «песочниц».

---

## 📌 Модуль `os.path` — старый способ (но ещё в ходу)

```python
import os

os.path.join("data", "file.txt")      # 'data/file.txt' или 'data\\file.txt'
os.path.exists("file.txt")            # True/False
os.path.isfile("file.txt")
os.path.isdir("folder")
os.path.getsize("file.txt")           # размер в байтах
os.path.abspath("file.txt")           # абсолютный путь
os.path.basename("/a/b/c.txt")        # 'c.txt'
os.path.dirname("/a/b/c.txt")         # '/a/b'
os.path.splitext("file.txt")          # ('file', '.txt')
```

**Совет:** новый код лучше писать на `pathlib`. `os.path` — для поддержки старого кода и некоторых узких случаев.

---

## 💡 Примеры

### Пример 1. Блокнот 📝

```python
with open("notes.txt", "w", encoding="utf-8") as f:
    while True:
        line = input("Заметка (пусто — выход): ")
        if not line:
            break
        f.write(line + "\n")

print("Сохранено!")
```

### Пример 2. Подсчёт строк 🔢

```python
with open("file.txt", encoding="utf-8") as f:
    count = sum(1 for _ in f)

print(f"Строк: {count}")
```

### Пример 3. Сюжетный — журнал оценок 🎓

```python
grades = {"Аня": [5, 4, 5], "Борис": [3, 4, 3]}

with open("grades.txt", "w", encoding="utf-8") as f:
    for name, marks in grades.items():
        avg = sum(marks) / len(marks)
        f.write(f"{name}: {avg:.2f}\n")

# Прочитать обратно
with open("grades.txt", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())
```

### Пример 4. Копирование файлов 🗂️

```python
from pathlib import Path
import shutil

src = Path("source")
dst = Path("backup")
dst.mkdir(exist_ok=True)

for file in src.glob("*.txt"):
    shutil.copy(file, dst / file.name)
    print(f"Скопирован {file.name}")
```

### Пример 5. Поиск самого большого файла 🔍

```python
from pathlib import Path

folder = Path(".")
files = [(f, f.stat().st_size) for f in folder.rglob("*") if f.is_file()]
files.sort(key=lambda x: x[1], reverse=True)

for f, size in files[:5]:
    print(f"{size:>10} {f}")
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `encoding`"
    ```python
    with open("file.txt") as f:      # ❌ на Windows может быть cp1251
        text = f.read()
    ```
    **Всегда:** `encoding="utf-8"`.

!!! warning "Ошибка 2. Не закрыли файл"
    ```python
    f = open("file.txt")
    data = f.read()
    # забыли f.close()
    ```
    Используйте `with`.

!!! warning "Ошибка 3. Открыли в `"w"` — потеряли данные"
    ```python
    with open("важный.txt", "w") as f:
        pass       # файл обнулён!
    ```

!!! warning "Ошибка 4. `readlines` съедает память"
    Если файл в гигабайт — `readlines` вернёт список всех строк и всё это
    окажется в памяти. Лучше `for line in f:`.

!!! warning "Ошибка 5. Пути как строки"
    ```python
    path = "data" + "/" + "file.txt"   # работает, но плохо
    ```
    Используйте `pathlib`:
    ```python
    from pathlib import Path
    path = Path("data") / "file.txt"
    ```

---

## 🧪 Упражнения

1. ⭐ Запишите в файл три строки. Прочитайте обратно и распечатайте.
2. ⭐ Спросите имя, допишите приветствие в файл (режим `"a"`).
3. ⭐⭐ Подсчитайте, сколько строк в файле и сколько в нём слов.
4. ⭐⭐ Скопируйте файл в другой с другим именем через `shutil`.
5. ⭐⭐ Найдите все `.txt`-файлы в папке через `pathlib.rglob`.
6. ⭐⭐⭐ Прочитайте CSV-файл построчно и сложите все числа из первой колонки.
7. ⭐⭐⭐ Напишите программу-«дневник»: пользователь вводит записи, они сохраняются в файл с датой.

---

## 🔗 Что дальше

→ [Исключения](exceptions.md) — как справляться с ошибками вместо падений.