# Частые ошибки и как их исправлять

Красный текст в терминале — не конец света. Это **подсказка** от Python: «здесь что-то не так, посмотри». Научиться читать ошибки — половина мастерства программиста.

Этот раздел — **справочник**. Возвращайтесь, когда что-то падает.

!!! tip "Как искать ошибку"
    1. **Прочитайте последнюю строку** — там тип ошибки.
    2. **Найдите строку в вашем коде**, где она возникла (номер и имя файла указаны).
    3. **Откройте нужную категорию** ниже — и найдите свою ошибку через `Ctrl + F`.
    4. Если не нашли — Google. Почти все ошибки уже кем-то решены.

---

## 🔥 ТОП-30 самых частых ошибок

От самых «популярных» у новичков — к редким.

| № | Ошибка | Что случилось | Категория |
|---|---|---|---|
| 1 | `SyntaxError: invalid syntax` | Опечатка в коде: скобка, кавычка, `:` | [Синтаксис](syntax.md) |
| 2 | `IndentationError: expected an indented block` | Забыли отступ после `if`/`for`/`def` | [Синтаксис](syntax.md) |
| 3 | `NameError: name 'x' is not defined` | Переменная не создана или опечатка | [Runtime](runtime.md) |
| 4 | `ValueError: invalid literal for int() with base 10` | `int("привет")` — не число | [Runtime](runtime.md) |
| 5 | `ModuleNotFoundError: No module named 'X'` | Библиотека не установлена | [Импорт](import.md) |
| 6 | `TypeError: unsupported operand type(s) for +` | Складываете строку и число | [Runtime](runtime.md) |
| 7 | `FileNotFoundError: [Errno 2] No such file` | Python не нашёл файл | [Импорт](import.md) |
| 8 | `'python' is not recognized` | Python не установлен или не в PATH | [Окружение](environment.md) |
| 9 | `IndentationError: unexpected indent` | Лишний отступ | [Синтаксис](syntax.md) |
| 10 | `IndexError: list index out of range` | Индекс за пределами списка | [Runtime](runtime.md) |
| 11 | `AttributeError: 'NoneType' object has no attribute` | Функция не вернула значение | [Runtime](runtime.md) |
| 12 | `KeyError: 'name'` | Ключа нет в словаре | [Runtime](runtime.md) |
| 13 | `ZeroDivisionError: division by zero` | Деление на ноль | [Runtime](runtime.md) |
| 14 | `NameError: name 'привет' is not defined` | Забыли кавычки у строки | [Runtime](runtime.md) |
| 15 | `AttributeError: 'str' object has no attribute` | У строки нет такого метода | [Runtime](runtime.md) |
| 16 | `'pip' is not recognized` | pip не в PATH | [Окружение](environment.md) |
| 17 | `UnboundLocalError: local variable referenced before assignment` | Переменная не создана до чтения | [Runtime](runtime.md) |
| 18 | `IndentationError: unindent does not match` | Смешали табы и пробелы | [Синтаксис](syntax.md) |
| 19 | `TypeError: 'int' object is not callable` | Переопределили встроенную функцию | [Runtime](runtime.md) |
| 20 | `Config file 'mkdocs.yml' does not exist` | Не в той папке запустили mkdocs | [Git и MkDocs](git-mkdocs.md) |
| 21 | `Permission denied` (pip) | Нет прав / нужен venv | [Окружение](environment.md) |
| 22 | `SyntaxError: invalid character '«' (U+00AB)` | Русские кавычки вместо `"` | [Синтаксис](syntax.md) |
| 23 | `SyntaxError: 'return' outside function` | `return` вне функции | [Синтаксис](syntax.md) |
| 24 | `SyntaxError: 'break' outside loop` | `break` вне цикла | [Синтаксис](syntax.md) |
| 25 | `fatal: not a git repository` | Нет репозитория в текущей папке | [Git и MkDocs](git-mkdocs.md) |
| 26 | `Author identity unknown` | Git не знает, кто вы | [Git и MkDocs](git-mkdocs.md) |
| 27 | `RecursionError: maximum recursion depth exceeded` | Рекурсия без остановки | [Runtime](runtime.md) |
| 28 | `error: failed to push some refs` | На GitHub есть чужие коммиты | [Git и MkDocs](git-mkdocs.md) |
| 29 | `UnicodeDecodeError: 'utf-8' codec can't decode` | Файл не в UTF-8 | [Runtime](runtime.md) |
| 30 | `ImportError: Bad git executable` | Нет Git для плагина MkDocs | [Git и MkDocs](git-mkdocs.md) |

---

## 📂 Все ошибки по категориям

### 🔤 Синтаксис — Python не может прочитать код

[SyntaxError, IndentationError, TabError, invalid character, return outside function, break outside loop, f-string.](syntax.md)

### 💥 Во время работы — программа запустилась и упала

[ValueError, TypeError, NameError, IndexError, KeyError, AttributeError, ZeroDivisionError, UnboundLocalError, RecursionError, UnicodeDecodeError.](runtime.md)

### 📥 Импорт и файлы

[ModuleNotFoundError, ImportError, FileNotFoundError, IsADirectoryError, PermissionError, OSError.](import.md)

### ⚙️ Окружение — терминал, Python, pip, venv

['python' not recognized, 'pip' not found, Fatal error in launcher, externally-managed-environment, Microsoft Visual C++, SSL errors.](environment.md)

### 🐙 Git и MkDocs

[Author identity unknown, not a git repository, failed to push, merge conflict, mkdocs.yml does not exist, Bad git executable, Actions fails.](git-mkdocs.md)

---

## 📖 Как читать Python-ошибку

Пример:

```
Traceback (most recent call last):
  File "app.py", line 5, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero
```

Читаем **снизу вверх**:

1. **`ZeroDivisionError: division by zero`** — **тип** ошибки и объяснение
2. **`app.py, line 5`** — файл и строка
3. **`result = 10 / 0`** — код, который упал
4. **`<module>`** — в каком месте (функции) упало

Если в стэке несколько строк — смотрите **самую нижнюю свою**. Верхние — это «как мы сюда попали».

---

## 🎯 Три самых частых причины всех ошибок

1. **Опечатка** — пропущена буква, не та скобка.
2. **Не тот тип** — сложили строку с числом.
3. **Забыли установить/импортировать** — библиотека не поставлена.

В 90% случаев достаточно **внимательно перечитать код** и сверить с примером.

---

## 📖 Правило хорошего ученика

!!! quote "Ошибка — это не приговор"
    Даже программисты с 20-летним стажем видят ошибки **каждый день**.
    Разница в том, что они **быстро понимают**, что не так, и **знают,
    где смотреть**.

    Ваша задача — не «никогда не ошибаться», а **научиться читать сообщения**
    Python и не паниковать.

---

## 🔗 Что дальше

→ Выберите категорию и найдите свою ошибку через `Ctrl + F`:

- [Синтаксис](syntax.md) — опечатки, отступы, скобки
- [Во время работы](runtime.md) — `ValueError`, `TypeError`, `IndexError`
- [Импорт и пути](import.md) — библиотеки, файлы
- [Окружение](environment.md) — Python, pip, venv, PATH
- [Git и MkDocs](git-mkdocs.md) — пуш, конфликты, сборка сайта