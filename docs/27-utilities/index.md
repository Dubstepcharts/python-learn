# Полезные утилиты

Библиотеки, которые **упрощают жизнь** программиста. Каждая решает одну задачу — и делает это хорошо.

| Библиотека | Для чего |
|---|---|
| **pydantic** | Валидация данных |
| **python-dotenv** | Переменные окружения из `.env` |
| **rich** | Красивый вывод в терминале |
| **loguru** | Простое логирование |
| **tqdm** | Прогресс-бары |
| **click** | CLI-приложения |
| **typer** | CLI на типах (надстройка над click) |
| **faker** | Фейковые данные |
| **pyperclip** | Работа с буфером обмена |
| **schedule** | Планировщик задач |

---

## 📌 pydantic — валидация данных

```bash
pip install pydantic
```

```python
from pydantic import BaseModel, Field, EmailStr, validator

class User(BaseModel):
    name: str
    age: int = Field(ge=0, le=150)
    email: EmailStr

# Автоматическая валидация
u = User(name="Аня", age=12, email="a@mail.ru")
print(u)              # name='Аня' age=12 email='a@mail.ru'

# Ошибки — понятные
try:
    User(name="Аня", age=-5, email="not-email")
except Exception as e:
    print(e)
```

Вся валидация — **декларативно**, в описании класса. Работает в FastAPI,
SQLAlchemy, aiogram 3.x.

---

## 📌 python-dotenv — секреты из `.env`

```bash
pip install python-dotenv
```

**`.env`:**
```
BOT_TOKEN=123:ABC
DATABASE_URL=postgres://...
```

**`.gitignore`:**
```
.env
```

**Код:**
```python
import os
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("BOT_TOKEN")
```

**Никогда** не храните токены в коде — только в `.env`.

---

## 📌 rich — красивый терминал

```bash
pip install rich
```

```python
from rich import print
from rich.console import Console
from rich.table import Table
from rich.progress import track
from rich.panel import Panel

# Красивый вывод
print("[bold red]Ошибка![/bold red] Всё [italic]сломалось[/italic]")

# Таблица
console = Console()
table = Table(title="Ученики")
table.add_column("Имя", style="cyan")
table.add_column("Возраст", style="magenta")
table.add_row("Аня", "12")
table.add_row("Борис", "11")
console.print(table)

# Прогресс
for i in track(range(100), description="Обработка..."):
    pass

# Панель
console.print(Panel("Важное сообщение", title="Внимание"))
```

---

## 📌 loguru — простое логирование

```bash
pip install loguru
```

```python
from loguru import logger

logger.debug("Отладка")
logger.info("Информация")
logger.warning("Предупреждение")
logger.error("Ошибка")
logger.critical("Критично")

# В файл с ротацией
logger.add("app.log", rotation="10 MB", retention="7 days", level="INFO")

# С форматированием
logger.info("Пользователь {} вошёл с IP {}", "Аня", "127.0.0.1")

# Отлов исключений
@logger.catch
def risky():
    1 / 0
```

Одна строка — и красивые логи в файл. Проще, чем `logging`.

---

## 📌 tqdm — прогресс-бары

```bash
pip install tqdm
```

```python
from tqdm import tqdm
import time

# Простой
for i in tqdm(range(100)):
    time.sleep(0.01)

# С описанием
for f in tqdm(files, desc="Обработка"):
    process(f)

# С вложенными
from tqdm import trange
for i in trange(10, desc="Внешний"):
    for j in trange(100, desc="Внутренний", leave=False):
        pass

# Ручной
pbar = tqdm(total=100)
for i in range(10):
    pbar.update(10)
pbar.close()
```

---

## 📌 click — CLI-приложения

```bash
pip install click
```

```python
import click

@click.command()
@click.option("--name", prompt="Ваше имя", help="Имя пользователя")
@click.option("--age", type=int, default=18, help="Возраст")
@click.argument("city")
def greet(name, age, city):
    """Поприветствовать пользователя."""
    click.echo(f"Привет, {name} ({age}) из {city}!")

if __name__ == "__main__":
    greet()
```

Запуск:
```bash
python script.py Москва --name Аня --age 12
```

Click сам генерирует `--help`, обрабатывает типы, валидирует.

**Группы команд:**

