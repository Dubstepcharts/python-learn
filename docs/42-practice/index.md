# Практика: Переменные и Операторы

Здесь вы можете проверить свои знания. Скопируйте код задачи, нажмите кнопку **«Открыть в песочнице»**, вставьте код и запустите его. А если застрянете — загляните в раскрывающееся решение.

---

## 📦 Переменные

### Задача 1. Знакомство
Создайте переменную `name` и запишите в неё ваше имя. Затем выведите её на экран.

```python
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    name = "Аня"
    print(name)
    ```
    **Ответ:** Программа выведет ваше имя, например, `Аня`.

---

### Задача 2. Обмен значениями
Даны две переменные: `a = 5` и `b = 10`. Поменяйте их значения местами так, чтобы `a` стало `10`, а `b` стало `5`. Выведите результат.

```python
a = 5
b = 10
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение (Python-стиль):**
    ```python
    a = 5
    b = 10
    a, b = b, a
    print(a, b)
    ```
    **Ответ:** `10 5`

---

### Задача 3. Типы данных
Создайте три переменные: `age` (целое число), `price` (дробное число) и `is_student` (логическое значение). Выведите тип каждой переменной с помощью `type()`.

```python
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    age = 15
    price = 99.99
    is_student = True
    print(type(age))
    print(type(price))
    print(type(is_student))
    ```
    **Ответ:** `<class 'int'>`, `<class 'float'>`, `<class 'bool'>`.

---

## ➕ Арифметические операторы

### Задача 4. Калькулятор
Даны числа `x = 17` и `y = 5`. Найдите их сумму, разность, произведение и частное (обычное деление).

```python
x = 17
y = 5
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    x = 17
    y = 5
    print(x + y)
    print(x - y)
    print(x * y)
    print(x / y)
    ```
    **Ответ:** `22`, `12`, `85`, `3.4`.

---

### Задача 5. Целочисленное деление и остаток
Даны числа `a = 23` и `b = 4`. Найдите результат целочисленного деления (`//`) и остаток от деления (`%`).

```python
a = 23
b = 4
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    a = 23
    b = 4
    print(a // b)
    print(a % b)
    ```
    **Ответ:** `5` (так как 23 = 4 * 5 + 3) и `3`.

---

### Задача 6. Возведение в степень
Вычислите `2` в степени `10` с помощью оператора `**`.

```python
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    print(2 ** 10)
    ```
    **Ответ:** `1024`.

---

### Задача 7. Приоритет операторов
Что выведет следующий код? Сначала подумайте, затем запустите.
`print(2 + 3 * 4)`

```python
print(2 + 3 * 4)
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Ответ:** `14`. Сначала выполняется умножение (`3 * 4 = 12`), затем сложение (`2 + 12`).

---

## ⚖️ Операторы сравнения

### Задача 8. Сравнение чисел
Даны числа `a = 7` и `b = 7`. Проверьте, равны ли они (`==`), и выведите результат.

```python
a = 7
b = 7
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    a = 7
    b = 7
    print(a == b)
    ```
    **Ответ:** `True`.

---

### Задача 9. Больше или меньше
Даны числа `x = 10` и `y = 3`. Проверьте, правда ли, что `x` больше `y` (`>`).

```python
x = 10
y = 3
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    x = 10
    y = 3
    print(x > y)
    ```
    **Ответ:** `True`.

---

### Задача 10. Не равно
Даны строки `s1 = "apple"` и `s2 = "orange"`. Проверьте, что они не равны (`!=`).

```python
s1 = "apple"
s2 = "orange"
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    s1 = "apple"
    s2 = "orange"
    print(s1 != s2)
    ```
    **Ответ:** `True`.

---

### Задача 11. Сложное условие
Даны числа `age = 14` и `has_pass = True`. Проверьте, что возраст больше или равен 14 **И** есть пропуск (используйте `and`). Выведите результат.

```python
age = 14
has_pass = True
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    age = 14
    has_pass = True
    print(age >= 14 and has_pass)
    ```
    **Ответ:** `True`.

---

### Задача 12. Логическое ИЛИ
Даны числа `a = 5` и `b = 0`. Проверьте, что хотя бы одно из них больше нуля (используйте `or`).

```python
a = 5
b = 0
# Напишите ваш код ниже
```

[:octicons-play-16: Открыть в песочнице](https://www.programiz.com/python-programming/online-compiler/){ .md-button target="_blank" }

??? success "Посмотреть решение и ответ"
    **Решение:**
    ```python
    a = 5
    b = 0
    print(a > 0 or b > 0)
    ```
    **Ответ:** `True`.