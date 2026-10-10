# Продакшн-скрапинг

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [asyncio](../26-asyncio/basics.md), [requests](../19-requests/requests.md).

---

## 📌 Асинхронный парсер

Самый большой прирост скорости — **параллельные запросы**.

```python
import asyncio
import aiohttp
from bs4 import BeautifulSoup

async def fetch(session, url, sem):
    async with sem:
        try:
            async with session.get(url, timeout=10) as r:
                return await r.text()
        except Exception as e:
            print(f"Ошибка {url}: {e}")
            return None

async def parse(html):
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")
    return soup.title.string if soup.title else None

async def main(urls):
    sem = asyncio.Semaphore(10)             # не более 10 одновременно
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url, sem) for url in urls]
        pages = await asyncio.gather(*tasks)
        return [await parse(p) for p in pages]

urls = [f"https://example.com/page{i}" for i in range(100)]
titles = asyncio.run(main(urls))
```

**Семафор** — ключевой момент. Без него забанит сервер.

---

## 📌 Обработка ошибок

Реальный скрапинг — это **борьба с исключениями**:

```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import requests

session = requests.Session()

retries = Retry(
    total=5,
    backoff_factor=1,               # 1с, 2с, 4с, 8с...
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET", "POST"],
)

session.mount("https://", HTTPAdapter(max_retries=retries))

try:
    r = session.get(url, timeout=10)
    r.raise_for_status()
except requests.Timeout:
    ...
except requests.HTTPError as e:
    ...
except requests.RequestException as e:
    ...
```

**`Retry`** автоматически повторяет при временных ошибках.

---

## 📌 Прогресс и логи

```python
from tqdm import tqdm
from loguru import logger

logger.add("scraper.log", rotation="10 MB")

for url in tqdm(urls, desc="Парсинг"):
    try:
        html = fetch(url)
        logger.info(f"OK: {url}")
    except Exception as e:
        logger.error(f"FAIL: {url} — {e}")
```

---

## 📌 Сохранение результатов

**В JSON:**
```python
import json

with open("results.json", "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
```

**В CSV:**
```python
import pandas as pd
pd.DataFrame(items).to_csv("results.csv", index=False)
```

**В SQLite:**
```python
import sqlite3

conn = sqlite3.connect("scraped.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS items (
        url TEXT PRIMARY KEY,
        title TEXT,
        price REAL
    )
""")
conn.executemany(
    "INSERT OR REPLACE INTO items (url, title, price) VALUES (?, ?, ?)",
    [(i["url"], i["title"], i["price"]) for i in items],
)
conn.commit()
```

SQLite — **лучший выбор** для парсера: не теряет данные при сбое,
позволяет докачивать.

---

## 📌 Устойчивость к сбоям

**Чекпоинт** — сохраняем прогресс:

```python
from pathlib import Path
import json

def load_progress():
    if Path("progress.json").exists():
        return json.loads(Path("progress.json").read_text())
    return {"done": []}

def save_progress(state):
    Path("progress.json").write_text(json.dumps(state))

state = load_progress()
done = set(state["done"])

for url in urls:
    if url in done:
        continue
    try:
        html = fetch(url)
        save_data(html)
        done.add(url)
        state["done"] = list(done)
        save_progress(state)
    except Exception as e:
        logger.error(e)
```

Если упадёт — при следующем запуске продолжит с места остановки.

---

## 📌 Прокси

Когда IP заблокирован. **Только легально** — через свой сервер или
платный сервис.

```python
proxies = {
    "http": "http://user:pass@proxy.example.com:8080",
    "https": "http://user:pass@proxy.example.com:8080",
}

r = requests.get(url, proxies=proxies)
```

**Ротация прокси:**
```python
import random

proxies_list = [
    "http://proxy1:8080",
    "http://proxy2:8080",
    "http://proxy3:8080",
]

for url in urls:
    proxy = random.choice(proxies_list)
    try:
        r = requests.get(url, proxies={"https": proxy})
    except:
        continue
```

---

## 📌 Scrapy — для больших проектов

