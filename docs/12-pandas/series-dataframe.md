# Series и DataFrame

!!! abstract "Уровень: ⭐⭐ Средний"
    Нужно знать: [словари](../04-collections/dicts.md), [списки](../04-collections/lists.md).

---

## 🍎 Объясняем просто

!!! example "Два «кирпичика» pandas"
    - **`Series`** — одна колонка данных с индексами (как список с подписями)
    - **`DataFrame`** — таблица: много колонок, у каждой — имя

    ```python
    import pandas as pd

    s = pd.Series([10, 20, 30], index=["а", "б", "в"])
    df = pd.DataFrame({
        "имя": ["Аня", "Борис"],
        "возраст": [12, 11],
    })
    ```

---

## 📖 `Series`

### Создание

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4])
# 0    1
# 1    2
# 2    3
# 3    4
# dtype: int64

# С индексами
s = pd.Series([10, 20, 30], index=["a", "b", "c"])

# Из словаря
s = pd.Series({"a": 1, "b": 2})

# С именем
s = pd.Series([1, 2, 3], name="числа")
```

### Атрибуты

| Атрибут | Что даёт |
|---|---|
| `.values` / `.to_numpy()` | Массив значений |
| `.index` | Индекс |
| `.name` | Имя |
| `.dtype` | Тип |
| `.shape` | (длина,) |
| `.size` | Число элементов |
| `.ndim` | 1 |
| `.empty` | Пустая? |
| `.is_unique` | Все уникальны? |
| `.hasnans` | Есть NaN? |
| `.nbytes` | Размер в байтах |

### Основные методы `Series`

| Метод | Что делает |
|---|---|
| `head(n)` / `tail(n)` | Первые/последние n |
| `sample(n)` | Случайные n |
| `describe()` | Статистика |
| `value_counts()` | Частоты |
| `unique()` | Уникальные |
| `nunique()` | Сколько уникальных |
| `sort_values()` | Сортировка по значению |
| `sort_index()` | Сортировка по индексу |
| `rank()` | Ранги |
| `sum()`, `mean()`, `median()`, `std()`, `var()`, `min()`, `max()` | Статистика |
| `cumsum()`, `cumprod()`, `cummax()`, `cummin()` | Накопительные |
| `diff()`, `pct_change()` | Разница, проценты |
| `abs()`, `round(n)` | Модуль, округление |
| `clip(lower, upper)` | Ограничить значения |
| `apply(func)` | Применить функцию |
| `map(dict_or_func)` | Преобразовать |
| `fillna(x)` | Заменить NaN |
| `dropna()` | Удалить NaN |
| `isna()` / `isnull()` | Проверка NaN |
| `notna()` / `notnull()` | Не NaN |
| `astype(t)` | Сменить тип |
| `to_list()`, `tolist()` | В список |
| `to_dict()` | В словарь |
| `to_frame()` | В DataFrame |
| `reset_index()` | Сбросить индекс |
| `rename(...)` | Переименовать |
| `where(cond)`, `mask(cond)` | Фильтры |
| `between(a, b)` | В диапазоне |
| `isin([...])` | В списке? |
| `duplicated()`, `drop_duplicates()` | Дубликаты |
| `plot()` | График |

```python
s = pd.Series([3, 1, 4, 1, 5, 9, 2, 6])
print(s.mean())                  # 3.875
print(s.value_counts())          # частоты
print(s.sort_values())           # отсортировано
print(s.cumsum())                # накопительная сумма
print(s.apply(lambda x: x * 2))  # × 2
```

---

## 📖 `DataFrame`

### Создание

```python
import pandas as pd

# Из словаря списков
df = pd.DataFrame({
    "имя": ["Аня", "Борис", "Вика"],
    "возраст": [12, 11, 13],
    "город": ["Москва", "Питер", "Казань"],
})

# Из списка словарей
df = pd.DataFrame([
    {"имя": "Аня", "возраст": 12},
    {"имя": "Борис", "возраст": 11},
])

# Из numpy-массива
import numpy as np
df = pd.DataFrame(np.random.randn(4, 3), columns=["a", "b", "c"])

