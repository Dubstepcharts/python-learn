# BeautifulSoup

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [requests](requests.md).

---

## 🍎 Объясняем просто

!!! example "BeautifulSoup — как «умный поиск» по HTML"
    `requests` даёт HTML-код страницы целиком. `BeautifulSoup` превращает
    его в **дерево** — и позволяет легко находить нужные элементы.
    
    ```python
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "html.parser")
    title = soup.find("h1").text
    ```

---

## 🚀 Установка

```bash
pip install beautifulsoup4
```

```python
from bs4 import BeautifulSoup
```

Опционально — быстрый парсер:

```bash
pip install lxml
# потом: BeautifulSoup(html, "lxml")
```

---

## ✍️ Простой пример

```python
from bs4 import BeautifulSoup

html = """
<html>
<head><title>Моя страница</title></head>
<body>
    <h1>Привет!</h1>
    <p class="intro">Это вводный абзац.</p>
    <a href="https://example.com">Ссылка</a>
</body>
</html>
"""

soup = BeautifulSoup(html, "html.parser")
print(soup.title.text)               # Моя страница
print(soup.h1.text)                   # Привет!
print(soup.p.text)                    # Это вводный абзац.
print(soup.a["href"])                 # https://example.com
```

---

## 📌 Парсеры

| Парсер | Плюсы | Минусы |
|---|---|---|
| `html.parser` | Встроенный | Медленный |
| `lxml` | Быстрый | Нужно ставить |
| `html5lib` | Как в браузере | Медленный |

Для 90% задач — **lxml**, если он есть, иначе `html.parser`.

---

## 📌 Поиск элементов

### `find` — первый

```python
soup.find("h1")                     # первая h1
soup.find("a", href=True)            # первая ссылка с href
soup.find("p", class_="intro")       # с классом intro
soup.find("div", id="main")          # с id main
```

### `find_all` — все

```python
soup.find_all("a")                    # все ссылки
soup.find_all("p", class_="text")
soup.find_all(["h1", "h2"])           # все заголовки
soup.find_all("a", limit=5)           # первые 5
```

### `select` — CSS-селекторы (мощь!)

```python
soup.select("h1")                     # все h1
soup.select(".intro")                 # класс intro
soup.select("#main")                  # id main
soup.select("div > p")                # p внутри div
soup.select("a[href]")                # все a с href
soup.select("ul li")                  # li внутри ul
soup.select("div.article h2")
```

Если знаете CSS — используйте `select`.

---

## 📌 Работа с найденным

```python
tag = soup.find("a")

tag.text                # текст внутри
tag.get_text()          # то же (можно с разделителем)
tag.get_text(strip=True)  # без пробелов по краям

tag["href"]              # значение атрибута
tag.get("href")           # безопасно — None, если нет
tag.attrs                 # словарь всех атрибутов

tag.parent                # родитель
tag.children              # дети (итератор)
tag.find_all("span")      # вложенный поиск
```

---

## 📌 Навигация по дереву

```python
tag.parent                # родитель
tag.parents               # все предки
tag.children              # прямые дети
tag.descendants           # все потомки
tag.next_sibling          # следующий сосед
tag.previous_sibling      # предыдущий
tag.next_element          # следующий элемент
tag.find_next("p")        # следующий p
tag.find_previous("a")    # предыдущий a
```

---

## 📌 Комбинированный пример — новости

```python
import requests
from bs4 import BeautifulSoup

url = "https://news.ycombinator.com"
r = requests.get(url, timeout=10)
r.raise_for_status()

soup = BeautifulSoup(r.text, "html.parser")

# Заголовки
for item in soup.select(".titleline > a")[:10]:
    print(item.text)
    print(" ", item["href"])
    print()
```

---

## 📌 Изменение дерева

```python
tag.string = "Новый текст"     # заменить содержимое
tag["class"] = "new-class"       # изменить атрибут
del tag["href"]                   # удалить атрибут

new_tag = soup.new_tag("a", href="/x")
new_tag.string = "Ссылка"
tag.append(new_tag)              # добавить в конец
tag.insert(0, new_tag)            # вставить в начало

tag.decompose()                   # удалить из дерева
```

---

## 💡 Примеры

### Пример 1. Заголовки со страницы 📰

```python
import requests
from bs4 import BeautifulSoup

r = requests.get("https://example.com", timeout=10)
soup = BeautifulSoup(r.text, "html.parser")

for h in soup.find_all(["h1", "h2"]):
    print(h.text.strip())
```

### Пример 2. Все ссылки 🔗

```python
for a in soup.find_all("a", href=True):
    print(a.text, "->", a["href"])
```

### Пример 3. Сюжетный — цены магазина 🛒

```python
import requests
from bs4 import BeautifulSoup

# (псевдокод, зависит от структуры сайта)
r = requests.get("https://books.toscrape.com", timeout=10)
soup = BeautifulSoup(r.text, "html.parser")

for book in soup.select("article.product_pod"):
    title = book.h3.a["title"]
    price = book.select_one(".price_color").text
    print(f"{title}: {price}")
```

**books.toscrape.com** — специально сделан **для тренировки парсинга**.

### Пример 4. Таблица → данные 📊

```python
import pandas as pd
import requests

url = "https://www.w3schools.com/html/html_tables.asp"
tables = pd.read_html(url)
print(tables[0])
```

`pd.read_html` — быстрый способ забрать все таблицы со страницы.

---

## ⚠️ Частые ошибки

!!! warning "Забыли `raise_for_status`"
    Если сайт вернул 404, вы будете парсить страницу ошибки.

!!! warning "Зависимость от класса — хрупкая"
    Сайты меняют HTML. Ваш парсер может «сломаться» в любой момент.
    Старайтесь использовать **устойчивые** селекторы.

!!! warning "`None` у `find`"
    ```python
    title = soup.find("h1").text        # ❌ AttributeError, если нет h1
    h = soup.find("h1")
    title = h.text if h else ""           # ✅
    ```

!!! warning "Игнорирование `robots.txt`"
    Проверьте. Уважайте. Не парсите на максимальной скорости.

!!! warning "Парсинг JS-сайтов"
    `requests` получает **только HTML**. Если данные подгружаются через
    JavaScript — их не будет. Тогда нужен **Selenium**.

---

## 🧪 Упражнения

1. ⭐ Из строки HTML достаньте заголовок страницы.
2. ⭐ Найдите все ссылки на странице.
3. ⭐⭐ Соберите все `h1` и `h2` с example.com.
4. ⭐⭐ Возьмите цены со `books.toscrape.com`.
5. ⭐⭐ Через `pd.read_html` заберите таблицу с любой страницы.
6. ⭐⭐⭐ Парсер новостей: заголовок + ссылка + дата.
7. ⭐⭐⭐ Отслеживание цены товара с сохранением в CSV.

---

## 🔗 Что дальше

→ [Selenium](selenium.md) — автоматизация браузера.