**Scrapy** — фреймворк для промышленного скрапинга: асинхронный,
много встроенного, легко масштабируется.

```bash
pip install scrapy
scrapy startproject myproject
cd myproject
scrapy genspider example example.com
```

**`spiders/example.py`:**
```python
import scrapy

class ExampleSpider(scrapy.Spider):
    name = "example"
    start_urls = ["https://books.toscrape.com"]

    def parse(self, response):
        for book in response.css("article.product_pod"):
            yield {
                "title": book.css("h3 a::attr(title)").get(),
                "price": book.css(".price_color::text").get(),
            }

        next_page = response.css("li.next a::attr(href)").get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)
```

**Запуск:**
```bash
scrapy crawl example -o books.csv
```

Scrapy сам:
- делает паузы
- обрабатывает редиректы
- хранит состояние
- сохраняет в CSV/JSON/БД

**Когда Scrapy:** сотни тысяч страниц, сложные сайты, продакшен.

---

## 📌 Playwright — современнее Selenium

```bash
pip install playwright
playwright install
```

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://example.com")
    page.wait_for_selector("h1")
    title = page.inner_text("h1")
    page.screenshot(path="page.png")
    browser.close()
```

Быстрее Selenium, API приятнее, автоматически ставит браузеры.

---

## 💡 Полный пример — цены на книги

```python
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import sqlite3
from loguru import logger
from tqdm.asyncio import tqdm

BASE = "https://books.toscrape.com"
DB = "books.db"

async def fetch(session, url, sem):
    async with sem:
        try:
            async with session.get(url, timeout=10) as r:
                return await r.text()
        except Exception as e:
            logger.error(f"{url}: {e}")
            return None

async def parse_page(session, url, sem):
    html = await fetch(session, url, sem)
    if not html:
        return []
    soup = BeautifulSoup(html, "html.parser")

    items = []
    for card in soup.select("article.product_pod"):
        items.append({
            "title": card.h3.a["title"],
            "price": float(card.select_one(".price_color").text.replace("£", "")),
        })

    # Следующая страница
    nxt = soup.select_one("li.next a")
    if nxt:
        next_url = f"{BASE}/catalogue/{nxt['href']}"
        items += await parse_page(session, next_url, sem)

    return items

async def main():
    sem = asyncio.Semaphore(5)
    async with aiohttp.ClientSession() as session:
        items = await parse_page(session, f"{BASE}/catalogue/page-1.html", sem)

    conn = sqlite3.connect(DB)
    conn.execute("CREATE TABLE IF NOT EXISTS books (title TEXT, price REAL)")
    conn.executemany(
        "INSERT INTO books (title, price) VALUES (?, ?)",
        [(i["title"], i["price"]) for i in items],
    )
    conn.commit()
    conn.close()

    logger.info(f"Собрано {len(items)} книг")

asyncio.run(main())
```

---

## ⚠️ Частые ошибки

!!! warning "Нет семафора"
    Асинхронный парсер без ограничения = атака.

!!! warning "Нет сохранения прогресса"
    Упал на 90% — начинай заново. Чекпоинты обязательны.

!!! warning "Ошибки не логируются"
    Сайт поменял вёрстку — вы не замечаете. Логируйте всё.

!!! warning "Хрупкие селекторы"
    `div > div > span > a` — сломается при любом рефакторинге сайта.
    Используйте **классы** и **атрибуты**.

!!! warning "Данные без первичного ключа"
    Дубликаты. Всегда сохраняйте URL как PRIMARY KEY.

---

## 🧪 Упражнения

1. ⭐ Асинхронный парсер 100 URL с семафором 5.
2. ⭐ Добавьте `Retry`.
3. ⭐⭐ Сохраните результат в SQLite.
4. ⭐⭐ Добавьте чекпоинт.
5. ⭐⭐ Логирование через `loguru`.
6. ⭐⭐⭐ Полный пайплайн с Scrapy.
7. ⭐⭐⭐ Playwright для JS-сайта.

---

## 🔗 Что дальше

→ [DevOps](../31-devops/index.md).