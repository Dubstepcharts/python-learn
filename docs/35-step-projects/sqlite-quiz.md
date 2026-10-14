# Проект по шагам: Викторина на SQLite

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"
    Нужно знать: [SQLite](../20-databases/sqlite.md), [функции](../05-functions/index.md), [списки](../04-collections/lists.md).

Время: **2–3 урока**.

---

## 🎯 Что делаем

Терминальная игра-викторина:

- Вопросы хранятся в **базе данных SQLite**
- Три викторины: «Своя игра», «Кто хочет стать миллионером?», «Самый умный»
- Пользователь выбирает викторину и отвечает
- Счёт растёт за правильные ответы
- В конце — результат

Это **первый проект с настоящей базой данных**. Мы объединим SQL, функции и логику игры.

---

## 📌 Шаг 1. Что нужно знать

- **SQLite** — база в одном файле, встроена в Python
- **SQL-запросы**: `CREATE TABLE`, `INSERT`, `SELECT`
- **Функции** Python
- **Списки** и **кортежи**

Если что-то забыли — вернитесь в [раздел про SQLite](../20-databases/sqlite.md).

---

## 📌 Шаг 2. Структура базы

Наша БД состоит из **трёх таблиц**:

```
┌─────────────────┐        ┌──────────────────┐        ┌────────────────────┐
│      quiz       │        │  quiz_content    │        │     question       │
├─────────────────┤        ├──────────────────┤        ├────────────────────┤
│ id (PK)         │◄───────│ quiz_id (FK)     │        │ id (PK)            │
│ name            │        │ question_id (FK) │───────►│ question           │
└─────────────────┘        │ id (PK)          │        │ answer             │
                           └──────────────────┘        │ wrong1             │
                                                       │ wrong2             │
                                                       │ wrong3             │
                                                       └────────────────────┘
```

**Идея:**
- **`quiz`** — список викторин (название)
- **`question`** — все вопросы с одним правильным и тремя неправильными ответами
- **`quiz_content`** — связь «какой вопрос в какой викторине»

Один вопрос **может быть в нескольких викторинах** — это и есть смысл связующей таблицы.

---

## 📌 Шаг 3. Создаём файл

Создайте `quiz.py`:

```python
import sqlite3
import random

DB_NAME = "quiz.sqlite"

conn = None
cursor = None
```

!!! tip "Зачем `conn` и `cursor` глобальные"
    Это «ленивый» способ — открывать соединение только когда нужно, а не
    держать постоянно. Для учебного проекта — удобно.

---

## 📌 Шаг 4. Открытие и закрытие БД

```python
def open_db():
    global conn, cursor
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()


def close_db():
    cursor.close()
    conn.close()


def do(query):
    """Выполнить запрос с сохранением."""
    cursor.execute(query)
    conn.commit()
```

!!! warning "Опечатка в оригинале"
    В некоторых учебниках переменная называется `curor` (без `s`) — это
    **опечатка**. Правильно — `cursor`. Если встретите такое — переименуйте.

---

## 📌 Шаг 5. Создание таблиц

```python
def clear_db():
    """Удаляет все таблицы, если они есть."""
    open_db()
    do("DROP TABLE IF EXISTS quiz_content")
    do("DROP TABLE IF EXISTS question")
    do("DROP TABLE IF EXISTS quiz")
    close_db()


def create_db():
    """Создаёт структуру БД."""
    open_db()
    cursor.execute("PRAGMA foreign_keys=on")   # включаем проверку связей

    do("""CREATE TABLE IF NOT EXISTS quiz (
        id INTEGER PRIMARY KEY,
        name VARCHAR
    )""")

    do("""CREATE TABLE IF NOT EXISTS question (
        id INTEGER PRIMARY KEY,
        question VARCHAR,
        answer VARCHAR,
        wrong1 VARCHAR,
        wrong2 VARCHAR,
        wrong3 VARCHAR
    )""")

    do("""CREATE TABLE IF NOT EXISTS quiz_content (
        id INTEGER PRIMARY KEY,
        quiz_id INTEGER,
        question_id INTEGER,
        FOREIGN KEY (quiz_id) REFERENCES quiz (id),
        FOREIGN KEY (question_id) REFERENCES question (id)
    )""")
    close_db()
```

