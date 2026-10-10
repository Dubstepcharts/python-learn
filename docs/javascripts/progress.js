/* progress.js — индикатор прогресса чтения */
document.addEventListener("DOMContentLoaded", function () {
    const bar = document.createElement("div");
    bar.id = "reading-progress";
    document.body.appendChild(bar);

    function update() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        bar.style.width = Math.min(scrolled, 100) + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
});