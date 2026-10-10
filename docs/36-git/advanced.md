# Продвинутое

!!! abstract "Уровень: ⭐⭐⭐"

---

## 📌 Reset, revert, restore — в чём разница

Все три «откатывают», но по-разному.

| Команда | Что делает | Опасность |
|---|---|---|
| `git restore file` | Отменяет изменения в файле | Низкая |
| `git revert <commit>` | Создаёт **новый коммит**, отменяющий указанный | Безопасно |
| `git reset` | Двигает указатель ветки | Зависит от режима |

### `git revert` — безопасный откат

```bash
git revert a1b2c3d
```

Создаётся **новый** коммит, который делает обратное изменение. История
сохраняется. **Идеально для публичных веток.**

### `git reset` — «отмотать назад»

Три режима:

```bash
git reset --soft HEAD~1      # отменить коммит, изменения — в staging
git reset --mixed HEAD~1      # отменить коммит, изменения — в рабочей папке (по умолчанию)
git reset --hard HEAD~1        # отменить коммит И выкинуть изменения
```

⚠️ `--hard` **уничтожает** работу. Без сохранений — навсегда.

**Правило:**
- Локальные коммиты → `reset`
- Публичные коммиты → `revert`

---

## 📌 Reflog — «чёрный ящик»

Если что-то потеряли — Git помнит **всё** последние 90 дней.

```bash
git reflog
```

Выведет что-то вроде:

```
a1b2c3d HEAD@{0}: reset: moving to HEAD~1
e4f5g6h HEAD@{1}: commit: Добавил фичу
i7j8k9l HEAD@{2}: commit: Фикс
```

Можно вернуться к любому состоянию:

```bash
git reset --hard e4f5g6h
```

**Если случайно сделали `reset --hard` и потеряли коммит — он в reflog!**

---

## 📌 `git bisect` — найти баг бинарным поиском

Есть баг, но не знаете, какой коммит его внёс.

```bash
git bisect start
git bisect bad                    # текущая версия — плохая
git bisect good a1b2c3d            # этот коммит — хороший
```

Git «переключит» на середину. Проверяете — работало или нет:

```bash
git bisect good        # если в этой версии всё ок
git bisect bad          # если баг есть
```

Повторяете. Git найдёт коммит за **log₂(N)** шагов — на 1000 коммитов
за 10 шагов.

```bash
git bisect reset       # закончить
```

---

## 📌 Git Hooks — автоматизация

Скрипты в `.git/hooks/`, запускаются на события.

| Хук | Когда |
|---|---|
| `pre-commit` | Перед коммитом |
| `commit-msg` | Проверить сообщение |
| `pre-push` | Перед push |
| `post-checkout` | После checkout |
| `post-merge` | После merge |

**Пример `pre-commit`:** запуск тестов перед коммитом.

```bash
#!/bin/sh
pytest || exit 1
ruff check . || exit 1
```

Сделать исполняемым:

```bash
chmod +x .git/hooks/pre-commit
```

**Лучше — через `pre-commit` фреймворк:**

```bash
pip install pre-commit
```

