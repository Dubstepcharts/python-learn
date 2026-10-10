# Проект по шагам: Телеграм-бот викторины

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [aiogram](../24-telegram/aiogram.md), [JSON](../09-stdlib/json.md).

Время: **1–2 урока**.

---

## 🎯 Что делаем

Бот, который:
- Задаёт вопросы по одному
- Показывает кнопки с вариантами
- Считает правильные ответы
- В конце показывает результат

---

## 📌 Шаг 1. Получаем токен

1. Откройте Telegram, найдите **@BotFather**
2. `/newbot` → задайте имя и username
3. Скопируйте токен

Создайте файл `.env`:

```
BOT_TOKEN=ваш_токен
```

И `.gitignore`:

```
.env
__pycache__/
*.pyc
```

---

## 📌 Шаг 2. Устанавливаем зависимости

```bash
pip install aiogram python-dotenv
```

Создайте `requirements.txt`:

```
aiogram>=3.0
python-dotenv
```

---

## 📌 Шаг 3. Вопросы в JSON

Создайте `questions.json`:

```json
[
    {
        "question": "Сколько будет 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correct": 1
    },
    {
        "question": "Какой язык мы учим?",
        "options": ["Java", "Python", "C++", "Ruby"],
        "correct": 1
    },
    {
        "question": "Сколько дней в неделе?",
        "options": ["5", "6", "7", "8"],
        "correct": 2
    },
    {
        "question": "Какой год сейчас?",
        "options": ["2020", "2023", "2024", "2025"],
        "correct": 2
    }
]
```

`correct` — **индекс** правильного варианта (0, 1, 2, ...).

---

## 📌 Шаг 4. Минимальный бот

Создайте `bot.py`:

```python
import asyncio
import json
import os
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message, CallbackQuery
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from dotenv import load_dotenv

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

QUESTIONS = json.loads(Path("questions.json").read_text(encoding="utf-8"))

class Quiz(StatesGroup):
    playing = State()

@dp.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        f"Привет, {message.from_user.first_name}!\n"
        "Напиши /quiz, чтобы начать викторину."
    )

@dp.message(Command("quiz"))
async def cmd_quiz(message: Message, state: FSMContext):
    await state.update_data(index=0, score=0)
    await state.set_state(Quiz.playing)
    await send_question(message, state)

async def send_question(message: Message, state: FSMContext):
    data = await state.get_data()
    idx = data["index"]
    q = QUESTIONS[idx]

    buttons = [
        [InlineKeyboardButton(text=opt, callback_data=f"ans:{i}")]
        for i, opt in enumerate(q["options"])
    ]
    kb = InlineKeyboardMarkup(inline_keyboard=buttons)

    await message.answer(
        f"Вопрос {idx + 1}/{len(QUESTIONS)}\n\n{q['question']}",
        reply_markup=kb,
    )

@dp.callback_query(F.data.startswith("ans:"), Quiz.playing)
async def handle_answer(callback: CallbackQuery, state: FSMContext):
    chosen = int(callback.data.split(":")[1])
    data = await state.get_data()
    idx = data["index"]
    q = QUESTIONS[idx]

    await callback.answer()

    if chosen == q["correct"]:
        data["score"] += 1
        result = "✅ Верно!"
    else:
        result = f"❌ Неверно. Правильный ответ: {q['options'][q['correct']]}"

    data["index"] += 1
    await state.update_data(**data)

    await callback.message.edit_reply_markup(reply_markup=None)
    await callback.message.answer(result)

    if data["index"] >= len(QUESTIONS):
        await finish(callback.message, state)
    else:
        await send_question(callback.message, state)

async def finish(message: Message, state: FSMContext):
    data = await state.get_data()
    score = data["score"]
    total = len(QUESTIONS)

    percent = score / total * 100
    if percent == 100:
        emoji = "🏆"
        verdict = "Идеально!"
    elif percent >= 75:
        emoji = "🎉"
        verdict = "Отлично!"
    elif percent >= 50:
        emoji = "👍"
        verdict = "Неплохо"
    else:
        emoji = "📚"
        verdict = "Стоит повторить"

    await message.answer(
        f"{emoji} Викторина окончена!\n\n"
        f"Правильных ответов: {score} из {total}\n"
        f"Результат: {percent:.0f}%\n"
        f"{verdict}"
    )
    await state.clear()

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 📌 Шаг 5. Запускаем

```bash
python bot.py
```

Откройте бота в Telegram:
- `/start` — приветствие
- `/quiz` — викторина

Проходите вопросы, нажимая кнопки.

---

## 📌 Шаг 6. Улучшения

### Перемешивать вопросы

```python
import random

