# json

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса. Нужно знать: [словари](../04-collections/dicts.md), [файлы](../06-files-errors/files.md).

---

## 🍎 Объясняем просто

!!! example "JSON — как коробка с данными"
    JSON — текстовый формат для хранения «структурированных» данных: чисел,
    строк, списков, словарей. Им обмениваются программы в интернете, в нём
    хранят настройки, сохранения игр, отчёты.

    ```python
    {
        "name": "Аня",
        "age": 12,
        "hobbies": ["рисование", "футбол"]
    }
    ```

    В Python `json`-объект превращается в обычный `dict`, `list`, `str`, `int`...

---

## 📖 Что можно закодировать

| JSON | Python |
|---|---|
| `{...}` (object) | `dict` |
| `[...]` (array) | `list` |
| `"..."` | `str` |
| `123` | `int` |
| `1.5` | `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

**Нельзя** закодировать «напрямую»: функции, классы, даты, множества, кортежи (кодируются как списки).

---

## 📌 Четыре главные функции

| Функция | Что делает |
|---|---|
| `json.dumps(obj)` | **D**ump **s**tring — Python → строка JSON |
| `json.loads(s)` | **L**oad **s**tring — строка JSON → Python |
| `json.dump(obj, f)` | Python → в файл |
| `json.load(f)` | Из файла → Python |

**Мнемоника:** без `s` — работа с **файлом**, с `s` — работа со **строкой**.

---

## 🎯 `dumps` и `loads` — работа со строками

```python
import json

data = {"name": "Аня", "age": 12, "hobbies": ["рисование", "футбол"]}

# Python → JSON-строка
s = json.dumps(data)
print(s)
# {"name": "\u0410\u043d\u044f", "age": 12, "hobbies": [...]}

# JSON-строка → Python
back = json.loads(s)
print(back)          # тот же словарь
print(back["name"])  # Аня
```

!!! tip "Русские буквы в JSON"
    По умолчанию `dumps` превращает кириллицу в `\uXXXX`. Чтобы сохранить
    читаемый вид:
    ```python
    json.dumps(data, ensure_ascii=False)
    ```

### Красивый вывод

```python
print(json.dumps(data, ensure_ascii=False, indent=2))
```

```json
{
  "name": "Аня",
  "age": 12,
  "hobbies": ["рисование", "футбол"]
}
```

### Сортировка ключей

```python
json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True)
```

### Разделители

```python
# Компактный (без пробелов)
json.dumps(data, separators=(",", ":"))
```

---

## 🎯 `dump` и `load` — работа с файлами

```python
import json

data = {"users": [{"name": "Аня", "age": 12}, {"name": "Борис", "age": 11}]}

# Сохранить
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Прочитать
with open("data.json", encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["users"][0]["name"])   # Аня
```

---

## 📌 Полный список параметров

### У `dumps` и `dump`

| Параметр | Что делает |
|---|---|
| `ensure_ascii=True` | Экранировать не-ASCII (`False` — русский как есть) |
| `indent=None` | Отступы (для красоты) |
| `separators=(', ', ': ')` | Разделители |
| `sort_keys=False` | Сортировать ключи |
| `skipkeys=False` | Пропускать неверные ключи |
| `check_circular=True` | Проверять циклы |
| `allow_nan=True` | Разрешать NaN и Infinity |
| `default=None` | Функция для несериализуемых объектов |
| `cls=None` | Класс-энкодер |
| `ensure_ascii=True` | — |

### У `loads` и `load`

| Параметр | Что делает |
|---|---|
| `parse_float=float` | Чем заменить float |
| `parse_int=int` | Чем заменить int |
| `parse_constant` | Обработка NaN, Infinity |
| `object_hook` | Функция для каждого dict |
| `object_pairs_hook` | Функция для пар |
| `cls=None` | Класс-декодер |

!!! info "Подробнее: `object_hook` 🔬"
    Позволяет превратить обычные `dict` в **свои** объекты при разборе:
    ```python
    def as_point(d):
        if "x" in d and "y" in d:
            return Point(d["x"], d["y"])
        return d

    p = json.loads('{"x": 1, "y": 2}', object_hook=as_point)
    ```

---

## 🎯 Сериализация своих объектов

`json` не знает, как превратить ваш класс в JSON. Нужен **`default`**:

```python
import json
from datetime import date

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

def encode(obj):
    if isinstance(obj, Person):
        return {"name": obj.name, "age": obj.age, "type": "Person"}
    if isinstance(obj, date):
        return obj.isoformat()
    raise TypeError(f"Не могу сериализовать {type(obj)}")

