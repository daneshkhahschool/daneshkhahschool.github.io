(function () {
    'use strict';

    var D = document;
    var W = window;
    var reduce = W.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = W.matchMedia('(pointer: fine)').matches;

    var ICONS = {
        book: '<path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/>',
        pencil: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14 7l3 3"/>',
        atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
        globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 3 15 0 18c-3-3-3-15 0-18z"/>',
        flask: '<path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-2.5L14 9V3"/><path d="M7.5 15h9"/>',
        calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
        bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
        cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/>',
        star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
        rocket: '<path d="M12 3c3 2 5 5.5 5 9l-2 3H9l-2-3c0-3.5 2-7 5-9z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 15l-2 4 3-1M15 15l2 4-3-1"/>',
        ruler: '<path d="M4 20V4l16 16z"/><path d="M7 14l2 2M7 10l3 3"/>',
        pi: '<path d="M5 7h14M9 7v11M15 7v9c0 1.5.8 2 2 2"/>',
        phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
        pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
        users: '<path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"/><circle cx="9" cy="7" r="3.5"/><path d="M17 11a3 3 0 1 0 0-6M21 20v-1a4 4 0 0 0-3-3.8"/>',
        lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="16" r="1"/>',
        key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
        eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
        eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.7A16.5 16.5 0 0 0 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
        logout: '<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M16 8l4 4-4 4M20 12H9"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
        chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
        palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2.2-.5-1.2.3-2.3 1.6-2.3H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
        bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
        zoom: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>',
        check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
        arrowup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
        arrowleft: '<path d="M19 12H5M11 5l-7 7 7 7"/>',
        image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>',
        news: '<path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2M7 9h7M7 13h7"/>',
        code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
        trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8M10 18h4"/>',
        shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
        school: '<path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6M12 9h.01"/>',
        gamepad: '<rect x="3" y="8" width="18" height="10" rx="5"/><path d="M8 11v4M6 13h4M15.5 12h.01M17.5 14h.01"/>',
        planet: '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)"/>',
        heart: '<path d="M12 20s-8-4.7-8-10.2A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 8 2.3C20 15.3 12 20 12 20z"/>'
    };

    var FLOAT_SET = ['book', 'pencil', 'atom', 'globe', 'flask', 'calc', 'bulb', 'cap', 'star', 'rocket', 'ruler', 'pi', 'planet', 'trophy'];
    var HEAD_SET = ['book', 'bulb', 'atom', 'rocket', 'cap', 'star', 'globe', 'pencil'];

    function svg(name) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.star) + '</svg>';
    }

    W.DS = W.DS || {};
    W.DS.icon = svg;

    function $(s, r) { return (r || D).querySelector(s); }
    function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
    function el(tag, cls, html) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (html) e.innerHTML = html;
        return e;
    }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function mod(v, m) { return ((v % m) + m) % m; }

    function injectIcons() {
        $$('[data-i]').forEach(function (n) {
            if (n.dataset.done) return;
            n.dataset.done = '1';
            n.insertAdjacentHTML('afterbegin', svg(n.dataset.i));
        });
    }
    W.DS.refreshIcons = injectIcons;

    function prepNav() {
        var nav = $('.header-bottom');
        if (!nav) return;
        var header = nav.parentElement;
        if (header && header.tagName === 'HEADER') header.insertAdjacentElement('afterend', nav);
        var btn = el('button', 'nav-toggle', '<b>منو</b><span><i></i></span>');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'باز و بسته کردن منو');
        nav.insertBefore(btn, nav.firstChild);
        $$('a', nav).forEach(function (a, i) {
            a.style.setProperty('--n', i);
            a.addEventListener('click', function () { nav.classList.remove('open'); });
        });
        btn.addEventListener('click', function () { nav.classList.toggle('open'); });
    }

    function prepLogo() {
        var img = $('.header-top .icon');
        if (!img) return;
        var wrap = el('div', 'logo-orbit', '<i></i><i></i>');
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
        wrap.addEventListener('click', function () {
            var r = wrap.getBoundingClientRect();
            burst(r.left + r.width / 2, r.top + r.height / 2, 90);
        });
    }

    function splash() {
        if (!$('.hero') || sessionStorage.getItem('dsSplash')) return;
        var img = $('.icon');
        var s = el('div', 'splash');
        s.innerHTML = '<img src="' + (img ? img.getAttribute('src') : '') + '" alt=""><b>دبیرستان شهید دانشخواه</b><div class="splash-bar"></div>';
        D.body.appendChild(s);
        sessionStorage.setItem('dsSplash', '1');
        setTimeout(function () { s.classList.add('done'); }, 900);
        setTimeout(function () { s.remove(); }, 1500);
    }

    function constellation() {
        var c = el('canvas');
        c.id = 'bg-canvas';
        D.body.insertBefore(c, D.body.firstChild);
        var ctx = c.getContext('2d');
        var w = 0, h = 0, dpr = 1, pts = [], stars = [], mouse = { x: -999, y: -999 };
        var colors = ['255,217,102', '169,139,255', '255,154,60', '255,255,255'];
        var last = 0;

        function mk() {
            return {
                x: Math.random() * w, y: Math.random() * h,
                vx: rand(-.3, .3), vy: rand(-.25, .25),
                r: rand(.5, 2), t: rand(0, 6.28),
                c: colors[Math.floor(Math.random() * colors.length)]
            };
        }

        function resize() {
            dpr = 1;
            w = W.innerWidth;
            h = W.innerHeight;
            c.width = w * dpr;
            c.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var n = Math.min(70, Math.floor(w * h / 22000));
            pts = [];
            for (var i = 0; i < n; i++) pts.push(mk());
        }

        function frame(t) {
            if (D.hidden || t - last < 28) { requestAnimationFrame(frame); return; }
            var dt = Math.min(48, t - last || 16);
            last = t;
            var k = dt / 16;
            var sy = W.scrollY;
            ctx.clearRect(0, 0, w, h);
            var i, j, p, q, dx, dy, d;
            for (i = 0; i < pts.length; i++) {
                p = pts[i];
                p.x += p.vx * k;
                p.y += p.vy * k;
                if (p.x < -20) p.x = w + 20;
                if (p.x > w + 20) p.x = -20;
                if (p.y < -20) p.y = h + 20;
                if (p.y > h + 20) p.y = -20;
                p.t += .02 * k;
                p.dy = mod(p.y - sy * p.r * .12, h);
                dx = p.x - mouse.x;
                dy = p.dy - mouse.y;
                d = Math.sqrt(dx * dx + dy * dy);
                if (d < 140 && d > 0) {
                    p.x += dx / d * (140 - d) * .02 * k;
                    p.y += dy / d * (140 - d) * .02 * k;
                    ctx.strokeStyle = 'rgba(255,217,102,' + (1 - d / 140) * .5 + ')';
                    ctx.lineWidth = .8;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.dy);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
            for (i = 0; i < pts.length; i++) {
                p = pts[i];
                for (j = i + 1; j < pts.length; j++) {
                    q = pts[j];
                    dx = p.x - q.x;
                    dy = p.dy - q.dy;
                    d = dx * dx + dy * dy;
                    if (d < 15000) {
                        ctx.strokeStyle = 'rgba(169,139,255,' + (1 - d / 15000) * .3 + ')';
                        ctx.lineWidth = .7;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.dy);
                        ctx.lineTo(q.x, q.dy);
                        ctx.stroke();
                    }
                }
            }
            for (i = 0; i < pts.length; i++) {
                p = pts[i];
                var a = .45 + Math.sin(p.t) * .35;
                ctx.fillStyle = 'rgba(' + p.c + ',' + (a * .18).toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.dy, p.r * 3, 0, 6.283);
                ctx.fill();
                ctx.fillStyle = 'rgba(' + p.c + ',' + a.toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.dy, p.r, 0, 6.283);
                ctx.fill();
            }
            if (Math.random() < .004 && stars.length < 2) {
                stars.push({ x: rand(w * .3, w), y: rand(0, h * .4), vx: -rand(7, 11), vy: rand(3, 5), life: 1 });
            }
            for (i = stars.length - 1; i >= 0; i--) {
                var s = stars[i];
                s.x += s.vx * k;
                s.y += s.vy * k;
                s.life -= .014 * k;
                if (s.life <= 0) { stars.splice(i, 1); continue; }
                var g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
                g.addColorStop(0, 'rgba(255,255,255,' + s.life + ')');
                g.addColorStop(1, 'rgba(255,217,102,0)');
                ctx.strokeStyle = g;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9);
                ctx.stroke();
            }
            if (!reduce) requestAnimationFrame(frame);
        }

        resize();
        var rt;
        W.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
        W.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
        W.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
        if (reduce) {
            last = -100;
            frame(16);
            return;
        }
        requestAnimationFrame(frame);
    }

    function aurora() {
        D.body.insertBefore(el('div', 'aurora', '<i></i><i></i><i></i>'), D.body.firstChild);
    }

    function floaters() {
        if (reduce) return;
        var layer = el('div', 'floaters');
        D.body.insertBefore(layer, D.body.firstChild);
        var n = W.innerWidth < 700 ? 5 : 10;
        var items = [];
        for (var i = 0; i < n; i++) {
            var size = rand(30, 70);
            var f = el('div', 'floater', svg(FLOAT_SET[i % FLOAT_SET.length]));
            f.style.width = f.style.height = size + 'px';
            f.style.right = rand(1, 94) + '%';
            f.firstChild.style.animationDelay = -rand(0, 6) + 's';
            layer.appendChild(f);
            items.push({ e: f, base: rand(0, 1), sp: rand(.05, .22) * (Math.random() < .5 ? 1 : -.6), rot: rand(-.12, .12), ph: rand(0, 6.28), size: size });
        }
        function place() {
            var sy = W.scrollY;
            var vh = W.innerHeight;
            var span = vh + 200;
            for (var k = 0; k < items.length; k++) {
                var it = items[k];
                var y = mod(it.base * span - sy * it.sp, span) - 100;
                var x = Math.sin(sy * .003 + it.ph) * 38;
                it.e.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + (sy * it.rot) + 'deg)';
            }
        }
        place();
        W.DS.placeFloaters = place;
    }

    function cursorGlow() {
        if (!fine || reduce) return;
        var wrap = el('div', 'glow-wrap');
        var g = el('div', 'cursor-glow');
        wrap.appendChild(g);
        D.body.appendChild(wrap);
        var tx = 0, ty = 0, cx = 0, cy = 0, run = false;
        function loop() {
            cx += (tx - cx) * .14;
            cy += (ty - cy) * .14;
            g.style.transform = 'translate3d(' + (cx - 210) + 'px,' + (cy - 210) + 'px,0)';
            if (Math.abs(tx - cx) > .5 || Math.abs(ty - cy) > .5) requestAnimationFrame(loop);
            else run = false;
        }
        W.addEventListener('pointermove', function (e) {
            tx = e.clientX;
            ty = e.clientY;
            g.classList.add('on');
            if (!run) { run = true; requestAnimationFrame(loop); }
        }, { passive: true });
        D.addEventListener('pointerleave', function () { g.classList.remove('on'); });
    }

    function scrollUi() {
        var bar = el('div', 'scroll-progress');
        D.body.appendChild(bar);
        var top = el('button', 'to-top', '<svg class="ring" viewBox="0 0 54 54"><circle class="track" cx="27" cy="27" r="25"/><circle class="bar" cx="27" cy="27" r="25"/></svg>' + svg('arrowup').replace('<svg', '<svg class="arrow"'));
        top.type = 'button';
        top.setAttribute('aria-label', 'بازگشت به بالای صفحه');
        D.body.appendChild(top);
        var ringBar = $('.bar', top);
        var nav = $('.header-bottom');
        var tick = false;
        function update() {
            tick = false;
            var sy = W.scrollY;
            var max = Math.max(1, D.documentElement.scrollHeight - W.innerHeight);
            var pct = Math.min(1, sy / max);
            bar.style.transform = 'scaleX(' + pct + ')';
            ringBar.style.strokeDashoffset = 157 * (1 - pct);
            top.classList.toggle('show', sy > 500);
            if (nav) nav.classList.toggle('stuck', sy > 140);
            if (W.DS.placeFloaters) W.DS.placeFloaters();
        }
        W.addEventListener('scroll', function () {
            if (!tick) { tick = true; requestAnimationFrame(update); }
        }, { passive: true });
        W.addEventListener('resize', update);
        top.addEventListener('click', function () {
            W.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
        update();
    }

    function headingIcons() {
        var i = 0;
        $$('main h2, main h1').forEach(function (h) {
            if (h.classList.contains('hero-title') || h.closest('.login-box, .thanks-box, .panel-content, .modal, .about-adress') || $('.h-ico', h)) return;
            var ico = el('span', 'h-ico', svg(HEAD_SET[i++ % HEAD_SET.length]));
            h.insertBefore(ico, h.firstChild);
        });
    }

    function splitHero() {
        $$('.hero-title').forEach(function (h) {
            var words = h.textContent.trim().split(/\s+/);
            h.setAttribute('aria-label', words.join(' '));
            h.innerHTML = '';
            words.forEach(function (wd, i) {
                var s = el('span', 'w ch' + (wd.indexOf('دانشخواه') > -1 ? ' gold' : ''));
                s.style.setProperty('--i', i * 2.2);
                s.textContent = wd;
                s.setAttribute('aria-hidden', 'true');
                h.appendChild(s);
                if (i < words.length - 1) h.appendChild(D.createTextNode(' '));
            });
        });
    }

    function typed() {
        $$('[data-phrases]').forEach(function (n) {
            var list = n.dataset.phrases.split('|');
            if (reduce) { n.textContent = list[0]; return; }
            var pi = 0, ci = 0, del = false;
            function step() {
                var s = list[pi];
                if (!del) {
                    ci++;
                    n.textContent = s.slice(0, ci);
                    if (ci === s.length) { del = true; return setTimeout(step, 1800); }
                    return setTimeout(step, 75);
                }
                ci--;
                n.textContent = s.slice(0, ci);
                if (ci === 0) { del = false; pi = (pi + 1) % list.length; return setTimeout(step, 400); }
                setTimeout(step, 35);
            }
            setTimeout(step, 1600);
        });
    }

    function assignReveal() {
        function add(sel, kind, stagger, alt) {
            $$(sel).forEach(function (e, i) {
                if (e.classList.contains('rv')) return;
                e.classList.add('rv');
                var k = kind;
                if (alt) k = (i % 2 === 0) ? alt[0] : alt[1];
                e.dataset.rv = k;
                if (stagger) e.style.setProperty('--d', ((i % 4) * .09) + 's');
            });
        }
        add('main h2:not(.hero-title), main h1', 'drop');
        add('.hero .typed-line, .hero-cta', 'up');
        add('.about-card', 'up');
        add('.stat', 'zoom', true);
        add('.slider', 'wipe');
        add('.quick a', 'up', true, ['left', 'right']);
        add('.learn-panels a', 'zoom', true);
        add('.staff-card', 'up', true, ['flip', 'zoom']);
        add('.shot', 'zoom', true);
        add('.contact-method', 'up', true);
        add('.contact-form', 'up');
        add('.adress > *', 'left', false, ['right', 'left']);
        add('.news', 'up');
        add('.maker', 'left', true, ['left', 'right']);
        add('.credits', 'zoom');
        add('.thanks-box', 'zoom');
        add('.login-box', 'zoom');
        add('main > p', 'up');
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: .04, rootMargin: '0px 0px -6% 0px' });
        $$('.rv').forEach(function (e) { io.observe(e); });
        var hio = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    var ico = $('.h-ico', en.target);
                    if (ico) ico.classList.add('in');
                    hio.unobserve(en.target);
                }
            });
        }, { threshold: .5 });
        $$('main h2').forEach(function (h) { hio.observe(h); });
    }

    function counters() {
        var nodes = $$('[data-count]');
        if (!nodes.length) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                io.unobserve(en.target);
                var n = en.target;
                var to = parseFloat(n.dataset.count);
                var suffix = n.dataset.suffix || '';
                if (reduce) { n.textContent = to.toLocaleString('fa-IR') + suffix; return; }
                var t0 = performance.now();
                var dur = 2000;
                (function tick(now) {
                    var p = Math.min(1, (now - t0) / dur);
                    var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
                    n.textContent = Math.round(to * e).toLocaleString('fa-IR') + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                })(t0);
            });
        }, { threshold: .6 });
        nodes.forEach(function (n) {
            n.textContent = (0).toLocaleString('fa-IR') + (n.dataset.suffix || '');
            io.observe(n);
        });
    }

    function cardFx() {
        var sel = '.glass, .quick a, .learn-panels a, .staff-card, .panel-card, .stat, .contact-method';
        $$(sel).forEach(function (c) {
            c.classList.add('fx');
            if (fine && !reduce && c.matches('.staff-card, .stat, .panel-card, .learn-panels a, .quick a')) c.classList.add('tilt');
        });
        var pending = null;
        var queued = false;
        function applyMove() {
            queued = false;
            var e = pending;
            pending = null;
            if (!e) return;
            var c = e.target.closest ? e.target.closest('.fx') : null;
            if (!c) return;
            var r = c.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width;
            var y = (e.clientY - r.top) / r.height;
            c.style.setProperty('--mx', (x * 100) + '%');
            c.style.setProperty('--my', (y * 100) + '%');
            if (c.classList.contains('tilt')) {
                c.style.setProperty('--rx', ((y - .5) * -9).toFixed(2) + 'deg');
                c.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
            }
        }
        D.addEventListener('pointermove', function (e) {
            pending = e;
            if (!queued) {
                queued = true;
                requestAnimationFrame(applyMove);
            }
        }, { passive: true });
        D.addEventListener('pointerout', function (e) {
            var c = e.target.closest ? e.target.closest('.tilt') : null;
            if (c && !c.contains(e.relatedTarget)) {
                c.style.setProperty('--rx', '0deg');
                c.style.setProperty('--ry', '0deg');
            }
        });
    }

    function ripples() {
        D.addEventListener('pointerdown', function (e) {
            var b = e.target.closest ? e.target.closest('.btn, .submit-btn, .back-btn') : null;
            if (!b) return;
            var r = b.getBoundingClientRect();
            var size = Math.max(r.width, r.height);
            var s = el('span', 'ripple');
            s.style.width = s.style.height = size + 'px';
            s.style.left = (e.clientX - r.left - size / 2) + 'px';
            s.style.top = (e.clientY - r.top - size / 2) + 'px';
            b.appendChild(s);
            setTimeout(function () { s.remove(); }, 750);
        });
    }

    function pageLinks() {
        D.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('a[href]') : null;
            if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
            var href = a.getAttribute('href');
            if (!href || href.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download')) return;
            if (/^(mailto|tel|javascript):/i.test(href)) return;
            if (a.origin !== W.location.origin || a.pathname === W.location.pathname) return;
            e.preventDefault();
            D.body.classList.add('leaving');
            setTimeout(function () { W.location.href = a.href; }, 220);
        });
        W.addEventListener('pageshow', function (e) {
            if (e.persisted) D.body.classList.remove('leaving');
        });
    }

    var confettiCanvas = null;
    var parts = [];
    var confettiRun = false;
    function burst(x, y, count) {
        if (reduce) return;
        if (!confettiCanvas) {
            confettiCanvas = el('canvas', 'confetti-canvas');
            D.body.appendChild(confettiCanvas);
            confettiCanvas.width = W.innerWidth;
            confettiCanvas.height = W.innerHeight;
        }
        var cols = ['#ffd966', '#ff9a3c', '#a98bff', '#6ef3c5', '#ff6b9d', '#ffffff'];
        for (var i = 0; i < (count || 80); i++) {
            var a = rand(0, 6.283);
            var sp = rand(3, 13);
            parts.push({
                x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4,
                w: rand(6, 12), h: rand(4, 8), rot: rand(0, 6.28), vr: rand(-.3, .3),
                c: cols[Math.floor(Math.random() * cols.length)], life: 1, round: Math.random() < .3
            });
        }
        if (!confettiRun) { confettiRun = true; requestAnimationFrame(confettiLoop); }
    }
    W.DS.burst = burst;

    function confettiLoop() {
        var c = confettiCanvas;
        var ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        for (var i = parts.length - 1; i >= 0; i--) {
            var p = parts[i];
            p.vy += .28;
            p.vx *= .99;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.life -= .007;
            if (p.life <= 0 || p.y > c.height + 30) { parts.splice(i, 1); continue; }
            ctx.save();
            ctx.globalAlpha = Math.min(1, p.life * 1.6);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            if (p.round) {
                ctx.beginPath();
                ctx.arc(0, 0, p.h / 1.5, 0, 6.283);
                ctx.fill();
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
        }
        if (parts.length) requestAnimationFrame(confettiLoop);
        else {
            confettiRun = false;
            c.remove();
            confettiCanvas = null;
        }
    }

    function celebrate() {
        if (!$('.thanks-box')) return;
        setTimeout(function () {
            burst(W.innerWidth * .2, W.innerHeight * .6, 90);
            burst(W.innerWidth * .8, W.innerHeight * .6, 90);
        }, 500);
        setTimeout(function () { burst(W.innerWidth * .5, W.innerHeight * .4, 110); }, 1100);
    }

    function init() {
        prepNav();
        prepLogo();
        injectIcons();
        aurora();
        constellation();
        floaters();
        cursorGlow();
        splitHero();
        headingIcons();
        scrollUi();
        cardFx();
        assignReveal();
        counters();
        typed();
        ripples();
        pageLinks();
        splash();
        celebrate();
    }

    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', init);
    else init();
})();
