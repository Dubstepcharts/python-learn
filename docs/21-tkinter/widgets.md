# tkinter: виджеты и приложение

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [функции](../05-functions/index.md), [классы](../08-oop/classes.md).

---

## 🍎 Объясняем просто

!!! example "tkinter — как конструктор"
    У тебя есть **окно** (главный контейнер). В него ты кладёшь **виджеты**:
    кнопки, надписи, поля ввода, списки. Затем «включаешь мотор» —
    `mainloop()`. Приложение крутится, пока пользователь не закроет окно.

---

## 📖 Главные шаги

1. Создать **корневое окно** — `root = tk.Tk()`
2. Создать виджеты с `root` в качестве родителя
3. Разместить их — через `pack`, `grid` или `place`
4. Запустить цикл событий — `root.mainloop()`

---

## ✍️ Минимальный шаблон

```python
import tkinter as tk

root = tk.Tk()
root.title("Приложение")
root.geometry("500x400")

# Здесь виджеты

root.mainloop()
```

**Про `geometry`:**
- `"500x400"` — ширина × высота
- `"+100+50"` — позиция окна на экране
- `"500x400+100+50"` — всё сразу

---

## 📌 Все виджеты tkinter

| Виджет | Что это |
|---|---|
| `Label` | Надпись |
| `Button` | Кнопка |
| `Entry` | Однострочное поле ввода |
| `Text` | Многострочное поле |
| `Checkbutton` | Флажок |
| `Radiobutton` | Радиокнопка |
| `Listbox` | Список |
| `Combobox` | Выпадающий список (в `ttk`) |
| `Spinbox` | Число со стрелками |
| `Scale` | Слайдер |
| `Canvas` | Холст для рисования |
| `Frame` | Контейнер |
| `LabelFrame` | Контейнер с заголовком |
| `Menu` | Меню |
| `Message` | Многострочный текст |
| `Toplevel` | Дочернее окно |
| `Scrollbar` | Полоса прокрутки |
| `Progressbar` | Прогресс (в `ttk`) |
| `Notebook` | Вкладки (в `ttk`) |
| `Treeview` | Таблица / дерево (в `ttk`) |

**Современные виджеты** — в модуле `tkinter.ttk`. Импортируйте:

```python
from tkinter import ttk
```

---

## 📌 `Label` — надпись

```python
label = tk.Label(
    root,
    text="Привет!",
    font=("Arial", 16, "bold"),
    fg="blue",                   # цвет текста
    bg="yellow",                 # цвет фона
    width=20, height=2,           # размер в знакоместах
    anchor="w",                    # выравнивание: n, s, e, w, center
    justify="left",                # выравнивание многострочного
)
label.pack()
```

Изменить текст потом:

```python
label.config(text="Новый текст")
# или
label["text"] = "Новый текст"
```

---

## 📌 `Button` — кнопка

```python
def on_click():
    print("Нажато!")

btn = tk.Button(
    root,
    text="Нажми меня",
    command=on_click,
    width=15,
    bg="#4CAF50",
    fg="white",
    font=("Arial", 12),
)
btn.pack()

# Или с лямбдой
btn2 = tk.Button(root, text="OK", command=lambda: print("OK"))
```

!!! warning "`command=on_click` без скобок"
    ```python
    command=on_click()    # ❌ вызовется сразу
    command=on_click      # ✅ передаём функцию
    ```

---

## 📌 `Entry` — поле ввода

```python
entry = tk.Entry(root, width=30, font=("Arial", 12))
entry.pack()

# Прочитать
text = entry.get()

# Установить
entry.delete(0, tk.END)
entry.insert(0, "Значение по умолчанию")

# Пароль
entry_pwd = tk.Entry(root, show="*")
```

Связка с кнопкой:

```python
def show_name():
    name = entry.get()
    label.config(text=f"Привет, {name}!")

tk.Button(root, text="Показать", command=show_name).pack()
```

---

## 📌 `Text` — многострочное поле

```python
text = tk.Text(root, width=40, height=10, font=("Consolas", 11))
text.pack()

# Читать
content = text.get("1.0", tk.END)    # от строки 1, символа 0 — до конца

# Установить
text.delete("1.0", tk.END)
text.insert("1.0", "Привет\nМир")
```

Координаты `"строка.символ"` — 1-индексированные.

---

## 📌 `Checkbutton` — флажок

