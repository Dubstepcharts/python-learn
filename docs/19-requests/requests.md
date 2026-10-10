# requests

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [словари](../04-collections/dicts.md), [JSON](../09-stdlib/json.md).

---

## 🍎 Объясняем просто

!!! example "requests — как «браузер в одну строку»"
    ```python
    import requests

    r = requests.get("https://example.com")
    print(r.status_code)     # 200 — успех
    print(r.text)            # HTML-код страницы
    ```
    
    Всё, что делает браузер, когда ты заходишь на сайт, — здесь делается
    командой `requests.get(...)`.

---

## 🚀 Установка

```bash
pip install requests
```

```python
import requests
```

---

## 📌 GET-запросы

```python
r = requests.get("https://api.github.com/users/torvalds")
print(r.status_code)         # 200
print(r.text)                # тело как строка
print(r.content)             # тело как байты
print(r.headers)             # заголовки ответа
print(r.url)                 # итоговый URL (после редиректов)
print(r.encoding)            # кодировка
```

### Параметры URL

Вместо склейки строк — `params`:

```python
params = {"q": "python", "page": 1}
r = requests.get("https://api.example.com/search", params=params)
print(r.url)     # https://api.example.com/search?q=python&page=1
```

---

## 📌 HTTP-коды

| Код | Значит |
|---|---|
| 200 | OK |
| 201 | Создано |
| 204 | Нет содержимого |
| 301, 302 | Редирект |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Запрещено |
| 404 | Не найдено |
| 500 | Ошибка сервера |
| 503 | Сервис недоступен |

```python
if r.status_code == 200:
    print("Успех")
elif r.status_code == 404:
    print("Не найдено")

# Или удобнее:
r.raise_for_status()    # бросит исключение при 4xx/5xx
```

### Исключения

```python
try:
    r = requests.get("https://site.com", timeout=5)
    r.raise_for_status()
except requests.Timeout:
    print("Превышено время ожидания")
except requests.HTTPError as e:
    print(f"HTTP-ошибка: {e}")
except requests.RequestException as e:
    print(f"Ошибка запроса: {e}")
```

---

## 📌 POST-запросы

### Форма (application/x-www-form-urlencoded)

```python
r = requests.post(
    "https://httpbin.org/post",
    data={"name": "Аня", "age": 12},
)
```

### JSON (application/json)

```python
r = requests.post(
    "https://httpbin.org/post",
    json={"name": "Аня", "age": 12},
)
```

### Файлы

```python
files = {"file": open("doc.pdf", "rb")}
r = requests.post("https://httpbin.org/post", files=files)
```

---

## 📌 Заголовки

Иногда сервер требует определённые заголовки (User-Agent, Accept, Authorization):

```python
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36",
    "Accept": "application/json",
    "Authorization": "Bearer ВАШ_ТОКЕН",
}

r = requests.get("https://api.example.com/data", headers=headers)
```

!!! tip "Зачем User-Agent"
    Некоторые сайты блокируют запросы **без** User-Agent или с «Python-requests».
    Подставьте настоящий браузерный UA.

---

## 📌 Работа с JSON

```python
r = requests.get("https://api.github.com/users/torvalds")
data = r.json()               # сразу словарь/список

print(data["name"])            # Linus Torvalds
print(data["public_repos"])    # число репозиториев
print(data["followers"])       # подписчиков
```

`r.json()` = `json.loads(r.text)`.

---

## 📌 Cookies и сессии

```python
# Отправить свои cookies
cookies = {"session": "abc123"}
r = requests.get("https://site.com", cookies=cookies)
print(r.cookies)              # cookies, установленные сервером

# Session — сохраняет cookies между запросами
with requests.Session() as s:
    s.post("https://site.com/login", data={"user": "admin", "pass": "123"})
    r = s.get("https://site.com/dashboard")   # уже авторизованы
```

**`Session`** — важный инструмент для сайтов, где нужно логиниться.

---

## 📌 Скачивание файлов

```python
r = requests.get("https://example.com/image.jpg", stream=True)
with open("image.jpg", "wb") as f:
    for chunk in r.iter_content(chunk_size=8192):
        f.write(chunk)
```

