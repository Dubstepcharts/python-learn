# Сборка APK для Android

!!! abstract "Уровень: ⭐⭐⭐ Продвинутый"
    Нужно знать: [первое приложение](first-app.md).

---

## 🍎 Объясняем просто

!!! example "Python → APK"
    С помощью **Buildozer** можно упаковать Kivy-приложение в `.apk`-файл
    для Android. Потом установить на телефон и запустить как обычное
    приложение.

---

## 📌 Что понадобится

- **Linux** (Ubuntu) или **WSL** на Windows, или **macOS**
- Python 3.8+
- ~10 ГБ свободного места
- Интернет (Buildozer скачает Android SDK/NDK)
- Терпение: первая сборка 30–60 минут

!!! warning "На Windows напрямую — не работает"
    Buildozer требует Linux-инструментов. Используйте:
    - **WSL 2** (Ubuntu) внутри Windows — самый простой вариант
    - Виртуальную машину с Ubuntu
    - Облачную Ubuntu-машину

---

## 📌 Установка Buildozer

```bash
pip install buildozer cython
sudo apt install -y git zip unzip openjdk-17-jdk python3-pip \
    autoconf libtool pkg-config zlib1g-dev libncurses5-dev \
    libncursesw5-dev libtinfo5 cmake libffi-dev libssl-dev
```

---

## 📌 Настройка проекта

В папке проекта (там, где `main.py`):

```bash
buildozer init
```

Создастся `buildozer.spec`. Откройте и настройте основные поля:

```ini
[app]
title = Моё приложение
package.name = myapp
package.domain = org.example

source.include_exts = py,png,jpg,kv,atlas

version = 0.1

requirements = python3,kivy

orientation = portrait

[buildozer]
log_level = 2
```

**Обязательно:**

- `requirements = python3,kivy` — добавьте свои библиотеки сюда
- `source.include_exts` — расширения файлов, которые нужны приложению
- `title`, `package.name`, `package.domain` — как назвать приложение

---

## 📌 Сборка

### Debug APK (для теста)

```bash
buildozer android debug
```

Результат: `bin/myapp-0.1-debug.apk`.

Установить на телефон:

```bash
buildozer android debug deploy run
```

Если телефон подключён по USB с включённой отладкой — APK установится и
запустится.

### Release APK (для публикации)

```bash
buildozer android release
```

Нужна подпись (`jarsigner` или `apksigner`).

### Очистка

```bash
buildozer android clean
```

Удаляет промежуточные сборки. Иногда нужно, если что-то пошло не так.

---

## 📌 Что попадёт в APK

Только то, что указано:

- Файлы из корня проекта с расширениями из `source.include_exts`
- Всё, что в папке проекта (или явно перечисленное)
- Библиотеки из `requirements`

**Не попадут** лишние `.py`, `.venv`, `.git` — их можно исключить через
`source.exclude_dirs`.

---

## ⚠️ Частые проблемы

!!! warning "Долгая первая сборка"
    Это нормально: скачиваются Android SDK, NDK, компилируются библиотеки.
    Дальше — быстрее.

!!! warning "Ошибки NDK"
    Обычно решается `buildozer android clean` и повторной сборкой.

!!! warning "Приложение крашится при запуске"
    Смотрите логи:
    ```bash
    buildozer android logcat
    ```
    Или через `adb logcat`.

!!! warning "Картинки/шрифты не находятся"
    Добавьте их расширения в `source.include_exts`. Пути используйте
    **относительные** от корня проекта.

!!! warning "Размер APK 50+ МБ"
    Нормально: Python+Qt/Kivy занимают много. Оптимизации — отдельная тема.

---

## 📌 Альтернативы

- **BeeWare** — Python для iOS/Android
- **Chaquopy** — Python внутри Android Studio (Java+Python)
- **Pydroid 3** — запуск Python прямо на телефоне (без сборки)

Для учебного проекта Buildozer — самый «стандартный» путь.

---

## 💡 Полный пример

```
myapp/
├── main.py
├── my.kv
├── assets/
│   └── icon.png
├── buildozer.spec
└── .gitignore
```

**`main.py`:**

```python
from kivy.app import App
from kivy.uix.label import Label

class MyApp(App):
    def build(self):
        return Label(text="Привет с Android!")

if __name__ == "__main__":
    MyApp().run()
```

**`buildozer.spec`** (сокращённо):

```ini
[app]
title = MyApp
package.name = myapp
package.domain = org.example
source.include_exts = py,png,jpg,kv
version = 0.1
requirements = python3,kivy
orientation = portrait
```

Сборка:

```bash
buildozer android debug
```

APK будет в `bin/`.

---

## 🧪 Упражнения

1. ⭐ Установите Buildozer в WSL/Ubuntu.
2. ⭐ Соберите debug-APK «Hello, world».
3. ⭐⭐ Установите на телефон через USB.
4. ⭐⭐ Добавьте иконку в `buildozer.spec`.
5. ⭐⭐⭐ Соберите своё приложение (счётчик из прошлых уроков) в APK.
6. ⭐⭐⭐ Соберите release-APK с подписью.

---

## 🔗 Что дальше

→ Поздравляем! Раздел **«Kivy»** пройден. Дальше — [Проекты](../14-projects/index.md).