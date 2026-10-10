# Turtle: проекты

Здесь — **готовые мини-проекты**, которые можно запустить и сразу увидеть
результат. Идеально для первого «вау-эффекта» и для домашки.

---

## 🎮 Проект 1. Черепашьи гонки

Интерактив: пользователь угадывает победителя, черепашки «бегут».

```python
import turtle
import random

screen = turtle.Screen()
screen.title("Черепашьи гонки")
screen.setup(600, 400)

colors = ["red", "blue", "green", "orange", "purple"]
turtles = []

start_y = -80
for i, color in enumerate(colors):
    t = turtle.Turtle(shape="turtle")
    t.color(color)
    t.penup()
    t.goto(-250, start_y + i * 40)
    turtles.append(t)

input("Нажми Enter, чтобы начать гонку...")

finished = False
while not finished:
    for t in turtles:
        t.forward(random.randint(1, 10))
        if t.xcor() >= 250:
            print(f"Победитель: {t.pencolor()}!")
            finished = True
            break

turtle.done()
```

---

## 🌳 Проект 2. Фрактальное дерево

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
t.pencolor("brown")
t.pensize(3)

branch(t, 120, 7)
turtle.done()
```

---

## 🎨 Проект 3. Мандала (пользователь вводит параметры)

```python
import turtle

screen = turtle.Screen()
sides = int(screen.numinput("Мандала", "Сколько лучей (3–24)?", default=12))
size = int(screen.numinput("Мандала", "Длина луча:", default=80))

t = turtle.Turtle()
t.speed(0)

for i in range(36):
    for _ in range(sides):
        t.forward(size)
        t.left(360 / sides)
    t.left(10)

turtle.done()
```

---

## 🏠 Проект 4. Домик с солнцем и деревом

```python
import turtle

t = turtle.Turtle()
t.speed(5)

# Солнце
t.penup()
t.goto(150, 150)
t.pendown()
t.color("gold")
t.begin_fill()
t.circle(30)
t.end_fill()
t.color("black")

# Дом
t.penup()
t.goto(-100, -50)
t.pendown()
t.color("black", "lightyellow")
t.begin_fill()
for _ in range(4):
    t.forward(150)
    t.left(90)
t.end_fill()

# Крыша
t.penup()
t.goto(-100, 100)
t.pendown()
t.color("black", "brown")
t.begin_fill()
t.goto(-25, 170)
t.goto(50, 100)
t.goto(-100, 100)
t.end_fill()

# Трава
t.penup()
t.goto(-250, -50)
t.pendown()
t.color("green")
t.forward(500)

turtle.done()
```

---

## ❄️ Проект 5. Снежинка

```python
import turtle

t = turtle.Turtle()
t.speed(0)
t.color("blue")
t.pensize(2)

for _ in range(6):
    t.forward(100)
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

---

## 🐍 Проект 6. Змейка-«еда» (упрощённая)

Черепашка бегает за мышкой:

```python
import turtle

t = turtle.Turtle()
t.shape("turtle")
t.speed(1)
t.pencolor("green")

screen = turtle.Screen()

def follow(x, y):
    t.goto(x, y)

screen.onscreenclick(follow)
screen.mainloop()
```

Клик по экрану — черепашка идёт туда.

---

## 🌈 Проект 7. Радужная спираль

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

---

## 🏁 Проект 8. Флаг России

```python
import turtle

t = turtle.Turtle()
t.speed(0)
t.penup()
t.goto(-150, 100)
t.pendown()

colors = ["white", "blue", "red"]
for color in colors:
    t.fillcolor(color)
    t.begin_fill()
    for _ in range(2):
        t.forward(300)
        t.right(90)
        t.forward(50)
        t.right(90)
    t.end_fill()
    t.penup()
    t.goto(-150, t.ycor() - 50)
    t.pendown()

turtle.done()
```

---

## 🎯 Идеи для своих проектов

- **Домик** с окнами, дверью, трубой, дымом
- **Космос**: планеты, звёзды, ракета
- **Подводный мир**: рыбы, водоросли, пузыри
- **Снеговик**: 3 круга, глазки, нос-морковка
- **Геометрический узор**: круги/квадраты, повёрнутые на равный угол
- **Именной узор**: твои инициалы через turtle
- **Композиция**: всё вместе — дом, солнце, дерево, облака
- **Анимация**: движение по кругу, «погоня», падающий снег
- **Игра**: клик по цели (кругу), черепашка бежит к клику

---

## 📌 Что дальше после turtle?

- **`tkinter`** — оконные приложения: кнопки, поля, меню
- **`pygame`** — 2D-игры: платформеры, стрелялки
- **`PyQt5` / `Kivy`** — серьёзные GUI и мобильные приложения
- **`matplotlib`** — научные графики
- **`Pillow`** — генерация и обработка картинок

См. раздел [Библиотеки](../11-pyqt5/index.md).

---

## 🔗 Что дальше

→ [PyQt5](../11-pyqt5/index.md) — оконные приложения.