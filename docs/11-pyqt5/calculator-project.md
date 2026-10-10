# Проект: Калькулятор

Соберём полноценный калькулятор на PyQt5. Он будет уметь складывать,
вычитать, умножать, делить, работать с десятичной точкой и очищать экран.

---

## 🎯 План

1. Окно фиксированного размера
2. `QLineEdit` сверху — «экран» калькулятора
3. Сетка `QGridLayout` с кнопками 0–9, `+`, `-`, `*`, `/`, `=`, `C`, `.`
4. Логика: нажатие кнопки добавляет символ; `=` вычисляет; `C` очищает

---

## 📄 Полный код

```python
import sys
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QGridLayout,
    QLineEdit, QPushButton, QMessageBox
)
from PyQt5.QtCore import Qt


class Calculator(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Калькулятор")
        self.setFixedSize(300, 400)

        # Экран
        self.display = QLineEdit()
        self.display.setReadOnly(True)
        self.display.setAlignment(Qt.AlignRight)
        self.display.setStyleSheet("font-size: 24px; padding: 10px;")
        self.display.setText("0")

        # Сетка кнопок
        grid = QGridLayout()
        grid.setSpacing(5)

        buttons = [
            ("C",  0, 0), ("(",  0, 1), (")",  0, 2), ("/", 0, 3),
            ("7",  1, 0), ("8",  1, 1), ("9",  1, 2), ("*", 1, 3),
            ("4",  2, 0), ("5",  2, 1), ("6",  2, 2), ("-", 2, 3),
            ("1",  3, 0), ("2",  3, 1), ("3",  3, 2), ("+", 3, 3),
            ("0",  4, 0), (".",  4, 1), ("⌫",  4, 2), ("=", 4, 3),
        ]

        for text, row, col in buttons:
            btn = QPushButton(text)
            btn.setFixedSize(60, 60)
            btn.setStyleSheet("font-size: 18px;")
            btn.clicked.connect(lambda _, t=text: self.on_button(t))
            grid.addWidget(btn, row, col)

        # Общий layout
        layout = QVBoxLayout()
        layout.addWidget(self.display)
        layout.addLayout(grid)
        self.setLayout(layout)

    def on_button(self, text):
        current = self.display.text()

        if text == "C":
            self.display.setText("0")
        elif text == "⌫":
            if len(current) > 1:
                self.display.setText(current[:-1])
            else:
                self.display.setText("0")
        elif text == "=":
            self.calculate(current)
        else:
            if current == "0" and text not in ".()":
                self.display.setText(text)
            else:
                self.display.setText(current + text)

    def calculate(self, expr):
        try:
            # Безопасный расчёт: только разрешённые символы
            allowed = set("0123456789+-*/(). ")
            if not set(expr).issubset(allowed):
                raise ValueError("Недопустимые символы")
            result = eval(expr)
            self.display.setText(str(result))
        except ZeroDivisionError:
            QMessageBox.warning(self, "Ошибка", "Деление на ноль")
            self.display.setText("0")
        except Exception:
            QMessageBox.warning(self, "Ошибка", "Неверное выражение")
            self.display.setText("0")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    calc = Calculator()
    calc.show()
    sys.exit(app.exec_())
```

---

## 📖 Разбор

### Экран

```python
self.display = QLineEdit()
self.display.setReadOnly(True)     # нельзя редактировать с клавиатуры
self.display.setAlignment(Qt.AlignRight)
```

`QLineEdit` вместо `QLabel` — потому что у него удобно читать текст через `text()`.

### Кнопки в цикле

```python
for text, row, col in buttons:
    btn = QPushButton(text)
    btn.clicked.connect(lambda _, t=text: self.on_button(t))
    grid.addWidget(btn, row, col)
```

Обратите внимание на `lambda _, t=text:` — «фиксируем» текущее `text` в
значении по умолчанию, чтобы все кнопки не получали последнее значение.

### Обработка `=`

```python
def calculate(self, expr):
    allowed = set("0123456789+-*/(). ")
    if not set(expr).issubset(allowed):
        raise ValueError("Недопустимые символы")
    result = eval(expr)
```

!!! warning "⚠️ Про `eval`"
    `eval` **опасен** — может выполнить любой код. Мы **проверяем** строку:
    разрешаем только цифры и математические символы. Так безопасно.
    
    В более серьёзных программах используют `ast.literal_eval` или
    собственный парсер.

---

## 🚀 Расширения

- **История** — `QListWidget` с последними 10 операциями
- **Кнопка `±`** — менять знак
- **√, x², 1/x** — унарные операции
- **Память** — `M+`, `M-`, `MR`, `MC`
- **Горячие клавиши** — `setShortcut` на кнопки
- **Клавиатурный ввод** — переопределить `keyPressEvent`
- **Смена темы** — светлая/тёмная через QSS

---

## 🧪 Упражнения

1. ⭐ Добавьте кнопку `±` (смена знака).
2. ⭐ Добавьте кнопку `√`.
3. ⭐⭐ Сделайте историю вычислений в `QListWidget`.
4. ⭐⭐ Поддержите ввод с клавиатуры (перехват `keyPressEvent`).
5. ⭐⭐ Добавьте поддержку возведения в степень (`^` → `**`).
6. ⭐⭐⭐ Сделайте научный калькулятор: `sin`, `cos`, `log`, `π`, `e`.

---

## 🔗 Что дальше

→ [pandas](../12-pandas/index.md) — работа с данными.