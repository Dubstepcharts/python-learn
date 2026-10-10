# Алгоритмы scikit-learn

!!! abstract "Уровень: ⭐⭐⭐"
    Нужно знать: [Основы](basics.md).

---

## 📌 Классификация

### Логистическая регрессия

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=1000)
```

Быстрая, простая, хорошая база. Работает для линейно разделимых данных.

### K-ближайших соседей (KNN)

```python
from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)
```

Простой: класс определяется по соседям. **Требует масштабирования.**

### Дерево решений

```python
from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(max_depth=5)
```

«Если ..., то ...». **Легко интерпретируется.** Склонно к переобучению.

### Случайный лес

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, random_state=42)
```

Много деревьев + голосование. **Сильный универсал.**

### Градиентный бустинг

```python
from sklearn.ensemble import GradientBoostingClassifier, HistGradientBoostingClassifier

model = GradientBoostingClassifier(n_estimators=100)
model = HistGradientBoostingClassifier()   # быстрее
```

Обычно **самый точный** из «классических».

### Метод опорных векторов (SVM)

```python
from sklearn.svm import SVC

model = SVC(kernel="rbf", C=1.0)
```

Хорош на небольших данных. **Требует масштабирования.**

### Наивный Байес

```python
from sklearn.naive_bayes import GaussianNB, MultinomialNB

model = GaussianNB()                # непрерывные признаки
model = MultinomialNB()             # текст (частоты слов)
```

Классика для текстов.

---

## 📌 Регрессия

### Линейная

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
```

Ищет прямую `y = a·x + b`.

### Ridge / Lasso / ElasticNet

```python
from sklearn.linear_model import Ridge, Lasso, ElasticNet

Ridge(alpha=1.0)          # L2-регуляризация
Lasso(alpha=0.1)          # L1, обнуляет коэффициенты
ElasticNet(alpha=0.1)     # смесь
```

Помогают против переобучения.

### Полиномиальная

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LinearRegression

model = make_pipeline(
    PolynomialFeatures(degree=2),
    LinearRegression(),
)
```

### Дерево регрессии и Random Forest

```python
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

DecisionTreeRegressor(max_depth=5)
RandomForestRegressor(n_estimators=100)
```

---

## 📌 Кластеризация (без учителя)

### K-средних (KMeans)

```python
from sklearn.cluster import KMeans

model = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = model.fit_predict(X)
```

Разбивает на k групп по близости.

### Иерархическая

```python
from sklearn.cluster import AgglomerativeClustering

model = AgglomerativeClustering(n_clusters=3)
```

### DBSCAN

```python
from sklearn.cluster import DBSCAN

model = DBSCAN(eps=0.5, min_samples=5)
```

Находит кластеры **произвольной формы** и **выбросы**.

### Метод локтя

Как выбрать `k`:

```python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

plt.plot(range(1, 11), inertias, marker="o")
plt.xlabel("k")
plt.ylabel("Inertia")
plt.show()
```

Ищите «локоть» — где график резко выпрямляется.

---

## 📌 Уменьшение размерности

### PCA

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)
```

Главные компоненты — сжимает признаки, сохраняя максимум информации.

### t-SNE

```python
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, random_state=42)
X_2d = tsne.fit_transform(X)
```

Для **визуализации** многомерных данных.

---

## 📌 Отбор признаков

```python
from sklearn.feature_selection import SelectKBest, f_classif, chi2

selector = SelectKBest(score_func=f_classif, k=5)
X_selected = selector.fit_transform(X, y)
```

Также: `RFE`, `VarianceThreshold`, `mutual_info_classif`.

---

## 📌 Деревья и ансамбли — важные параметры

| Параметр | Смысл |
|---|---|
| `n_estimators` | Число деревьев (больше — лучше, но медленнее) |
| `max_depth` | Глубина дерева (защита от переобучения) |
| `min_samples_split` | Минимум для разделения узла |
| `min_samples_leaf` | Минимум в листе |
| `max_features` | Признаков на узел |
| `random_state` | Воспроизводимость |
| `class_weight="balanced"` | Для несбалансированных классов |

---

## 📌 Подбор гиперпараметров

### GridSearchCV

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [None, 5, 10],
}

grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    n_jobs=-1,
)
grid.fit(X_train, y_train)

print(grid.best_params_)
print(grid.best_score_)
```

Перебирает **все** комбинации.

### RandomizedSearchCV

```python
from sklearn.model_selection import RandomizedSearchCV

search = RandomizedSearchCV(model, param_distributions, n_iter=50, cv=5)
```

Пробует **случайные** комбинации — быстрее.

---

## 📌 Сохранение и загрузка

```python
import joblib

joblib.dump(grid.best_estimator_, "best_model.pkl")
model = joblib.load("best_model.pkl")
```

---

## 📌 Как выбрать модель

| Ситуация | Что попробовать |
|---|---|
| Простая база | LogisticRegression / LinearRegression |
| Нелинейно, средние данные | RandomForest |
| Нужна максимальная точность | GradientBoosting / HistGradientBoosting |
| Интерпретируемость | DecisionTree, LogisticRegression |
| Много признаков, мало данных | Ridge / Lasso |
| Текст | MultinomialNB / LinearSVC |
| Кластеры неизвестной формы | DBSCAN |
| Быстрая визуализация | PCA / t-SNE |

**Правило:** начните с **RandomForest** — он даёт хороший результат почти всегда. Потом улучшайте.

---

## ⚠️ Частые ошибки

!!! warning "Переобучение"
    Модель идеальна на train, плоха на test. Уменьшайте сложность
    (`max_depth`, `n_estimators`, регуляризация).

!!! warning "Недообучение"
    Модель плоха и там, и там. Увеличьте сложность или добавьте признаки.

!!! warning "Утечка данных"
    Например, масштабирование **до** разделения — испортит оценку.

!!! warning "Забыли `n_init=10` у KMeans"
    В новых версиях sklearn это уже по умолчанию, но будьте внимательны.

!!! warning "`random_state` забыт"
    Результаты не воспроизводимы.

---

## 🧪 Упражнения

1. ⭐ Обучите KNN на ирисах.
2. ⭐ Сравните DecisionTree и RandomForest.
3. ⭐⭐ GridSearch по `max_depth` и `n_estimators`.
4. ⭐⭐ KMeans на 3 кластера + визуализация PCA.
5. ⭐⭐ Ridge и Lasso для регрессии на `diabetes`.
6. ⭐⭐⭐ Полный проект: предсказание цены жилья (`California Housing`).

---

## 🔗 Что дальше

→ [requests](../19-requests/index.md) — работа с интернетом.