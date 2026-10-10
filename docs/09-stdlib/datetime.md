# datetime

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса. Нужно знать: [строки](../03-strings/index.md).

---

## 🍎 Объясняем просто

!!! example "Три «кирпичика» времени"
    - **`date`** — дата (год, месяц, день)
    - **`time`** — время (час, минута, секунда)
    - **`datetime`** — и то и другое вместе
    - **`timedelta`** — «сколько времени прошло» (разница)

    ```python
    from datetime import date, time, datetime, timedelta
    d = date(2024, 1, 15)
    t = time(14, 30)
    dt = datetime(2024, 1, 15, 14, 30)
    delta = timedelta(days=5)
    ```

---

## 📖 Основные классы

| Класс | Что представляет |
|---|---|
| `date` | Дата: год, месяц, день |
| `time` | Время: час, минута, секунда, микросекунда |
| `datetime` | Дата + время |
| `timedelta` | Разница между моментами |
| `timezone` | Смещение от UTC |
| `tzinfo` | Абстрактный базовый для зон |
| `ZoneInfo` (3.9+) | Из базы tzdata |

### Класс `date`

```python
from datetime import date

d = date(2024, 1, 15)
print(d.year)         # 2024
print(d.month)        # 1
print(d.day)          # 15
print(d.weekday())    # 0 (пн) .. 6 (вс)
print(d.isoweekday()) # 1 (пн) .. 7 (вс)
print(d.isoformat())  # '2024-01-15'

today = date.today()             # сегодня
```

### Класс `time`

```python
from datetime import time

t = time(14, 30, 45, 123456)
print(t.hour)          # 14
print(t.minute)        # 30
print(t.second)        # 45
print(t.microsecond)   # 123456
print(t.tzinfo)        # None (если без зоны)
```

### Класс `datetime`

```python
from datetime import datetime

now = datetime.now()          # текущий момент
utc = datetime.utcnow()       # ⚠️ устаревает в 3.12
utc2 = datetime.now(tz=None)  # локальное

dt = datetime(2024, 1, 15, 14, 30)
print(dt.year, dt.month, dt.day, dt.hour, dt.minute)
print(dt.date())              # date(2024, 1, 15)
print(dt.time())              # time(14, 30)
```

!!! tip "Использование с часовыми поясами"
    ```python
    from datetime import datetime, timezone
    now_utc = datetime.now(timezone.utc)     # ✅ с зоной
    ```

### Класс `timedelta`

```python
from datetime import timedelta

delta = timedelta(days=5, hours=3, minutes=30)
print(delta.days)         # 5
print(delta.seconds)      # 12600 (3*3600 + 30*60)
print(delta.total_seconds())   # 450600.0

# Арифметика
d1 = date(2024, 1, 1)
d2 = d1 + timedelta(days=30)
print(d2)                 # 2024-01-31
print((d2 - d1).days)     # 30
```

---

## 🎯 Форматирование

### `strftime` — datetime → строка

| Код | Значит | Пример |
|---|---|---|
| `%Y` | Год (4 знака) | 2024 |
| `%y` | Год (2 знака) | 24 |
| `%m` | Месяц | 01–12 |
| `%d` | День | 01–31 |
| `%H` | Час (24) | 00–23 |
| `%I` | Час (12) | 01–12 |
| `%M` | Минуты | 00–59 |
| `%S` | Секунды | 00–59 |
| `%f` | Микросекунды | 000000–999999 |
| `%A` | Полное имя дня | Monday |
| `%a` | Короткое имя дня | Mon |
| `%B` | Полное имя месяца | January |
| `%b` | Короткое имя месяца | Jan |
| `%j` | День года | 001–366 |
| `%U` | Номер недели (с вс) | 00–53 |
| `%W` | Номер недели (с пн) | 00–53 |
| `%w` | День недели (0=вс) | 0–6 |
| `%p` | AM/PM | AM / PM |
| `%Z` | Имя зоны | UTC |
| `%z` | Смещение | +0300 |
| `%%` | Знак % | % |

