# Установка Kivy

!!! abstract "Уровень: ⭐"

---

## 🚀 Установка

```bash
pip install kivy
```

Для сборки под Android — дополнительно **Buildozer** (только Linux/macOS/WSL):

```bash
pip install buildozer
```

Проверка:

```python
import kivy
print(kivy.__version__)
```

---

## ⚠️ Возможные проблемы

!!! warning "**Windows**: ошибки при сборке"
    Обычно `pip install kivy` скачивает готовый «wheel». Если не получилось:
    ```bash
    pip install kivy[base]
    ```

!!! warning "**Linux**: нет системных библиотек"
    ```bash
    sudo apt install python3-dev libgl1-mesa-dev libgles2-mesa-dev \
        libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev
    ```

!!! warning "**macOS**"
    ```bash
    brew install pkg-config sdl2 sdl2_image sdl2_ttf sdl2_mixer
    pip install kivy
    ```

---

## 🧪 Проверка

Создайте `hello.py`:

```python
from kivy.app import App
from kivy.uix.label import Label

class MyApp(App):
    def build(self):
        return Label(text="Привет, Kivy!")

if __name__ == "__main__":
    MyApp().run()
```

Запустите: `python hello.py`. Должно открыться окно с надписью.

---

## 🔗 Что дальше

→ [Первое приложение](first-app.md).