p = Person("Аня", 12)
print(json.dumps(p, default=encode, ensure_ascii=False))
# {"name": "Аня", "age": 12, "type": "Person"}
```

С датами то же самое: `json` «из коробки» не сериализует `date`/`datetime`.

!!! warning "Типичная ошибка"
    ```python
    json.dumps({"date": date.today()})
    # ❌ TypeError: Object of type date is not JSON serializable
    ```
    **Решение:** `default=str` (быстро) или свой `default` (красиво).

---

## 💡 Примеры

### Пример 1. Сохранение настроек ⚙️

```python
import json

settings = {
    "volume": 0.8,
    "theme": "dark",
    "language": "ru",
    "window": {"width": 800, "height": 600},
}

with open("settings.json", "w", encoding="utf-8") as f:
    json.dump(settings, f, ensure_ascii=False, indent=2)

# Через день:
with open("settings.json", encoding="utf-8") as f:
    loaded = json.load(f)
print(loaded["window"]["width"])   # 800
```

### Пример 2. Сюжетный — сохранение игры 🎮

```python
import json

save = {
    "player": {"name": "Герой", "hp": 85, "level": 7},
    "inventory": ["меч", "щит", "зелье"],
    "position": {"x": 120, "y": 45},
    "completed_quests": ["вступление", "лес", "башня"],
}

with open("savegame.json", "w", encoding="utf-8") as f:
    json.dump(save, f, ensure_ascii=False, indent=2)

print("Игра сохранена")
```

### Пример 3. Чтение API-ответа 🌐

С `requests`:

```python
import requests, json

# response = requests.get("https://api.github.com/users/torvalds")
data = json.loads(response.text)
print(data["name"], data["public_repos"])
```

### Пример 4. Список словарей 📋

```python
import json

students = [
    {"name": "Аня", "grades": [5, 4, 5]},
    {"name": "Борис", "grades": [3, 4, 3]},
]

with open("students.json", "w", encoding="utf-8") as f:
    json.dump(students, f, ensure_ascii=False, indent=2)

with open("students.json", encoding="utf-8") as f:
    data = json.load(f)

for s in data:
    avg = sum(s["grades"]) / len(s["grades"])
    print(f"{s['name']}: {avg:.2f}")
```

### Пример 5. Красивая печать JSON 🖨️

```python
import json

data = {"users": [{"name": "Аня", "age": 12}], "count": 1}
print(json.dumps(data, ensure_ascii=False, indent=4))
```

---

## 📌 Сравнение с другими форматами

| Формат | Плюсы | Минусы |
|---|---|---|
| **JSON** | Универсальный, читаемый | Нет комментариев, дат, `set` |
| **YAML** | Комментарии, красивее | Зависимость (`pyyaml`) |
| **XML** | Очень гибкий | Многословный |
| **CSV** | Идеален для таблиц | Только плоские данные |
| **pickle** | Сохраняет **любые** объекты | Только для Python, небезопасный |

!!! warning "⚠️ `pickle` — небезопасен для чужого"
    `pickle.load` может исполнить **любой** код. Не загружайте pickle из
    ненадёжных источников. Для обмена — `json`.

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `json.load` вместо `json.loads`"
    - `json.load(f)` — читает **из файла**
    - `json.loads(s)` — читает **из строки**

    Перепутаете — получите ошибку.

!!! warning "Ошибка 2. `json.dumps` на файл"
    ```python
    json.dumps(data, f)     # ❌ — это для строки
    json.dump(data, f)      # ✅
    ```

!!! warning "Ошибка 3. Невалидный JSON"
    ```python
    json.loads("{'a': 1}")   # ❌ одинарные кавычки
    json.loads('{"a": 1}')   # ✅
    ```
    В JSON — только двойные кавычки, `true`/`false` строчными.

!!! warning "Ошибка 4. Кириллица в `\\uXXXX`"
    Всегда добавляйте `ensure_ascii=False`.

!!! warning "Ошибка 5. Даты не сериализуются"
    ```python
    json.dumps({"when": datetime.now()})   # ❌
    ```
    Используйте `default=str`.

---

## 🧪 Упражнения

1. ⭐ Превратите словарь в JSON-строку и обратно.
2. ⭐ Сохраните список чисел в `data.json` и прочитайте.
3. ⭐⭐ Прочитайте JSON-файл, выведите все ключи.
4. ⭐⭐ Сохраните список словарей (ученики + оценки) в JSON.
5. ⭐⭐ Реализуйте сохранение и загрузку «настроек» из файла.
6. ⭐⭐⭐ Класс `Person` → `default`-функция → JSON → обратно.
7. ⭐⭐⭐ Мини-база заметок: сохранять список заметок в `notes.json`.

---

## 🔗 Что дальше

→ [Turtle](../10-turtle/index.md) — рисование черепашкой.