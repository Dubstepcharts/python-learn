# Turtle: основы

!!! abstract "Уровень: ⭐ Начальный"
    Подойдёт для 5–7 класса (и младше). Нужно знать: [цикл for](../02-control-flow/for.md) — необязательно, но полезно.

---

## 🍎 Объясняем просто

!!! example "Черепашка на листе бумаги"
    Представь лист бумаги, на нём — маленькая черепашка с ручкой.
    Говоришь ей: **«Иди вперёд 100 шагов»** — она идёт и оставляет след.
    **«Поверни направо на 90°»** — поворачивается, не рисуя.
    **«Опусти ручку / подними ручку»** — рисовать или идти «вхолостую».

    Всё. Из этих команд строятся любые картинки.

---

## 🚀 Первый запуск

Создайте файл `turtle_test.py`:

```python
import turtle

t = turtle.Turtle()      # создаём черепашку
t.forward(100)           # вперёд на 100 шагов
t.left(90)               # повернуть налево на 90°
t.forward(100)
t.left(90)
t.forward(100)
t.left(90)
t.forward(100)

turtle.done()            # не закрывать окно после рисования
```

Запустите: `python turtle_test.py`. Откроется окно, и черепашка нарисует квадрат.

!!! warning "Всегда завершайте программу `turtle.done()`"
    Без этой команды окно может закрыться сразу или «зависнуть».
    `turtle.done()` говорит: «рисунок готов, ждём закрытия».

---

## 🐢 Команды движения

| Команда | Что делает |
|---|---|
| `t.forward(d)` / `t.fd(d)` | Вперёд на d пикселей |
| `t.backward(d)` / `t.bk(d)` / `t.back(d)` | Назад на d |
| `t.right(angle)` / `t.rt(angle)` | Повернуть направо |
| `t.left(angle)` / `t.lt(angle)` | Повернуть налево |
| `t.goto(x, y)` | Перейти в точку |
| `t.setx(x)` | Изменить только X |
| `t.sety(y)` | Изменить только Y |
| `t.setheading(a)` / `t.seth(a)` | Задать угол (0 = вправо) |
| `t.home()` | Вернуться в центр, развернуться вправо |
| `t.circle(r, extent=None, steps=None)` | Нарисовать круг/дугу |
| `t.dot(size, color)` | Поставить точку |
| `t.stamp()` | Оставить «отпечаток» черепашки |

```python
import turtle
t = turtle.Turtle()

t.forward(100)
t.right(90)
t.forward(50)
t.circle(30)
t.dot(10, "red")
t.goto(0, 0)
t.home()

turtle.done()
```

### Углы

- `0°` — вправо (по умолчанию)
- `90°` — вверх
- `180°` — влево
- `270°` — вниз

`t.setheading(90)` — «смотреть вверх».

---

## 🖊️ Команды пера

| Команда | Что делает |
|---|---|
| `t.penup()` / `t.pu()` / `t.up()` | Поднять перо (не рисовать) |
| `t.pendown()` / `t.pd()` / `t.down()` | Опустить перо (рисовать) |
| `t.pensize(w)` / `t.width(w)` | Толщина линии |
| `t.pencolor("red")` | Цвет линии |
| `t.pen(...)` | Задать сразу всё: `pen(pencolor="red", pensize=3)` |
| `t.isdown()` | Опущено ли перо? |
| `t.speed(0..10)` | Скорость: 1 — медленно, 10 — быстро, 0 — мгновенно |
| `t.showturtle()` | Показать черепашку |
| `t.hideturtle()` | Скрыть черепашку |
| `t.isvisible()` | Видима ли черепашка? |
| `t.shape("turtle")` | Форма: `arrow`, `turtle`, `circle`, `square`, `triangle`, `classic` |
| `t.shapesize(s)` | Размер черепашки |

```python
import turtle
t = turtle.Turtle()

t.pensize(5)
t.pencolor("blue")
t.speed(3)
t.shape("turtle")

t.forward(100)
t.right(90)
t.penup()
t.forward(50)
t.pendown()
t.forward(100)

turtle.done()
```

---

## 📍 Получение позиции и угла

| Команда | Возвращает |
|---|---|
| `t.position()` / `t.pos()` | (x, y) |
| `t.xcor()` | x |
| `t.ycor()` | y |
| `t.heading()` | угол |
| `t.towards(x, y)` | угол к точке |
| `t.distance(x, y)` | расстояние до точки |

```python
t.forward(100)
print(t.xcor(), t.ycor())      # 100.0 0.0
print(t.heading())             # 0.0
```

---

## 🧹 Очистка

