# aiogram — подробно

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [asyncio](../26-asyncio/index.md), [JSON](../09-stdlib/json.md).

---

## 🚀 Установка

```bash
pip install aiogram
```

Версия 3.x — современная, полностью асинхронная.

---

## 📌 Минимальный бот

```python
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.filters import Command

BOT_TOKEN = "ВСТАВЬТЕ_ТОКЕН"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message):
    await message.answer("Привет!")

@dp.message(Command("help"))
async def help_cmd(message):
    await message.answer("Я умею: /start, /help, /time")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 📌 Обработчики

**Обработчик (handler)** — функция, которая срабатывает на сообщение.

```python
@dp.message(Command("start"))
async def cmd_start(message): ...

@dp.message(Command("help"))
async def cmd_help(message): ...

@dp.message(lambda m: m.text == "Привет")
async def hello(message): ...

@dp.message(lambda m: m.text and m.text.startswith("!"))
async def exclaim(message): ...

@dp.message()      # ловит всё остальное
async def echo(message): ...
```

**Порядок важен:** aiogram идёт сверху вниз и берёт первый подходящий.

---

## 📌 Ответы

```python
await message.answer("Текст")                       # ответ в чат
await message.reply("Текст")                        # ответ на конкретное сообщение
await message.answer("Жирный", parse_mode="HTML")
await message.answer_photo("URL_или_file_id")
await message.answer_document(open("file.pdf", "rb"))
await message.answer_location(latitude=55.75, longitude=37.62)
await message.answer_voice(open("voice.ogg", "rb"))
```

### Форматирование

**MarkdownV2:**

```python
await message.answer(
    "*жирный* _курсив_ `код`",
    parse_mode="MarkdownV2"
)
```

**HTML** (проще):

```python
await message.answer(
    "<b>жирный</b> <i>курсив</i> <code>код</code> <a href='https://ya.ru'>ссылка</a>",
    parse_mode="HTML"
)
```

---

## 📌 Клавиатуры

### Reply — снизу экрана

```python
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

kb = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Привет"), KeyboardButton(text="Пока")],
        [KeyboardButton(text="Меню")],
    ],
    resize_keyboard=True,
    one_time_keyboard=False,
)

await message.answer("Выберите:", reply_markup=kb)
```

Убрать:

```python
from aiogram.types import ReplyKeyboardRemove
await message.answer("Ок", reply_markup=ReplyKeyboardRemove())
```

### Inline — под сообщением

```python
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

builder = InlineKeyboardBuilder()
builder.button(text="Сайт", url="https://ya.ru")
builder.button(text="Кнопка 1", callback_data="btn1")
builder.button(text="Кнопка 2", callback_data="btn2")
builder.adjust(1)      # по 1 в ряд

await message.answer("Кнопки:", reply_markup=builder.as_markup())
```

Обработка нажатий:

```python
from aiogram import F

@dp.callback_query(F.data == "btn1")
async def on_btn1(callback):
    await callback.answer("Вы нажали кнопку 1")
    await callback.message.answer("Действие выполнено")
```

`callback.answer()` — подтвердить нажатие (иначе кнопка «крутится»).

---

## 📌 Состояния (FSM)

**FSM** (Finite State Machine) — «диалог по шагам». Например, при
регистрации: спросить имя → возраст → город.

```python
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext

class Form(StatesGroup):
    name = State()
    age = State()
    city = State()

@dp.message(Command("register"))
async def start_form(message, state: FSMContext):
    await message.answer("Как тебя зовут?")
    await state.set_state(Form.name)

@dp.message(Form.name)
async def process_name(message, state: FSMContext):
    await state.update_data(name=message.text)
    await message.answer("Сколько тебе лет?")
    await state.set_state(Form.age)

@dp.message(Form.age)
async def process_age(message, state: FSMContext):
    await state.update_data(age=message.text)
    await message.answer("Из какого ты города?")
    await state.set_state(Form.city)

@dp.message(Form.city)
async def process_city(message, state: FSMContext):
    await state.update_data(city=message.text)
    data = await state.get_data()
    await message.answer(
        f"Готово!\n"
        f"Имя: {data['name']}\n"
        f"Возраст: {data['age']}\n"
        f"Город: {data['city']}"
    )
    await state.clear()
```

Состояния хранятся в памяти (по умолчанию). Для продакшена — Redis.

---

## 📌 Отправка сообщений не в ответ

```python
from aiogram import Bot

await bot.send_message(chat_id=123456789, text="Привет!")
```

`chat_id` можно узнать из `message.chat.id`.

---

## 📌 Работа с медиа

```python
# Фото
await message.answer_photo("https://example.com/image.jpg")
await message.answer_photo(open("local.jpg", "rb"))