Для больших файлов `stream=True` экономит память.

Простой вариант:

```python
r = requests.get(url)
with open("file", "wb") as f:
    f.write(r.content)
```

---

## 📌 Таймауты

**Всегда** указывайте `timeout`:

```python
r = requests.get(url, timeout=10)             # 10 секунд
r = requests.get(url, timeout=(3.05, 27))     # (connect, read)
```

Без timeout скрипт может «висеть» бесконечно.

---

## 📌 Прокси

```python
proxies = {
    "http": "http://10.0.0.1:8080",
    "https": "http://10.0.0.1:8080",
}
r = requests.get(url, proxies=proxies)
```

---

## 📌 Редиректы

```python
r = requests.get("http://github.com", allow_redirects=True)   # по умолчанию
print(r.history)          # список промежуточных ответов
print(r.url)              # итоговый URL

r = requests.get(url, allow_redirects=False)   # без редиректов
```

---

## 💡 Примеры

### Пример 1. Погода через API 🌤️

```python
import requests

def get_weather(city):
    url = f"https://wttr.in/{city}?format=j1"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()

    current = data["current_condition"][0]
    return {
        "temp": current["temp_C"],
        "desc": current["weatherDesc"][0]["value"],
        "humidity": current["humidity"],
    }

w = get_weather("Москва")
print(f"{w['temp']}°C, {w['desc']}, влажность {w['humidity']}%")
```

### Пример 2. Курс валют 💱

```python
import requests

r = requests.get("https://www.cbr-xml-daily.ru/daily_json.js", timeout=10)
data = r.json()

usd = data["Valute"]["USD"]["Value"]
eur = data["Valute"]["EUR"]["Value"]
print(f"USD: {usd:.2f} руб.")
print(f"EUR: {eur:.2f} руб.")
```

### Пример 3. Информация о GitHub-профиле 🐙

```python
import requests

def github_info(username):
    r = requests.get(f"https://api.github.com/users/{username}")
    if r.status_code != 200:
        return None
    data = r.json()
    return {
        "name": data.get("name"),
        "repos": data.get("public_repos"),
        "followers": data.get("followers"),
    }

info = github_info("torvalds")
print(info)
```

### Пример 4. Сюжетный — курс биткоина 🪙

```python
import requests

r = requests.get("https://api.coindesk.com/v1/bpi/currentprice.json", timeout=10)
data = r.json()
usd = data["bpi"]["USD"]["rate_float"]
print(f"1 BTC = ${usd:,.2f}")
```

### Пример 5. Скачивание картинки 🖼️

```python
import requests

url = "https://picsum.photos/800/600"
r = requests.get(url, timeout=10)
with open("photo.jpg", "wb") as f:
    f.write(r.content)
print("Сохранено")
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `timeout`"
    Скрипт может «висеть» бесконечно, если сайт не отвечает.

!!! warning "Нет обработки ошибок"
    ```python
    r = requests.get(url)     # при ошибке — исключение
    ```
    Оборачивайте в `try/except` или используйте `r.raise_for_status()`.

!!! warning "Игнорирование кодировки"
    ```python
    r.encoding = "utf-8"       # если сайт отдаёт неверную
    print(r.text)
    ```

!!! warning "`r.json()` без проверки"
    Если сервер вернул HTML — будет `JSONDecodeError`.
    Проверяйте `r.headers["Content-Type"]` или `try/except`.

!!! warning "Слишком частые запросы"
    Сервер может забанить. `time.sleep(1)` между запросами.

---

## 🧪 Упражнения

1. ⭐ Получите главную страницу example.com и выведите её длину.
2. ⭐ Выведите все заголовки ответа.
3. ⭐⭐ Через API GitHub получите данные о любом пользователе.
4. ⭐⭐ Скачайте картинку с сайта.
5. ⭐⭐ Отправьте POST на `httpbin.org/post` и посмотрите, что вернётся.
6. ⭐⭐⭐ Через `Session` сохраните cookies между двумя запросами.
7. ⭐⭐⭐ Получите курс валют ЦБ и сохраните в JSON-файл.

---

## 🔗 Что дальше

→ [BeautifulSoup](beautifulsoup.md) — парсинг HTML.