# Основы терминала

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"

---

## 📌 Почему терминал

- **Скорость**: одна команда делает то, что в GUI — 10 кликов
- **Автоматизация**: команды можно собрать в скрипт
- **Серверы**: у них нет GUI — только терминал
- **Универсальность**: одинаково на Ubuntu, Fedora, macOS, WSL

---

## 📌 Навигация

```bash
pwd                    # где я
ls                      # что здесь
ls -la                   # всё, включая скрытые, с деталями
ls -lh                    # размеры в человекочитаемом виде
cd /path/to/folder         # перейти
cd ..                       # на уровень выше
cd ~                         # в домашнюю папку
cd -                          # в предыдущую папку
```

---

## 📌 Файлы и папки

```bash
touch file.txt                # создать пустой файл
mkdir newdir                   # создать папку
mkdir -p a/b/c                  # со всеми родителями
cp src.txt dst.txt               # копировать
cp -r folder/ backup/             # папку рекурсивно
mv old.txt new.txt                 # переименовать
mv file folder/                     # переместить
rm file.txt                          # удалить
rm -r folder/                         # папку рекурсивно
rm -rf folder/                         # без вопросов (ОСТОРОЖНО!)
```

!!! warning "`rm -rf /` уничтожит систему"
    Никогда не выполняйте это. Особенно с `sudo`. В Linux **нет корзины** —
    удалённое не восстановить.

---

## 📌 Просмотр файлов

```bash
cat file.txt                  # вывести весь файл
less file.txt                  # постранично (q — выход)
head -20 file.txt               # первые 20 строк
tail -20 file.txt                # последние 20 строк
tail -f log.txt                   # следить за файлом в реальном времени
wc -l file.txt                     # сколько строк
file unknown_file                   # определить тип
```

---

## 📌 Поиск

```bash
# По имени
find . -name "*.py"
find . -type f -name "test_*"
find . -size +100M

# По содержимому
grep "TODO" file.py
grep -r "TODO" .
grep -rn "def main" src/
grep -i "error" log.txt                 # без учёта регистра

# Быстрая альтернатива
rg "TODO"                               # ripgrep
```

---

## 📌 Перенаправления и пайпы

```bash
# Вывод в файл
echo "Привет" > file.txt                # перезаписать
echo "Ещё" >> file.txt                   # дописать
ls > files.txt

# Ошибки
command 2> errors.txt
command > all.log 2>&1                    # и stdout, и stderr

# Пайпы
ls -la | grep ".py"                       # список → фильтр
cat log.txt | sort | uniq -c | sort -rn    # топ частого
ps aux | grep python                         # найти процесс
```

**Идея пайпа:** выход одной команды — вход другой.

---

## 📌 Права

```bash
ls -l file.txt
# -rw-r--r-- 1 user group 123 Jan 1 12:00 file.txt
#  │└┬┘└┬┘└┬┘
#  │ │  │  └── другие (r--)
#  │ │  └───── группа (r--)
#  │ └──────── владелец (rw-)
#  └────────── тип (- файл, d папка, l ссылка)
```

**Три группы:** владелец, группа, остальные. Каждая — `rwx` (чтение, запись, выполнение).

### `chmod` — изменить права

```bash
chmod +x script.sh                # добавить выполнение
chmod 755 script.sh                # rwxr-xr-x
chmod 644 file.txt                  # rw-r--r--
chmod -R 755 folder/                 # рекурсивно
```

**Числа:**
- 4 = r (read)
- 2 = w (write)
- 1 = x (execute)
- Складываются: 7 = rwx, 6 = rw-, 5 = r-x

### `chown` — сменить владельца

```bash
sudo chown user:group file.txt
sudo chown -R user:user folder/
```

### `sudo` — выполнить от root

```bash
sudo apt update
sudo systemctl restart nginx
```

⚠️ `sudo` даёт **полные права**. Используйте только когда нужно.

---

## 📌 Процессы