**`.pre-commit-config.yaml`:**
```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

```bash
pre-commit install
```

Теперь при каждом `git commit` код автоматически проверяется и
форматируется.

---

## 📌 Submodules — вложенные репозитории

Иногда проект зависит от другого проекта.

```bash
git submodule add https://github.com/user/lib.git lib
git submodule update --init --recursive
```

**Не путайте с обычной папкой:** содержимое остаётся отдельным
репозиторием.

**Минусы:** легко запутаться. Часто проще использовать пакетный
менеджер (`pip`, `poetry`).

---

## 📌 Git LFS — большие файлы

Git плохо работает с файлами >100 МБ. **LFS** хранит их отдельно.

```bash
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
```

Файл `.gitattributes` создастся автоматически.

Применяется для датасетов, видео, 3D-моделей.

---

## 📌 Worktree — несколько рабочих папок

Хотите одновременно работать в двух ветках — без переключения:

```bash
git worktree add ../project-hotfix hotfix-branch
```

Появится **вторая папка** с той же историей, но другой веткой.

---

## 📌 Сложные операции

### Переименовать ветку (в т.ч. на remote)

```bash
git branch -m old-name new-name
git push origin -u new-name
git push origin --delete old-name
```

### Удалить файл из **всей** истории

Если случайно закоммитили большой файл или секрет:

```bash
pip install git-filter-repo
git filter-repo --path path/to/secret --invert-paths
```

⚠️ **Это перезапишет историю.** Все соавторы должны будут
переклонировать репозиторий.

### Bundling — передать репозиторий без сети

```bash
git bundle create repo.bundle --all
# передаём файл другому человеку
git clone repo.bundle new-repo
```

---

## 📌 Полезные алиасы

В `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all
    last = log -1 HEAD
    undo = reset --soft HEAD~1
    amend = commit --amend --no-edit
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
```

Теперь `git st`, `git lg`, `git undo` — на две буквы короче.

---

## 📌 Аутентификация на GitHub

**Personal Access Token (PAT)** — вместо пароля:

1. **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. **Generate new token** → выбрать scopes (`repo`, `workflow`)
3. Скопировать — **показывается один раз**

Использовать как пароль при push.

**SSH-ключ** (удобнее):

```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
```

Скопировать в **GitHub → Settings → SSH and GPG keys → New SSH key**.

Проверить:

```bash
ssh -T git@github.com
```

Менять URL на SSH:

```bash
git remote set-url origin git@github.com:user/repo.git
```

---

## 📌 Что делать, если ...

| Ситуация | Решение |
|---|---|
| Закоммитил `.env` | `git filter-repo`, сменить все секреты |
| Сделал `reset --hard`, потерял работу | `git reflog` → `git reset --hard <hash>` |
| Случайно удалил ветку | `git reflog` покажет коммит, создать заново |
| Merge пошёл не так | `git merge --abort` |
| Хочу отменить последний **публичный** коммит | `git revert HEAD` |
| Ветка разошлась с remote | `git pull --rebase` или `git push --force-with-lease` |
| Слишком много веток | `git branch --merged | xargs -n 1 git branch -d` |
| Случайно закоммитил не тот файл | `git reset --soft HEAD~1`, исправить, коммит заново |
| Надо убрать файл из индекса, оставив локально | `git rm --cached file` |

**`--force-with-lease`** — безопасный force push. Проверяет, что на
remote не появилось новых коммитов, которых у вас нет.

---

## ⚠️ Частые ошибки

!!! warning "`--force` без `--with-lease`"
    Если коллега успел запушить — потеряете его работу. Только
    `--force-with-lease`.

!!! warning "`reset --hard` без сохранения"
    Уничтожает всё не закоммиченное. **Перед** — `git status`.

!!! warning "`filter-repo` в общем репо"
    Все коллеги должны переклонировать. Предупредите заранее.

!!! warning "Секреты в старых коммитах"
    Удаление файла не помогает — он остаётся в истории. Только
    `filter-repo`. И **смените все токены**.

!!! warning "Хуки не работают"
    `.git/hooks/` не пушится. У коллег хуков не будет. Используйте
    `pre-commit` фреймворк — он ставится из репозитория.

---

## 🧪 Упражнения

1. ⭐ `git reflog` — посмотреть историю.
2. ⭐ `git revert` коммита.
3. ⭐⭐ `git reset --soft`, `--mixed`, `--hard` — попробовать все.
4. ⭐⭐ Настроить алиасы.
5. ⭐⭐ SSH-ключ для GitHub.
6. ⭐⭐⭐ `pre-commit` фреймворк с ruff.
7. ⭐⭐⭐ `git bisect` на проекте с багом.

---

## 🔗 Что дальше

→ [Linux для программиста](../37-linux/index.md).