```python
var = tk.BooleanVar()
cb = tk.Checkbutton(root, text="Согласен", variable=var)
cb.pack()

def check():
    print("Согласен:", var.get())

tk.Button(root, text="Проверить", command=check).pack()
```

`var.get()` возвращает `True`/`False`.

---

## 📌 `Radiobutton` — радиокнопка

```python
choice = tk.StringVar(value="a")

tk.Radiobutton(root, text="Вариант A", variable=choice, value="a").pack()
tk.Radiobutton(root, text="Вариант B", variable=choice, value="b").pack()
tk.Radiobutton(root, text="Вариант C", variable=choice, value="c").pack()

def show():
    print("Выбрано:", choice.get())
```

Одна `variable` — одна группа.

---

## 📌 `Listbox` — список

```python
listbox = tk.Listbox(root, height=6)
listbox.pack()

for name in ["Аня", "Борис", "Вика", "Глеб"]:
    listbox.insert(tk.END, name)

def show_selected():
    sel = listbox.curselection()
    if sel:
        print(listbox.get(sel[0]))

tk.Button(root, text="Выбрать", command=show_selected).pack()
```

**Методы:** `insert`, `delete`, `get`, `curselection`, `size`, `see`.

---

## 📌 `Combobox` — выпадающий список (ttk)

```python
from tkinter import ttk

combo = ttk.Combobox(root, values=["Python", "Java", "C++"], state="readonly")
combo.pack()
combo.current(0)

def on_select(event):
    print("Выбрано:", combo.get())

combo.bind("<<ComboboxSelected>>", on_select)
```

---

## 📌 `Scale` — слайдер

```python
scale = tk.Scale(
    root,
    from_=0, to=100,
    orient="horizontal",
    length=300,
    label="Громкость",
)
scale.pack()

value = scale.get()
```

С `command`:

```python
def on_change(value):
    print("Сейчас:", value)

scale = tk.Scale(root, from_=0, to=100, command=on_change)
```

Обратите внимание: `command` получает значение как **строку**.

---

## 📌 `Spinbox` — число со стрелками

```python
spin = tk.Spinbox(root, from_=1, to=100, width=5)
spin.pack()

print(spin.get())     # строкой!
```

---

## 📌 `Frame` — контейнер

```python
frame = tk.Frame(root, bg="lightgray", bd=2, relief="solid")
frame.pack(padx=10, pady=10, fill="x")

tk.Label(frame, text="Внутри рамки").pack()
```

`LabelFrame` — с заголовком:

```python
lf = tk.LabelFrame(root, text="Настройки", padx=10, pady=10)
lf.pack()
tk.Checkbutton(lf, text="Звук").pack()
```

---

## 📌 `Canvas` — рисование

```python
canvas = tk.Canvas(root, width=400, height=300, bg="white")
canvas.pack()

# Линия
canvas.create_line(10, 10, 200, 100, fill="red", width=3)

# Прямоугольник
canvas.create_rectangle(50, 50, 150, 120, fill="yellow", outline="black")

# Овал
canvas.create_oval(200, 50, 300, 150, fill="lightblue")

# Текст
canvas.create_text(200, 200, text="Привет!", font=("Arial", 20))

# Картинка (только GIF/PNG через PhotoImage)
photo = tk.PhotoImage(file="image.png")
canvas.create_image(100, 100, image=photo)
```

**Методы:** `create_line`, `create_rectangle`, `create_oval`, `create_polygon`,
`create_arc`, `create_text`, `create_image`, `delete`, `itemconfig`.

Событие клика:

```python
def on_canvas_click(event):
    print(f"Клик: x={event.x}, y={event.y}")

canvas.bind("<Button-1>", on_canvas_click)
```

---

## 📌 Меню

```python
menubar = tk.Menu(root)

file_menu = tk.Menu(menubar, tearoff=0)
file_menu.add_command(label="Новый", command=lambda: print("Новый"))
file_menu.add_command(label="Открыть", command=lambda: print("Открыть"))
file_menu.add_separator()
file_menu.add_command(label="Выход", command=root.quit)

menubar.add_cascade(label="Файл", menu=file_menu)
root.config(menu=menubar)
```

---

## 📌 Компоновки (geometry managers)

Три способа расположить виджеты.

### `pack` — «упаковка» (простой)

```python
label.pack()                      # по умолчанию сверху
label.pack(side="top")
label.pack(side="bottom")
label.pack(side="left")
label.pack(side="right")
label.pack(fill="x")               # растянуть по ширине
label.pack(fill="both", expand=True)
label.pack(padx=10, pady=10)
```

