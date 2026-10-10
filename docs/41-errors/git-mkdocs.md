# Ошибки Git и MkDocs

Ваш учебник живёт на GitHub и собирается через MkDocs. Здесь — ошибки,
которые возникают именно в этом процессе.

---

## 🐙 Git

### ❌ `Author identity unknown. Please tell me who you are`

**Что видишь:**

```
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

**Почему:** Git не знает, кто вы. Первая настройка.

**Как исправить:**

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "you@example.com"
```

Email — **тот же**, что на GitHub (или `username@users.noreply.github.com`).

---

### ❌ `fatal: not a git repository`

**Что видишь:**

```
fatal: not a git repository (or any of the parent directories): .git
```

**Почему:** запускаете `git` в папке, где **нет репозитория**.

**Как исправить:**

1. Проверьте, что вы в правильной папке: `pwd` / `cd`.
2. Если репозиторий ещё не создан: `git init`.
3. Если склонировали — зайдите в папку репозитория: `cd project`.

---

### ❌ `fatal: remote origin already exists`

**Что видишь:**

```
fatal: remote origin already exists.
```

**Почему:** пытаетесь добавить `origin`, когда он уже есть.

**Как исправить:**

```bash
# Поменять URL
git remote set-url origin https://github.com/user/repo.git

# Или удалить и добавить заново
git remote remove origin
git remote add origin https://github.com/user/repo.git
```

---

### ❌ `fatal: repository 'https://...' not found`

**Что видишь:**

```
remote: Repository not found.
fatal: repository 'https://github.com/user/repo.git/' not found
```

**Почему:**

1. **Опечатка** в URL.
2. Репозиторий **не создан** на GitHub.
3. Нет **прав** (приватный репозиторий, вы не автор).

**Как исправить:**

1. Откройте URL в браузере — есть ли он?
2. Если нет — создайте: **https://github.com/new**.
3. Проверьте свой remote:

```bash
git remote -v
```

---

### ❌ `error: failed to push some refs to ...`

**Что видишь:**

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/...'
hint: Updates were rejected because the remote contains work that you do
```

**Почему:** на GitHub есть коммиты, которых нет у вас. Например, вы
создали репозиторий **с README** (а не пустой).

**Как исправить:**

```bash
git pull --rebase origin main
git push
```

Или, если хотите **затереть** чужое (осторожно!):

```bash
git push --force-with-lease
```

`--force-with-lease` **безопаснее**, чем `--force`.

---

### ❌ `error: Your local changes would be overwritten by merge`

**Что видишь:**

```
error: Your local changes to the following files would be overwritten by merge:
    file.txt
Please commit your changes or stash them before you merge.
```

**Почему:** у вас есть незакоммиченные изменения, а `git pull` хочет
перезаписать файлы.

**Как исправить:**

**Вариант 1.** Сохранить изменения:

```bash
git stash
git pull
git stash pop
```

**Вариант 2.** Закоммитить:

```bash
git add .
git commit -m "Сохранил изменения"
git pull
```

**Вариант 3.** Выбросить (осторожно!):

```bash
git restore .
git pull
```

---

### ❌ `Permission denied (publickey)`

**Что видишь:**

```
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

**Почему:** используете **SSH-URL**, но SSH-ключ не настроен.

**Как исправить:**

**Вариант 1.** Переключитесь на HTTPS:

```bash
git remote set-url origin https://github.com/user/repo.git
```

**Вариант 2.** Настройте SSH-ключ:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
```

Скопируйте вывод в **GitHub → Settings → SSH and GPG keys → New SSH key**.

Проверьте:

```bash
ssh -T git@github.com
```

---

### ❌ `Support for password authentication was removed`

**Что видишь:**

```
remote: Support for password authentication was removed on August 13, 2021.
fatal: Authentication failed
```

**Почему:** GitHub больше не принимает **пароль** — только **токен** или
**SSH-ключ**.

**Как исправить:**

1. **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token** → выбрать scopes `repo`, `workflow`
3. Скопировать токен.
4. При `git push` ввести **токен** вместо пароля.

Или настройте **SSH-ключ** (см. выше).

---

### ❌ `merge conflict in file.txt`

**Что видишь:**

```
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

