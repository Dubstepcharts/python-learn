# Сортировка и поиск

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"

---

## 📖 Сортировки: обзор

| Алгоритм | Среднее | Худшее | Память | Стабильность |
|---|---|---|---|---|
| Вставками | O(n²) | O(n²) | O(1) | ✅ |
| Выбором | O(n²) | O(n²) | O(1) | ❌ |
| Пузырьком | O(n²) | O(n²) | O(1) | ✅ |
| Быстрая (quick) | O(n log n) | O(n²) | O(log n) | ❌ |
| Слиянием (merge) | O(n log n) | O(n log n) | O(n) | ✅ |
| Пирамидальная (heap) | O(n log n) | O(n log n) | O(1) | ❌ |
| Подсчётом | O(n + k) | O(n + k) | O(k) | ✅ |
| Поразрядная | O(n·k) | O(n·k) | O(n + k) | ✅ |

Python использует **Timsort** (разновидность merge sort) — стабильную,
быструю на почти отсортированных данных.

---

## 📌 Пузырьком (для обучения)

```python
def bubble_sort(lst):
    n = len(lst)
    for i in range(n):
        for j in range(0, n - i - 1):
            if lst[j] > lst[j + 1]:
                lst[j], lst[j + 1] = lst[j + 1], lst[j]
    return lst
```

Простой, медленный. Используйте только для изучения.

---

## 📌 Сортировка слиянием

**«Разделяй и властвуй»:**

```python
def merge_sort(lst):
    if len(lst) <= 1:
        return lst

    mid = len(lst) // 2
    left = merge_sort(lst[:mid])
    right = merge_sort(lst[mid:])

    return merge(left, right)

def merge(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i]); i += 1
        else:
            result.append(b[j]); j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result
```

Гарантирует O(n log n), стабильна, но требует дополнительной памяти.

---

## 📌 Быстрая сортировка (quick)

```python
def quick_sort(lst):
    if len(lst) <= 1:
        return lst
    pivot = lst[len(lst) // 2]
    left   = [x for x in lst if x < pivot]
    middle = [x for x in lst if x == pivot]
    right  = [x for x in lst if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

Обычно самая быстрая на практике. Худший случай — уже отсортированный
массив с неудачным pivot.

---

## 📌 Встроенная сортировка

```python
lst.sort()                              # на месте
sorted(lst)                             # копия
lst.sort(key=lambda x: -x)               # по убыванию
lst.sort(key=len)                         # по длине
lst.sort(key=lambda s: (s.age, s.name))    # составной ключ
```

Используйте `sort` / `sorted`. Они **очень** оптимизированы.

---

## 📌 Бинарный поиск

Работает **только на отсортированном массиве**.

```python
def binary_search(lst, target):
    lo, hi = 0, len(lst) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if lst[mid] == target:
            return mid
        elif lst[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

**Сложность:** O(log n). На миллионе элементов — **20 шагов**.

### Встроенный `bisect`

```python
import bisect

lst = [1, 3, 5, 7, 9]
i = bisect.bisect_left(lst, 5)       # 2
i = bisect.bisect_right(lst, 5)      # 3

# Найти позицию для вставки
bisect.insort(lst, 6)                 # вставит, сохранив порядок
```

---

## 📌 Поиск в глубину (DFS) и в ширину (BFS)

Обход графа или дерева.

### DFS — рекурсия

```python
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return
    visited.add(node)
    print(node)
    for nxt in graph[node]:
        dfs(graph, nxt, visited)
```

### BFS — очередь

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        print(node)
        for nxt in graph[node]:
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
```

**DFS** — обход вглубь. **BFS** — по уровням. Применяются в играх, поиске
пути, анализе соцсетей.

---

## 💡 Пример — задача о рюкзаке (жадный алгоритм)

```python
def knapsack(items, capacity):
    # items: [(цена, вес)]
    items = sorted(items, key=lambda x: -x[0] / x[1])   # по цене/вес
    total_value = 0
    for value, weight in items:
        if weight <= capacity:
            capacity -= weight
            total_value += value
    return total_value
```

Жадный алгоритм — не всегда оптимален, но быстр.

---

## ⚠️ Частые ошибки

!!! warning "Бинарный поиск на несортированном массиве"
    Не найдёт ничего. Отсортируйте сначала — O(n log n).

!!! warning "Свой sort, когда есть `sorted`"
    Встроенный в 10–100 раз быстрее на CPython.

!!! warning "BFS через `list.pop(0)`"
    ```python
    queue.pop(0)      # O(n) — медленно
    ```
    **Правильно:** `collections.deque` с `popleft()` — O(1).

!!! warning "Рекурсия без базы"
    `RecursionError`. Ставьте `if` перед рекурсивным вызовом.

---

## 🧪 Упражнения

1. ⭐ Реализуйте пузырёк.
2. ⭐ Бинарный поиск.
3. ⭐⭐ Merge sort.
4. ⭐⭐ Quick sort.
5. ⭐⭐ DFS и BFS на графе.
6. ⭐⭐⭐ Сравните скорость 3 сортировок на 10 000 элементах.

---

## 🔗 Что дальше

→ [Структуры данных](data-structures.md).