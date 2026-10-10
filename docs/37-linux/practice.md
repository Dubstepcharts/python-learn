# Linux: практика

!!! abstract "Уровень: ⭐⭐⭐"

---

## 📌 SSH — подключение к серверу

```bash
ssh user@192.168.1.100
ssh user@myserver.com -p 2222
ssh -i ~/.ssh/key.pem user@server.com
```

**Ключи** (вместо пароля):

```bash
# Генерация
ssh-keygen -t ed25519 -C "you@example.com"

# Копировать публичный ключ на сервер
ssh-copy-id user@server.com
```

После этого — вход без пароля.

**Файл `~/.ssh/config`:**

```
Host myserver
    HostName myserver.com
    User anna
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Теперь можно просто: `ssh myserver`.

---

## 📌 `systemd` — управление сервисами

На современных Linux все сервисы — через `systemd`.

```bash
systemctl status nginx         # статус
sudo systemctl start nginx       # запустить
sudo systemctl stop nginx         # остановить
sudo systemctl restart nginx       # перезапустить
sudo systemctl enable nginx         # автозапуск при загрузке
sudo systemctl disable nginx         # отключить автозапуск

systemctl list-units --type=service
journalctl -u nginx -f               # логи сервиса
```

### Свой сервис

**`/etc/systemd/system/mybot.service`:**
```ini
[Unit]
Description=My Telegram Bot
After=network.target

[Service]
Type=simple
User=botuser
WorkingDirectory=/home/botuser/mybot
ExecStart=/home/botuser/mybot/.venv/bin/python bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable mybot
sudo systemctl start mybot
sudo systemctl status mybot
journalctl -u mybot -f
```

Теперь бот работает **как сервис**, перезапускается после падения и при
загрузке сервера.

---

## 📌 `cron` — расписание

```bash
crontab -e           # редактировать
crontab -l            # посмотреть
```

**Формат:** `минута час день месяц день_недели команда`

```
* * * * * command
│ │ │ │ │
│ │ │ │ └── день недели (0-7, 0=вс)
│ │ │ └──── месяц (1-12)
│ │ └────── день месяца (1-31)
│ └──────── час (0-23)
└────────── минута (0-59)
```

**Примеры:**

```cron
# Каждый день в 3:00
0 3 * * * /home/user/backup.sh

# Каждые 10 минут
*/10 * * * * python /home/user/check.py

# По будням в 9:00
0 9 * * 1-5 /home/user/report.sh

# Каждое воскресенье в 0:00
0 0 * * 0 /home/user/weekly.sh
```

**Логи:**
```bash
grep CRON /var/log/syslog
```

---

## 📌 Bash-скрипты

**`backup.sh`:**
```bash
#!/bin/bash
set -euo pipefail      # строгий режим: выход при ошибке

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups"
SOURCE="/home/user/data"

mkdir -p "$BACKUP_DIR"

echo "Начинаю бэкап $DATE"
tar -czf "$BACKUP_DIR/backup-$DATE.tar.gz" "$SOURCE"
echo "Готово: $BACKUP_DIR/backup-$DATE.tar.gz"
```

Сделать исполняемым:

```bash
chmod +x backup.sh
./backup.sh
```

### Переменные

```bash
NAME="Аня"
echo "Привет, $NAME"
echo "Привет, ${NAME}!"          # явные скобки

DATE=$(date)
CURRENT_DIR=$(pwd)
```

### Условия

```bash
if [ -f "file.txt" ]; then
    echo "Файл существует"
elif [ -d "folder" ]; then
    echo "Это папка"
else
    echo "Ничего нет"
fi

# Проверки
[ -f file ]        # файл существует
[ -d dir ]          # папка существует
[ -z "$var" ]        # переменная пуста
[ -n "$var" ]         # не пуста
[ "$a" = "$b" ]        # строки равны
[ "$a" -eq "$b" ]       # числа равны
```

### Циклы

```bash
for i in 1 2 3; do
    echo "$i"
done

for file in *.txt; do
    echo "Обрабатываю $file"
done

while read -r line; do
    echo "Строка: $line"
done < input.txt
```

### Функции

```bash
greet() {
    local name=$1
    echo "Привет, $name"
}

greet "Аня"
```

### Аргументы

```bash
#!/bin/bash
# Использование: ./script.sh file.txt
FILE=$1
if [ -z "$FILE" ]; then
    echo "Использование: $0 <file>"
    exit 1
fi

