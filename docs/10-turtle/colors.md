# Turtle: цвета

!!! abstract "Уровень: ⭐ Начальный"
    Подойдёт для 5–8 класса. Нужно знать: [фигуры](shapes.md).

---

## 🍎 Объясняем просто

!!! example "Цвет линии, цвет заливки, цвет фона"
    У черепашки есть три «цвета»:
    1. **Цвет пера** (`pencolor`) — цвет линии, которую она оставляет
    2. **Цвет заливки** (`fillcolor`) — чем закрашивать фигуру
    3. **Цвет фона** (`bgcolor`) — фон окна

    ```python
    t.pencolor("red")
    t.fillcolor("yellow")
    screen.bgcolor("lightblue")
    ```

---

## 🎨 Названия цветов

Можно писать словами:

```
red, orange, yellow, green, lime, blue, cyan, purple, magenta, pink,
brown, black, white, gray, gold, salmon, tomato, chocolate, coral,
crimson, darkgreen, darkblue, violet, indigo, ...
```

Полный список — в CSS-цветах. Можно посмотреть так:

```python
import turtle
print(turtle.Screen()._color_names if hasattr(turtle.Screen(), "_color_names") else "см. turtle docs")
```

Или проще: используйте любой стандартный CSS-цвет по имени.

```python
t.color("red")
t.color("darkgreen")
t.color("tomato")
```

---

## 🎯 Команды цвета

| Команда | Что делает |
|---|---|
| `t.pencolor(c)` | Цвет пера |
| `t.fillcolor(c)` | Цвет заливки |
| `t.color(pencolor)` | Задать оба |
| `t.color(pencolor, fillcolor)` | Оба разными |
| `t.pencolor(r, g, b)` | RGB 0–255 |
| `t.fillcolor(r, g, b)` | RGB заливки |
| `t.color()` | Получить текущий цвет |
| `screen.bgcolor(c)` | Цвет фона окна |
| `turtle.colormode(255)` | Разрешить RGB 0–255 |

---

## 🌈 RGB-цвета

По умолчанию цвета — 0..1 (float). Включите `colormode(255)` — будут 0..255:

```python
import turtle
turtle.colormode(255)

t = turtle.Turtle()
t.pencolor(255, 0, 0)         # чистый красный
t.pensize(5)
t.forward(100)

t.pencolor(0, 128, 255)       # голубой
t.forward(100)

turtle.done()
```

### Соответствие цветов

| Цвет | RGB |
|---|---|
| красный | (255, 0, 0) |
| зелёный | (0, 255, 0) |
| синий | (0, 0, 255) |
| жёлтый | (255, 255, 0) |
| голубой | (0, 255, 255) |
| фиолетовый | (255, 0, 255) |
| чёрный | (0, 0, 0) |
| белый | (255, 255, 255) |

---

## 🖌️ Заливка фигур

Три команды:

- `t.begin_fill()` — начать «собирать» контур
- `t.end_fill()` — закрасить
- `t.filling()` — идёт ли заливка сейчас?

```python
t.fillcolor("yellow")
t.pencolor("orange")
t.pensize(3)

t.begin_fill()
for _ in range(4):
    t.forward(100)
    t.left(90)
t.end_fill()
```

!!! tip "Заливка работает с любым замкнутым контуром"
    Необязательно с правильной фигурой. Важно, чтобы контур **смыкался**.

---

## 🎨 Смена цветов в цикле

```python
import turtle
turtle.colormode(255)

t = turtle.Turtle()
t.speed(0)

colors = [(255, 0, 0), (255, 128, 0), (255, 255, 0),
          (0, 255, 0), (0, 0, 255), (128, 0, 255)]

for i in range(36):
    t.pencolor(colors[i % len(colors)])
    t.circle(100 + i * 2)
    t.left(10)

turtle.done()
```

---

## 🌈 Радуга

