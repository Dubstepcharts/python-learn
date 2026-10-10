# Пайплайны данных

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [pandas](../12-pandas/index.md), [файлы](../06-files-errors/files.md).

---

## 📖 Три шага ETL

```
[Источники] → EXTRACT → TRANSFORM → LOAD → [Хранилище]
   API           ↓         ↓           ↓
   CSV        pandas    pandas     pandas / SQL
   SQL        requests  apply      to_sql / to_parquet
   Web        read_sql  groupby
```

**Extract** — собрать данные отовсюду.
**Transform** — очистить, обогатить, агрегировать.
**Load** — положить в БД/файл/дашборд.

---

## 📌 Extract

### CSV / Excel

```python
import pandas as pd

df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")
```

### JSON

```python
df = pd.read_json("data.json")
```

### SQL

```python
import sqlite3

conn = sqlite3.connect("mydb.db")
df = pd.read_sql("SELECT * FROM users", conn)
```

### API

```python
import requests
import pandas as pd

r = requests.get("https://api.example.com/data", timeout=10)
r.raise_for_status()
df = pd.DataFrame(r.json())
```

### Веб

```python
tables = pd.read_html("https://example.com/table")
df = tables[0]
```

---

## 📌 Transform — основное

### Очистка

```python
# Дубликаты
df = df.drop_duplicates()

# Пропуски
df = df.dropna(subset=["важное"])
df["число"] = df["число"].fillna(0)
df["имя"] = df["имя"].fillna("неизвестно")

# Обрезка пробелов
df["текст"] = df["текст"].str.strip()
df["текст"] = df["текст"].str.lower()
```

### Типы

```python
df["дата"] = pd.to_datetime(df["дата"])
df["цена"] = pd.to_numeric(df["цена"], errors="coerce")
df["id"] = df["id"].astype(int)
```

### Новые столбцы

```python
df["год"] = df["дата"].dt.year
df["месяц"] = df["дата"].dt.month
df["сумма_с_ндс"] = df["сумма"] * 1.2
df["категория"] = df["сумма"].apply(
    lambda x: "большая" if x > 1000 else "маленькая"
)
```

### Группировка

```python
monthly = df.groupby(["год", "месяц"])["сумма"].agg(
    ["sum", "mean", "count"]
).reset_index()
```

### Join с другим источником

```python
merged = orders.merge(users, on="user_id", how="left")
```

### Удаление лишнего

```python
df = df.drop(columns=["внутренний_id", "служебное_поле"])
df = df[df["активен"] == True]
```

---

## 📌 Load

### В CSV

```python
df.to_csv("out.csv", index=False, encoding="utf-8-sig")
```

### В Excel

```python
df.to_excel("out.xlsx", index=False)
```

### В SQL

```python
from sqlalchemy import create_engine

engine = create_engine("postgresql://user:pass@host/db")
df.to_sql("table_name", engine, if_exists="append", index=False)
```

### В Parquet (для больших данных)

```python
df.to_parquet("data.parquet", compression="snappy")
```

**Parquet** — в 5–10 раз меньше CSV, читается быстрее. Стандарт для
data-хранилищ.

---

## 📌 Полный пайплайн

```python
import pandas as pd
import requests
from datetime import datetime
from sqlalchemy import create_engine
from loguru import logger

logger.add("etl.log", rotation="10 MB")

def extract(url):
    logger.info(f"Extract from {url}")
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return pd.DataFrame(r.json())

def transform(df):
    logger.info(f"Transform {len(df)} rows")
    df = df.dropna(subset=["id", "name"])
    df["date"] = pd.to_datetime(df["date"])
    df["revenue"] = df["price"] * df["quantity"]
    df["year"] = df["date"].dt.year

    summary = df.groupby("year").agg(
        total=("revenue", "sum"),
        orders=("id", "count"),
    ).reset_index()

    return summary

def load(df, engine):
    logger.info(f"Load {len(df)} rows")
    df.to_sql("yearly_summary", engine,
              if_exists="replace", index=False)

def run():
    try:
        raw = extract("https://api.example.com/orders")
        clean = transform(raw)
        engine = create_engine("sqlite:///warehouse.db")
        load(clean, engine)
        logger.success("ETL завершён успешно")
    except Exception as e:
        logger.exception(f"ETL упал: {e}")
        raise

if __name__ == "__main__":
    run()
```

