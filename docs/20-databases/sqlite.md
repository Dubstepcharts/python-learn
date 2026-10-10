# SQLite в Python

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [основы SQL](sql-basics.md), [файлы](../06-files-errors/files.md).

---

## 🍎 Объясняем просто

!!! example "SQLite — база данных в одном файле"
    Не нужен сервер. Не нужны настройки. Вся база — один файл `mydb.db`
    рядом с программой. Python уже умеет с ним работать **из коробки**.
    
    ```python
    import sqlite3
    conn = sqlite3.connect("mydb.db")
    ```

**Где используется:** браузеры (Chrome, Firefox), мобильные приложения
(Android, iOS), встроенные системы, маленькие сайты. Это **самая
распространённая** база данных в мире.

---

## 📌 Подключение

```python
import sqlite3

# К файлу (создастся, если нет)
conn = sqlite3.connect("mydb.db")

# В памяти (для тестов)
conn = sqlite3.connect(":memory:")

conn.close()
```

---

## 📌 Курсор

**Курсор** — «рука», через которую выполняются запросы и забираются данные.

```python
cursor = conn.cursor()
cursor.execute("SELECT 1 + 1")
print(cursor.fetchone())     # (2,)
```

Или проще — `conn.execute(...)` без явного курсора.

---

## 📌 Выполнение запросов

```python
conn = sqlite3.connect("school.db")

# Создание таблицы
conn.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        name  TEXT NOT NULL,
        class TEXT NOT NULL,
        age   INTEGER
    )
""")

# Вставка
conn.execute(
    "INSERT INTO students (name, class, age) VALUES (?, ?, ?)",
    ("Аня", "7А", 12),
)

# Не забыть сохранить!
conn.commit()
```

!!! warning "Забыли `commit()`"
    Без `commit()` изменения **не сохранятся**, если закрыть программу.

### Несколько строк сразу — `executemany`

```python
data = [
    ("Борис", "7А", 11),
    ("Вика", "7Б", 13),
    ("Глеб", "7Б", 12),
]
conn.executemany(
    "INSERT INTO students (name, class, age) VALUES (?, ?, ?)",
    data,
)
conn.commit()
```

---

## 📌 Чтение данных

```python
cur = conn.execute("SELECT id, name, class FROM students")

row = cur.fetchone()          # одна строка (кортеж) или None
rows = cur.fetchmany(2)       # до 2 строк
rows = cur.fetchall()         # все оставшиеся
```

Простейший вариант — итерация:

```python
for row in conn.execute("SELECT * FROM students"):
    print(row)
```

### С именами столбцов

По умолчанию строки — кортежи. Чтобы обращаться по имени:

```python
conn.row_factory = sqlite3.Row

for row in conn.execute("SELECT * FROM students"):
    print(row["name"], row["class"])
```

Работает как словарь, но с кортежными индексами тоже.

---

## 📌 Параметризованные запросы (важно!)

!!! warning "⚠️ Никогда не подставляйте значения через f-строку"
    ```python
    # ❌ ОПАСНО — SQL-инъекция
    name = input("Имя: ")
    conn.execute(f"SELECT * FROM students WHERE name = '{name}'")
    ```
    
    Если пользователь введёт `'; DROP TABLE students; --` — таблица исчезнет.

**Правильно** — через параметры:

```python
# ✅ Безопасно — с ?
conn.execute("SELECT * FROM students WHERE name = ?", (name,))

# ✅ С именованными
conn.execute(
    "SELECT * FROM students WHERE name = :name AND class = :cls",
    {"name": name, "cls": "7А"},
)

# ✅ Для executemany
conn.executemany(
    "INSERT INTO students (name, class) VALUES (?, ?)",
    [("Аня", "7А"), ("Борис", "7А")],
)
```

SQLite сам «экранирует» значения — инъекция невозможна.

---

## 📌 Транзакции

По умолчанию SQLite открывает транзакцию **автоматически** перед первым
изменением. Закрывается при `commit()` или откатывается при `rollback()`.

```python
try:
    conn.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    conn.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    conn.commit()
except Exception as e:
    conn.rollback()
    print(f"Ошибка, откат: {e}")
```

Или контекстный менеджер (коммит при выходе, откат при ошибке):

```python
with conn:
    conn.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    conn.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
```

`with conn` — именно для транзакций, **не закрывает** соединение.

---

## 📌 Полный пример — мини-журнал

