# Основы криптографии

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [строки](../03-strings/index.md), [файлы](../06-files-errors/files.md).

---

## 🍎 Объясняем просто

!!! example "Три разные вещи"
    - **Хеш** — «отпечаток». Из него нельзя восстановить исходное. Нужен, чтобы **проверить**, что данные не изменились.
    - **Симметричное шифрование** — один ключ и для шифрования, и для расшифровки. Быстро.
    - **Асимметричное шифрование** — два ключа: публичный шифрует, приватный расшифровывает.

    Пароли **хешируют**. Сообщения **шифруют**. Подписи делают **асимметрично**.

---

## 📌 Хеширование

**Хеш** — «односторонняя» функция. Из входа получается фиксированная строка.
Восстановить вход **невозможно**.

```python
import hashlib

h = hashlib.sha256(b"привет").hexdigest()
print(h)     # 6fbfb3a1c... (64 символа)
```

**Популярные алгоритмы:**

| Алгоритм | Длина | Где |
|---|---|---|
| MD5 | 128 бит | ⚠️ Сломан, только для контрольных сумм |
| SHA-1 | 160 бит | ⚠️ Сломан |
| SHA-256 | 256 бит | ✅ Стандарт |
| SHA-512 | 512 бит | ✅ |
| BLAKE2 | 256/512 | ✅ Быстрый, современный |
| BLAKE3 | 256 | ✅ Очень быстрый |

```python
# SHA-256
hashlib.sha256(b"data").hexdigest()

# BLAKE2
hashlib.blake2b(b"data").hexdigest()
```

### Контрольная сумма файла

```python
def file_hash(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()
```

---

## 📌 Хеширование паролей

**Правило:** никогда не храните пароль в открытом виде и не используйте
обычный SHA-256 для паролей! Нужны **медленные** алгоритмы + **соль**.

### `bcrypt`

```bash
pip install bcrypt
```

```python
import bcrypt

password = b"mypassword"

# Хеширование
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password, salt)

# Проверка
if bcrypt.checkpw(password, hashed):
    print("Пароль верен")
```

### `argon2` — лучший на сегодня

```bash
pip install argon2-cffi
```

```python
from argon2 import PasswordHasher

ph = PasswordHasher()
hash_ = ph.hash("mypassword")
ph.verify(hash_, "mypassword")     # True / ошибка
```

### `hashlib.scrypt`

Встроен в Python:

```python
import hashlib, os

salt = os.urandom(16)
hashed = hashlib.scrypt(b"pass", salt=salt, n=2**14, r=8, p=1)
```

!!! warning "Почему `sha256(password)` — плохо?"
    - **Нет соли** — одинаковые пароли → одинаковые хеши (по радужным таблицам подбираются мгновенно)
    - **Слишком быстро** — современный GPU проверяет миллиарды SHA-256 в секунду
    - **bcrypt/argon2** специально **медленные** и **солёные**

---

## 📌 Симметричное шифрование — Fernet

`Fernet` — удобный безопасный «рецепт» из `cryptography`.

```bash
pip install cryptography
```

```python
from cryptography.fernet import Fernet

# Генерация ключа
key = Fernet.generate_key()
cipher = Fernet(key)

# Шифрование
encrypted = cipher.encrypt(b"секретное сообщение")
print(encrypted)                    # b'gAAAAA...'

# Расшифровка
decrypted = cipher.decrypt(encrypted)
print(decrypted)                     # b'секретное сообщение'
```

**Ключ нужно хранить в безопасности.** Потеряли ключ — потеряли данные.

### Шифрование файлов

```python
def encrypt_file(path, key):
    cipher = Fernet(key)
    with open(path, "rb") as f:
        data = f.read()
    with open(path + ".enc", "wb") as f:
        f.write(cipher.encrypt(data))
```

---

## 📌 Асимметричное шифрование — RSA

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization

# Генерация ключей
private = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public = private.public_key()

# Шифрование
message = b"секрет"
encrypted = public.encrypt(
    message,
    padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),
                 algorithm=hashes.SHA256(), label=None),
)

