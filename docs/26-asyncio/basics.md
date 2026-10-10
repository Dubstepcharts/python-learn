# asyncio: основы

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [функции](../05-functions/index.md), [генераторы](../04-collections/comprehensions.md).

---

## 📖 Основные понятия

| Термин | Значит |
|---|---|
| **Coroutine** | Функция `async def` — «может подождать» |
| **await** | «Отдай управление другим задачам, пока я жду» |
| **Event loop** | «Диспетчер» — решает, кто сейчас работает |
| **Task** | Запущенная корутина |
| **Future** | Результат, который появится позже |

---

## ✍️ Простая корутина

```python
import asyncio

async def hello():
    print("Начало")
    await asyncio.sleep(1)         # «Жди 1 секунду, но не блокируй других»
    print("Конец")

asyncio.run(hello())
```

**`asyncio.run(...)`** — точка входа. Создаёт event loop, выполняет корутину,
закрывает.

**`await asyncio.sleep(1)`** — асинхронная пауза. В отличие от `time.sleep(1)`
**не блокирует** цикл — другие задачи продолжают работать.

---

## 📌 Одна задача vs несколько

### Последовательно (медленно)

```python
import time

def sync_task(n):
    time.sleep(1)
    return n * 2

start = time.time()
results = [sync_task(i) for i in range(3)]
print(results, f"{time.time() - start:.1f} сек")   # ~3.0 сек
```

### Асинхронно параллельно (быстро)

```python
import asyncio

async def async_task(n):
    await asyncio.sleep(1)
    return n * 2

async def main():
    start = asyncio.get_event_loop().time()
    results = await asyncio.gather(
        async_task(1), async_task(2), async_task(3)
    )
    print(results, f"{asyncio.get_event_loop().time() - start:.1f} сек")

asyncio.run(main())     # ~1.0 сек — в 3 раза быстрее!
```

---

## 📌 `create_task` — запустить «в фоне»

```python
async def worker(name, delay):
    print(f"{name}: старт")
    await asyncio.sleep(delay)
    print(f"{name}: готово")

async def main():
    task1 = asyncio.create_task(worker("A", 2))
    task2 = asyncio.create_task(worker("B", 1))

    await task1
    await task2

asyncio.run(main())
```

Обе задачи стартуют **сразу**. `await` ждёт завершения.

---

## 📌 `gather` — ждать все

```python
async def main():
    results = await asyncio.gather(
        worker("A", 2),
        worker("B", 1),
        worker("C", 3),
    )
```

Возвращает **список результатов** в порядке передачи. Если одна упадёт —
по умолчанию отменит остальные (можно `return_exceptions=True`).

---

## 📌 `wait_for` — таймаут

```python
try:
    result = await asyncio.wait_for(some_task(), timeout=5)
except asyncio.TimeoutError:
    print("Превышено время")
```

---

## 📌 Очередь `asyncio.Queue`

Паттерн «производитель — потребитель»:

```python
import asyncio
import random

async def producer(queue):
    for i in range(5):
        await asyncio.sleep(0.2)
        await queue.put(i)
        print(f"Создано: {i}")
    await queue.put(None)         # сигнал «хватит»

async def consumer(queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"Обработано: {item}")
        await asyncio.sleep(0.5)

async def main():
    queue = asyncio.Queue()
    await asyncio.gather(producer(queue), consumer(queue))

asyncio.run(main())
```

---

## 📌 Примитивы синхронизации

| Примитив | Для чего |
|---|---|
| `Lock` | Взаимное исключение |
| `Semaphore` | Ограничить число одновременных |
| `Event` | Ожидание сигнала |
| `Condition` | Ожидание условия |
| `Barrier` | Ждать N задач |

**Пример — семафор, ограничивающий одновременные запросы:**

```python
sem = asyncio.Semaphore(5)      # не более 5 одновременно

async def fetch(url):
    async with sem:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as r:
                return await r.text()
```

---

## 📌 `aiohttp` — HTTP-запросы

```bash
pip install aiohttp
```

```python
import asyncio
import aiohttp

async def fetch(session, url):
    async with session.get(url) as r:
        return await r.text()

async def main():
    urls = [f"https://example.com/?p={i}" for i in range(20)]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

    print(f"Получено {len(results)} ответов")

asyncio.run(main())
```

20 запросов параллельно — **в 20 раз быстрее**, чем последовательно.

---

## 📌 `as_completed`

Обрабатывать результаты **по мере готовности**, а не в порядке запуска:

```python
from asyncio import as_completed

for coro in as_completed([task1, task2, task3]):
    result = await coro
    print(result)
```

---

## 💡 Пример — асинхронный парсер

```python
import asyncio
import aiohttp

async def fetch_status(session, url):
    try:
        async with session.head(url, timeout=5) as r:
            return url, r.status
    except Exception as e:
        return url, f"ошибка: {e}"

async def main():
    urls = [
        "https://example.com",
        "https://python.org",
        "https://github.com",
        "https://ya.ru",
        "https://stackoverflow.com",
    ]

    async with aiohttp.ClientSession() as session:
        results = await asyncio.gather(*[fetch_status(session, u) for u in urls])

    for url, status in results:
        print(f"{url:35} → {status}")

asyncio.run(main())
```

---

## ⚠️ Частые ошибки

!!! warning "Блокирующий код в `async def`"
    ```python
    async def f():
        time.sleep(5)          # ❌ блокирует весь event loop
    ```
    **Правильно:** `await asyncio.sleep(5)`. Для синхронных операций —
    `await asyncio.to_thread(sync_func)`.

!!! warning "Забыли `await`"
    ```python
    result = some_coro()        # ❌ result — корутина, а не результат
    ```
    Всегда `await`.

!!! warning "`async def` вне `asyncio.run`"
    Корутину нужно запустить через `asyncio.run(main())` или
    `create_task`.

!!! warning "Слишком много параллельно"
    Парсинг 10 000 сайтов разом — вас забанит. Используйте `Semaphore(20)`.

!!! warning "`requests` в асинхронном коде"
    `requests` — синхронный, заблокирует цикл. Используйте `aiohttp`
    или `httpx`.

---

## 🧪 Упражнения

1. ⭐ `async def hello()` с `await asyncio.sleep(1)`.
2. ⭐ Три задачи через `create_task`.
3. ⭐⭐ Сравнить время sync и async.
4. ⭐⭐ Таймаут через `wait_for`.
5. ⭐⭐ Очередь: производитель + потребитель.
6. ⭐⭐⭐ Асинхронный загрузчик 10 URL через `aiohttp`.
7. ⭐⭐⭐ Семафор: не более 5 одновременных запросов.

---

## 🔗 Что дальше

→ [Утилиты](../27-utilities/index.md).