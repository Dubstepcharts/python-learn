# MongoDB

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [словари](../04-collections/dicts.md), [JSON](../09-stdlib/json.md).

---

## 🍎 Объясняем просто

!!! example "MongoDB — как папка с JSON-файлами"
    В SQL — таблицы со строгими колонками. В MongoDB — **коллекции** с
    **документами** (JSON-объектами). Каждый документ может иметь **свою
    структуру** — это и есть главное отличие NoSQL.

    ```python
    {
        "_id": "abc123",
        "name": "Аня",
        "hobbies": ["футбол", "рисование"],
        "address": {"city": "Москва", "zip": "101000"}
    }
    ```

---

## 📌 Когда выбирать MongoDB

✅ **Гибкая схема** — структура данных меняется часто
✅ **Вложенные данные** — JSON с массивами и объектами
✅ **Горизонтальное масштабирование** — распределение по серверам
✅ **Прототипы** — быстро начать

❌ **Строгие транзакции** — лучше SQL
❌ **Сложные связи** — JOIN отсутствует (есть `$lookup`, но ограничен)
❌ **Финансы** — ACID в SQL надёжнее

---

## 📌 Установка

### Через Docker (проще всего)

```bash
docker run --name mymongo -p 27017:27017 -d mongo:latest
```

### Локально

Скачайте с **https://www.mongodb.com/try/download/community**.

### Python-драйвер

```bash
pip install pymongo
```

---

## ✍️ Подключение

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["school"]               # база данных
students = db["students"]           # коллекция

# Список баз и коллекций
print(client.list_database_names())
print(db.list_collection_names())
```

---

## 📌 CRUD

### Create — вставка

```python
# Один документ
result = students.insert_one({
    "name": "Аня",
    "age": 12,
    "hobbies": ["футбол", "рисование"],
})
print(result.inserted_id)            # ObjectId('...')

# Много сразу
result = students.insert_many([
    {"name": "Борис", "age": 11},
    {"name": "Вика",  "age": 13},
])
print(result.inserted_ids)
```

### Read — чтение

```python
# Первый попавшийся
doc = students.find_one({"name": "Аня"})

# Все с фильтром
for s in students.find({"age": {"$gte": 12}}):
    print(s)

# Ограничение и сортировка
for s in students.find().sort("age", -1).limit(5):
    print(s["name"])

# Поля
for s in students.find({}, {"name": 1, "age": 1, "_id": 0}):
    print(s)
```

### Операторы фильтра

| Оператор | Значит |
|---|---|
| `$eq`, `$ne` | равно / не равно |
| `$gt`, `$gte` | больше / ≥ |
| `$lt`, `$lte` | меньше / ≤ |
| `$in`, `$nin` | в списке / не в списке |
| `$and`, `$or`, `$not`, `$nor` | логические |
| `$exists` | поле есть |
| `$regex` | регулярка |
| `$size` | размер массива |

```python
students.find({"age": {"$gt": 11, "$lt": 15}})
students.find({"hobbies": "футбол"})              # массив содержит
students.find({"name": {"$regex": "^А"}})          # начинается с А
students.find({"$or": [{"age": 12}, {"age": 13}]})
```

### Update — обновление

```python
# Один документ
students.update_one(
    {"name": "Аня"},
    {"$set": {"age": 13}}
)

# Много
students.update_many(
    {"age": {"$lt": 12}},
    {"$inc": {"age": 1}}           # увеличить на 1
)

# Массивы
students.update_one(
    {"name": "Аня"},
    {"$push": {"hobbies": "шахматы"}}
)
students.update_one(
    {"name": "Аня"},
    {"$pull": {"hobbies": "футбол"}}
)
```

**Операторы обновления:**

| Оператор | Что делает |
|---|---|
| `$set` | Установить значение |
| `$unset` | Удалить поле |
| `$inc` | Увеличить |
| `$mul` | Умножить |
| `$rename` | Переименовать |
| `$push`, `$pull`, `$addToSet`, `$pop` | Массивы |

### Delete — удаление

```python
students.delete_one({"name": "Аня"})
students.delete_many({"age": {"$lt": 10}})
```

---

## 📌 Индексы

```python
# Обычный
students.create_index("name")

# Составной
students.create_index([("age", 1), ("name", -1)])

# Уникальный
students.create_index("email", unique=True)

