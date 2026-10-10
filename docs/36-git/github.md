# GitHub и командная работа

!!! abstract "Уровень: ⭐⭐"

---

## 📌 Что такое GitHub

**GitHub** — хостинг Git-репозиториев. Здесь живёт **весь** open-source.
Ваш профиль на GitHub — это ваше портфолио как программиста.

Аналоги: **GitLab**, **Bitbucket**, **Gitea** (для своих серверов).

---

## 📌 Форк и Pull Request

**Сценарий:** вы хотите предложить изменение в чужой проект.

1. **Fork** — копия репозитория в ваш аккаунт (одна кнопка на GitHub).
2. **Clone** свою копию:

```bash
git clone https://github.com/ваш-ник/project.git
```

3. Создать ветку, внести изменения, запушить:

```bash
git switch -c fix-typo
...
git push -u origin fix-typo
```

4. На GitHub — **Compare & pull request**.

5. В **PR** опишите: что изменили и зачем.

6. Автор репозитория **reviews** — комментирует, просит исправить.

7. После апрува — **Merge**.

---

## 📌 Работа в команде

Стандартный flow:

```bash
# 1. Форк (если вы не в команде) или прямой доступ
# 2. Клон
git clone URL
cd project

# 3. Создание ветки под задачу
git switch -c feature/user-profile

# 4. Работа, коммиты
...

# 5. Актуализация main
git fetch origin
git rebase origin/main

# 6. Push
git push -u origin feature/user-profile

# 7. PR на GitHub
# 8. Code review
# 9. Merge
# 10. Локально обновить main
git switch main
git pull
git branch -d feature/user-profile
```

---

## 📌 Code Review

**Зачем:** ловим баги, делимся знаниями, поддерживаем качество.

**Что смотреть:**
- Логика верна?
- Нет ли уязвимостей?
- Читаемо ли?
- Тесты есть?
- Не осталось ли `TODO`, `print`, отладочного кода?

**Как комментировать:**

- ✅ «Может, вынести это в функцию — будет понятнее?»
- ✅ «Здесь может быть SQL-инъекция: давай параметризуем»
- ❌ «Это плохо»
- ❌ «Перепиши всё»

---

## 📌 Issues

**Issue** — задача, баг, идея. Любой может создать.

**Хорошее issue:**

```
Заголовок: При отправке пустой формы падает приложение

Шаги воспроизведения:
1. Открыть /login
2. Оставить поля пустыми
3. Нажать «Войти»

Ожидалось: сообщение «Поля обязательны»
Получил: 500 ошибка

Версия: Python 3.12, Chrome 120
```

---

## 📌 Профиль на GitHub

**README профиля** — репозиторий с таким же именем, как ваш ник.
Появится на главной.

**`username/username/README.md`:**
```markdown
# Привет, я Аня 👋

🐍 Python-разработчик, учусь в 10 классе.

## Мои проекты
- [Telegram-бот погоды](https://github.com/username/weather-bot)
- [Дневник на Flask](https://github.com/username/diary)
- [Учебник по Python](https://github.com/username/python-learn)

## Стек
Python, Flask, FastAPI, SQL, Git, Linux

## Контакты
- Email: anya@example.com
- Telegram: @anya_codes
```

---

## 📌 Статистика и бейджи

- **GitHub Stats** — карточки с активностью: `github-readme-stats`
- **Shields.io** — бейджи («Python 3.12», «License MIT»)
- **Streak Stats** — сколько дней подряд коммитите

Помогает выделиться, но **важнее реальные проекты**.

---

## 📌 Организации и команды

**Организация** — групповой аккаунт. Участники — с разными правами.

**Основные роли:**
- **Owner** — владелец
- **Maintainer** — поддерживает
- **Member** — участник
- **Outside collaborator** — внешний

**Branch protection rules:** правило «нельзя пушить в main напрямую,
только через PR с апрувом».

---

## 📌 Release и версии

**Release** — «выпуск» проекта с описанием изменений.

```bash
git tag v1.0.0
git push origin v1.0.0
```

На GitHub — **Releases** → Create new release → выбрать тег.

**Semantic Versioning:** `MAJOR.MINOR.PATCH`

- `MAJOR` — ломающие изменения
- `MINOR` — новая функциональность
- `PATCH` — баг-фиксы

---

## 📌 LICENSE

Файл `LICENSE` в корне репозитория.

| Лицензия | Что разрешает |
|---|---|
| MIT | Всё, лишь укажи автора |
| Apache 2.0 | То же + патентная защита |
| BSD | Похоже на MIT |
| GPL | Изменения тоже под GPL |
| AGPL | + для сетевых сервисов |

**Для учебных проектов:** MIT — самый дружелюбный.

---

## 💡 Полный пример — предложить фикс в open-source

```bash
# 1. Fork чужого репозитория на GitHub

# 2. Clone
git clone https://github.com/ваш-ник/python-awesome.git
cd python-awesome

# 3. Новая ветка
git switch -c fix/typo-in-readme

# 4. Правка
# ... редактируете README.md
git add README.md
git commit -m "Исправил опечатку в разделе установки"

# 5. Push
git push -u origin fix/typo-in-readme

# 6. На GitHub — Compare & pull request
# 7. Описать изменения
# 8. Ждать review
```

---

## ⚠️ Частые ошибки

!!! warning "Секреты в открытом репозитории"
    GitHub автоматически сканирует на токены. Если найдёт — предупредит.
    Но всё равно: `.env` — в `.gitignore`, **всегда**.

!!! warning "Force push в main"
    Перезапишет историю. Никогда без веских причин.

!!! warning "Огромные PR"
    1000 изменённых строк никто не будет ревьюить. Разбивайте на
    маленькие PR по 100–300 строк.

!!! warning "Merge без review"
    Пропустите баг — будет больно. Ревью всегда.

!!! warning "Коммиты без описания"
    «fix» — не описание. Пишите «что» и «зачем».

---

## 🧪 Упражнения

1. ⭐ Создать репозиторий и залить проект.
2. ⭐ Оформить README профиля.
3. ⭐⭐ Сделать fork и PR в чужой проект.
4. ⭐⭐ Разрешить комментарии ревьюера.
5. ⭐⭐ Создать issue и связать с PR через `Fixes #N`.
6. ⭐⭐⭐ Сделать release с тегом.
7. ⭐⭐⭐ Настроить branch protection в своём репозитории.

---

## 🔗 Что дальше

→ [Продвинутое](advanced.md).