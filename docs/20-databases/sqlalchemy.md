# SQLAlchemy — ORM

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [ООП](../08-oop/index.md), [SQLite](sqlite.md).

---

## 🍎 Объясняем просто

!!! example "ORM — «мост» между классами и таблицами"
    Писать SQL вручную — хорошо, но неудобно:
    ```
    conn.execute("INSERT INTO students (name, age) VALUES (?, ?)", ...)
    ```
    
    **ORM** (**O**bject-**R**elational **M**apping) позволяет работать с
    таблицами как с обычными Python-классами:
    ```python
    student = Student(name="Аня", age=12)
    session.add(student)
    session.commit()
    ```
    
    SQL генерируется автоматически.

---

## 🚀 Установка

```bash
pip install sqlalchemy
```

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
```

---

## 📌 Модель

```python
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    id    = Column(Integer, primary_key=True)
    name  = Column(String(50), nullable=False)
    age   = Column(Integer)
    grade = Column(String(10))

    grades = relationship("Grade", back_populates="student")

    def __repr__(self):
        return f"<Student {self.name} ({self.grade})>"

class Grade(Base):
    __tablename__ = "grades"

    id         = Column(Integer, primary_key=True)
    value      = Column(Integer)
    subject    = Column(String(50))
    student_id = Column(Integer, ForeignKey("students.id"))

    student = relationship("Student", back_populates="grades")
```

**Что здесь:**

| Параметр | Значит |
|---|---|
| `__tablename__` | Имя таблицы в БД |
| `Column` | Столбец |
| `primary_key=True` | Первичный ключ |
| `ForeignKey("students.id")` | Внешний ключ |
| `relationship` | Связь между объектами |

---

## 📌 Подключение к БД

```python
from sqlalchemy import create_engine

# SQLite в файле
engine = create_engine("sqlite:///school.db")

# SQLite в памяти
engine = create_engine("sqlite:///:memory:")

# PostgreSQL
engine = create_engine("postgresql://user:pass@localhost/mydb")

# MySQL
engine = create_engine("mysql+pymysql://user:pass@localhost/mydb")
```

Создание таблиц:

```python
Base.metadata.create_all(engine)
```

---

## 📌 Сессия

**Session** — сессия работы с БД: набор операций, которые вместе
завершаются `commit`.

```python
Session = sessionmaker(bind=engine)
session = Session()

# ... работа ...

session.commit()
session.close()
```

Современный стиль:

```python
from sqlalchemy.orm import Session

with Session(engine) as session:
    # ...
    session.commit()
```

---

## 📌 CRUD

### Create — создание

```python
with Session(engine) as s:
    student = Student(name="Аня", age=12, grade="7А")
    s.add(student)
    s.commit()

    print(student.id)      # SQLAlchemy сам подставит id после commit
```

### Read — чтение

```python
from sqlalchemy import select

with Session(engine) as s:
    # Все
    students = s.scalars(select(Student)).all()

    # С фильтром
    stmt = select(Student).where(Student.grade == "7А")
    for st in s.scalars(stmt):
        print(st.name)

    # Одна запись
    student = s.get(Student, 1)               # по id
    student = s.scalars(
        select(Student).where(Student.name == "Аня")
    ).first()
```

### Update — изменение

```python
with Session(engine) as s:
    student = s.get(Student, 1)
    student.grade = "7Б"
    s.commit()
```

### Delete — удаление

```python
with Session(engine) as s:
    student = s.get(Student, 1)
    s.delete(student)
    s.commit()
```

---

## 📌 Фильтры и сортировка

```python
from sqlalchemy import select, and_, or_, desc, func

stmt = (
    select(Student)
    .where(Student.grade == "7А")
    .where(Student.age >= 12)
    .order_by(Student.name)
    .limit(10)
)

# OR
stmt = select(Student).where(
    or_(Student.grade == "7А", Student.grade == "7Б")
)

# Агрегат
count_stmt = select(func.count(Student.id))
total = s.scalar(count_stmt)
```

---

## 📌 Связи

```python
with Session(engine) as s:
    student = Student(name="Аня", age=12, grade="7А")
    student.grades.append(Grade(value=5, subject="математика"))
    student.grades.append(Grade(value=4, subject="русский"))
    s.add(student)
    s.commit()

    # Обращение
    print(student.grades[0].value)              # 5
    print(student.grades[0].student.name)        # Аня
