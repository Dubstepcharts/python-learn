# Частые ошибки и как их исправлять

Красный текст в терминале — не конец света. Это **подсказка** от Python: «здесь что-то не так, посмотри». Научиться читать ошибки — половина мастерства программиста.

Этот раздел — **справочник**. Возвращайтесь, когда что-то падает.

!!! tip "Как искать ошибку"
    1. **Прочитайте последнюю строку** — там тип ошибки.
    2. **Найдите строку в вашем коде**, где она возникла (номер и имя файла указаны).
    3. **Найдите свою ошибку в таблице ниже** — кликните на неё.
    4. Если не нашли — Google. Почти все ошибки уже кем-то решены.

---

## 🔥 ТОП-30 самых частых ошибок

От самых «популярных» у новичков — к редким.

| № | Ошибка | Что случилось | Разбор |
|---|---|---|---|
| 1 | `SyntaxError: invalid syntax` | Опечатка в коде: скобка, кавычка, `:` | [→](syntax.md#syntaxerror-invalid-syntax) |
| 2 | `IndentationError: expected an indented block` | Забыли отступ после `if`/`for`/`def` | [→](syntax.md#indentationerror-expected-an-indented-block) |
| 3 | `NameError: name 'x' is not defined` | Переменная не создана или опечатка | [→](runtime.md#nameerror-name-x-is-not-defined) |
| 4 | `ValueError: invalid literal for int() with base 10` | `int("привет")` — не число | [→](runtime.md#valueerror-invalid-literal-for-int-with-base-10-привет) |
| 5 | `ModuleNotFoundError: No module named 'X'` | Библиотека не установлена | [→](import.md#modulenotfounderror-no-module-named-requests) |
| 6 | `TypeError: unsupported operand type(s) for +` | Складываете строку и число | [→](runtime.md#typeerror-unsupported-operand-types-for--int-and-str) |
| 7 | `FileNotFoundError: [Errno 2] No such file` | Python не нашёл файл | [→](import.md#filenotfounderror-errno-2-no-such-file-or-directory-datacsv) |
| 8 | `'python' is not recognized` | Python не установлен или не в PATH | [→](environment.md#python-is-not-recognized-as-an-internal-or-external-command-windows) |
| 9 | `IndentationError: unexpected indent` | Лишний отступ | [→](syntax.md#indentationerror-unexpected-indent) |
| 10 | `IndexError: list index out of range` | Индекс за пределами списка | [→](runtime.md#indexerror-list-index-out-of-range) |
| 11 | `AttributeError: 'NoneType' object has no attribute` | Функция не вернула значение | [→](runtime.md#attributeerror-nonetype-object-has-no-attribute-x) |
| 12 | `KeyError: 'name'` | Ключа нет в словаре | [→](runtime.md#keyerror-name) |
| 13 | `ZeroDivisionError: division by zero` | Деление на ноль | [→](runtime.md#zerodivisionerror-division-by-zero) |
| 14 | `NameError: name 'привет' is not defined` | Забыли кавычки у строки | [→](runtime.md#nameerror-name-привет-is-not-defined) |
| 15 | `AttributeError: 'str' object has no attribute` | У строки нет такого метода | [→](runtime.md#attributeerror-str-object-has-no-attribute-append) |
| 16 | `'pip' is not recognized` | pip не в PATH | [→](environment.md#pip-command-not-found) |
| 17 | `UnboundLocalError: local variable referenced before assignment` | Переменная не создана до чтения | [→](runtime.md#unboundlocalerror-local-variable-x-referenced-before-assignment) |
| 18 | `IndentationError: unindent does not match` | Смешали табы и пробелы | [→](syntax.md#indentationerror-unindent-does-not-match) |
| 19 | `TypeError: 'int' object is not callable` | Переопределили встроенную функцию | [→](runtime.md#typeerror-int-object-is-not-callable) |
| 20 | `Config file 'mkdocs.yml' does not exist` | Не в той папке запустили mkdocs | [→](git-mkdocs.md#config-file-mkdocsyml-does-not-exist) |
| 21 | `Permission denied` (pip) | Нет прав / нужен venv | [→](environment.md#permission-denied-при-pip-install-linuxmacos) |
| 22 | `SyntaxError: invalid character '«' (U+00AB)` | Русские кавычки вместо `"` | [→](syntax.md#syntaxerror-invalid-character--u00ab) |
| 23 | `SyntaxError: 'return' outside function` | `return` вне функции | [→](syntax.md#syntaxerror-return-outside-function) |
| 24 | `SyntaxError: 'break' outside loop` | `break` вне цикла | [→](syntax.md#syntaxerror-break-outside-loop) |
| 25 | `fatal: not a git repository` | Нет репозитория в текущей папке | [→](git-mkdocs.md#fatal-not-a-git-repository) |
| 26 | `Author identity unknown` | Git не знает, кто вы | [→](git-mkdocs.md#author-identity-unknown-please-tell-me-who-you-are) |
| 27 | `RecursionError: maximum recursion depth exceeded` | Рекурсия без остановки | [→](runtime.md#recursionerror-maximum-recursion-depth-exceeded) |
| 28 | `error: failed to push some refs` | На GitHub есть чужие коммиты | [→](git-mkdocs.md#error-failed-to-push-some-refs-to-) |
| 29 | `UnicodeDecodeError: 'utf-8' codec can't decode` | Файл не в UTF-8 | [→](runtime.md#unicodedecodeerror-utf-8-codec-cant-decode-byte-) |
| 30 | `ImportError: Bad git executable` | Нет Git для плагина MkDocs | [→](git-mkdocs.md#importerror-bad-git-executable) |

---

## 📂 Все ошибки по категориям

### 🔤 Синтаксис — Python не может прочитать код

| Ошибка | Разбор |
|---|---|
| `SyntaxError: invalid syntax` | [→](syntax.md#syntaxerror-invalid-syntax) |
| `SyntaxError: invalid character '«'` | [→](syntax.md#syntaxerror-invalid-character--u00ab) |
| `SyntaxError: 'return' outside function` | [→](syntax.md#syntaxerror-return-outside-function) |
| `SyntaxError: 'break' outside loop` | [→](syntax.md#syntaxerror-break-outside-loop) |
| `SyntaxError: cannot assign to literal` | [→](syntax.md#syntaxerror-cannot-assign-to-literal) |
| `SyntaxError: EOL while scanning string literal` | [→](syntax.md#syntaxerror-eol-while-scanning-string-literal) |
| `SyntaxError: f-string: expecting '}'` | [→](syntax.md#syntaxerror-f-string-expecting-) |
| `IndentationError: expected an indented block` | [→](syntax.md#indentationerror-expected-an-indented-block) |
| `IndentationError: unexpected indent` | [→](syntax.md#indentationerror-unexpected-indent) |
| `IndentationError: unindent does not match` | [→](syntax.md#indentationerror-unindent-does-not-match) |
| `TabError: inconsistent use of tabs and spaces` | [→](syntax.md#taberror-inconsistent-use-of-tabs-and-spaces) |

### 💥 Во время работы — программа запустилась и упала

| Ошибка | Разбор |
|---|---|
| `ValueError: invalid literal for int()` | [→](runtime.md#valueerror-invalid-literal-for-int-with-base-10-привет) |
| `TypeError: unsupported operand type(s) for +` | [→](runtime.md#typeerror-unsupported-operand-types-for--int-and-str) |
| `TypeError: can only concatenate str` | [→](runtime.md#typeerror-can-only-concatenate-str-not-int-to-str) |
| `TypeError: 'int' object is not callable` | [→](runtime.md#typeerror-int-object-is-not-callable) |
| `NameError: name 'x' is not defined` | [→](runtime.md#nameerror-name-x-is-not-defined) |
| `NameError: name 'привет' is not defined` | [→](runtime.md#nameerror-name-привет-is-not-defined) |
| `IndexError: list index out of range` | [→](runtime.md#indexerror-list-index-out-of-range) |
| `KeyError: 'name'` | [→](runtime.md#keyerror-name) |
| `AttributeError: 'str' object has no attribute` | [→](runtime.md#attributeerror-str-object-has-no-attribute-append) |
| `AttributeError: 'NoneType' object has no attribute` | [→](runtime.md#attributeerror-nonetype-object-has-no-attribute-x) |
| `ZeroDivisionError: division by zero` | [→](runtime.md#zerodivisionerror-division-by-zero) |
| `UnboundLocalError: local variable` | [→](runtime.md#unboundlocalerror-local-variable-x-referenced-before-assignment) |
| `RecursionError: maximum recursion depth` | [→](runtime.md#recursionerror-maximum-recursion-depth-exceeded) |
| `UnicodeDecodeError: 'utf-8' codec` | [→](runtime.md#unicodedecodeerror-utf-8-codec-cant-decode-byte-) |

### 📥 Импорт и файлы

| Ошибка | Разбор |
|---|---|
| `ModuleNotFoundError: No module named 'X'` | [→](import.md#modulenotfounderror-no-module-named-requests) |
| `ImportError: cannot import name 'X'` | [→](import.md#importerror-cannot-import-name-x-from-y) |
| `ImportError: attempted relative import` | [→](import.md#importerror-attempted-relative-import-with-no-known-parent-package) |
| `FileNotFoundError: [Errno 2]` | [→](import.md#filenotfounderror-errno-2-no-such-file-or-directory-datacsv) |
| `IsADirectoryError: [Errno 21]` | [→](import.md#isadirectoryerror-errno-21-is-a-directory) |
| `PermissionError: [Errno 13]` | [→](import.md#permissionerror-errno-13-permission-denied) |
| `OSError: [Errno 28] No space left` | [→](import.md#oserror-errno-28-no-space-left-on-device) |

### ⚙️ Окружение — терминал, Python, pip, venv

| Ошибка | Разбор |
|---|---|
| `'python' is not recognized` (Windows) | [→](environment.md#python-is-not-recognized-as-an-internal-or-external-command-windows) |
| `python: command not found` (macOS/Linux) | [→](environment.md#python-command-not-found-macoslinux) |
| `pip: command not found` | [→](environment.md#pip-command-not-found) |
| `Fatal error in launcher` | [→](environment.md#fatal-error-in-launcher-unable-to-create-process-using-) |
| `error: externally-managed-environment` | [→](environment.md#error-externally-managed-environment-linux-python-312) |
| `ERROR: Could not find a version` | [→](environment.md#error-could-not-find-a-version-that-satisfies-the-requirement-x) |
| `error: Microsoft Visual C++ 14.0 is required` | [→](environment.md#error-microsoft-visual-c-140-or-greater-is-required) |
| `Permission denied` (pip install) | [→](environment.md#permission-denied-при-pip-install-linuxmacos) |
| `Scripts\activate.ps1 cannot be loaded` | [→](environment.md#scriptsactivateps1-cannot-be-loaded-because-running-scripts-is-disabled) |
| `SSL: CERTIFICATE_VERIFY_FAILED` | [→](environment.md#ssl-certificate_verify_failed-при-pip-install) |

### 🐙 Git и MkDocs

| Ошибка | Разбор |
|---|---|
| `Author identity unknown` | [→](git-mkdocs.md#author-identity-unknown-please-tell-me-who-you-are) |
| `fatal: not a git repository` | [→](git-mkdocs.md#fatal-not-a-git-repository) |
| `fatal: remote origin already exists` | [→](git-mkdocs.md#fatal-remote-origin-already-exists) |
| `fatal: repository 'https://...' not found` | [→](git-mkdocs.md#fatal-repository-https-not-found) |
| `error: failed to push some refs` | [→](git-mkdocs.md#error-failed-to-push-some-refs-to-) |
| `error: Your local changes would be overwritten` | [→](git-mkdocs.md#error-your-local-changes-would-be-overwritten-by-merge) |
| `Permission denied (publickey)` | [→](git-mkdocs.md#permission-denied-publickey) |
| `Support for password authentication was removed` | [→](git-mkdocs.md#support-for-password-authentication-was-removed) |
| `CONFLICT (content): Merge conflict in ...` | [→](git-mkdocs.md#merge-conflict-in-filetxt) |
| `fatal: refusing to merge unrelated histories` | [→](git-mkdocs.md#fatal-refusing-to-merge-unrelated-histories) |
| `error: pathspec '...' did not match any file(s)` | [→](git-mkdocs.md#error-pathspec-filetxt-did-not-match-any-files-known-to-git) |
| `Config file 'mkdocs.yml' does not exist` | [→](git-mkdocs.md#config-file-mkdocsyml-does-not-exist) |
| `A reference to 'X.md' is included in the 'nav'` | [→](git-mkdocs.md#config-value-nav-a-reference-to-xmd-is-included-in-the-nav-configuration-but-the-file-does-not-exist) |
| `ImportError: Bad git executable` | [→](git-mkdocs.md#importerror-bad-git-executable) |
| `InvalidGitRepositoryError` | [→](git-mkdocs.md#invalidgitrepositoryerror) |
| `ModuleNotFoundError: No module named 'mkdocs'` | [→](git-mkdocs.md#modulenotfounderror-no-module-named-mkdocs) |
| `mkdocs: command not found` | [→](git-mkdocs.md#mkdocs-command-not-found) |

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

→ Разберите свою ошибку в одной из категорий:

- [Синтаксис](syntax.md) — опечатки, отступы, скобки
- [Во время работы](runtime.md) — `ValueError`, `TypeError`, `IndexError`
- [Импорт и пути](import.md) — библиотеки, файлы
- [Окружение](environment.md) — Python, pip, venv, PATH
- [Git и MkDocs](git-mkdocs.md) — пуш, конфликты, сборка сайта