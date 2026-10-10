# Django

!!! abstract "Уровень: ⭐⭐⭐ Продвинутый"
    Нужно знать: [ООП](../08-oop/index.md), [SQL](../20-databases/sqlite.md) (желательно).

---

## 🍎 Объясняем просто

!!! example "Django — как конструктор для целого сайта"
    Flask и FastAPI дают «кирпичики». Django даёт **готовый дом**:
    модели, админку, авторизацию, формы, шаблоны — всё в комплекте.
    
    На Django сделаны: Instagram (изначально), Pinterest, Disqus,
    Mozilla, NASA, множество банковских сайтов.

---

## 🚀 Установка

```bash
pip install django
django-admin --version
```

---

## 🏗️ Создание проекта

```bash
django-admin startproject myproject
cd myproject
python manage.py startapp blog
```

Структура:
```
myproject/
├── manage.py
├── myproject/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── blog/
    ├── models.py
    ├── views.py
    ├── admin.py
    └── urls.py
```

---

## ▶️ Первый запуск

```bash
python manage.py migrate          # создать таблицы БД
python manage.py runserver
```

Откройте **http://127.0.0.1:8000** — увидите приветствие Django.

---

## 📌 Модели (Models)

**Модель** — это таблица БД в виде Python-класса.

**`blog/models.py`:**
```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    published = models.BooleanField(default=True)

    def __str__(self):
        return self.title
```

### Миграции

```bash
python manage.py makemigrations    # подготовить изменения
python manage.py migrate            # применить к БД
```

Django сам создаёт SQL-таблицы.

---

## 📌 Админка — «магия Django»

```bash
python manage.py createsuperuser
```

**`blog/admin.py`:**
```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

Откройте **http://127.0.0.1:8000/admin** — войдите — и **управляйте
записями прямо в браузере**: добавляйте, редактируйте, удаляйте. Это одна
из главных фишек Django.

---

## 📌 Представления (Views)

**`blog/views.py`:**
```python
from django.shortcuts import render, get_object_or_404
from .models import Post

def post_list(request):
    posts = Post.objects.filter(published=True)
    return render(request, "blog/post_list.html", {"posts": posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, "blog/post_detail.html", {"post": post})
```

---

## 📌 URL-маршруты

**`blog/urls.py`:**
```python
from django.urls import path
from . import views

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("post/<int:pk>/", views.post_detail, name="post_detail"),
]
```

**`myproject/urls.py`:**
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("blog.urls")),
]
```

---

## 📌 Шаблоны

**`blog/templates/blog/post_list.html`:**
```html
<!DOCTYPE html>
<html>
<head><title>Блог</title></head>
<body>
    <h1>Все посты</h1>
    {% for post in posts %}
        <article>
            <h2><a href="{% url 'post_detail' post.pk %}">{{ post.title }}</a></h2>
            <p>{{ post.body|truncatewords:30 }}</p>
            <small>{{ post.created }}</small>
        </article>
    {% empty %}
        <p>Пока постов нет.</p>
    {% endfor %}
</body>
</html>
```

Шаблоны Django (DTL) похожи на Jinja2:
- `{{ ... }}` — вставить значение
- `{% ... %}` — логика
- Фильтры: `{{ value|filter }}` (`truncatewords`, `date`, `upper`, `length`)

---

## 📌 Формы

**`blog/forms.py`:**
```python
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "body"]
```

**`views.py`:**
```python
from django.shortcuts import redirect
from .forms import PostForm

def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("post_list")
    else:
        form = PostForm()
    return render(request, "blog/post_form.html", {"form": form})
```

---

## 📌 ORM — запросы к БД

Django ORM — «мост» между Python-классами и БД.

```python
# Все посты
Post.objects.all()

# Фильтр
Post.objects.filter(published=True)
Post.objects.filter(title__contains="Python")
Post.objects.filter(created__year=2024)

# Одна запись
Post.objects.get(pk=1)

# Сортировка
Post.objects.order_by("-created")

# Связанные
author.posts.all()

# Создание
Post.objects.create(title="Новый", body="Текст")

# Обновление
post.title = "Изменено"
post.save()

# Удаление
post.delete()

# Агрегации
from django.db.models import Count, Avg
Post.objects.aggregate(Count("id"), Avg("views"))
```