# Удалить
students.drop_index("name_1")

# Список
print(students.index_information())
```

---

## 📌 Агрегация

`aggregate` — конвейер операций:

```python
pipeline = [
    {"$match": {"age": {"$gte": 12}}},
    {"$group": {
        "_id": "$class",
        "количество": {"$sum": 1},
        "средний_возраст": {"$avg": "$age"},
    }},
    {"$sort": {"количество": -1}},
]

for doc in students.aggregate(pipeline):
    print(doc)
```

**Основные стадии:** `$match`, `$group`, `$sort`, `$limit`, `$project`,
`$lookup` (аналог JOIN), `$unwind`.

---

## 📌 Транзакции

Работают в **replica set** (в standalone — недоступны):

```python
with client.start_session() as session:
    with session.start_transaction():
        students.update_one(
            {"_id": 1}, {"$inc": {"balance": -100}}, session=session
        )
        students.update_one(
            {"_id": 2}, {"$inc": {"balance": 100}}, session=session
        )
```

---

## 📌 Работа с GridFS (файлы)

Для файлов >16 МБ — **GridFS**:

```python
from gridfs import GridFS
import gridfs

fs = gridfs.GridFS(db)

with open("bigfile.zip", "rb") as f:
    file_id = fs.put(f, filename="bigfile.zip")

# Чтение
file = fs.get(file_id)
with open("copy.zip", "wb") as f:
    f.write(file.read())
```

---

## 💡 Полный пример — блог

```python
from pymongo import MongoClient, DESCENDING
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["blog"]
posts = db["posts"]
posts.create_index([("created", DESCENDING)])

def create_post(title, body, tags=None):
    return posts.insert_one({
        "title": title,
        "body": body,
        "tags": tags or [],
        "created": datetime.utcnow(),
        "views": 0,
    }).inserted_id

def list_posts():
    for p in posts.find().sort("created", DESCENDING).limit(10):
        print(f"# {p['title']}  ({p['views']} просмотров)")

def add_view(post_id):
    posts.update_one({"_id": post_id}, {"$inc": {"views": 1}})

def find_by_tag(tag):
    return list(posts.find({"tags": tag}))

create_post("Первый", "Привет!", ["python", "hello"])
create_post("Второй", "Про Mongo", ["nosql"])
create_post("Третий", "Ещё один", ["python"])

list_posts()
print("\nПо тегу python:")
for p in find_by_tag("python"):
    print(" ", p["title"])
```

---

## ⚠️ Частые ошибки

!!! warning "`ObjectId` vs строки"
    `_id` — это `ObjectId`, а не строка. Сравнивайте с `ObjectId("...")`.

!!! warning "`find_one` возвращает `None`"
    Если документа нет. Проверяйте.

!!! warning "Проблема N+1"
    Много `find_one` в цикле — медленно. Используйте `$lookup` или `find`.

!!! warning "Нет схемы — и хорошо, и плохо"
    Гибко, но легко «замусорить» данные. На больших проектах используют
    **JSON Schema validation** на уровне коллекции.

!!! warning "Транзакции только в replica set"
    Одиночный сервер не поддерживает транзакции. Для прода — replica set.

---

## 🧪 Упражнения

1. ⭐ Вставьте 3 документа в коллекцию.
2. ⭐ Найдите всех старше 12.
3. ⭐⭐ Обновите возраст одному.
4. ⭐⭐ Добавьте поле в массив через `$push`.
5. ⭐⭐ Создайте индекс на поле.
6. ⭐⭐⭐ Агрегация: сколько документов по категории.
7. ⭐⭐⭐ Мини-CRUD на `pymongo`.

---

## 📌 Сравнение SQL и NoSQL

| | SQL (PostgreSQL) | MongoDB |
|---|---|---|
| Схема | Жёсткая | Гибкая |
| Связи | JOIN | `$lookup`, вложения |
| Транзакции | Полные | В replica set |
| Масштабирование | Вертикальное | Горизонтальное |
| Гарантии | ACID | BASE |
| Для чего | Финансы, строгие данные | Быстрые прототипы, гибкая структура |

**Правило:** если данные структурированы и связаны — SQL. Если быстрые
изменения схемы — NoSQL. Часто **оба** используются в одном проекте.

---

## 🔗 Что дальше

→ [Проекты](../14-projects/index.md) — применить всё на практике.