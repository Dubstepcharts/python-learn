# pytest — тестирование

**pytest** — самый популярный фреймворк для **тестирования** Python-кода. Вы пишете тесты — небольшие функции, которые проверяют, что ваш код работает правильно.

Зачем это нужно:
- Находить ошибки **до** пользователя
- Не бояться менять код — тесты поймают поломки
- Документировать поведение: тест = пример использования

!!! tip "Кому подходит"
    **9–11 класс**. Нужны: функции, исключения.

---

## 🚀 Установка

```bash
pip install pytest
```

Запуск тестов — из корня проекта:

```bash
pytest
```

Или конкретный файл:

```bash
pytest test_math.py
```

---

## 🍎 Первый тест

**`math_utils.py`:**
```python
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Деление на ноль")
    return a / b
```

**`test_math_utils.py`:**
```python
from math_utils import add, divide
import pytest

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_divide():
    assert divide(10, 2) == 5
    assert divide(9, 3) == 3

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)
```

Запустите `pytest` — увидите зелёные галочки, если всё правильно.

---

## 📌 Правила именования

pytest **сам находит** тесты по именам:

- Файлы: `test_*.py` или `*_test.py`
- Функции: `test_*`
- Классы: `Test*`
- Методы классов: `test_*`

Пишите имена так — не придётся ничего настраивать.

---

## 📌 `assert` — основа тестов

```python
assert 2 + 2 == 4
assert "python".upper() == "PYTHON"
assert len([1, 2, 3]) == 3
assert 5 in [1, 2, 3, 4, 5]
assert isinstance(5, int)
assert x is None
assert x is not None
```

Если условие ложно — pytest сообщит, **что** не совпало и **где**.

```python
def test_example():
    result = 2 + 2
    assert result == 5      # FAILED: assert 4 == 5
```

---

## 📌 Проверка исключений

```python
import pytest

def test_div_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_value_error():
    with pytest.raises(ValueError, match="ноль"):
        raise ValueError("Деление на ноль")
```

`match` — регулярка для сообщения.

---

## 📌 Параметризованные тесты

Один тест — много вариантов:

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

Компактно и покрывает много случаев.

---

## 📌 Фикстуры

**Фикстура** — подготовка данных для теста. Один раз описана — используется в нескольких тестах.

```python
import pytest

@pytest.fixture
def sample_list():
    return [1, 2, 3, 4, 5]

def test_sum(sample_list):
    assert sum(sample_list) == 15

def test_len(sample_list):
    assert len(sample_list) == 5
```

Параметр `sample_list` в тесте **автоматически** получает результат фикстуры.

### Фикстуры с очисткой

```python
@pytest.fixture
def temp_file(tmp_path):
    f = tmp_path / "test.txt"
    f.write_text("Привет")
    yield f
    # Здесь можно что-то удалить после теста
```

`tmp_path` — встроенная фикстура: временная папка, удалится сама.

### Область действия

```python
@pytest.fixture(scope="module")     # один раз на модуль
@pytest.fixture(scope="session")     # один раз на запуск
@pytest.fixture(scope="function")    # для каждого теста (по умолчанию)
```

---

## 📌 Классы тестов

```python
class TestCalculator:
    def test_add(self):
        assert add(1, 2) == 3

    def test_sub(self):
        assert add(5, -3) == 2
```

Удобно группировать связанные тесты.

---

## 📌 Пропуск и ожидание падения

```python
@pytest.mark.skip(reason="Ещё не реализовано")
def test_future(): ...

@pytest.mark.skipif(True, reason="Только для Linux")
def test_linux_only(): ...

@pytest.mark.xfail(reason="Известный баг")
def test_buggy(): ...
```

---

## 📌 Полезные опции

```bash
pytest -v                    # подробно
pytest -q                    # кратко
pytest -x                    # остановиться на первой ошибке
pytest -k "add"              # только тесты с "add" в имени
pytest --lf                   # только упавшие с прошлого раза
pytest --ff                   # сначала упавшие
pytest -s                    # показать print
pytest --cov=mymodule         # покрытие (нужен pytest-cov)
```

---

## 📌 Покрытие кода

```bash
pip install pytest-cov
pytest --cov=myproject
```

Показывает, какой процент кода покрыт тестами. Хорошо — **80%+** для
важных модулей.

---

## 💡 Пример — тестирование калькулятора

**`calc.py`:**
```python
def add(a, b): return a + b
def sub(a, b): return a - b
def mul(a, b): return a * b

def div(a, b):
    if b == 0:
        raise ZeroDivisionError("На ноль делить нельзя")
    return a / b
```

**`test_calc.py`:**
```python
import pytest
from calc import add, sub, mul, div

@pytest.mark.parametrize("a, b, result", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (2.5, 2.5, 5.0),
])
def test_add(a, b, result):
    assert add(a, b) == result

@pytest.mark.parametrize("a, b, result", [
    (10, 3, 7),
    (0, 0, 0),
    (-5, -5, 0),
])
def test_sub(a, b, result):
    assert sub(a, b) == result

def test_div():
    assert div(10, 2) == 5
    assert div(7, 2) == 3.5

def test_div_zero():
    with pytest.raises(ZeroDivisionError):
        div(10, 0)
```

Запуск: **19+ тестов**, все зелёные.

---

## 📌 Тестирование работы с файлами

```python
def save_data(path, data):
    with open(path, "w", encoding="utf-8") as f:
        f.write(data)

def load_data(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

def test_save_and_load(tmp_path):
    file = tmp_path / "test.txt"
    save_data(file, "Привет")
    assert load_data(file) == "Привет"
```

`tmp_path` — временная папка, автоматически удаляется.

---

## ⚠️ Частые ошибки

!!! warning "Имя файла не `test_*.py`"
    pytest не найдёт тесты. Переименуйте.

!!! warning "Имя функции без `test_`"
    Тоже не найдёт. Начинайте с `test_`.

!!! warning "Зависимость тестов друг от друга"
    Каждый тест должен работать **самостоятельно**. Общие данные — через
    фикстуры.

!!! warning "Слишком много в одном тесте"
    Один тест — одна проверка. Если упал — сразу понятно, что сломалось.

!!! warning "Тестирование только happy path"
    Проверяйте и ошибки, и краевые случаи (пустые значения, 0, очень
    большие числа).

---

## 🧪 Упражнения

1. ⭐ Тест для функции `square(x)`.
2. ⭐ Тесты на чётность.
3. ⭐⭐ Параметризованный тест `min` и `max`.
4. ⭐⭐ Тест, проверяющий, что функция бросает исключение.
5. ⭐⭐ Фикстура со списком чисел.
6. ⭐⭐⭐ Полное покрытие класса `Fraction` из ООП.
7. ⭐⭐⭐ Тестирование работы с файлами через `tmp_path`.

---

## 🔗 Что дальше

→ [asyncio](../26-asyncio/index.md).