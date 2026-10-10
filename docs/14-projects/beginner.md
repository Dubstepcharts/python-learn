# Проекты для начинающих

Подойдут после разделов «Основы» и «Управление потоком». Ничего кроме
переменных, условий, циклов, строк и списков не нужно.

---

## 🎲 Проект 1. Угадай число

**Что делает:** компьютер загадывает число от 1 до 100, пользователь угадывает, получает подсказки.

```python
import random

secret = random.randint(1, 100)
tries = 0

print("Я загадал число от 1 до 100. Угадай!")

while True:
    guess = int(input("Твоя догадка: "))
    tries += 1

    if guess < secret:
        print("Больше!")
    elif guess > secret:
        print("Меньше!")
    else:
        print(f"Точно! Угадал за {tries} попыток.")
        break
```

**Что можно добавить:** ограничение попыток, уровни сложности, «горячо/холодно».

---

## ✊ Проект 2. Камень-ножницы-бумага

**Что делает:** игра с компьютером до трёх побед.

```python
import random

choices = ["камень", "ножницы", "бумага"]
beats = {"камень": "ножницы", "ножницы": "бумага", "бумага": "камень"}

my_score = 0
cpu_score = 0

while my_score < 3 and cpu_score < 3:
    my = input("Твой ход (камень/ножницы/бумага): ").lower()
    if my not in choices:
        print("Неверный ход")
        continue

    cpu = random.choice(choices)
    print(f"Компьютер: {cpu}")

    if my == cpu:
        print("Ничья")
    elif beats[my] == cpu:
        my_score += 1
        print("Ты выиграл раунд!")
    else:
        cpu_score += 1
        print("Компьютер выиграл раунд")

    print(f"Счёт: {my_score} : {cpu_score}")

print("Победа!" if my_score == 3 else "Компьютер победил")
```

**Что добавить:** счёт по времени, выбор до 5 побед, «ящерица-Спок».

---

## 🧮 Проект 3. Простой калькулятор

```python
print("Простой калькулятор. Введите 'q' для выхода.")

while True:
    expr = input("Выражение (например, 5 + 3): ")
    if expr.lower() == "q":
        break

    parts = expr.split()
    if len(parts) != 3:
        print("Формат: число операция число")
        continue

    try:
        a = float(parts[0])
        op = parts[1]
        b = float(parts[2])
    except ValueError:
        print("Нужны числа")
        continue

    if op == "+":
        print(a + b)
    elif op == "-":
        print(a - b)
    elif op == "*":
        print(a * b)
    elif op == "/":
        print(a / b if b else "На ноль делить нельзя")
    else:
        print("Неизвестная операция")
```

---

## 📝 Проект 4. Список дел (to-do)

**Что делает:** добавляет, показывает, удаляет задачи. Сохраняет в файл.

```python
FILE = "todo.txt"

def load():
    try:
        with open(FILE, encoding="utf-8") as f:
            return [line.rstrip() for line in f]
    except FileNotFoundError:
        return []

def save(tasks):
    with open(FILE, "w", encoding="utf-8") as f:
        for t in tasks:
            f.write(t + "\n")

tasks = load()

while True:
    print("\n1. Показать\n2. Добавить\n3. Удалить\n4. Выход")
    cmd = input("Действие: ")

    if cmd == "1":
        for i, t in enumerate(tasks, 1):
            print(f"{i}. {t}")
    elif cmd == "2":
        tasks.append(input("Задача: "))
        save(tasks)
    elif cmd == "3":
        n = int(input("Номер задачи: "))
        if 0 < n <= len(tasks):
            tasks.pop(n - 1)
            save(tasks)
    elif cmd == "4":
        break
```

**Что добавить:** метки «сделано», даты, приоритеты, экспорт в CSV.

---

## 🔤 Проект 5. Анаграммы

**Что делает:** перемешивает слово, пользователь угадывает.

```python
import random

words = ["программирование", "школа", "компьютер", "алгоритм"]
word = random.choice(words)

scrambled = list(word)
random.shuffle(scrambled)
scrambled = "".join(scrambled)

print(f"Угадай слово из букв: {scrambled}")
attempts = 0

while True:
    guess = input("Твоё слово: ").lower()
    attempts += 1

    if guess == word:
        print(f"Верно! За {attempts} попыток.")
        break
    else:
        print("Не угадал")
```

---

## 🎨 Проект 6. Рисование в turtle

**Что делает:** рисует красивый узор или картинку.

```python
import turtle

t = turtle.Turtle()
t.speed(0)

colors = ["red", "orange", "yellow", "green", "blue", "purple"]

for i in range(180):
    t.pencolor(colors[i % len(colors)])
    t.forward(i)
    t.right(60)

turtle.done()
```

**Что добавить:** пользователь вводит количество лучей, цвет, размер.

---

## 🎯 Идеи ещё

- **Виселица** — угадай слово по буквам
- **Считалка слов** — сколько раз встречается каждое слово в тексте
- **Переводчик «сленга»** — заменяет слова по словарю
- **Крестики-нолики** — на списке 3×3
- **Симулятор банкомата** — баланс, снятие, пополнение (без ООП)
- **Ёлочка из символов** — циклы в консоли

---

## 🔗 Что дальше

→ [Средний уровень](intermediate.md).