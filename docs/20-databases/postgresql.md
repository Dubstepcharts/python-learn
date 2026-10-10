# PostgreSQL

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [основы SQL](sql-basics.md), [SQLite](sqlite.md).

---

## 🍎 Объясняем просто

!!! example "PostgreSQL — как SQLite, но серьёзный"
    SQLite хранится в одном файле и подходит для небольших проектов.
    **PostgreSQL** — настоящая серверная СУБД: миллионы строк, много
    пользователей одновременно, расширенные типы данных.
    
    Используется в продакшене: Instagram, Reddit, Spotify, Yandex.

---

## 📌 Установка

### Windows / macOS

Скачайте с **https://www.postgresql.org/download/** — установщик сам
поставит сервер и утилиты.

### Linux

```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Docker (универсально)

```bash
docker run --name mypg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
```

---

## 🐍 Python-драйверы

| Библиотека | Для чего |
|---|---|
| `psycopg2` | Классический синхронный драйвер |
| `psycopg` (3) | Современная версия |
| `asyncpg` | Асинхронный (быстрый) |
| `SQLAlchemy` | ORM поверх них |

Установка:

```bash
pip install psycopg2-binary
```

---

## ✍️ Подключение

```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="school",
    user="postgres",
    password="secret",
)

cur = conn.cursor()
cur.execute("SELECT version()")
print(cur.fetchone())

cur.close()
conn.close()
```

Или через DSN-строку:

```python
conn = psycopg2.connect("postgresql://postgres:secret@localhost:5432/school")
```

---

## 📌 Работа с данными

Всё почти как в SQLite:

```python
cur = conn.cursor()

# Создать таблицу
cur.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id     SERIAL PRIMARY KEY,
        name   TEXT NOT NULL,
        class  TEXT NOT NULL,
        age    INTEGER
    )
""")
conn.commit()

# Вставить
cur.execute(
    "INSERT INTO students (name, class, age) VALUES (%s, %s, %s)",
    ("Аня", "7А", 12),
)
conn.commit()

# Читать
cur.execute("SELECT * FROM students WHERE class = %s", ("7А",))
for row in cur.fetchall():
    print(row)
```

!!! warning "Плейсхолдер — `%s`, а не `?`"
    В `psycopg2` — `%s` (даже для чисел). В `sqlite3` — `?`.

---

## 📌 Чем PostgreSQL отличается от SQLite

| | SQLite | PostgreSQL |
|---|---|---|
| Формат | Один файл | Сервер |
| Многопользовательский | Слабо | Да |
| Типы данных | Гибкие | Строгие |
| JSON | Нет | Есть (`json`, `jsonb`) |
| Полнотекстовый поиск | Ограничен | Полноценный |
| Хранимые процедуры | Нет | Есть (PL/pgSQL) |
| Расширения | Нет | Много (PostGIS, pg_trgm...) |
| Продакшен | Мелкие проекты | Да |

---

## 📌 Полезные фичи PostgreSQL

### `RETURNING`

Получить данные из вставки/обновления сразу:

```python
cur.execute(
    "INSERT INTO students (name, class) VALUES (%s, %s) RETURNING id",
    ("Даша", "7В"),
)
new_id = cur.fetchone()[0]
```

### `UPSERT` — вставить или обновить

```sql
INSERT INTO students (id, name, age) VALUES (1, 'Аня', 13)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, age = EXCLUDED.age;
```

### `JSONB` — JSON как тип

```sql
CREATE TABLE events (id SERIAL PRIMARY KEY, data JSONB);

INSERT INTO events (data) VALUES ('{"user": "Аня", "action": "login"}');

SELECT data->>'user' FROM events;
SELECT * FROM events WHERE data @> '{"action": "login"}';
```

Это очень мощная фича — можно строить гибридные схемы.

### Полнотекстовый поиск

```sql
SELECT * FROM posts WHERE to_tsvector(body) @@ to_tsquery('python');
```

### Массивы

```sql
CREATE TABLE tags (id SERIAL PRIMARY KEY, names TEXT[]);
INSERT INTO tags (names) VALUES (ARRAY['python', 'sql']);
SELECT * FROM tags WHERE 'python' = ANY(names);
```

### Генерация диапазонов

```sql
SELECT generate_series(1, 10);
```

### Расширения

```sql
CREATE EXTENSION pg_trgm;      -- триграммы (поиск с опечатками)
CREATE EXTENSION postgis;      -- геоданные
CREATE EXTENSION "uuid-ossp";   -- UUID
```

---

## 📌 Асинхронный доступ через asyncpg

```bash
pip install asyncpg
```

```python
import asyncio
import asyncpg

async def main():
    conn = await asyncpg.connect(
        "postgresql://postgres:secret@localhost/school"
    )
    rows = await conn.fetch("SELECT * FROM students WHERE class = $1", "7А")
    for r in rows:
        print(dict(r))
    await conn.close()

asyncio.run(main())
```

Быстро — до нескольких десятков тысяч запросов в секунду.

---

## 📌 SQLAlchemy + PostgreSQL

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy import select

engine = create_engine("postgresql+psycopg2://postgres:secret@localhost/school")

with Session(engine) as s:
    students = s.scalars(select(Student).where(Student.grade == "7А")).all()
```

Всё, что вы учили про SQLAlchemy, работает с PostgreSQL **без изменений**.

---

## 📌 Резервное копирование

```bash
# Дамп
pg_dump -U postgres -d school > school.sql

# Восстановление
psql -U postgres -d school < school.sql

# Полный дамп всех БД
pg_dumpall -U postgres > all.sql
```

Из Python:

```python
import subprocess
subprocess.run(["pg_dump", "-U", "postgres", "-d", "school",
                "-f", "backup.sql"], check=True)
```

---

## 📌 Администрирование — базовые команды

Подключиться к серверу:

```bash
psql -U postgres
```

Внутри `psql`:

```
\l              -- список БД
\c school       -- подключиться к БД
\dt             -- список таблиц
\d students     -- структура таблицы
\du             -- пользователи
\q              -- выход
```

---

## ⚠️ Частые ошибки

!!! warning "Не запущен сервер"
    ```bash
    sudo systemctl start postgresql
    ```

!!! warning "Порт 5432 занят"
    Поменяйте в `postgresql.conf` или в Docker-команде (`-p 5433:5432`).

!!! warning "Пароль не подходит"
    Сбросить: `sudo -u postgres psql` → `ALTER USER postgres PASSWORD 'new';`

!!! warning "`%s` vs `?`"
    В `psycopg2` — `%s`. Не путайте с SQLite.

!!! warning "Идентификаторы с большой буквы"
    `CREATE TABLE "Students"` создаст таблицу с **кавычками** в имени.
    В SQL без кавычек `Students` = `students`. Лучше писать строчными.

---

## 🧪 Упражнения

1. ⭐ Установите PostgreSQL (локально или через Docker).
2. ⭐ Создайте БД `test` и таблицу `students`.
3. ⭐⭐ Вставьте 3 записи и выведите их.
4. ⭐⭐ Поиск с параметром `%s`.
5. ⭐⭐ `RETURNING id` после вставки.
6. ⭐⭐⭐ `JSONB`-поле для гибких данных.
7. ⭐⭐⭐ `pg_dump` и восстановление.

---

## 🔗 Что дальше

→ [MongoDB](mongodb.md) — NoSQL-подход.