**Почему:** одна и та же строка изменена по-разному.

**Как исправить:**

1. Откройте `file.txt` — увидите маркеры:

```
<<<<<<< HEAD
Ваш вариант
=======
Чужой вариант
>>>>>>> branch-name
```

2. **Выберите** нужный вариант (или объедините). **Удалите** маркеры.

3. Сохраните, добавьте, закоммитьте:

```bash
git add file.txt
git commit -m "Разрешил конфликт"
```

В VS Code конфликты показываются с кнопками **Accept Current / Incoming /
Both** — гораздо проще.

---

### ❌ `fatal: refusing to merge unrelated histories`

**Что видишь:**

```
fatal: refusing to merge unrelated histories
```

**Почему:** две ветки с **разной историей** — например, локальный `git init`
и удалённый репозиторий с README.

**Как исправить:**

```bash
git pull --allow-unrelated-histories
```

---

### ❌ `error: pathspec 'file.txt' did not match any file(s) known to git`

**Что видишь:**

```
error: pathspec 'file.txt' did not match any file(s) known to git
```

**Почему:** файл `file.txt` — не отслеживается Git'ом. Например, он в
`.gitignore` или опечатка в имени.

**Как исправить:**

1. Проверьте имя: `ls file.txt` / `dir file.txt`.
2. Проверьте `.gitignore`.
3. Добавьте файл: `git add file.txt`.

---

## 📖 MkDocs

### ❌ `Config file 'mkdocs.yml' does not exist`

**Что видишь:**

```
Error: Config file 'mkdocs.yml' does not exist.
```

**Почему:** вы **не в той папке**. `mkdocs` ищет `mkdocs.yml` в текущей
директории.

**Как исправить:**

```bash
cd python-learn           # перейти в папку проекта
mkdocs serve
```

Проверить:

```bash
dir mkdocs.yml           # Windows
ls mkdocs.yml             # macOS/Linux
```

---

### ❌ `Config value 'nav': A reference to 'X.md' is included in the 'nav' configuration, but the file does not exist`

**Что видишь:**

```
WARNING - Config value 'nav': A reference to 'X.md' is included in the
'nav' configuration, but this file does not exist
```

**Почему:** в `mkdocs.yml` указан файл, которого **нет в папке `docs/`**.

**Как исправить:**

1. Проверьте, что файл есть:

```bash
dir docs/01-basics/variables.md
```

2. Если файла нет — создайте (пустую заглушку тоже годится).
3. Или удалите строку из `nav:` в `mkdocs.yml`.

---

### ❌ `ImportError: Bad git executable`

**Что видишь:**

```
ImportError: Bad git executable.
The git executable must be specified in one of the following ways:
```

**Почему:** плагин `mkdocs-git-revision-date-localized` требует Git, но
Git не установлен или не в PATH.

**Как исправить:**

**Вариант 1.** Установите Git: **https://git-scm.com/download/win**
(все галочки по умолчанию).

**Вариант 2.** Уберите плагин из `mkdocs.yml`:

```yaml
plugins:
  - search:
      lang: ru
```

(Удалите блок `git-revision-date-localized`.)

---

### ❌ `InvalidGitRepositoryError`

**Что видишь:**

```
git.exc.InvalidGitRepositoryError: F:\...\docs
```

**Почему:** плагин дат ищет `.git`, но репозиторий не инициализирован.

**Как исправить:**

**Вариант 1.** `git init` в папке проекта.

**Вариант 2.** Добавить `fallback_to_build_date`:

```yaml
plugins:
  - search:
      lang: ru
  - git-revision-date-localized:
      type: date
      locale: ru
      fallback_to_build_date: true
```

---

### ❌ `ModuleNotFoundError: No module named 'mkdocs'`

**Что видишь:**

```
ModuleNotFoundError: No module named 'mkdocs'
```

**Почему:** MkDocs не установлен (или установлен не в тот Python).

**Как исправить:**

