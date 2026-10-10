# Основы Git

!!! abstract "Уровень: ⭐⭐"

---

## 🍎 Объясняем просто

!!! example "Git — как машина времени для кода"
    Каждое изменение можно зафиксировать («снимок»). В любой момент —
    вернуться к любому снимку. Работать параллельно в нескольких «ветках».
    Сливать изменения друзей в один проект без потери работы.

---

## 🚀 Установка и настройка

```bash
# Windows: скачать с https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt install git
```

Проверка:

```bash
git --version
```

**Первая настройка** (один раз):

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "you@example.com"

# Приятности
git config --global init.defaultBranch main
git config --global core.autocrlf input      # Linux/macOS
# git config --global core.autocrlf true       # Windows
git config --global pull.rebase false
git config --global core.editor "code --wait"    # если VS Code
```

Проверить настройки:

```bash
git config --list
```

---

## 📌 Что такое репозиторий

**Репозиторий** — папка, в которой Git следит за изменениями. Внутри неё есть скрытая папка `.git` — там вся история.

```bash
git init                # создать новый репозиторий
git clone URL            # скопировать чужой
```

---

## 📌 Три «этажа» Git

```
Рабочая папка         Индекс (staging)         Репозиторий
(working directory)   (staging area)            (commits)
       │                    │                        │
       │    git add         │     git commit         │
       ├───────────────────►├────────────────────────►
       │                    │                        │
       │◄───────────────────┤                        │
       │   git restore      │                        │
```

**Working directory** — где вы редактируете файлы.
**Staging area** — что попадёт в следующий коммит.
**Repository** — сохранённые коммиты.

---

## 📌 Базовые команды

### Проверка состояния

```bash
git status                # что изменилось
git status -s              # коротко
git diff                    # что изменено в файлах
git diff --staged           # что уже в индексе
```

### Добавление

```bash
git add file.txt            # один файл
git add .                    # все изменения
git add *.py                 # по маске
git add -p                   # интерактивно, по кускам
```

### Коммит

```bash
git commit -m "Добавил форму логина"
git commit -am "..."          # add + commit для отслеживаемых
git commit --amend             # изменить последний коммит
```

**Хороший коммит:**

```
Краткое описание (до 50 символов)

Более подробное объяснение, если нужно. Почему изменения
нужны, а не только «что».

Fixes #42
```

**Плохо:**
- `fix`
- `update`
- `WIP`
- `asdfasdf`

**Хорошо:**
- `Добавил валидацию email в форме`
- `Исправил падение при пустом списке`
- `Обновил библиотеку requests до 2.32`

### История

```bash
git log                          # все коммиты
git log --oneline                 # кратко
git log --oneline --graph          # с графом
git log -5                         # последние 5
git log --author="Аня"              # от конкретного автора
git log -p file.txt                 # с изменениями файла
git log --since="1 week ago"
git log --grep="фикс"                # поиск по сообщению
```

### Откат изменений

```bash
# Отменить изменения в файле (не закоммиченные)
git restore file.txt

# Убрать из индекса, но сохранить изменения
git restore --staged file.txt

# Вернуть файл к состоянию конкретного коммита
git checkout abc123 -- file.txt
```

### Удалённые репозитории

```bash
git remote add origin https://github.com/user/repo.git
git remote -v                     # посмотреть URL
git remote set-url origin NEW_URL  # поменять URL

git push -u origin main             # первый раз
git push                             # потом
git pull                             # забрать чужие изменения
git fetch                            # только скачать, не сливать
```

---

## 📌 `.gitignore`

Файл, где перечислены файлы, которые Git **игнорирует**.

**`.gitignore`:**
```
# Python
__pycache__/
*.pyc
*.pyo
.venv/
venv/

# IDE
.vscode/
.idea/

# Секреты
.env
*.key
*.pem

# ОС
.DS_Store
Thumbs.db

# Сборка
build/
dist/
*.egg-info/

# Данные
*.db
*.sqlite3
data/
```

**Что НЕ должно попадать в Git:**
- Секреты (`.env`, токены)
- Виртуальные окружения
- Локальные настройки IDE
- Большие бинарные файлы (видео, датасеты)
- Кеш, логи, временные файлы

---

## 📌 Типичный рабочий цикл

```bash
# 1. Забрать чужие изменения
git pull

# 2. Поработать над кодом

# 3. Посмотреть, что сделали
git status
git diff

# 4. Добавить и закоммитить
git add .
git commit -m "Описание изменений"

# 5. Отправить в удалённый репозиторий
git push
```

Повторяем по кругу.

---

## 💡 Пример работы

```bash
mkdir myproject
cd myproject
git init
git branch -M main

# Создать README
echo "# My Project" > README.md
git add README.md
git commit -m "Первый коммит"

# Создать .gitignore
echo "__pycache__/" > .gitignore
git add .gitignore
git commit -m "Добавил .gitignore"

# На GitHub создать репозиторий, потом:
git remote add origin https://github.com/username/myproject.git
git push -u origin main
```

---

## ⚠️ Частые ошибки

!!! warning "Коммитить секреты"
    `.env`, ключи, пароли — **никогда**. Проверяйте `git status` перед `git add .`.

!!! warning "Забыли `.gitignore`"
    В репозиторий попадут `__pycache__`, `.venv`, `node_modules`. Огромный
    размер, чужие артефакты.

!!! warning "Огромные коммиты"
    «Сделал всё за неделю» — плохо. Мелкие коммиты проще откатывать
    и рецензировать.

!!! warning "Плохие сообщения"
    `fix`, `update`, `WIP` — через месяц не поймёте, что было. Пишите
    «что» и «зачем».

!!! warning "`git add .` и `.env`"
    Мгновенно утекут все секреты. Если произошло — **смените все ключи**,
    удаление из истории не помогает.

---

## 🧪 Упражнения

1. ⭐ Настроить Git, создать репозиторий.
2. ⭐ Закоммитить 3 файла.
3. ⭐⭐ Создать `.gitignore` под Python-проект.
4. ⭐⭐ Посмотреть историю в `--oneline --graph`.
5. ⭐⭐ Откатить изменения в одном файле.
6. ⭐⭐⭐ Залить проект на GitHub.
7. ⭐⭐⭐ Разобрать ситуацию: случайно закоммитили `.env`.

---

## 🔗 Что дальше

→ [Ветки и слияние](branches.md).