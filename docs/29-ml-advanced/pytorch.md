# PyTorch

!!! abstract "Уровень: ⭐⭐⭐"

---

## 🚀 Установка

```bash
pip install torch torchvision
```

Проверка:

```python
import torch
print(torch.__version__)
print(torch.cuda.is_available())   # есть ли GPU
```

---

## 📖 Тензоры

**Тензор** — многомерный массив (как NumPy), но умеет:
- работать на GPU
- считать градиенты автоматически

```python
import torch

x = torch.tensor([1, 2, 3])
y = torch.zeros(2, 3)
z = torch.randn(3, 4)

# Как NumPy
x + 10
x * 2
x @ y.shape      # ошибка типов

# Преобразования
x.numpy()                  # → numpy
torch.from_numpy(nparr)     # ← numpy
x.to("cuda")                 # на GPU
```

---

## 📌 Автоградиент

Главная фича PyTorch. Считает производные автоматически.

```python
x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x + 1
y.backward()
print(x.grad)      # 2x + 3 при x=2 → 7
```

**Как это работает:** PyTorch запоминает все операции и строит граф.
`.backward()` проходит граф в обратном порядке (backpropagation).

---

## 📌 Простая нейросеть

```python
import torch
import torch.nn as nn

# Модель
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 16)
        self.fc2 = nn.Linear(16, 3)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

model = Net()
print(model)
```

**Класс `nn.Module`** — база для всех моделей. Определяете слои в
`__init__` и порядок применения в `forward`.

---

## 📌 Полный цикл обучения

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
import numpy as np

# Данные
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

X_train = torch.tensor(X_train, dtype=torch.float32)
y_train = torch.tensor(y_train, dtype=torch.long)
X_test  = torch.tensor(X_test,  dtype=torch.float32)
y_test  = torch.tensor(y_test,  dtype=torch.long)

# DataLoader
train_ds = TensorDataset(X_train, y_train)
train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)

# Модель
model = Net()
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

# Обучение
for epoch in range(100):
    for xb, yb in train_loader:
        pred = model(xb)
        loss = loss_fn(pred, yb)

        optimizer.zero_grad()      # ⚠️ обнулить градиенты
        loss.backward()
        optimizer.step()

    if (epoch + 1) % 20 == 0:
        print(f"Epoch {epoch + 1}, loss = {loss.item():.4f}")

# Оценка
with torch.no_grad():
    preds = model(X_test).argmax(dim=1)
    accuracy = (preds == y_test).float().mean()
    print(f"Accuracy: {accuracy:.2%}")
```

**Ключевые шаги обучения:**
1. `pred = model(xb)` — forward
2. `loss = loss_fn(pred, yb)` — ошибка
3. `optimizer.zero_grad()` — обнулить старые градиенты
4. `loss.backward()` — backward
5. `optimizer.step()` — обновить веса

---

## 📌 Сохранение модели

```python
torch.save(model.state_dict(), "model.pth")

# Загрузка
model = Net()
model.load_state_dict(torch.load("model.pth"))
model.eval()
```

---

## 📌 GPU

```python
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

for xb, yb in train_loader:
    xb, yb = xb.to(device), yb.to(device)
    ...
```

В 10–50 раз быстрее для больших сетей.

---

## 📌 Простая CNN для картинок

```python
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.25)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)           # flatten
        x = self.dropout(self.relu(self.fc1(x)))
        return self.fc2(x)
```

**CNN** — свёрточные слои для изображений:
- `Conv2d` — извлекает локальные признаки
- `MaxPool2d` — уменьшает размер
- `Linear` — финальный классификатор

---

## 📌 Готовые модели (torchvision)

```python
from torchvision import models, transforms

# Предобученный ResNet
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.eval()

# Преобразования для картинки
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                          std=[0.229, 0.224, 0.225]),
])
```

**Transfer learning** — берём предобученную сеть и дообучаем на своих данных.
Требует **в разы** меньше данных и времени.

---

## ⚠️ Частые ошибки

!!! warning "Забыли `optimizer.zero_grad()`"
    Градиенты накапливаются → неправильное обучение.

!!! warning "Забыли `model.eval()` перед оценкой"
    Dropout и BatchNorm ведут себя по-разному в обучении и оценке.

!!! warning "Забыли `with torch.no_grad()`"
    Память забивается графами, которых не нужно.

!!! warning "Данные не на том же device, что модель"
    `.to(device)` для модели **и** для данных.

!!! warning "Слишком большой batch"
    Не влезает в память GPU. Уменьшите или используйте gradient accumulation.

---

## 🧪 Упражнения

1. ⭐ Тензоры: базовые операции.
2. ⭐ Автоградиент: градиент `x³` при `x=2`.
3. ⭐⭐ Классификация ирисов на PyTorch.
4. ⭐⭐ Добавьте второй скрытый слой.
5. ⭐⭐ Сохраните и загрузите модель.
6. ⭐⭐⭐ CNN на MNIST — точность >98%.
7. ⭐⭐⭐ Transfer learning на своём датасете.

---

## 🔗 Что дальше

→ [TensorFlow / Keras](tensorflow.md).