```python
@click.group()
def cli(): pass

@cli.command()
def init(): click.echo("Инициализация")

@cli.command()
@click.argument("name")
def add(name): click.echo(f"Добавлено: {name}")

# python script.py init
# python script.py add Аня
```

---

## 📌 typer — CLI на типах

```bash
pip install typer
```

```python
import typer

app = typer.Typer()

@app.command()
def greet(name: str, age: int = 18, city: str = "Москва"):
    """Поприветствовать пользователя."""
    typer.echo(f"Привет, {name} ({age}) из {city}!")

if __name__ == "__main__":
    app()
```

Автодополнение, `--help`, типы — **из аннотаций**. Современнее click.

---

## 📌 faker — фейковые данные

```bash
pip install faker
```

```python
from faker import Faker

fake = Faker("ru_RU")

for _ in range(5):
    print(fake.name(), fake.address(), fake.email())
    print(fake.phone_number(), fake.date_of_birth())
```

Отлично для тестов и демо-данных.

---

## 📌 pyperclip — буфер обмена

```bash
pip install pyperclip
```

```python
import pyperclip

pyperclip.copy("Текст в буфер")
text = pyperclip.paste()
print(text)
```

Работает кроссплатформенно.

---

## 📌 schedule — планировщик

```bash
pip install schedule
```

```python
import schedule
import time

def job():
    print("Выполняется задача!")

schedule.every(10).seconds.do(job)
schedule.every().hour.do(job)
schedule.every().day.at("10:30").do(job)
schedule.every().monday.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
```

Простой способ запускать код по расписанию.

---

## 💡 Полный пример — CLI-заметки

```python
import typer
from rich.console import Console
from rich.table import Table
from pathlib import Path
import json

app = typer.Typer()
console = Console()
FILE = Path("notes.json")

def load_notes():
    return json.loads(FILE.read_text(encoding="utf-8")) if FILE.exists() else []

def save_notes(notes):
    FILE.write_text(json.dumps(notes, ensure_ascii=False, indent=2), encoding="utf-8")

@app.command()
def add(text: str):
    """Добавить заметку."""
    notes = load_notes()
    notes.append(text)
    save_notes(notes)
    console.print(f"[green]✓[/green] Заметка добавлена: {text}")

@app.command()
def list_all():
    """Показать все заметки."""
    notes = load_notes()
    if not notes:
        console.print("[yellow]Заметок нет[/yellow]")
        return

    table = Table(title="Мои заметки")
    table.add_column("#", style="cyan")
    table.add_column("Текст")
    for i, n in enumerate(notes, 1):
        table.add_row(str(i), n)
    console.print(table)

@app.command()
def remove(index: int):
    """Удалить заметку по номеру."""
    notes = load_notes()
    if 0 < index <= len(notes):
        removed = notes.pop(index - 1)
        save_notes(notes)
        console.print(f"[red]✗[/red] Удалена: {removed}")

if __name__ == "__main__":
    app()
```

Запуск:
```bash
python notes.py add "Купить молоко"
python notes.py list-all
python notes.py remove 1
```

---

## ⚠️ Частые ошибки

!!! warning "Секреты в коде"
    Всегда `.env` + `.gitignore`. Публичный токен = скомпрометированный бот.

!!! warning "`print` в большом проекте"
    Для серьёзной отладки — `loguru` или `logging`. `print` — только
    для быстрой проверки.

!!! warning "`requests` + `rich` путают"
    `rich.print` перезаписывает встроенный. Импортируйте явно:
    ```python
    from rich import print      # rich
    # или
    from rich import print as rprint    # если нужны оба
    ```

!!! warning "Файл `.env` попал в репозиторий"
    Удалите его из истории Git (`git filter-repo`), смените все токены.
    Старые считайте скомпрометированными.

---

## 🧪 Упражнения

1. ⭐ Через `rich` выведите цветную таблицу.
2. ⭐ Добавьте `tqdm` к циклу на 1000 итераций.
3. ⭐⭐ CLI на `typer` для калькулятора.
4. ⭐⭐ Валидация формы через `pydantic`.
5. ⭐⭐ Замените `print` на `loguru` в старом проекте.
6. ⭐⭐⭐ CLI-заметки (см. пример).
7. ⭐⭐⭐ Токен бота через `.env` + `python-dotenv`.

---

## 🔗 Что дальше

→ [Проекты](../14-projects/index.md) — собрать всё вместе.