# Проект по шагам: Личный дневник на Flask

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [Flask](../15-web/flask.md), [SQLAlchemy](../20-databases/sqlalchemy.md), [Jinja2](../15-web/flask.md).

Время: **3–4 урока**.

---

## 🎯 Что делаем

Веб-приложение:
- Регистрация и вход
- Личные записи (только свои)
- Добавление, редактирование, удаление
- Публичный просмотр обезличенных записей

---

## 📌 Шаг 1. Структура проекта

```
diary/
├── app.py
├── models.py
├── forms.py
├── requirements.txt
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── create.html
│   └── edit.html
└── instance/
    └── diary.db
```

---

## 📌 Шаг 2. Зависимости

```bash
pip install flask flask-sqlalchemy flask-login flask-wtf email-validator
```

**`requirements.txt`:**
```
flask
flask-sqlalchemy
flask-login
flask-wtf
email-validator
```

---

## 📌 Шаг 3. Модели

**`models.py`:**
```python
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)

    entries = db.relationship("Entry", backref="author", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Entry(db.Model):
    __tablename__ = "entries"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    is_public = db.Column(db.Boolean, default=False)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
```

Пароли **хешируются** — `generate_password_hash` использует `pbkdf2:sha256`.

---

## 📌 Шаг 4. Формы

**`forms.py`:**
```python
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo

class RegisterForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Пароль", validators=[DataRequired(), Length(min=6)])
    confirm = PasswordField("Повторите пароль", validators=[
        DataRequired(), EqualTo("password", message="Пароли не совпадают")
    ])
    submit = SubmitField("Зарегистрироваться")

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Пароль", validators=[DataRequired()])
    remember = BooleanField("Запомнить меня")
    submit = SubmitField("Войти")

class EntryForm(FlaskForm):
    title = StringField("Заголовок", validators=[DataRequired(), Length(max=200)])
    body = TextAreaField("Текст", validators=[DataRequired()])
    is_public = BooleanField("Сделать публичной")
    submit = SubmitField("Сохранить")
```

---

## 📌 Шаг 5. Основной файл

**`app.py`:**
```python
import os
from datetime import datetime
from flask import Flask, render_template, redirect, url_for, flash, request, abort
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Entry
from forms import RegisterForm, LoginForm, EntryForm

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-key-change-in-prod")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///diary.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = "login"
login_manager.login_message = "Сначала войдите"

@login_manager.user_loader
def load_user(uid):
    return db.session.get(User, int(uid))

with app.app_context():
    db.create_all()
```

---

## 📌 Шаг 6. Регистрация и вход

```python
@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("index"))

    form = RegisterForm()
    if form.validate_on_submit():
        if User.query.filter_by(email=form.email.data).first():
            flash("Этот email уже занят", "danger")
            return render_template("register.html", form=form)

        user = User(email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()

        flash("Регистрация успешна! Войдите.", "success")
        return redirect(url_for("login"))

    return render_template("register.html", form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get("next")
            return redirect(next_page or url_for("index"))
        flash("Неверный email или пароль", "danger")

    return render_template("login.html", form=form)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))
```

---

## 📌 Шаг 7. Записи

```python
@app.route("/")
def index():
    if current_user.is_authenticated:
        entries = Entry.query.filter_by(author_id=current_user.id) \
                             .order_by(Entry.created.desc()).all()
    else:
        entries = []

    public_entries = Entry.query.filter_by(is_public=True) \
                                .order_by(Entry.created.desc()).limit(10).all()

    return render_template("index.html", entries=entries, public_entries=public_entries)

@app.route("/entry/create", methods=["GET", "POST"])
@login_required
def create_entry():
    form = EntryForm()
    if form.validate_on_submit():
        entry = Entry(
            title=form.title.data,
            body=form.body.data,
            is_public=form.is_public.data,
            author_id=current_user.id,
        )
        db.session.add(entry)
        db.session.commit()
        flash("Запись добавлена", "success")
        return redirect(url_for("index"))

    return render_template("create.html", form=form)

@app.route("/entry/<int:id>")
@login_required
def view_entry(id):
    entry = Entry.query.get_or_404(id)
    if entry.author_id != current_user.id:
        abort(403)
    return render_template("edit.html", form=EntryForm(obj=entry), entry=entry)

@app.route("/entry/<int:id>/edit", methods=["GET", "POST"])
@login_required
def edit_entry(id):
    entry = Entry.query.get_or_404(id)
    if entry.author_id != current_user.id:
        abort(403)

    form = EntryForm(obj=entry)
    if form.validate_on_submit():
        entry.title = form.title.data
        entry.body = form.body.data
        entry.is_public = form.is_public.data
        db.session.commit()
        flash("Запись обновлена", "success")
        return redirect(url_for("index"))

    return render_template("edit.html", form=form, entry=entry)

@app.route("/entry/<int:id>/delete", methods=["POST"])
@login_required
def delete_entry(id):
    entry = Entry.query.get_or_404(id)
    if entry.author_id != current_user.id:
        abort(403)
    db.session.delete(entry)
    db.session.commit()
    flash("Запись удалена", "success")
    return redirect(url_for("index"))
```

