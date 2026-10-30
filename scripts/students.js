(function () {
    var GLOBAL_PASS = '1357924680';
    var K_PASS = 'ds_private_pass';
    var K_NAME = 'ds_student_name';
    var K_CLASS = 'ds_student_class';
    var K_SESSION = 'ds_session';
    var SALT = 'daneshkhah-school:';

    var $ = function (id) { return document.getElementById(id); };
    var loginBox = $('loginBox');
    var panel = $('panelContent');
    var nameIn = $('studentName');
    var classIn = $('studentClass');
    var passIn = $('studentPass');
    var errorMsg = $('errorMsg');
    var loginHint = $('loginHint');
    var currentClass = '';
    var fails = 0;
    var locked = false;

    function store(k, v) {
        try { localStorage.setItem(k, v); } catch (e) {}
    }

    function read(k) {
        try { return localStorage.getItem(k); } catch (e) { return null; }
    }

    function drop(k) {
        try { localStorage.removeItem(k); } catch (e) {}
    }

    function digits(s) {
        return String(s)
            .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 1776); })
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
            .trim();
    }

    function hash(text) {
        var data = SALT + text;
        if (window.crypto && crypto.subtle && window.TextEncoder) {
            return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data)).then(function (buf) {
                return Array.prototype.map.call(new Uint8Array(buf), function (b) {
                    return ('0' + b.toString(16)).slice(-2);
                }).join('');
            });
        }
        return Promise.resolve('plain:' + data);
    }

    function hasPrivate() {
        return !!read(K_PASS);
    }

    function verify(pass) {
        if (pass === GLOBAL_PASS) return Promise.resolve(true);
        var saved = read(K_PASS);
        if (!saved) return Promise.resolve(false);
        return hash(pass).then(function (h) { return h === saved; });
    }

    function greeting() {
        var h = new Date().getHours();
        if (h < 5) return 'شب بخیر';
        if (h < 12) return 'صبح بخیر';
        if (h < 17) return 'ظهر بخیر';
        if (h < 20) return 'عصر بخیر';
        return 'شب بخیر';
    }

    function refreshHint() {
        if (hasPrivate()) {
            loginHint.textContent = 'با رمز کلی مدرسه یا رمز خصوصی خودتان می‌توانید وارد شوید.';
        } else {
            loginHint.textContent = 'اولین ورود شماست؟ رمز کلی مدرسه را وارد کنید. بعد از ورود می‌توانید یک رمز خصوصی برای خودتان بگذارید.';
        }
        var st = $('passState');
        if (st) {
            st.textContent = hasPrivate() ? 'فعال است' : 'تعیین نشده';
            st.classList.toggle('off', !hasPrivate());
        }
    }

    function fail(msg) {
        errorMsg.textContent = msg;
        loginBox.classList.remove('shake');
        void loginBox.offsetWidth;
        loginBox.classList.add('shake');
    }

    function enter(name, cls, celebrate) {
        currentClass = cls;
        $('displayName').textContent = name;
        $('displayClass').textContent = cls;
        $('greetWord').textContent = greeting();
        loginBox.style.display = 'none';
        panel.classList.add('show');
        panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
        store(K_NAME, name);
        store(K_CLASS, cls);
        try { sessionStorage.setItem(K_SESSION, JSON.stringify({ n: name, c: cls })); } catch (e) {}
        refreshHint();
        if (celebrate && window.DS && DS.burst) {
            var r = panel.getBoundingClientRect();
            DS.burst(window.innerWidth / 2, Math.max(120, r.top + 80), 100);
        }
    }

    function checkLogin() {
        if (locked) return;
        var name = nameIn.value.trim();
        var cls = classIn.value;
        var pass = digits(passIn.value);

        if (!name || !cls || !pass) {
            fail('لطفاً نام، کلاس و رمز عبور را وارد کنید.');
            return;
        }

        verify(pass).then(function (ok) {
            if (ok) {
                errorMsg.textContent = '';
                fails = 0;
                enter(name, cls, true);
                passIn.value = '';
                return;
            }
            fails++;
            if (fails >= 5) {
                locked = true;
                var left = 15;
                fail('تعداد تلاش‌ها زیاد بود. ' + left.toLocaleString('fa-IR') + ' ثانیه صبر کنید.');
                var iv = setInterval(function () {
                    left--;
                    if (left <= 0) {
                        clearInterval(iv);
                        locked = false;
                        fails = 0;
                        errorMsg.textContent = '';
                    } else {
                        errorMsg.textContent = 'تعداد تلاش‌ها زیاد بود. ' + left.toLocaleString('fa-IR') + ' ثانیه صبر کنید.';
                    }
                }, 1000);
            } else {
                fail('رمز عبور اشتباه است.');
            }
        });
    }

    function logout() {
        try { sessionStorage.removeItem(K_SESSION); } catch (e) {}
        panel.classList.remove('show');
        loginBox.style.display = '';
        loginBox.classList.add('in');
        passIn.value = '';
        errorMsg.textContent = '';
        refreshHint();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openModal(title, bodyHtml, narrow) {
        $('modalTitle').textContent = title;
        $('modalClass').textContent = 'کلاس ' + currentClass;
        $('modalBody').innerHTML = bodyHtml;
        $('modalBox').classList.toggle('narrow', !!narrow);
        $('infoModal').classList.add('open');
        if (window.DS && DS.refreshIcons) DS.refreshIcons();
    }

    function closeModal() {
        $('infoModal').classList.remove('open');
    }

    function showSchedule() {
        openModal('برنامه هفتگی', '<div class="modal-img-placeholder"><img src="../images/barnameh-haftegi.png" alt="برنامه هفتگی"></div>');
    }

    function showExtra() {
        var withImage = ['801', '802', '803'].indexOf(currentClass) > -1;
        var body = withImage
            ? '<div class="modal-img-placeholder"><img src="../images/fogbarnameh-801-802-803-mehr-aban.jfif" alt="برنامه فوق برنامه"></div>'
            : '<div class="modal-img-placeholder">برنامه فوق برنامه این کلاس به‌زودی قرار می‌گیرد</div>';
        openModal('فوق برنامه', body);
    }

    function showPassword() {
        var has = hasPrivate();
        var html =
            '<p class="pass-desc">' + (has
                ? 'رمز خصوصی شما فعال است. می‌توانید آن را تغییر دهید یا حذف کنید. رمز کلی مدرسه همیشه کار می‌کند.'
                : 'یک رمز خصوصی برای ورود سریع‌تر بگذارید. بعد از آن هم با رمز کلی و هم با رمز خصوصی می‌توانید وارد شوید.') +
            '</p>' +
            '<div class="pass-form">' +
            '<div class="field"><span class="f-ico" data-i="key"></span><input type="password" id="newPass" placeholder="رمز خصوصی جدید" autocomplete="new-password"></div>' +
            '<div class="field"><span class="f-ico" data-i="lock"></span><input type="password" id="newPass2" placeholder="تکرار رمز خصوصی" autocomplete="new-password"></div>' +
            '<button class="btn" id="savePass" type="button"><span data-i="shield"></span>' + (has ? 'تغییر رمز خصوصی' : 'ذخیره رمز خصوصی') + '</button>' +
            (has ? '<button class="link-btn" id="removePass" type="button">حذف رمز خصوصی</button>' : '') +
            '<div class="pass-msg" id="passMsg"></div>' +
            '<p class="pass-desc">رمز خصوصی فقط روی همین مرورگر و همین دستگاه ذخیره می‌شود.</p>' +
            '</div>';
        $('modalTitle').textContent = 'رمز خصوصی';
        $('modalClass').textContent = 'کلاس ' + currentClass;
        $('modalBody').innerHTML = html;
        $('modalBox').classList.add('narrow');
        $('infoModal').classList.add('open');
        if (window.DS && DS.refreshIcons) DS.refreshIcons();

        var msg = $('passMsg');
        function say(t, ok) {
            msg.textContent = t;
            msg.className = 'pass-msg ' + (ok ? 'ok' : 'err');
        }

        $('savePass').addEventListener('click', function () {
            var a = digits($('newPass').value);
            var b = digits($('newPass2').value);
            if (a.length < 4) { say('رمز خصوصی باید حداقل ۴ کاراکتر باشد.', false); return; }
            if (a === GLOBAL_PASS) { say('این همان رمز کلی است. یک رمز متفاوت انتخاب کنید.', false); return; }
            if (a !== b) { say('رمز و تکرار آن یکسان نیستند.', false); return; }
            hash(a).then(function (h) {
                store(K_PASS, h);
                say('رمز خصوصی ذخیره شد.', true);
                refreshHint();
                if (window.DS && DS.burst) DS.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
                setTimeout(closeModal, 1400);
            });
        });

        var rm = $('removePass');
        if (rm) {
            rm.addEventListener('click', function () {
                drop(K_PASS);
                refreshHint();
                say('رمز خصوصی حذف شد.', true);
                setTimeout(closeModal, 1100);
            });
        }
    }

    $('loginBtn').addEventListener('click', checkLogin);
    [nameIn, passIn].forEach(function (i) {
        i.addEventListener('keydown', function (e) { if (e.key === 'Enter') checkLogin(); });
    });

    $('eyeBtn').addEventListener('click', function () {
        var show = passIn.type === 'password';
        passIn.type = show ? 'text' : 'password';
        this.innerHTML = window.DS ? DS.icon(show ? 'eyeoff' : 'eye') : '';
        this.setAttribute('aria-label', show ? 'پنهان کردن رمز' : 'نمایش رمز');
    });

    $('logoutBtn').addEventListener('click', logout);
    $('cardSchedule').addEventListener('click', showSchedule);
    $('cardExtra').addEventListener('click', showExtra);
    $('cardPass').addEventListener('click', showPassword);
    $('cardGrades').addEventListener('click', function () { window.open('https://my.medu.ir', '_blank', 'noopener'); });

    $('modalClose').addEventListener('click', closeModal);
    $('infoModal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    var savedName = read(K_NAME);
    var savedClass = read(K_CLASS);
    if (savedName) nameIn.value = savedName;
    if (savedClass) classIn.value = savedClass;
    refreshHint();

    try {
        var sess = JSON.parse(sessionStorage.getItem(K_SESSION) || 'null');
        if (sess && sess.n && sess.c) enter(sess.n, sess.c, false);
    } catch (e) {}
})();

document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var c = e.target.closest ? e.target.closest('.panel-card[role="button"]') : null;
    if (c) {
        e.preventDefault();
        c.click();
    }
});
