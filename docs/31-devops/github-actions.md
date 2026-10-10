# GitHub Actions

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [Git](../07-modules/index.md) — базово.

---

## 🍎 Объясняем просто

!!! example "CI/CD — как конвейер на заводе"
    Пока ты спишь, **автоматически**:
    - тесты запускаются на каждый коммит
    - код проверяется линтерами
    - сайт пересобирается и публикуется
    - образ Docker собирается и пушится

    **GitHub Actions** — это тот «конвейер». Бесплатно для публичных
    репозиториев.

---

## 📌 Термины

| Термин | Значит |
|---|---|
| **Workflow** | Автоматизация целиком (`.github/workflows/*.yml`) |
| **Job** | Набор шагов |
| **Step** | Один шаг |
| **Action** | Готовый шаг от сообщества |
| **Runner** | Машина, где выполняется |

---

## 📌 Первый workflow

**`.github/workflows/test.yml`:**
```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
```

Каждый `git push` в `main` — тесты запускаются.

---

## 📌 Триггеры (`on`)

```yaml
on:
  push:
    branches: [main, dev]
  pull_request:
  schedule:
    - cron: "0 6 * * *"        # каждый день в 6:00
  workflow_dispatch:             # вручную из UI
```

---

## 📌 Несколько job

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install ruff && ruff check .

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt && pytest

  deploy:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Деплой после успешных тестов"
```

`needs` — «запускать после успеха других job».

---

## 📌 Матрица (тесты на разных версиях)

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -r requirements.txt && pytest
```

**9 комбинаций** — все параллельно.

---

## 📌 Секреты

В `Settings → Secrets and variables → Actions` добавьте секрет.

Использование:

```yaml
- run: python deploy.py
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
```

**Секреты шифруются.** В логах маскируются как `***`.

---

## 📌 Кеш зависимостей

Ускоряет сборку в 3–5 раз:

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: "pip"

- run: pip install -r requirements.txt
```

---

## 📌 Публикация Docker-образа

```yaml
- name: Login to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: ghcr.io/${{ github.repository }}:latest
```

---

## 📌 Деплой на GitHub Pages (для MkDocs)

```yaml
name: Deploy docs

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: mkdocs gh-deploy --force
```

(У вас это уже работает — это ваш `deploy.yml`.)

---

## 📌 Полезные action'ы

| Action | Что делает |
|---|---|
| `actions/checkout` | Клонирует репозиторий |
| `actions/setup-python` | Устанавливает Python |
| `actions/cache` | Кеширует |
| `actions/upload-artifact` | Сохраняет файлы |
| `docker/build-push-action` | Собирает образ |
| `codecov/codecov-action` | Покрытие тестами |
| `softprops/action-gh-release` | Создаёт релиз |
| `pre-commit/action` | Запускает хуки |

---

## 💡 Пример — полный CI/CD для Python-проекта

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12", cache: pip }
      - run: pip install ruff
      - run: ruff check .

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: pip
      - run: pip install -r requirements.txt
      - run: pytest --cov=. --cov-report=xml
      - uses: codecov/codecov-action@v4

  deploy:
    needs: [lint, test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: mkdocs gh-deploy --force
```

Полный пайплайн: линт → тесты на 3 версиях → деплой.

---

## ⚠️ Частые ошибки

!!! warning "Секреты в открытом виде"
    Никогда не пишите токены прямо в YAML. Только через `secrets`.

!!! warning "`GITHUB_TOKEN` по умолчанию только на чтение"
    Для пуша добавьте `permissions: contents: write`.

!!! warning "Долгий workflow"
    Кешируйте зависимости и параллельте через матрицу.

!!! warning "Запуск на каждый пуш"
    Фильтруйте `branches` и `paths`.

!!! warning "Платные минуты на приватных репо"
    2000 минут/месяц бесплатно. Для публичных — безлимит.

---

## 🧪 Упражнения

1. ⭐ Workflow с `echo "Hello"`.
2. ⭐ Тесты при пуше.
3. ⭐⭐ Матрица на 3 версии Python.
4. ⭐⭐ Кеш зависимостей.
5. ⭐⭐ Секрет через `secrets`.
6. ⭐⭐⭐ Публикация Docker-образа.
7. ⭐⭐⭐ Полный CI/CD (см. пример).

---

## 🔗 Что дальше

→ [Деплой](deploy.md).