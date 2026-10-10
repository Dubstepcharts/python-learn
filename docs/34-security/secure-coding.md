# Безопасная разработка

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [Основы криптографии](crypto.md).

---

## 📖 OWASP Top 10

**OWASP** — организация, публикующая список **самых критичных уязвимостей**
веб-приложений. Знать его — обязанность программиста.

**Топ-уязвимости (сокращённо):**
1. Broken Access Control — доступ туда, куда нельзя
2. Cryptographic Failures — слабое шифрование
3. Injection — SQL, команды, LDAP
4. Insecure Design — плохая архитектура
5. Security Misconfiguration — дефолтные пароли, отладка в проде
6. Vulnerable Components — устаревшие библиотеки
7. Authentication Failures — слабая авторизация
8. Software & Data Integrity — непроверенные обновления
9. Logging Failures — нет логов
10. SSRF — запросы на внутренние ресурсы

Разберём ключевые.

---

## 📌 SQL-инъекция

**Проблема:** пользовательский ввод **склеивается** с SQL.

```python
# ❌ УЯЗВИМО
name = input("Имя: ")
query = f"SELECT * FROM users WHERE name = '{name}'"
cursor.execute(query)
```

Если пользователь введёт `'; DROP TABLE users; --`, таблица исчезнет.

**Решение — параметры:**

```python
# ✅ БЕЗОПАСНО
cursor.execute("SELECT * FROM users WHERE name = ?", (name,))
```

Никогда **не используйте** f-строки, `.format()`, `%` для SQL.

---

## 📌 XSS — внедрение скриптов

**Проблема:** пользовательские данные попадают на страницу **без экранирования**.

```python
# ❌ УЯЗВИМО
comment = user_input
html = f"<p>{comment}</p>"
```

Если пользователь напишет `<script>alert('xss')</script>` — скрипт выполнится
у всех, кто откроет страницу.

**Решение — экранировать:**

```python
from markupsafe import escape
safe = escape(user_input)     # < > & ' " — заменяются
```

Во Flask `render_template` экранирует **автоматически**. В FastAPI —
используйте `Jinja2Templates` (тоже экранирует) или `html.escape`.

**Никогда** не делайте `{{ user_input | safe }}` без доверия к источнику.

---

## 📌 CSRF — подделка запроса

**Проблема:** сайт-злоумышленник от имени браузера жертвы отправляет
запрос на ваш сайт (например, «перевести деньги»).

**Защита:**
- CSRF-токены (в форме скрытое поле)
- SameSite cookies
- Проверка `Origin`/`Referer`

Во Flask — `Flask-WTF`. В Django — встроено.

---

## 📌 Хранение секретов

```python
# ❌ Никогда
API_KEY = "sk-abc123..."

# ✅ Через переменные окружения
import os
API_KEY = os.getenv("API_KEY")
```

**`.env`** (не коммитить!):
```
API_KEY=sk-abc123
DATABASE_URL=postgres://...
```

**`.gitignore`:**
```
.env
.env.*
*.key
*.pem
```

**Проверка, что случайно не закоммитили:**

```bash
git log --all --full-history -- .env
```

Если попал — **смените секрет немедленно**. Даже если удалили из
последнего коммита, он остался в истории.

---

## 📌 Управление доступом

**Каждая операция** должна проверять **право пользователя**.

```python
# ❌ Проверяется только авторизация
@app.get("/post/{post_id}")
def get_post(post_id):
    return db.get_post(post_id)

# ✅ Проверяется и владелец
@app.get("/post/{post_id}")
def get_post(post_id, user=Depends(current_user)):
    post = db.get_post(post_id)
    if post.author_id != user.id and not user.is_admin:
        raise HTTPException(403)
    return post
```

**Правило:** никогда не доверяйте `id` в URL. Всегда проверяйте, что
пользователь имеет право на этот ресурс.

---

## 📌 Валидация ввода