```python
import sqlite3
from pathlib import Path

DB = Path("school.db")

def init_db():
    with sqlite3.connect(DB) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                name  TEXT NOT NULL,
                class TEXT NOT NULL,
                age   INTEGER CHECK (age >= 5 AND age <= 20)
            )
        """)

def add_student(name, cls, age):
    with sqlite3.connect(DB) as conn:
        conn.execute(
            "INSERT INTO students (name, class, age) VALUES (?, ?, ?)",
            (name, cls, age),
        )

def list_students():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    for row in conn.execute("SELECT * FROM students ORDER BY class, name"):
        print(f"#{row['id']:>3}  {row['name']:<10} {row['class']}  {row['age']}")
    conn.close()

def find_by_class(cls):
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT * FROM students WHERE class = ?", (cls,)
    ).fetchall()
    conn.close()
    return rows

def delete_student(sid):
    with sqlite3.connect(DB) as conn:
        conn.execute("DELETE FROM students WHERE id = ?", (sid,))

if __name__ == "__main__":
    init_db()
    add_student("Аня", "7А", 12)
    add_student("Борис", "7А", 11)
    add_student("Вика", "7Б", 13)
    list_students()

    print("\n7А:")
    for row in find_by_class("7А"):
        print(" ", row["name"])

    delete_student(2)
    print("\nПосле удаления:")
    list_students()
```

---

## 📌 Получение `id` последней вставки

```python
cur = conn.execute(
    "INSERT INTO students (name, class) VALUES (?, ?)",
    ("Даша", "7В"),
)
print(cur.lastrowid)      # id новой строки
```

---

## 📌 Массовые операции в цикле

Если вставляете много строк — оберните всё в одну транзакцию:

```python
with conn:
    for name in names:
        conn.execute("INSERT INTO students (name) VALUES (?)", (name,))
```

Так **в разы быстрее**, чем `commit` после каждой строки.

---

## 📌 Просмотр структуры

```python
# Список таблиц
conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()

# Схема таблицы
conn.execute("PRAGMA table_info(students)").fetchall()
```

---

## 📌 Экспорт / импорт

```python
# В CSV
import csv
with open("students.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["id", "name", "class", "age"])
    writer.writerows(conn.execute("SELECT * FROM students"))
```

Готовые инструменты — `sqlite3` CLI или библиотека `pandas.read_sql`.

---

## 💡 Пример — заметки

```python
import sqlite3
from datetime import datetime

conn = sqlite3.connect("notes.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS notes (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        title     TEXT NOT NULL,
        body      TEXT,
        created   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
""")

def add(title, body):
    conn.execute(
        "INSERT INTO notes (title, body) VALUES (?, ?)", (title, body)
    )
    conn.commit()

def show_all():
    for id, title, body, created in conn.execute(
        "SELECT id, title, body, created FROM notes ORDER BY created DESC"
    ):
        print(f"[{id}] {created} — {title}")
        print(f"    {body}\n")

add("Планы", "Сделать дз по математике")
add("Покупки", "Хлеб, молоко, сыр")
show_all()
conn.close()
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `commit()`"
    Изменения не сохранятся. Либо используйте `with conn:`.

!!! warning "Не закрыли соединение"
    Файл остаётся заблокированным. В `with sqlite3.connect(...)` — только
    транзакция, `close()` всё равно нужен явно.

!!! warning "SQL-инъекция"
    f-строки в SQL — **запрещены**. Только параметры `?` или `:name`.

!!! warning "Тип данных"
    SQLite хранит типы гибко, но `INSERT` строку вместо числа — не
    поймает ошибку. Проверяйте данные сами.

!!! warning "Многопоточность"
    По умолчанию `sqlite3` не потокобезопасен. Для веба — `check_same_thread=False`
    или отдельное соединение на поток.

---

## 🧪 Упражнения

1. ⭐ Создайте таблицу `books` (id, title, author, year).
2. ⭐ Вставьте 5 книг через `executemany`.
3. ⭐ Выведите все книги 2020 года и позже.
4. ⭐⭐ Добавьте поиск по автору.
5. ⭐⭐ Удаление по id.
6. ⭐⭐ Подсчёт: сколько книг у каждого автора.
7. ⭐⭐⭐ Мини-CRUD: меню `[l]ist [a]dd [d]elete [q]uit`.

---

## 🔗 Что дальше

→ [SQLAlchemy](sqlalchemy.md) — то же, но через Python-классы.