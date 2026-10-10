# Структуры данных

!!! abstract "Уровень: ⭐⭐⭐"

---

## 📌 Что это

**Структура данных** — способ организации данных, от которого зависит,
как быстро их можно искать, добавлять, удалять.

Правильный выбор = **ускорение в разы**. Неправильный = «тормозит и жрёт
память».

---

## 📋 Обзор основных

| Структура | Доступ | Поиск | Вставка | Удаление |
|---|---|---|---|---|
| Массив / список | O(1) | O(n) | O(n) | O(n) |
| Связный список | O(n) | O(n) | O(1) | O(1) |
| Стек | O(n) | O(n) | O(1) | O(1) |
| Очередь | O(n) | O(n) | O(1) | O(1) |
| Хеш-таблица | — | O(1) | O(1) | O(1) |
| Дерево поиска | O(log n) | O(log n) | O(log n) | O(log n) |
| Куча (heap) | O(1) мин | O(n) | O(log n) | O(log n) |

---

## 📌 Стек (LIFO)

**Последним пришёл — первым вышел**. Как стопка тарелок.

```python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, x): self._items.append(x)
    def pop(self): return self._items.pop() if self._items else None
    def peek(self): return self._items[-1] if self._items else None
    def is_empty(self): return not self._items
    def __len__(self): return len(self._items)
```

**Где применяется:**
- Отмена действий (Ctrl+Z)
- Проверка скобок `((()))`
- Обход дерева в глубину
- Вычисление выражений (обратная польская запись)
- Стек вызовов функций

---

## 📌 Очередь (FIFO)

**Первым пришёл — первым вышел**. Как очередь в столовой.

```python
from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, x): self._items.append(x)
    def dequeue(self): return self._items.popleft() if self._items else None
    def is_empty(self): return not self._items
```

**Обязательно `deque`**, а не `list` — `list.pop(0)` работает O(n).

**Где применяется:**
- Обработка задач по порядку
- BFS (обход в ширину)
- Буферы ввода/вывода
- Планировщики

### Приоритетная очередь

```python
import heapq

pq = []
heapq.heappush(pq, (3, "среднее"))
heapq.heappush(pq, (1, "важное"))
heapq.heappush(pq, (5, "потом"))

while pq:
    priority, task = heapq.heappop(pq)
    print(priority, task)
# 1 важное
# 3 среднее
# 5 потом
```

**Где:** планирование, алгоритм Дейкстры, обработка событий.

---

## 📌 Связный список

Каждый узел хранит значение и ссылку на следующий.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, value):
        new = Node(value)
        if not self.head:
            self.head = new
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = new

    def __iter__(self):
        cur = self.head
        while cur:
            yield cur.value
            cur = cur.next
```

**Плюс:** вставка/удаление в начало — O(1).
**Минус:** доступ по индексу — O(n).

В Python редко нужен — обычно список быстрее.

---

## 📌 Хеш-таблица

**Основа `dict` и `set`.** Ключ превращается в число (хеш), которое
указывает на «корзину».

```python
# В Python уже встроено
phone_book = {"Аня": "123", "Борис": "456"}
phone_book["Вика"] = "789"
print(phone_book["Аня"])       # O(1)
```

**Как работает:**
1. `hash(key)` → число
2. По модулю → индекс в массиве
3. Коллизии разрешаются цепочками или открытой адресацией

**Где:** кеш, счётчики, поиск по имени, дедупликация.

---

## 📌 Дерево поиска (BST)

В BST для каждого узла: **левое поддерево < узел < правое поддерево**.

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        self.root = self._insert(self.root, value)

    def _insert(self, node, value):
        if node is None:
            return TreeNode(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        elif value > node.value:
            node.right = self._insert(node.right, value)
        return node

    def search(self, value):
        cur = self.root
        while cur:
            if value == cur.value:
                return True
            cur = cur.left if value < cur.value else cur.right
        return False

    def inorder(self, node=None):
        node = node or self.root
        if node:
            yield from self.inorder(node.left)
            yield node.value
            yield from self.inorder(node.right)
```

**Сложность:** O(log n) в среднем, O(n) в худшем (если дерево
«перекосилось»).

**Сбалансированные деревья** (AVL, красно-чёрные) держат высоту
O(log n) всегда. В Python есть `bisect` для сортированных списков
и `sortedcontainers` для сбалансированных деревьев.

---

## 📌 Куча (heap)

**Min-heap** — минимум всегда наверху. **Max-heap** — максимум.

```python
import heapq

nums = [5, 1, 8, 3, 2]
heapq.heapify(nums)            # перестроить в кучу

heapq.heappush(nums, 0)
smallest = heapq.heappop(nums)  # 0

# N самых больших
top3 = heapq.nlargest(3, [5, 1, 8, 3, 2])
bottom3 = heapq.nsmallest(3, [5, 1, 8, 3, 2])
```

**Где:** приоритетные очереди, top-K, планировщики, Dijkstra.

---

## 📌 Граф

**Граф** — множество вершин и связей между ними.

**Способы хранения:**

```python
# Список смежности (обычно лучший)
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}

# Матрица смежности (для плотных графов)
matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
]
```

**Алгоритмы на графах:**

| Алгоритм | Что решает |
|---|---|
| BFS | Кратчайший путь в невзвешенном графе |
| DFS | Компоненты связности, циклы |
| Dijkstra | Кратчайший путь с весами |
| Bellman-Ford | То же, с отрицательными весами |
| Floyd-Warshall | Все пары кратчайших путей |
| Topological sort | Порядок зависимостей |
| Kruskal / Prim | Минимальное остовное дерево |

**Где:** соцсети, карты, компиляторы, коммиты Git, рекомендации.

---

## 💡 Пример — проверка скобок

```python
def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(is_balanced("()[]{}"))      # True
print(is_balanced("([)]"))         # False
print(is_balanced("(("))            # False
```

---

## 💡 Пример — топ-K самых частых

```python
from collections import Counter
import heapq

words = "кот пёс кот кот пёс ёж кот пёс ёж лиса".split()
counter = Counter(words)

top = heapq.nlargest(3, counter.items(), key=lambda x: x[1])
print(top)     # [('кот', 4), ('пёс', 3), ('ёж', 2)]
```

---

## ⚠️ Частые ошибки

!!! warning "`list.pop(0)` вместо `deque.popleft()`"
    O(n) vs O(1). На больших данных — разница в тысячи раз.

!!! warning "`x in list` вместо `x in set`"
    O(n) vs O(1). Превращайте списки в множества для проверки наличия.

!!! warning "Рекурсия без ограничения глубины"
    По умолчанию лимит ~1000 вызовов. Для глубокой рекурсии — переписывайте
    на цикл или `sys.setrecursionlimit`.

!!! warning "Куча через `sorted` при каждой вставке"
    O(n log n) на каждую операцию. Используйте `heapq` — O(log n).

---

## 🧪 Упражнения

1. ⭐ Стек: проверка скобок.
2. ⭐ Очередь через `deque`.
3. ⭐⭐ Приоритетная очередь через `heapq`.
4. ⭐⭐ BST: вставка и поиск.
5. ⭐⭐ BFS и DFS на графе.
6. ⭐⭐⭐ Dijkstra для графа с весами.
7. ⭐⭐⭐ LRU-кеш через `OrderedDict`.

---

## 🔗 Что дальше

→ [Продвинутое ML](../29-ml-advanced/index.md).