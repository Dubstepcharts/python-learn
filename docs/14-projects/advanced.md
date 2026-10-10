# Продвинутые проекты

Для тех, кто уверенно владеет **ООП**, знает **библиотеки**, готов работать
с **интернетом** и **интерфейсами**.

---

## 🌐 Проект 1. Погодное приложение

**Что делает:** спрашивает город, получает погоду через открытый API, выводит.

Нужен `requests`:

```bash
pip install requests
```

```python
import requests

def get_weather(city):
    # Бесплатный API wttr.in
    url = f"https://wttr.in/{city}?format=j1"
    r = requests.get(url, timeout=10)
    if r.status_code != 200:
        return None
    data = r.json()

    current = data["current_condition"][0]
    return {
        "temp": current["temp_C"],
        "feels": current["FeelsLikeC"],
        "desc": current["weatherDesc"][0]["value"],
        "humidity": current["humidity"],
    }

city = input("Город: ")
w = get_weather(city)
if w:
    print(f"Сейчас: {w['temp']}°C ({w['desc']})")
    print(f"Ощущается: {w['feels']}°C")
    print(f"Влажность: {w['humidity']}%")
else:
    print("Не удалось получить данные")
```

**Что добавить:** прогноз на 3 дня, сохранение любимых городов, график температуры.

---

## 🤖 Проект 2. Telegram-бот

Нужен `pytelegrambotapi`:

```bash
pip install pyTelegramBotAPI
```

