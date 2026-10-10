# Установка PyQt5

!!! abstract "Уровень: ⭐"

---

## 🚀 Установка

В терминале VS Code (в активированном venv, если он есть):

```bash
pip install PyQt5
```

Проверка:

```python
from PyQt5.QtWidgets import QApplication
print("PyQt5 работает!")
```

Если не выдало ошибок — установлено.

---

## ⚠️ Возможные проблемы

!!! warning "**Linux**: нет системных библиотек"
    ```
    ImportError: libEGL.so.1: cannot open shared object file
    ```
    Поставьте системные библиотеки:
    ```bash
    sudo apt install python3-pyqt5 libegl1
    ```

!!! warning "**macOS**: диалог «Python.app»"
    Иногда нужен `pip install pyqt5 --no-binary :all:`. Обычно работает
    и обычная установка.

!!! warning "**Windows**: медленная установка"
    PyQt5 довольно большой (~50 МБ). Первый `pip install` может занять
    пару минут — это нормально.

---

## 📌 Что устанавливается

- `PyQt5` — основные модули: `QtWidgets`, `QtCore`, `QtGui`
- `PyQt5.QtWidgets` — виджеты (кнопки, окна, таблицы)
- `PyQt5.QtCore` — ядро (сигналы, таймеры, типы)
- `PyQt5.QtGui` — графика (шрифты, цвета, иконки)

Проверить версию:

```python
from PyQt5.QtCore import QT_VERSION_STR, PYQT_VERSION_STR
print("Qt:", QT_VERSION_STR)
print("PyQt:", PYQT_VERSION_STR)
```

---

## 🔗 Что дальше

→ [Первое окно](first-window.md).