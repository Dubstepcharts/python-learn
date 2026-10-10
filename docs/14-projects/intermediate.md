# Проекты среднего уровня

Для тех, кто прошёл **функции**, **коллекции**, **файлы** и начинает **ООП**.

---

## 📇 Проект 1. Телефонная книга

**Что делает:** хранит контакты в JSON, добавляет/ищет/удаляет.

```python
import json
from pathlib import Path

FILE = Path("contacts.json")

def load():
    if FILE.exists():
        return json.loads(FILE.read_text(encoding="utf-8"))
    return []

def save(contacts):
    FILE.write_text(json.dumps(contacts, ensure_ascii=False, indent=2), encoding="utf-8")

def find(contacts, name):
    return [c for c in contacts if name.lower() in c["name"].lower()]

def main():
    contacts = load()

    while True:
        cmd = input("\n[l]ist [a]dd [f]ind [d]elete [q]uit: ").lower()

        if cmd == "l":
            for c in contacts:
                print(f'{c["name"]}: {c["phone"]}')
        elif cmd == "a":
            contacts.append({
                "name": input("Имя: "),
                "phone": input("Телефон: "),
            })
            save(contacts)
        elif cmd == "f":
            for c in find(contacts, input("Кого искать: ")):
                print(c)
        elif cmd == "d":
            name = input("Имя: ")
            contacts = [c for c in contacts if c["name"] != name]
            save(contacts)
        elif cmd == "q":
            break

if __name__ == "__main__":
    main()
```

---

## 💰 Проект 2. Трекер расходов

**Что делает:** записывает траты, показывает статистику.

```python
import json
from pathlib import Path
from datetime import date
from collections import Counter, defaultdict

FILE = Path("expenses.json")

def load():
    return json.loads(FILE.read_text(encoding="utf-8")) if FILE.exists() else []

def save(items):
    FILE.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")

def add(items):
    items.append({
        "date": str(date.today()),
        "category": input("Категория: "),
        "amount": float(input("Сумма: ")),
    })

def stats(items):
    total = sum(i["amount"] for i in items)
    print(f"\nВсего: {total:.2f} руб.")

    by_cat = defaultdict(float)
    for i in items:
        by_cat[i["category"]] += i["amount"]

    for cat, s in sorted(by_cat.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {s:.2f}")

def main():
    items = load()
    while True:
        cmd = input("\n[a]dd [s]tats [q]uit: ").lower()
        if cmd == "a":
            add(items); save(items)
        elif cmd == "s":
            stats(items)
        elif cmd == "q":
            break

main()
```

---

## 🎓 Проект 3. Класс `Student` и электронный журнал

```python
from dataclasses import dataclass, field
from statistics import mean

@dataclass
class Student:
    name: str
    grades: list[int] = field(default_factory=list)

    def add_grade(self, g):
        if not 1 <= g <= 5:
            raise ValueError("Оценка от 1 до 5")
        self.grades.append(g)

    @property
    def average(self):
        return mean(self.grades) if self.grades else 0

    def __str__(self):
        return f"{self.name}: {self.grades} (ср. {self.average:.2f})"


class Journal:
    def __init__(self):
        self.students = {}

    def add(self, name):
        self.students[name] = Student(name)

    def grade(self, name, g):
        self.students[name].add_grade(g)

    def show(self):
        for s in self.students.values():
            print(s)

    def top(self, n=3):
        sorted_s = sorted(self.students.values(), key=lambda s: -s.average)
        return sorted_s[:n]


j = Journal()
j.add("Аня")
j.add("Борис")
j.grade("Аня", 5)
j.grade("Аня", 4)
j.grade("Борис", 3)
j.show()
```

**Что добавить:** сохранение в JSON, экспорт в CSV, аналитика по предметам.

---

## 🎮 Проект 4. Крестики-нолики с ИИ

Игрок против компьютера. Компьютер блокирует победные ходы игрока.

```python
def print_board(b):
    for row in b:
        print(" | ".join(row))
        print("-" * 9)

def winner(b):
    lines = b + [list(x) for x in zip(*b)]
    lines.append([b[0][0], b[1][1], b[2][2]])
    lines.append([b[0][2], b[1][1], b[2][0]])

    for line in lines:
        if line[0] != " " and line.count(line[0]) == 3:
            return line[0]
    if all(c != " " for row in b for c in row):
        return "draw"
    return None

def ai_move(b):
    import random

    # Проверить свои победные ходы
    for i in range(3):
        for j in range(3):
            if b[i][j] == " ":
                b[i][j] = "O"
                if winner(b) == "O":
                    return
                b[i][j] = " "

    # Заблокировать игрока
    for i in range(3):
        for j in range(3):
            if b[i][j] == " ":
                b[i][j] = "X"
                if winner(b) == "X":
                    b[i][j] = "O"
                    return
                b[i][j] = " "

    # Случайный ход
    empty = [(i, j) for i in range(3) for j in range(3) if b[i][j] == " "]
    i, j = random.choice(empty)
    b[i][j] = "O"

board = [[" "]*3 for _ in range(3)]
turn = "X"

while not winner(board):
    print_board(board)
    if turn == "X":
        i, j = map(int, input("Ход (строка столбец): ").split())
        if board[i][j] != " ":
            print("Занято")
            continue
        board[i][j] = "X"
    else:
        ai_move(board)
    turn = "O" if turn == "X" else "X"

print_board(board)
w = winner(board)
print("Ничья" if w == "draw" else f"Победил {w}")
```

---

## 📊 Проект 5. Анализ текста

**Что делает:** считает слова, строит топ частых, выводит статистику.

```python
import re
from collections import Counter
from pathlib import Path

def analyze(path):
    text = Path(path).read_text(encoding="utf-8")
    words = re.findall(r"\b[а-яёa-z]+\b", text.lower())

    counter = Counter(words)

    print(f"Всего слов: {len(words)}")
    print(f"Уникальных: {len(counter)}")
    print("\nТоп-10:")
    for word, count in counter.most_common(10):
        print(f"  {word}: {count}")

    # Длина предложений
    sentences = re.split(r"[.!?]+", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    avg = sum(len(s.split()) for s in sentences) / len(sentences)
    print(f"\nСредняя длина предложения: {avg:.1f} слов")

analyze("text.txt")
```

---

## 🎯 Идеи ещё

- **Погодный парсер** — `requests` + `json` (см. продвинутый)
- **Генератор паролей** — с настройками длины и символов
- **Заметки с датой** — журнал с временем
- **Викторина** — вопросы в JSON, подсчёт очков
- **Пиццерия** — меню, заказ, расчёт стоимости
- **Календарь** — на месяц, с задачами по дням

---

## 🔗 Что дальше

→ [Продвинутый уровень](advanced.md).