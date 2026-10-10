# Язык KV

!!! abstract "Уровень: ⭐⭐ Средний → ⭐⭐⭐"
    Нужно знать: [виджеты](widgets.md).

---

## 🍎 Объясняем просто

!!! example "KV — отдельный язык для интерфейса"
    Вместо того чтобы писать дерево виджетов в Python, можно описать его
    в **отдельном текстовом файле** — как HTML+CSS для веба.

    ```kv
    <MyWidget>:
        BoxLayout:
            orientation: "vertical"
            Label:
                text: "Привет"
            Button:
                text: "OK"
    ```

---

## 📖 Зачем KV

- Интерфейс отделён от логики
- Легче читать
- Автоматическое связывание свойств (когда одно меняется — другое обновляется)
- Свой `id` у каждого виджета — доступ из Python

---

## 📌 Загрузка KV-файла

**Автоматически:** файл `myapp.kv` рядом с `myapp.py` подхватится сам,
если у `App`-класса имя совпадает (без `App`).

```
counterapp.py     →  counterapp.kv
class CounterApp(App)   →  counterapp.kv
```

**Вручную:** `Builder.load_file("my.kv")`.

---

## 📌 Синтаксис

### Правила для виджета

```kv
<MyWidget>:
    ...
```

Это «правило» — как выглядит виджет `MyWidget`.

### Вложенность — по отступам

```kv
<MyWidget>:
    BoxLayout:
        Button:
            text: "Первая"
        Button:
            text: "Вторая"
```

### Свойства и значения

```kv
Label:
    text: "Привет"
    font_size: 24
    color: 1, 0, 0, 1
```

### `id` для доступа из Python

```kv
<MyWidget>:
    BoxLayout:
        Label:
            id: my_label
            text: "Привет"
        Button:
            on_press: root.on_click()
```

В Python: `self.ids.my_label.text = "Новый"`.

---

## 📌 Связывание и события

```kv
Button:
    text: "OK"
    on_press: root.handle_press()
    on_release: app.stop()
```

- `root` — корневой виджет правила
- `app` — экземпляр `App`
- `self` — сам виджет

### Выражения

```kv
Label:
    text: "Сумма: " + str(root.a + root.b)
```

KV понимает Python-выражения.

---

## 📌 Свойства с автоматическим обновлением

Это главная «магия» KV. Если у `App` есть свойства `NumericProperty`,
`StringProperty` и т.п. — KV автоматически подпишется на их изменения.

```python
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.properties import NumericProperty

class CounterWidget(BoxLayout):
    count = NumericProperty(0)

    def increment(self):
        self.count += 1

class CounterApp(App):
    def build(self):
        return CounterWidget()

if __name__ == "__main__":
    CounterApp().run()
```

**`counterapp.kv`:**

```kv
<CounterWidget>:
    orientation: "vertical"
    Label:
        text: "Счёт: " + str(root.count)
    Button:
        text: "+1"
        on_press: root.increment()
```

Как только `count` изменится — надпись обновится **сама**. Это очень
удобно и «по-кивишному».

---

## 📌 Наследование в KV

Правило можно наследовать:

```kv
<BaseButton>:
    size_hint: 1, 0.2
    font_size: 20

<PrimaryButton@BaseButton>:
    background_color: 0.2, 0.6, 1, 1
```

`<PrimaryButton@BaseButton>` — виджет `PrimaryButton`, не объявленный в
Python, наследующий `BaseButton`.

---

## 📌 Динамические классы

Можно определить новый класс **прямо в KV**:

```kv
<MyButton@Button>:
    size_hint: 1, 0.2
    font_size: 18
    background_color: 1, 0, 0, 1

<RootWidget>:
    MyButton:
        text: "Раз"
    MyButton:
        text: "Два"
```

В Python про `MyButton` знать не нужно.

---

## 💡 Полный пример — счётчик с KV

**`counterapp.py`:**

```python
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.properties import NumericProperty


class CounterRoot(BoxLayout):
    count = NumericProperty(0)

    def increment(self):
        self.count += 1

    def decrement(self):
        self.count -= 1


class CounterApp(App):
    def build(self):
        return CounterRoot()


if __name__ == "__main__":
    CounterApp().run()
```

**`counterapp.kv`:**

```kv
<CounterRoot>:
    orientation: "vertical"
    padding: 20
    spacing: 10

    Label:
        text: "Счёт: " + str(root.count)
        font_size: 60

    Button:
        text: "+1"
        font_size: 30
        on_press: root.increment()

    Button:
        text: "-1"
        font_size: 30
        on_press: root.decrement()
```

Обратите внимание: в Python **нет** кода интерфейса — только логика.

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Имя файла KV не совпадает"
    `myapp.py` → `myapp.kv`. Имя `App`-класса без `App` тоже подходит:
    `CounterApp` → `counter.kv`.

!!! warning "Ошибка 2. Неправильные отступы"
    KV **очень чувствителен** к отступам. Используйте 4 пробела (не табы,
    не смесь).

!!! warning "Ошибка 3. `id` не найден"
    ```python
    self.ids.my_label      # KeyError, если id не объявлен в KV
    ```

!!! warning "Ошибка 4. Свойство не обновляется"
    Обычные атрибуты Python **не** триггерят обновление. Нужны
    `NumericProperty`, `StringProperty`, `ObjectProperty` и т.д.

!!! warning "Ошибка 5. `root` в неправильном контексте"
    `root` — корень **этого правила**. Внутри `<MyWidget>` `root` = `MyWidget`.
    Внутри другого правила — другое.

---

## 🧪 Упражнения

1. ⭐ Перенесите кнопку с меткой из Python в KV.
2. ⭐ Счётчик нажатий с автоматическим обновлением.
3. ⭐⭐ Форма: два `TextInput` и `Label`, обновляемый при вводе.
4. ⭐⭐ Свой класс `PrimaryButton@Button` в KV.
5. ⭐⭐ Используйте `self.ids.my_label.text = ...` для обновления.
6. ⭐⭐⭐ Мини-приложение с двумя экранами через KV.

---

## 🔗 Что дальше

→ [Сборка APK](packaging.md).