# pygame: основы

!!! abstract "Уровень: ⭐⭐ → ⭐⭐⭐"
    Нужно знать: [классы](../08-oop/classes.md), [циклы](../02-control-flow/for.md).

---

## 🚀 Установка

```bash
pip install pygame
```

```python
import pygame
pygame.init()
```

`pygame.init()` — запускает все модули библиотеки.

---

## 📖 Игровой цикл

**Основа любой игры** — бесконечный цикл:

```python
while running:
    # 1. Обработка событий (клавиши, клики, выход)
    for event in pygame.event.get():
        ...

    # 2. Обновление логики (движение, физика, столкновения)
    ...

    # 3. Отрисовка
    screen.fill((0, 0, 0))
    ...

    # 4. Показать кадр
    pygame.display.flip()
```

Цикл повторяется **60 раз в секунду** — это и есть анимация.

---

## 📌 Создание окна

```python
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Название игры")
clock = pygame.time.Clock()           # для FPS
```

`clock.tick(60)` в конце цикла — ограничивает FPS.

---

## 📌 События

```python
for event in pygame.event.get():
    if event.type == pygame.QUIT:
        running = False
    elif event.type == pygame.KEYDOWN:
        if event.key == pygame.K_SPACE:
            print("Пробел!")
        elif event.key == pygame.K_ESCAPE:
            running = False
    elif event.type == pygame.MOUSEBUTTONDOWN:
        print(event.pos)              # координаты клика
```

**Основные события:** `QUIT`, `KEYDOWN`, `KEYUP`, `MOUSEBUTTONDOWN`,
`MOUSEBUTTONUP`, `MOUSEMOTION`.

### Постоянное нажатие клавиш

```python
keys = pygame.key.get_pressed()
if keys[pygame.K_LEFT]:
    player.x -= 5
if keys[pygame.K_RIGHT]:
    player.x += 5
```

---

## 📌 Рисование

```python
# Цвета — RGB, 0..255
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
BLACK = (0, 0, 0)

# Фон
screen.fill((30, 30, 30))

# Линия
pygame.draw.line(screen, RED, (0, 0), (100, 100), 3)

# Прямоугольник
pygame.draw.rect(screen, GREEN, (50, 50, 100, 80))          # x, y, w, h
pygame.draw.rect(screen, GREEN, rect, 3)                     # с обводкой

# Круг
pygame.draw.circle(screen, BLUE, (200, 200), 50)
pygame.draw.circle(screen, BLUE, (200, 200), 50, 3)          # обводка

# Эллипс
pygame.draw.ellipse(screen, RED, (100, 100, 80, 40))

# Полигон
points = [(100, 100), (150, 50), (200, 100)]
pygame.draw.polygon(screen, GREEN, points)
```

---

## 📌 Rect — прямоугольник

`pygame.Rect` — вспомогательный объект для позиций и столкновений:

```python
rect = pygame.Rect(100, 100, 50, 50)

rect.x, rect.y                    # координаты
rect.width, rect.height            # размеры
rect.center                        # центр (кортеж)
rect.left, rect.right, rect.top, rect.bottom
rect.centerx, rect.centery
rect.move_ip(dx, dy)                # сдвинуть
rect.colliderect(other)              # столкновение
rect.collidepoint(x, y)               # точка внутри
```

**Столкновения** — главная фишка Rect:

```python
if player_rect.colliderect(enemy_rect):
    print("Столкновение!")
```

---

## 📌 Изображения

```python
img = pygame.image.load("player.png")
img = pygame.transform.scale(img, (60, 60))        # масштаб
img_flipped = pygame.transform.flip(img, True, False)  # отражение
img_rotated = pygame.transform.rotate(img, 45)

# На экран
screen.blit(img, (x, y))
```

---

## 📌 Звук

```python
pygame.mixer.init()

# Звуковой эффект
sound = pygame.mixer.Sound("jump.wav")
sound.play()

# Фоновая музыка
pygame.mixer.music.load("bg.ogg")
pygame.mixer.music.play(-1)         # -1 — бесконечно
pygame.mixer.music.stop()
pygame.mixer.music.set_volume(0.5)
```

---

## 📌 Текст

```python
font = pygame.font.SysFont("Arial", 32)             # системный шрифт
# или font = pygame.font.Font("custom.ttf", 32)      # свой

text = font.render("Счёт: 100", True, WHITE)
screen.blit(text, (10, 10))

# С фоном
text = font.render("Привет", True, WHITE, BLACK)
```

---

## 📌 Спрайты