# Пустой
df = pd.DataFrame()
```

### Атрибуты

| Атрибут | Что даёт |
|---|---|
| `.shape` | (строк, столбцов) |
| `.columns` | Названия колонок |
| `.index` | Индексы строк |
| `.values` | Массив |
| `.dtypes` | Типы колонок |
| `.info()` | Сводка (метод) |
| `.size` | Всего элементов |
| `.empty` | Пустой? |
| `.T` | Транспонировать |
| `.axes` | Индексы и столбцы |
| `.ndim` | 2 |

### Быстрый обзор

```python
df.head()           # первые 5
df.tail()           # последние 5
df.sample(3)        # 3 случайные
df.info()           # типы и пропуски
df.describe()       # статистика
df.shape            # (3, 3)
df.columns          # Index(['имя', 'возраст', 'город'])
```

### Выбор столбцов

```python
df["имя"]                    # Series
df[["имя", "город"]]         # DataFrame с двумя колонками
```

### Новый столбец

```python
df["год_рождения"] = 2024 - df["возраст"]
df["старший"] = df["возраст"] > 12
```

### Удаление

```python
df.drop("город", axis=1)              # удалить колонку (axis=1)
df.drop(0, axis=0)                    # удалить строку
df.drop(["имя", "город"], axis=1)
df.dropna()                           # строки с NaN
df.drop_duplicates()                  # дубликаты
```

### Индексы

```python
df.set_index("имя")                   # сделать колонку индексом
df.reset_index()                      # вернуть индекс в колонку
df.sort_index()                       # сортировка по индексу
df.sort_values("возраст")             # сортировка по значению
df.sort_values(["город", "возраст"], ascending=[True, False])
```

### Все ключевые методы `DataFrame`

| Категория | Методы |
|---|---|
| Просмотр | `head`, `tail`, `sample`, `info`, `describe`, `shape`, `columns` |
| Выбор | `loc`, `iloc`, `at`, `iat`, `query` |
| Изменение | `assign`, `insert`, `drop`, `rename`, `astype`, `replace`, `fillna`, `dropna`, `drop_duplicates` |
| Индексы | `set_index`, `reset_index`, `sort_index`, `sort_values` |
| Статистика | `sum`, `mean`, `median`, `std`, `var`, `min`, `max`, `count`, `quantile`, `corr`, `cov`, `describe` |
| Группировка | `groupby`, `pivot`, `pivot_table`, `crosstab` |
| Соединение | `merge`, `join`, `concat`, `append` (устарел) |
| Преобразование | `apply`, `applymap`, `map`, `transform`, `pipe` |
| Дата/время | `dt` (аксессор), `resample`, `rolling`, `expanding`, `ewm` |
| Строки | `str` (аксессор) |
| NaN | `isna`, `notna`, `fillna`, `dropna`, `interpolate` |
| Экспорт | `to_csv`, `to_excel`, `to_json`, `to_sql`, `to_html`, `to_dict`, `to_numpy` |
| Графики | `plot`, `hist`, `boxplot`, `scatter_matrix` |

---

## 🎯 `.loc` и `.iloc`

`.loc` — по **метке** (по имени). `.iloc` — по **позиции** (число).

```python
df = pd.DataFrame({
    "имя": ["Аня", "Борис", "Вика"],
    "возраст": [12, 11, 13],
}, index=["a", "b", "c"])

# .loc — по метке
df.loc["a"]                     # строка с индексом 'a'
df.loc["a", "имя"]              # конкретное значение
df.loc["a":"b"]                 # диапазон (включительно)
df.loc[df["возраст"] > 11]      # с фильтром

# .iloc — по позиции
df.iloc[0]                      # первая строка
df.iloc[0, 0]                   # первый элемент
df.iloc[0:2]                    # первые две
df.iloc[:, 1]                   # второй столбец
```

!!! tip "Мнемоника"
    - **`.loc`** → **l**abels (по названиям)
    - **`.iloc`** → **i**nteger **loc**ations (по номерам)

### `.at` и `.iat`

Быстрее для одного значения:

```python
df.at["a", "имя"]       # по метке
df.iat[0, 1]            # по позиции
```

---

## 📌 Работа с пропусками

```python
import numpy as np

df = pd.DataFrame({
    "a": [1, 2, np.nan, 4],
    "b": [5, np.nan, np.nan, 8],
})

