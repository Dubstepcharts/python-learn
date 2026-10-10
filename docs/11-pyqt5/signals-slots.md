# Сигналы и слоты

!!! abstract "Уровень: ⭐⭐ Средний"
    Нужно знать: [виджеты](widgets.md).

---

## 🍎 Объясняем просто

!!! example "Сигнал — «что-то случилось», слот — «что делать»"
    Нажали кнопку → **сигнал** `clicked`. Мы «подключаем» к нему функцию —
    **слот**. Каждый раз при нажатии эта функция вызывается.

    ```python
    btn.clicked.connect(self.on_click)
    ```

---

## 📖 Синтаксис

```python
виджет.сигнал.connect(функция)
```

Работает и с методом (`self.func`), и с лямбдой, и с `functools.partial`.

---

## 📋 Частые сигналы

| Виджет | Сигналы |
|---|---|
| `QPushButton` | `clicked`, `pressed`, `released`, `toggled` |
| `QLineEdit` | `textChanged`, `textEdited`, `returnPressed`, `editingFinished`, `selectionChanged` |
| `QTextEdit` | `textChanged`, `cursorPositionChanged` |
| `QCheckBox` | `stateChanged`, `toggled`, `clicked` |
| `QRadioButton` | `toggled`, `clicked` |
| `QComboBox` | `currentIndexChanged`, `currentTextChanged`, `activated`, `highlighted` |
| `QSlider`, `QSpinBox`, `QDial` | `valueChanged`, `sliderMoved` |
| `QListWidget` | `itemClicked`, `itemDoubleClicked`, `currentItemChanged`, `itemSelectionChanged` |
| `QTableWidget` | `cellClicked`, `cellChanged`, `cellDoubleClicked`, `itemSelectionChanged` |
| `QTimer` | `timeout` |
| `QMainWindow` | `windowTitleChanged` |

Полный список — в документации Qt.

---

## 💡 Примеры

### Пример 1. Кнопка → функция

```python
import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QVBoxLayout

class Window(QWidget):
    def __init__(self):
        super().__init__()

        self.label = QLabel("Нажми кнопку")
        btn = QPushButton("Кнопка")
        btn.clicked.connect(self.on_click)

        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(btn)
        self.setLayout(layout)

    def on_click(self):
        self.label.setText("Нажато!")

app = QApplication(sys.argv)
w = Window()
w.show()
sys.exit(app.exec_())
```

### Пример 2. Лямбда с аргументами

Иногда нужно передать в слот дополнительные аргументы:

```python
for i in range(3):
    btn = QPushButton(f"Кнопка {i}")
    btn.clicked.connect(lambda checked, n=i: print(f"Нажата {n}"))
    layout.addWidget(btn)
```

!!! warning "⚠️ Классическая ловушка цикла"
    ```python
    for i in range(3):
        btn.clicked.connect(lambda: print(i))     # все покажут 2!
    ```
    **Правильно:** `lambda checked, n=i: print(n)`.

### Пример 3. Ввод текста «на лету»

```python
edit = QLineEdit()
edit.textChanged.connect(lambda s: label.setText(s))
```

### Пример 4. Слайдер → прогресс-бар

```python
slider = QSlider(Qt.Horizontal)
bar = QProgressBar()

slider.valueChanged.connect(bar.setValue)
```

Коротко, потому что `valueChanged` передаёт int, а `setValue` принимает int — типы совпадают.

### Пример 5. Свой сигнал

```python
from PyQt5.QtCore import pyqtSignal, QObject

class Communicator(QObject):
    message = pyqtSignal(str)

comm = Communicator()
comm.message.connect(lambda s: print("Получено:", s))
comm.message.emit("Привет!")
```

Свой сигнал полезен для общения между классами.

### Пример 6. Таймер

```python
from PyQt5.QtCore import QTimer

timer = QTimer()
timer.timeout.connect(self.tick)
timer.start(1000)       # каждую секунду

def tick(self):
    print("Тик!")
```

---

## 🎯 Порядок подключения

`connect` можно вызывать до или после `show`. Но если сигнал испустится
**до** подключения — обработчик не сработает. Подключайте заранее.

---

## ⚠️ Частые ошибки

!!! warning "Забыли `connect`"
    Кнопка есть, а нажатие ничего не делает — нет `connect`.

!!! warning "Передали вызов, а не функцию"
    ```python
    btn.clicked.connect(self.on_click())   # ❌ вызовется сразу
    btn.clicked.connect(self.on_click)     # ✅ передаём саму функцию
    ```

!!! warning "Ловушка цикла с лямбдой"
    См. пример 2.

!!! warning "Тяжёлая работа в слоте"
    Если слот работает долго — окно «зависает». Используйте `QThread`
    или `QTimer` для разбиения работы.

---

## 🧪 Упражнения

1. ⭐ Кнопка и метка. По клику увеличивать счётчик.
2. ⭐ Поле ввода и метка: текст из поля показывается в метке.
3. ⭐⭐ Три кнопки с лямбдой, каждая выводит свой номер.
4. ⭐⭐ Слайдер управляет прогресс-баром.
5. ⭐⭐ Форма логина: проверка пароля по кнопке.
6. ⭐⭐⭐ Таймер: каждую секунду добавляет случайное число в список.
7. ⭐⭐⭐ Свой сигнал между двумя окнами.

---

## 🔗 Что дальше

→ [Проект «Калькулятор»](calculator-project.md).