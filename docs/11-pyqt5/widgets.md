# Виджеты PyQt5

!!! abstract "Уровень: ⭐⭐ Средний"
    Нужно знать: [первое окно](first-window.md).

---

## 📖 Что такое виджет

**Виджет** — любой элемент интерфейса: кнопка, поле, надпись, список.
Всё, что видно в окне, — виджеты. Они образуют дерево: окно → контейнеры → виджеты.

Все виджеты наследуются от `QWidget` — у них общие методы:
`setGeometry`, `resize`, `move`, `setEnabled`, `setVisible`, `setToolTip`, `setStyleSheet` и т.д.

---

## 📋 Все виджеты PyQt5 (сводка)

| Виджет | Что это |
|---|---|
| `QLabel` | Надпись, текст, картинка |
| `QPushButton` | Кнопка |
| `QToolButton` | Кнопка-инструмент (для панелей) |
| `QRadioButton` | Радиокнопка (один из многих) |
| `QCheckBox` | Флажок (галочка) |
| `QLineEdit` | Однострочное поле ввода |
| `QTextEdit` | Многострочное поле (rich text) |
| `QPlainTextEdit` | Многострочное поле (plain text) |
| `QSpinBox` | Число целое (стрелочки) |
| `QDoubleSpinBox` | Число дробное |
| `QSlider` | Ползунок |
| `QDial` | Круглый «крутилка» |
| `QProgressBar` | Прогресс-бар |
| `QComboBox` | Выпадающий список |
| `QListWidget` | Список |
| `QTableWidget` | Таблица |
| `QTreeWidget` | Дерево |
| `QTabWidget` | Вкладки |
| `QGroupBox` | Группа виджетов с рамкой |
| `QScrollArea` | Прокручиваемая область |
| `QSplitter` | Разделитель между областями |
| `QStackedWidget` | «Стопка» виджетов (один виден) |
| `QCalendarWidget` | Календарь |
| `QDateEdit`, `QTimeEdit`, `QDateTimeEdit` | Ввод дат/времени |
| `QFileDialog` | Диалог выбора файла |
| `QColorDialog` | Диалог выбора цвета |
| `QFontDialog` | Диалог выбора шрифта |
| `QInputDialog` | Ввод строки/числа |
| `QMessageBox` | Стандартные сообщения |
| `QMenuBar` | Строка меню |
| `QMenu` | Выпадающее меню |
| `QToolBar` | Панель инструментов |
| `QStatusBar` | Строка состояния |
| `QDockWidget` | Док-панель |
| `QWebEngineView` | Встроенный браузер (нужен `PyQtWebEngine`) |

Разберём ключевые.

---

## 📝 `QLabel` — надпись

```python
from PyQt5.QtWidgets import QLabel
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap

label = QLabel("Привет!", self)
label.setAlignment(Qt.AlignCenter)
label.setStyleSheet("font-size: 20px; color: blue;")

# С картинкой
pixmap = QPixmap("cat.png")
img_label = QLabel(self)
img_label.setPixmap(pixmap)

# С HTML
html_label = QLabel("<b>Жирный</b> <i>курсив</i>", self)
```

---

## 🔘 `QPushButton` — кнопка

```python
from PyQt5.QtWidgets import QPushButton

btn = QPushButton("Нажми меня", self)
btn.clicked.connect(self.on_click)
btn.setIcon(QIcon("icon.png"))
btn.setToolTip("Это подсказка")
btn.setEnabled(False)     # выключить
```

---

## ☑️ `QRadioButton` и `QCheckBox`

```python
from PyQt5.QtWidgets import QRadioButton, QCheckBox, QButtonGroup

# Радиокнопки
r1 = QRadioButton("Вариант 1", self)
r2 = QRadioButton("Вариант 2", self)

# Флажок
cb = QCheckBox("Согласен", self)
cb.setChecked(True)
print(cb.isChecked())    # True
```

!!! tip "Группировка радиокнопок"
    Сами `QRadioButton` в одном родителе уже образуют группу. Чтобы
    объединить по-другому — используйте `QButtonGroup`.

---

## ✍️ `QLineEdit` — поле ввода

```python
from PyQt5.QtWidgets import QLineEdit

edit = QLineEdit(self)
edit.setPlaceholderText("Введите имя...")
edit.setMaxLength(20)
edit.setEchoMode(QLineEdit.Password)    # для пароля

print(edit.text())          # прочитать
edit.setText("Аня")         # установить
edit.clear()
edit.setReadOnly(True)
```

Сигналы: `textChanged`, `textEdited`, `returnPressed`, `editingFinished`.

---

## 📝 `QTextEdit` и `QPlainTextEdit`