```python
import turtle

t = turtle.Turtle()
t.pensize(10)
t.speed(0)

rainbow = ["red", "orange", "yellow", "green", "blue", "purple"]
for i, color in enumerate(rainbow):
    t.pencolor(color)
    t.penup()
    t.goto(0, -i * 15)
    t.pendown()
    t.circle(100 + i * 15, 180)

turtle.done()
```

---

## 🎨 Градиент

```python
import turtle
turtle.colormode(255)

t = turtle.Turtle()
t.speed(0)

for i in range(255):
    t.pencolor(i, 0, 255 - i)
    t.forward(5)
    t.left(1)

turtle.done()
```

---

## 📌 Цвет фона и картинка

```python
screen = turtle.Screen()
screen.bgcolor("lightyellow")
# screen.bgpic("background.gif")     # только .gif
```

Файл `.gif` должен лежать рядом со скриптом. Поддерживаются только GIF.

---

## 💡 Примеры

### Пример 1. Радужная спираль 🌀

```python
import turtle

t = turtle.Turtle()
t.speed(0)
t.pensize(3)

colors = ["red", "orange", "yellow", "green", "blue", "purple"]
for i in range(120):
    t.pencolor(colors[i % 6])
    t.forward(i * 2)
    t.left(59)

turtle.done()
```

### Пример 2. Сюжетный — светофор 🚦

```python
import turtle

t = turtle.Turtle()
t.speed(3)
t.penup()

positions = [(-40, 60, "red"), (-40, 0, "yellow"), (-40, -60, "green")]
for x, y, color in positions:
    t.goto(x, y)
    t.pendown()
    t.fillcolor(color)
    t.begin_fill()
    t.circle(20)
    t.end_fill()
    t.penup()

turtle.done()
```

### Пример 3. Круги с заливкой 🎯

```python
import turtle
turtle.colormode(255)

t = turtle.Turtle()
t.speed(5)
t.pensize(2)

for i in range(6):
    r = 20 + i * 15
    color = (i * 40, 100, 255 - i * 40)
    t.pencolor(color)
    t.fillcolor(color)
    t.penup()
    t.goto(0, -r)
    t.pendown()
    t.begin_fill()
    t.circle(r)
    t.end_fill()

turtle.done()
```

### Пример 4. Клетчатый флаг 🏁

```python
import turtle

t = turtle.Turtle()
t.speed(0)

size = 30
for row in range(5):
    for col in range(5):
        color = "black" if (row + col) % 2 == 0 else "white"
        t.penup()
        t.goto(col * size, -row * size)
        t.pendown()
        t.fillcolor(color)
        t.begin_fill()
        for _ in range(4):
            t.forward(size)
            t.right(90)
        t.end_fill()

turtle.done()
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. RGB без `colormode(255)`"
    ```python
    t.pencolor(255, 0, 0)      # ❌ значения >1 не сработают
    ```
    **Правильно:** сначала `turtle.colormode(255)`.

!!! warning "Ошибка 2. Забыли `end_fill()`"
    Цвет заливки не применится.

!!! warning "Ошибка 3. Имя цвета написано с ошибкой"
    ```python
    t.pencolor("daaarkgreen")    # ошибка
    ```
    Пишите точно как в CSS: `darkgreen`.

!!! warning "Ошибка 4. `bgpic` с PNG/JPG"
    Работает только с `.gif`. Конвертируйте картинку.

---

## 🧪 Упражнения

1. ⭐ Красный квадрат.
2. ⭐ Радужная линия из 6 цветных отрезков.
3. ⭐⭐ Жёлтый круг с чёрной обводкой.
4. ⭐⭐ Светофор из трёх кругов.
5. ⭐⭐ Градиентная спираль (оттенки).
6. ⭐⭐⭐ Флаг России из трёх цветных полос.
7. ⭐⭐⭐ «Ночное небо»: чёрный фон, белые точки-звёзды.

---

## 🔗 Что дальше

→ [Циклы в turtle](loops-in-turtle.md) — узоры и фракталы.