### `grid` — сетка (рекомендуется)

```python
tk.Label(root, text="Имя:").grid(row=0, column=0, sticky="e")
tk.Entry(root).grid(row=0, column=1)
tk.Label(root, text="Возраст:").grid(row=1, column=0, sticky="e")
tk.Entry(root).grid(row=1, column=1)
tk.Button(root, text="OK").grid(row=2, column=0, columnspan=2)
```

**Параметры:** `row`, `column`, `rowspan`, `columnspan`, `sticky` (`n`,`s`,`e`,`w`,`ne`,...), `padx`, `pady`.

### `place` — абсолютные координаты

```python
widget.place(x=100, y=50, width=200, height=30)
```

Реже используется — плохо реагирует на ресайз.

!!! warning "Не смешивайте `pack` и `grid` в одном контейнере"
    Это приведёт к зависанию. Выбирайте один способ.

---

## 📌 События

```python
widget.bind("<событие>", handler)
```

| Событие | Значит |
|---|---|
| `<Button-1>` | Клик левой кнопкой |
| `<Button-2>`, `<Button-3>` | Средней, правой |
| `<Double-Button-1>` | Двойной клик |
| `<Motion>` | Движение мыши |
| `<Enter>`, `<Leave>` | Курсор над виджетом / ушёл |
| `<Key>` | Любая клавиша |
| `<Return>` | Enter |
| `<Escape>` | Escape |
| `<KeyPress-a>` | Конкретная клавиша |
| `<Control-c>` | Ctrl+C |
| `<FocusIn>`, `<FocusOut>` | Получил/потерял фокус |
| `<<ComboboxSelected>>` | Виртуальное событие Combobox |

```python
def on_key(event):
    print(f"Нажато: {event.keysym}, код: {event.keycode}")

root.bind("<Key>", on_key)
```

У событий есть атрибуты: `event.x`, `event.y`, `event.keysym`, `event.char`,
`event.widget`.

---

## 📌 Переменные tkinter

Особые обёртки, синхронизирующие значение между виджетами:

| Класс | Для чего |
|---|---|
| `StringVar()` | Строка |
| `IntVar()` | Целое |
| `DoubleVar()` | Дробное |
| `BooleanVar()` | True/False |

```python
name = tk.StringVar(value="Аня")

entry = tk.Entry(root, textvariable=name)   # связка

# Теперь entry и name синхронны
print(name.get())         # текущее значение
name.set("Борис")          # изменит и entry
```

---

## 📌 Дочернее окно

```python
def open_window():
    win = tk.Toplevel(root)
    win.title("Дочернее окно")
    win.geometry("200x100")
    tk.Label(win, text="Привет из второго окна").pack()

tk.Button(root, text="Открыть", command=open_window).pack()
```

---

## 📌 Диалоги

```python
from tkinter import messagebox, filedialog, simpledialog

# Сообщения
messagebox.showinfo("Инфо", "Всё хорошо")
messagebox.showwarning("Внимание", "Осторожно")
messagebox.showerror("Ошибка", "Что-то не так")
answer = messagebox.askyesno("Вопрос", "Продолжить?")
answer = messagebox.askokcancel("Вопрос", "OK?")

# Файлы
path = filedialog.askopenfilename(title="Открыть", filetypes=[("Текст", "*.txt")])
path = filedialog.asksaveasfilename(title="Сохранить", defaultextension=".txt")
folder = filedialog.askdirectory()

# Ввод
name = simpledialog.askstring("Имя", "Как вас зовут?")
age = simpledialog.askinteger("Возраст", "Сколько вам лет?")
```

---

## 📌 Полный пример — заметки

```python
import tkinter as tk
from tkinter import filedialog, messagebox

class Notepad:
    def __init__(self, root):
        self.root = root
        self.root.title("Блокнот")
        self.root.geometry("700x500")

        # Меню
        menubar = tk.Menu(root)
        file_menu = tk.Menu(menubar, tearoff=0)
        file_menu.add_command(label="Открыть", command=self.open_file, accelerator="Ctrl+O")
        file_menu.add_command(label="Сохранить", command=self.save_file, accelerator="Ctrl+S")
        file_menu.add_separator()
        file_menu.add_command(label="Выход", command=root.quit)
        menubar.add_cascade(label="Файл", menu=file_menu)
        root.config(menu=menubar)

        # Текст
        self.text = tk.Text(root, wrap="word", font=("Consolas", 12))
        self.text.pack(fill="both", expand=True)

        # Горячие клавиши
        root.bind("<Control-o>", lambda e: self.open_file())
        root.bind("<Control-s>", lambda e: self.save_file())

    def open_file(self):
        path = filedialog.askopenfilename(
            filetypes=[("Текст", "*.txt"), ("Все файлы", "*.*")]
        )
        if not path:
            return
        with open(path, encoding="utf-8") as f:
            self.text.delete("1.0", tk.END)
            self.text.insert("1.0", f.read())

    def save_file(self):
        path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Текст", "*.txt")],
        )
        if not path:
            return
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.text.get("1.0", tk.END))
        messagebox.showinfo("Готово", "Файл сохранён")


if __name__ == "__main__":
    root = tk.Tk()
    app = Notepad(root)
    root.mainloop()
```