---

## 📌 Полезные команды

```bash
python manage.py runserver              # запуск
python manage.py makemigrations         # подготовить миграции
python manage.py migrate                # применить
python manage.py createsuperuser        # админ
python manage.py shell                  # Python-консоль с настройками Django
python manage.py collectstatic          # собрать статику
python manage.py test                   # запустить тесты
python manage.py dumpdata > data.json   # выгрузить БД
python manage.py loaddata data.json     # загрузить
```

---

## 📌 Встроенные приложения Django

| Приложение | Что даёт |
|---|---|
| `django.contrib.admin` | Админка |
| `django.contrib.auth` | Пользователи, пароли, группы |
| `django.contrib.sessions` | Сессии |
| `django.contrib.messages` | Flash-сообщения |
| `django.contrib.staticfiles` | Статические файлы |
| `django.contrib.sites` | Мультисайт |
| `django.contrib.contenttypes` | Generic-связи |

Активируются в `settings.py` → `INSTALLED_APPS`.

---

## 📌 Полезные пакеты

| Пакет | Для чего |
|---|---|
| `djangorestframework` | REST API |
| `django-allauth` | Авторизация через соцсети |
| `django-crispy-forms` | Красивые формы |
| `django-debug-toolbar` | Отладка |
| `django-celery` | Фоновые задачи |
| `django-filter` | Фильтры |
| `django-cors-headers` | CORS |
| `pillow` | Для `ImageField` |

---

## 📌 Django REST Framework — API

```bash
pip install djangorestframework
```

**`settings.py`:**
```python
INSTALLED_APPS = [
    ...
    "rest_framework",
]
```

**`blog/serializers.py`:**
```python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "body", "created"]
```

**`blog/views.py`:**
```python
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

**`blog/urls.py`:**
```python
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register("posts", PostViewSet)

urlpatterns = router.urls
```

Готово — у вас **полноценный CRUD-API** с документацией.

---

## 📌 Сравнение фреймворков

| | Flask | FastAPI | Django |
|---|---|---|---|
| Тип | Микро | Микро | Полный |
| ORM | Нет (SQLAlchemy) | Нет | Встроенный |
| Админка | Нет | Нет | ✅ |
| Авторизация | Расширение | Расширение | ✅ |
| Сложность | Низкая | Низкая | Высокая |
| Для чего | Малые проекты, API | API | Большие сайты |

**Правило выбора:**
- Простой API или микросервис → **FastAPI**
- Небольшой сайт, прототип → **Flask**
- Большое приложение с админкой и БД → **Django**

---

## ⚠️ Частые ошибки

!!! warning "Забыли `migrate` после изменения модели"
    Всегда: `makemigrations` → `migrate`.

!!! warning "Шаблон не найден"
    Папка `templates/` должна быть в **приложении** (`blog/templates/blog/`)
    или в корне (указано в `TEMPLATES` → `DIRS`).

!!! warning "`ALLOWED_HOSTS` в проде"
    ```python
    ALLOWED_HOSTS = ["мойсайт.ру", "www.мойсайт.ру"]
    ```

!!! warning "`DEBUG=True` в продакшене"
    ⚠️ Это **опасно**. Перед выкладкой: `DEBUG = False` и задайте `SECRET_KEY`
    через переменные окружения.

!!! warning "`python manage.py runserver` — не для прода"
    Для реального сайта — Gunicorn + Nginx. См. документацию Django.

---

## 🧪 Упражнения

1. ⭐ Создайте проект и приложение, откройте админку.
2. ⭐ Модель `Book` (title, author, year) + миграции + админка.
3. ⭐⭐ Список книг и страница одной книги.
4. ⭐⭐ Форма добавления книги.
5. ⭐⭐⭐ Django REST Framework API для книг.
6. ⭐⭐⭐ Поиск и пагинация.

---

## 🔗 Что дальше

→ [NumPy](../16-numpy/index.md) — массивы и быстрые вычисления.