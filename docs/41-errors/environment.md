# Ошибки окружения

Терминал, Python, pip, venv. Эти ошибки возникают **до** запуска вашей
программы — при попытке запустить `python`, `pip`, `mkdocs` и т.д.

---

## ❌ `'python' is not recognized as an internal or external command` (Windows)

**Что видишь (cmd):**

```
'python' is not recognized as an internal or external command,
operable program or batch file.
```

**Что видишь (PowerShell):**

```
python : Имя "python" не распознано как имя командлета, функции,
файла сценария или выполняемой программы.
```

**Почему:** Windows **не знает**, где находится Python. Обычно — забыли
поставить галочку **Add python.exe to PATH** при установке.

**Как исправить:**

### Вариант 1. Переустановить Python

Скачайте установщик с **https://www.python.org/downloads/**, при установке
поставьте галочку **Add python.exe to PATH** внизу окна.

### Вариант 2. Проверить PATH вручную

1. Пуск → «Изменение переменных среды текущего пользователя»
2. В списке **Path** → Изменить → Добавить:
   - `C:\Users\ВашеИмя\AppData\Local\Programs\Python\Python312\`
   - `C:\Users\ВашеИмя\AppData\Local\Programs\Python\Python312\Scripts\`
3. **Закрыть и снова открыть терминал.**

### Вариант 3. Проверить через `py`

В Windows Python ставит **лаунчер** `py`:

```powershell
py --version
```

Если работает — используйте `py` вместо `python`.

### Вариант 4. Через полный путь

```powershell
& "C:\Users\ВашеИмя\AppData\Local\Programs\Python\Python312\python.exe" app.py
```

---

## ❌ `python: command not found` (macOS/Linux)

**Что видишь:**

```
$ python --version
-bash: python: command not found
```

**Почему:** в Linux и на macOS команда для Python 3 называется
**`python3`**, а `python` — это либо Python 2, либо ничего.

**Как исправить:**

```bash
python3 --version
python3 app.py
```

Или создать алиас:

```bash
echo "alias python=python3" >> ~/.bashrc
echo "alias pip=pip3" >> ~/.bashrc
source ~/.bashrc
```

(Для zsh — `~/.zshrc`.)

---

## ❌ `pip: command not found`

**Что видишь:**

```
pip: command not found
```

**Как исправить:**

```bash
python -m pip install requests
```

Это работает **всегда** — потому что не зависит от того, в PATH ли `pip`.
Совет: используйте `python -m pip` всегда, а не просто `pip`.

---

## ❌ `Fatal error in launcher: Unable to create process using ...`

**Что видишь:**

```
Fatal error in launcher: Unable to create process using
'"C:\...\python.exe" "C:\...\pip.exe" install ...'
```

**Почему:** путь к Python **изменился** — обычно после переустановки или
переезда папки.

**Как исправить:**

```bash
python -m pip install --upgrade pip
```

Или полностью переустановить Python.

---

## ❌ `error: externally-managed-environment` (Linux, Python 3.12+)

**Что видишь:**

```
error: externally-managed-environment

× This environment is externally managed
```

**Почему:** в новых Linux (Ubuntu 23.04+, Fedora) запрещено ставить
пакеты **глобально**. Это защита от разрушения системы.

**Как исправить:** используйте **виртуальное окружение**.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install requests
```

Это **правильный** способ. Не пытайтесь `sudo pip install` — сломаете
систему.

---

## ❌ `ERROR: Could not find a version that satisfies the requirement X`

**Что видишь:**

```
ERROR: Could not find a version that satisfies the requirement pygame
ERROR: No matching distribution found for pygame
```

**Почему:**

1. **Опечатка** в имени пакета.
2. Пакет **не для вашей версии** Python или ОС.
3. **Нет интернета**.
4. **Прокси/файрвол** блокирует.

**Как исправить:**

1. Проверьте имя: **https://pypi.org**.
2. Обновите pip: `python -m pip install --upgrade pip`.
3. Проверьте интернет:

```bash
pip install requests
```

Если тоже не работает — проблема с сетью.

---

## ❌ `error: Microsoft Visual C++ 14.0 or greater is required`

**Что видишь (Windows):**

```
error: Microsoft Visual C++ 14.0 or greater is required.
Get it with "Microsoft C++ Build Tools"
```

**Почему:** пакет требует **компиляции C-кода**, а на Windows нет
компилятора.

**Как исправить:**

1. Скачать **Visual Studio Build Tools**:
   https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Или найти **готовый wheel** на PyPI:

```bash
pip install --only-binary=:all: package_name
```

3. Или использовать **более старую версию** пакета.

---

## ❌ `ModuleNotFoundError` после `pip install`

**Почему:** установили в **один** Python, а запускаете **другим**.

**Как найти:**