Многострочные поля.

```python
from PyQt5.QtWidgets import QTextEdit, QPlainTextEdit

txt = QTextEdit(self)
txt.setPlainText("Привет\nМир")
print(txt.toPlainText())
print(txt.toHtml())         # если нужен HTML

# QPlainTextEdit — попроще, быстрее для больших текстов
plain = QPlainTextEdit(self)
plain.setPlainText("...")
```

---

## 🔢 `QSpinBox`, `QDoubleSpinBox`

```python
from PyQt5.QtWidgets import QSpinBox, QDoubleSpinBox

spin = QSpinBox(self)
spin.setRange(0, 100)
spin.setValue(50)
spin.setSingleStep(5)

dspin = QDoubleSpinBox(self)
dspin.setDecimals(2)
dspin.setRange(0.0, 1.0)
```

---

## 🎚️ `QSlider` и `QDial`

```python
from PyQt5.QtWidgets import QSlider, QDial
from PyQt5.QtCore import Qt

slider = QSlider(Qt.Horizontal, self)
slider.setRange(0, 100)
slider.setValue(50)
slider.valueChanged.connect(lambda v: print(v))

dial = QDial(self)
dial.setRange(0, 100)
```

---

## 📊 `QProgressBar`

```python
from PyQt5.QtWidgets import QProgressBar

bar = QProgressBar(self)
bar.setRange(0, 100)
bar.setValue(42)
```

---

## 📋 `QComboBox` — выпадающий список

```python
from PyQt5.QtWidgets import QComboBox

combo = QComboBox(self)
combo.addItem("Один")
combo.addItem("Два")
combo.addItems(["Три", "Четыре"])
combo.currentTextChanged.connect(lambda s: print(s))

print(combo.currentText())    # текущее
print(combo.currentIndex())
combo.setCurrentIndex(1)
```

---

## 📃 `QListWidget` — список

```python
from PyQt5.QtWidgets import QListWidget, QListWidgetItem

lst = QListWidget(self)
lst.addItem("Аня")
lst.addItem("Борис")
lst.addItems(["Вика", "Глеб"])

# Свой item
item = QListWidgetItem("Даша")
lst.addItem(item)

lst.itemClicked.connect(lambda it: print(it.text()))
lst.clear()
```

---

## 📊 `QTableWidget` — таблица

```python
from PyQt5.QtWidgets import QTableWidget, QTableWidgetItem

table = QTableWidget(3, 2, self)         # 3 строки, 2 столбца
table.setHorizontalHeaderLabels(["Имя", "Возраст"])

table.setItem(0, 0, QTableWidgetItem("Аня"))
table.setItem(0, 1, QTableWidgetItem("12"))
table.setItem(1, 0, QTableWidgetItem("Борис"))
table.setItem(1, 1, QTableWidgetItem("11"))

print(table.item(0, 0).text())           # Аня
table.resizeColumnsToContents()
```

---

## 🌳 `QTreeWidget` — дерево

```python
from PyQt5.QtWidgets import QTreeWidget, QTreeWidgetItem

tree = QTreeWidget(self)
tree.setHeaderLabels(["Название"])

root = QTreeWidgetItem(tree, ["Фрукты"])
apple = QTreeWidgetItem(root, ["Яблоко"])
banana = QTreeWidgetItem(root, ["Банан"])

tree.expandAll()
```

---

## 🗂️ `QTabWidget` — вкладки

```python
from PyQt5.QtWidgets import QTabWidget, QWidget, QLabel

tabs = QTabWidget(self)

tab1 = QWidget()
QLabel("Содержимое первой вкладки", tab1)

tab2 = QWidget()
QLabel("Содержимое второй вкладки", tab2)

tabs.addTab(tab1, "Первая")
tabs.addTab(tab2, "Вторая")
```

---

## 🗃️ `QGroupBox` — рамка с заголовком

```python
from PyQt5.QtWidgets import QGroupBox, QVBoxLayout, QRadioButton

group = QGroupBox("Выберите цвет", self)
layout = QVBoxLayout()
layout.addWidget(QRadioButton("Красный"))
layout.addWidget(QRadioButton("Синий"))
group.setLayout(layout)
```

---

## 📅 `QCalendarWidget`

```python
from PyQt5.QtWidgets import QCalendarWidget

cal = QCalendarWidget(self)
cal.clicked.connect(lambda d: print(d.toString("dd.MM.yyyy")))
```

---

## 📆 `QDateEdit`, `QTimeEdit`, `QDateTimeEdit`

