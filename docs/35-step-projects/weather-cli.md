# Проект по шагам: Погодный CLI

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [requests](../19-requests/requests.md), [click / typer](../27-utilities/index.md).

Время: **1 урок**.

---

## 🎯 Что делаем

Команда `weather Москва` в терминале — и выводится погода. С цветами,
иконками и прогнозом на 3 дня.

---

## 📌 Шаг 1. Зависимости

```bash
pip install requests typer rich
```

`requirements.txt`:

```
requests
typer
rich
```

---

## 📌 Шаг 2. Скелет

Создайте `weather.py`:

```python
import typer
from rich.console import Console
from rich.table import Table

app = typer.Typer()
console = Console()

@app.command()
def get(city: str):
    """Показать погоду в городе."""
    console.print(f"Город: [bold]{city}[/bold]")

if __name__ == "__main__":
    app()
```

Запуск:

```bash
python weather.py get Москва
```

Должно вывести «Город: Москва».

---

## 📌 Шаг 3. Запрос к API

Используем бесплатный **wttr.in** — не требует ключа.

```python
import requests

def fetch_weather(city: str) -> dict:
    url = f"https://wttr.in/{city}?format=j1"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return r.json()
```

Проверьте:

```python
data = fetch_weather("Москва")
print(data["current_condition"][0])
```

---

## 📌 Шаг 4. Парсим данные

```python
def parse_current(data: dict) -> dict:
    c = data["current_condition"][0]
    return {
        "temp": int(c["temp_C"]),
        "feels": int(c["FeelsLikeC"]),
        "desc": c["weatherDesc"][0]["value"],
        "humidity": int(c["humidity"]),
        "wind": int(c["windspeedKmph"]),
    }

def parse_forecast(data: dict) -> list:
    result = []
    for day in data["weather"][:3]:
        result.append({
            "date": day["date"],
            "max": int(day["maxtempC"]),
            "min": int(day["mintempC"]),
            "desc": day["hourly"][4]["weatherDesc"][0]["value"],
        })
    return result
```

---

## 📌 Шаг 5. Красивый вывод

```python
def print_current(city: str, cur: dict):
    console.print(f"\n[bold cyan]{city}[/bold cyan]")
    console.print(f"  {cur['desc']}")
    console.print(f"  Температура: [bold]{cur['temp']}°C[/bold]")
    console.print(f"  Ощущается как: {cur['feels']}°C")
    console.print(f"  Влажность: {cur['humidity']}%")
    console.print(f"  Ветер: {cur['wind']} км/ч")

def print_forecast(fc: list):
    table = Table(title="Прогноз на 3 дня")
    table.add_column("Дата", style="cyan")
    table.add_column("Днём", justify="right")
    table.add_column("Ночью", justify="right")
    table.add_column("Описание")

    for d in fc:
        table.add_row(d["date"], f"{d['max']}°C", f"{d['min']}°C", d["desc"])

    console.print(table)
```

---

## 📌 Шаг 6. Собираем всё

```python
@app.command()
def get(city: str):
    """Показать погоду в городе."""
    try:
        data = fetch_weather(city)
    except requests.HTTPError:
        console.print(f"[red]Город не найден: {city}[/red]")
        raise typer.Exit(1)
    except requests.Timeout:
        console.print("[red]Превышено время ожидания[/red]")
        raise typer.Exit(1)

    cur = parse_current(data)
    fc = parse_forecast(data)

    print_current(city, cur)
    print_forecast(fc)
```

Запуск:

```bash
python weather.py get "Санкт-Петербург"
```

Получите таблицу с погодой и прогнозом.

---

## 📌 Шаг 7. Первая буква заглавная

Улучшим UX:

```python
@app.command()
def get(city: str):
    city = city.title()    # москва → Москва
    ...
```

---

## 📌 Шаг 8. Несколько городов сразу

Добавим опцию `--all`:

```python
from typing import List

@app.command()
def get(
    cities: List[str] = typer.Argument(..., help="Города через пробел"),
):
    """Погода в одном или нескольких городах."""
    for city in cities:
        try:
            data = fetch_weather(city)
            cur = parse_current(data)
            print_current(city.title(), cur)
        except Exception as e:
            console.print(f"[red]{city}: ошибка — {e}[/red]")
```

Запуск:

```bash
python weather.py get Москва Лондон Токио
```

---

## 📌 Шаг 9. Кеш на 10 минут

Чтобы не долбить API:

```python
import json
from pathlib import Path
from datetime import datetime, timedelta

CACHE = Path.home() / ".weather_cache"
CACHE.mkdir(exist_ok=True)

def get_cached(city: str):
    path = CACHE / f"{city}.json"
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
        if datetime.fromisoformat(data["_ts"]) > datetime.now() - timedelta(minutes=10):
            return data
    return None

def set_cached(city: str, data: dict):
    data["_ts"] = datetime.now().isoformat()
    path = CACHE / f"{city}.json"
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
```

---

## 📌 Шаг 10. Установка как команды

Чтобы вызывать `weather Москва` из любой папки:

**1. Добавьте shebang в начало `weather.py`:**

```python
#!/usr/bin/env python
```

**2. Сделайте файл исполняемым (Linux/macOS):**

```bash
chmod +x weather.py
```

**3. Симлинк в `~/.local/bin/` (Linux/macOS):**

```bash
ln -s "$(pwd)/weather.py" ~/.local/bin/weather
```

Убедитесь, что `~/.local/bin` в `PATH`.

**4. Windows:** положите `weather.bat` рядом:

```bat
@echo off
python "C:\путь\к\weather.py" %*
```

И добавьте папку в `PATH`.

Теперь в любом терминале:

```bash
weather Москва
```

---

## ⚠️ Возможные проблемы

!!! warning "wttr.in иногда недоступен"
    Добавьте fallback на другой API или Retry.

!!! warning "Кириллица в пути кеша"
    Имена файлов кеша из кириллицы лучше транслитерировать или хешировать.

!!! warning "Таймаут при медленном интернете"
    Увеличьте `timeout=20`, либо сделайте его опцией.

---

## 🎯 Что дальше

- Курс валют (`https://www.cbr-xml-daily.ru/daily_json.js`)
- Курс биткоина
- Пробки
- Телеграм-бот на базе этого же кода

---

## 🔗 Что дальше

→ [Личный дневник на Flask](flask-diary.md).