df.isna()                     # где NaN
df.isna().sum()               # сколько NaN в каждой колонке
df.dropna()                   # удалить строки с NaN
df.dropna(axis=1)             # удалить колонки
df.fillna(0)                  # заменить на 0
df.fillna(df.mean())          # заменить средним
df["a"].interpolate()         # линейная интерполяция
```

---

## 📌 Работа со строками: `.str`

```python
df = pd.DataFrame({"имя": ["аня", "БОРИС", "вика"]})

df["имя"].str.upper()             # АНЯ, БОРИС, ВИКА
df["имя"].str.capitalize()        # Аня, Борис, Вика
df["имя"].str.len()               # длины
df["имя"].str.contains("а")       # True/False
df["имя"].str.startswith("Б")
df["имя"].str.replace("а", "@")
df["имя"].str.split("а")          # разбить
```

---

## 📌 Работа с датами: `.dt`

```python
df = pd.DataFrame({"дата": pd.to_datetime(["2024-01-15", "2024-05-20"])})

df["год"] = df["дата"].dt.year
df["месяц"] = df["дата"].dt.month
df["день"] = df["дата"].dt.day
df["день_недели"] = df["дата"].dt.dayofweek
df["день_имя"] = df["дата"].dt.day_name()
```

---

## 💡 Примеры

### Пример 1. Простая таблица 📊

```python
import pandas as pd

df = pd.DataFrame({
    "ученик": ["Аня", "Борис", "Вика", "Глеб"],
    "математика": [5, 4, 5, 3],
    "русский": [4, 4, 5, 3],
})

print(df)
print(df.mean(numeric_only=True))       # средние по предметам
print(df["математика"].max())           # 5
```

### Пример 2. Новые колонки 🧮

```python
df["средний"] = (df["математика"] + df["русский"]) / 2
df["отличник"] = df["средний"] >= 4.5
print(df)
```

### Пример 3. Сортировка 🔀

```python
df_sorted = df.sort_values("средний", ascending=False)
print(df_sorted.head(3))
```

### Пример 4. Сюжетный — олимпиада 🏅

```python
import pandas as pd

results = pd.DataFrame({
    "команда": ["А", "Б", "А", "Б", "А", "Б"],
    "баллы": [10, 12, 15, 8, 14, 11],
})

total = results.groupby("команда")["баллы"].sum()
print(total)         # А: 39, Б: 31
```

---

## ⚠️ Частые ошибки

!!! warning "Ошибка 1. Изменение «среза» DataFrame"
    ```python
    df[df["a"] > 0]["b"] = 100   # ❌ SettingWithCopyWarning
    ```
    **Правильно:** `df.loc[df["a"] > 0, "b"] = 100`.

!!! warning "Ошибка 2. `inplace=True` — не возвращает DataFrame"
    ```python
    df = df.dropna(inplace=True)   # ❌ df = None
    df.dropna(inplace=True)        # ✅
    df = df.dropna()                # ✅ тоже вариант
    ```

!!! warning "Ошибка 3. `df.column` вместо `df[\"column\"]`"
    Работает, но ломается для колонок с пробелами. Используйте квадратные скобки.

!!! warning "Ошибка 4. Забыли `numeric_only=True`"
    ```python
    df.mean()      # ❌ может упасть на строках
    df.mean(numeric_only=True)   # ✅
    ```

!!! warning "Ошибка 5. Двойные кавычки имён"
    Имя колонки `" a"` (с пробелом) не равно `"a"`. Проверяйте через `df.columns`.

---

## 🧪 Упражнения

1. ⭐ Создайте DataFrame с 3 колонками и 5 строками.
2. ⭐ Выведите первые 2 строки, типы, средние.
3. ⭐⭐ Добавьте колонку — сумму двух других.
4. ⭐⭐ Отсортируйте по убыванию одной колонки.
5. ⭐⭐ Замените пропуски средним значением.
6. ⭐⭐⭐ Отфильтруйте строки по двум условиям.
7. ⭐⭐⭐ Переименуйте колонки и сохраните результат в CSV.

---

## 🔗 Что дальше

→ [Чтение и запись](read-write.md).