---

## 💡 Проект — калькулятор

```python
import tkinter as tk

class Calculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Калькулятор")
        self.root.geometry("300x400")
        self.root.resizable(False, False)

        self.expr = ""

        # Экран
        self.display = tk.Entry(
            root, font=("Arial", 20), justify="right",
            state="readonly", readonlybackground="white"
        )
        self.display.grid(row=0, column=0, columnspan=4, padx=5, pady=5, sticky="ew")

        # Кнопки
        buttons = [
            ("C", 1, 0), ("(", 1, 1), (")", 1, 2), ("/", 1, 3),
            ("7", 2, 0), ("8", 2, 1), ("9", 2, 2), ("*", 2, 3),
            ("4", 3, 0), ("5", 3, 1), ("6", 3, 2), ("-", 3, 3),
            ("1", 4, 0), ("2", 4, 1), ("3", 4, 2), ("+", 4, 3),
            ("0", 5, 0), (".", 5, 1), ("⌫", 5, 2), ("=", 5, 3),
        ]

        for text, row, col in buttons:
            tk.Button(
                root, text=text, font=("Arial", 16),
                command=lambda t=text: self.on_button(t),
            ).grid(row=row, column=col, sticky="nsew", padx=2, pady=2)

        for i in range(4):
            root.grid_columnconfigure(i, weight=1)
        for i in range(1, 6):
            root.grid_rowconfigure(i, weight=1)

    def on_button(self, text):
        if text == "C":
            self.expr = ""
        elif text == "⌫":
            self.expr = self.expr[:-1]
        elif text == "=":
            try:
                allowed = set("0123456789+-*/().")
                if not set(self.expr).issubset(allowed):
                    raise ValueError("Недопустимые символы")
                self.expr = str(eval(self.expr))
            except Exception:
                self.expr = "Ошибка"
        else:
            self.expr += text

        self.display.config(state="normal")
        self.display.delete(0, tk.END)
        self.display.insert(0, self.expr)
        self.display.config(state="readonly")


if __name__ == "__main__":
    root = tk.Tk()
    Calculator(root)
    root.mainloop()
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `mainloop()`"
    Окно закроется сразу.

!!! warning "Смешивание `pack` и `grid`"
    В одном контейнере — что-то одно. Иначе окно зависнет.

!!! warning "`command=func()` вместо `command=func`"
    Скобки вызывают функцию сразу.

!!! warning "Изменили текст без `config`"
    ```python
    label.text = "Новое"        # ❌ не работает
    label.config(text="Новое")   # ✅
    ```

!!! warning "Тяжёлая работа в mainloop"
    Долгая операция «заморозит» окно. Используйте `after` или потоки.

!!! warning "Картинки только GIF/PNG"
    Для JPG нужен `Pillow`:
    ```python
    from PIL import Image, ImageTk
    img = ImageTk.PhotoImage(Image.open("photo.jpg"))
    ```

---

## 🧪 Упражнения

1. ⭐ Окно с надписью и кнопкой. По клику — меняется текст.
2. ⭐ Поле ввода + кнопка «Поздороваться».
3. ⭐⭐ Форма логина: `Entry` + `Entry` + кнопка.
4. ⭐⭐ Список дел: `Entry` + `Listbox` + кнопки «Добавить», «Удалить».
5. ⭐⭐ Викторина: 5 вопросов, счёт.
6. ⭐⭐⭐ Рисовалка на `Canvas`: клик — точка, движение — линия.
7. ⭐⭐⭐ Калькулятор (см. проект).
8. ⭐⭐⭐ Блокнот с меню (см. проект).

---

## 🔗 Что дальше

→ [pygame](../22-pygame/index.md) — 2D-игры.