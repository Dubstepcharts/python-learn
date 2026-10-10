# Основы SQL

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"
    Это **теория**. Не пугайтесь объёма — прочитайте один раз, возвращайтесь
    как в справочник.

---

## 🍎 Объясняем просто

!!! example "База данных — как шкаф с картотекой"
    Представь школьный архив. В нём — **много ящиков** (таблиц). В каждом
    ящике — **карточки** (записи, строки). У каждой карточки — **поля**
    (имя, класс, оценка).

    **SQL** — это язык, на котором ты просишь: «достань всех, у кого
    оценка 5», «добавь нового ученика», «удали записи старше 5 лет».

---

## 📖 Что такое SQL

**SQL** (Structured Query Language) — язык структурированных запросов.
Он появился в **1974 году** в IBM (изначально — SEQUEL, потом переименовали).
Основан на **реляционной модели** Эдгара Кодда (1970).

**Идея реляционной модели:** данные хранятся в виде **таблиц**, между
которыми можно устанавливать **связи**. Один раз описали структуру —
и работаем с данными через запросы.

Сегодня SQL — **стандарт** для работы с данными. Его поддерживают десятки
СУБД (**С**истем **У**правления **Б**азами **Д**анных):

- SQLite, PostgreSQL, MySQL/MariaDB
- MS SQL Server, Oracle Database
- Amazon Redshift, Google BigQuery

Синтаксис немного отличается, но **основы одинаковые везде**.

---

## 🧩 Реляционная модель в одной картинке

```
Таблица "Ученики"                    Таблица "Оценки"
┌────┬────────┬────────┐             ┌────┬─────────────┬────────┬───────┐
│ id │ имя    │ класс  │             │ id │ ученик_id   │ предмет│ балл  │
├────┼────────┼────────┤             ├────┼─────────────┼────────┼───────┤
│ 1  │ Аня    │ 7А     │             │ 1  │ 1           │ матем  │ 5     │
│ 2  │ Борис  │ 7А     │             │ 2  │ 1           │ рус    │ 4     │
│ 3  │ Вика   │ 7Б     │             │ 3  │ 2           │ матем  │ 3     │
└────┴────────┴────────┘             └────┴─────────────┴────────┴───────┘
         ↑                                    ↑
       PRIMARY KEY                        FOREIGN KEY
       (уникальный id)              (ссылается на Ученики.id)
```

**Ключевые термины:**

| Термин | Значит |
|---|---|
| **Таблица** | Набор строк с одинаковыми полями |
| **Строка / запись** | Один объект (один ученик) |
| **Столбец / поле** | Характеристика (имя, класс) |
| **PRIMARY KEY** | Уникальный идентификатор строки |
| **FOREIGN KEY** | Ссылка на PRIMARY KEY другой таблицы |
| **Схема** | Описание структуры всех таблиц |

---

## 📚 Пять групп команд SQL

| Группа | Расшифровка | Что делает | Команды |
|---|---|---|---|
| **DDL** | Data Definition Language | Структура | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Data Manipulation Language | Данные | `INSERT`, `UPDATE`, `DELETE` |
| **DQL** | Data Query Language | Чтение | `SELECT` |
| **DCL** | Data Control Language | Права | `GRANT`, `REVOKE` |
| **TCL** | Transaction Control Language | Транзакции | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

В 90% школьных задач нужны **DML** и **DQL** — то есть `SELECT`, `INSERT`,
`UPDATE`, `DELETE`.

---

## 🏗️ DDL. Создание и изменение таблиц

### `CREATE TABLE`