### Что такое `PRAGMA foreign_keys=on`

По умолчанию SQLite **не проверяет** внешние ключи. Эта команда включает проверку — тогда нельзя добавить `quiz_content` со ссылкой на несуществующий `question_id`.

---

## 📌 Шаг 6. Наполняем вопросами

```python
def add_questions():
    questions = [
        ("Сколько месяцев в году имеют 28 дней?",
         "Все", "Один", "Ни одного", "Два"),
        ("Каким станет зелёный утёс, если упадёт в Красное море?",
         "Мокрым", "Красным", "Не изменится", "Фиолетовым"),
        ("Какой рукой лучше размешивать чай?",
         "Ложкой", "Правой", "Левой", "Любой"),
        ("Что не имеет длины, глубины, ширины, высоты, а можно измерить?",
         "Время", "Глупость", "Море", "Воздух"),
        ("Когда сетью можно вытянуть воду?",
         "Когда вода замёрзла", "Когда нет рыбы",
         "Когда уплыла золотая рыбка", "Когда сеть порвалась"),
        ("Что больше слона и ничего не весит?",
         "Тень слона", "Воздушный шар", "Парашют", "Облако"),
    ]

    open_db()
    cursor.executemany(
        """INSERT INTO question
           (question, answer, wrong1, wrong2, wrong3)
           VALUES (?, ?, ?, ?, ?)""",
        questions,
    )
    conn.commit()
    close_db()
```

**Формат кортежа:** `(вопрос, правильный, неправильный1, неправильный2, неправильный3)`.

---

## 📌 Шаг 7. Создаём викторины

```python
def add_quiz():
    quizes = [
        ("Своя игра",),
        ("Кто хочет стать миллионером?",),
        ("Самый умный",),
    ]

    open_db()
    cursor.executemany(
        "INSERT INTO quiz (name) VALUES (?)",
        quizes,
    )
    conn.commit()
    close_db()
```

Обратите внимание на запятые: `("Своя игра",)` — **кортеж из одного элемента**. Без запятой это была бы просто строка в скобках.

---

## 📌 Шаг 8. Связываем вопросы с викторинами

Вручную через input — как в оригинале:

```python
def add_links_manual():
    open_db()
    cursor.execute("PRAGMA foreign_keys=on")
    query = "INSERT INTO quiz_content (quiz_id, question_id) VALUES (?, ?)"

    answer = input("Добавить связь (y / n)? ")
    while answer != "n":
        quiz_id = int(input("id викторины: "))
        question_id = int(input("id вопроса: "))
        cursor.execute(query, [quiz_id, question_id])
        conn.commit()
        answer = input("Добавить связь (y / n)? ")

    close_db()
```

### Автоматически — лучше

Для учебного проекта удобнее раскидать вопросы по викторинам **автоматически**:

```python
def add_links_auto():
    """Автоматически раскидывает вопросы по викторинам."""
    open_db()
    cursor.execute("PRAGMA foreign_keys=on")

    # Викторина 1: все вопросы
    for q_id in range(1, 7):
        cursor.execute(
            "INSERT INTO quiz_content (quiz_id, question_id) VALUES (?, ?)",
            (1, q_id),
        )

    # Викторина 2: вопросы 1–4
    for q_id in range(1, 5):
        cursor.execute(
            "INSERT INTO quiz_content (quiz_id, question_id) VALUES (?, ?)",
            (2, q_id),
        )

    # Викторина 3: вопросы 3–6
    for q_id in range(3, 7):
        cursor.execute(
            "INSERT INTO quiz_content (quiz_id, question_id) VALUES (?, ?)",
            (3, q_id),
        )

    conn.commit()
    close_db()
```

---

## 📌 Шаг 9. Показываем содержимое БД

Для отладки — маленькая функция:

```python
def show(table):
    open_db()
    cursor.execute(f"SELECT * FROM {table}")
    print(cursor.fetchall())
    close_db()


def show_tables():
    show("question")
    show("quiz")
    show("quiz_content")
```

!!! warning "Не подставляйте чужой ввод"
    Мы используем `f"SELECT * FROM {table}"`, где `table` — **наш** код.
    Если бы имя таблицы вводил пользователь — только через параметры,
    иначе SQL-инъекция.