**Спрайт** — игровой объект с картинкой и поведением.

```python
class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill((0, 200, 100))
        self.rect = self.image.get_rect(topleft=(x, y))
        self.speed = 5

    def update(self, keys):
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
        if keys[pygame.K_UP]:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN]:
            self.rect.y += self.speed
```

**Группы спрайтов:**

```python
all_sprites = pygame.sprite.Group()
player = Player(100, 100)
all_sprites.add(player)

# В игровом цикле:
all_sprites.update(keys)
all_sprites.draw(screen)

# Столкновения между группами
hits = pygame.sprite.spritecollide(player, enemies, dokill=True)
```

---

## 📌 FPS и время

```python
clock = pygame.time.Clock()

while running:
    dt = clock.tick(60)     # мс с прошлого кадра
    print(clock.get_fps())   # текущий FPS
```

`dt` полезен, чтобы движение было плавным независимо от FPS.

---

## 💡 Полный пример — «Поймай шарик»

```python
import pygame
import random

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Поймай шарик")
clock = pygame.time.Clock()
font = pygame.font.SysFont("Arial", 32)

# Игрок
player = pygame.Rect(0, HEIGHT - 40, 120, 20)

# Цели
balls = []
spawn_timer = 0
score = 0
missed = 0

running = True
while running:
    dt = clock.tick(60)

    # События
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Управление
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= 7
    if keys[pygame.K_RIGHT]:
        player.x += 7
    player.x = max(0, min(player.x, WIDTH - player.width))

    # Спавн шариков
    spawn_timer += dt
    if spawn_timer > 700:
        spawn_timer = 0
        balls.append({
            "rect": pygame.Rect(random.randint(0, WIDTH - 30), 0, 30, 30),
            "speed": random.randint(3, 7),
        })

    # Обновление
    for ball in balls[:]:
        ball["rect"].y += ball["speed"]
        if ball["rect"].colliderect(player):
            balls.remove(ball)
            score += 1
        elif ball["rect"].y > HEIGHT:
            balls.remove(ball)
            missed += 1

    # Отрисовка
    screen.fill((30, 30, 40))
    pygame.draw.rect(screen, (0, 200, 100), player)
    for ball in balls:
        pygame.draw.circle(screen, (255, 100, 100), ball["rect"].center, 15)

    screen.blit(font.render(f"Счёт: {score}", True, (255, 255, 255)), (10, 10))
    screen.blit(font.render(f"Промахи: {missed}", True, (255, 255, 255)), (10, 50))

    pygame.display.flip()

pygame.quit()
```

---

## 📌 Что ещё есть в pygame

| Модуль | Для чего |
|---|---|
| `pygame.mixer` | Звук и музыка |
| `pygame.font` | Текст |
| `pygame.sprite` | Спрайты и группы |
| `pygame.transform` | Преобразования изображений |
| `pygame.mask` | Пиксельные столкновения |
| `pygame.time` | Таймеры |
| `pygame.math.Vector2` | Векторная математика |
| `pygame.gfxdraw` | Улучшенные примитивы |
| `pygame.freetype` | Продвинутые шрифты |

## 📌 Хранение уровней и данных

- **JSON** — список уровней, диалогов, настроек
- **CSV** — таблицы уровней
- **Tiled** — редактор карт с экспортом в `.tmx`

---

## ⚠️ Частые ошибки

!!! warning "Забыли `pygame.display.flip()`"
    Изменения не покажутся.

!!! warning "Забыли `clock.tick(60)`"
    Игра «съест» 100% CPU.

!!! warning "Слишком быстрый спрайт"
    Скорость в пикселях **за кадр**. При 60 FPS — 5 пикселей в кадр = 300
    пикселей в секунду.

!!! warning "Картинка не в корне"
    Пути относительные. Или используйте `os.path.join(Path(__file__).parent, ...)`.

!!! warning "Забыли `pygame.quit()`"
    Процесс может остаться висеть.

---

## 🧪 Упражнения

1. ⭐ Окно, при клике — меняется цвет фона.
2. ⭐ Круг, движущийся вправо.
3. ⭐⭐ Управление квадратом стрелками.
4. ⭐⭐ Мяч, отскакивающий от стен.
5. ⭐⭐ Счётчик очков при клике по цели.
6. ⭐⭐⭐ Понг (два игрока).
7. ⭐⭐⭐ Змейка.
8. ⭐⭐⭐ Платформер с прыжками.

---

## 🔗 Что дальше

→ [Pillow](../23-pillow/index.md) — обработка картинок.