| Команда | Что делает |
|---|---|
| `t.clear()` | Стереть рисунок, оставить черепашку |
| `t.reset()` | Стереть всё, вернуть черепашку в центр |
| `t.undo()` | Отменить последнее действие |
| `t.clearstamps()` | Убрать все «отпечатки» |
| `t.clearstamp(n)` | Убрать конкретный |

---

## 🎨 Сцена (Screen)

Часто настраивают не черепашку, а **сцену**:

```python
screen = turtle.Screen()
screen.title("Моё окно")
screen.bgcolor("lightyellow")
screen.setup(width=600, height=400)
screen.screensize(800, 600)

t = turtle.Turtle()
t.forward(100)

screen.mainloop()        # или turtle.done()
```

| Команда Screen | Что делает |
|---|---|
| `title(s)` | Заголовок окна |
| `bgcolor(c)` | Цвет фона |
| `bgpic(path)` | Картинка-фон |
| `setup(w, h, x, y)` | Размер и позиция окна |
| `screensize(w, h)` | Размер «полотна» |
| `colormode(255)` | Цвета в 0..255 |
| `tracer(n)` | Обновлять экран каждые n шагов |
| `update()` | Принудительно обновить |
| `mainloop()` | Запустить цикл событий |
| `exitonclick()` | Закрыть по клику |
| `bye()` | Закрыть окно |

---

## 🎮 Реакция на действия

Простые интерактивные команды:

| Команда | Что делает |
|---|---|
| `screen.onclick(func)` | Клик — вызвать func(x, y) |
| `screen.onkey(func, "space")` | Нажатие клавиши |
| `screen.onkeypress(func, key)` | То же |
| `screen.listen()` | Включить «слушание» клавиатуры |
| `screen.onscreenclick(func)` | То же, что `onclick` |
| `screen.ontimer(func, ms)` | Через ms мс вызвать func |
| `screen.textinput(title, prompt)` | Диалог ввода текста |
| `screen.numinput(title, prompt)` | Диалог ввода числа |

Пример: черепашка идёт вперёд по пробелу.

```python
import turtle

t = turtle.Turtle()
screen = turtle.Screen()

def go():
    t.forward(20)

def turn_left():
    t.left(45)

screen.listen()
screen.onkey(go, "space")
screen.onkey(turn_left, "Left")

screen.mainloop()
```

---

## 💡 Примеры

### Пример 1. Квадрат (без цикла) 🟦

```python
import turtle
t = turtle.Turtle()

for _ in range(4):
    t.forward(100)
    t.left(90)

turtle.done()
```

### Пример 2. Лестница 🪜

```python
import turtle
t = turtle.Turtle()

for i in range(5):
    t.forward(30)
    t.left(90)
    t.forward(30)
    t.right(90)

turtle.done()
```

### Пример 3. Сюжетный — домик 🏠

```python
import turtle
t = turtle.Turtle()
t.speed(5)

# Стены
for _ in range(4):
    t.forward(100)
    t.left(90)

# Крыша
t.left(45)
t.forward(70)
t.right(90)
t.forward(70)

turtle.done()
```

### Пример 4. Сюжетный — пунктирная линия ⚡

```python
import turtle
t = turtle.Turtle()

for _ in range(10):
    t.forward(10)
    t.penup()
    t.forward(10)
    t.pendown()

turtle.done()
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Забыли `turtle.done()`"
    Окно может мигнуть и закрыться.

!!! warning "Ошибка 2. Много черепашек"
    ```python
    t = turtle.Turtle()
    t2 = turtle.Turtle()   # вторая черепашка
    ```
    Если нужна одна — не создавайте лишних.

!!! warning "Ошибка 3. Крутая скорость + много шагов"
    `t.speed(0)` ускоряет рисование, но результат может быть не виден,
    если черепашка сразу улетает за экран.

!!! warning "Ошибка 4. `t.done()` вместо `turtle.done()`"
    `done` — функция **модуля**, не черепашки. Пишите `turtle.done()`.

!!! warning "Ошибка 5. Забыли импортировать"
    ```python
    import turtle    # в начале всегда
    ```

---

## 🧪 Упражнения

1. ⭐ Нарисуйте линию длиной 200.
2. ⭐ Нарисуйте букву «Г» (вниз на 100, вправо на 80).
3. ⭐ Квадрат через цикл `for`.
4. ⭐⭐ Пунктирная линия из 10 отрезков.
5. ⭐⭐ Нарисуйте цифру «7» (одна горизонтальная и одна диагональная линия).
6. ⭐⭐⭐ Снежинка: 6 лучей по 100 пикселей с поворотом на 60°.
7. ⭐⭐⭐ Черепашка идёт вперёд по нажатию пробела, поворачивает стрелками.

---

## 🔗 Что дальше

→ [Фигуры](shapes.md) — треугольники, круги, многоугольники.