Токен получите у [@BotFather](https://t.me/BotFather) в Telegram.

```python
import telebot
import random

TOKEN = "вставьте_свой_токен"
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=["start"])
def start(message):
    bot.send_message(message.chat.id, "Привет! Я бот-эхо. Напиши что-нибудь.")

@bot.message_handler(commands=["help"])
def help_cmd(message):
    bot.send_message(message.chat.id, "Команды: /start, /help, /roll, /coin")

@bot.message_handler(commands=["roll"])
def roll(message):
    bot.reply_to(message, f"🎲 Выпало: {random.randint(1, 6)}")

@bot.message_handler(commands=["coin"])
def coin(message):
    bot.reply_to(message, random.choice(["Орёл", "Решка"]))

@bot.message_handler(func=lambda m: True)
def echo(message):
    bot.reply_to(message, message.text)

bot.polling()
```

**Что добавить:** викторину, напоминания, отправку картинок, хранение данных в SQLite.

---

## 🎨 Проект 3. Приложение на PyQt5 — блокнот

Мини-редактор с меню «Открыть», «Сохранить», шрифтом и подсчётом слов.

```python
import sys
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QTextEdit, QAction, QFileDialog, QMessageBox
)

class Notepad(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Блокнот")
        self.resize(800, 600)

        self.text = QTextEdit()
        self.setCentralWidget(self.text)

        menubar = self.menuBar()
        file_menu = menubar.addMenu("Файл")
        file_menu.addAction(self._action("Открыть", self.open_file, "Ctrl+O"))
        file_menu.addAction(self._action("Сохранить", self.save_file, "Ctrl+S"))
        file_menu.addAction(self._action("Выход", self.close, "Ctrl+Q"))

        tools = menubar.addMenu("Инструменты")
        tools.addAction(self._action("Статистика", self.show_stats))

    def _action(self, name, func, shortcut=None):
        act = QAction(name, self)
        act.triggered.connect(func)
        if shortcut:
            act.setShortcut(shortcut)
        return act

    def open_file(self):
        path, _ = QFileDialog.getOpenFileName(self, "Открыть", "", "Текст (*.txt)")
        if path:
            self.text.setText(open(path, encoding="utf-8").read())

    def save_file(self):
        path, _ = QFileDialog.getSaveFileName(self, "Сохранить", "", "Текст (*.txt)")
        if path:
            open(path, "w", encoding="utf-8").write(self.text.toPlainText())

    def show_stats(self):
        text = self.text.toPlainText()
        words = len(text.split())
        chars = len(text)
        QMessageBox.information(self, "Статистика", f"Слов: {words}\nСимволов: {chars}")

app = QApplication(sys.argv)
w = Notepad()
w.show()
sys.exit(app.exec_())
```

**Что добавить:** поиск и замена, подсветку синтаксиса, тёмную тему через QSS, сохранение в разных форматах.

---

## 📊 Проект 4. Анализ данных с pandas

Возьмите любой CSV из открытых данных (например, статистика по футболу,
продажи, погода) и постройте отчёт.

Пример — анализ успеваемости:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Загружаем
df = pd.read_csv("grades.csv")

# Обработка
df["средний"] = df[["математика", "русский", "физика"]].mean(axis=1)
df["отличник"] = df["средний"] >= 4.5

# Статистика
print(df.describe())
print("\nОтличников:", df["отличник"].sum())

# Топ-5
print("\nТоп-5:")
print(df.nlargest(5, "средний")[["имя", "средний"]])

# График
df.set_index("имя")["средний"].sort_values().plot(kind="barh")
plt.title("Средний балл")
plt.tight_layout()
plt.show()

# По группам
print("\nПо классам:")
print(df.groupby("класс")["средний"].agg(["mean", "count"]))
```

---

## 📱 Проект 5. Мобильное приложение на Kivy

Простое приложение-заметки или счётчик. См. [раздел Kivy](../13-kivy/index.md).
Соберите в APK через Buildozer и установите на свой телефон.

**Идеи:**
- Счётчик шагов (ручной)
- Заметки с автосохранением в файл
- Викторина с вопросами из JSON
- Мини-игра «Поймай кнопку»

---

## 🕸️ Проект 6. Парсер сайта

**Что делает:** собирает заголовки новостей или цены с сайта.

Нужны `requests` и `beautifulsoup4`:

```bash
pip install requests beautifulsoup4
```

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"
r = requests.get(url, timeout=10)
r.raise_for_status()

soup = BeautifulSoup(r.text, "html.parser")
for h in soup.find_all(["h1", "h2"])[:10]:
    print(h.get_text(strip=True))
```

!!! warning "⚠️ Этика и закон"
    - Уважайте `robots.txt` сайта
    - Не парсите слишком часто (пауза `time.sleep(1)`)
    - Не выдавайте чужой контент за свой
    - Проверяйте условия использования сайта

---

## 🧠 Проект 7. Свой «умный» помощник

Объедините всё, что знаете:

- **ООП** — классы `Task`, `Note`, `Reminder`
- **Файлы + JSON** — хранение между запусками
- **PyQt5** или **Kivy** — интерфейс
- **pandas** — статистика
- **datetime** — работа с датами

Можно сделать «личный планировщик» с заметками, задачами, напоминаниями и
отчётами по неделям. Это отличный **итоговый проект года**.

---

## 📌 Как довести проект до конца

1. **Начните с минимума** — работающая версия на 50 строк
2. **Добавляйте по одной фиче**
3. **Тестируйте** после каждой
4. **Коммитьте** в Git каждый значимый шаг
5. **Завершите** — не бросайте на 90% готовности
6. **Опубликуйте** на GitHub с README: описание, скриншоты, инструкция

!!! tip "README-шаблон"
    ```markdown
    # Название проекта
    
    Коротко, что это и зачем.
    
    ## Установка
    ```
    
    ## Использование
    ```
    
    ## Скриншоты
    (картинка)
    
    ## Технологии
    Python 3.12, PyQt5, pandas
    ```

---

## 🎯 Идеи ещё

- **Блог на Flask** — веб-сайт с заметками
- **Телеграм-бот-напоминалка** с хранением в SQLite
- **Конвертер валют** с API ЦБ
- **Трекер привычек** с графиками
- **ИИ-помощник** через API OpenAI или Yandex GPT
- **Аркада на pygame** — своя игра
- **Пакет на PyPI** — опубликовать свою библиотеку

---

## 🔗 Что дальше

→ Поздравляем! Курс завершён. Что делать дальше:

1. **Выберите 2–3 проекта** и сделайте их
2. **Опубликуйте на GitHub** — [свой сайт-портфолио](../00-start/install.md)
3. **Начните изучать** углублённо: алгоритмы, базы данных, веб, ML
4. **Помогайте другим** — объяснять — лучший способ учиться

Успехов! 🐍🚀