```python
from datetime import datetime

now = datetime(2024, 1, 15, 14, 30, 45)
print(now.strftime("%d.%m.%Y %H:%M"))         # 15.01.2024 14:30
print(now.strftime("%A, %d %B %Y"))           # Monday, 15 January 2024
print(now.strftime("%Y-%m-%dT%H:%M:%S"))      # ISO 8601
```

### `strptime` — строка → datetime

```python
from datetime import datetime

s = "15.01.2024 14:30"
dt = datetime.strptime(s, "%d.%m.%Y %H:%M")
print(dt)     # 2024-01-15 14:30:00
```

### `isoformat` / `fromisoformat`

```python
dt = datetime(2024, 1, 15, 14, 30, 45)
print(dt.isoformat())          # '2024-01-15T14:30:45'

same = datetime.fromisoformat("2024-01-15T14:30:45")
```

---

## 🎯 Арифметика с датами

```python
from datetime import date, timedelta

today = date.today()
tomorrow = today + timedelta(days=1)
in_week = today + timedelta(weeks=1)
yesterday = today - timedelta(days=1)

diff = date(2024, 12, 31) - date(2024, 1, 1)
print(diff.days)              # 365 или 366

# Сравнение
print(date(2024, 1, 1) < date(2024, 12, 31))   # True
```

---

## 🌍 Часовые пояса

### `timezone` (простой)

```python
from datetime import datetime, timezone, timedelta

utc = timezone.utc
msk = timezone(timedelta(hours=3))

now_utc = datetime.now(utc)
now_msk = now_utc.astimezone(msk)
print(now_utc)
print(now_msk)
```

### `zoneinfo` (с базой IANA, 3.9+)

```python
from zoneinfo import ZoneInfo
from datetime import datetime

now = datetime.now(ZoneInfo("Europe/Moscow"))
print(now)
print(now.tzname())     # MSK
```

Если базы нет — установите: `pip install tzdata`.

---

## 📌 Методы `datetime`

| Метод | Что делает |
|---|---|
| `now(tz=None)` | Текущий момент |
| `utcnow()` | UTC (устаревает) |
| `today()` | То же, что `now()` |
| `fromtimestamp(ts)` | Из Unix-time |
| `utcfromtimestamp(ts)` | Из Unix-time UTC |
| `timestamp()` | В Unix-time |
| `fromisoformat(s)` | Из ISO-строки |
| `strptime(s, fmt)` | Из строки по формату |
| `strftime(fmt)` | В строку по формату |
| `isoformat(sep)` | В ISO-строку |
| `date()` | Только дата |
| `time()` | Только время |
| `replace(...)` | Копия с заменой полей |
| `astimezone(tz)` | В другую зону |
| `dst()` | Летнее время |
| `tzname()` | Имя зоны |
| `utcoffset()` | Смещение от UTC |
| `weekday()` | День недели (0=пн) |
| `isoweekday()` | День недели (1=пн) |
| `isocalendar()` | Кортеж (год, неделя, день) |
| `ctime()` | Строка в стиле C |
| `combine(d, t)` | Класс-метод: date + time = datetime |

---

## 🕐 Модуль `time`

Низкоуровневый. Часто нужен для замеров и пауз.

| Функция | Что делает |
|---|---|
| `time.time()` | Unix-time (секунды с 01.01.1970) |
| `time.sleep(sec)` | Пауза |
| `time.perf_counter()` | Для замеров производительности |
| `time.monotonic()` | Монотонное время |
| `time.process_time()` | CPU-время процесса |
| `time.ctime(ts)` | Строка из timestamp |
| `time.localtime(ts)` | struct_time локальный |
| `time.gmtime(ts)` | struct_time UTC |
| `time.mktime(struct)` | struct_time → timestamp |
| `time.strftime(fmt, struct)` | Форматирование |
| `time.strptime(s, fmt)` | Разбор |
| `time.time_ns()` | Наносекунды |