# Расшифровка
decrypted = private.decrypt(
    encrypted,
    padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),
                 algorithm=hashes.SHA256(), label=None),
)
```

RSA **медленный** — им шифруют только «ключ сессии», а сами данные — симметрично (так работает HTTPS).

---

## 📌 JWT — токены авторизации

**JWT** (JSON Web Token) — компактный способ передать «я авторизован».

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYW5uYSJ9.Xr7...
    ↑ header               ↑ payload                ↑ signature
```

**Структура:** заголовок.данные.подпись (base64).

```bash
pip install pyjwt
```

```python
import jwt
from datetime import datetime, timedelta

SECRET = "секретный ключ"

# Создание
payload = {
    "user_id": 42,
    "exp": datetime.utcnow() + timedelta(hours=1),
}
token = jwt.encode(payload, SECRET, algorithm="HS256")
print(token)

# Проверка
try:
    decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
    print(decoded)     # {'user_id': 42, 'exp': ...}
except jwt.ExpiredSignatureError:
    print("Токен истёк")
except jwt.InvalidTokenError:
    print("Подпись неверна")
```

!!! warning "JWT ≠ шифрование"
    Payload **видно** любому. JWT лишь **подтверждает**, что токен выдан
    сервером. Не кладите в JWT секреты.

---

## 📌 HTTPS и TLS

**HTTPS** = HTTP + TLS. Шифрует весь трафик между клиентом и сервером.

**Что делает TLS:**
1. Проверяет подлинность сервера через **сертификат** (выданный
   доверенным центром)
2. Согласует **общий секретный ключ** (через асимметричное шифрование)
3. Дальше общается **симметричным** ключом

**Что это даёт:**
- Никто не может подслушать
- Никто не может подменить данные
- Клиент уверен, что говорит с настоящим сервером

**Сертификаты** — через **Let's Encrypt** бесплатно. На любом хостинге —
одна кнопка.

---

## 📌 Генерация паролей и токенов

```python
import secrets

# Криптостойкий токен
token = secrets.token_urlsafe(32)   # 43 символа
token = secrets.token_hex(16)        # 32 hex-символа

# Случайный выбор
choice = secrets.choice(["a", "b", "c"])

# Сравнение без тайминговых атак
secrets.compare_digest(a, b)
```

!!! warning "`random` ≠ `secrets`"
    `random` предсказуем. Для паролей и токенов — только `secrets`.

---

## 💡 Пример — регистрация пользователя

```python
import sqlite3
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def register(username, password):
    hash_ = ph.hash(password)
    conn = sqlite3.connect("users.db")
    conn.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, hash_),
    )
    conn.commit()

def login(username, password):
    conn = sqlite3.connect("users.db")
    row = conn.execute(
        "SELECT password_hash FROM users WHERE username = ?", (username,)
    ).fetchone()
    if not row:
        return False
    try:
        ph.verify(row[0], password)
        return True
    except VerifyMismatchError:
        return False
```

---

## ⚠️ Частые ошибки

!!! warning "Свой алгоритм шифрования"
    **Никогда.** Только проверенные библиотеки.

!!! warning "MD5 / SHA-1 для паролей"
    Сломаны. Только `bcrypt`, `argon2`, `scrypt`.

!!! warning "`random` для токенов"
    Предсказуем. Только `secrets`.

!!! warning "Секреты в Git"
    `.env` + `.gitignore`. Смените все, что утекли.

!!! warning "`eval` на пользовательских данных"
    Выполнит любой код. Никогда.

!!! warning "JWT без проверки подписи"
    `jwt.decode(..., options={"verify_signature": False})` — **уязвимость**.

---

## 🧪 Упражнения

1. ⭐ SHA-256 от строки.
2. ⭐ Контрольная сумма файла.
3. ⭐⭐ bcrypt или argon2 для пароля.
4. ⭐⭐ Шифрование файла через Fernet.
5. ⭐⭐ JWT: создать и проверить.
6. ⭐⭐⭐ Мини-сервис логина с argon2 и SQLite.
7. ⭐⭐⭐ Шифрование конфига с секретами.

---

## 🔗 Что дальше

→ [Безопасная разработка](secure-coding.md).