```sql
CREATE TABLE students (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    class    TEXT NOT NULL,
    age      INTEGER CHECK (age >= 5 AND age <= 20),
    email    TEXT UNIQUE,
    created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Ограничения (constraints):**

| Ограничение | Значит |
|---|---|
| `PRIMARY KEY` | Уникальный идентификатор |
| `FOREIGN KEY` | Ссылка на другую таблицу |
| `NOT NULL` | Поле обязательно |
| `UNIQUE` | Значения не повторяются |
| `CHECK (...)` | Проверка условия |
| `DEFAULT` | Значение по умолчанию |
| `AUTOINCREMENT` | Автоматический счётчик (в SQLite) |

### Основные типы данных

| Тип | Для чего |
|---|---|
| `INTEGER` / `INT` | Целые числа |
| `REAL` / `FLOAT` / `DOUBLE` | Дробные числа |
| `TEXT` / `VARCHAR(n)` / `CHAR(n)` | Строки |
| `BLOB` | Бинарные данные |
| `DATE`, `TIME`, `TIMESTAMP` | Дата и время |
| `BOOLEAN` | Истина/ложь (в разных СУБД по-разному) |
| `JSON`, `JSONB` | JSON (PostgreSQL, MySQL 5.7+) |

### Изменение таблицы

```sql
ALTER TABLE students ADD COLUMN phone TEXT;
ALTER TABLE students RENAME COLUMN class TO grade;
ALTER TABLE students DROP COLUMN phone;
```

### Удаление

```sql
DROP TABLE students;              -- удалить таблицу целиком
TRUNCATE TABLE students;          -- очистить содержимое, оставить структуру
```

---

## ✍️ DML. Работа с данными

### `INSERT` — добавить строки

```sql
-- Одна строка
INSERT INTO students (name, class, age)
VALUES ('Аня', '7А', 12);

-- Несколько строк сразу
INSERT INTO students (name, class, age) VALUES
    ('Борис', '7А', 11),
    ('Вика', '7Б', 13);

