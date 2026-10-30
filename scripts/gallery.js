(function () {
    var shots = Array.prototype.slice.call(document.querySelectorAll('.shot img'));
    var box = document.getElementById('lightbox');
    var big = document.getElementById('lightbox-img');
    var count = document.getElementById('lb-count');
    if (!box || !shots.length) return;
    var cur = 0;

    function load(i, animate) {
        cur = (i + shots.length) % shots.length;
        var apply = function () {
            big.src = shots[cur].src;
            big.alt = shots[cur].alt;
            count.textContent = (cur + 1).toLocaleString('fa-IR') + ' از ' + shots.length.toLocaleString('fa-IR');
            big.classList.remove('swap');
        };
        if (animate) {
            big.classList.add('swap');
            setTimeout(apply, 180);
        } else {
            apply();
        }
    }

    function open(i) {
        load(i, false);
        box.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        box.classList.remove('open');
        document.body.style.overflow = '';
    }

    shots.forEach(function (img, i) {
        img.parentNode.addEventListener('click', function () { open(i); });
    });

    box.querySelector('.close-btn').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); load(cur - 1, true); });
    box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); load(cur + 1, true); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') load(cur + 1, true);
        if (e.key === 'ArrowRight') load(cur - 1, true);
    });

    var sx = null;
    box.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    box.addEventListener('pointerup', function (e) {
        if (sx === null) return;
        var dx = e.clientX - sx;
        sx = null;
        if (Math.abs(dx) > 60) load(dx < 0 ? cur + 1 : cur - 1, true);
    });
})();