```

**Типы связей:**

| Вид | Параметры |
|---|---|
| 1-ко-многим | `relationship` + `ForeignKey` |
| Многие-ко-многим | Промежуточная таблица + `secondary` |
| 1-к-1 | `uselist=False` |

Многие-ко-многим:

```python
from sqlalchemy import Table

student_course = Table(
    "student_course", Base.metadata,
    Column("student_id", ForeignKey("students.id"), primary_key=True),
    Column("course_id",  ForeignKey("courses.id"),  primary_key=True),
)

class Student(Base):
    ...
    courses = relationship("Course", secondary=student_course)
```

---

## 📌 Пример — блог

```python
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, Session
from sqlalchemy import create_engine, select

Base = declarative_base()

class Author(Base):
    __tablename__ = "authors"
    id    = Column(Integer, primary_key=True)
    name  = Column(String(100), nullable=False)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"
    id        = Column(Integer, primary_key=True)
    title     = Column(String(200), nullable=False)
    body      = Column(Text)
    created   = Column(DateTime, default=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("authors.id"))
    author    = relationship("Author", back_populates="posts")

engine = create_engine("sqlite:///blog.db")
Base.metadata.create_all(engine)

with Session(engine) as s:
    # Создаём автора с постами
    anna = Author(name="Аня")
    anna.posts.append(Post(title="Первый пост", body="Привет!"))
    anna.posts.append(Post(title="Второй", body="Python — это круто"))
    s.add(anna)
    s.commit()

    # Читаем
    authors = s.scalars(select(Author)).all()
    for a in authors:
        print(f"Автор: {a.name}")
        for p in a.posts:
            print(f"  - {p.title}")
```

---

## 📌 Миграции — Alembic

Когда меняете модель, SQLAlchemy **не обновляет** таблицы сам. Для этого —
**Alembic**:

```bash
pip install alembic
alembic init migrations
```

В `alembic.ini` укажите `sqlalchemy.url`, в `env.py` подключите свои модели.

```bash
alembic revision --autogenerate -m "Добавил поле email"
alembic upgrade head        # применить
alembic downgrade -1         # откатить на шаг
```

---

## 📌 SQLAlchemy Core (без ORM)

Иногда ORM избыточен. **Core** даёт тот же SQL, но через Python-объекты:

```python
from sqlalchemy import MetaData, Table, Column, Integer, String, select, insert

metadata = MetaData()
students = Table(
    "students", metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String),
)

metadata.create_all(engine)

with engine.begin() as conn:
    conn.execute(insert(students).values(name="Аня"))
    result = conn.execute(select(students).where(students.c.name == "Аня"))
    for row in result:
        print(row)
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `commit`"
    Изменения остаются в сессии, но **не** попадают в БД.

!!! warning "`session.add` не сохраняет"
    Только добавляет объект в сессию. `commit()` — обязателен.

!!! warning "Lazy loading и закрытая сессия"
    ```python
    with Session(engine) as s:
        anna = s.get(Author, 1)
    print(anna.posts)    # ❌ DetachedInstanceError
    ```
    Обращайтесь к связанным объектам внутри `with`, или используйте
    `joinedload`.

!!! warning "Путают `session.commit()` и `session.flush()`"
    `flush` — отправить в БД, но не завершить транзакцию.
    `commit` — сохранить окончательно.

!!! warning "Движок создаётся один раз"
    Один `engine` на приложение — он управляет пулом соединений.

---

## 🧪 Упражнения

1. ⭐ Модель `Book` (id, title, author, year).
2. ⭐ CRUD для книги.
3. ⭐⭐ Фильтр по автору и сортировка по году.
4. ⭐⭐ Связь `Author` → `Book`.
5. ⭐⭐ Агрегат: сколько книг у автора.
6. ⭐⭐⭐ Миграция: добавьте поле `isbn` через Alembic.
7. ⭐⭐⭐ Отношение многие-ко-многим: книги и теги.

---

## 🔗 Что дальше

→ [PostgreSQL](postgresql.md) — «взрослая» база данных.