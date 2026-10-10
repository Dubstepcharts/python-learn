# Чтение и запись

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [Series и DataFrame](series-dataframe.md).

---

## 🍎 Объясняем просто

!!! example "pandas — «швейцарский нож» для форматов"
    CSV, Excel, JSON, SQL, HTML, Parquet — pandas читает и пишет их
    **двумя строчками**:

    ```python
    df = pd.read_csv("data.csv")
    df.to_csv("out.csv")
    ```

---

## 📖 Чтение

### CSV

```python
import pandas as pd

df = pd.read_csv("data.csv")
```

Ключевые параметры:

| Параметр | Что делает |
|---|---|
| `sep` | Разделитель (`,` / `;` / `\t`) |
| `header` | Какая строка — заголовки (`0`, `None`) |
| `names` | Свои имена колонок |
| `index_col` | Какая колонка — индекс |
| `usecols` | Какие колонки брать |
| `dtype` | Типы колонок |
| `encoding` | Кодировка (`utf-8`, `cp1251`) |
| `na_values` | Что считать пропуском |
| `skiprows` | Пропустить первые N строк |
| `nrows` | Прочитать только N строк |
| `parse_dates` | Разобрать как даты |
| `thousands` | Разделитель тысяч |

```python
df = pd.read_csv(
    "data.csv",
    sep=";",
    encoding="utf-8",
    usecols=["имя", "возраст"],
    nrows=100,
    parse_dates=["дата_рождения"],
)
```

### Excel

Нужен `openpyxl`:

```bash
pip install openpyxl
```

```python
df = pd.read_excel("data.xlsx", sheet_name="Лист1")
sheets = pd.read_excel("data.xlsx", sheet_name=None)   # все листы (dict)
```

### JSON

```python
df = pd.read_json("data.json")
```

### SQL

```python
import sqlite3

conn = sqlite3.connect("database.db")
df = pd.read_sql("SELECT * FROM users", conn)
conn.close()
```

### HTML (таблицы)

```python
tables = pd.read_html("https://example.com/table")   # список DataFrame
df = tables[0]
```

### Прочее

| Функция | Формат |
|---|---|
| `read_parquet` | Parquet |
| `read_pickle` | Pickle |
| `read_clipboard` | Из буфера обмена |
| `read_fwf` | Фиксированная ширина |
| `read_xml` | XML (1.3+) |
| `read_orc`, `read_feather`, `read_hdf`, `read_stata`, `read_sas`, `read_spss` | Продвинутые |

---

## 📖 Запись

### CSV

```python
df.to_csv("out.csv", index=False, encoding="utf-8")
```

| Параметр | Значит |
|---|---|
| `index=False` | Не писать индекс (часто нужно!) |
| `sep=";"` | Другой разделитель |
| `header=False` | Без строки заголовков |
| `columns=[...]` | Только указанные колонки |
| `encoding="utf-8-sig"` | Для Excel (BOM) |
| `na_rep="-"` | Чем заменить NaN |
| `float_format="%.2f"` | Формат float |

### Excel

```python
df.to_excel("out.xlsx", index=False, sheet_name="Отчёт")
```

С несколькими листами:

```python
with pd.ExcelWriter("out.xlsx") as writer:
    df1.to_excel(writer, sheet_name="Лист1")
    df2.to_excel(writer, sheet_name="Лист2")
```

### JSON

```python
df.to_json("out.json", orient="records", force_ascii=False, indent=2)
```

`orient` — как разложить: `"records"`, `"columns"`, `"index"`, `"values"`, `"table"`, `"split"`.

### SQL

```python
df.to_sql("table_name", conn, if_exists="replace", index=False)
```

`if_exists`: `"fail"`, `"replace"`, `"append"`.

### HTML

```python
df.to_html("out.html", index=False)
```

### Прочее

`to_pickle`, `to_parquet`, `to_markdown`, `to_latex`, `to_string`, `to_dict`, `to_numpy`, `to_records`, `to_clipboard`.

---

## 💡 Примеры

### Пример 1. Прочитать CSV и посмотреть 🗂️

```python
import pandas as pd

df = pd.read_csv("students.csv")
print(df.head())
print(df.info())
print(df.describe())
```

### Пример 2. Из списка — в CSV 📝

```python
import pandas as pd

data = [
    {"имя": "Аня", "оценка": 5},
    {"имя": "Борис", "оценка": 4},
    {"имя": "Вика", "оценка": 5},
]
df = pd.DataFrame(data)
df.to_csv("grades.csv", index=False, encoding="utf-8-sig")
```

### Пример 3. Два листа в Excel 📊

```python
import pandas as pd

отличники = pd.DataFrame({"имя": ["Аня", "Вика"], "средний": [4.9, 5.0]})
троечники = pd.DataFrame({"имя": ["Глеб"], "средний": [3.0]})

with pd.ExcelWriter("отчёт.xlsx") as writer:
    отличники.to_excel(writer, sheet_name="Отличники", index=False)
    троечники.to_excel(writer, sheet_name="Троечники", index=False)
```

### Пример 4. JSON из API 🌐

```python
import pandas as pd
import requests

r = requests.get("https://api.github.com/repos/pandas-dev/pandas")
data = pd.DataFrame([r.json()])
print(data[["name", "stargazers_count", "language"]])
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `UnicodeDecodeError`"
    ```python
    pd.read_csv("file.csv")                    # ❌ на Windows с cp1251
    pd.read_csv("file.csv", encoding="cp1251") # ✅
    ```

!!! warning "Ошибка 2. Кириллица в CSV для Excel"
    Сохраняйте через `encoding="utf-8-sig"` — Excel поймёт.

!!! warning "Ошибка 3. Слипшиеся колонки"
    ```python
    pd.read_csv("file.csv")              # если разделитель ';' — всё в одну
    pd.read_csv("file.csv", sep=";")     # ✅
    ```

!!! warning "Ошибка 4. `index=False` забыли"
    В CSV попадёт «безымянная» первая колонка с 0, 1, 2...

!!! warning "Ошибка 5. Файл открыт в Excel"
    `PermissionError` — закройте файл перед `to_excel`.

---

## 🧪 Упражнения

1. ⭐ Создайте DataFrame, сохраните в CSV, прочитайте обратно.
2. ⭐ Прочитайте CSV только с 2 колонками.
3. ⭐⭐ Сохраните DataFrame в Excel с двумя листами.
4. ⭐⭐ Прочитайте JSON-файл и выведите первые 3 строки.
5. ⭐⭐ Сохраните в JSON с `orient="records"`.
6. ⭐⭐⭐ Прочитайте таблицу с HTML-страницы через `read_html`.
7. ⭐⭐⭐ Сохраните результат в SQLite и прочитайте обратно.

---

## 🔗 Что дальше

→ [Фильтрация](filtering.md).