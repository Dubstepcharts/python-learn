# Turtle: циклы и узоры

!!! abstract "Уровень: ⭐⭐ Средний"
    Подойдёт для 7–11 класса. Нужно знать: [цикл for](../02-control-flow/for.md), [фигуры](shapes.md).

---

## 🍎 Объясняем просто

!!! example "Узор = фигура + поворот"
    Нарисуй квадрат. Поверни на 10°. Нарисуй ещё один. Повтори 36 раз —
    получится красивый узор, как у мандалы.

    ```python
    for _ in range(36):
        for _ in range(4):
            t.forward(100)
            t.left(90)
        t.left(10)
    ```

---

## 🌀 Простые узоры

### Спираль

```python
import turtle
t = turtle.Turtle()
t.speed(0)

for i in range(100):
    t.forward(i * 2)
    t.left(30)

turtle.done()
```

С каждой итерацией отрезок длиннее — получается расширяющаяся спираль.

### Уменьшающаяся спираль

```python
for i in range(100, 0, -1):
    t.forward(i)
    t.right(15)
```

### Многоугольники с поворотом

```python
for _ in range(12):
    for _ in range(6):
        t.forward(80)
        t.left(60)
    t.left(30)
```

---

## 🌸 Мандала / цветок

```python
import turtle

t = turtle.Turtle()
t.speed(0)
t.pensize(2)

colors = ["red", "orange", "yellow", "green", "blue", "purple"]

for i in range(36):
    t.pencolor(colors[i % 6])
    for _ in range(4):
        t.forward(50)
        t.left(90)
    t.left(10)

turtle.done()
```

---

## 🔄 Вложенные циклы

```python
for outer in range(6):
    for inner in range(4):
        t.forward(100)
        t.left(90)
    t.left(60)      # поворот между квадратами
```

**Внешний** цикл — сколько фигур. **Внутренний** — рисует одну фигуру.

---

## 🧬 Рекурсия и фракталы

Фрактал — фигура, которая «повторяется сама в себе». Отличный пример — **снежинка Коха**.

### Кривая Коха

Заменим каждый отрезок на «пилообразный» из 4 частей:

```python
import turtle

def koch(t, length, depth):
    if depth == 0:
        t.forward(length)
    else:
        length /= 3
        koch(t, length, depth - 1)
        t.left(60)
        koch(t, length, depth - 1)
        t.right(120)
        koch(t, length, depth - 1)
        t.left(60)
        koch(t, length, depth - 1)

t = turtle.Turtle()
t.speed(0)
t.penup()
t.goto(-200, 0)
t.pendown()

for _ in range(3):
    koch(t, 400, 4)
    t.right(120)

turtle.done()
```

### Дерево 🌳

```python
import turtle

def branch(t, length, depth):
    if depth == 0:
        return
    t.forward(length)
    t.left(30)
    branch(t, length * 0.7, depth - 1)
    t.right(60)
    branch(t, length * 0.7, depth - 1)
    t.left(30)
    t.backward(length)

t = turtle.Turtle()
t.speed(0)
t.left(90)
t.penup()
t.goto(0, -200)
t.pendown()

branch(t, 100, 8)
turtle.done()
```

### Треугольник Серпинского

```python
def sierpinski(t, size, depth):
    if depth == 0:
        for _ in range(3):
            t.forward(size)
            t.left(120)
    else:
        size /= 2
        sierpinski(t, size, depth - 1)
        t.forward(size)
        sierpinski(t, size, depth - 1)
        t.backward(size)
        t.left(60)
        t.forward(size)
        t.right(60)
        sierpinski(t, size, depth - 1)
        t.left(60)
        t.backward(size)
        t.right(60)

t = turtle.Turtle()
t.speed(0)
sierpinski(t, 300, 4)
turtle.done()
```

---

## 🎨 Узоры с цветом

### Радужная спираль

```python
import turtle
turtle.colormode(255)

t = turtle.Turtle()
t.speed(0)
t.pensize(3)

for i in range(200):
    t.pencolor(i, 100, 255 - i)
    t.forward(i)
    t.left(59)

turtle.done()
```

### Сетка 🌐

```python
import turtle

t = turtle.Turtle()
t.speed(0)

# Горизонтальные линии
for y in range(-5, 6):
    t.penup()
    t.goto(-5 * 30, y * 30)
    t.pendown()
    t.goto(5 * 30, y * 30)

# Вертикальные
for x in range(-5, 6):
    t.penup()
    t.goto(x * 30, -5 * 30)
    t.pendown()
    t.goto(x * 30, 5 * 30)

turtle.done()
```

---

## 💡 Примеры

### Пример 1. Цветок с 12 лепестками 🌺

```python
import turtle

t = turtle.Turtle()
t.speed(0)
t.pencolor("red")

for _ in range(12):
    t.circle(50, 180)      # полукруг — лепесток
    t.left(180)
    t.right(30)

turtle.done()
```

### Пример 2. Радужная мандала 🌈

```python
import turtle
turtle.colormode(255)

t = turtle.Turtle()
t.speed(0)
t.pensize(2)

for i in range(72):
    t.pencolor(i * 3, 100, 255 - i * 3)
    for _ in range(5):
        t.forward(40)
        t.left(72)
    t.left(5)

turtle.done()
```

### Пример 3. Ковер из кругов 🧶

```python
import turtle

t = turtle.Turtle()
t.speed(0)
t.penup()

for x in range(-4, 5):
    for y in range(-4, 5):
        t.goto(x * 30, y * 30)
        t.pendown()
        t.circle(10)
        t.penup()

turtle.done()
```

### Пример 4. Сюжетный — цветущий сад 🌸

```python
import turtle
import random

turtle.colormode(255)

t = turtle.Turtle()
t.speed(0)
t.hideturtle()

for _ in range(30):
    x = random.randint(-200, 200)
    y = random.randint(-200, 200)

    t.penup()
    t.goto(x, y)
    t.pendown()

    color = (random.randint(100, 255), random.randint(100, 255), random.randint(100, 255))
    t.pencolor(color)
    t.fillcolor(color)
    t.begin_fill()

    for _ in range(5):
        t.circle(10)
        t.left(72)

    t.end_fill()

turtle.done()
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Бесконечный цикл в рекурсии"
    Если не задать «дно» (`if depth == 0: return`), рекурсия уйдёт в глубину
    и упадёт с `RecursionError`.

!!! warning "Ошибка 2. Забыли `speed(0)` для фракталов"
    Иначе рисование займёт минуты. Но для наглядности можно 5–10.

!!! warning "Ошибка 3. Кривой угол"
    Для красивого узора угол должен быть делителем 360°. 360/10 = 36°,
    360/12 = 30° и т.д.

!!! warning "Ошибка 4. Забыли вернуть черепашку"
    В рекурсивных функциях следите за `backward` и разворотами — иначе
    черепашка «уедет» и рисунок испортится.

---

## 🧪 Упражнения

1. ⭐ Спираль из 50 отрезков с поворотом на 30°.
2. ⭐ Квадрат, повторённый 12 раз с поворотом на 30°.
3. ⭐⭐ Цветок из 6 кругов.
4. ⭐⭐ Мандала из 24 треугольников с разными цветами.
5. ⭐⭐ Сетка 10×10 квадратов.
6. ⭐⭐⭐ Снежинка Коха глубины 5.
7. ⭐⭐⭐ Дерево с 5 уровнями ветвления и зелёными листьями на концах.

---

## 🔗 Что дальше

→ [Проекты](projects.md) — соберём всё вместе.