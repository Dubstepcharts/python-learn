# Компоновки

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [виджеты](widgets.md).

---

## 🍎 Объясняем просто

!!! example "Компоновка — это «как расположить»"
    Можно задавать координаты вручную: `btn.move(50, 100)`. Но тогда при
    изменении размера окна всё «застынет» и поедут пропорции.

    **Компоновки** (layouts) — автоматически расставляют виджеты и
    пересчитывают положение при ресайзе.

---

## 📖 Четыре основных компоновки

| Класс | Как располагает |
|---|---|
| `QVBoxLayout` | Столбиком сверху вниз |
| `QHBoxLayout` | В ряд слева направо |
| `QGridLayout` | В сетке (строки × столбцы) |
| `QFormLayout` | Пары «метка — поле» |

Плюс `QStackedLayout` — «стопка» (виден один), и `QBoxLayout` — базовый.

---

## 📌 Основные методы layout

| Метод | Что делает |
|---|---|
| `addWidget(w)` | Добавить виджет |
| `addLayout(l)` | Вложить layout |
| `addStretch(n=0)` | Растяжка (пустое место) |
| `addSpacing(n)` | Фиксированный отступ |
| `setSpacing(n)` | Расстояние между элементами |
| `setContentsMargins(l, t, r, b)` | Внешние отступы |
| `removeWidget(w)` | Убрать виджет |
| `count()` | Сколько элементов |

---

## 📐 `QVBoxLayout` — вертикально

```python
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton
import sys

class Window(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        layout.addWidget(QPushButton("Кнопка 1"))
        layout.addWidget(QPushButton("Кнопка 2"))
        layout.addWidget(QPushButton("Кнопка 3"))
        self.setLayout(layout)

app = QApplication(sys.argv)
w = Window()
w.show()
sys.exit(app.exec_())
```

---

## 📏 `QHBoxLayout` — горизонтально

```python
from PyQt5.QtWidgets import QHBoxLayout

layout = QHBoxLayout()
layout.addWidget(QPushButton("OK"))
layout.addWidget(QPushButton("Отмена"))
```

---

## 🎛️ Комбинация

Самый частый приём: горизонтальные ряды внутри вертикальной:

```python
main = QVBoxLayout()
row1 = QHBoxLayout()
row1.addWidget(QPushButton("A"))
row1.addWidget(QPushButton("B"))

row2 = QHBoxLayout()
row2.addWidget(QPushButton("C"))
row2.addWidget(QPushButton("D"))

main.addLayout(row1)
main.addLayout(row2)
```

---

## 🔲 `QGridLayout` — сетка

```python
from PyQt5.QtWidgets import QGridLayout

grid = QGridLayout()
grid.addWidget(QPushButton("1"), 0, 0)      # (row, col)
grid.addWidget(QPushButton("2"), 0, 1)
grid.addWidget(QPushButton("3"), 1, 0)

# Объединить ячейки
grid.addWidget(QPushButton("Широкая"), 2, 0, 1, 2)   # rowspan=1, colspan=2
```

Идеально для калькулятора и табличных форм.

---

## 📋 `QFormLayout` — «метка: поле»

```python
from PyQt5.QtWidgets import QFormLayout, QLineEdit, QSpinBox

form = QFormLayout()
form.addRow("Имя:", QLineEdit())
form.addRow("Возраст:", QSpinBox())
form.addRow("Город:", QLineEdit())
```

Вид:
```
Имя:      [__________]
Возраст:  [  12 ↑↓  ]
Город:    [__________]
```

---

## 🧩 Растяжки (`addStretch`)

Пустое место «поглощает» излишки пространства:

```python
layout = QVBoxLayout()
layout.addWidget(QPushButton("Сверху"))
layout.addStretch()                         # прижать верхнюю кнопку вверх
layout.addWidget(QPushButton("Снизу"))
```

Без `addStretch` кнопки распределятся равномерно.

---

## 🎯 Вложенные контейнеры

```python
class Window(QWidget):
    def __init__(self):
        super().__init__()

        main = QVBoxLayout()

        # Блок сверху — горизонтальный
        top = QHBoxLayout()
        top.addWidget(QLabel("Имя:"))
        top.addWidget(QLineEdit())
        main.addLayout(top)

        # Середина — кнопки
        main.addWidget(QPushButton("OK"))
        main.addWidget(QPushButton("Отмена"))

        # Растяжка прижимает кнопки к верху
        main.addStretch()

        self.setLayout(main)
```

---

## 📌 Отступы

```python
layout.setContentsMargins(20, 10, 20, 10)   # слева, сверху, справа, снизу
layout.setSpacing(15)                        # между элементами
```

---

## 🎨 QSS — стилизация

Почти как CSS. Применяется к виджету или ко всему приложению:

```python
app.setStyleSheet("""
    QPushButton {
        background-color: #4CAF50;
        color: white;
        border-radius: 8px;
        padding: 10px;
        font-size: 14px;
    }
    QPushButton:hover { background-color: #45a049; }
    QLineEdit { border: 2px solid #ccc; padding: 5px; }
""")
```

---

## ⚠️ Частые ошибки

!!! warning "Один виджет в двух layouts"
    Виджет может быть **только в одном** layout. Дублирование вызовет
    странное поведение — виджет «переедет» в последний.

!!! warning "Забыли `setLayout(...)`"
    Если layout не привязан к окну/контейнеру — он не отобразится.

!!! warning "Путаница аргументов `addWidget`"
    ```python
    layout.addWidget(btn, 0, 0, 1, 2)   # widget, row, col, rowspan, colspan
    ```
    В `QHBoxLayout`/`QVBoxLayout` — только виджет.

!!! warning "Не работает ресайз"
    Проверьте, что виджеты добавлены именно в `layout`, а не позиционированы
    руками через `move`.

---

## 🧪 Упражнения

1. ⭐ Три кнопки в столбик через `QVBoxLayout`.
2. ⭐ Две кнопки в ряд через `QHBoxLayout`.
3. ⭐⭐ Форма логина: `QFormLayout` с логином и паролем.
4. ⭐⭐ Сетка 3×3 с числами.
5. ⭐⭐ Окно с шапкой (заголовок), полем ввода и двумя кнопками.
6. ⭐⭐⭐ Калькулятор: сетка 4×4 с кнопками (см. проект).
7. ⭐⭐⭐ Разноцветные кнопки через QSS.

---

## 🔗 Что дальше

→ [Сигналы и слоты](signals-slots.md) — реакция на действия.