---

## 📌 Шаг 10. Логика игры

Теперь самое интересное — **игра**.

### Получить список викторин

```python
def get_quizes():
    open_db()
    cursor.execute("SELECT id, name FROM quiz")
    result = cursor.fetchall()
    close_db()
    return result
```

### Получить следующий вопрос

По аналогии с оригинальной функцией:

```python
def get_question_after(question_id=0, quiz_id=1):
    """
    Возвращает следующий вопрос после вопроса с переданным id.
    Для первого вопроса передаётся значение по умолчанию.
    """
    open_db()
    query = """
        SELECT quiz_content.id, question.question,
               question.answer, question.wrong1,
               question.wrong2, question.wrong3
        FROM question, quiz_content
        WHERE quiz_content.question_id = question.id
          AND quiz_content.id > ?
          AND quiz_content.quiz_id = ?
        ORDER BY quiz_content.id
    """
    cursor.execute(query, [question_id, quiz_id])
    result = cursor.fetchone()
    close_db()
    return result
```

### Запуск викторины

```python
def play_quiz(quiz_id):
    """Основной игровой цикл."""
    score = 0
    total = 0
    last_link_id = 0

    while True:
        row = get_question_after(last_link_id, quiz_id)
        if row is None:
            break

        link_id, question, correct, wrong1, wrong2, wrong3 = row
        last_link_id = link_id
        total += 1

        # Готовим варианты и перемешиваем
        options = [correct, wrong1, wrong2, wrong3]
        random.shuffle(options)

        print(f"\nВопрос {total}: {question}")
        for i, opt in enumerate(options, 1):
            print(f"  {i}. {opt}")

        while True:
            try:
                choice = int(input("Твой ответ (1–4): "))
                if 1 <= choice <= 4:
                    break
            except ValueError:
                pass
            print("Введи число от 1 до 4")

        if options[choice - 1] == correct:
            print("✅ Верно!")
            score += 1
        else:
            print(f"❌ Неверно. Правильный ответ: {correct}")

    print(f"\n🏁 Игра окончена!")
    print(f"Правильных ответов: {score} из {total}")
    percent = score / total * 100 if total else 0
    print(f"Результат: {percent:.0f}%")


def choose_quiz():
    """Меню выбора викторины."""
    quizes = get_quizes()
    print("\nДоступные викторины:")
    for q_id, name in quizes:
        print(f"  {q_id}. {name}")

    while True:
        try:
            choice = int(input("Выбери номер: "))
            if any(q[0] == choice for q in quizes):
                return choice
        except ValueError:
            pass
        print("Нет такой викторины, попробуй снова")
```

---

## 📌 Шаг 11. Главная функция

```python
def main():
    # Создаём БД с нуля
    clear_db()
    create_db()
    add_questions()
    add_quiz()
    add_links_auto()

    # Играем
    while True:
        print("\n=== ВИКТОРИНА ===")
        print("1. Играть")
        print("2. Показать содержимое БД")
        print("3. Выход")

        cmd = input("Твой выбор: ")

        if cmd == "1":
            quiz_id = choose_quiz()
            play_quiz(quiz_id)
        elif cmd == "2":
            show_tables()
        elif cmd == "3":
            print("До встречи!")
            break
        else:
            print("Неизвестная команда")


if __name__ == "__main__":
    main()
```

---

## 📌 Шаг 12. Запуск

```bash
python quiz.py
```

Увидите меню. Выбирайте «Играть», дальше — викторину. Отвечайте на вопросы.

**Пример работы:**

```
=== ВИКТОРИНА ===
1. Играть
2. Показать содержимое БД
3. Выход
Твой выбор: 1

Доступные викторины:
  1. Своя игра
  2. Кто хочет стать миллионером?
  3. Самый умный
Выбери номер: 1

Вопрос 1: Сколько месяцев в году имеют 28 дней?
  1. Один
  2. Все
  3. Два
  4. Ни одного
Твой ответ (1–4): 2
✅ Верно!
...
```

---

## 💡 Шаг 13. Что можно улучшить

### Добавить свои вопросы