```bash
pip install -r requirements.txt
```

Или:

```bash
python -m pip install mkdocs-material
```

Проверьте:

```bash
mkdocs --version
```

---

### ❌ `mkdocs: command not found`

**Как исправить:**

```bash
python -m mkdocs serve
```

Работает всегда, даже если `mkdocs` не в PATH.

---

### ❌ Предупреждение от Material for MkDocs (жёлтый текст)

**Что видишь:**

```
│  ⚠  Warning from the Material for MkDocs team
│  MkDocs 2.0, the underlying framework of Material for MkDocs,
│  will introduce backward-incompatible changes...
```

**Это НЕ ошибка.** Это анонс будущих изменений. Сайт соберётся нормально.

**Что делать:** игнорировать. Если раздражает — обновите тему позже:

```bash
pip install --upgrade mkdocs-material
```

---

## 🌐 GitHub Pages и Actions

### ❌ Actions показывает красный крест на «Deploy docs»

**Как найти ошибку:**

1. Откройте вкладку **Actions** в репозитории.
2. Кликните на упавший workflow.
3. Кликните на job `deploy`.
4. Разверните шаги — тот, где красный крест, содержит **текст ошибки**.

**Частые причины:**

| Ошибка в логе | Что делать |
|---|---|
| `Config file 'mkdocs.yml' does not exist` | Проверьте, что файл в корне репозитория, и `git push` прошёл |
| `A reference to 'X.md'... does not exist` | Создайте отсутствующий файл или уберите из `nav` |
| `ModuleNotFoundError: mkdocs` | Проверьте `requirements.txt` — там должен быть `mkdocs-material` |
| `Permission denied` | Добавьте `permissions: contents: write` в workflow |

---

### ❌ Сайт открывается, но показывает 404

**Почему:**

1. **Прошло меньше минуты** после пуша. Подождите.
2. **GitHub Pages не включены**. Settings → Pages → Source: `gh-pages` → Save.
3. **Ветка `gh-pages` не создана**. Actions ещё не прошёл.
4. **Кеш браузера**. Нажмите `Ctrl + F5`.

**Как проверить:**

Откройте **https://github.com/USERNAME/REPO/actions** — там должен быть
зелёный workflow.

Затем **Settings → Pages** — должно быть написано:

```
Your site is live at https://USERNAME.github.io/REPO/
```

---

### ❌ Обновил файл, но на сайте не видно

**Почему:**

1. **Забыли `git push`.** Проверьте: `git log` — есть ли ваш коммит?
2. **Actions ещё не завершился.** Подождите 30–60 секунд.
3. **Кеш.** `Ctrl + F5`.

---

### ❌ На GitHub Pages пустая страница или белый экран

**Почему:**

1. **`docs/index.md` пустой** — проверьте содержимое.
2. **Ошибка сборки.** Смотрите Actions.
3. **CSS не загрузился** — если в `mkdocs.yml` неправильный `site_url`.

**Проверьте:**

```yaml
site_url: https://Dubstepcharts.github.io/python-learn/
```

Обязательно с `/` в конце и **точным** именем репозитория.

---

## 📌 Универсальные правила

!!! tip "Читайте последнюю строку ошибки"
    Там **тип** и краткое объяснение. Стек-трейс — детали.

!!! tip "Google — ваш друг"
    Скопируйте текст ошибки (без личных путей) — 99% уже решены.

!!! tip "Проверьте простейшее"
    - В правильной ли папке я?
    - Сохранил ли я файл?
    - Запустил ли `git push`?
    - Обновил ли страницу через `Ctrl + F5`?

!!! tip "Одна ошибка за раз"
    Если ошибок много — исправляйте **по одной**. Не начинайте новую,
    пока не починили текущую.

!!! warning "Не бойтесь force push"
    В **личном** репозитории `git push --force-with-lease` — нормально.
    Только не используйте в общих репозиториях.

---

## 🔗 Что дальше

→ Справочник завершён. Возвращайтесь сюда каждый раз, когда видите
красный текст — и со временем начнёте **узнавать** ошибки с первого
взгляда.