**Проверка владельца** — ключевая защита. `abort(403)` если не автор.

---

## 📌 Шаг 8. Шаблоны

**`templates/base.html`:**
```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Дневник</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<nav class="navbar navbar-dark bg-dark mb-4">
    <div class="container">
        <a class="navbar-brand" href="{{ url_for('index') }}">📔 Мой дневник</a>
        <div>
            {% if current_user.is_authenticated %}
                <span class="text-white me-3">{{ current_user.email }}</span>
                <a href="{{ url_for('create_entry') }}" class="btn btn-outline-light btn-sm">+ Запись</a>
                <a href="{{ url_for('logout') }}" class="btn btn-outline-light btn-sm">Выйти</a>
            {% else %}
                <a href="{{ url_for('login') }}" class="btn btn-outline-light btn-sm">Войти</a>
                <a href="{{ url_for('register') }}" class="btn btn-light btn-sm">Регистрация</a>
            {% endif %}
        </div>
    </div>
</nav>

<div class="container">
    {% with messages = get_flashed_messages(with_categories=true) %}
        {% for category, message in messages %}
            <div class="alert alert-{{ category }}">{{ message }}</div>
        {% endfor %}
    {% endwith %}

    {% block content %}{% endblock %}
</div>
</body>
</html>
```

**`templates/index.html`:**
```html
{% extends "base.html" %}

{% block content %}
<h2>Мои записи</h2>

{% if entries %}
    {% for e in entries %}
        <div class="card mb-3">
            <div class="card-body">
                <h5>{{ e.title }}</h5>
                <p class="text-muted small">{{ e.created.strftime("%d.%m.%Y %H:%M") }}
                    {% if e.is_public %}<span class="badge bg-info">публичная</span>{% endif %}
                </p>
                <p>{{ e.body[:200] }}{% if e.body|length > 200 %}...{% endif %}</p>
                <a href="{{ url_for('edit_entry', id=e.id) }}" class="btn btn-sm btn-primary">Редактировать</a>
                <form method="post" action="{{ url_for('delete_entry', id=e.id) }}"
                      class="d-inline"
                      onsubmit="return confirm('Удалить запись?')">
                    <button class="btn btn-sm btn-danger">Удалить</button>
                </form>
            </div>
        </div>
    {% endfor %}
{% else %}
    <p class="text-muted">Записей пока нет. <a href="{{ url_for('create_entry') }}">Создайте первую!</a></p>
{% endif %}

{% if public_entries %}
    <hr>
    <h3>Публичные записи</h3>
    {% for e in public_entries %}
        <div class="card mb-3">
            <div class="card-body">
                <h5>{{ e.title }}</h5>
                <p>{{ e.body[:300] }}...</p>
            </div>
        </div>
    {% endfor %}
{% endif %}
{% endblock %}
```

Остальные шаблоны — аналогично.

---

## 📌 Шаг 9. Запуск

```bash
export FLASK_APP=app.py
export FLASK_DEBUG=1
flask run
```

Или на Windows:

```powershell
$env:FLASK_APP = "app.py"
$env:FLASK_DEBUG = "1"
flask run
```

Откройте **http://127.0.0.1:5000**.

---

## 📌 Шаг 10. Улучшения

- **Поиск** по записям
- **Теги** (многие-ко-многим)
- **Экспорт в PDF** (через `weasyprint`)
- **Тёмная тема**
- **REST API** на базе этого же проекта через FastAPI
- **Деплой на Render** (см. [DevOps](../31-devops/deploy.md))

---

## ⚠️ Возможные проблемы

!!! warning "CSRF-токен не работает"
    `app.config["SECRET_KEY"]` должен быть установлен **до** создания форм.

!!! warning "Ошибка `No module named 'email_validator'`"
    `pip install email-validator`. Нужно для `Email()`.

!!! warning "База не создаётся"
    Убедитесь, что `db.create_all()` вызывается **внутри `app.app_context()`**.

!!! warning "Сессия пропадает"
    Проверьте, что `SECRET_KEY` одинаковый между запусками.

---

## 🎯 Что дальше

- Фото к записям
- Календарь записей
- Публичный профиль
- API для мобильного приложения

---

## 🔗 Что дальше

→ Поздравляем! **Курс полностью завершён.**