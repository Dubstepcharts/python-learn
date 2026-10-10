# FastAPI

!!! abstract "Уровень: ⭐⭐ Средний → ⭐⭐⭐"
    Нужно знать: [функции](../05-functions/index.md), [JSON](../09-stdlib/json.md).

---

## 🍎 Объясняем просто

!!! example "FastAPI — быстрые API с документацией из коробки"
    ```python
    from fastapi import FastAPI

    app = FastAPI()

    @app.get("/")
    def hello():
        return {"message": "Привет!"}
    ```
    
    Запусти — и у тебя:
    - работающее API
    - **автоматическая документация** на `/docs`
    - проверка типов через аннотации

---

## 🚀 Установка

```bash
pip install fastapi uvicorn
```

`uvicorn` — веб-сервер, на котором работает FastAPI.

---

## ✍️ Минимальное API

**`main.py`:**
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Привет, мир!"}
```

Запуск:
```bash
uvicorn main:app --reload
```

Откройте:
- **http://127.0.0.1:8000** — API
- **http://127.0.0.1:8000/docs** — Swagger-документация
- **http://127.0.0.1:8000/redoc** — альтернативная документация

---

## 📌 HTTP-методы

```python
@app.get("/items")      # Получить
@app.post("/items")     # Создать
@app.put("/items/1")    # Заменить
@app.patch("/items/1")  # Изменить частично
@app.delete("/items/1") # Удалить
```

---

## 📌 Параметры пути и запроса

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}

@app.get("/search")
def search(q: str, page: int = 1, limit: int = 10):
    return {"q": q, "page": page, "limit": limit}
```

**Аннотации типов** работают — FastAPI автоматически:
- преобразует `"123"` в `123`
- проверит диапазон (если указать)
- покажет в документации

---

## 📌 Pydantic — валидация данных

Для тела POST-запроса используется **Pydantic-модель**:

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str
    age: int = Field(ge=0, le=150)
    email: str | None = None

@app.post("/users")
def create_user(user: User):
    return {"id": 1, "user": user}
```

FastAPI:
- проверит, что `name` — строка, `age` — число в диапазоне
- вернёт **ошибку 422** с описанием, если что-то не так
- покажет модель в документации

Пример запроса:
```bash
curl -X POST "http://127.0.0.1:8000/users" \
     -H "Content-Type: application/json" \
     -d '{"name": "Аня", "age": 12}'
```

---

## 📌 Ответы и статусы

```python
from fastapi import HTTPException, status

@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Не найдено")
    return items[item_id]

@app.post("/items", status_code=201)
def create_item(item: Item):
    return item
```

---

## 📌 Асинхронность

Одно из главных преимуществ FastAPI — нативная поддержка `async`:

```python
@app.get("/slow")
async def slow():
    await asyncio.sleep(1)
    return {"message": "Готово"}
```

Во время `await` сервер обрабатывает другие запросы. Это **сильно**
ускоряет API, работающие с сетью (БД, HTTP-запросы).

---

## 📌 Разбиение на роутеры

Большое API удобно делить на файлы:

**`routers/users.py`:**
```python
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
def list_users():
    return [{"id": 1, "name": "Аня"}]

@router.get("/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}
```

**`main.py`:**
```python
from fastapi import FastAPI
from routers import users

app = FastAPI()
app.include_router(users.router)
```

---

## 📌 Полезные фичи

| Что | Как |
|---|---|
| Автодокументация | `/docs`, `/redoc` |
| Зависимости | `Depends(...)` |
| Middleware | `@app.middleware("http")` |
| CORS | `CORSMiddleware` |
| Фон-задачи | `BackgroundTasks` |
| WebSocket | `@app.websocket("/ws")` |
| Ограничение частоты | `slowapi` |
| Аутентификация | `fastapi.security` |

---

## 💡 Полный пример — TODO API

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="TODO API")

class Todo(BaseModel):
    id: int | None = None
    title: str
    done: bool = False

todos: list[Todo] = []
counter = 0

@app.get("/todos", response_model=list[Todo])
def list_todos():
    return todos

@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(todo: Todo):
    global counter
    counter += 1
    todo.id = counter
    todos.append(todo)
    return todo

@app.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    for t in todos:
        if t.id == todo_id:
            return t
    raise HTTPException(status_code=404, detail="Not found")

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    global todos
    todos = [t for t in todos if t.id != todo_id]

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated: Todo):
    for i, t in enumerate(todos):
        if t.id == todo_id:
            updated.id = todo_id
            todos[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Not found")
```

Запуск:
```bash
uvicorn main:app --reload
```

Откройте `/docs` — увидите **все** эндпоинты с возможностью протестировать
прямо в браузере.

---

## 📌 Сравнение Flask и FastAPI

| | Flask | FastAPI |
|---|---|---|
| Скорость | Средняя | Высокая (async) |
| Валидация | Вручную | Автоматически (Pydantic) |
| Документация | Вручную | **Автоматически** |
| Асинхронность | Ограниченно | Полноценная |
| Простота старта | ✅ Очень просто | Просто |
| Экосистема | Огромная | Растущая |

**Для новых API — FastAPI.** Для простых сайтов и прототипов — Flask.

---

## ⚠️ Частые ошибки

!!! warning "Забыли `--reload`"
    Без этого сервер не перезагрузится после изменений.

!!! warning "Порт занят"
    ```bash
    uvicorn main:app --port 8001
    ```

!!! warning "`async def` с блокирующим кодом"
    ```python
    @app.get("/")
    async def f():
        time.sleep(5)      # ❌ блокирует весь сервер!
    ```
    Используйте `await asyncio.sleep(...)` или обычный `def`.

!!! warning "Pydantic-модель и dict"
    ```python
    return {"id": user.id}     # ok
    return user                 # FastAPI сам сериализует
    ```
    Не пытайтесь вернуть объект, который Pydantic не знает.

---

## 🧪 Упражнения

1. ⭐ API «приветствие» с параметром имени.
2. ⭐ Калькулятор-эндпоинт: `GET /add?a=2&b=3`.
3. ⭐⭐ CRUD для списка книг.
4. ⭐⭐ Валидация через Pydantic: имя, возраст, email.
5. ⭐⭐ Разделите API на 2 роутера.
6. ⭐⭐⭐ Добавьте эндпоинт с `async` и `await asyncio.sleep`.

---

## 🔗 Что дальше

→ [Django](django.md) — большой фреймворк «всё в комплекте».