**Правило:** валидируйте **всё** — и на клиенте, и на сервере.

```python
from pydantic import BaseModel, Field, EmailStr, constr

class User(BaseModel):
    name: constr(min_length=1, max_length=50)
    age: int = Field(ge=0, le=150)
    email: EmailStr

# Если не пройдёт — ошибка 422 с описанием
```

Pydantic сам отсечёт: неправильные типы, слишком длинные строки, диапазоны.

---

## 📌 Логирование

**Логируйте:**
- Попытки входа (успешные и неудачные)
- Изменения прав
- Действия администратора
- Ошибки с контекстом

**Не логируйте:**
- Пароли
- Токены
- Номера банковских карт
- Персональные данные (если не нужно)

```python
from loguru import logger

logger.info(f"Успешный вход: user_id={user.id}, ip={request.ip}")
logger.warning(f"Неудачная попытка входа: email={email}")
```

---

## 📌 Зависимости

**Устаревшая библиотека** — уязвимость.

```bash
pip install pip-audit
pip-audit
```

Автоматически проверяет пакеты на известные CVE. Запускайте в CI.

```bash
pip install safety
safety check
```

**Фиксируйте версии** через `pip freeze > requirements.txt` или лучше —
через **poetry** / **uv** / **pdm** с lock-файлом.

---

## 📌 Заголовки безопасности

Для веб-приложения добавьте:

```python
@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response
```

Это защищает от ряда атак на браузер.

---

## 📌 Rate limiting

Ограничивайте частоту запросов:

```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/login")
@limiter.limit("5/minute")
def login(request):
    ...
```

Защита от подбора паролей, DDoS, спама.

---

## 💡 Чек-лист безопасности

**До релиза:**

- [ ] Все запросы к БД — параметризованные
- [ ] Пользовательские данные экранируются при выводе
- [ ] CSRF-токены на формах
- [ ] Пароли — только bcrypt/argon2
- [ ] Секреты в `.env`, не в Git
- [ ] На каждом эндпоинте — проверка прав
- [ ] Валидация через pydantic
- [ ] Логи без секретов
- [ ] `DEBUG = False` в проде
- [ ] HTTPS с валидным сертификатом
- [ ] Зависимости без известных CVE
- [ ] Rate limiting на чувствительных эндпоинтах
- [ ] Заголовки безопасности
- [ ] Бэкапы БД
- [ ] Обработка ошибок без утечек деталей

---

## ⚠️ Частые ошибки

!!! warning "`eval` на вводе пользователя"
    Выполнит любой код. Никогда. Для безопасного разбора — `ast.literal_eval`.

!!! warning "Отладка в проде"
    `DEBUG=True` в Flask/Django показывает трейсы, исходники, переменные.
    Утечка!

!!! warning "Секреты в коде или в Git"
    Даже в приватном репо — плохо. Только `.env` + секреты на хостинге.

!!! warning "Своя проверка пароля «в лоб»"
    ```python
    if user_password == stored_password:
    ```
    Уязвимо к тайминговым атакам. Используйте `secrets.compare_digest`
    или спец-библиотеки.

!!! warning "Доверие к клиенту"
    Всё, что приходит от клиента — потенциально враждебно. Проверяйте
    **на сервере**.

---

## 🧪 Упражнения

1. ⭐ Найдите уязвимость в коде с f-строкой и SQL.
2. ⭐ Перепишите на параметры.
3. ⭐⭐ Настройте `.env` с секретами.
4. ⭐⭐ Добавьте CSRF-защиту во Flask.
5. ⭐⭐ Валидация формы через pydantic.
6. ⭐⭐⭐ Полный аудит мини-проекта: SQL, XSS, секреты, доступ.
7. ⭐⭐⭐ Запустите `pip-audit` на своём проекте.

---

## 🔗 Что дальше

→ [Готовые проекты по шагам](../35-step-projects/index.md).