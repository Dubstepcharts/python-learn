# Pillow — обработка изображений

**Pillow** (**PIL** — Python Imaging Library) — библиотека для работы с **картинками**: открывать, обрезать, изменять размер, накладывать фильтры, добавлять текст, конвертировать форматы.

Применяется для: обработки фото, создания коллажей, водяных знаков, превью, генерации картинок, работы с GIF.

!!! tip "Кому подходит"
    **7–11 класс**. Нужны: файлы, циклы, функции.

---

## 🚀 Установка

```bash
pip install Pillow
```

```python
from PIL import Image, ImageDraw, ImageFont, ImageFilter
```

---

## 📌 Открытие и сохранение

```python
from PIL import Image

img = Image.open("photo.jpg")
print(img.size)           # (800, 600)
print(img.mode)           # RGB, RGBA, L и т.д.
print(img.format)         # JPEG, PNG

img.save("copy.png")
img.save("small.jpg", quality=85)     # с параметром для JPEG
```

**Поддержка форматов:** JPEG, PNG, GIF, BMP, TIFF, WEBP, ICO, PDF и десятки других.

---

## 📌 Изменение размера

```python
resized = img.resize((400, 300))                          # точный размер
resized = img.thumbnail((200, 200))                        # с сохранением пропорций, на месте
resized = img.resize((400, 300), Image.LANCZOS)            # качественная интерполяция
```

**Фильтры интерполяции:** `NEAREST` (быстрый), `BILINEAR`, `BICUBIC`, `LANCZOS` (лучший).

`thumbnail()` изменяет **на месте** и сохраняет пропорции. `resize()` возвращает копию.

---

## 📌 Обрезка (crop)

```python
box = (100, 100, 400, 400)       # left, top, right, bottom
cropped = img.crop(box)
```

---

## 📌 Поворот и отражение

```python
rotated = img.rotate(45)                              # градусы, против часовой
rotated = img.rotate(45, expand=True)                  # с расширением холста
flipped = img.transpose(Image.FLIP_LEFT_RIGHT)
flipped = img.transpose(Image.FLIP_TOP_BOTTOM)
rot90 = img.transpose(Image.ROTATE_90)
```

---

## 📌 Фильтры

```python
from PIL import ImageFilter

blurred = img.filter(ImageFilter.BLUR)
sharpened = img.filter(ImageFilter.SHARPEN)
edges = img.filter(ImageFilter.FIND_EDGES)
emboss = img.filter(ImageFilter.EMBOSS)
smooth = img.filter(ImageFilter.SMOOTH)
detail = img.filter(ImageFilter.DETAIL)
gaussian = img.filter(ImageFilter.GaussianBlur(5))
```

Полный список: `ImageFilter.` + `BLUR`, `CONTOUR`, `DETAIL`, `EDGE_ENHANCE`,
`EMBOSS`, `FIND_EDGES`, `SHARPEN`, `SMOOTH`, `GaussianBlur`, `BoxBlur`,
`UnsharpMask`, `MedianFilter` и другие.

---

## 📌 Цветовые преобразования

```python
gray = img.convert("L")               # чёрно-белое
rgb = img.convert("RGB")
rgba = img.convert("RGBA")
cmyk = img.convert("CMYK")
```

**Режимы:** `1` (ч/б бинарное), `L` (градации серого), `RGB`, `RGBA`, `CMYK`, `P` (палитра).

---

## 📌 Наложение текста

```python
from PIL import ImageDraw, ImageFont

draw = ImageDraw.Draw(img)
font = ImageFont.truetype("arial.ttf", 40)

draw.text((10, 10), "Привет!", fill="red", font=font)

# По центру
bbox = draw.textbbox((0, 0), "Привет!", font=font)
w = bbox[2] - bbox[0]
h = bbox[3] - bbox[1]
draw.text(((img.width - w) / 2, (img.height - h) / 2),
          "Привет!", fill="white", font=font)
```

---

## 📌 Рисование

```python
draw = ImageDraw.Draw(img)

draw.line((0, 0, 100, 100), fill="red", width=3)
draw.rectangle((50, 50, 150, 150), outline="blue", width=2)
draw.rectangle((50, 50, 150, 150), fill="yellow")
draw.ellipse((100, 100, 200, 180), fill="green")
draw.polygon([(10, 10), (50, 50), (10, 50)], fill="purple")
draw.arc((0, 0, 100, 100), 0, 180, fill="orange", width=3)
draw.point((10, 10), fill="red")
```

---

## 📌 Работа с пикселями

