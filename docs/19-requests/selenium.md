# Selenium

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [requests](requests.md), [BeautifulSoup](beautifulsoup.md).

---

## 🍎 Объясняем просто

!!! example "Selenium — «робот в браузере»"
    `requests` получает HTML. Но если сайт рисует данные через **JavaScript**
    (почти все современные сайты) — в HTML их нет.
    
    **Selenium** запускает **настоящий браузер**, кликает, вводит текст,
    ждёт загрузки — и забирает **уже готовые** данные.
    
    Это же используется для **тестирования** сайтов.

---

## 🚀 Установка

```bash
pip install selenium
```

Нужен **драйвер** браузера:

| Браузер | Откуда |
|---|---|
| Chrome | https://chromedriver.chromium.org/ |
| Firefox | https://github.com/mozilla/geckodriver/releases |
| Edge | https://developer.microsoft.com/microsoft-edge/tools/webdriver/ |

Но с Selenium 4.6+ (актуально) драйвер можно не скачивать — Selenium Manager
сделает всё сам.

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
```

---

## ✍️ Первый запуск

```python
from selenium import webdriver

driver = webdriver.Chrome()
driver.get("https://example.com")

print(driver.title)               # Example Domain
print(driver.current_url)

driver.quit()                       # закрыть браузер
```

---

## 📌 Поиск элементов

Selenium использует **By**:

| By | Значит |
|---|---|
| `By.ID` | `id="..."` |
| `By.NAME` | `name="..."` |
| `By.CLASS_NAME` | `class="..."` |
| `By.TAG_NAME` | Имя тега |
| `By.LINK_TEXT` | Текст ссылки |
| `By.PARTIAL_LINK_TEXT` | Часть текста ссылки |
| `By.CSS_SELECTOR` | CSS-селектор |
| `By.XPATH` | XPath |

```python
driver.find_element(By.ID, "login")
driver.find_element(By.CSS_SELECTOR, "h1.title")
driver.find_elements(By.TAG_NAME, "a")     # все ссылки
```

- `find_element` — первый (ошибка, если нет)
- `find_elements` — список (пустой, если нет)

---

## 📌 Действия

### Клик и ввод

```python
from selenium.webdriver.common.keys import Keys

element = driver.find_element(By.NAME, "q")
element.send_keys("python")                     # ввести текст
element.send_keys(Keys.ENTER)                    # нажать Enter
element.send_keys(Keys.CONTROL, "a")             # Ctrl+A

button = driver.find_element(By.ID, "submit")
button.click()
```

### Работа с формами

```python
driver.find_element(By.ID, "username").send_keys("admin")
driver.find_element(By.ID, "password").send_keys("secret")
driver.find_element(By.ID, "login-btn").click()
```

### Выпадающий список

```python
from selenium.webdriver.support.ui import Select

select = Select(driver.find_element(By.NAME, "country"))
select.select_by_visible_text("Россия")
select.select_by_value("RU")
select.select_by_index(0)
```

### Скролл

```python
driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
```

### Скриншот

```python
driver.save_screenshot("page.png")
element.screenshot("element.png")     # только элемент
```

---

## 📌 Ожидания

Сайты грузятся не мгновенно. Selenium даёт **три** способа ждать.

### Неявное ожидание

```python
driver.implicitly_wait(10)     # секунд для всех поисков
```

Простое, но грубое.

### Явное ожидание (рекомендуется)

```python
wait = WebDriverWait(driver, 10)
element = wait.until(
    EC.presence_of_element_located((By.ID, "result"))
)
```

**Популярные условия:**

| Условие | Что ждёт |
|---|---|
| `presence_of_element_located` | Появление в DOM |
| `visibility_of_element_located` | Видимость |
| `element_to_be_clickable` | Кликабельность |
| `text_to_be_present_in_element` | Текст в элементе |
| `alert_is_present` | Появление alert |

### `time.sleep()`

```python
import time
time.sleep(2)     # просто пауза
```

Плохо, но иногда самое простое.

---

## 📌 Работа с окнами и фреймами

```python
driver.switch_to.new_window("tab")              # новая вкладка
driver.switch_to.window(driver.window_handles[1])   # переключиться

driver.switch_to.frame("frame_id")               # войти в iframe
driver.switch_to.default_content()                # выйти