```bash
# Где pip?
pip --version
# → pip 24.0 from ... (python 3.12)

# Где python?
python --version
# → Python 3.11.5
```

Если **разные версии** — используйте `python -m pip install ...`.

**Актуально для venv:** активируйте окружение и проверьте:

```bash
which python     # macOS/Linux
where python      # Windows

which pip
```

Оба должны указывать внутрь `.venv`.

---

## ❌ `Scripts\activate.ps1 cannot be loaded because running scripts is disabled`

**Что видишь (PowerShell):**

```
.\.venv\Scripts\activate.ps1 : File cannot be loaded because running
scripts is disabled on this system.
```

**Почему:** PowerShell по умолчанию **запрещает** запускать скрипты.

**Как исправить:**

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Один раз. После — venv активируется нормально.

Либо используйте **cmd** вместо PowerShell:

```cmd
.venv\Scripts\activate.bat
```

---

## ❌ `Permission denied` при `pip install` (Linux/macOS)

**Что видишь:**

```
ERROR: Could not install packages due to an OSError:
[Errno 13] Permission denied
```

**Почему:** пытаетесь ставить **глобально**, а у вас нет прав.

**Как исправить:**

**Правильно** — используйте venv:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install requests
```

**Неправильно, но иногда используется:**

```bash
pip install --user requests
```

**Никогда** не делайте:

```bash
sudo pip install requests         # ❌ сломает систему
```

---

## ❌ `python setup.py egg_info failed`

**Что видишь:**

```
error: subprocess-exited-with-error
python setup.py egg_info did not run successfully
```

**Почему:** старый пакет, несовместимый с новым Python / pip.

**Как исправить:**

```bash
python -m pip install --upgrade pip setuptools wheel
```

Затем повторите установку. Если не помогло — поищите альтернативу пакету.

---

## ❌ `SSL: CERTIFICATE_VERIFY_FAILED` при pip install

**Что видишь:**

```
WARNING: Retrying (Retry(total=4, ...)) after connection broken
...
SSLError: HTTPSConnectionPool ... CERTIFICATE_VERIFY_FAILED
```

**Почему:** проблемы с SSL-сертификатами. Обычно — корпоративный прокси,
антивирус или старая ОС.

**Как исправить:**

1. Обновите pip:

```bash
python -m pip install --upgrade certifi
```

2. Если не помогло — временно:

```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org package
```

Но лучше разобраться с причиной (антивирус/прокси).

---

## ❌ `pip is configured with locations that require TLS/SSL`

**Почему:** Python собран без SSL. Бывает после ручной сборки.

**Как исправить:** используйте официальный установщик с python.org.

---

## ❌ Терминал «висит» и не отвечает

**Что делать:**

1. **Ctrl + C** — прервать текущую команду.
2. **Ctrl + C ещё раз**, если не помогло.
3. **Закрыть терминал** (иконка корзины в VS Code) и открыть новый.

**Причина:** программа в бесконечном цикле или ждёт ввода.

---

## ❌ `KeyboardInterrupt` вместо результата

**Что видишь:**

```
^C
KeyboardInterrupt
```

**Что это:** вы **сами** остановили программу через Ctrl + C. Это не
ошибка.

---

## 📌 Как избежать проблем с окружением

### Правило 1. Одно виртуальное окружение на проект

```bash
cd myproject
python -m venv .venv
source .venv/bin/activate       # Linux/macOS
.\.venv\Scripts\Activate.ps1     # Windows
```

### Правило 2. Всегда `python -m pip`, а не просто `pip`

Гарантирует, что ставите **в тот** Python.

### Правило 3. Открывайте весь проект в VS Code

Правый клик по папке проекта → **Open with Code**. Тогда VS Code сам
подхватит виртуальное окружение.

### Правило 4. Фиксируйте версии

```bash
pip freeze > requirements.txt
```

Позже:

```bash
pip install -r requirements.txt
```

### Правило 5. Выбирайте Python в VS Code

`Ctrl + Shift + P` → `Python: Select Interpreter` → выбрать `.venv`.

---

## ⚠️ Частые ошибки в этой категории

!!! warning "Галочка «Add to PATH» при установке Python"
    Без неё `python` не работает в терминале. Переустановите.

!!! warning "Глобальный pip вместо venv"
    Ставит пакеты в системный Python. Работает не там, где вы.

!!! warning "PowerShell блокирует скрипты"
    `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` один раз.

!!! warning "`sudo pip install`"
    Сломает систему на Linux/macOS. Только `--user` или venv.

!!! warning "Смешение терминалов"
    Открыли PowerShell, потом cmd — переменные не переносятся. Закройте
    и откройте заново после изменений PATH.

---

## 🔗 Что дальше

→ [Ошибки Git и MkDocs](git-mkdocs.md).