```python
# Один пиксель
r, g, b = img.getpixel((100, 100))
img.putpixel((100, 100), (255, 0, 0))

# Все сразу
pixels = img.load()
for x in range(img.width):
    for y in range(img.height):
        r, g, b = pixels[x, y]
        pixels[x, y] = (r // 2, g // 2, b // 2)   # затемнить
```

Для больших картинок — используйте `numpy` и `Image.fromarray`.

---

## 📌 Вставка одной картинки в другую

```python
background = Image.open("bg.jpg")
logo = Image.open("logo.png")

# Наложить
background.paste(logo, (10, 10))

# С прозрачностью
if logo.mode == "RGBA":
    background.paste(logo, (10, 10), logo)
```

---

## 📌 Работа с GIF

```python
# Прочитать кадры
gif = Image.open("animation.gif")
frames = []
try:
    while True:
        frames.append(gif.copy())
        gif.seek(gif.tell() + 1)
except EOFError:
    pass

# Создать GIF
frames[0].save(
    "out.gif",
    save_all=True,
    append_images=frames[1:],
    duration=100,           # мс на кадр
    loop=0,                  # 0 — бесконечно
)
```

---

## 💡 Примеры

### Пример 1. Уменьшить все фото в папке

```python
from pathlib import Path
from PIL import Image

src = Path("photos")
dst = Path("small")
dst.mkdir(exist_ok=True)

for file in src.glob("*.jpg"):
    img = Image.open(file)
    img.thumbnail((800, 800))
    img.save(dst / file.name, quality=85)
    print(f"Обработан {file.name}")
```

### Пример 2. Водяной знак

```python
from PIL import Image, ImageDraw, ImageFont

def add_watermark(path, text, output):
    img = Image.open(path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font = ImageFont.truetype("arial.ttf", 50)

    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    x = img.width - w - 20
    y = img.height - 80

    draw.text((x, y), text, fill=(255, 255, 255, 128), font=font)
    result = Image.alpha_composite(img, overlay)
    result.convert("RGB").save(output)

add_watermark("photo.jpg", "© Моё фото", "watermarked.jpg")
```

### Пример 3. Коллаж

```python
from PIL import Image

size = 200
files = ["a.jpg", "b.jpg", "c.jpg", "d.jpg"]
images = [Image.open(f).resize((size, size)) for f in files]

collage = Image.new("RGB", (size * 2, size * 2), "white")
collage.paste(images[0], (0, 0))
collage.paste(images[1], (size, 0))
collage.paste(images[2], (0, size))
collage.paste(images[3], (size, size))

collage.save("collage.jpg")
```

### Пример 4. Чёрно-белое с контрастом

```python
from PIL import Image, ImageEnhance

img = Image.open("photo.jpg")
gray = img.convert("L")

enhancer = ImageEnhance.Contrast(gray)
high_contrast = enhancer.enhance(2.0)

high_contrast.save("bw_contrast.jpg")
```

---

## 📌 `ImageEnhance` — улучшения

```python
from PIL import ImageEnhance

ImageEnhance.Brightness(img).enhance(1.5)    # ярче
ImageEnhance.Contrast(img).enhance(1.5)       # контрастнее
ImageEnhance.Color(img).enhance(2.0)          # насыщеннее
ImageEnhance.Sharpness(img).enhance(2.0)      # резче
```

Коэффициент 1.0 — без изменений, <1 — ослабить, >1 — усилить.

---

## ⚠️ Частые ошибки

!!! warning "Забыли `convert(\"RGB\")` перед сохранением в JPEG"
    ```python
    img.save("out.jpg")               # ❌ если img в RGBA
    img.convert("RGB").save("out.jpg")  # ✅
    ```

!!! warning "`thumbnail` изменяет на месте"
    ```python
    small = img.thumbnail((100, 100))    # small = None!
    img.thumbnail((100, 100))             # изменился сам img
    ```

!!! warning "Шрифт не найден"
    `ImageFont.truetype("arial.ttf", 40)` работает, если шрифт есть в системе.
    Для надёжности — укажите полный путь или положите `.ttf` рядом.

!!! warning "Огромные картинки съедают память"
    Для гигапиксельных изображений — обрабатывайте блоками.

---

## 🧪 Упражнения

1. ⭐ Открыть картинку, вывести размер, сохранить в другом формате.
2. ⭐ Уменьшить до 300×300.
3. ⭐⭐ Обрезать центральную часть.
4. ⭐⭐ Добавить текст в угол.
5. ⭐⭐ Сделать чёрно-белую версию.
6. ⭐⭐⭐ Водяной знак на все фото в папке.
7. ⭐⭐⭐ Коллаж 2×2 из 4 картинок.

---

## 🔗 Что дальше

→ [Telegram-боты](../24-telegram/index.md).