alert = driver.switch_to.alert                    # всплывающее окно
print(alert.text)
alert.accept()                                     # OK
alert.dismiss()                                    # Отмена
```

---

## 📌 Cookies

```python
driver.get_cookies()                    # список cookies
driver.add_cookie({"name": "x", "value": "1"})
driver.delete_all_cookies()
```

---

## 📌 Headless-режим (без окна)

```python
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
```

Удобно для серверов и скриптов — браузер работает **невидимо**.

---

## 💡 Примеры

### Пример 1. Поиск в Google 🔍

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome()
driver.get("https://www.google.com")

search = driver.find_element(By.NAME, "q")
search.send_keys("Python")
search.send_keys(Keys.ENTER)

input("Enter для выхода...")
driver.quit()
```

### Пример 2. Автоматический вход 🔐

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com/login")

driver.find_element(By.ID, "username").send_keys("admin")
driver.find_element(By.ID, "password").send_keys("secret")
driver.find_element(By.ID, "login").click()

driver.implicitly_wait(5)
print(driver.current_url)         # куда попали после логина

driver.quit()
```

### Пример 3. Парсинг JS-сайта 📊

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com/products")
driver.implicitly_wait(10)

for card in driver.find_elements(By.CSS_SELECTOR, ".product-card"):
    title = card.find_element(By.CSS_SELECTOR, ".title").text
    price = card.find_element(By.CSS_SELECTOR, ".price").text
    print(f"{title}: {price}")

driver.quit()
```

### Пример 4. Скриншот сайта 📸

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless")
options.add_argument("--window-size=1280,800")

driver = webdriver.Chrome(options=options)
driver.get("https://example.com")
driver.save_screenshot("screenshot.png")
driver.quit()
```

### Пример 5. Сюжетный — отслеживание цены 📉

```python
import time
from selenium import webdriver
from selenium.webdriver.common.by import By

def get_price(url, selector):
    driver = webdriver.Chrome()
    try:
        driver.get(url)
        driver.implicitly_wait(5)
        return driver.find_element(By.CSS_SELECTOR, selector).text
    finally:
        driver.quit()

price = get_price("https://books.toscrape.com", ".price_color")
print(f"Цена: {price}")
```

---

## 📌 Selenium Grid и удалённые браузеры

Для больших задач — **Selenium Grid** или облачные сервисы (BrowserStack,
Sauce Labs). Работает так же, только `webdriver.Remote(...)` вместо
`webdriver.Chrome()`.

---

## ⚠️ Частые ошибки

!!! warning "Забыли `driver.quit()`"
    Браузер остаётся висеть. Используйте `try/finally`.

!!! warning "Не дождались загрузки"
    `find_element` не найдёт элемент, которого ещё нет. Используйте
    `WebDriverWait`.

!!! warning "Selenium для простого парсинга"
    Если сайт без JS — используйте **requests + BeautifulSoup**. Быстрее
    в десятки раз.

!!! warning "Слишком много браузеров"
    Каждый `webdriver.Chrome()` запускает **новый процесс**. Не создавайте
    много — переиспользуйте.

!!! warning "Скачивание драйвера вручную"
    С Selenium 4.6+ ничего скачивать не нужно — Manager сам подберёт.

---

## 📌 Сравнение с requests/BS

| | requests + BS | Selenium |
|---|---|---|
| Скорость | Очень быстро | Медленно |
| JS-сайты | ❌ | ✅ |
| Требует браузер | ❌ | ✅ |
| Для тестов | ❌ | ✅ |
| Для парсинга | ✅ Простых | ✅ Сложных |

**Правило:** сначала попробуйте `requests + BS`. Если данных нет — они
рисуются JS — тогда Selenium.

---

## 🧪 Упражнения

1. ⭐ Откройте example.com, выведите заголовок.
2. ⭐ Сделайте скриншот страницы.
3. ⭐⭐ Поиск в Google через Selenium.
4. ⭐⭐ Автоматический вход на тестовый сайт.
5. ⭐⭐ Соберите все ссылки на странице через `find_elements`.
6. ⭐⭐⭐ Headless-парсер JS-сайта.
7. ⭐⭐⭐ Мини-бот: открывает страницу, кликает по кнопке, ждёт результат, сохраняет скриншот.

---

## 🔗 Что дальше

→ [Базы данных](../20-databases/index.md).