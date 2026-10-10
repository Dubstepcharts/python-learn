# Flask

!!! abstract "Уровень: ⭐⭐"
    Нужно знать: [функции](../05-functions/index.md), [модули](../07-modules/index.md).

---

## 🍎 Объясняем просто

!!! example "Flask — как микро-сайт в 5 строк"
    ```python
    from flask import Flask
    app = Flask(__name__)

    @app.route("/")
    def hello():
        return "Привет, мир!"

    app.run()
    ```
    
    Запусти — и на `http://127.0.0.1:5000` откроется твоя страница.

---

## 🚀 Установка

```bash
pip install flask
```

---

## ✍️ Минимальный сайт

**`app.py`:**
```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "<h1>Главная страница</h1><p>Добро пожаловать!</p>"

@app.route("/about")
def about():
    return "<h1>О нас</h1><p>Мы учим Python</p>"

if __name__ == "__main__":
    app.run(debug=True)
```

Запуск:
```bash
python app.py
```

Откройте **http://127.0.0.1:5000** — увидите главную.

---

## 📌 Маршруты

### Простые

```python
@app.route("/")
@app.route("/hello")
@app.route("/about")
```

### С параметрами

```python
@app.route("/user/<name>")
def user(name):
    return f"Привет, {name}!"

@app.route("/post/<int:id>")
def post(id):
    return f"Пост №{id}"
```

Типы: `int`, `float`, `string`, `path`, `uuid`.

### Методы

```python
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        ...
    return "..."
```

---

## 📌 Ответы

```python
from flask import render_template, jsonify, redirect, url_for

# Текст
return "Привет"

# HTML-файл из папки templates/
return render_template("index.html", name="Аня")

# JSON
return jsonify({"name": "Аня", "age": 12})

# Редирект
return redirect(url_for("index"))

# С кодом
return "Не найдено", 404
```

---

## 📌 Шаблоны (Jinja2)

Создайте папку `templates/` рядом с `app.py` и положите `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>Привет, {{ name }}!</h1>
    <ul>
        {% for item in items %}
            <li>{{ item }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

```python
@app.route("/list")
def list_page():
    return render_template(
        "index.html",
        title="Список",
        name="Аня",
        items=["яблоко", "банан", "груша"],
    )
```

`{{ ... }}` — вставить значение. `{% ... %}` — логика (`for`, `if`).

---

## 📌 Формы и запросы

```python
from flask import request

@app.route("/form", methods=["GET", "POST"])
def form():
    if request.method == "POST":
        name = request.form["name"]
        return f"Привет, {name}!"
    return render_template("form.html")
```

**`form.html`:**
```html
<form method="post">
    <input name="name" placeholder="Имя">
    <button type="submit">Отправить</button>
</form>
```

### Query-параметры (GET)

```python
# URL: /search?q=python&page=2
@app.route("/search")
def search():
    q = request.args.get("q", "")
    page = int(request.args.get("page", 1))
    return f"Ищу: {q}, страница {page}"
```

### JSON-запросы

```python
@app.route("/api/data", methods=["POST"])
def api_data():
    data = request.get_json()
    return jsonify({"received": data})
```

---

## 📌 Статические файлы

Папка `static/` — картинки, CSS, JS:

```
myapp/
├── app.py
├── templates/
│   └── index.html
└── static/
    └── style.css
```

```html
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
```

---

## 📌 Полный пример — блог

**`app.py`:**
```python
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

posts = [
    {"id": 1, "title": "Первый пост", "body": "Привет всем!"},
    {"id": 2, "title": "Второй", "body": "Python — это круто"},
]

@app.route("/")
def index():
    return render_template("index.html", posts=posts)

@app.route("/post/<int:pid>")
def post(pid):
    post = next((p for p in posts if p["id"] == pid), None)
    if not post:
        return "Не найдено", 404
    return render_template("post.html", post=post)

@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        title = request.form["title"]
        body = request.form["body"]
        new_id = max(p["id"] for p in posts) + 1 if posts else 1
        posts.append({"id": new_id, "title": title, "body": body})
        return redirect(url_for("index"))
    return render_template("add.html")

if __name__ == "__main__":
    app.run(debug=True)
```

**`templates/index.html`:**
```html
<!DOCTYPE html>
<html>
<head><title>Мой блог</title></head>
<body>
    <h1>Блог</h1>
    <a href="{{ url_for('add') }}">Добавить</a>
    <ul>
        {% for p in posts %}
            <li>
                <a href="{{ url_for('post', pid=p.id) }}">{{ p.title }}</a>
            </li>
        {% endfor %}
    </ul>
</body>
</html>
```

---

## 📌 Полезные расширения

| Расширение | Для чего |
|---|---|
| `Flask-SQLAlchemy` | Базы данных |
| `Flask-Login` | Авторизация |
| `Flask-WTF` | Формы |
| `Flask-Migrate` | Миграции БД |
| `Flask-RESTful` | REST API |
| `Flask-CORS` | CORS |
| `Flask-Mail` | Отправка email |
| `Flask-Caching` | Кеш |

---

## ⚠️ Частые ошибки

!!! warning "Забыли `debug=True`"
    Без этого авто-перезагрузка при изменении кода не работает.

!!! warning "Порт 5000 занят"
    ```python
    app.run(port=8000)
    ```

!!! warning "Шаблон не найден"
    Проверьте путь: `templates/index.html` — папка должна быть рядом с `app.py`.

!!! warning "Форма не приходит"
    Не забудьте `methods=["POST"]` в `@app.route`.

---

## 🧪 Упражнения

1. ⭐ Сайт с 3 страницами (`/`, `/about`, `/contacts`).
2. ⭐ Страница `/hello/Имя` — приветствие.
3. ⭐⭐ Страница со списком покупок из Python-списка.
4. ⭐⭐ Форма, которая приветствует по имени.
5. ⭐⭐ Мини-блог с добавлением постов.
6. ⭐⭐⭐ API `/api/todos` — возвращает список задач в JSON.

---

## 🔗 Что дальше

→ [FastAPI](fastapi.md) — современные быстрые API.