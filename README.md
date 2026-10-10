<div align="center">

# 🐍 Питон-Планета 🌍

**Бесплатный учебник по Python для школьников 5–11 класса**

От «Hello, world!» до нейросетей — 40+ разделов, 260+ статей, десятки проектов.

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![MkDocs](https://img.shields.io/badge/MkDocs-Material-526CFE?logo=markdown&logoColor=white)](https://squidfunk.github.io/mkdocs-material/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy](https://github.com/Dubstepcharts/python-learn/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dubstepcharts/python-learn/actions)
[![Сайт](https://img.shields.io/badge/сайт-открыть-brightgreen)](https://Dubstepcharts.github.io/python-learn/)

**[🌐 Открыть сайт](https://Dubstepcharts.github.io/python-learn/)** ·
**[📚 Все разделы](https://Dubstepcharts.github.io/python-learn/)** ·
**[🆘 Частые ошибки](https://Dubstepcharts.github.io/python-learn/41-errors/)**

</div>

---

## 🎯 О проекте

**Питон-Планета** — открытый учебник по Python. Написан для школьников, но подойдёт и взрослым, которые начинают с нуля.

**Особенности:**

- 📖 **Понятные объяснения** — каждая тема разбирается «простыми словами» и «подробнее»
- 🐍 **Весь Python** — от переменных до магических методов
- 🧩 **Популярные библиотеки** — turtle, PyQt5, pandas, Kivy, pygame, FastAPI, Django
- 💡 **Много примеров** — код, результат, объяснение
- 🧪 **Упражнения** — после каждой темы, по уровням ⭐ / ⭐⭐ / ⭐⭐⭐
- 🆘 **Справочник ошибок** — 30+ самых частых ошибок с решениями
- 🎯 **Проекты** — от «Угадай число» до Telegram-ботов
- 🌍 **Бесплатно** — без рекламы, регистрации и оплаты

---

## 🗂️ Что внутри

### 🚀 Старт

Установка Python, редактор кода, первая программа.

### 📘 Ядро Python

| Раздел | Темы |
|---|---|
| **Основы** | Переменные, типы, операторы, ввод/вывод |
| **Управление потоком** | `if`, `while`, `for`, `break`, `continue` |
| **Строки** | Все методы, форматирование, срезы |
| **Коллекции** | Списки, кортежи, словари, множества, генераторы |
| **Функции** | Аргументы, `*args`, `**kwargs`, декораторы, lambda |
| **Файлы и ошибки** | Работа с файлами, `try/except` |
| **Модули и пакеты** | Импорт, свои модули, `pip`, venv |
| **ООП** | Классы, наследование, полиморфизм, магические методы |
| **Стандартная библиотека** | `math`, `random`, `datetime`, `os`, `json` + все встроенные функции |

### 🧩 Библиотеки

- 🐢 **Turtle** — рисование для младших
- 🖥️ **PyQt5** — оконные приложения
- 📊 **pandas** — работа с таблицами
- 📱 **Kivy** — мобильные приложения
- 🪟 **tkinter** — простой GUI из коробки
- 🎮 **pygame** — 2D-игры
- 🖼️ **Pillow** — обработка картинок
- 🤖 **Telegram-боты** (aiogram)
- 🧪 **pytest** — тестирование
- ⚡ **asyncio** — асинхронность
- 🛠️ **Утилиты** — pydantic, rich, loguru, tqdm, typer

### 🌐 Профессиональное

- **Веб-разработка**: Flask, FastAPI, Django
- **Работа с интернетом**: requests, BeautifulSoup, Selenium
- **Базы данных**: SQL, SQLite, SQLAlchemy, PostgreSQL, MongoDB
- **Наука о данных**: NumPy, matplotlib, scikit-learn
- **Алгоритмы**: сложность, сортировки, структуры данных
- **ML**: нейросети, PyTorch, TensorFlow
- **Скрапинг**: этика, продакшн, Scrapy, Playwright
- **DevOps**: Docker, GitHub Actions, деплой
- **Геймдев**: Ursina, Panda3D
- **Безопасность**: криптография, OWASP

### 🎓 Подготовка

- **Git**: ветки, слияние, GitHub, продвинутое
- **Linux**: терминал, SSH, systemd, cron
- **ЕГЭ и олимпиады**: стратегия, разбор задач
- **Карьера в IT**: профессии, интервью, резюме

### 🎯 Проекты

- **Идеи проектов** — для начинающих, средних, продвинутых
- **Пошаговые туториалы** — Telegram-бот викторины, погодный CLI, дневник на Flask

### 🆘 Ошибки

Справочник 30+ частых ошибок с примерами и решениями: `SyntaxError`, `IndentationError`, `ValueError`, `TypeError`, `ModuleNotFoundError`, ошибки Git, MkDocs, pip, venv.

---

## 🚀 Локальный запуск

### Требования

- **Python 3.10+**
- **Git** (для клонирования и плагина дат)

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Dubstepcharts/python-learn.git
cd python-learn

# 2. Создать виртуальное окружение (рекомендуется)
python -m venv .venv

# Windows:
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
source .venv/bin/activate

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Запустить локальный сервер
mkdocs serve
```

Откройте **http://127.0.0.1:8000** — сайт работает локально.

### Собрать статику

```bash
mkdocs build
```

Результат — в папке `site/`.

### Деплой

Автоматически при `git push` в `main`:

- GitHub Actions запускает `mkdocs gh-deploy`
- Сайт собирается в ветку `gh-pages`
- Через 30–60 секунд обновляется по адресу https://Dubstepcharts.github.io/python-learn/

---

## 🛠️ Стек

- **MkDocs** — генератор статического сайта
- **Material for MkDocs** — тема оформления
- **Python-Markdown** + **PyMdown Extensions** — расширения Markdown
- **GitHub Pages** — хостинг
- **GitHub Actions** — CI/CD

---

## 📁 Структура проекта

```
python-learn/
├── docs/                       # Все страницы учебника
│   ├── index.md                 # Главная
│   ├── 00-start/                # Старт
│   ├── 01-basics/               # Основы Python
│   ├── ...
│   ├── 41-errors/               # Справочник ошибок
│   ├── assets/images/           # Логотип, картинки
│   ├── javascripts/             # Свои скрипты
│   └── stylesheets/extra.css     # Свои стили
├── .github/workflows/deploy.yml  # Автосборка на GitHub Pages
├── mkdocs.yml                    # Конфигурация сайта
├── requirements.txt              # Зависимости Python
└── README.md                     # Этот файл
```

---

## ✏️ Как добавить свою страницу

1. Создайте файл в `docs/` — например, `docs/01-basics/loops.md`
2. Напишите содержимое в Markdown:

```markdown
# Заголовок

Текст статьи с примерами.

```python
print("Привет!")
```
```

3. Добавьте файл в `mkdocs.yml` в раздел `nav:`
4. Запустите `mkdocs serve` — увидите страницу локально
5. Сделайте `git push` — сайт обновится автоматически

---

## 🤝 Как помочь проекту

Мы рады любому вкладу:

- 🐛 **Нашли ошибку** — создайте [Issue](https://github.com/Dubstepcharts/python-learn/issues)
- ✏️ **Хотите улучшить** — сделайте Fork, исправьте, пришлите Pull Request
- 💡 **Идея нового раздела** — тоже Issue
- 📣 **Рассказали друзьям** — уже помощь!

**Правила простые:**

1. Одна правка — один Pull Request
2. Проверяйте локально перед отправкой (`mkdocs serve`)
3. Пишите понятные сообщения коммитов

---

## 📜 Лицензия

Проект распространяется под лицензией **MIT**. См. файл [LICENSE](LICENSE).

Вы можете:

- ✅ Использовать в школе и дома
- ✅ Изменять под себя
- ✅ Распространять
- ✅ Использовать в коммерческих целях

Условие одно: сохранить упоминание автора.

---

## 🙏 Благодарности

- Команде **Material for MkDocs** за прекрасную тему
- Всем авторам **PyMdown Extensions**
- Сообществу **Python** — за лучший язык программирования
- Ученикам и учителям, которые используют этот учебник

---

## 🔗 Полезные ссылки

- **[🌐 Сайт учебника](https://Dubstepcharts.github.io/python-learn/)**
- **[📖 Официальная документация Python](https://docs.python.org/3/)**
- **[🐙 GitHub репозиторий](https://github.com/Dubstepcharts/python-learn)**
- **[🐛 Сообщить о проблеме](https://github.com/Dubstepcharts/python-learn/issues)**

---

<div align="center">

**Если проект помог — поставьте ⭐ на GitHub!**

Сделано с ❤️ для школьников, которые учат Python

</div>