-- Со всеми полями (кроме авто-id)
INSERT INTO students
VALUES (NULL, 'Глеб', '7Б', 12, 'g@mail.ru', DEFAULT);
```

### `UPDATE` — изменить

```sql
UPDATE students
SET class = '7В'
WHERE name = 'Аня';
```

!!! warning "Не забывайте `WHERE`!"
    `UPDATE students SET class = '7В'` **без WHERE** изменит **все** строки.
    Это классическая ошибка.

### `DELETE` — удалить

```sql
DELETE FROM students WHERE age < 7;
DELETE FROM students WHERE name IN ('Аня', 'Борис');
```

!!! warning "`DELETE` без WHERE"
    Удалит **всё содержимое**. `WHERE` — обязателен, если не хотите стереть всё.

---

## 🔍 DQL. `SELECT` — чтение

Самый важный запрос. Разберём по частям.

### Общий вид

```sql
SELECT   столбцы
FROM     таблица
JOIN     другие_таблицы ON условие
WHERE    условие_на_строки
GROUP BY столбцы_группировки
HAVING   условие_на_группы
ORDER BY столбцы_сортировки
LIMIT    сколько;
```

Порядок **написания** — как выше. Порядок **выполнения** — другой
(см. в конце раздела).

### Базовый

```sql
SELECT * FROM students;                       -- все столбцы
SELECT name, class FROM students;              -- только два
SELECT name AS имя, class AS класс FROM students;   -- с псевдонимами
```

### `DISTINCT` — уникальные значения

```sql
SELECT DISTINCT class FROM students;           -- все классы без повторов
```

### `WHERE` — фильтр

```sql
SELECT * FROM students WHERE class = '7А';
SELECT * FROM students WHERE age >= 12;
SELECT * FROM students WHERE class = '7А' AND age < 13;
SELECT * FROM students WHERE class = '7А' OR class = '7Б';
SELECT * FROM students WHERE NOT class = '7А';
SELECT * FROM students WHERE age BETWEEN 10 AND 14;
SELECT * FROM students WHERE name IN ('Аня', 'Вика');
SELECT * FROM students WHERE name LIKE 'А%';       -- начинается с А
SELECT * FROM students WHERE name LIKE '%я';       -- заканчивается на я
SELECT * FROM students WHERE email IS NULL;         -- пусто
SELECT * FROM students WHERE email IS NOT NULL;
```

### `ORDER BY` — сортировка

```sql
SELECT * FROM students ORDER BY age;
SELECT * FROM students ORDER BY age DESC;             -- по убыванию
SELECT * FROM students ORDER BY class, age DESC;      -- сначала класс, потом возраст
```

### `LIMIT` / `OFFSET` — пагинация

```sql
SELECT * FROM students LIMIT 10;              -- первые 10
SELECT * FROM students LIMIT 10 OFFSET 20;    -- пропустить 20, взять 10
```

---

## 📊 Агрегации

Пять основных функций:

| Функция | Что считает |
|---|---|
| `COUNT(*)` | Число строк |
| `SUM(col)` | Сумма |
| `AVG(col)` | Среднее |
| `MIN(col)` | Минимум |
| `MAX(col)` | Максимум |

```sql
SELECT COUNT(*) FROM students;                 -- сколько всего
SELECT AVG(age) FROM students;                  -- средний возраст
SELECT MAX(age), MIN(age) FROM students;
SELECT SUM(age) FROM students;
```

Также в PostgreSQL есть `STDDEV`, `VARIANCE`, `STRING_AGG`, `ARRAY_AGG`.

### `GROUP BY` — группировка

```sql
SELECT class, COUNT(*) AS учеников, AVG(age) AS средний_возраст
FROM students
GROUP BY class;
```

**Как работает:** все строки с одинаковым `class` объединяются в группу,
и для каждой группы считаются агрегаты.

!!! warning "Правило GROUP BY"
    В `SELECT` можно использовать **только** столбцы из `GROUP BY`
    и агрегатные функции. Иначе — ошибка или неопределённый результат.

### `HAVING` — фильтр по группам

```sql
SELECT class, COUNT(*) AS n
FROM students
GROUP BY class
HAVING COUNT(*) > 20;
```

`WHERE` фильтрует **строки** до группировки.
`HAVING` фильтрует **группы** после.

---

## 🔗 JOIN — соединение таблиц

В реляционных базах данные разнесены по таблицам, чтобы не дублировать.
**JOIN** соединяет их обратно по ключам.

### `INNER JOIN` — только совпадения

```sql
SELECT s.name, g.subject, g.grade
FROM students s
INNER JOIN grades g ON s.id = g.student_id;
```

Возвращает только те строки, у которых **есть пара** в обеих таблицах.

### `LEFT JOIN` — все из левой

```sql
SELECT s.name, g.subject, g.grade
FROM students s
LEFT JOIN grades g ON s.id = g.student_id;
```

Возвращает **все** строки из левой таблицы. Где нет пары — `NULL`.

### `RIGHT JOIN` — все из правой

Зеркально `LEFT JOIN`.

### `FULL OUTER JOIN` — все из обеих

```sql
SELECT *
FROM students s
FULL OUTER JOIN grades g ON s.id = g.student_id;
```

Не во всех СУБД (в SQLite — только через `UNION`).

### `CROSS JOIN` — декартово произведение

```sql
SELECT s.name, sub.name
FROM students s
CROSS JOIN subjects sub;
```

Каждая строка с каждой. Осторожно: 1000 × 1000 = миллион строк.

### `SELF JOIN` — соединение с собой

Например, найти пары «учитель — ученик» из одной таблицы:

```sql
SELECT a.name AS ученик, b.name AS наставник
FROM students a
JOIN students b ON a.mentor_id = b.id;
```

---

## 🔍 Подзапросы

Запрос внутри запроса.

```sql
-- Ученики старше среднего возраста
SELECT name FROM students
WHERE age > (SELECT AVG(age) FROM students);

-- Все, у кого есть оценки
SELECT name FROM students
WHERE id IN (SELECT DISTINCT student_id FROM grades);