```python
import time

start = time.perf_counter()
sum(range(1_000_000))
print(f"Заняло: {time.perf_counter() - start:.4f} сек")

time.sleep(1)     # пауза 1 сек
```

---

## 💡 Примеры

### Пример 1. Сколько дней до Нового года 🎄

```python
from datetime import date

today = date.today()
new_year = date(today.year + 1, 1, 1) if today.month == 12 else date(today.year, 1, 1)
# Простой вариант — на 1 января следующего года:
next_ny = date(today.year + 1, 1, 1)
print(f"До Нового года: {(next_ny - today).days} дней")
```

### Пример 2. Возраст по дате рождения 🎂

```python
from datetime import date

def age(birth):
    today = date.today()
    years = today.year - birth.year
    if (today.month, today.day) < (birth.month, birth.day):
        years -= 1
    return years

b = date(2010, 5, 12)
print(age(b))
```

### Пример 3. Форматирование «красиво» 📅

```python
from datetime import datetime

now = datetime.now()
print(now.strftime("Сегодня %A, %d %B %Y, %H:%M"))
# Сегодня Monday, 15 January 2024, 14:30
```

### Пример 4. Сюжетный — сколько ты уже живёшь 🕰️

```python
from datetime import datetime

birth = datetime(2010, 5, 12)
now = datetime.now()
delta = now - birth

print(f"Ты живёшь уже:")
print(f"  дней: {delta.days}")
print(f"  часов: {delta.total_seconds() / 3600:.0f}")
print(f"  минут: {delta.total_seconds() / 60:.0f}")
```

### Пример 5. Календарь на месяц 📆

```python
import calendar

print(calendar.month(2024, 1))
print(calendar.isleap(2024))      # True
```

Модуль `calendar` — отдельный, тоже из стандартной библиотеки.

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Наивные vs осознанные даты"
    ```python
    datetime.now()           # «наивная» — без зоны
    datetime.now(timezone.utc)   # «осознанная» — с зоной
    ```
    Сравнивать «наивные» и «осознанные» нельзя — будет `TypeError`.

!!! warning "Ошибка 2. Путаница `strftime` и `strptime`"
    - `strf` — **f**ormat: datetime → строка
    - `strp` — **p**arse: строка → datetime

!!! warning "Ошибка 3. `datetime.utcnow()` устаревает"
    В Python 3.12+ официально рекомендуется:
    ```python
    datetime.now(timezone.utc)
    ```

!!! warning "Ошибка 4. Сложить дату и время"
    ```python
    date(2024, 1, 1) + time(14, 30)   # ❌ TypeError
    ```
    Сначала объедините:
    ```python
    datetime.combine(date(2024, 1, 1), time(14, 30))
    ```

!!! warning "Ошибка 5. Забыли `timedelta` для дней"
    ```python
    date.today() + 5        # ❌ TypeError
    date.today() + timedelta(days=5)   # ✅
    ```

---

## 🧪 Упражнения

1. ⭐ Выведите сегодняшнюю дату в формате `ДД.ММ.ГГГГ`.
2. ⭐ Сколько дней прошло с 1 января 2000 года?
3. ⭐⭐ Напишите функцию, считающую возраст по дате рождения.
4. ⭐⭐ Найдите, какой день недели был 1 сентября 2010 года.
5. ⭐⭐ Отформатируйте текущее время как `15 января 2024, 14:30`.
6. ⭐⭐⭐ Замерьте время работы цикла на 10 млн итераций.
7. ⭐⭐⭐ Разберите строку `"12.05.2010"` в дату и выведите день недели.

---

## 🔗 Что дальше

→ [os и sys](os-sys.md) — файлы, папки, аргументы командной строки.