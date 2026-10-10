# Виджеты Kivy

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [первое приложение](first-app.md).

---

## 📖 Все основные виджеты

| Виджет | Что это |
|---|---|
| `Label` | Надпись |
| `Button` | Кнопка |
| `ToggleButton` | Кнопка-переключатель |
| `CheckBox` | Флажок |
| `Switch` | Ползунок вкл/выкл |
| `Slider` | Ползунок |
| `ProgressBar` | Прогресс |
| `TextInput` | Поле ввода |
| `Spinner` | Выпадающий список |
| `Image` | Картинка |
| `Video` | Видео |
| `RecycleView` | Список с прокруткой (эффективный) |
| `ScrollView` | Прокрутка |
| `TabbedPanel` | Вкладки |
| `Carousel` | Карусель |
| `FileChooser` | Выбор файла |
| `Popup` | Всплывающее окно |
| `ModalView` | Модальное окно |
| `Screen`, `ScreenManager` | Переключение экранов |
| `Widget`, `BoxLayout`, `GridLayout`, `FloatLayout`, `RelativeLayout`, `AnchorLayout`, `StackLayout` | Контейнеры |
| `Scatter` | Многоточечное перетаскивание |
| `Bezier`, `Line`, `Ellipse`, `Rectangle`, `Triangle`, `Mesh`, `Point` | Графические примитивы |

Разберём важные.

---

## 📝 `Label`

```python
from kivy.uix.label import Label

Label(
    text="Привет!",
    font_size=30,
    color=(1, 0, 0, 1),                 # RGBA 0..1
    halign="center",
    valign="middle",
    markup=True,
)
```

**Markup** (как HTML):

```python
Label(text="[b]Жирный[/b] [i]курсив[/i] [color=ff0000]красный[/color]", markup=True)
```

Теги: `[b]`, `[i]`, `[u]`, `[s]`, `[color=]`, `[size=]`, `[font=]`, `[sub]`, `[sup]`, `[ref=]`.

---

## 🔘 `Button`

```python
from kivy.uix.button import Button

btn = Button(
    text="Нажми",
    font_size=24,
    background_color=(0.2, 0.7, 0.3, 1),
)
btn.bind(on_press=self.on_click)
btn.bind(on_release=self.on_release)
```

`on_press` — при нажатии. `on_release` — при отпускании.

---

## 🔀 `ToggleButton`

```python
from kivy.uix.togglebutton import ToggleButton

tb = ToggleButton(text="Вкл")
print(tb.state)      # 'normal' или 'down'
```

Несколько toggle-кнопок в `group` ведут себя как радиокнопки:

```python
b1 = ToggleButton(text="A", group="choice")
b2 = ToggleButton(text="B", group="choice")
```

---

## ☑️ `CheckBox`

```python
from kivy.uix.checkbox import CheckBox

cb = CheckBox(active=True)
cb.bind(active=lambda inst, val: print(val))
```

---

## 🎚️ `Switch`

```python
from kivy.uix.switch import Switch

sw = Switch(active=False)
sw.bind(active=lambda inst, val: print(val))
```

---

## 📊 `Slider`

```python
from kivy.uix.slider import Slider

sl = Slider(min=0, max=100, value=50, step=1)
sl.bind(value=lambda inst, val: print(val))
```

---

## 📊 `ProgressBar`

```python
from kivy.uix.progressbar import ProgressBar

pb = ProgressBar(max=100, value=42)
pb.value = 75
```

---

## ✍️ `TextInput`

```python
from kivy.uix.textinput import TextInput

ti = TextInput(
    text="Привет",
    multiline=False,           # одна строка
    hint_text="Введите имя...",
    password=True,             # для пароля
)
ti.bind(text=lambda inst, val: print(val))
ti.bind(on_text_validate=lambda inst: print("Enter!"))
```

---

## 📋 `Spinner`

```python
from kivy.uix.spinner import Spinner

sp = Spinner(
    text="Выберите",
    values=("Один", "Два", "Три"),
)
sp.bind(text=lambda inst, val: print(val))
```

---

## 🖼️ `Image`

```python
from kivy.uix.image import Image

img = Image(source="cat.png", size_hint=(1, 1), allow_stretch=True)
```

---

## 📜 `ScrollView`

```python
from kivy.uix.scrollview import ScrollView

scroll = ScrollView()
scroll.add_widget(большой_виджет)
```

---

## 🔄 `ScreenManager` — экраны

Позволяет переключаться между «экранами» (как страницы мобильного приложения).

```python
from kivy.uix.screenmanager import ScreenManager, Screen

class MenuScreen(Screen):
    pass

class GameScreen(Screen):
    pass

sm = ScreenManager()
sm.add_widget(MenuScreen(name="menu"))
sm.add_widget(GameScreen(name="game"))

sm.current = "game"      # переключение
```

---

## 💬 `Popup` — всплывающее окно

```python
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.boxlayout import BoxLayout

content = BoxLayout(orientation="vertical")
content.add_widget(Label(text="Это сообщение"))
btn = Button(text="OK")

popup = Popup(title="Внимание", content=content, size_hint=(0.8, 0.4))
btn.bind(on_press=popup.dismiss)
content.add_widget(btn)

popup.open()
```

---

## 🎛️ Layouts — контейнеры

| Класс | Как располагает |
|---|---|
| `BoxLayout` | Столбик/строка (`orientation`) |
| `GridLayout` | Сетка (`cols` / `rows`) |
| `FloatLayout` | Свободное (по `pos_hint`, `size_hint`) |
| `RelativeLayout` | Как Float, но координаты — относительно |
| `AnchorLayout` | Прижимает к стороне |
| `StackLayout` | «Полка» с переносом |
| `PageLayout` | Страницы с перелистыванием |

**`size_hint`** — доля размера родителя (0..1). `size_hint=(0.5, 0.5)` — половина.

**`pos_hint`** — положение: `{"center_x": 0.5, "top": 1}`.

```python
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.button import Button

layout = FloatLayout()
btn = Button(text="Центр", size_hint=(0.3, 0.2), pos_hint={"center_x": 0.5, "center_y": 0.5})
layout.add_widget(btn)
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `add_widget`"
    Виджет не появится.

!!! warning "Ошибка 2. `size_hint` 0..1"
    `size_hint=(100, 100)` — ошибка. Либо доля, либо `size_hint=(None, None)` + `size=(w, h)`.

!!! warning "Ошибка 3. Изменение атрибутов из другого потока"
    Kivy **не потокобезопасен**. Используйте `Clock.schedule_once(...)`.

!!! warning "Ошибка 4. Bind с лямбдой, теряющей ссылку"
    Как и в PyQt — следите за замыканиями.

---

## 🧪 Упражнения

1. ⭐ Метка + кнопка. По нажатию метка меняется.
2. ⭐ Поле ввода + метка (эхо).
3. ⭐⭐ Слайдер + метка с числом.
4. ⭐⭐ Форма логина: два `TextInput` и кнопка.
5. ⭐⭐ Всплывающее окно с сообщением.
6. ⭐⭐⭐ Два экрана: меню и игра, переключение по кнопке.

---

## 🔗 Что дальше

→ [Язык KV](kv-language.md).