@dp.message(Command("quiz"))
async def cmd_quiz(message: Message, state: FSMContext):
    shuffled = random.sample(QUESTIONS, len(QUESTIONS))
    await state.update_data(index=0, score=0, questions=shuffled)
    await state.set_state(Quiz.playing)
    await send_question(message, state)
```

И далее брать вопросы из `data["questions"]` вместо `QUESTIONS`.

### Ограничить попытки

Добавьте `attempts` в состояние, разрешите ошибиться только 3 раза.

### Сохранять статистику

Заведите SQLite:

```python
import sqlite3

def init_db():
    conn = sqlite3.connect("quiz.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS results (
            user_id INTEGER,
            score INTEGER,
            total INTEGER,
            played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
```

В `finish` — сохраняйте результат. В `/stats` — показывайте историю.

### Кнопка «Ещё раз»

В `finish` добавьте:

```python
kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="🔄 Ещё раз", callback_data="restart")]
])

@dp.callback_query(F.data == "restart")
async def restart(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_reply_markup(reply_markup=None)
    await cmd_quiz(callback.message, state)
```

### Таймер на вопрос

Используйте `asyncio.create_task` с `asyncio.sleep(15)` — если пользователь
не ответил, переходите к следующему.

---

## 📌 Шаг 7. Публикация

Чтобы бот работал **не на вашем компьютере**, а всегда:

1. **VPS**: арендуйте сервер (Timeweb, Beget, Hetzner) — от 200 руб/мес
2. Скопируйте проект через `scp` или Git
3. Установите зависимости: `pip install -r requirements.txt`
4. Настройте **systemd-сервис**:

**`/etc/systemd/system/quizbot.service`:**
```ini
[Unit]
Description=Quiz Telegram Bot
After=network.target

[Service]
Type=simple
User=botuser
WorkingDirectory=/home/botuser/quizbot
ExecStart=/home/botuser/quizbot/.venv/bin/python bot.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable quizbot
sudo systemctl start quizbot
sudo systemctl status quizbot
```

Бот будет перезапускаться после падений и при перезагрузке сервера.

Альтернатива — **Fly.io** с Docker (см. [DevOps](../31-devops/docker.md)).

---

## ⚠️ Возможные проблемы

!!! warning "Токен не найден"
    Проверьте `.env` рядом с `bot.py` и что вызван `load_dotenv()`.

!!! warning "Кнопки не работают"
    Убедитесь, что используете `InlineKeyboardButton` (а не Reply) и
    обрабатываете `callback_query`, а не `message`.

!!! warning "Два polling"
    Если запустили бота дважды — сообщения будут «прыгать». Убедитесь,
    что запущен только один процесс.

!!! warning "Забыли `await callback.answer()`"
    Кнопка «крутится» и через 15 секунд выдаёт ошибку.

---

## 🎯 Что дальше

Попробуйте:
- Добавить категории вопросов (`/quiz math`, `/quiz history`)
- Рейтинг пользователей
- Работа с фотографиями-вопросами
- Хранение в Redis вместо FSM в памяти

---

## 🔗 Что дальше

→ [Погодный CLI](weather-cli.md).