```bash
ps aux                    # все процессы
ps aux | grep python       # найти конкретный
top                         # интерактивный монитор
htop                         # красивее (нужно установить)
kill 1234                     # послать SIGTERM процессу
kill -9 1234                   # SIGKILL (жёстко)
pkill -f script.py              # убить по имени
```

### Фоновые процессы

```bash
python script.py &               # в фоне
nohup python script.py &          # не умрёт при закрытии терминала

jobs                               # список фоновых
fg                                  # вернуть на передний план
bg                                  # в фон
Ctrl+Z                              # приостановить
```

---

## 📌 Сеть

```bash
ping google.com                    # проверить связь
curl https://example.com            # скачать
curl -O https://example.com/file    # сохранить с именем
wget https://example.com/file        # альтернатива
ip addr                               # IP-адреса
ip route                              # маршруты
ss -tuln                               # открытые порты
netstat -tuln                           # старое
```

**`curl`** — незаменим для API:

```bash
curl https://api.github.com/users/torvalds
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"Аня"}' https://api.example.com/users
```

---

## 📌 Пакеты

### Ubuntu / Debian

```bash
sudo apt update                       # обновить список
sudo apt upgrade                       # обновить всё
sudo apt install python3-pip            # установить
sudo apt remove package                  # удалить
apt search nginx                          # поиск
```

### Fedora / RHEL

```bash
sudo dnf install package
sudo dnf update
```

### Arch

```bash
sudo pacman -S package
```

---

## 📌 Диск

```bash
df -h                          # сколько места
du -sh folder/                  # размер папки
du -sh * | sort -h                # размеры всех файлов в папке
ncdu                               # интерактивный аналог (установить)
```

---

## 📌 Архивы

```bash
# tar
tar -czvf archive.tar.gz folder/       # создать
tar -xzvf archive.tar.gz                # распаковать

# zip
zip -r archive.zip folder/
unzip archive.zip
```

---

## 📌 Редакторы

В терминале: **nano**, **vim**, **emacs**.

**nano** — для начинающих:

```bash
nano file.txt
# Ctrl+O — сохранить
# Ctrl+X — выйти
```

**vim** — мощный, но требует привычки.

**Совет:** для обычной работы используйте **VS Code** с расширением
**Remote - WSL** или **Remote - SSH** — работаете в терминале, а
редактор — графический.

---

## 💡 Полезные однострочники

```bash
# Найти 10 самых больших файлов
find . -type f -exec du -h {} + | sort -rh | head -10

# Найти и удалить все __pycache__
find . -type d -name "__pycache__" -exec rm -rf {} +

# Сколько строк кода в проекте
find . -name "*.py" -exec wc -l {} + | tail -1

# Убить все python-процессы
pkill -f python

# Топ-10 IP из лога
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head

# Проверить, запущен ли сервис
systemctl status nginx
```

---

## ⚠️ Частые ошибки

!!! warning "`rm -rf` без проверки"
    Опечатка в пути — и снесли не то. Особенно с `/`.

!!! warning "`sudo` для всего"
    Не нужно для установки через `pip`, для работы с домашней папкой.
    `sudo pip install` — путь к сломанной системе.

!!! warning "Работа от root"
    Никогда не логиньтесь root'ом. Используйте обычного пользователя
    + `sudo` для конкретных команд.

!!! warning "Слепое копирование из интернета"
    `curl ... | bash` — опасно. Сначала посмотрите скрипт.

!!! warning "Пробелы в именах файлов"
    ```bash
    rm my file.txt      # ❌ удалит два файла
    rm "my file.txt"    # ✅
    ```

---

## 🧪 Упражнения

1. ⭐ Пройтись по папкам через `cd`, `ls`, `pwd`.
2. ⭐ Создать/переименовать/удалить файлы.
3. ⭐⭐ Через `grep` найти все `TODO` в проекте.
4. ⭐⭐ Пайп: топ-10 самых частых слов в файле.
5. ⭐⭐ Сделать скрипт исполняемым.
6. ⭐⭐⭐ Найти все `.log` файлы старше 7 дней.
7. ⭐⭐⭐ Убить зависший Python-процесс.

---

## 🔗 Что дальше

→ [Практика](practice.md).