# Получить фото от пользователя
photo = message.photo[-1]              # последняя = наибольшая
file = await bot.get_file(photo.file_id)
await bot.download_file(file.file_path, "downloaded.jpg")

# Документ
await message.answer_document(open("report.pdf", "rb"))

# Голосовое
await message.answer_voice(open("voice.ogg", "rb"))
```

---

## 📌 Middlewares, фильтры, роутеры

### Свой фильтр

```python
from aiogram.filters import BaseFilter

class IsAdmin(BaseFilter):
    async def __call__(self, message) -> bool:
        return message.from_user.id in [123, 456]

@dp.message(Command("admin"), IsAdmin())
async def admin_panel(message): ...
```

### Роутеры для организации

```python
from aiogram import Router

router = Router()

@router.message(Command("start"))
async def start(message): ...

# В главном
dp.include_router(router)
```

Удобно разделять код: `handlers/`, `keyboards/`, `states/`.

---

## 💡 Полный пример — викторина

```python
import asyncio
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

BOT_TOKEN = "ВСТАВЬТЕ_ТОКЕН"
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

QUESTIONS = [
    {
        "q": "Сколько будет 2 + 2?",
        "options": ["3", "4", "5"],
        "correct": 1,
    },
    {
        "q": "Какой язык мы учим?",
        "options": ["Python", "Java", "C++"],
        "correct": 0,
    },
    {
        "q": "Сколько дней в неделе?",
        "options": ["5", "6", "7"],
        "correct": 2,
    },
]

class Quiz(StatesGroup):
    in_progress = State()

@dp.message(Command("start"))
async def start(message):
    await message.answer(
        "Привет! Я бот-викторина.\n"
        "Напиши /quiz, чтобы начать."
    )

@dp.message(Command("quiz"))
async def quiz_start(message, state: FSMContext):
    await state.update_data(q_idx=0, score=0)
    await state.set_state(Quiz.in_progress)
    await send_question(message, state)

async def send_question(message, state: FSMContext):
    data = await state.get_data()
    idx = data["q_idx"]
    q = QUESTIONS[idx]

    builder = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=f"{i}. {opt}", callback_data=f"ans_{i}")]
        for i, opt in enumerate(q["options"])
    ])

    await message.answer(f"Вопрос {idx + 1}/{len(QUESTIONS)}\n\n{q['q']}",
                        reply_markup=builder)

@dp.callback_query(F.data.startswith("ans_"))
async def check_answer(callback, state: FSMContext):
    data = await state.get_data()
    idx = data["q_idx"]
    chosen = int(callback.data.split("_")[1])

    q = QUESTIONS[idx]
    if chosen == q["correct"]:
        data["score"] += 1

    data["q_idx"] += 1
    await state.update_data(**data)
    await callback.answer()

    if data["q_idx"] >= len(QUESTIONS):
        await callback.message.answer(
            f"Викторина окончена!\n"
            f"Правильных ответов: {data['score']}/{len(QUESTIONS)}"
        )
        await state.clear()
    else:
        await send_question(callback.message, state)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `await`"
    Все методы aiogram — асинхронные. Без `await` — ошибка или «ничего не работает».

!!! warning "Токен в Git"
    Используйте `.env` + `python-dotenv`:
    ```python
    from dotenv import load_dotenv
    import os
    load_dotenv()
    BOT_TOKEN = os.getenv("BOT_TOKEN")
    ```

!!! warning "Два polling одновременно"
    Нельзя запустить один и тот же токен на двух машинах — сообщения
    будут «прыгать». Для продакшена — webhook.

!!! warning "Долгие операции блокируют"
    Всё внутри `async def` блокирует цикл, пока не завершится.
    Долгие задачи — в `asyncio.create_task` или `to_thread`.

!!! warning "Обработчик в неправильном порядке"
    `@dp.message()` без фильтра ловит **всё** — ставьте его последним.

---

## 🧪 Упражнения

1. ⭐ Бот с командами `/start`, `/help`, `/time`.
2. ⭐ Бот-эхо.
3. ⭐⭐ Reply-клавиатура с 4 кнопками.
4. ⭐⭐ Inline-кнопки, при нажатии — разные ответы.
5. ⭐⭐ Загрузка фото от пользователя.
6. ⭐⭐⭐ Викторина из 5 вопросов (см. пример).
7. ⭐⭐⭐ Бот-заметки с сохранением в SQLite.

---

## 🔗 Что дальше

→ [pytest](../25-pytest/index.md) — тестирование.