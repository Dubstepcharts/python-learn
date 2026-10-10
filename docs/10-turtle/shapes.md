# Turtle: фигуры

!!! abstract "Уровень: ⭐ Начальный"
    Подойдёт для 5–8 класса. Нужно знать: [основы](basics.md).

---

## 🍎 Объясняем просто

!!! example "Любую фигуру — циклом"
    Правильный многоугольник рисуется одинаково: **повторяем N раз
    «вперёд, поворот»**. Угол поворота = **360° / N**.

    - Треугольник: 360/3 = 120°
    - Квадрат: 360/4 = 90°
    - Пятиугольник: 360/5 = 72°
    - Шестиугольник: 360/6 = 60°

---

## 📐 Формула «правильного многоугольника»

```python
import turtle
t = turtle.Turtle()

n = 6                 # количество сторон
side = 80             # длина стороны
angle = 360 / n       # угол поворота

for _ in range(n):
    t.forward(side)
    t.left(angle)

turtle.done()
```

Меняй `n` — получай разные фигуры. Тот же код!

---

## 🔺 Треугольник

```python
for _ in range(3):
    t.forward(100)
    t.left(120)
```

Равнобедренный (например, ёлочка): ручное управление углами.

```python
t.forward(100)
t.left(120)
t.forward(100)
t.left(120)
t.forward(100)
```

---

## ⬛ Квадрат

```python
for _ in range(4):
    t.forward(100)
    t.left(90)
```

Прямоугольник — стороны разные:

```python
for _ in range(2):
    t.forward(150)
    t.left(90)
    t.forward(80)
    t.left(90)
```

---

## 🔵 Круг

```python
t.circle(50)              # радиус 50
```

### Дуга

```python
t.circle(50, 180)         # половина круга
t.circle(50, 90)          # четверть
```

### Многоугольник через circle и steps

```python
t.circle(80, steps=6)     # шестиугольник, вписанный в круг
t.circle(80, steps=3)     # треугольник
```

---

## ⭐ Звёзды

### 5-конечная звезда

```python
for _ in range(5):
    t.forward(150)
    t.right(144)
```

Угол 144° = 180 − 36 = 180 − 360/10.

### Произвольная звезда

```python
def star(sides, size):
    for _ in range(sides):
        t.forward(size)
        t.right(180 - 180 / sides)

star(5, 150)
```

---

## 🔷 Правильные многоугольники в цикле

```python
import turtle
t = turtle.Turtle()

for n in range(3, 11):
    angle = 360 / n
    for _ in range(n):
        t.forward(50)
        t.left(angle)
    t.penup()
    t.forward(80)     # сдвиг, чтобы не наложились
    t.pendown()
```

---

## 📌 Полезные приёмы

### Рисование без «швов»

Начинайте и заканчивайте в одной точке. В правильном многоугольнике сумма всех поворотов = 360°, поэтому черепашка вернётся в исходное направление.

### Сложные фигуры

Соединяйте несколько простых фигур:

```python
# Квадрат + треугольник сверху = домик
for _ in range(4):
    t.forward(100)
    t.left(90)

t.left(45)
t.forward(70)
t.right(90)
t.forward(70)
```

### Смещение без рисования

```python
t.penup()
t.goto(100, 100)
t.pendown()
```

---

## 🎨 Заливка фигур

```python
t.fillcolor("yellow")
t.begin_fill()

for _ in range(4):
    t.forward(100)
    t.left(90)

t.end_fill()
```

Между `begin_fill` и `end_fill` — то, что закрасится.

`t.filling()` — проверяет, идёт ли заливка.

---

## 💡 Примеры

### Пример 1. Ёлочка 🎄

```python
import turtle

t = turtle.Turtle()
t.speed(3)

# Ствол
t.color("brown")
t.begin_fill()
for _ in range(2):
    t.forward(30)
    t.left(90)
    t.forward(60)
    t.left(90)
t.end_fill()

# Верхние «ярусы»
t.penup()
t.goto(-50, 60)
t.pendown()
t.color("green")
t.begin_fill()
t.forward(100)
t.left(120)
t.forward(100)
t.left(120)
t.forward(100)
t.end_fill()

t.penup()
t.goto(-35, 120)
t.pendown()
t.begin_fill()
t.forward(70)
t.left(120)
t.forward(70)
t.left(120)
t.forward(70)
t.end_fill()

turtle.done()
```

### Пример 2. Снежинка ❄️

```python
import turtle

t = turtle.Turtle()
t.speed(0)

for _ in range(6):
    t.forward(100)
    # Три «веточки»
    for _ in range(3):
        t.backward(20)
        t.left(45)
        t.forward(20)
        t.backward(20)
        t.right(90)
        t.forward(20)
        t.backward(20)
        t.left(45)
    t.backward(80)
    t.right(60)

turtle.done()
```

### Пример 3. Радужный веер 🌈

```python
import turtle

t = turtle.Turtle()
t.speed(0)

colors = ["red", "orange", "yellow", "green", "blue", "purple"]
for i, c in enumerate(colors):
    t.color(c)
    t.pensize(5)
    t.circle(50 + i * 15, 180)

turtle.done()
```

### Пример 4. Сюжетный — черепаший узор 🌀

```python
import turtle

t = turtle.Turtle()
t.speed(0)

for i in range(36):
    for color in ["red", "orange", "yellow", "green", "blue"]:
        t.color(color)
        t.forward(100)
        t.right(144)     # звезда
    t.right(10)

turtle.done()
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Неверный угол для многоугольника"
    ```python
    for _ in range(5):
        t.forward(100)
        t.left(60)      # ❌ получится не пятиугольник
    ```
    Угол = 360 / N. Для пятиугольника — 72°.

!!! warning "Ошибка 2. Забыли `end_fill()`"
    Без него фигура не закрасится.

!!! warning "Ошибка 3. Круг через `forward`"
    Круг рисуется `t.circle(r)`, а не «много маленьких forward».

!!! warning "Ошибка 4. Скорость 0 и не видно рисунок"
    При `speed(0)` рисунок создаётся мгновенно. Для наблюдения — `speed(1..10)`.

---

## 🧪 Упражнения

1. ⭐ Треугольник и пятиугольник.
2. ⭐ Круг и полукруг.
3. ⭐⭐ Правильный 8-угольник.
4. ⭐⭐ Три круга разных радиусов.
5. ⭐⭐ Звезда на 6 лучей.
6. ⭐⭐⭐ Снежинка из 8 лучей с веточками.
7. ⭐⭐⭐ Заполненный жёлтый квадрат с обводкой.

---

## 🔗 Что дальше

→ [Цвета](colors.md) — палитра и заливка.