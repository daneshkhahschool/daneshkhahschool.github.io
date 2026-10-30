(function () {
    var s = document.getElementById('slider');
    if (!s) return;
    var slides = Array.prototype.slice.call(s.querySelectorAll('img'));
    var cur = 0;
    var timer = null;
    var dots = document.createElement('div');
    dots.className = 'slider-dots';
    var bar = document.createElement('div');
    bar.className = 'slider-timer';
    s.appendChild(dots);
    s.appendChild(bar);

    var buttons = slides.map(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'تصویر ' + (i + 1));
        b.addEventListener('click', function () { show(i); restart(); });
        dots.appendChild(b);
        return b;
    });

    function show(i) {
        slides[cur].classList.remove('active');
        buttons[cur].classList.remove('on');
        cur = (i + slides.length) % slides.length;
        slides[cur].classList.add('active');
        buttons[cur].classList.add('on');
        bar.classList.remove('run');
        void bar.offsetWidth;
        bar.classList.add('run');
    }

    function start() {
        stop();
        timer = setInterval(function () { show(cur + 1); }, 4000);
        bar.classList.remove('run');
        void bar.offsetWidth;
        bar.classList.add('run');
    }

    function stop() {
        clearInterval(timer);
        bar.classList.remove('run');
    }

    function restart() { start(); }

    s.querySelector('.next').addEventListener('click', function () { show(cur + 1); restart(); });
    s.querySelector('.prev').addEventListener('click', function () { show(cur - 1); restart(); });
    s.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') stop(); });
    s.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') start(); });

    var sx = null;
    s.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    s.addEventListener('pointerup', function (e) {
        if (sx === null) return;
        var dx = e.clientX - sx;
        sx = null;
        if (Math.abs(dx) < 45) return;
        show(dx < 0 ? cur + 1 : cur - 1);
        restart();
    });

    show(0);
    start();
})();
