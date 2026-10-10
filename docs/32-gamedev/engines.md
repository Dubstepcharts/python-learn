# Ursina и Panda3D

!!! abstract "Уровень: ⭐⭐⭐"

---

## 🚀 Ursina — 3D «как в Python»

Установка:

```bash
pip install ursina
```

**Первая 3D-сцена:**

```python
from ursina import *

app = Ursina()

# Куб
cube = Entity(model="cube", color=color.orange, scale=2, position=(0, 0, 5))

# Земля
ground = Entity(model="plane", texture="white_cube",
                scale=(20, 1, 20), color=color.gray)

# Камера
camera.position = (0, 5, -15)
camera.look_at(cube)

def update():
    cube.rotation_y += 1
    cube.rotation_x += 0.5

app.run()
```

`app.run()` открывает окно с 3D-сценой.

---

## 📌 Основы Ursina

### `Entity` — любой объект

```python
Entity(
    model="cube",           # cube, sphere, plane, quad, cylinder, cone
    color=color.red,
    texture="white_cube",   # или путь к файлу
    position=(0, 0, 0),
    rotation=(0, 0, 0),
    scale=(1, 1, 1),
    parent=some_entity,
    collider="box",          # для столкновений
)
```

### Готовые модели

`cube`, `sphere`, `plane`, `quad`, `circle`, `cylinder`, `cone`, `diamond`, `arrow`, `pipe` — и любые `.obj`/`.gltf`/`.blend`.

### Управление в `update()`

```python
def update():
    if held_keys["w"]:
        player.z += 0.1
    if held_keys["s"]:
        player.z -= 0.1
```

`held_keys` — глобальный словарь нажатых клавиш.

---

## 📌 Первое лицо — FPS-контроллер

```python
from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()

ground = Entity(model="plane", scale=100, texture="white_cube",
                texture_scale=(100, 100), collider="box")

for i in range(20):
    Entity(model="cube", color=color.random_color(),
           position=(random.uniform(-20, 20), 0.5, random.uniform(-20, 20)),
           scale=1, collider="box", texture="white_cube")

player = FirstPersonController()

app.run()
```

Мышь смотрит, WASD — ходит, пробел — прыгает. **Готово.**

---

## 📌 «Кликни и построй» (Minecraft-подобное)

```python
from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()

class Voxel(Button):
    def __init__(self, position=(0, 0, 0)):
        super().__init__(
            parent=scene,
            position=position,
            model="cube",
            origin_y=0.5,
            texture="white_cube",
            color=color.color(0, 0, random.uniform(0.9, 1)),
            highlight_color=color.lime,
        )

    def input(self, key):
        if self.hovered:
            if key == "left mouse down":
                Voxel(position=self.position + mouse.normal)
            elif key == "right mouse down":
                destroy(self)

for x in range(20):
    for z in range(20):
        Voxel(position=(x, 0, z))

player = FirstPersonController()
app.run()
```

Это **реально работающая** игра в стиле Minecraft — 30 строк.

---

## 📌 Panda3D — серьёзный движок

Установка:

```bash
pip install panda3d
```

**Минимальное приложение:**

```python
from direct.showbase.ShowBase import ShowBase
from panda3d.core import Point3

class MyApp(ShowBase):
    def __init__(self):
        super().__init__()

        self.scene = self.loader.loadModel("models/environment")
        self.scene.reparentTo(self.render)
        self.scene.setScale(0.25, 0.25, 0.25)
        self.scene.setPos(-8, 42, 0)

        self.camera.setPos(0, -30, 10)
        self.camera.lookAt(Point3(0, 0, 0))

app = MyApp()
app.run()
```

Panda3D мощнее, но требует **.egg** или **.bam** моделей (или конвертации
через CLI). Используется в **Toontown Online**, **Pirates of the Caribbean
Online** и других коммерческих играх.

**Когда выбирать Panda3D:**
- Нужны продвинутые шейдеры, физика Bullet, скелетная анимация
- Готовы писать много кода ради гибкости

**Когда Ursina:**
- Быстрый прототип 3D-игры
- Обучение
- Простые сцены

---

## 📌 Arcade — современный 2D

```bash
pip install arcade
```

```python
import arcade

class Game(arcade.Window):
    def __init__(self):
        super().__init__(800, 600, "Arcade")
        arcade.set_background_color(arcade.color.SKY_BLUE)
        self.x, self.y = 400, 300
        self.dx, self.dy = 3, 3

    def on_draw(self):
        self.clear()
        arcade.draw_circle_filled(self.x, self.y, 30, arcade.color.RED)

    def on_update(self, delta_time):
        self.x += self.dx
        self.y += self.dy
        if self.x < 30 or self.x > 770: self.dx *= -1
        if self.y < 30 or self.y > 570: self.dy *= -1

Game()
arcade.run()
```

Arcade использует OpenGL, работает быстрее pygame, поддерживает шейдеры.
Синтаксис похож на pygame — легко перейти.

---

## 💡 Пример Ursina — простая 3D-игра

```python
from ursina import *

app = Ursina()

ground = Entity(model="plane", scale=50, texture="white_cube",
                texture_scale=(50, 50), collider="box", color=color.gray)

player = Entity(model="cube", color=color.azure, scale=1,
                position=(0, 1, 0), collider="box")
player.speed = 5

camera.position = (0, 15, -15)
camera.look_at(player)

score = 0
score_text = Text(text=f"Счёт: {score}", position=(-0.85, 0.45), scale=2)

coins = []
for _ in range(10):
    coin = Entity(model="sphere", color=color.yellow, scale=0.7,
                  position=(random.uniform(-20, 20), 0.5, random.uniform(-20, 20)),
                  collider="sphere")
    coins.append(coin)

def update():
    global score
    player.x += (held_keys["d"] - held_keys["a"]) * time.dt * player.speed
    player.z += (held_keys["w"] - held_keys["s"]) * time.dt * player.speed

    for coin in coins[:]:
        if distance(player, coin) < 1.2:
            coins.remove(coin)
            destroy(coin)
            score += 1
            score_text.text = f"Счёт: {score}"

    if not coins:
        score_text.text = "Победа!"

app.run()
```

---

## ⚠️ Частые ошибки

!!! warning "Забыли `time.dt`"
    Движение должно быть независимо от FPS:
    ```python
    player.x += speed * time.dt
    ```
    `time.dt` — время с прошлого кадра.

!!! warning "Ursina устарела?"
    Ursina активно развивается. Если что-то не работает — обновите:
    ```bash
    pip install --upgrade ursina
    ```

!!! warning "Panda3D требует моделей"
    Из коробки — только примитивы. Модели нужны в формате `.egg`/`.bam`/`.gltf`.

!!! warning "3D на слабом компьютере"
    Уменьшите разрешение окна, количество полигонов, отключите тени.

---

## 🧪 Упражнения

1. ⭐ Вращающийся куб в Ursina.
2. ⭐ Управление кубом стрелками.
3. ⭐⭐ FPS-контроллер + 20 кубиков.
4. ⭐⭐ Собери 10 монет (см. пример).
5. ⭐⭐ Voxel-игра (Minecraft-like).
6. ⭐⭐⭐ 3D-платформер с прыжками и гравитацией.
7. ⭐⭐⭐ Движок Panda3D с моделью из Blender.

---

## 🔗 Что дальше

→ [Работа с данными / ETL](../33-etl/index.md).