Откройте `quiz.sqlite` через [DB Browser for SQLite](https://sqlitebrowser.org/) и добавьте строки в `question`. Или отредактируйте список в `add_questions()` и запустите `python quiz.py` заново.

### Ограничить время на ответ

```python
import time

start = time.time()
choice = int(input("Ответ: "))
elapsed = time.time() - start

if elapsed > 15:
    print("⏱️ Слишком долго!")
    continue
```

### Добавить таблицу рекордов

```python
def init_scores():
    open_db()
    do("""CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY,
        player VARCHAR,
        score INTEGER,
        total INTEGER,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    close_db()


def save_score(player, score, total):
    open_db()
    cursor.execute(
        "INSERT INTO scores (player, score, total) VALUES (?, ?, ?)",
        (player, score, total),
    )
    conn.commit()
    close_db()


def show_best():
    open_db()
    cursor.execute("""
        SELECT player, score, total
        FROM scores
        ORDER BY score DESC, total ASC
        LIMIT 5
    """)
    for row in cursor.fetchall():
        print(row)
    close_db()
```

### Случайный порядок вопросов

```python
def get_random_question(quiz_id, used_ids):
    open_db()
    query = """
        SELECT quiz_content.id, question.question, question.answer,
               question.wrong1, question.wrong2, question.wrong3
        FROM question, quiz_content
        WHERE quiz_content.question_id = question.id
          AND quiz_content.quiz_id = ?
          AND quiz_content.id NOT IN ({})
        ORDER BY RANDOM()
        LIMIT 1
    """.format(",".join("?" * len(used_ids)))
    cursor.execute(query, [quiz_id] + used_ids)
    result = cursor.fetchone()
    close_db()
    return result
```

### Подсветить правильный ответ в конце

```python
if options[choice - 1] == correct:
    print("\033[92m✅ Верно!\033[0m")     # зелёный
else:
    print(f"\033[91m❌ Неверно. Правильный: {correct}\033[0m")   # красный
```

### Переместить в веб

Если хочется **браузерную** версию — переделайте игру на **Flask** (см. [раздел Flask](../15-web/flask.md)). База остаётся та же.

---

## 📌 Разбор кода: что мы сделали

| Компонент | Зачем |
|---|---|
| `sqlite3.connect` | Подключение к файлу БД |
| `cursor` | «Рука» для выполнения SQL |
| `PRAGMA foreign_keys=on` | Включить проверку внешних ключей |
| `executemany` | Массовая вставка |
| Параметры `?` | Защита от SQL-инъекций |
| `FOREIGN KEY` | Связь между таблицами |
| `SELECT ... WHERE ... > ?` | Выборка следующего вопроса |
| `random.shuffle` | Перемешать варианты ответа |

---

## ⚠️ Возможные ошибки

!!! warning "`sqlite3.OperationalError: no such table`"
    Забыли вызвать `create_db()` перед `add_questions()`.

!!! warning "`FOREIGN KEY constraint failed`"
    Пытаетесь добавить связь на несуществующий `quiz_id` или `question_id`.
    Сначала создайте викторину и вопрос.

!!! warning "`sqlite3.ProgrammingError: Cannot operate on a closed database`"
    Обращаетесь к `cursor` после `close_db()`.

!!! warning "Кракозябры в консоли Windows"
    Если русские буквы «поехали»:
    ```powershell
    chcp 65001
    ```
    перед запуском. Или используйте **Windows Terminal**.

!!! warning "Файл `quiz.sqlite` не создаётся"
    Запустите скрипт из **той папки**, где хотите базу. Или укажите полный путь в `DB_NAME`.

---

## 🎯 Что дальше

Этот проект — отличная **основа** для дальнейшего развития:

- Добавить **игрока** и **историю результатов** → таблица `scores`
- Сделать **веб-версию** на Flask или FastAPI
- Сделать **Telegram-бота** (см. [проект викторины на aiogram](telegram-quiz.md))
- Добавить **картинки к вопросам** (поле `image_url` в БД)
- Сделать **категории** внутри викторин
- Добавить **уровни сложности**

---

## 🔗 Что дальше

→ [Дневник на Flask](flask-diary.md) — веб-проект.