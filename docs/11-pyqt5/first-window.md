# Первое окно

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [классы](../08-oop/classes.md).

---

## 🍎 Объясняем просто

!!! example "Любое PyQt-приложение начинается с четырёх шагов"
    1. Создать `QApplication` — «сердце» программы
    2. Создать окно (`QMainWindow`, `QWidget`, `QDialog`)
    3. Наполнить его содержимым
    4. Запустить цикл событий (`app.exec_()`)

---

## ✍️ Минимальное окно

```python
import sys
from PyQt5.QtWidgets import QApplication, QWidget

app = QApplication(sys.argv)

window = QWidget()
window.setWindowTitle("Моё первое окно")
window.resize(400, 300)
window.show()

sys.exit(app.exec_())
```

Запустите — откроется пустое окно 400×300.

---

## 📖 Разбор кода

| Строка | Что делает |
|---|---|
| `import sys` | Для `sys.argv` и `sys.exit` |
| `QApplication(sys.argv)` | Создаёт приложение (одно на всю программу) |
| `QWidget()` | Пустое окно |
| `setWindowTitle(...)` | Заголовок окна |
| `resize(400, 300)` | Размер окна |
| `show()` | Показать окно |
| `app.exec_()` | Запустить цикл событий (без него окно мгновенно закроется) |
| `sys.exit(...)` | Корректный выход |

!!! warning "`app.exec_()` — с подчёркиванием"
    Именно `exec_`, а не `exec` — потому что `exec` — зарезервированное
    слово в Python. Такая же история с `print_`, `raise_` и т.п. в PyQt5.

---

## 🏛️ Три базовых класса для окна

| Класс | Что даёт |
|---|---|
| `QWidget` | Пустое окно. Базовый класс для всего. |
| `QMainWindow` | Окно с меню, статус-баром, док-панелями. Для «больших» приложений. |
| `QDialog` | Диалог — обычно модальное окно (спросить/подтвердить). |

Для большинства учебных задач хватает `QWidget` или `QMainWindow`.

---

## 🎨 Окно через класс (рекомендуется)

Классический ООП-подход:

```python
import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel
from PyQt5.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Привет, PyQt!")
        self.resize(400, 200)

        # Создаём метку
        label = QLabel("Привет, мир!", self)
        label.setAlignment(Qt.AlignCenter)

        # Ставим как центральный виджет
        self.setCentralWidget(label)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
```

Этот шаблон удобно копировать для любого проекта: меняешь содержимое `__init__` — и готово.

---

## 📌 Полезные методы окна

| Метод | Что делает |
|---|---|
| `setWindowTitle(s)` | Заголовок |
| `resize(w, h)` | Размер |
| `setFixedSize(w, h)` | Запретить изменение размера |
| `move(x, y)` | Позиция на экране |
| `setGeometry(x, y, w, h)` | Всё сразу |
| `show()` | Показать |
| `showMaximized()` | Развернуть на весь экран |
| `showFullScreen()` | Полноэкранный режим |
| `close()` | Закрыть |
| `setCentralWidget(w)` | Центральный виджет (для `QMainWindow`) |
| `statusBar().showMessage(s)` | Сообщение в статус-баре |
| `menuBar()` | Меню-бар (для `QMainWindow`) |

---

## 📌 Иконка окна

```python
from PyQt5.QtGui import QIcon
window.setWindowIcon(QIcon("icon.png"))
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `app.exec_()`"
    Окно мелькнёт и закроется.

!!! warning "Создали два `QApplication`"
    Только **один** экземпляр на программу. Если нужны несколько окон —
    это отдельные `QWidget`/`QMainWindow`, но не `QApplication`.

!!! warning "Пропустили `sys.exit(...)`"
    Окно откроется, но код продолжит выполняться после закрытия.

---

## 🧪 Упражнения

1. ⭐ Откройте пустое окно 500×400 с заголовком «Моя программа».
2. ⭐ Сделайте окно не разворачивающимся (`setFixedSize`).
3. ⭐⭐ Добавьте `QLabel` с текстом и центрируйте его.
4. ⭐⭐ Окно с заголовком — ваше имя, иконка — любая картинка.
5. ⭐⭐ Разверните окно на весь экран через `showFullScreen()`.

---

## 🔗 Что дальше

→ [Виджеты](widgets.md) — все элементы интерфейса.