```python
from PyQt5.QtWidgets import QDateEdit, QTimeEdit, QDateTimeEdit
from PyQt5.QtCore import QDate, QTime, QDateTime

d = QDateEdit(QDate.currentDate(), self)
t = QTimeEdit(QTime.currentTime(), self)
dt = QDateTimeEdit(QDateTime.currentDateTime(), self)
```

---

## 💬 `QMessageBox` — стандартные сообщения

```python
from PyQt5.QtWidgets import QMessageBox

QMessageBox.information(self, "Заголовок", "Всё хорошо!")
QMessageBox.warning(self, "Осторожно", "Что-то не так")
QMessageBox.critical(self, "Ошибка", "Программа упала")

# Да/Нет
reply = QMessageBox.question(
    self, "Вопрос", "Продолжить?",
    QMessageBox.Yes | QMessageBox.No,
)
if reply == QMessageBox.Yes:
    print("Продолжаем")
```

---

## 📂 `QFileDialog` — выбор файла

```python
from PyQt5.QtWidgets import QFileDialog

path, _ = QFileDialog.getOpenFileName(self, "Открыть файл", "", "Текст (*.txt);;Все файлы (*)")
if path:
    with open(path, encoding="utf-8") as f:
        print(f.read())

# Сохранить
save_path, _ = QFileDialog.getSaveFileName(self, "Сохранить", "", "Текст (*.txt)")
```

---

## 🎨 `QColorDialog`, `QFontDialog`

```python
from PyQt5.QtWidgets import QColorDialog, QFontDialog

color = QColorDialog.getColor()
if color.isValid():
    print(color.name())     # '#ff0000'

font, ok = QFontDialog.getFont()
if ok:
    print(font.family())
```

---

## ⌨️ `QInputDialog`

```python
from PyQt5.QtWidgets import QInputDialog

name, ok = QInputDialog.getText(self, "Имя", "Как вас зовут?")
if ok:
    print(name)

age, ok = QInputDialog.getInt(self, "Возраст", "Сколько вам лет?")
```

---

## 📋 Меню, панели, статус-бар (только для `QMainWindow`)

```python
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Меню
        menubar = self.menuBar()
        file_menu = menubar.addMenu("Файл")
        file_menu.addAction("Открыть", self.open_file)
        file_menu.addAction("Сохранить", self.save_file)
        file_menu.addSeparator()
        file_menu.addAction("Выход", self.close)

        # Панель инструментов
        toolbar = self.addToolBar("Главная")
        toolbar.addAction("Новый")

        # Статус-бар
        self.statusBar().showMessage("Готов")
```

---

## 📌 Общие методы всех виджетов

| Метод | Что делает |
|---|---|
| `setEnabled(b)` | Вкл/выкл |
| `setVisible(b)` | Показать/скрыть |
| `isVisible()` | Виден? |
| `setToolTip(s)` | Подсказка |
| `setStyleSheet(css)` | CSS-стили |
| `setFixedSize(w, h)` | Фиксированный размер |
| `setMinimumSize(w, h)` | Минимальный |
| `setMaximumSize(w, h)` | Максимальный |
| `setGeometry(x, y, w, h)` | Позиция + размер |
| `move(x, y)` | Позиция |
| `resize(w, h)` | Размер |
| `setFont(QFont(...))` | Шрифт |
| `setFocus()` | В фокус |
| `update()` | Перерисовать |
| `close()` | Закрыть |
| `parent()` | Родитель |
| `children()` | Дочерние |

---

## ⚠️ Частые ошибки

!!! warning "Забыли указать родителя"
    ```python
    btn = QPushButton("OK")       # без родителя — не появится в окне
    btn = QPushButton("OK", self) # с родителем
    ```
    Или добавьте в layout.

!!! warning "Создали два `QApplication`"
    Только один на программу.

!!! warning "Не вызвали `layout.addWidget(...)`"
    Виджет создан, но не добавлен в компоновку — не будет виден.

---

## 🧪 Упражнения

1. ⭐ Кнопка и метка. По нажатию метка меняет текст.
2. ⭐ Поле ввода и кнопка: показать `QMessageBox` с введённым текстом.
3. ⭐⭐ Форма: `QLineEdit` + `QComboBox` + `QSpinBox` + кнопка «Отправить».
4. ⭐⭐ Таблица 5×3 с данными об учениках.
5. ⭐⭐ Список дел: `QLineEdit` + `QListWidget` + кнопка «Добавить».
6. ⭐⭐⭐ Калькулятор на `QGridLayout` (см. следующий раздел).
7. ⭐⭐⭐ Мини-блокнот: `QTextEdit` + меню «Открыть», «Сохранить».

---

## 🔗 Что дальше

→ [Компоновки](layouts.md) — как расставлять виджеты.