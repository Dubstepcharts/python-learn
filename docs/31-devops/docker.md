# Docker

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [модули и пакеты](../07-modules/index.md).

---

## 🍎 Объясняем просто

!!! example "Docker — коробка для приложения"
    Одна и та же программа работает на вашем компьютере, но **не работает**
    у друга: разные версии Python, разные библиотеки, разные ОС.
    
    **Docker** упаковывает приложение **вместе со всеми зависимостями**
    в «контейнер». Этот контейнер работает **одинаково** везде: локально,
    на сервере, в облаке.

---

## 📌 Термины

| Термин | Значит |
|---|---|
| **Image** | Шаблон (как класс) |
| **Container** | Запущенный образ (как объект) |
| **Dockerfile** | Инструкция, как собрать образ |
| **Volume** | Постоянное хранилище данных |
| **Registry** | Хранилище образов (Docker Hub) |
| **docker-compose** | Файл для нескольких контейнеров |

---

## 🚀 Установка

Скачайте **Docker Desktop**: https://www.docker.com/products/docker-desktop/

Проверка:

```bash
docker --version
docker run hello-world
```

---

## 📌 Основные команды

```bash
docker pull python:3.12-slim           # скачать образ
docker images                          # список образов
docker ps                              # запущенные контейнеры
docker ps -a                           # все контейнеры
docker run <image>                     # запустить
docker stop <container>                # остановить
docker rm <container>                  # удалить контейнер
docker rmi <image>                     # удалить образ
```

---

## 📌 Dockerfile

**`Dockerfile`:**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Разбор:**
- `FROM` — базовый образ
- `WORKDIR` — рабочая директория
- `COPY` — копировать файлы
- `RUN` — выполнить команду при сборке
- `EXPOSE` — какой порт слушает
- `CMD` — что запускать

---

## 📌 Сборка и запуск

```bash
docker build -t myapp .
docker run -p 8000:8000 myapp
```

Откройте `http://localhost:8000`.

**Параметры `run`:**
- `-p 8000:8000` — порт (внешний:внутренний)
- `-d` — в фоне
- `--name myapp` — имя контейнера
- `-v $(pwd):/app` — смонтировать папку
- `-e VAR=value` — переменная окружения
- `--rm` — удалить после остановки

---

## 📌 `.dockerignore`

Не копируйте лишнее:

```
.git
__pycache__
*.pyc
.venv
venv
.env
*.md
```

Уменьшает размер образа и ускоряет сборку.

---

## 📌 Многошаговая сборка

```dockerfile
# Этап 1: сборка
FROM python:3.12 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Этап 2: финальный образ (маленький)
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "main.py"]
```

Размер уменьшается в 2–3 раза.

---

## 📌 `docker-compose` — несколько контейнеров

**`docker-compose.yml`:**
```yaml
version: "3.9"

services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Команды:**
```bash
docker compose up -d          # запустить всё
docker compose down            # остановить
docker compose logs -f web     # логи
docker compose exec web bash    # зайти внутрь
```

Полноценный стек одной командой.

---

## 💡 Пример — FastAPI в Docker

**`main.py`:**
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Привет из Docker!"}
```

**`requirements.txt`:**
```
fastapi
uvicorn[standard]
```

**`Dockerfile`:**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Запуск:
```bash
docker build -t myapi .
docker run -p 8000:8000 myapi
```

---

## ⚠️ Частые ошибки

!!! warning "Не пините версии"
    `FROM python:latest` может сломаться завтра. Всегда `python:3.12-slim`.

!!! warning "`COPY . .` без `.dockerignore`"
    В образ попадут `.git`, `.venv`, секреты. Огромный образ и утечки.

!!! warning "Секреты в Dockerfile"
    Никогда не пишите токены в `ENV` в Dockerfile. Используйте переменные
    окружения при `run` или `docker-compose`.

!!! warning "Образ в гигабайт"
    `FROM python:3.12` — 900 МБ. `python:3.12-slim` — 120 МБ. `alpine` — 50 МБ.

!!! warning "Порт на localhost"
    Внутри контейнера `127.0.0.1` — это сам контейнер. Для доступа извне —
    `0.0.0.0`.

---

## 🧪 Упражнения

1. ⭐ `docker run hello-world`.
2. ⭐ Запустите Python-скрипт в контейнере.
3. ⭐⭐ Соберите образ для своего скрипта.
4. ⭐⭐ FastAPI в Docker.
5. ⭐⭐ `docker-compose` с БД.
6. ⭐⭐⭐ Многошаговая сборка.
7. ⭐⭐⭐ Опубликуйте образ на Docker Hub.

---

## 🔗 Что дальше

→ [GitHub Actions](github-actions.md).