echo "Обрабатываю $FILE"
```

`$0` — имя скрипта, `$1`, `$2` — аргументы, `$#` — количество, `$@` — все.

---

## 📌 Регулярки в `grep`

```bash
grep "^ERROR" log.txt              # строки, начинающиеся с ERROR
grep "ERROR$" log.txt                # заканчивающиеся
grep -E "error|warning" log.txt       # или
grep -E "[0-9]{3}" log.txt             # 3 цифры подряд
grep -v "^#" config.txt                 # не комментарии
```

---

## 📌 `awk` и `sed`

**`awk`** — работа с колонками:

```bash
awk '{print $1}' file.txt                # первая колонка
awk -F: '{print $1, $3}' /etc/passwd      # разделитель :
awk '$3 > 1000' data.txt                    # фильтр по 3-й колонке
```

**`sed`** — замена текста:

```bash
sed 's/old/new/' file.txt                   # первое вхождение в строке
sed 's/old/new/g' file.txt                   # все вхождения
sed -i 's/old/new/g' file.txt                 # изменить файл на месте
```

---

## 📌 Мониторинг

```bash
# Нагрузка
uptime                     # load average
free -h                     # память
df -h                        # диски
iostat                        # I/O (нужен sysstat)
vmstat                         # виртуальная память

# Процессы
top                             # интерактивно
htop                             # красивее
ps aux --sort=-%mem              # топ по памяти
ps aux --sort=-%cpu               # топ по CPU

# Сеть
ss -tuln
iftop                             # трафик
nethogs                            # трафик по процессам
```

---

## 📌 Firewall

**UFW** (Ubuntu):

```bash
sudo ufw status
sudo ufw enable
sudo ufw allow 22                     # SSH
sudo ufw allow 80 443                  # HTTP/HTTPS
sudo ufw deny 3306                      # закрыть MySQL
sudo ufw delete allow 22
```

**Правило:** открывайте только нужные порты.

---

## 📌 Пользователи

```bash
sudo adduser anna                 # создать
sudo usermod -aG sudo anna         # добавить в sudo
sudo passwd anna                    # сменить пароль
sudo deluser anna                    # удалить

who                                   # кто онлайн
last                                   # история входов
id                                      # мои группы
```

---

## 💡 Полный скрипт деплоя

**`deploy.sh`:**
```bash
#!/bin/bash
set -euo pipefail

APP_DIR="/home/user/myapp"
BRANCH="main"

echo "=== Деплой $(date) ==="

cd "$APP_DIR"

echo "Забираю свежий код..."
git fetch origin
git reset --hard "origin/$BRANCH"

echo "Обновляю зависимости..."
source .venv/bin/activate
pip install -r requirements.txt --quiet

echo "Применяю миграции..."
alembic upgrade head

echo "Перезапускаю сервис..."
sudo systemctl restart myapp

echo "Проверяю статус..."
sleep 3
sudo systemctl status myapp --no-pager

echo "=== Готово ==="
```

В `crontab` — авто-деплой:

```cron
0 * * * * /home/user/myapp/deploy.sh >> /var/log/deploy.log 2>&1
```

---

## ⚠️ Частые ошибки

!!! warning "`crontab` без полного пути"
    `crontab` не знает про `PATH`. Используйте полные пути:
    `/usr/bin/python3 /home/user/script.py`.

!!! warning "`set -e` в скриптах"
    Без него скрипт продолжит после ошибки. Всегда добавляйте.

!!! warning "Секреты в `.sh`"
    Пароли, токены — в `.env` или переменных окружения.

!!! warning "Открытые порты"
    Не открывайте всё подряд. Только то, что нужно.

!!! warning "`rm -rf` в скрипте без проверки"
    `cd "$DIR" && rm -rf *` — если `$DIR` пусто, удалите **всю текущую** папку. Проверяйте:
    ```bash
    [ -z "$DIR" ] && exit 1
    ```

---

## 🧪 Упражнения

1. ⭐ Настроить SSH-ключи для GitHub.
2. ⭐ `crontab` — задача каждые 10 минут.
3. ⭐⭐ Свой systemd-сервис для Python-скрипта.
4. ⭐⭐ Bash-скрипт бэкапа.
5. ⭐⭐ `awk`: топ-10 IP из лога.
6. ⭐⭐⭐ Автодеплой через `git` + `systemd`.
7. ⭐⭐⭐ UFW + Nginx + SSL.

---

## 🔗 Что дальше

→ [ЕГЭ и олимпиады](../38-exams/index.md).