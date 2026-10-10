# pip и виртуальные окружения

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 8–11 класса. Нужно знать: [свои модули](custom-modules.md).

---

## 🍎 Объясняем просто

!!! example "pip — это «магазин» библиотек"
    В Python есть тысячи готовых библиотек: для игр, графиков, веб-сайтов,
    роботов. Чтобы их установить, используется **pip** — менеджер пакетов.
    
    Одна команда — и библиотека готова к использованию:
    ```bash
    pip install pygame
    ```

---

## 📖 Что такое pip

`pip` — стандартный менеджер пакетов Python. Он:
- Скачивает пакеты с **PyPI** (Python Package Index, https://pypi.org)
- Ставит их и их зависимости
- Умеет обновлять и удалять

Проверить, что `pip` есть:

```bash
pip --version
# pip 24.0 from ... (python 3.12)
```

Если `pip` не найден — попробуйте `python -m pip --version`.

---

## 📦 Основные команды

| Команда | Что делает |
|---|---|
| `pip install package` | Установить |
| `pip install package==1.2.3` | Конкретная версия |
| `pip install package>=1.2,<2` | Диапазон версий |
| `pip install --upgrade package` | Обновить |
| `pip uninstall package` | Удалить |
| `pip list` | Список установленных |
| `pip show package` | Информация о пакете |
| `pip freeze` | Список с версиями |
| `pip search term` | Поиск (⚠️ отключён с 2020) |
| `pip install -r requirements.txt` | Поставить из файла |

### `pip freeze` и `requirements.txt`

Чтобы поделиться проектом, сохраните список:

```bash
pip freeze > requirements.txt
```

Другой человек (или вы через месяц) воспроизведёт окружение:

```bash
pip install -r requirements.txt
```

**Пример `requirements.txt`:**
```
requests==2.31.0
numpy==1.26.2
matplotlib>=3.8
```

`==` — точная версия, `>=` — минимальная, `~=` — совместимая.

---

## 🏝️ Виртуальные окружения (`venv`)

**Проблема:** ставить все библиотеки глобально — плохо. Один проект требует
`numpy==1.20`, другой — `numpy==2.0`. Глобально не поставишь обе.

**Решение:** для каждого проекта — своё **виртуальное окружение** (venv).
Это изолированная «песочница» со своим Python и своими пакетами.

### Создание и активация

```bash
# Создать
python -m venv .venv

# Активировать
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1

# Windows (cmd):
.venv\Scripts\activate.bat

# macOS / Linux:
source .venv/bin/activate
```

После активации перед строкой появится `(.venv)`. Теперь `pip install ...`
ставит **в этот проект**, а не глобально.

### Деактивация

```bash
deactivate
```

### Что это даёт

- **Изоляция** — пакеты одного проекта не мешают другому
- **Чистота** — систему не «засоряем»
- **Воспроизводимость** — `requirements.txt` + `venv` = один в один

!!! tip "Куда класть `.venv`"
    Обычно — в корень проекта. И **обязательно** добавляйте в `.gitignore`:
    ```
    .venv/
    ```
    В репозиторий **не надо** коммитить содержимое venv — только
    `requirements.txt`.

---

## 📋 Полный цикл нового проекта

```bash
# 1. Создать папку проекта
mkdir myproject
cd myproject

# 2. Создать venv
python -m venv .venv

# 3. Активировать
.\.venv\Scripts\Activate.ps1     # Windows

# 4. Установить библиотеки
pip install requests matplotlib

# 5. Сохранить зависимости
pip freeze > requirements.txt

# 6. Работать. Когда вернётесь через месяц:
pip install -r requirements.txt
```

---

## 📚 Что часто ставят школьники

| Библиотека | Для чего |
|---|---|
| `pygame` | Игры |
| `requests` | HTTP-запросы |
| `matplotlib` | Графики |
| `numpy` | Числа и массивы |
| `pandas` | Таблицы и данные |
| `pillow` | Работа с картинками |
| `pyqt5` | GUI |
| `kivy` | Мобильные приложения |
| `flask` | Веб-сайты |
| `django` | Большие веб-сайты |
| `telebot` | Telegram-боты |
| `aiogram` | Асинхронные Telegram-боты |
| `openpyxl` | Excel-файлы |

---

## ⚠️ Типичные проблемы

!!! warning "`pip` не найден"
    ```bash
    python -m pip install package
    ```
    Это работает всегда, даже если `pip` не в PATH.

!!! warning "В PowerShell нельзя запускать `Activate.ps1`"
    ```
    ...выполнение сценариев отключено в этой системе...
    ```
    Разрешите один раз (от имени пользователя):
    ```powershell
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
    ```
    Или используйте `cmd` вместо PowerShell.

!!! warning "Поставили пакет, а Python его не видит"
    Скорее всего, у вас **активировано не то окружение** (или не активировано
    вовсе). Проверьте:
    ```bash
    python -c "import sys; print(sys.executable)"
    ```
    Путь должен указывать внутрь `.venv`.

!!! warning "Ошибки при сборке"
    Некоторые библиотеки требуют компилятор C. На Windows часто помогает
    установка **Visual Studio Build Tools** или использование `pip install`
    из **wheel**-пакетов (обычно так и есть).

!!! warning "Хотите установить, но нет интернета"
    ```bash
    pip download package -d ./wheels      # скачать на другой машине
    pip install --no-index --find-links=./wheels package    # поставить офлайн
    ```

---

## 💡 Примеры

### Пример 1. Установить `requests` и сделать запрос 🌐

```bash
pip install requests
```

```python
import requests

response = requests.get("https://api.github.com")
print(response.status_code)   # 200
```

### Пример 2. График через `matplotlib` 📊

```bash
pip install matplotlib
```

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]

plt.plot(x, y)
plt.title("Квадраты чисел")
plt.show()
```

### Пример 3. Игра на `pygame` 🎮

```bash
pip install pygame
```

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((400, 300))
pygame.display.set_caption("Моя игра")
pygame.display.flip()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
```

### Пример 4. Своя сборка — установить из файла

Если у вас есть `.whl`-файл:

```bash
pip install ./mypackage-1.0.0-py3-none-any.whl
```

Если папка с `pyproject.toml` (свой проект как пакет):

```bash
pip install -e .        # -e — editable, для разработки
```

---

## 📌 Публикация своих пакетов (кратко)

1. Создать структуру:
   ```
   mypackage/
   ├── pyproject.toml
   ├── README.md
   └── mypackage/
       └── __init__.py
   ```
2. Собрать: `python -m build`
3. Загрузить на PyPI: `twine upload dist/*`

Это тема для продвинутого уровня, в школьный курс не входит. Но знать, что
это возможно, полезно.

---

## 🧪 Упражнения

1. ⭐ Проверьте `pip --version`.
2. ⭐ Установите `requests`, сделайте GET-запрос к `https://example.com`.
3. ⭐⭐ Создайте venv, активируйте, установите `matplotlib`.
4. ⭐⭐ Сохраните список зависимостей в `requirements.txt`.
5. ⭐⭐ Установите `pygame` и запустите пустое окно.
6. ⭐⭐⭐ Удалите venv, создайте заново, восстановите окружение из `requirements.txt`.

---

## 🔗 Что дальше

→ Поздравляем! Раздел **«Модули и пакеты»** пройден. Дальше —
[ООП](../08-oop/index.md): классы, объекты, наследование.