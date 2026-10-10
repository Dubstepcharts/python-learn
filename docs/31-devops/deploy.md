# Деплой — размещение проекта

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [GitHub Actions](github-actions.md), [Docker](docker.md).

---

## 📌 Что такое деплой

Написать код — половина. Нужно **разместить его в интернете**, чтобы им
пользовались. Это и есть деплой.

---

## 📌 Варианты хостинга

| Сервис | Для чего | Бесплатно |
|---|---|---|
| **GitHub Pages** | Статика (сайты, доки) | ✅ Безлимит |
| **Netlify** | Статика | ✅ 100 ГБ/мес |
| **Vercel** | Статика, serverless | ✅ |
| **Cloudflare Pages** | Статика | ✅ |
| **Render** | Python-приложения | ✅ с ограничениями |
| **Railway** | Любые приложения | ✅ $5 кредит |
| **Fly.io** | Docker-контейнеры | ✅ небольшие лимиты |
| **PythonAnywhere** | Python | ✅ 1 приложение |
| **Heroku** | Старое, но живое | Платно |

**Для школьников:** GitHub Pages — сайты и доки. Render/Fly.io — FastAPI/Flask.

---

## 📌 Деплой FastAPI на Render

1. Создайте `requirements.txt` и `main.py`.
2. Пуш в GitHub.
3. Зайдите на **render.com**, зарегистрируйтесь через GitHub.
4. **New → Web Service**, выберите репозиторий.
5. Заполните:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Create Web Service**.

Через 2–3 минуты — ваш API доступен по `https://xxx.onrender.com`.

!!! warning "Render засыпает"
    На бесплатном тарифе сервис «засыпает» после 15 минут бездействия.
    Первый запрос после сна — 30 секунд. Это нормально.

---

## 📌 Деплой через Docker на Fly.io

```bash
# Установка
curl -L https://fly.io/install.sh | sh

# Авторизация
fly auth login

# Инициализация
fly launch

# Деплой
fly deploy
```

Fly.io использует **ваш `Dockerfile`** — ничего дополнительно делать не надо.

---

## 📌 Переменные окружения

Никогда не храните токены в коде. Используйте `.env`:

**`.env`:**
```
DATABASE_URL=postgres://...
API_KEY=abc123
```

**`.gitignore`:**
```
.env
```

**Код:**
```python
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")
```

На хостинге переменные задаются в **панели управления** (Settings → Environment).

---

## 📌 База данных в продакшене

**SQLite** плохо подходит для продакшена (один файл, блокировки).
Используйте:

- **PostgreSQL** — Render, Railway, Supabase, Neon (бесплатные тарифы)
- **MongoDB Atlas** — 512 МБ бесплатно
- **Redis** — для кеша

На Render можно создать **PostgreSQL одной кнопкой**.

---

## 📌 Домен

1. Купите домен (reg.ru, namecheap) — ~200–1000 руб/год.
2. На хостинге добавьте **Custom Domain**.
3. Пропишите **DNS-записи** (A или CNAME) в панели домена.
4. Через 5–60 минут домен заработает.
5. **SSL** — большинство хостингов делают автоматически (Let's Encrypt).

**Бесплатный домен:**
- `xxx.onrender.com` — от Render
- `xxx.fly.dev` — от Fly.io
- `xxx.github.io` — от GitHub Pages

---

## 📌 Логи и отладка

```bash
# Render — в панели
# Fly.io — из терминала
fly logs
fly ssh console
```

**Совет:** используйте `loguru` — логи сразу попадут в stdout и будут видны.

---

## 📌 Мониторинг

- **UptimeRobot** — проверяет доступность, шлёт алерты
- **Sentry** — собирает ошибки
- **Grafana + Prometheus** — метрики

Начните с UptimeRobot — 5 бесплатных проверок каждые 5 минут.

---

## 💡 Полный чек-лист деплоя

- [ ] `requirements.txt` актуален
- [ ] `.env` в `.gitignore`
- [ ] Секреты на хостинге заданы
- [ ] `Dockerfile` (если используем)
- [ ] База данных настроена
- [ ] Есть `/health` эндпоинт для проверки
- [ ] Логи пишутся в stdout
- [ ] Кастомный домен (опционально)
- [ ] SSL работает
- [ ] UptimeRobot проверяет

---

## ⚠️ Частые ошибки

!!! warning "Порт захардкожен"
    ```python
    app.run(port=5000)     # ❌
    port = int(os.getenv("PORT", 5000))    # ✅
    ```
    Хостинг передаёт порт через `$PORT`.

!!! warning "SQLite в продакшене"
    Файл может пропасть при рестарте. Используйте Postgres.

!!! warning "`DEBUG=True` в Flask/Django"
    Утечка данных! Всегда `DEBUG=False` в проде.

!!! warning "Отладочные `print` вместо логов"
    Не видны в панели. Используйте `logging` / `loguru`.

!!! warning "Секреты в репозитории"
    Удалите, смените все токены. Старые считайте скомпрометированными.

---

## 🧪 Упражнения

1. ⭐ Задеплойте «Hello, world» FastAPI на Render.
2. ⭐ Создайте `requirements.txt` для своего проекта.
3. ⭐⭐ Подключите переменные окружения.
4. ⭐⭐ Задеплойте через Docker на Fly.io.
5. ⭐⭐ Привяжите кастомный домен.
6. ⭐⭐⭐ Настройте UptimeRobot.
7. ⭐⭐⭐ Полный проект: FastAPI + PostgreSQL + деплой.

---

## 🔗 Что дальше

→ [Проекты](../14-projects/index.md).