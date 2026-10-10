# Ветки и слияние

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"

---

## 🍎 Объясняем просто

!!! example "Ветка — параллельная вселенная"
    Основная ветка `main` — «боевая». Хочешь новую фичу — создаёшь
    **ветку** и экспериментируешь там. Основной код не трогается. Когда
    готово — **сливаешь** обратно.

    Это как черновик: пишешь отдельно, потом переносишь в чистовик.

---

## 📌 Основные команды

```bash
git branch                    # список веток
git branch feature-x           # создать ветку
git checkout feature-x          # переключиться
git switch feature-x             # то же, современнее
git checkout -b feature-x         # создать + переключиться
git switch -c feature-x            # то же

git branch -d feature-x            # удалить (если влита)
git branch -D feature-x             # удалить силой

git branch -m old new               # переименовать
```

---

## 📌 Слияние (`merge`)

```bash
git switch main
git merge feature-x
```

Git объединит изменения из `feature-x` в `main`.

### Fast-forward

Если в `main` **не было** новых коммитов с момента создания ветки, Git
просто «перенесёт» указатель вперёд — никаких merge-коммитов.

### Три-сторонний merge

Если в `main` тоже были коммиты, Git создаст **merge-коммит** с двумя
родителями.

```
      A---B---C  main
     /         \
D---E---F---G---M  feature-x → merge commit
```

Полезные опции:

```bash
git merge --no-ff feature-x     # всегда создавать merge-коммит
git merge --squash feature-x     # схлопнуть все коммиты ветки в один
git merge --abort                 # отменить merge
```

---

## 📌 Конфликты

Возникают, если **одну и ту же строку** изменили в двух ветках.

```
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

**Что делать:**

1. Открыть файл — увидите:

```
<<<<<<< HEAD
Текст из main
=======
Текст из feature-x
>>>>>>> feature-x
```

2. **Выбрать нужный вариант** (или объединить) и **удалить маркеры** `<<<<<<<`, `=======`, `>>>>>>>`.

3. Сохранить, добавить, закоммитить:

```bash
git add file.txt
git commit
```

**Полезные команды при конфликте:**

```bash
git status                # какие файлы конфликтуют
git diff                   # посмотреть конфликты
git merge --abort          # отменить весь merge
git mergetool              # открыть визуальный редактор конфликтов
```

В VS Code конфликты показываются красиво: над текущей версией — кнопки
«Accept Current», «Accept Incoming», «Accept Both».

---

## 📌 Rebase — альтернатива merge

**Rebase** «переписывает» историю: ваши коммиты как будто сделаны
**после** последнего коммита другой ветки.

```
До:
      A---B---C  main
     /
D---E---F---G      feature

После (git rebase main):
              A---B---C  main
             /
D---E---F'---G'    feature
```

```bash
git switch feature
git rebase main
```

**Плюсы rebase:** линейная, чистая история.

**Минусы:** перезаписывает коммиты. **Никогда не делайте rebase ветки,
которую уже отправили в общий репозиторий!** Иначе у коллег будет хаос.

**Правило:**
- `merge` — для публичных веток
- `rebase` — для личных, ещё не отправленных

---

## 📌 Интерактивный rebase

Позволяет **переписать** несколько коммитов сразу:

```bash
git rebase -i HEAD~5     # редактируем последние 5
```

Откроется список с командами:

```
pick a1b2c3d Добавил кнопку
pick e4f5g6h Fix
pick i7j8k9l Ещё fix
pick m0n1o2p Финализация
```

Можно заменить `pick` на:

| Команда | Что делает |
|---|---|
| `pick` | Оставить |
| `reword` | Изменить сообщение |
| `edit` | Изменить сам коммит |
| `squash` | Слить с предыдущим |
| `fixup` | Слить с предыдущим **без сообщения** |
| `drop` | Удалить |

**Классический приём:** «схлопнуть» несколько мелких коммитов в один
перед отправкой.

Пример:

```
pick a1b2c3d Добавил кнопку
squash e4f5g6h Fix
squash i7j8k9l Ещё fix
reword m0n1o2p Финализация
```

→ Один коммит с сообщением от первого.

---

## 📌 Cherry-pick — взять один коммит

Иногда нужно **перенести один коммит** из одной ветки в другую.

```bash
git switch main
git cherry-pick a1b2c3d
```

В `main` появится копия коммита из другой ветки.

---

## 📌 Stash — временно отложить

Если нужно быстро переключиться на другую ветку, а текущие изменения ещё
не готовы к коммиту:

```bash
git stash                    # отложить всё
git stash push -m "в работе"   # с описанием

git stash list                 # список

git stash pop                   # вернуть последний и удалить
git stash apply                  # вернуть, но оставить в списке
git stash drop                   # удалить последний
git stash clear                   # удалить все
```

---

## 💡 Типичная работа с фичей

```bash
# 1. Создаём ветку от актуального main
git switch main
git pull
git switch -c feature/login

# 2. Работаем, коммитим
git add .
git commit -m "Добавил форму логина"

git add .
git commit -m "Валидация email"

# 3. Обновляем main, чтобы не отставать
git switch main
git pull

# 4. Переносим ветку на свежий main (rebase, если ветка личная)
git switch feature/login
git rebase main

# 5. Сливаем в main (если работаем локально)
git switch main
git merge --no-ff feature/login

# 6. Или пушим и делаем PR (если работаем в команде)
git push -u origin feature/login
```

---

## 📌 Типичные сценарии

**«Отменить последний коммит, но сохранить изменения»:**

```bash
git reset --soft HEAD~1
```

**«Отменить последний коммит и убрать изменения»:**

```bash
git reset --hard HEAD~1
```

**«Переключиться, но ветка не даёт из-за изменений»:**

```bash
git stash
git switch main
...
git switch -
git stash pop
```

**«Я запутался, где я»:**

```bash
git status                # текущее состояние
git branch                # где звёздочка
git log --oneline --graph --all -20
```

---

## ⚠️ Частые ошибки

!!! warning "Rebase публичной ветки"
    Сломает историю у всех. Никогда.

!!! warning "`reset --hard` без сохранения"
    Удалит всё не закоммиченное **навсегда**. Перед — `git status`.

!!! warning "Долгие merge-конфликты"
    Мелкие коммиты → мелкие конфликты. Большие — наоборот.

!!! warning "Много веток с мусором"
    Удаляйте слитые: `git branch -d old-feature`. Проверить:
    `git branch --merged`.

---

## 🧪 Упражнения

1. ⭐ Создать ветку, закоммитить, слить в main.
2. ⭐ Создать конфликт, разрешить его вручную.
3. ⭐⭐ Сделать rebase ветки.
4. ⭐⭐ Интерактивный rebase: схлопнуть 3 коммита в 1.
5. ⭐⭐ Cherry-pick коммита.
6. ⭐⭐⭐ Полный цикл feature-branch и PR на GitHub.
7. ⭐⭐⭐ Стэш и возврат к работе.

---

## 🔗 Что дальше

→ [GitHub и командная работа](github.md).