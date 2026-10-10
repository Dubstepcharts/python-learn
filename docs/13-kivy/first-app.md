# Первое приложение

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [классы](../08-oop/classes.md).

---

## 🍎 Объясняем просто

!!! example "Kivy-приложение — это класс, унаследованный от `App`"
    ```python
    class MyApp(App):
        def build(self):
            return Label(text="Привет!")
    ```
    `build()` возвращает **корневой виджет** — то, что видит пользователь.
    Запуск — `MyApp().run()`.

---

## ✍️ Минимальное приложение

```python
from kivy.app import App
from kivy.uix.label import Label

class MyApp(App):
    def build(self):
        return Label(text="Привет, мир!")

if __name__ == "__main__":
    MyApp().run()
```

---

## 📖 Разбор кода

| Строка | Что делает |
|---|---|
| `from kivy.app import App` | Базовый класс приложения |
| `class MyApp(App)` | Наше приложение |
| `build(self)` | Обязательный метод — возвращает корневой виджет |
| `Label(text=...)` | Текстовая надпись |
| `MyApp().run()` | Запуск |

---

## 📌 Виджеты вместо текста

Почти всё в Kivy — виджеты. `Label` — самый простой.

```python
from kivy.uix.button import Button

class MyApp(App):
    def build(self):
        return Button(text="Нажми меня")
```

При клике ничего не произойдёт, пока мы не подключим обработчик.

---

## 📌 Реакция на нажатие

```python
from kivy.app import App
from kivy.uix.button import Button

class MyApp(App):
    def build(self):
        self.count = 0
        self.button = Button(text="Нажми меня")
        self.button.bind(on_press=self.on_press)
        return self.button

    def on_press(self, instance):
        self.count += 1
        instance.text = f"Нажато: {self.count}"

if __name__ == "__main__":
    MyApp().run()
```

**`bind(on_press=...)`** — то же, что `connect` в PyQt.

---

## 📌 Контейнеры: `BoxLayout`

Чтобы разместить несколько виджетов — используйте **layout**.

```python
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label

class MyApp(App):
    def build(self):
        layout = BoxLayout(orientation="vertical", spacing=10, padding=20)
        layout.add_widget(Label(text="Заголовок"))
        layout.add_widget(Button(text="Кнопка 1"))
        layout.add_widget(Button(text="Кнопка 2"))
        return layout

if __name__ == "__main__":
    MyApp().run()
```

---

## 📌 Обращение к виджетам

Каждый виджет имеет `id` (если задан через KV), `parent`, `children`.

```python
layout = BoxLayout()
b = Button(text="OK")
layout.add_widget(b)

print(b.parent is layout)     # True
print(layout.children)         # [Button, ...]
```

---

## 💡 Полный пример — счётчик

```python
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label


class CounterApp(App):
    def build(self):
        self.count = 0

        layout = BoxLayout(orientation="vertical", padding=20, spacing=10)

        self.label = Label(text="0", font_size=60)
        btn_plus = Button(text="+1", font_size=30)
        btn_minus = Button(text="−1", font_size=30)

        btn_plus.bind(on_press=self.plus)
        btn_minus.bind(on_press=self.minus)

        layout.add_widget(self.label)
        layout.add_widget(btn_plus)
        layout.add_widget(btn_minus)

        return layout

    def plus(self, instance):
        self.count += 1
        self.label.text = str(self.count)

    def minus(self, instance):
        self.count -= 1
        self.label.text = str(self.count)


if __name__ == "__main__":
    CounterApp().run()
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. `build()` не возвращает виджет"
    Приложение не запустится — нужен корневой виджет.

!!! warning "Ошибка 2. `bind` с вызовом функции"
    ```python
    btn.bind(on_press=self.handler())    # ❌ вызовется сразу
    btn.bind(on_press=self.handler)      # ✅
    ```

!!! warning "Ошибка 3. Виджет не добавлен в layout"
    Создан, но не показан — нужно `layout.add_widget(...)`.

!!! warning "Ошибка 4. Много `App`-классов в одном файле"
    Обычно одно приложение на файл.

---

## 🧪 Упражнения

1. ⭐ Приложение с надписью «Hello, Kivy!».
2. ⭐ Кнопка, которая меняет текст метки.
3. ⭐⭐ Счётчик нажатий.
4. ⭐⭐ Столбик из трёх кнопок.
5. ⭐⭐ Две колонки: слева — метки, справа — кнопки.
6. ⭐⭐⭐ Мини-калькулятор на Kivy.

---

## 🔗 Что дальше

→ [Виджеты](widgets.md).