-- Класс с максимальным числом учеников
SELECT class FROM students
GROUP BY class
ORDER BY COUNT(*) DESC
LIMIT 1;
```

---

## 🎯 Индексы

**Индекс** — специальная структура, которая ускоряет поиск. Как алфавитный
указатель в конце книги: вместо перелистывания — сразу к нужной странице.

```sql
CREATE INDEX idx_students_class ON students(class);
CREATE UNIQUE INDEX idx_email ON students(email);
DROP INDEX idx_students_class;
```

**Плюс:** `SELECT` с `WHERE class = '7А'` работает в разы быстрее.

**Минус:** занимает место; замедляет `INSERT`, `UPDATE`, `DELETE`
(нужно обновлять и индекс).

**Что индексировать:** столбцы в `WHERE`, `JOIN`, `ORDER BY`, внешние ключи.
**Не индексировать:** редко используемые, столбцы с малым числом вариантов
(например, `пол`).

---

## 💾 Транзакции и ACID

**Транзакция** — группа операций, которая выполняется **целиком** или
**никак**. Классический пример: перевод денег со счёта на счёт — надо
списать и зачислить одновременно.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

Если что-то пойдёт не так — `ROLLBACK` откатит всё.

### ACID — четыре свойства транзакций

| Свойство | Значит |
|---|---|
| **A**tomicity | Всё или ничего |
| **C**onsistency | БД переходит из одного валидного состояния в другое |
| **I**solation | Транзакции не мешают друг другу |
| **D**urability | После `COMMIT` данные сохранены навсегда |

Уровни изоляции в разных СУБД отличаются, но принцип один.

---

## 📐 Нормальные формы (кратко)

**Нормализация** — правила, как разбить данные по таблицам, чтобы избежать
дублирования и противоречий.

- **1НФ**: атомарные значения (не списки в одной ячейке)
- **2НФ**: каждый неключевой столбец зависит от **всего** первичного ключа
- **3НФ**: нет транзитивных зависимостей (A → B → C)

На практике обычно достаточно 3НФ. Иногда намеренно «денормализуют» для
скорости чтения (например, в аналитике).

---

## 🪟 Оконные функции (обзор)

Появились в SQL:2003, поддерживаются PostgreSQL, MySQL 8+, SQLite 3.25+.

```sql
SELECT
    name,
    class,
    grade,
    AVG(grade) OVER (PARTITION BY class) AS средний_по_классу,
    RANK()       OVER (PARTITION BY class ORDER BY grade DESC) AS место
FROM students;
```

Основные: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`,
`SUM() OVER`, `AVG() OVER`. Для аналитики — незаменимая вещь.

---

## 🔢 Порядок выполнения запроса

Важно! `SELECT` пишется **первым**, но выполняется **шестым**:

```
1. FROM        — какие таблицы
2. JOIN        — как соединить
3. WHERE       — фильтр строк
4. GROUP BY    — группировка
5. HAVING      — фильтр групп
6. SELECT      — выбор столбцов
7. DISTINCT    — уникальные
8. ORDER BY    — сортировка
9. LIMIT       — сколько
```

Поэтому в `WHERE` нельзя использовать псевдонимы из `SELECT` (их ещё нет),
а в `ORDER BY` — можно.

---

## 📋 Шпаргалка

```sql
-- Создать таблицу
CREATE TABLE t (id INTEGER PRIMARY KEY, name TEXT);

-- Вставить
INSERT INTO t (name) VALUES ('Аня');

-- Прочитать
SELECT * FROM t WHERE id > 5 ORDER BY name LIMIT 10;

-- Изменить
UPDATE t SET name = 'Аня П.' WHERE id = 1;

-- Удалить
DELETE FROM t WHERE id = 1;

-- Агрегат
SELECT COUNT(*), AVG(score) FROM t GROUP BY category HAVING COUNT(*) > 3;

-- JOIN
SELECT * FROM t1 JOIN t2 ON t1.id = t2.t1_id;

-- Индекс
CREATE INDEX idx ON t(name);

-- Транзакция
BEGIN;
...
COMMIT;   -- или ROLLBACK;
```

---

## 🧪 Упражнения (на бумаге или в онлайн-редакторе)

Онлайн-песочницы: [sqliteonline.com](https://sqliteonline.com),
[db-fiddle.com](https://www.db-fiddle.com), [sqlfiddle.com](http://sqlfiddle.com).

1. ⭐ Создайте таблицу `books` (id, title, author, year).
2. ⭐ Вставьте 3 книги.
3. ⭐ Выведите все книги за 2020 год и позже.
4. ⭐⭐ Отсортируйте по автору, потом по году (убывание).
5. ⭐⭐ Посчитайте, сколько книг у каждого автора.
6. ⭐⭐ Выведите авторов, у кого больше 2 книг.
7. ⭐⭐⭐ Соедините `books` и `authors` (id, name, country) через JOIN.
8. ⭐⭐⭐ Найдите самого плодовитого автора.

---

## 🔗 Что дальше

→ [SQLite](sqlite.md) — применим всё это на практике в Python.