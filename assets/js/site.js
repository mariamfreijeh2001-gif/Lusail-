/* ==========================================================================
   Lusail Corp — site behaviour.
   Header, mobile nav, language toggle, the home sector rail, contact form.
   ========================================================================== */

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- language ---------------------------------------------------
     Every translatable node carries its English text as content and its
     Arabic in data-ar. The first switch stores the English so it can come
     back. Placeholder-free: if a node has no data-ar it is left alone. */

  var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  var T = function (en, ar) { return lang === 'ar' ? ar : en; };

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';

    $$('[data-ar]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = l === 'ar' ? el.dataset.ar : el.dataset.en;
    });

    var btn = $('#langBtn');
    if (btn) {
      btn.textContent = l === 'ar' ? 'English' : 'عربي';
      btn.setAttribute('aria-label', l === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    }
    try { localStorage.setItem('lc-lang', l); } catch (e) {}
  }

  var langBtn = $('#langBtn');
  if (langBtn) langBtn.addEventListener('click', function () { setLang(lang === 'en' ? 'ar' : 'en'); });

  /* ---------- header ----------------------------------------------------- */

  var head = $('.site-head');
  if (head) {
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var menuBtn = $('#menuBtn'), nav = $('#nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- home: sector rail ------------------------------------------
     Move across the rail and the photograph, heading, line and link change.
     This replaces the folded-diamond graphic: the interaction is the same,
     but it now reveals the business rather than animating the logo. */

  var stage = $('#stage'), rail = $('#rail');
  if (stage && rail) {
    var shots = $$('.shot', stage);
    var buttons = $$('button', rail);
    var sNum = $('#sNum'), sName = $('#sName'), sDesc = $('#sDesc'), sLink = $('#sLink');
    var total = buttons.length;

    // The copy comes from data/site.js, emitted by the build as LC_SECTORS,
    // so sector wording lives in exactly one place.
    var SECTORS = window.LC_SECTORS || [];

    function pick(i) {
      var d = SECTORS[i];
      if (!d) return;

      shots.forEach(function (s) { s.classList.toggle('on', Number(s.dataset.i) === i); });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)); });

      sNum.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');

      sName.dataset.ar = d.sectorAr;
      sName.dataset.en = d.sector;
      sName.textContent = T(d.sector, d.sectorAr);

      sDesc.dataset.ar = d.shortAr;
      sDesc.dataset.en = d.short;
      sDesc.textContent = T(d.short, d.shortAr);

      sLink.setAttribute('href', '/companies/' + d.slug + '/');
    }

    rail.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (b) pick(Number(b.dataset.i));
    });
    rail.addEventListener('mouseover', function (e) {
      var b = e.target.closest('button'); if (b) pick(Number(b.dataset.i));
    });
    rail.addEventListener('focusin', function (e) {
      var b = e.target.closest('button'); if (b) pick(Number(b.dataset.i));
    });
  }

  /* ---------- contact form -----------------------------------------------
     Set CONTACT_ENDPOINT to a URL that accepts a JSON POST to make this live.
     While it is empty the form validates and confirms but sends nothing. */

  var CONTACT_ENDPOINT = '';

  var form = $('#form');
  if (form) {
    var status = $('#status');
    var say = function (msg, isError) {
      status.className = isError ? 'status err' : 'status';
      status.textContent = msg;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = $$('[required]', form).filter(function (x) {
        return !x.value.trim() || (x.type === 'email' && !/^\S+@\S+\.\S+$/.test(x.value));
      })[0];

      if (missing) {
        say(missing.type === 'email'
          ? T('Enter a valid email address, like name@company.qa.', 'أدخل بريداً إلكترونياً صحيحاً، مثل name@company.qa.')
          : T('Fill in your name, email and message to send.', 'أكمل الاسم والبريد الإلكتروني والرسالة للإرسال.'), true);
        missing.focus();
        return;
      }

      var sent = T('Message sent. We reply within two working days.', 'تم إرسال الرسالة. نرد خلال يومي عمل.');
      if (!CONTACT_ENDPOINT) { say(sent); form.reset(); return; }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      say(T('Sending…', 'جارٍ الإرسال…'));

      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });
      body.lang = lang;

      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        say(sent); form.reset();
      }).catch(function () {
        say(T('We could not send that. Please email info@lusailcorp.qa instead.',
              'تعذّر الإرسال. يرجى مراسلتنا على info@lusailcorp.qa.'), true);
      }).then(function () {
        btn.disabled = false;
      });
    });
  }

  /* ---------- boot -------------------------------------------------------- */

  var saved = 'en';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    saved = (q === 'ar' || q === 'en') ? q : (localStorage.getItem('lc-lang') || 'en');
  } catch (e) {}
  if (saved === 'ar') setLang('ar');
})();