---

## 📌 Планирование задач

### Через schedule

```python
import schedule
import time

def job():
    run()

schedule.every().day.at("03:00").do(job)
schedule.every().hour.do(job)
schedule.every(10).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(60)
```

### Через cron (Linux/macOS)

```bash
crontab -e
```

```
0 3 * * * cd /path/to/project && python etl.py
```

Запускать каждый день в 3:00.

### Через Windows Task Scheduler

`taskschd.msc` → Create Task → Trigger по расписанию → Action `python etl.py`.

### Airflow / Prefect

Для **сложных** пайплайнов (100+ задач, зависимости, ретраи):

```python
from airflow import DAG
from airflow.operators.python import PythonOperator

with DAG("my_etl", schedule="@daily") as dag:
    extract_task = PythonOperator(task_id="extract", python_callable=extract)
    transform_task = PythonOperator(task_id="transform", python_callable=transform)
    load_task = PythonOperator(task_id="load", python_callable=load)

    extract_task >> transform_task >> load_task
```

Airflow сам решает: что запускать, в каком порядке, что перезапустить
после сбоя, что логировать.

---

## 📌 Качество данных

Проверяйте данные **до** использования:

```python
def validate(df):
    assert df["id"].is_unique, "id не уникален"
    assert not df["email"].isna().any(), "есть пустые email"
    assert (df["age"] >= 0).all(), "отрицательный возраст"
    assert df["date"].dtype == "datetime64[ns]", "не дата"
```

Хорошая практика — библиотека **pandera** или **great expectations**.

---

## 💡 Пример — цены на товары

```python
import requests
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine

def collect_prices():
    # Extract
    df = pd.read_csv("products.csv")
    prices = []

    for _, row in df.iterrows():
        try:
            r = requests.get(row["url"], timeout=5)
            # Transform
            price = float(row["base_price"]) * (1 + row["margin"])
            prices.append({
                "product_id": row["id"],
                "name": row["name"],
                "price": price,
                "checked_at": datetime.now(),
                "status": r.status_code,
            })
        except Exception as e:
            prices.append({
                "product_id": row["id"],
                "name": row["name"],
                "price": None,
                "checked_at": datetime.now(),
                "status": "error",
            })

    # Load
    result = pd.DataFrame(prices)
    engine = create_engine("sqlite:///prices.db")
    result.to_sql("price_history", engine, if_exists="append", index=False)
    return result

print(collect_prices())
```

---

## ⚠️ Частые ошибки

!!! warning "Запуск вручную каждый раз"
    ETL должен работать **сам** по расписанию. Иначе забудется.

!!! warning "Нет логирования"
    Без логов не поймёте, где упал пайплайн. `loguru` — минимум.

!!! warning "Нет идемпотентности"
    Запустили дважды — данные задублировались. Используйте `if_exists="replace"` или ключи UPSERT.

!!! warning "Всё в одну функцию"
    Разбейте на `extract`, `transform`, `load` — тестировать проще.

!!! warning "pandas на гигабайтах"
    pandas грузит всё в память. Для больших данных — **Polars**, **Dask**, **Spark**.

---

## 🧪 Упражнения

1. ⭐ Extract CSV → Transform (переименовать колонки) → Load в SQLite.
2. ⭐ Добавьте логирование.
3. ⭐⭐ Пайплайн: API → pandas → Excel.
4. ⭐⭐ Планировщик через `schedule`.
5. ⭐⭐ Валидация данных.
6. ⭐⭐⭐ Собрать курс валют за неделю по расписанию.
7. ⭐⭐⭐ Пайплайн: 3 источника → объединение → Parquet.

---

## 🔗 Что дальше

→ [Криптография и безопасность](../34-security/index.md).